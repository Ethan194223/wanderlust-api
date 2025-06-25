// src/routes/auth.ts
import { Router } from 'express';
import * as Auth from '@/services/auth';

const router = Router();

/* POST /auth/register */
router.post('/register', async (req, res) => {
  const { email, password } = req.body as { email?: string; password?: string };
  if (!email || !password) return res.status(400).json({ error: 'Missing fields' });

  try {
    const user = await Auth.createUser(email, password);
    res.status(201).json(user);
  } catch {
    res.status(409).json({ error: 'User already exists' });
  }
});

/* POST /auth/login */
router.post('/login', async (req, res) => {
  const { email, password } = req.body as { email?: string; password?: string };
  const result = await Auth.authenticate(email, password);

  if (!result) return res.status(401).json({ error: 'Invalid credentials' });
  res.json(result);
});

export default router;




