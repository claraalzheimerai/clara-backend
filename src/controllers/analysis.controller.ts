import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { aiService } from '../services/ai.service';
import { deleteTempFile } from '../utils/file.utils';
import { AnalysisResponse } from '../types/analysis.types';
import { logger } from '../utils/logger';

export const uploadAndAnalyze = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const file = req.file;

  if (!file) {
    res.status(400).json({ message: 'No se recibió ningún archivo.' });
    return;
  }

  logger.info(`Análisis iniciado — archivo: ${file.originalname} (${file.size} bytes)`);

  try {
    const aiResult = await aiService.analyzeImage(file.path, file.originalname);

    const response: AnalysisResponse = {
      analysisId: uuidv4(),
      filename: file.originalname,
      classification: aiResult.classification,
      gradcam: aiResult.gradcam,
      modelVersion: aiResult.modelVersion,
      processingTimeMs: aiResult.processingTimeMs,
      timestamp: new Date().toISOString(),
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  } finally {
    // Eliminar archivo temporal — Ley 1581 de 2012
    deleteTempFile(file.path);
  }
};

export const healthCheck = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  const aiAvailable = await aiService.healthCheck();

  res.status(aiAvailable ? 200 : 503).json({
    status: aiAvailable ? 'ok' : 'degraded',
    backend: 'ok',
    aiService: aiAvailable ? 'ok' : 'unavailable',
    timestamp: new Date().toISOString(),
  });
};