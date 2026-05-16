import { Request, Response, NextFunction } from 'express';
import { adminAuth } from '../config/firebase';

// Middleware to verify Firebase ID token from the Authorization header
export const protect = async (req: any, res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decodedToken = await adminAuth.verifyIdToken(token);
      req.user = decodedToken;
      next();
    } catch (error) {
      console.error('Error verifying Firebase token:', error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};
