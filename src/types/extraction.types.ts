export type ConfidenceLevel = 'high' | 'medium' | 'low';

export interface FieldConfidence {
  fieldName: string;
  confidence: number; // 0.0 to 1.0
  level: ConfidenceLevel;
}

export interface ExtractionResult {
  documentId: string;
  status: 'completed' | 'failed';
  overallConfidence: number;
  fields: FieldConfidence[];
  rawOcrText: string;
}
