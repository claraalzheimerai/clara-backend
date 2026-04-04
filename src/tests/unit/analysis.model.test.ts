import {
  getConfidenceLevel,
  DIAGNOSTIC_LABELS,
  DIAGNOSTIC_COLORS,
  CONFIDENCE_THRESHOLDS,
} from '../../models/analysis.model';

describe('analysis.model', () => {

  describe('getConfidenceLevel', () => {
    it('retorna HIGH cuando confianza >= 0.85', () => {
      expect(getConfidenceLevel(0.85)).toBe('HIGH');
      expect(getConfidenceLevel(0.99)).toBe('HIGH');
      expect(getConfidenceLevel(1.0)).toBe('HIGH');
    });

    it('retorna MEDIUM cuando confianza >= 0.65 y < 0.85', () => {
      expect(getConfidenceLevel(0.65)).toBe('MEDIUM');
      expect(getConfidenceLevel(0.75)).toBe('MEDIUM');
      expect(getConfidenceLevel(0.84)).toBe('MEDIUM');
    });

    it('retorna LOW cuando confianza < 0.65', () => {
      expect(getConfidenceLevel(0.0)).toBe('LOW');
      expect(getConfidenceLevel(0.5)).toBe('LOW');
      expect(getConfidenceLevel(0.64)).toBe('LOW');
    });
  });

  describe('DIAGNOSTIC_LABELS', () => {
    it('tiene etiquetas para las 3 clases', () => {
      expect(DIAGNOSTIC_LABELS.CN).toBe('Cognitivamente Normal');
      expect(DIAGNOSTIC_LABELS.MCI).toBe('Deterioro Cognitivo Leve');
      expect(DIAGNOSTIC_LABELS.AD).toBe('Enfermedad de Alzheimer');
    });
  });

  describe('DIAGNOSTIC_COLORS', () => {
    it('tiene colores para las 3 clases', () => {
      expect(DIAGNOSTIC_COLORS.CN).toBe('#22c55e');
      expect(DIAGNOSTIC_COLORS.MCI).toBe('#f59e0b');
      expect(DIAGNOSTIC_COLORS.AD).toBe('#ef4444');
    });
  });

  describe('CONFIDENCE_THRESHOLDS', () => {
    it('HIGH > MEDIUM > LOW', () => {
      expect(CONFIDENCE_THRESHOLDS.HIGH).toBeGreaterThan(CONFIDENCE_THRESHOLDS.MEDIUM);
      expect(CONFIDENCE_THRESHOLDS.MEDIUM).toBeGreaterThan(CONFIDENCE_THRESHOLDS.LOW);
    });
  });
});