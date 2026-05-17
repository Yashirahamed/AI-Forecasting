import { Request, Response } from 'express'
import { askGroq } from '../../lib/groqClient'
import { sendSuccess, sendError } from '../../utils/apiResponse'

// ─── POST /api/ai/outfit ──────────────────────────────────────
export default async function handler(req: Request, res: Response): Promise<void> {
  if (req.method !== 'POST') {
    sendError(res, 'Method not allowed', 405)
    return
  }

  const { city, weather } = req.body as { city: string; weather: string }
  if (!city || !weather) {
    sendError(res, 'city and weather are required', 400)
    return
  }

  const systemPrompt = 'You are a fashion AI expert who suggests weather-appropriate outfits.'
  const userPrompt = `City: ${city}, Weather: ${weather}. Suggest 3 outfit options. JSON: { "outfits": [{"name": "string", "items": ["string"], "color_palette": "string"}], "tip": "string" }`

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
    sendError(res, err instanceof Error ? err.message : 'Outfit suggestions failed', 500)
  }
}