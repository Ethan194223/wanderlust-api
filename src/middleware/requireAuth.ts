// src/middleware/requireAuth.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: { id: string; email: string; name: string };
}

export default function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const header = req.header('authorization') ?? '';
  const token  = header.replace(/^bearer /i, '');

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as
      { sub: string; email: string; name: string };

    // attach a *minimal* user object – never the password hash
    (req as AuthRequest).user = {
      id:    payload.sub,
      email: payload.email,
      name:  payload.name,
    };

    next();
  } catch {
    res.status(401).json({ msg: 'Missing Bearer token' });
  }
}



