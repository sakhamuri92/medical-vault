import type { DocumentType } from '@/types/document.types';

export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  prescription: 'Prescription',
  lab: 'Lab Report',
  xray: 'X-Ray / Scan',
  bill: 'Medical Bill',
  vaccine: 'Vaccination',
  discharge: 'Discharge Summary',
  insurance: 'Insurance',
  other: 'Other',
};

export const DOCUMENT_TYPE_ICONS: Record<DocumentType, string> = {
  prescription: '💊',
  lab: '🧪',
  xray: '🩻',
  bill: '🧾',
  vaccine: '💉',
  discharge: '🏥',
  insurance: '📋',
  other: '📄',
};
