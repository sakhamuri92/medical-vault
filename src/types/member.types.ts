export interface Member {
  id: string;
  name: string;
  dob: string | null;
  gender: 'male' | 'female' | 'other' | null;
  blood_group: string | null;
  relationship: string | null;
  photo_uri: string | null;
  country_code: string | null;
  height_cm: number | null;
  weight_kg: number | null;
  allergies: string; // JSON string array
  conditions: string; // JSON string array
  emergency_contact: string | null;
  is_deceased: 0 | 1;
  created_at: string;
  updated_at: string;
}

export interface MemberInput {
  name: string;
  dob?: string;
  gender?: 'male' | 'female' | 'other';
  bloodGroup?: string;
  relationship?: string;
  photoUri?: string;
  countryCode?: string;
  heightCm?: number;
  weightKg?: number;
  allergies?: string[];
  conditions?: string[];
  emergencyContact?: string;
  isDeceased?: boolean;
}
