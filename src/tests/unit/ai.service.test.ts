jest.mock('../../services/ai.service', () => ({
  aiService: {
    health:  jest.fn(),
    predict: jest.fn(),
  },
}));

import { aiService } from '../../services/ai.service';

const mockedAiService = aiService as jest.Mocked<typeof aiService>;

describe('AIService', () => {

  beforeEach(() => jest.clearAllMocks());

  describe('health()', () => {
    it('retorna health data cuando AI Service responde', async () => {
      const mockHealth = {
        status:  'ok',
        service: 'clara-ai-service',
        version: '1.0.0',
        env:     'development',
        device:  'cpu',
      };
      mockedAiService.health.mockResolvedValue(mockHealth);

      const result = await aiService.health();

      expect(result.status).toBe('ok');
      expect(result.service).toBe('clara-ai-service');
      expect(result.version).toBe('1.0.0');
      expect(mockedAiService.health).toHaveBeenCalledTimes(1);
    });

    it('lanza error cuando AI Service no está disponible', async () => {
      mockedAiService.health.mockRejectedValue(
        new Error('AI Service no disponible')
      );

      await expect(aiService.health()).rejects.toThrow('AI Service no disponible');
    });
  });

  describe('predict()', () => {
    it('retorna resultado de predicción correctamente', async () => {
      const mockResult = {
        filename:      'scan.nii',
        prediction: {
          label:         'CN' as const,
          confidence:    0.92,
          probabilities: { CN: 0.92, MCI: 0.05, AD: 0.03 },
        },
        gradcam:       'data:image/png;base64,abc123',
        model_version: '1.0.0',
      };
      mockedAiService.predict.mockResolvedValue(mockResult);

      const result = await aiService.predict('/tmp/scan.nii', 'scan.nii');

      expect(result.prediction.label).toBe('CN');
      expect(result.prediction.confidence).toBe(0.92);
      expect(mockedAiService.predict).toHaveBeenCalledWith('/tmp/scan.nii', 'scan.nii');
    });

    it('lanza error cuando AI Service falla en predicción', async () => {
      mockedAiService.predict.mockRejectedValue(
        new Error('Error procesando imagen en AI Service')
      );

      await expect(
        aiService.predict('/tmp/test.nii', 'test.nii')
      ).rejects.toThrow('Error procesando imagen en AI Service');
    });
  });
});