import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface JWTPayload {
  sub: string;                 // user id
  role: "operator" | "public";
  iat: number;
  exp: number;
}



export function jwtAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing token" });
  }

  const token = header.split(" ")[1];
  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JWTPayload;
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
