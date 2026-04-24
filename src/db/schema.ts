export const SCHEMA_VERSION = 1;

export const CREATE_TABLES = `
  CREATE TABLE IF NOT EXISTS members (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    dob TEXT,
    gender TEXT,
    blood_group TEXT,
    relationship TEXT,
    photo_uri TEXT,
    country_code TEXT,
    height_cm REAL,
    weight_kg REAL,
    allergies TEXT,
    conditions TEXT,
    emergency_contact TEXT,
    is_deceased INTEGER DEFAULT 0,
    created_at TEXT,
    updated_at TEXT
  );

  CREATE TABLE IF NOT EXISTS app_settings (
    key TEXT PRIMARY KEY,
    value TEXT,
    updated_at TEXT
  );

  CREATE TABLE IF NOT EXISTS documents (
    id TEXT PRIMARY KEY,
    member_id TEXT NOT NULL,
    type TEXT NOT NULL,
    title TEXT,
    doctor_name TEXT,
    hospital_name TEXT,
    document_date TEXT,
    country_code TEXT,
    currency_code TEXT,
    notes TEXT,
    amount REAL,
    extraction_status TEXT DEFAULT 'manual',
    extraction_confidence REAL,
    raw_ocr_text TEXT,
    extracted_at TEXT,
    created_at TEXT,
    FOREIGN KEY (member_id) REFERENCES members(id)
  );

  CREATE TABLE IF NOT EXISTS document_images (
    id TEXT PRIMARY KEY,
    document_id TEXT NOT NULL,
    file_uri TEXT NOT NULL,
    page_order INTEGER,
    FOREIGN KEY (document_id) REFERENCES documents(id)
  );

  CREATE TABLE IF NOT EXISTS lab_results (
    id TEXT PRIMARY KEY,
    document_id TEXT NOT NULL,
    parameter TEXT NOT NULL,
    value TEXT,
    unit TEXT,
    reference_range TEXT,
    flag TEXT,
    confidence REAL,
    FOREIGN KEY (document_id) REFERENCES documents(id)
  );

  CREATE TABLE IF NOT EXISTS bill_items (
    id TEXT PRIMARY KEY,
    document_id TEXT NOT NULL,
    description TEXT NOT NULL,
    amount REAL NOT NULL,
    category TEXT,
    confidence REAL,
    FOREIGN KEY (document_id) REFERENCES documents(id)
  );

  CREATE TABLE IF NOT EXISTS vaccinations (
    id TEXT PRIMARY KEY,
    member_id TEXT NOT NULL,
    document_id TEXT,
    vaccine_name TEXT NOT NULL,
    given_date TEXT,
    dose_number INTEGER,
    next_due_date TEXT,
    batch_number TEXT,
    administered_at TEXT,
    FOREIGN KEY (member_id) REFERENCES members(id),
    FOREIGN KEY (document_id) REFERENCES documents(id)
  );

  CREATE TABLE IF NOT EXISTS medicines (
    id TEXT PRIMARY KEY,
    document_id TEXT NOT NULL,
    name TEXT NOT NULL,
    dosage TEXT,
    frequency TEXT,
    duration TEXT,
    purpose TEXT,
    description TEXT,
    description_source TEXT,
    description_edited INTEGER DEFAULT 0,
    notes TEXT,
    FOREIGN KEY (document_id) REFERENCES documents(id)
  );

  CREATE TABLE IF NOT EXISTS medicine_info (
    name TEXT PRIMARY KEY,
    display_name TEXT,
    drug_class TEXT,
    uses TEXT,
    how_it_works TEXT,
    side_effects TEXT,
    warnings TEXT,
    category TEXT,
    source TEXT,
    last_updated TEXT
  );

  CREATE TABLE IF NOT EXISTS relationships (
    id TEXT PRIMARY KEY,
    from_member_id TEXT NOT NULL,
    to_member_id TEXT NOT NULL,
    relationship_type TEXT NOT NULL,
    side TEXT,
    FOREIGN KEY (from_member_id) REFERENCES members(id),
    FOREIGN KEY (to_member_id) REFERENCES members(id)
  );

  CREATE TABLE IF NOT EXISTS heritage_conditions (
    id TEXT PRIMARY KEY,
    member_id TEXT NOT NULL,
    condition_name TEXT NOT NULL,
    onset_age INTEGER,
    severity TEXT,
    is_deceased INTEGER DEFAULT 0,
    cause_of_death TEXT,
    notes TEXT,
    created_at TEXT,
    FOREIGN KEY (member_id) REFERENCES members(id)
  );

  CREATE TABLE IF NOT EXISTS screening_suggestions (
    id TEXT PRIMARY KEY,
    member_id TEXT NOT NULL,
    condition_source TEXT,
    screening_name TEXT NOT NULL,
    recommended_age INTEGER,
    frequency TEXT,
    last_done_date TEXT,
    FOREIGN KEY (member_id) REFERENCES members(id)
  );

  CREATE TABLE IF NOT EXISTS extraction_confidence (
    id TEXT PRIMARY KEY,
    document_id TEXT NOT NULL,
    field_name TEXT NOT NULL,
    confidence REAL,
    was_edited INTEGER DEFAULT 0,
    FOREIGN KEY (document_id) REFERENCES documents(id)
  );
`;
