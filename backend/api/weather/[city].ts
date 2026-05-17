import { Request, Response } from 'express'
import { getCurrentWeather } from '../../lib/weatherClient'
import { supabaseAdmin } from '../../lib/supabaseAdmin'
import { sendSuccess, sendError } from '../../utils/apiResponse'

// ─── GET /api/weather/:city ───────────────────────────────────
export default async function handler(req: Request, res: Response): Promise<void> {
  if (req.method !== 'GET') {
    sendError(res, 'Method not allowed', 405)
    return
  }

  const city = (req.params.city ?? req.query.city) as string
  if (!city) {
    sendError(res, 'City parameter is required', 400)
    return
  }

  try {
    // ── Check cache first ────────────────────────────────────
    const { data: cached } = await supabaseAdmin
      .from('weather_cache')
      .select('data, cached_at')
      .eq('city', city.toLowerCase())
      .single()

    if (cached) {
      const ageMinutes = (Date.now() - new Date(cached.cached_at as string).getTime()) / 60000
      if (ageMinutes < 10) {
        sendSuccess(res, { ...cached.data, cached: true })
        return
      }
    }

    // ── Fetch fresh data ─────────────────────────────────────
    const response = await getCurrentWeather(city)
    const weatherData = response.data

    // ── Upsert into cache ────────────────────────────────────
    await supabaseAdmin.from('weather_cache').upsert(
      { city: city.toLowerCase(), data: weatherData, cached_at: new Date().toISOString() },
      { onConflict: 'city' },
    )

    sendSuccess(res, { ...weatherData, cached: false })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch weather'
    if (message.includes('404') || message.includes('city not found')) {
      sendError(res, `City "${city}" not found.`, 404)
    } else {
      sendError(res, message, 500)
    }
  }
}
