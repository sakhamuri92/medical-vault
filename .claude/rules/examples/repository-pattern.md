# Repository Pattern — MedVault Examples

## Correct Hook Pattern

```typescript
// src/hooks/useMembers.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { repository } from '@/db/repository';
import type { Member } from '@/types/member.types';

const MEMBERS_KEY = ['members'] as const;

export function useMembers() {
  return useQuery({
    queryKey: MEMBERS_KEY,
    queryFn: () => repository.members.getAll(),
  });
}

export function useMember(id: string) {
  return useQuery({
    queryKey: ['members', id],
    queryFn: () => repository.members.getById(id),
    enabled: Boolean(id),
  });
}

export function useCreateMember() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Member, 'id' | 'createdAt'>) => repository.members.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: MEMBERS_KEY }),
  });
}
```

## Screen Isolation: Before and After

```typescript
// WRONG — business logic in screen
// app/(tabs)/members.tsx
import { repository } from '@/db/repository';  // VIOLATION
import * as SQLite from 'expo-sqlite';          // VIOLATION

export default function MembersScreen() {
  const [members, setMembers] = useState([]);
  useEffect(() => {
    repository.members.getAll().then(setMembers);  // VIOLATION
  }, []);
  return <FlatList data={members} />;
}

// CORRECT — screen delegates to hook
// app/(tabs)/members.tsx
import { useMembers } from '@/hooks/useMembers';

export default function MembersScreen() {
  const { data: members, isLoading } = useMembers();
  if (isLoading) return <ActivityIndicator />;
  return <FlatList data={members} />;
}
```

## State Management Decision

```typescript
// Use Zustand for: global UI state, user preferences
// src/stores/appStore.ts
const useAppStore = create<AppState>((set) => ({
  defaultCountryCode: 'IN',
  hasCompletedOnboarding: false,
  setDefaultCountryCode: (code) => set({ defaultCountryCode: code }),
}));

// Use React Query for: any async or DB-backed data
// (never Zustand for data that changes via DB operations)
const { data: members } = useMembers();

// Use useState for: local ephemeral state (modal open, form dirty)
const [isModalVisible, setIsModalVisible] = useState(false);
```

## Query Key Conventions

```typescript
['members'][('members', memberId)]['documents'][('documents', memberId)][('documents', docId)][ // all members list // single member // all documents // documents for a specific member // single document
  'expenses'
]; // all expenses
```
