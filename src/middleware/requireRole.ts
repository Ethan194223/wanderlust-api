import { Request, Response, NextFunction } from 'express';

/** Your `requireAuth` (or JWT decode) middleware should already
 *  be attaching `user` to `req`.  Re-use the same type here.   */
export interface AuthRequest extends Request {
  user?: { id: string; role: string };
}

export default function requireRole(role: string) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ msg: 'forbidden' }); // 403 ⟵ not authorised
    }
    next();
  };
}
