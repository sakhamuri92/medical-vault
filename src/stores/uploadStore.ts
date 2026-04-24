import { create } from 'zustand';
import type { DocumentType } from '@/types/document.types';

interface UploadState {
  selectedMemberId: string | null;
  documentType: DocumentType | null;
  capturedImageUris: string[];
  setMemberId: (id: string) => void;
  setDocumentType: (type: DocumentType) => void;
  addImage: (uri: string) => void;
  removeImage: (uri: string) => void;
  reset: () => void;
}

export const useUploadStore = create<UploadState>((set) => ({
  selectedMemberId: null,
  documentType: null,
  capturedImageUris: [],
  setMemberId: (id) => set({ selectedMemberId: id }),
  setDocumentType: (type) => set({ documentType: type }),
  addImage: (uri) => set((state) => ({ capturedImageUris: [...state.capturedImageUris, uri] })),
  removeImage: (uri) =>
    set((state) => ({ capturedImageUris: state.capturedImageUris.filter((u) => u !== uri) })),
  reset: () => set({ selectedMemberId: null, documentType: null, capturedImageUris: [] }),
}));
