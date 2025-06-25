// src/services/auth.ts
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';          // ◄─ default import (NOT { prisma })
import type { User } from '@prisma/client';

/* ------------------------------------------------------------------ */
/* CONFIG                                                             */
/* ------------------------------------------------------------------ */

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
const SALT_ROUNDS = 12;

/* ------------------------------------------------------------------ */
/* PUBLIC API                                                         */
/* ------------------------------------------------------------------ */

/** Create a new user and return the “safe” user object. */
export async function createUser(email: string, password: string) {
  const hash = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: { email, passwordHash: hash },
  });

  return omitHash(user);
}

/** Verify credentials. Returns `{ user, token }` on success, otherwise `null`. */
export async function authenticate(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return null;

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return null;

  return {
    user: omitHash(user),
    token: signJwt(user.id),
  };
}

/** Return a “safe” user (or `null`) by primary-key ID. */
export async function getMe(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, role: true, createdAt: true },
  });
}

/* ------------------------------------------------------------------ */
/* HELPERS                                                            */
/* ------------------------------------------------------------------ */

function signJwt(sub: string) {
  return jwt.sign({ sub }, JWT_SECRET, { expiresIn: '1h' });
}

type SafeUser = Pick<User, 'id' | 'email' | 'role' | 'createdAt'>;

function omitHash(user: User): SafeUser {
  /* strip the hash before returning the record */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { passwordHash, ...safe } = user;
  return safe;
}

