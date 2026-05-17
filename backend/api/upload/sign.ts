import { Request, Response } from 'express'
import { generateSignature } from '../../lib/cloudinaryClient'
import { sendSuccess, sendError } from '../../utils/apiResponse'

// ─── POST /api/upload/sign ────────────────────────────────────
export default async function handler(req: Request, res: Response): Promise<void> {
  if (req.method !== 'POST') {
    sendError(res, 'Method not allowed', 405)
    return
  }

  const { folder = 'uploads' } = req.body as { folder?: string }

  const ALLOWED_FOLDERS = ['avatars', 'itineraries', 'community', 'badges']
  if (!ALLOWED_FOLDERS.includes(folder)) {
    sendError(res, `Folder must be one of: ${ALLOWED_FOLDERS.join(', ')}`, 400)
    return
  }

  try {
    const signatureData = generateSignature(folder)
    sendSuccess(res, signatureData)
  } catch (err) {
    sendError(res, err instanceof Error ? err.message : 'Signature generation failed', 500)
  }
}
