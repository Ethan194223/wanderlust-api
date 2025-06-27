/* ----------------------------------------------------------------
 *  src/server.ts
 * ---------------------------------------------------------------- */
import 'dotenv/config';
import express from 'express';
import helmet  from 'helmet';
import morgan  from 'morgan';

import authRouter    from '@/routes/auth';    // ✅ guarded router
import hotelRouter   from '@/routes/hotels';
import profileRouter from '@/routes/profile';

const app = express();

/* ───────────── global middleware ───────────── */
app.use(helmet());
app.use(morgan(process.env.NODE_ENV === 'test' ? 'tiny' : 'dev'));
app.use(express.json());

/* ───────────── routes ───────────── */
app.use('/auth',    authRouter);     // ← mount exactly once
app.use('/hotels',  hotelRouter);
app.use('/profile', profileRouter);

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

/* ───────────── boot server (CLI) ───────────── */
if (require.main === module) {
  const port = process.env.PORT ?? 3000;
  app.listen(port, () =>
    console.log(`🚀  API running on http://localhost:${port}`),
  );
}

/* ───────────── export for tests ───────────── */
export default app;
