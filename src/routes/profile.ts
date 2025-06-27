// src/routes/profile.ts
import { Router }   from 'express';
import { prisma }   from '../utils/prisma';
import requireAuth, { AuthRequest } from '../middleware/requireAuth';

const router = Router();

/** GET /profile/me – return the authenticated user’s public data */
router.get('/me', requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where:  { id: req.user!.id },
      select: { id: true, email: true, name: true },   // never leak hash!
    });

    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json(user);                                    // 200
  } catch (err) {
    next(err);                                         // → 500 handler
  }
});

export default router;

