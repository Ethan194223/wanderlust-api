// src/routes/health.ts
import { Router } from 'express';
import prisma from '@/lib/prisma';   // ◄─ default import

const router = Router();

/* GET /health → { status:"ok", users:<count> } */
router.get('/', async (_req, res) => {
  const users = await prisma.user.count();      // simple DB hit
  res.json({ status: 'ok', users });
});

export default router;

