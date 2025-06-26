import { Router } from 'express';
import requireAuth from '../middleware/requireAuth';
import { HotelRepo } from '../repositories/hotelRepo';
import { z } from 'zod';

const router = Router();

/* ───────────── validation schemas ───────────── */
const hotelBody = z.object({
  name: z.string().min(3),
  description: z.string().optional(),
  city: z.string(),
  country: z.string(),
  pricePerNight: z.coerce.number().positive(),
  availableFrom: z.coerce.date(),
  availableTo: z.coerce.date(),
});

/* ───────────── CRUD ───────────── */
// CREATE (protected)
router.post('/', requireAuth, async (req, res, next) => {
  try {
    const data = hotelBody.parse(req.body);
    const hotel = await HotelRepo.create(data);
    res.status(201).json(hotel);
  } catch (err) {
    next(err);
  }
});

// LIST (public, with basic filters ?city=&country=&minPrice=&maxPrice=)
router.get('/', async (req, res, next) => {
  try {
    const { city, country, minPrice, maxPrice } = req.query;
    const hotels = await HotelRepo.list({
      city: city as string | undefined,
      country: country as string | undefined,
      pricePerNight: {
        gte: minPrice ? Number(minPrice) : undefined,
        lte: maxPrice ? Number(maxPrice) : undefined,
      },
    });
    res.json(hotels);
  } catch (err) {
    next(err);
  }
});

// READ one
router.get('/:id', async (req, res, next) => {
  try {
    const hotel = await HotelRepo.findById(req.params.id);
    if (!hotel) return res.status(404).json({ msg: 'Not found' });
    res.json(hotel);
  } catch (err) {
    next(err);
  }
});

// UPDATE (protected)
router.patch('/:id', requireAuth, async (req, res, next) => {
  try {
    const data = hotelBody.partial().parse(req.body);
    const hotel = await HotelRepo.update(req.params.id, data);
    res.json(hotel);
  } catch (err) {
    next(err);
  }
});

// DELETE (protected)
router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    await HotelRepo.remove(req.params.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

export default router;
