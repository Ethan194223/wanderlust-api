// src/routes/profile.ts
// src/routes/profile.ts
import { Router } from 'express';
import requireAuth from '../middleware/requireAuth';
import { UserRepo } from '../repositories/userRepo';

const router = Router();

/* ───────────── GET /profile/me ───────────── */
/**
 * @openapi
 * /profile/me:
 *   get:
 *     summary: Get the current user profile
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The logged-in user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 email:
 *                   type: string
 *                   format: email
 *                 name:
 *                   type: string
 *       401:
 *         description: Invalid or missing token
 *       404:
 *         description: User not found
 */
router.get('/me', requireAuth, async (req, res) => {
  const user = await UserRepo.findById(req.userId!);
  if (!user) return res.status(404).json({ msg: 'User not found' });

  // name exists in the in-memory user but not in the Prisma user
  const payload: { email: string; name?: string } = { email: user.email };
  if ('name' in user && user.name) payload.name = user.name;

  res.json(payload);
});

export default router;