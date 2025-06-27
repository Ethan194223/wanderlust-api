/* ----------------------------------------------------------------
 *  src/routes/auth.ts
 * ---------------------------------------------------------------- */
import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import prisma from '@/lib/prisma';

/* ---------- types ---------- */
export interface JWTPayload {
  sub: string;
  role: 'PUBLIC' | 'OPERATOR';
}

/* ---------- constants ---------- */
const router      = Router();
const JWT_SECRET  = process.env.JWT_SECRET  as string;
const SIGNUP_CODE = process.env.SIGNUP_CODE as string;

/* ---------- schemas ---------- */
const registerSchema = z.object({
  email:      z.string().email(),
  password:   z.string().min(8),
  name:       z.string().optional(),      // optional display name
  signupCode: z.string().optional(),      // optional operator code
});

const loginSchema = z.object({
  email:    z.string().email(),
  password: z.string().min(8),
});

/* ---------- helpers ---------- */
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
  /* 1. validate body ------------------------------------------------ */
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(422).json({ errors: parsed.error.flatten() });
  }
  const { email, password, name, signupCode } = parsed.data;

  /* 2. signup-code gate -------------------------------------------- */
  if (signupCode && signupCode !== SIGNUP_CODE) {
    return res.status(403).json({ message: 'Invalid sign-up code' });
  }
  const role = signupCode === SIGNUP_CODE ? 'OPERATOR' : 'PUBLIC';

  /* 3. create user -------------------------------------------------- */
  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: { email, passwordHash, role, name },
  });

  /* 4. respond ------------------------------------------------------ */
  return res.status(201).json({
    id: user.id,
    email: user.email,
  });
});

/* =================================================================
 *  POST /auth/login
 * ================================================================= */
router.post('/login', async (req: Request, res: Response) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(422).json({ errors: parsed.error.flatten() });
  }
  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ message: 'Login failed' });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ message: 'Login failed' });

  const token = signToken(user.id, user.role);
  return res.status(200).json({ token });
});

export default router;

