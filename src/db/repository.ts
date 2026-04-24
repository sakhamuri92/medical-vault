/**
 * The Data Access Layer — the ONLY file that screens and services interact with.
 * Never import SqliteAdapter or SQLite directly outside of this file and adapters/.
 *
 * To migrate to v2 (laptop) or v3 (cloud), swap the adapter import below.
 * Nothing else in the codebase needs to change.
 */
import { SqliteAdapter } from './adapters/sqlite.adapter';
// v2: import { LaptopAdapter } from './adapters/laptop.adapter';
// v3: import { CloudAdapter } from './adapters/cloud.adapter';

const adapter = new SqliteAdapter();

export const repository = {
  members: {
    getAll: () => adapter.getMembers(),
    getById: (id: string) => adapter.getMemberById(id),
    create: (data: Parameters<typeof adapter.createMember>[0]) => adapter.createMember(data),
    update: (id: string, data: Parameters<typeof adapter.updateMember>[1]) =>
      adapter.updateMember(id, data),
    delete: (id: string) => adapter.deleteMember(id),
  },
  documents: {
    getAll: (memberId?: string) => adapter.getDocuments(memberId),
    getById: (id: string) => adapter.getDocumentById(id),
    create: (data: Parameters<typeof adapter.createDocument>[0]) => adapter.createDocument(data),
    update: (id: string, data: Parameters<typeof adapter.updateDocument>[1]) =>
      adapter.updateDocument(id, data),
    delete: (id: string) => adapter.deleteDocument(id),
  },
};
