# TypeScript Patterns — MedVault Examples

## Type Guard Pattern (preferred over `as` cast)

```typescript
// Define a type guard
function isMember(v: unknown): v is Member {
  return (
    typeof v === 'object' &&
    v !== null &&
    'id' in v &&
    'name' in v &&
    typeof (v as Record<string, unknown>).id === 'string'
  );
}

// Use it to narrow unknown
function processMember(data: unknown): Member {
  if (!isMember(data)) throw new Error('Invalid member data shape');
  return data;
}
```

## Fix `any`: Known Structure → Interface

```typescript
// Before (violation)
function processResponse(data: any) {
  return data.items;
}

// After
interface ApiResponse {
  items: string[];
}
function processResponse(data: ApiResponse): string[] {
  return data.items;
}
```

## Fix `any`: Unknown Shape → unknown + Type Guard

```typescript
// Before (violation)
function parseData(data: any) {
  return data.memberId;
}

// After
interface HasMemberId {
  memberId: string;
}
function hasMemberId(v: unknown): v is HasMemberId {
  return typeof v === 'object' && v !== null && 'memberId' in v;
}
function parseData(data: unknown): string {
  if (!hasMemberId(data)) throw new Error('Expected memberId');
  return data.memberId;
}
```

## Fix `any`: Varies by Caller → Generic

```typescript
// Before (violation)
function wrap(value: any): { data: any } {
  return { data: value };
}

// After
function wrap<T>(value: T): { data: T } {
  return { data: value };
}
```

## Safe Non-Null Assertion

```typescript
// Before (violation — unsafe !)
const name = member!.name;

// After — check first
if (!member) return null;
const name = member.name;

// Or with early return
function getMemberName(member: Member | null): string {
  if (!member) throw new Error('Member is null');
  return member.name;
}
```

## Explicit Return Types

```typescript
// Ambiguous inference — add explicit return type
async function fetchMember(id: string): Promise<Member | null> {
  return repository.members.getById(id);
}

// Callback type annotation
const handlePress = useCallback(
  (memberId: string): void => {
    router.push(`/member/${memberId}`);
  },
  [router],
);
```
