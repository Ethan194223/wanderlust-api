import { Request, Response, NextFunction } from 'express';

/**
 * Allows requests that come from a JWT whose payload contains role==="OPERATOR".
 * Must be mounted **after** jwtAuth (so req.user is already populated).
 */
export function operatorGuard(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.user) {
    // jwtAuth wasn’t called or token missing
    return res.status(401).json({ message: 'Missing or invalid token' });
  }

  if (req.user.role !== 'OPERATOR') {
    return res.status(403).json({ message: 'Forbidden – operator only' });
  }

  next(); // authorised ✅
}
