import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { repository } from '@/db/repository';
import type { DocumentInput } from '@/types/document.types';

const QUERY_KEY = ['documents'] as const;

export function useDocuments(memberId?: string) {
  return useQuery({
    queryKey: [...QUERY_KEY, memberId ?? 'all'],
    queryFn: () => repository.documents.getAll(memberId),
  });
}

export function useCreateDocument() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: DocumentInput) => repository.documents.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}
