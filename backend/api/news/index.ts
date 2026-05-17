import { Request, Response } from 'express'
import axios from 'axios'
import { supabaseAdmin } from '../../lib/supabaseAdmin'
import { sendSuccess, sendError } from '../../utils/apiResponse'

// ─── GET /api/news ────────────────────────────────────────────
export default async function handler(req: Request, res: Response): Promise<void> {
  if (req.method !== 'GET') {
    sendError(res, 'Method not allowed', 405)
    return
  }

  const { category = 'weather' } = req.query as { category?: string }

  try {
    // ── Check cache (2hr TTL) ────────────────────────────────
    const { data: cached } = await supabaseAdmin
      .from('news_cache')
      .select('articles, cached_at')
      .eq('category', category)
      .single()

    if (cached) {
      const ageHours = (Date.now() - new Date(cached.cached_at as string).getTime()) / 3600000
      if (ageHours < 2) {
        sendSuccess(res, { articles: cached.articles, cached: true })
        return
      }
    }

    // ── Fetch from NewsAPI ───────────────────────────────────
    const newsRes = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q: `weather OR climate OR ${category}`,
        language: 'en',
        sortBy: 'publishedAt',
        pageSize: 20,
        apiKey: process.env.NEWS_API_KEY,
      },
    })

    const articles = newsRes.data.articles?.map((a: Record<string, string>) => ({
      title: a.title,
      description: a.description,
      url: a.url,
      urlToImage: a.urlToImage,
      publishedAt: a.publishedAt,
      source: a.source,
    })) ?? []

    // ── Upsert cache ─────────────────────────────────────────
    await supabaseAdmin.from('news_cache').upsert(
      { category, articles, cached_at: new Date().toISOString() },
      { onConflict: 'category' },
    )

    sendSuccess(res, { articles, cached: false })
  } catch (err) {
    sendError(res, err instanceof Error ? err.message : 'Failed to fetch news', 500)
  }
}
