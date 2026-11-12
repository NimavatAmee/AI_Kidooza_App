import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { authRouter } from './modules/auth/auth.routes';
import { childrenRouter } from './modules/children/children.routes';
import { charactersRouter } from './modules/characters/characters.routes';
import { conversationsRouter } from './modules/conversations/conversations.routes';
import { analyticsRouter } from './modules/analytics/analytics.routes';
import { errorHandler } from './middleware/errorHandler';

export const createApp = (): Application => {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());

  // Health Check Endpoint
  app.get('/health', (req: Request, res: Response) => {
    res.json({
      status: 'healthy',
      app: 'Kidooza AI Companion Backend',
      phase: 3,
      compliance: 'DPDPA 2023 Compliant (No raw audio stored)',
      timestamp: new Date().toISOString(),
    });
  });

  // API Routes
  app.use('/api/auth', authRouter);
  app.use('/api/children', childrenRouter);
  app.use('/api/characters', charactersRouter);
  app.use('/api/conversations', conversationsRouter);
  app.use('/api/analytics', analyticsRouter);

  // 404 Not Found
  app.use((req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      error: `Endpoint not found: ${req.method} ${req.originalUrl}`,
    });
  });

  // Error Handler
  app.use(errorHandler);

  return app;
};
