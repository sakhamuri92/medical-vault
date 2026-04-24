import type { Member, MemberInput } from '@/types/member.types';
import type { Document, DocumentInput } from '@/types/document.types';

export interface IAdapter {
  // Members
  getMembers(): Promise<Member[]>;
  getMemberById(id: string): Promise<Member | null>;
  createMember(data: MemberInput): Promise<Member>;
  updateMember(id: string, data: Partial<MemberInput>): Promise<Member>;
  deleteMember(id: string): Promise<void>;

  // Documents
  getDocuments(memberId?: string): Promise<Document[]>;
  getDocumentById(id: string): Promise<Document | null>;
  createDocument(data: DocumentInput): Promise<Document>;
  updateDocument(id: string, data: Partial<DocumentInput>): Promise<Document>;
  deleteDocument(id: string): Promise<void>;
}
