import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { aiService } from '../services/ai.service';
import { deleteTempFile } from '../utils/file.utils';
import { logger } from '../utils/logger';
import { AnalysisResult } from '../models/analysis.model';
import { successResponse } from '../models/api.model';
import { SOCKET_EVENTS, emitToAll } from '../socket';

export const uploadAndAnalyze = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const file       = req.file;
  const analysisId = uuidv4();
  const io         = req.app.get('io');

  if (!file) {
    res.status(400).json({ error: 'No se recibió ningún archivo' });
    return;
  }

  try {
    logger.info(`Análisis iniciado: ${file.originalname} | id: ${analysisId}`);

    _emitProgress(io, analysisId, file.originalname);

    const result = await aiService.predict(file.path, file.originalname);

    const enriched: AnalysisResult = {
      ...result,
      analyzed_at: new Date().toISOString(),
    };

    if (io) {
      emitToAll(io, SOCKET_EVENTS.ANALYSIS_COMPLETE, {
        analysisId,
        ...enriched,
      });
    }

    res.json(successResponse(enriched, {
      response_time: Date.now(),
    }));

  } catch (error) {
    if (io) {
      emitToAll(io, SOCKET_EVENTS.ANALYSIS_ERROR, {
        analysisId,
        error: error instanceof Error ? error.message : 'Error desconocido',
        code:  'ANALYSIS_FAILED',
      });
    }
    next(error);

  } finally {
    if (file?.path) {
      deleteTempFile(file.path);
    }
  }
};

function _emitProgress(io: any, analysisId: string, filename: string): void {
  if (!io) return;

  emitToAll(io, SOCKET_EVENTS.ANALYSIS_STARTED, {
    analysisId,
    filename,
    startedAt: new Date().toISOString(),
  });

  emitToAll(io, SOCKET_EVENTS.ANALYSIS_PROGRESS, {
    analysisId,
    stage:   'preprocessing',
    message: 'Preprocesando imagen MRI...',
    percent: 25,
  });

  emitToAll(io, SOCKET_EVENTS.ANALYSIS_PROGRESS, {
    analysisId,
    stage:   'inference',
    message: 'Clasificando con ResNet50...',
    percent: 60,
  });

  emitToAll(io, SOCKET_EVENTS.ANALYSIS_PROGRESS, {
    analysisId,
    stage:   'gradcam',
    message: 'Generando mapa de activación Grad-CAM...',
    percent: 90,
  });
}