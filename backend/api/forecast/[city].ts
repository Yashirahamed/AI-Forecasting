import { Request, Response } from 'express'
import { getWeatherForecast } from '../../lib/weatherClient'
import { sendSuccess, sendError } from '../../utils/apiResponse'

// ─── GET /api/forecast/:city ──────────────────────────────────
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
    const response = await getWeatherForecast(city)
    sendSuccess(res, response.data)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch forecast'
    sendError(res, message, 500)
  }
}
