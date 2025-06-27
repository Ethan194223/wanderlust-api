/* ----------------------------------------------------------------
 *  src/server.ts  – main Express bootstrap
 * ---------------------------------------------------------------- */
import express        from 'express';
import morgan         from 'morgan';
import cors           from 'cors';
import path           from 'path';
import swaggerUi      from 'swagger-ui-express';
import YAML           from 'yamljs';

/* ---------- route modules -------------------------------------- */
import authRoutes      from '@/routes/auth';
import profileRoutes   from '@/routes/profile';
import hotelsRoutes    from '@/routes/hotels';
import destinationsRoutes from '@/routes/destinations';

/* ---------- init app ------------------------------------------- */
const app = express();
const PORT = process.env.PORT ?? 3000;

/* ---------- middlewares ---------------------------------------- */
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

/* ---------- healthcheck ---------------------------------------- */
app.get('/health', (_, res) => res.json({ status: 'ok', users: 10 }));

/* ---------- REST routes ---------------------------------------- */
app.use('/auth',        authRoutes);
app.use('/profile',     profileRoutes);
app.use('/hotels',      hotelsRoutes);
app.use('/destinations', destinationsRoutes);

/* ---------- Swagger UI ----------------------------------------- */
const swaggerDoc = YAML.load(
  path.join(__dirname, '../docs/swagger.yaml'),
);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

/* ---------- 404 fallback --------------------------------------- */
app.use((_, res) => res.status(404).json({ message: 'Not found' }));

/* ---------- global error handler ------------------------------- */
app.use(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error(err);
    if (err?.status === 422) {
      return res.status(422).json({ errors: err.errors ?? err });
    }
    res.status(500).json({ message: 'Internal server error' });
  },
);

/* ---------- start server --------------------------------------- */
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`🚀 API running on http://localhost:${PORT}`);
});

export default app;
