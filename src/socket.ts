import { Server as HTTPServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import { ENV } from './config/env.config';
import { logger } from './utils/logger';

export const initSocketIO = (httpServer: HTTPServer): SocketServer => {
  const io = new SocketServer(httpServer, {
    cors: {
      origin: ENV.CORS.ALLOWED_ORIGINS,
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    logger.info(`Socket conectado: ${socket.id}`);

    socket.on('analysis:subscribe', (analysisId: string) => {
      socket.join(`analysis:${analysisId}`);
    });

    socket.on('disconnect', () => {
      logger.info(`Socket desconectado: ${socket.id}`);
    });
  });

  return io;
};