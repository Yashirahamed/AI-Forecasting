import { Request, Response } from 'express'
import axios from 'axios'
import { supabaseAdmin } from '../../lib/supabaseAdmin'
import { sendSuccess, sendError } from '../../utils/apiResponse'

// ─── GET /api/jobs/newsRefresh (Vercel Cron: 0 */2 * * *)
export default async function handler(_req: Request, res: Response): Promise<void> {
  const categories = ['weather', 'climate', 'agriculture', 'disaster']
  const refreshed: string[] = []

  try {
    for (const category of categories) {
      const newsRes = await axios.get('https://newsapi.org/v2/everything', {
        params: {
          q: category,
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

      await supabaseAdmin.from('news_cache').upsert(
        { category, articles, cached_at: new Date().toISOString() },
        { onConflict: 'category' },
      )
      refreshed.push(category)
    }

    sendSuccess(res, { refreshed })
  } catch (err) {
    sendError(res, err instanceof Error ? err.message : 'News refresh failed', 500)
  }
}
