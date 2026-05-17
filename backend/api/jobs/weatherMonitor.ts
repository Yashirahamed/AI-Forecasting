import { Request, Response } from 'express'
import { getCurrentWeather } from '../../lib/weatherClient'
import { supabaseAdmin } from '../../lib/supabaseAdmin'
import { askGroq } from '../../lib/groqClient'
import { sendAlertEmail } from '../../lib/emailClient'
import { sendSuccess, sendError } from '../../utils/apiResponse'

const MONITORED_CITIES = [
  'Chennai', 'Mumbai', 'Delhi', 'Bangalore', 'Kolkata',
  'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur', 'Bhubaneswar',
]

// ─── GET /api/jobs/weatherMonitor (Vercel Cron: */30 * * * *)
export default async function handler(_req: Request, res: Response): Promise<void> {
  const alertsCreated: string[] = []

  try {
    for (const city of MONITORED_CITIES) {
      const weatherRes = await getCurrentWeather(city)
      const w = weatherRes.data

      const temp = w.main.temp
      const windSpeed = w.wind.speed
      const weatherId = w.weather[0].id

      let alertType: string | null = null
      let severity: string = 'LOW'

      // ── Detection logic ──────────────────────────────────
      if (temp >= 42) { alertType = 'heatwave'; severity = temp >= 45 ? 'CRITICAL' : 'HIGH' }
      else if (temp <= 0) { alertType = 'frost'; severity = 'MEDIUM' }
      else if (windSpeed >= 20) { alertType = 'storm'; severity = windSpeed >= 30 ? 'CRITICAL' : 'HIGH' }
      else if (weatherId >= 200 && weatherId < 232) { alertType = 'storm'; severity = 'HIGH' }
      else if (weatherId >= 500 && weatherId < 502) { alertType = 'flood'; severity = 'MEDIUM' }

      if (alertType) {
        // Get AI safety checklist
        const aiChecklist = await askGroq(
          'You are a disaster safety AI. Generate a safety checklist.',
          `Generate 5 safety tips for a ${severity} ${alertType} alert in ${city}. Return as JSON array of strings.`,
          512, 0.5,
        )

        let checklist: string[] = []
        try {
          const match = aiChecklist.match(/\[[\s\S]*\]/)
          checklist = match ? JSON.parse(match[0]) : []
        } catch { checklist = [] }

        const { data: alert } = await supabaseAdmin
          .from('alerts')
          .insert({
            city,
            type: alertType,
            severity,
            message: `${severity} ${alertType} detected in ${city}: ${w.weather[0].description}`,
            ai_checklist: checklist,
            is_active: true,
          })
          .select()
          .single()

        if (alert) alertsCreated.push(`${city}:${alertType}`)
      }
    }

    sendSuccess(res, { alertsCreated, checked: MONITORED_CITIES.length })
  } catch (err) {
    sendError(res, err instanceof Error ? err.message : 'Monitor job failed', 500)
  }
}
