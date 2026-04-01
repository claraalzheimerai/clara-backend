import { Request, Response, NextFunction } from 'express';
import { aiService } from '../services/ai.service';
import { deleteTempFile } from '../utils/file.utils';
import { logger } from '../utils/logger';
import { AnalysisResult } from '../models/analysis.model';
import { successResponse } from '../models/api.model';

export const healthCheck = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const aiHealth = await aiService.health();
    res.json({
      status: 'ok',
      backend: 'clara-backend',
      ai_service: aiHealth,
    });
  } catch (error) {
    res.status(503).json({
      status: 'degraded',
      backend: 'clara-backend',
      ai_service: 'no disponible',
    });
  }
};

export const uploadAndAnalyze = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const file = req.file;

  if (!file) {
    res.status(400).json({ error: 'No se recibió ningún archivo' });
    return;
  }

  try {
    logger.info(`Análisis iniciado: ${file.originalname}`);

    const result = await aiService.predict(file.path, file.originalname);

    // Emitir resultado por Socket.IO si está disponible
    const io = req.app.get('io');
    if (io) {
      io.emit('analysis:complete', result);
    }

    const enriched: AnalysisResult = {
      ...result,
      analyzed_at: new Date().toISOString(),
    };

    res.json(successResponse(enriched, {
      response_time: Date.now(),
    }));

  } catch (error) {
    next(error);
  } finally {
    // Eliminar archivo temporal siempre
    if (file?.path) {
      deleteTempFile(file.path);
    }
  }
};