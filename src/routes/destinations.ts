// src/routes/destinations.ts
import { Router } from 'express';

const router = Router();

router.get('/', (_req, res) => {
  res.json([
    { id: 1, name: 'Kyoto' },
    { id: 2, name: 'Zurich' }
  ]);
});

export default router;




