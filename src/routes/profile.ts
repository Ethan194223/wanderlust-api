// src/routes/profile.ts
import { Router } from 'express';
import * as Auth from '@/services/auth';
import { requireAuth, AuthedRequest } from '@/middleware/auth';

const router = Router();

/* GET /profile/me – return the authenticated user object */
router.get('/me', requireAuth, async (req: AuthedRequest, res) => {
  try {
    const user = await Auth.getMe(req.userId);
    if (!user) return res.status(404).json({ error: 'Not found' });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
