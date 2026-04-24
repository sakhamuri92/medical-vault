export type RelationshipType = 'parent' | 'grandparent' | 'sibling' | 'child' | 'spouse';
export type FamilySide = 'paternal' | 'maternal';

export interface Relationship {
  id: string;
  from_member_id: string;
  to_member_id: string;
  relationship_type: RelationshipType;
  side: FamilySide | null;
}

export interface HeritageCondition {
  id: string;
  member_id: string;
  condition_name: string;
  onset_age: number | null;
  severity: 'mild' | 'moderate' | 'severe' | null;
  is_deceased: 0 | 1;
  cause_of_death: string | null;
  notes: string | null;
  created_at: string;
}

export interface ScreeningSuggestion {
  id: string;
  member_id: string;
  condition_source: string | null;
  screening_name: string;
  recommended_age: number | null;
  frequency: string | null;
  last_done_date: string | null;
}
