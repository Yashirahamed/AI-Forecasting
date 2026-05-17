import { Request, Response } from 'express'
import { supabaseAdmin } from '../../lib/supabaseAdmin'
import { sendSuccess, sendError } from '../../utils/apiResponse'
import { WeatherAlert } from '../../types/alert.types'

// ─── GET /api/alerts — Fetch active alerts
// ─── POST /api/alerts — Create new alert (admin only in practice)
export default async function handler(req: Request, res: Response): Promise<void> {
  if (req.method === 'GET') {
    const { city } = req.query as { city?: string }

    let query = supabaseAdmin
      .from('alerts')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(20)

    if (city) query = query.eq('city', city)

    const { data, error } = await query

    if (error) { sendError(res, error.message, 500); return }
    sendSuccess(res, data)
    return
  }

  if (req.method === 'POST') {
    const alert = req.body as Omit<WeatherAlert, 'id' | 'created_at'>

    if (!alert.city || !alert.type || !alert.severity) {
      sendError(res, 'city, type, severity are required', 400)
      return
    }

    const { data, error } = await supabaseAdmin
      .from('alerts')
      .insert(alert)
      .select()
      .single()

    if (error) { sendError(res, error.message, 500); return }
    sendSuccess(res, data, 201)
    return
  }

  sendError(res, 'Method not allowed', 405)
}
