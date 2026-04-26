# MedVault — Claude Context

**What it is:** Family medical history management app. One "Keeper" maintains records (prescriptions, lab reports, bills, x-rays, vaccinations) for all family members and exports a PDF for any new doctor visit.

**Platform:** React Native + Expo SDK 54 | TypeScript strict | iOS Simulator for local testing.

Full technical details in [ARCHITECTURE.md](./ARCHITECTURE.md).

---

## ⚠️ Session Handoff State

> **Update this section at the END of every working session — mandatory.**
> Anyone picking up this project reads this first.

**Last updated:** 2026-04-23

**Active phase:** Phase 1 — Foundation (Scaffold + DB boot complete)

**Completed this session:**

- ✅ Expo project scaffolded (`create-expo-app` blank-typescript template)
- ✅ All v1 runtime deps installed (expo-router, expo-sqlite, nativewind, zustand, react-query, react-hook-form, zod)
- ✅ Expo Router wired up (`main: "expo-router/entry"`, scheme, `app/` directory)
- ✅ NativeWind v4 configured (babel.config.js, metro.config.js, tailwind.config.js, global.css)
- ✅ Git initialized + Husky hooks: `commit-msg` (format enforcement), `pre-commit` (lint-staged), `pre-push` (tsc)
- ✅ Full `src/` skeleton: db/, adapters/, types/, utils/, services/, stores/, hooks/, constants/
- ✅ SQLite schema (`src/db/schema.ts`) — all tables from plan
- ✅ DAL: `src/db/repository.ts` + `src/db/adapters/sqlite.adapter.ts`
- ✅ All TypeScript types, Zustand stores, React Query hooks, util functions
- ✅ Tab navigation working (5 tabs: Dashboard, Family, Documents, Expenses, Settings)
- ✅ CLAUDE.md + ARCHITECTURE.md created
- ✅ `runMigrations()` wired into `app/_layout.tsx` — DB initialises on boot with spinner
- ✅ Babel build error fixed: removed `nativewind/babel` plugin (was a preset misloaded as plugin); NativeWind v4 only needs `jsxImportSource: 'nativewind'` in babel-preset-expo
- ✅ Package versions corrected to Expo SDK 54: babel-preset-expo@54.0.10, react-native-get-random-values@1.11.0, react-native-svg@15.12.1

**In progress (partially done):**

- None

**Next step to pick up from:**

> Install full Xcode from Mac App Store (required for iOS Simulator — only Command Line Tools are currently present). After install: `sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer`, download iOS 18 runtime in Xcode → Settings → Platforms, then run `npx expo start --ios` from the medvault directory.

**Open decisions / blockers:**

- Xcode not yet installed — iOS Simulator unavailable until it is

---

## Key Rules

- **All DB access through `src/db/repository.ts`** — never import `expo-sqlite` or `SqliteAdapter` in screens or services
- **Screens in `app/` have zero business logic** — import hooks/utils from `src/`
- **Never disable ESLint rules** without explicit approval — exceptions need an inline comment with reason
- **No `any` in TypeScript** — use `unknown` + type guard, or define the type; add a comment if unavoidable
- **Functions target ~50 lines** — flag when a function needs splitting, don't silently grow it
- **Descriptive names** — `memberCountryCode` not `code`, `fileUploadSizeError` not `error`
- **Never invent medical content** — medicine descriptions from bundled DB or OpenFDA only; never LLM-generated
- **Medical disclaimer required** on every screen showing medicine descriptions
- **Update both `CLAUDE.md` and `ARCHITECTURE.md`** before ending a session

**Rule files (read during all coding sessions):**

- `.claude/rules/coding-standards.md` — project overrides only: tokens, naming, architecture; expo skill is primary source
- `.claude/rules/code-quality.md` — ESLint rules + slim security (secrets, PHI logs, secure storage, deep links)
- `.claude/rules/accessibility.md` — medical-app a11y overrides only; expo skill covers generic WCAG

**Session management:**

- Use `/compact` manually when context builds up — do NOT rely on autoCompact
- Sub-agent turn limits: set per-call by orchestrator, not globally
- Session end: always spawn doc-writer or update CLAUDE.md handoff manually

---

## When to Stop and Ask

**Stop and ask before:**

- Any architectural change (DAL interface, new state layer, new service pattern)
- Modifying config files outside `src/` — `app.json`, `tailwind.config.js`, `tsconfig.json`, `.eslintrc.js`, `babel.config.js`, `metro.config.js`
- Adding a new runtime npm dependency
- Disabling any ESLint rule project-wide
- Changing the database schema (adding/removing tables or columns)

**Proceed without asking:**

- Bug fixes and feature work within existing patterns
- New components following `src/components/` structure
- New screens following existing patterns in `app/`
- Writing or updating tests

_When in doubt: ask a clarifying question, never assume._

---

## Key File Locations

| Path                                | What it is                                                           |
| ----------------------------------- | -------------------------------------------------------------------- |
| `src/db/repository.ts`              | ⭐ Only entry point to the database                                  |
| `src/db/schema.ts`                  | SQL DDL — source of truth for all tables                             |
| `src/db/adapters/sqlite.adapter.ts` | v1 SQLite implementation                                             |
| `src/db/adapters/types.ts`          | IAdapter interface                                                   |
| `src/stores/appStore.ts`            | Global locale + onboarding state                                     |
| `ARCHITECTURE.md`                   | Full tech stack, folder tree, schema, commit format, dev env         |
| `.claude/rules/coding-standards.md` | Project overrides: tokens, naming, architecture (expo skill primary) |
| `.claude/rules/code-quality.md`     | ESLint rules + slim security (SEC-01 through SEC-04)                 |
| `.claude/rules/accessibility.md`    | Medical-app a11y overrides (A11Y-S01 through A11Y-S07)               |
| `.claude/agents/orchestrator.md`    | Entry-point agent: Superpowers routing + graceful degradation        |
| `.claude/agents/code-guardian.md`   | Code + security enforcement: inline + full audits (sonnet)           |
| `.claude/agents/doc-writer.md`      | Docs: CLAUDE.md, ARCHITECTURE.md, memory writes (haiku)              |
| `.claude/settings.json`             | Committed plugin config — shared across all contributors             |
| `.claude/hooks.json`                | Stop + PreToolUse + PostToolUse hooks                                |
