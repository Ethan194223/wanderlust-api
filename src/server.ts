// src/server.ts
import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import helmet   from 'helmet';
import morgan   from 'morgan';

import authRoutes    from './routes/auth';
import hotelRoutes   from './routes/hotels';
import profileRoutes from './routes/profile';

const app = express();

/* ───────────── global middleware ───────────── */
app.use(helmet());
app.use(morgan(process.env.NODE_ENV === 'test' ? 'tiny' : 'dev'));
app.use(express.json());

/* ───────────── routes ───────────── */
app.use('/auth',    authRoutes);
app.use('/hotels',  hotelRoutes);
app.use('/profile', profileRoutes);      // mounted once

/* ───────────── 404 fallback ───────────── */
app.use((_req, res) => {
  res.status(404).json({ msg: 'Route not found' });
});

/* ───────────── central error handler ───────────── */
app.use(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err);
    const status = err.status ?? 500;
    res.status(status).json({ msg: err.msg ?? 'Internal Server Error' });
  },
);

/* ───────────── boot server (CLI) ───────────── */
if (require.main === module) {
  const port = process.env.PORT ?? 3000;
  app.listen(port, () =>
    console.log(`🚀  API running on http://localhost:${port}`),
  );
}

/* ───────────── export for tests ───────────── */
export default app;

