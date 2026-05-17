import { Request, Response } from 'express'
import { askGroq } from '../../lib/groqClient'
import { sendSuccess, sendError } from '../../utils/apiResponse'

// ─── POST /api/ai/sport ───────────────────────────────────────
export default async function handler(req: Request, res: Response): Promise<void> {
  if (req.method !== 'POST') {
    sendError(res, 'Method not allowed', 405)
    return
  }

  const { city, weather, sport } = req.body as { city: string; weather: string; sport: string }
  if (!city || !weather || !sport) {
    sendError(res, 'city, weather, and sport are required', 400)
    return
  }

  const systemPrompt = 'You are a sports coach and meteorologist who advises on outdoor sports based on weather.'
  const userPrompt = `City: ${city}, Weather: ${weather}, Sport: ${sport}. Advise on safety and performance. JSON: { "safe": true, "rating": "string", "tips": ["string"], "best_time": "string", "alternatives": ["string"] }`

  try {
    const raw = await askGroq(systemPrompt, userPrompt, 1024, 0.7)
    let result: unknown
    try {
      const jsonMatch = raw.match(/\{[\s\S]*\}/)
      result = jsonMatch ? JSON.parse(jsonMatch[0]) : { raw }
    } catch {
      result = { raw }
    }
    sendSuccess(res, result)
  } catch (err) {
    sendError(res, err instanceof Error ? err.message : 'Sport advice failed', 500)
  }
}