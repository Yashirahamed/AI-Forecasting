import { Request, Response } from 'express'
import { supabaseAdmin } from '../../lib/supabaseAdmin'
import { AuthenticatedRequest } from '../../middleware/authMiddleware'
import { sendSuccess, sendError } from '../../utils/apiResponse'

// ─── GET /api/profile — Fetch profile
// ─── PUT /api/profile — Update profile
export default async function handler(req: AuthenticatedRequest & Request, res: Response): Promise<void> {
  const uid = req.user?.uid
  if (!uid) { sendError(res, 'Unauthorized', 401); return }

  if (req.method === 'GET') {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('firebase_uid', uid)
      .single()

    if (error) { sendError(res, error.message, 404); return }
    sendSuccess(res, data)
    return
  }

  if (req.method === 'PUT') {
    const { name, avatar_url, home_city, favourite_cities, preferred_unit, language } = req.body as {
      name?: string
      avatar_url?: string
      home_city?: string
      favourite_cities?: string[]
      preferred_unit?: string
      language?: string
    }

    const { data, error } = await supabaseAdmin
      .from('users')
      .update({ name, avatar_url, home_city, favourite_cities, preferred_unit, language })
      .eq('firebase_uid', uid)
      .select()
      .single()

    if (error) { sendError(res, error.message, 500); return }
    sendSuccess(res, data)
    return
  }

  sendError(res, 'Method not allowed', 405)
}
