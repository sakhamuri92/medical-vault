# MedVault Code Quality Rules

**Covers:** ESLint enforcement + slim security rules
**Prime directive:** NEVER add `eslint-disable` comments. Fix the code.
**Last updated:** 2026-04-25

## ESLint Configuration

Config: `.eslintrc.js` extends `['expo', 'prettier']`
Active rules: `prettier/prettier: error` | `no-console: warn (allow: warn, error)` | `@typescript-eslint/no-explicit-any: error` | `@typescript-eslint/no-unused-vars: error`
Standard: `--max-warnings 0` — zero warnings allowed in CI.

### `@typescript-eslint/no-explicit-any`

Never suppress. Fix options:

- (A) Define an interface for the known shape
- (B) Use `unknown` + type guard to narrow safely
- (C) Use a generic `<T>` when the type varies by caller

### `@typescript-eslint/no-unused-vars`

- Unused import → remove it
- Unused callback param required by signature → prefix `_`: `_event`, `_index`
- Unused variable → remove it

### `no-console`

- `console.log` → remove entirely
- Only `console.warn` / `console.error` allowed

### `prettier/prettier`

Auto-fix: `npx eslint 'src/**/*.{ts,tsx}' 'app/**/*.{ts,tsx}' --fix`
Remaining format issues: `npm run format`

## Security Rules

### SEC-01: No hardcoded secrets [CRITICAL]

Flag strings with `sk-`, `pk_`, `Bearer `, `AIza`, `AKIA` prefixes.
Flag variables named `secret`, `apiKey`, or `token` assigned string literals.

### SEC-02: No PHI in console output [HIGH]

`console.warn/error` must not include member name, DOB, conditions, medicine names, document content, or any PHI field. Only entity IDs are acceptable.

```ts
// Wrong
console.error('Failed to save member', member);

// Correct
console.error('DB write failed for member ID', memberId);
```

### SEC-03: expo-secure-store for auth token [CRITICAL]

Auth tokens must be stored via `expo-secure-store` only.
Never use `AsyncStorage`, never store tokens in plain `expo-sqlite`.

### SEC-04: Deep link URL allowlisting [HIGH]

`expo-linking` handlers must validate scheme = `medvault://` and route against an explicit allowlist before processing params.
