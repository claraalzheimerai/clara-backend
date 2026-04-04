import http from 'http';
import app from './app';
import { ENV } from './config/env.config';
import { logger } from './utils/logger';
import { initSocketIO } from './socket';

// Crear servidor HTTP manualmente para compartirlo con Socket.IO
const server = http.createServer(app);

// Inicializar Socket.IO
const io = initSocketIO(server);

// Exponer io en la app para que los controllers lo usen
app.set('io', io);

server.listen(ENV.PORT, () => {
  logger.info('─────────────────────────────────────────────');
  logger.info('  CLARA Backend API — Iniciado correctamente');
  logger.info(`  Puerto  : ${ENV.PORT}`);
  logger.info(`  Entorno : ${ENV.NODE_ENV}`);
  logger.info(`  AI Svc  : ${ENV.AI_SERVICE.URL}`);
  logger.info(`  Socket  : habilitado`);
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