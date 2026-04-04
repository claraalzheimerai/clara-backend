import 'express-async-errors';
import express from 'express';
import { corsMiddleware } from './middlewares/cors.middleware';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware';
import { securityHeaders, generalLimiter } from './middlewares/security.middleware';
import routes from './routes/index';
import { ENV } from './config/env.config';
import { logger } from './utils/logger';

const app = express();

app.use(securityHeaders);
app.use(generalLimiter);
app.use(corsMiddleware);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use(`/api/${ENV.API_VERSION}`, routes);

app.get('/', (_req, res) => {
  res.json({
    name: 'CLARA Backend API',
    version: ENV.API_VERSION,
    description: 'Clinical Learning Assistant for Radiology Analysis – USC 2026',
    docs: `/api/${ENV.API_VERSION}/analysis/health`,
  });
});

app.use(notFoundHandler);
app.use(errorHandler);

logger.info(`App configurada — Entorno: ${ENV.NODE_ENV}`);

export default app;