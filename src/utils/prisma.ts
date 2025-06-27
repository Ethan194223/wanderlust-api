// src/utils/prisma.ts
import { PrismaClient } from '@prisma/client';

// 1️⃣ create *one* PrismaClient for the whole app
const prismaSingleton = new PrismaClient();

// 2️⃣ export it so every repo can reuse it
export const prisma = prismaSingleton;

//Tip If  want automatic disconnect on process-exit add:
if (process.env.NODE_ENV !== 'production') {
  process.once('SIGINT', () => prisma.$disconnect());
  process.once('SIGTERM', () => prisma.$disconnect());
}
