# MedVault Code Quality Rules

**Covers:** ESLint enforcement + input sanitization + security
**Examples:** `.claude/rules/examples/` — load security-patterns.md or typescript-patterns.md for violations
**Prime directive:** NEVER add `eslint-disable` comments. Fix the code.
**Last updated:** 2026-04-24

## ESLint Configuration

Config: `.eslintrc.js` extends `['expo', 'prettier']`
Active rules: `prettier/prettier: error` | `no-console: warn (allow: warn, error)` | `@typescript-eslint/no-explicit-any: error` | `@typescript-eslint/no-unused-vars: error`
Standard: `--max-warnings 0` — zero warnings allowed in CI.

### `@typescript-eslint/no-explicit-any` → examples/typescript-patterns.md

Never suppress. Fix options: (A) define an interface, (B) `unknown` + type guard, (C) generic `<T>`.

### `@typescript-eslint/no-unused-vars`

- Unused import → remove it
- Unused callback param (signature requires it) → prefix `_`: `_event`, `_index` (not bare `_`)
- Unused variable → remove it

### `no-console`

- `console.log` → remove (not promote to warn)
- Only `console.warn` / `console.error` allowed — and never with PHI in the message

### `prettier/prettier`

Auto-fixed by: `npx eslint 'src/**/*.{ts,tsx}' 'app/**/*.{ts,tsx}' --fix`
Remaining: `npm run format`

### Difficult cases: stop and ask

If fixing requires restructuring a module, changing DAL, or modifying `tsconfig.json`/`babel.config.js` → report as "requires architectural decision." Do not silently restructure.

## Sanitization & Security Rules → examples/security-patterns.md

### SEC-01: Zod at every DB write [CRITICAL]

`repository.*.create/update()` must be preceded by `safeParse` from `src/utils/validators.ts`.

### SEC-02: No SQL string concatenation [CRITICAL]

No template literals or string concatenation building SQL from variable input. Dynamic column updates need an explicit allowlist (see examples/security-patterns.md).

Known tracked risk: `updateMember`/`updateDocument` in `sqlite.adapter.ts` — flag new methods copying this pattern.

### SEC-03: UUID validation before file paths [HIGH]

Paths from `memberId`/`documentId` must validate as UUID v4 before passing to `expo-file-system`.

### SEC-04: No eval() or dynamic code [CRITICAL]

`eval()`, `new Function()`, `setTimeout(string)`, `setInterval(string)` — all prohibited.

### SEC-05: Deep link URL allowlisting [HIGH]

`expo-linking` handlers must validate scheme = `medvault://` and route against explicit allowlist.

### SEC-06: No PHI in console output [HIGH]

`console.warn/error` must not include member name, DOB, conditions, medicine names, document content, or any PHI field. Only entity IDs are acceptable.

### SEC-07: No AsyncStorage [CRITICAL]

Not a project dependency — its import is a CRITICAL violation. Use `expo-sqlite` via `repository.ts`.

### SEC-08: No hardcoded secrets [CRITICAL]

Flag strings with `sk-`, `pk_`, `Bearer `, `AIza`, `AKIA` prefixes; variables named `secret`/`apiKey`/`token` assigned string literals.

### SEC-09: Medicine data source [HIGH]

Writes to `medicine_info` must set `description_source` to `'bundled'`, `'api'`, or `'user_edited'`. LLM sources prohibited.

### SEC-10: Medical disclaimer [REQUIRED]

Every screen showing medicine `description`, `how_it_works`, `side_effects`, or `warnings` must include the disclaimer text (see examples/security-patterns.md).

### Known DAL violation (do not re-report)

`app/_layout.tsx` line 5 imports `expo-sqlite` directly for `runMigrations`. Tracked architectural exception.
