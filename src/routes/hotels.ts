/* ----------------------------------------------------------------
 *  src/routes/hotels.ts
 * ---------------------------------------------------------------- */
import { Router, Request, Response } from 'express';
import prisma from '@/lib/prisma';
import { z } from 'zod';

const router = Router();

/* ---------- helpers ---------- */
const intString = z
  .string()
  .regex(/^\d+$/);            // digits only, so "zero" fails validation

/* ---------- query schema ---------- */
const listQuery = z.object({
  page:  intString.default('1').transform(Number),
  limit: intString
    .default('20')
    .transform(Number)
    .refine(n => n >= 5 && n <= 50, {
      message: 'limit must be between 5 and 50',
    }),
  city:     z.string().optional(),
  priceMin: z
    .preprocess(v => (v === undefined ? undefined : Number(v)), z.number().positive())
    .optional(),
  priceMax: z
    .preprocess(v => (v === undefined ? undefined : Number(v)), z.number().positive())
    .optional(),
});

/* =================================================================
 *  GET /hotels — public list with pagination and filters
 * ================================================================= */
router.get('/', async (req: Request, res: Response) => {
  /* 1. validate query --------------------------------------------- */
  const parsed = listQuery.safeParse(req.query);
  if (!parsed.success) {
    return res.status(422).json({ errors: parsed.error.flatten() });
  }
  const { page, limit, city, priceMin, priceMax } = parsed.data;

  /* 2. build Prisma filter ---------------------------------------- */
  const where: any = {};
  if (city)      where.city = { equals: city, mode: 'insensitive' };
  if (priceMin)  where.pricePerNight = { gte: priceMin };
  if (priceMax)  where.pricePerNight = { ...(where.pricePerNight ?? {}), lte: priceMax };

  /* 3. query DB (count + paged rows) ------------------------------ */
  const [ total, data ] = await prisma.$transaction([
    prisma.hotel.count({ where }),
    prisma.hotel.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  /* 4. respond ----------------------------------------------------- */
  res.json({
    data,
    meta: { page, limit, total },
  });
});

export default router;

