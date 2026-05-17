import { Request, Response } from 'express'
import { askGroq } from '../../lib/groqClient'
import { sendSuccess, sendError } from '../../utils/apiResponse'

// ─── POST /api/ai/flight ──────────────────────────────────────
export default async function handler(req: Request, res: Response): Promise<void> {
  if (req.method !== 'POST') {
    sendError(res, 'Method not allowed', 405)
    return
  }

  const { origin, destination, date } = req.body as { origin: string; destination: string; date: string }
  if (!origin || !destination || !date) {
    sendError(res, 'origin, destination, and date are required', 400)
    return
  }

  const systemPrompt = 'You are an aviation weather expert who assesses flight safety based on weather conditions.'
  const userPrompt = `Route: ${origin} to ${destination}, Date: ${date}. Analyze flight risk. JSON: { "risk_level": "string", "risk_score": 50, "factors": ["string"], "recommendations": ["string"], "best_window": "string" }`

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
    sendError(res, err instanceof Error ? err.message : 'Flight risk analysis failed', 500)
  }
}