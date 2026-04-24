/**
 * Extraction pipeline orchestrator.
 * v1: returns empty structured data (manual entry only).
 * v1.5: will call ocr.ts → structurer.ts → validator.ts.
 */
import type { DocumentType } from '@/types/document.types';
import type { ExtractionResult } from '@/types/extraction.types';

export async function extractDocument(
  _imageUris: string[],
  _documentType: DocumentType,
  _documentId: string,
): Promise<ExtractionResult> {
  // v1 stub — AI extraction not yet implemented
  return {
    documentId: _documentId,
    status: 'failed',
    overallConfidence: 0,
    fields: [],
    rawOcrText: '',
  };
}
