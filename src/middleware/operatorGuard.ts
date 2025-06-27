import { Request, Response, NextFunction } from "express";

export function operatorGuard(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ message: "Missing token" });
  }
  if (req.user.role !== "operator") {
    return res.status(403).json({ message: "Forbidden – operator only" });
  }
  next();
}
