// src/server.ts
import express from 'express';
import healthRouter from './routes/health';
import destinationsRouter from './routes/destinations';
import authRouter from './routes/auth';
import profileRouter from './routes/profile';
import 'dotenv/config'; 

const app = express();
app.use(express.json());

app.use('/health', healthRouter);
app.use('/destinations', destinationsRouter);
app.use('/auth', authRouter);
app.use('/profile', profileRouter);          // ◄─ NEW

app.get('/', (_req, res) => res.send('Welcome to Wanderlust API 🎉'));

const PORT = +(process.env.PORT || 4000);
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));

