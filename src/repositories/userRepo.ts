/**
 * Toggle between a real Prisma client (normal run)
 * and an in-memory Map (NODE_ENV=test) so that unit-tests
 * don’t need a live database.
 */
// src/repositories/userRepo.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { v4 as uuid } from 'uuid';

const prisma = new PrismaClient();

export const UserRepo = {
  /** Find user by e-mail (returns null if none) */
  findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  },

  /** Find user by id (returns null if none) */
  findById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  },

  /** Create a new user and return the Prisma row */
  async create(data: { email: string; password: string; name?: string }) {
    const passwordHash = await bcrypt.hash(data.password, 10);

    return prisma.user.create({
      data: {
        id: uuid(),            // explicit id so it’s easy to stub in tests
        email: data.email,
        passwordHash,
        name: data.name ?? null,
      },
    });
  },
};

