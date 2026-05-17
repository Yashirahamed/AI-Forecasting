import { Request, Response, NextFunction } from 'express'
import { adminAuth } from '../lib/firebaseAdmin'

export interface AuthenticatedRequest extends Request {
  user?: {
    uid: string
    email?: string
    name?: string
  }
}

/**
 * Middleware: Verify Firebase ID token from Authorization Bearer header.
 * Attaches decoded user info to req.user.
 */
export const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const authHeader = req.headers.authorization

  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized: Missing or invalid Authorization header.' })
    return
  }

  const idToken = authHeader.split('Bearer ')[1]

  try {
    const decodedToken = await adminAuth.verifyIdToken(idToken)
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      name: decodedToken.name,
    }
    next()
  } catch {
    res.status(401).json({ error: 'Unauthorized: Invalid or expired token.' })
  }
}
