import { Request, Response } from 'express'
import { askGroq } from '../../lib/groqClient'
import { sendSuccess, sendError } from '../../utils/apiResponse'

// ─── POST /api/ai/packing ─────────────────────────────────────
export default async function handler(req: Request, res: Response): Promise<void> {
  if (req.method !== 'POST') {
    sendError(res, 'Method not allowed', 405)
    return
  }

  const { destination, tripType, duration, weather } = req.body as {
    destination: string
    tripType: string
    duration: number
    weather: string
  }
  if (!destination || !tripType || !duration || !weather) {
    sendError(res, 'destination, tripType, duration, and weather are required', 400)
    return
  }

  const systemPrompt = 'You are a travel packing expert who creates comprehensive packing lists based on destination and weather.'
  const userPrompt = `Destination: ${destination}, Trip Type: ${tripType}, Duration: ${duration} days, Weather: ${weather}. Generate packing list. JSON: { "categories": [{"name": "string", "items": [{"item": "string", "essential": true}]}], "tips": ["string"] }`

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
    sendError(res, err instanceof Error ? err.message : 'Packing list generation failed', 500)
  }
}