// src/routes/hotels.ts
import { Router } from 'express';
import { z } from 'zod';
import { Prisma } from '@prisma/client';

import requireAuth from '../middleware/requireAuth';
import { HotelRepo } from '../repositories/hotelRepo';

const router = Router();

/* ────────────────── validation schemas ────────────────── */
const hotelBody = z.object({
  name: z.string().min(3),
  description: z.string().nullable().default(null),          // nullable ↔ Prisma type
  city: z.string(),
  country: z.string(),
  pricePerNight: z
    .coerce.number()
    .positive()
    .transform(v => new Prisma.Decimal(v)),                  // number → Decimal
  availableFrom: z.coerce.date(),
  availableTo: z.coerce.date(),
});

const idParam = z.string().uuid();

/* ────────────────────── helpers ────────────────────────── */
function parseId(id: string) {
  const parsed = idParam.safeParse(id);
  if (!parsed.success) throw Object.assign(new Error('Invalid hotel id'), { status: 400 });
  return parsed.data;
}

function buildListFilter(q: Record<string, unknown>) {
  const { city, country, minPrice, maxPrice } = q;
  const where: Record<string, any> = {};

  if (city) where.city = city as string;
  if (country) where.country = country as string;
  if (minPrice || maxPrice) {
    where.pricePerNight = {
      ...(minPrice ? { gte: new Prisma.Decimal(minPrice as string) } : {}),
      ...(maxPrice ? { lte: new Prisma.Decimal(maxPrice as string) } : {}),
    };
  }
  return where;
}

/* ────────────────────── CREATE ─────────────────────────── */
router.post('/', requireAuth, async (req, res, next) => {
  try {
    const data = hotelBody.parse(req.body);
    const hotel = await HotelRepo.create(data);
    res.status(201).json(hotel);
  } catch (err) {
    next(err);
  }
});

/* ────────────────────── LIST ───────────────────────────── */
router.get('/', async (req, res, next) => {
  try {
    const hotels = await HotelRepo.list(buildListFilter(req.query));
    res.json(hotels);
  } catch (err) {
    next(err);
  }
});

/* ────────────────────── READ ONE ───────────────────────── */
router.get('/:id', async (req, res, next) => {
  try {
    const id = parseId(req.params.id);
    const hotel = await HotelRepo.findById(id);
    if (!hotel) return res.status(404).json({ msg: 'Hotel not found' });
    res.json(hotel);
  } catch (err) {
    next(err);
  }
});

/* ────────────────────── UPDATE ─────────────────────────── */
router.patch('/:id', requireAuth, async (req, res, next) => {
  try {
    const id = parseId(req.params.id);
    const data = hotelBody.partial().parse(req.body);
    const hotel = await HotelRepo.update(id, data);
    res.json(hotel);
  } catch (err) {
    next(err);
  }
});

/* ────────────────────── DELETE ─────────────────────────── */
router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    const id = parseId(req.params.id);
    const deleted = await HotelRepo.remove(id);           // returns count
    if (deleted === 0) return res.status(404).json({ msg: 'Hotel not found' });
    res.status(204).end();                                // success, no body
  } catch (err) {
    next(err);
  }
});

export default router;
