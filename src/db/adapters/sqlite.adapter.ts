import * as SQLite from 'expo-sqlite';
import type { IAdapter } from './types';
import type { Member, MemberInput } from '@/types/member.types';
import type { Document, DocumentInput } from '@/types/document.types';
import { generateId } from '@/utils/idGen';

let db: SQLite.SQLiteDatabase | null = null;

function getDb(): SQLite.SQLiteDatabase {
  if (!db) {
    db = SQLite.openDatabaseSync('medvault.db');
  }
  return db;
}

export class SqliteAdapter implements IAdapter {
  async getMembers(): Promise<Member[]> {
    return getDb().getAllAsync<Member>('SELECT * FROM members ORDER BY name ASC');
  }

  async getMemberById(id: string): Promise<Member | null> {
    return getDb().getFirstAsync<Member>('SELECT * FROM members WHERE id = ?', [id]);
  }

  async createMember(data: MemberInput): Promise<Member> {
    const id = generateId();
    const now = new Date().toISOString();
    await getDb().runAsync(
      `INSERT INTO members (id, name, dob, gender, blood_group, relationship, photo_uri,
        country_code, height_cm, weight_kg, allergies, conditions, emergency_contact,
        is_deceased, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        data.name,
        data.dob ?? null,
        data.gender ?? null,
        data.bloodGroup ?? null,
        data.relationship ?? null,
        data.photoUri ?? null,
        data.countryCode ?? null,
        data.heightCm ?? null,
        data.weightKg ?? null,
        JSON.stringify(data.allergies ?? []),
        JSON.stringify(data.conditions ?? []),
        data.emergencyContact ?? null,
        data.isDeceased ? 1 : 0,
        now,
        now,
      ],
    );
    return (await this.getMemberById(id))!;
  }

  async updateMember(id: string, data: Partial<MemberInput>): Promise<Member> {
    const now = new Date().toISOString();
    const fields = Object.keys(data)
      .map((k) => `${k} = ?`)
      .join(', ');
    const bindable = Object.values(data).map((v) =>
      Array.isArray(v) ? JSON.stringify(v) : (v ?? null),
    ) as (string | number | boolean | null)[];
    const values = [...bindable, now, id];
    await getDb().runAsync(`UPDATE members SET ${fields}, updated_at = ? WHERE id = ?`, values);
    return (await this.getMemberById(id))!;
  }

  async deleteMember(id: string): Promise<void> {
    await getDb().runAsync('DELETE FROM members WHERE id = ?', [id]);
  }

  async getDocuments(memberId?: string): Promise<Document[]> {
    if (memberId) {
      return getDb().getAllAsync<Document>(
        'SELECT * FROM documents WHERE member_id = ? ORDER BY document_date DESC',
        [memberId],
      );
    }
    return getDb().getAllAsync<Document>('SELECT * FROM documents ORDER BY document_date DESC');
  }

  async getDocumentById(id: string): Promise<Document | null> {
    return getDb().getFirstAsync<Document>('SELECT * FROM documents WHERE id = ?', [id]);
  }

  async createDocument(data: DocumentInput): Promise<Document> {
    const id = generateId();
    const now = new Date().toISOString();
    await getDb().runAsync(
      `INSERT INTO documents (id, member_id, type, title, doctor_name, hospital_name,
        document_date, country_code, currency_code, notes, amount, extraction_status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        data.memberId,
        data.type,
        data.title ?? null,
        data.doctorName ?? null,
        data.hospitalName ?? null,
        data.documentDate ?? null,
        data.countryCode ?? null,
        data.currencyCode ?? null,
        data.notes ?? null,
        data.amount ?? null,
        'manual',
        now,
      ],
    );
    return (await this.getDocumentById(id))!;
  }

  async updateDocument(id: string, data: Partial<DocumentInput>): Promise<Document> {
    const fields = Object.keys(data)
      .map((k) => `${k} = ?`)
      .join(', ');
    const bindable = Object.values(data).map((v) =>
      Array.isArray(v) ? JSON.stringify(v) : (v ?? null),
    ) as (string | number | boolean | null)[];
    await getDb().runAsync(`UPDATE documents SET ${fields} WHERE id = ?`, [...bindable, id]);
    return (await this.getDocumentById(id))!;
  }

  async deleteDocument(id: string): Promise<void> {
    await getDb().runAsync('DELETE FROM documents WHERE id = ?', [id]);
  }
}
