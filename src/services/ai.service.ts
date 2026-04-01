import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import { ENV } from '../config/env.config';
import { AIServiceResponse } from '../types/analysis.types';
import { logger } from '../utils/logger';

export class AIService {
  private readonly baseUrl: string;
  private readonly timeout: number;

  constructor() {
    this.baseUrl = ENV.AI_SERVICE.URL;
    this.timeout = ENV.AI_SERVICE.TIMEOUT_MS;
  }

  async analyzeImage(filePath: string, filename: string): Promise<AIServiceResponse> {
    logger.info(`Enviando imagen al AI Service: ${filename}`);

    const form = new FormData();
    form.append('file', fs.createReadStream(filePath), {
      filename,
      contentType: 'application/octet-stream',
    });

    try {
      const response = await axios.post<AIServiceResponse>(
        `${this.baseUrl}/api/v1/analyze`,
        form,
        {
          headers: { ...form.getHeaders() },
          timeout: this.timeout,
        },
      );

      logger.info(
        `Análisis completado en ${response.data.processingTimeMs}ms — ` +
        `Resultado: ${response.data.classification.label} ` +
        `(${(response.data.classification.confidence * 100).toFixed(1)}%)`
      );

      return response.data;
    } catch (error) {
      logger.error('Error al comunicarse con el AI Service:', error);
      throw new Error('El servicio de IA no está disponible. Intente nuevamente.');
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      const response = await axios.get(`${this.baseUrl}/health`, { timeout: 5000 });
      return response.status === 200;
    } catch {
      return false;
    }
  }
}

export const aiService = new AIService();