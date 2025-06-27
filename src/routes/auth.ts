/* ----------------------------------------------------------------
 *  src/routes/auth.ts   (debug version)
 * ---------------------------------------------------------------- */
import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

import prisma from '@/lib/prisma';

export interface JWTPayload {
  sub: string;
  role: 'PUBLIC' | 'OPERATOR';
}

const router = Router();
const JWT_SECRET  = process.env.JWT_SECRET  as string;
const SIGNUP_CODE = process.env.SIGNUP_CODE as string;

/* ---------- Schemas ---------- */
const registerSchema = z.object({
  email:      z.string().email(),
  password:   z.string().min(8),
  signupCode: z.string(),
});

const loginSchema = z.object({
  email:    z.string().email(),
  password: z.string().min(8),
});

/* ---------- Helper ---------- */
function signToken(
  id: string,
  role: 'PUBLIC' | 'OPERATOR',
  ttl: jwt.SignOptions['expiresIn'] = '2h'
) {
  return jwt.sign({ sub: id, role }, JWT_SECRET as jwt.Secret, {
    expiresIn: ttl,
  });
}

/* =================================================================
 *  POST /auth/register
 * ================================================================= */
router.post('/register', async (req: Request, res: Response) => {
  console.log('👉 guarded /register handler');    //  ← TEMP debug line

  const parse = registerSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(422).json({ errors: parse.error.flatten() });
  }
  const { email, password, signupCode } = parse.data;

  // sign-up-code gate
  if (signupCode !== SIGNUP_CODE) {
    return res.status(403).json({ message: 'Invalid sign-up code' });
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: { email, passwordHash, role: 'OPERATOR' },
  });

  const token = signToken(user.id, 'OPERATOR');
  return res.status(201).json({ token });
});

/* =================================================================
 *  POST /auth/login
 * ================================================================= */
router.post('/login', async (req: Request, res: Response) => {
  const parse = loginSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(422).json({ errors: parse.error.flatten() });
  }
  const { email, password } = parse.data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ message: 'Login failed' });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ message: 'Login failed' });

  const token = signToken(user.id, user.role);
  return res.status(200).json({ token });
});

export default router;


