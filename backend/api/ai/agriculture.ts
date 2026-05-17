import { Request, Response } from 'express'
import { askGroq } from '../../lib/groqClient'
import { sendSuccess, sendError } from '../../utils/apiResponse'

// ─── POST /api/ai/agriculture ─────────────────────────────────
export default async function handler(req: Request, res: Response): Promise<void> {
  if (req.method !== 'POST') {
    sendError(res, 'Method not allowed', 405)
    return
  }

  const { city, weather, cropType } = req.body as { city: string; weather: string; cropType: string }
  if (!city || !weather || !cropType) {
    sendError(res, 'city, weather, and cropType are required', 400)
    return
  }

  const systemPrompt = 'You are an agricultural AI expert who advises farmers based on weather conditions.'
  const userPrompt = `City: ${city}, Weather: ${weather}, Crop: ${cropType}. Give farming advice. JSON: { "advisory": "string", "irrigation": "string", "pest_risk": "string", "tips": ["string"], "harvest_advice": "string" }`

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
    sendError(res, err instanceof Error ? err.message : 'Agriculture tips failed', 500)
  }
}