import { Request, Response } from 'express'
import { askGroq } from '../../lib/groqClient'
import { sendSuccess, sendError } from '../../utils/apiResponse'

// ─── POST /api/ai/events ──────────────────────────────────────
export default async function handler(req: Request, res: Response): Promise<void> {
  if (req.method !== 'POST') {
    sendError(res, 'Method not allowed', 405)
    return
  }

  const { eventName, city, eventDate, eventType } = req.body as {
    eventName: string
    city: string
    eventDate: string
    eventType: string
  }
  if (!eventName || !city || !eventDate || !eventType) {
    sendError(res, 'eventName, city, eventDate, and eventType are required', 400)
    return
  }

  const systemPrompt = 'You are an event planning AI who assesses weather suitability for outdoor events.'
  const userPrompt = `Event: ${eventName}, City: ${city}, Date: ${eventDate}, Type: ${eventType}. Generate weather risk report. JSON: { "risk_score": 5, "go_no_go": "string", "conditions": "string", "contingencies": ["string"], "alternative_dates": ["string"] }`

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
    sendError(res, err instanceof Error ? err.message : 'Event weather report failed', 500)
  }
}