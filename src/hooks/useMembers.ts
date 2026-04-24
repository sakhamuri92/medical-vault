import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { repository } from '@/db/repository';
import type { MemberInput } from '@/types/member.types';

const QUERY_KEY = ['members'] as const;

export function useMembers() {
  return useQuery({ queryKey: QUERY_KEY, queryFn: () => repository.members.getAll() });
}

export function useMember(id: string) {
  return useQuery({
    queryKey: [...QUERY_KEY, id],
    queryFn: () => repository.members.getById(id),
    enabled: !!id,
  });
}

export function useCreateMember() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: MemberInput) => repository.members.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

export function useDeleteMember() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => repository.members.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}
