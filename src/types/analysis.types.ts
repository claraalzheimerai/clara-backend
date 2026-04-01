export type AlzheimerClass = 'CN' | 'MCI' | 'AD';
// CN  = Cognitivamente Normal
// MCI = Deterioro Cognitivo Leve
// AD  = Alzheimer's Disease

export interface ClassificationResult {
  label: AlzheimerClass;
  confidence: number;
  probabilities: {
    CN: number;
    MCI: number;
    AD: number;
  };
}

export interface GradCAMResult {
  heatmapBase64: string;
  highlightedRegions: string[];
}

export interface AIServiceResponse {
  classification: ClassificationResult;
  gradcam: GradCAMResult;
  modelVersion: string;
  processingTimeMs: number;
}

export interface AnalysisResponse {
  analysisId: string;
  filename: string;
  classification: ClassificationResult;
  gradcam: GradCAMResult;
  modelVersion: string;
  processingTimeMs: number;
  timestamp: string;
}