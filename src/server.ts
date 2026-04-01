import app from './app';
import { ENV } from './config/env.config';
import { logger } from './utils/logger';

const server = app.listen(ENV.PORT, () => {
  logger.info('─────────────────────────────────────────────');
  logger.info('  CLARA Backend API — Iniciado correctamente');
  logger.info(`  Puerto  : ${ENV.PORT}`);
  logger.info(`  Entorno : ${ENV.NODE_ENV}`);
  logger.info(`  AI Svc  : ${ENV.AI_SERVICE.URL}`);
  logger.info('─────────────────────────────────────────────');
});

process.on('SIGTERM', () => {
  server.close(() => {
    logger.info('Servidor cerrado correctamente.');
    process.exit(0);
  });
});

process.on('uncaughtException', (error) => {
  logger.error('Excepción no capturada:', error);
  process.exit(1);
});

export default server;