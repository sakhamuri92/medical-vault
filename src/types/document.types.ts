export type DocumentType =
  | 'prescription'
  | 'lab'
  | 'xray'
  | 'bill'
  | 'vaccine'
  | 'discharge'
  | 'insurance'
  | 'other';

export type ExtractionStatus = 'pending' | 'completed' | 'failed' | 'manual';

export interface Document {
  id: string;
  member_id: string;
  type: DocumentType;
  title: string | null;
  doctor_name: string | null;
  hospital_name: string | null;
  document_date: string | null;
  country_code: string | null;
  currency_code: string | null;
  notes: string | null;
  amount: number | null;
  extraction_status: ExtractionStatus;
  extraction_confidence: number | null;
  raw_ocr_text: string | null;
  extracted_at: string | null;
  created_at: string;
}

export interface DocumentInput {
  memberId: string;
  type: DocumentType;
  title?: string;
  doctorName?: string;
  hospitalName?: string;
  documentDate?: string;
  countryCode?: string;
  currencyCode?: string;
  notes?: string;
  amount?: number;
}
