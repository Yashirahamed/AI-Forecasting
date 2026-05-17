import { Request, Response } from 'express'
import { askGroq } from '../../lib/groqClient'
import { supabaseAdmin } from '../../lib/supabaseAdmin'
import { AuthenticatedRequest } from '../../middleware/authMiddleware'
import { sendSuccess, sendError } from '../../utils/apiResponse'

// ─── POST /api/ai/itinerary ───────────────────────────────────
export default async function handler(req: AuthenticatedRequest & Request, res: Response): Promise<void> {
  if (req.method !== 'POST') {
    sendError(res, 'Method not allowed', 405)
    return
  }

  const { destination, startDate, endDate, tripType, weatherSnapshot } = req.body as {
    destination: string
    startDate: string
    endDate: string
    tripType: string
    weatherSnapshot?: object
  }

  if (!destination || !startDate || !endDate) {
    sendError(res, 'destination, startDate, endDate are required', 400)
    return
  }

  const systemPrompt = `You are an expert AI travel planner with deep knowledge of weather patterns, local attractions, and cultural experiences. 
Generate detailed, weather-aware day-by-day itineraries in JSON format.`

  const userPrompt = `Create a detailed travel itinerary for:
- Destination: ${destination}
- Dates: ${startDate} to ${endDate}
- Trip Type: ${tripType ?? 'leisure'}
${weatherSnapshot ? `- Current Weather: ${JSON.stringify(weatherSnapshot)}` : ''}

Return a JSON object with this exact structure:
{
  "overview": "2-3 sentence trip overview",
  "days": [
    {
      "day": 1,
      "date": "${startDate}",
      "title": "Day title",
      "morning": { "activity": "...", "place": "...", "tip": "..." },
      "afternoon": { "activity": "...", "place": "...", "tip": "..." },
      "evening": { "activity": "...", "place": "...", "tip": "..." },
      "weatherNote": "Weather tip for the day",
      "meals": ["Breakfast suggestion", "Lunch spot", "Dinner recommendation"]
    }
  ],
  "packingTips": ["tip1", "tip2"],
  "weatherWarnings": ["warning if any"],
  "estimatedBudget": "budget range"
}`

  try {
    const raw = await askGroq(systemPrompt, userPrompt, 2048, 0.7)
    
    // Try to parse as JSON
    let plan: object
    try {
      const jsonMatch = raw.match(/\{[\s\S]*\}/)
      plan = jsonMatch ? JSON.parse(jsonMatch[0]) : { raw }
    } catch {
      plan = { raw }
    }

    // Save to Supabase if authenticated
    if (req.user?.uid) {
      await supabaseAdmin.from('itineraries').insert({
        user_id: req.user.uid,
        destination,
        start_date: startDate,
        end_date: endDate,
        trip_type: tripType,
        plan,
        weather_snapshot: weatherSnapshot ?? null,
      })
    }

    sendSuccess(res, { result: plan })
  } catch (err) {
    sendError(res, err instanceof Error ? err.message : 'Itinerary generation failed', 500)
  }
}
