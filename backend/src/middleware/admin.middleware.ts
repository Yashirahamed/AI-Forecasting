import { Request, Response, NextFunction } from 'express';

// Middleware to check for admin custom claim in Firebase token
export const admin = (req: any, res: Response, next: NextFunction) => {
  if (req.user && req.user.admin === true) {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as an admin' });
  }
};
