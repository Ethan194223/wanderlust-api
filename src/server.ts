/* ----------------------------------------------------------------
 *  src/server.ts – main entry‑point for Wanderlust API
 * ---------------------------------------------------------------- */

console.log('▶ server file:', __filename);
console.log('▶ process pid:', process.pid);

// ──────────────── External deps ────────────────────────────────
import path from 'path';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { OpenAPIV3 } from 'openapi-types';      // ⭐ type‑safety for swaggerSpec
import listEndpoints from 'express-list-endpoints';

// ──────────────── Route modules ────────────────────────────────
import authRoutes    from './routes/auth';
import profileRoutes from './routes/profile';
import hotelsRoutes  from './routes/hotels';

// ──────────────── App bootstrap ───────────────────────────────
const app  = express();
const PORT = Number(process.env.PORT) || 3000;

/* ---------- GLOBAL middleware -------------------------------- */
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        imgSrc:     ["'self'", 'data:', 'https:'],
        styleSrc:   ["'self'", 'https:', "'unsafe-inline'"], // Swagger CSS
        scriptSrc:  ["'self'", "'unsafe-inline'"],           // Swagger boot script
      },
    },
  }),
);
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

/* ----------------------------------------------------------------
 *  Swagger UI (code‑first + YAML fragments)
 * ---------------------------------------------------------------- */
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title:       'Wanderlust API',
      version:     '1.0.0',
      description: 'Public hotel listings + operator back‑office',
    },
  },
  apis: [
    path.resolve(__dirname, './server.ts'),
    path.resolve(__dirname, './routes/**/*.ts'),
    path.resolve(__dirname, './docs/paths/**/*.yaml'),   // ← YAML fragments (e.g. hotels.yaml)
    path.resolve(__dirname, './docs/schemas.yaml'),
  ],
};

// Cast to OpenAPI v3 document so TypeScript recognises .paths, .components, …
const swaggerSpec = swaggerJsdoc(swaggerOptions) as unknown as OpenAPIV3.Document;
console.log('🟡  Merged paths:', Object.keys(swaggerSpec.paths || {}));

/* Disable CSP ONLY for /docs so Swagger’s inline scripts work */
app.use(
  '/docs',
  helmet({ contentSecurityPolicy: false }),
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec),
);
console.log('📑 Swagger UI available at /docs');

/* ----------------------------------------------------------------
 *  Health‑check  (also serves as an OpenAPI example)
 * ---------------------------------------------------------------- */
/**
 * @openapi
 * /ping:
 *   get:
 *     summary: Health‑check
 *     responses:
 *       '200': { description: pong }
 */
app.get('/ping', (_req, res) => res.json({ pong: true }));

// ──────────────── Real API routes ──────────────────────────────
app.use('/auth',    authRoutes);
app.use('/profile', profileRoutes);
app.use('/hotels',  hotelsRoutes);

// ---------- 404 fallback --------------------------------------
app.use((_req, res) => res.status(404).json({ message: 'Not found' }));

// ---------- Global error handler ------------------------------
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('💥 Unhandled error:', err);
  res.status(err?.status ?? 500).json({ message: err.message ?? 'Internal server error' });
});

// ---------- Start server --------------------------------------
app.listen(PORT, () => {
  console.log(`🚀 API running on http://localhost:${PORT}`);

  // Pretty‑print all mounted endpoints once everything is ready
  console.log('\n=== EXPRESS ROUTES ===');
  for (const ep of listEndpoints(app)) {
    console.log(`${ep.methods.join(',').padEnd(7)} ${ep.path}`);
  }
  console.log('======================\n');
});

export default app;
