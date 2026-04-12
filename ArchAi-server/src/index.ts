import 'dotenv/config';
import cors from 'cors';
import express, { type Request, type Response } from 'express';
import architectureRoutes from './routes/architecture.routes.js';
import { errorHandler, notFoundHandler } from './middleware/error.handler.js';

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(cors({
  origin: process.env.CLIENT_URL ?? 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json());

app.get('/', (_req: Request, res: Response) => {
  res.json({
    name: 'ArchiFlow API',
    version: '1.0.0',
    endpoints: {
      'POST /api/generate-architecture': 'Generate AI-powered system architecture',
    },
  });
});

app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api', architectureRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`[ArchiFlow] Server running on http://localhost:${PORT}`);
});

export default app;
