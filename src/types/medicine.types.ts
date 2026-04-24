export type DescriptionSource = 'local' | 'api' | 'user_edited' | 'manual';

export interface Medicine {
  id: string;
  document_id: string;
  name: string;
  dosage: string | null;
  frequency: string | null;
  duration: string | null;
  purpose: string | null;
  description: string | null;
  description_source: DescriptionSource | null;
  description_edited: 0 | 1;
  notes: string | null;
}

export interface MedicineInfo {
  name: string;
  display_name: string | null;
  drug_class: string | null;
  uses: string | null;
  how_it_works: string | null;
  side_effects: string | null; // JSON array
  warnings: string | null;
  category: string | null;
  source: 'bundled' | 'api' | 'user_contributed';
  last_updated: string | null;
}
