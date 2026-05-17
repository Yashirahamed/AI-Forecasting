import { Request, Response } from 'express'
import { geocodeCity, getAirPollution } from '../../lib/weatherClient'
import { sendSuccess, sendError } from '../../utils/apiResponse'

// ─── GET /api/aqi/:city ───────────────────────────────────────
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
    const { lat, lon } = await geocodeCity(city)
    const response = await getAirPollution(lat, lon)
    const aqiData = response.data.list[0]

    const AQI_LABELS: Record<number, string> = {
      1: 'Good', 2: 'Fair', 3: 'Moderate', 4: 'Poor', 5: 'Very Poor',
    }

    sendSuccess(res, {
      city,
      lat,
      lon,
      aqi: aqiData.main.aqi,
      label: AQI_LABELS[aqiData.main.aqi] ?? 'Unknown',
      components: aqiData.components,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch AQI'
    sendError(res, message, 500)
  }
}
