import { create } from 'zustand';
import type { Member } from '@/types/member.types';

interface MemberState {
  selectedMemberId: string | null;
  selectedMember: Member | null;
  setSelectedMember: (member: Member | null) => void;
}

export const useMemberStore = create<MemberState>((set) => ({
  selectedMemberId: null,
  selectedMember: null,
  setSelectedMember: (member) =>
    set({ selectedMember: member, selectedMemberId: member?.id ?? null }),
}));
