// src/middleware/auth.ts
import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

/** Extend `Request` so downstream handlers know `userId` was injected */
export interface AuthedRequest extends Request {
  userId: string;
}

/** Express middleware – verify Bearer token, attach `req.userId`, else 401. */
export function requireAuth(
  req: AuthedRequest,
  res: Response,
  next: NextFunction,
) {
  const header = req.header('authorization');
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token' });
  }

  const token = header.slice(7);               // trim “Bearer ”
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { sub: string };
    req.userId = payload.sub;
    return next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}




