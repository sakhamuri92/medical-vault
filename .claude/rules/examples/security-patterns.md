# Security Patterns — MedVault Examples

## UUID v4 Validation Before File Paths

```typescript
const UUID_V4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function validateId(id: string, field: string): void {
  if (!UUID_V4.test(id)) {
    throw new Error(`${field} failed UUID v4 validation`);
  }
}

// Use before calling fileStorage functions
validateId(memberId, 'memberId');
validateId(documentId, 'documentId');
await fileStorage.saveDocument(memberId, documentId, imageData);
```

## SQL Column Allowlist for Dynamic Updates

```typescript
// Current risk in sqlite.adapter.ts — Object.keys without allowlist
// Add this pattern when modifying or extending adapter methods:

const MEMBER_UPDATE_COLUMNS = new Set([
  'name',
  'dob',
  'gender',
  'blood_group',
  'country_code',
  'photo_uri',
  'notes',
] as const);

function buildMemberUpdateSQL(data: Partial<Member>): { sql: string; values: unknown[] } {
  const safeKeys = Object.keys(data).filter((k) => MEMBER_UPDATE_COLUMNS.has(k as never));
  if (safeKeys.length === 0) throw new Error('No valid columns to update');
  const sql = `UPDATE members SET ${safeKeys.map((k) => `${k} = ?`).join(', ')} WHERE id = ?`;
  return { sql, values: [...safeKeys.map((k) => data[k as keyof Member]), data.id] };
}
```

## Deep Link URL Allowlisting

```typescript
import * as Linking from 'expo-linking';

const ALLOWED_ROUTES = new Set(['/member/', '/document/', '/export/', '/heritage/']);
const APP_SCHEME = 'medvault';

function handleDeepLink(url: string): void {
  const parsed = Linking.parse(url);

  if (parsed.scheme !== APP_SCHEME) {
    console.warn('Rejected deep link with unknown scheme');
    return;
  }

  const path = parsed.path ?? '';
  const isAllowed = [...ALLOWED_ROUTES].some((route) => path.startsWith(route));
  if (!isAllowed) {
    console.warn('Rejected deep link with unknown route');
    return;
  }

  // Only now: process parsed.queryParams
  router.push(path as never);
}
```

## PHI-Safe Error Logging

```typescript
// Wrong — logs PHI
console.error('Failed to save member', member); // PHI object
console.error('Document upload failed', { name, memberId }); // PHI field

// Correct — IDs only, no PHI fields
console.error('DB write failed for member ID', memberId);
console.error('Document upload failed for document ID', documentId);
```

## Medical Disclaimer JSX

```typescript
// Required on every screen showing medicine description, how_it_works, side_effects, warnings
<Text className="text-xs text-gray-500 mt-2 italic">
  For informational purposes only. Consult your doctor or pharmacist.
</Text>
```

## Zod at DB Write (quick reference)

```typescript
import { memberSchema } from '@/utils/validators';

const result = memberSchema.safeParse(formValues);
if (!result.success) {
  setErrors(result.error.flatten());
  return;
}
await repository.members.create(result.data);
```
