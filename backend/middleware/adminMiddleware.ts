import { Response, NextFunction } from 'express'
import { supabaseAdmin } from '../lib/supabaseAdmin'
import { AuthenticatedRequest } from './authMiddleware'

/**
 * Middleware: Check if authenticated user has admin role in Supabase.
 * Must run AFTER authMiddleware.
 */
export const adminMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  if (!req.user?.uid) {
    res.status(401).json({ error: 'Unauthorized: No user found.' })
    return
  }

  const { data, error } = await supabaseAdmin
    .from('users')
    .select('role')
    .eq('firebase_uid', req.user.uid)
    .single()

  if (error || !data || data.role !== 'admin') {
    res.status(403).json({ error: 'Forbidden: Admin access required.' })
    return
  }

  next()
}
