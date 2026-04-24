# MedVault — Architecture Reference

> Deep technical reference. Updated whenever structure, dependencies, or schema changes.
> For session context and rules, see [CLAUDE.md](./CLAUDE.md).

---

## Tech Stack

| Package | Version | Purpose |
|---|---|---|
| `expo` | ~54.0.33 | Managed workflow runtime |
| `expo-router` | ~6.0.23 | File-based navigation |
| `expo-sqlite` | ~16.0.10 | Local SQLite database |
| `expo-file-system` | ~19.0.21 | Image and PDF file storage |
| `expo-constants` | ~18.0.13 | App config access |
| `expo-linking` | ~8.0.11 | Deep link handling |
| `nativewind` | ^4.2.3 | Tailwind utility classes for React Native |
| `tailwindcss` | ^3.4.x | Required by NativeWind v4 (must stay on v3) |
| `zustand` | ^5.0.x | Lightweight global state |
| `@tanstack/react-query` | ^5.x | Server/async state + cache invalidation |
| `react-hook-form` | ^7.x | Form state management |
| `zod` | ^4.x | Schema validation + TypeScript inference |
| `@hookform/resolvers` | ^5.x | Bridges zod → react-hook-form |
| `react-native-svg` | ^15.x | Charts and family tree visualization |
| `uuid` + `react-native-get-random-values` | latest | UUID generation |
| **Dev** | | |
| `husky` | ^9.x | Git hooks manager |
| `lint-staged` | ^16.x | Linting only staged files |
| `jest-expo` | ~54.x | Testing preset |
| `@testing-library/react-native` | ^13.x | Component testing |

### Intentionally Deferred

| Package | Added in |
|---|---|
| `react-native-mlkit-ocr` | v1.5 |
| `expo-camera` / `expo-image-picker` | Phase 4 |
| `expo-print` / `expo-sharing` | Phase 8 |
| `expo-local-authentication` | Phase 9 |
| `expo-notifications` | Phase 9 |
| Supabase / Firebase SDK | v3 |

**Note:** `tailwindcss` must remain on v3.x. NativeWind v4 is incompatible with Tailwind CSS v4.

---

## Version Roadmap

**v1 (Weeks 1–10, current):** Phone-only. SQLite + local file storage. Manual entry. No backend, no sync. Only external calls: AI Vision API (during document upload) and OpenFDA (medicine info cache).

**v1.5 (3–4 weeks after v1 ships):** Add AI extraction. On-device OCR via `react-native-mlkit-ocr`, cloud AI structuring (Gemini/Claude Vision), confidence indicators on review screen. Same review UI as v1 — fields just come pre-filled.

**v2 (Weeks 11–16, future):** Add laptop/Pi as home server. Node.js + Fastify + PostgreSQL on Docker. WiFi sync via new `laptop.adapter.ts`. Phone SQLite stays as primary offline store.

**v3 (Future):** Promote laptop backend to cloud (Supabase or Railway). Same adapter pattern — swap `laptop.adapter.ts` URL, or build `cloud.adapter.ts` with Supabase SDK.

---

## Architecture Patterns

### Data Access Layer (DAL)

The single most important architectural rule: **screens never touch the database directly**.

```
Screens / Services
      ↓
src/db/repository.ts          ← only file screens talk to
      ↓
src/db/adapters/sqlite.adapter.ts   (v1)
src/db/adapters/laptop.adapter.ts   (v2, future)
src/db/adapters/cloud.adapter.ts    (v3, future)
```

To migrate from v1 → v2, change one line in `repository.ts`:
```typescript
// v1
const adapter = new SqliteAdapter();
// v2
const adapter = new LaptopAdapter('http://192.168.1.10:3000');
```

All screens and services continue working unchanged.

### React Query + Repository

Screens never call `repository.*` directly either. They use hooks in `src/hooks/`:

```
Screen
  → useMembers() / useDocuments()
    → useQuery({ queryFn: () => repository.members.getAll() })
      → repository.ts
        → sqlite.adapter.ts
          → expo-sqlite
```

This gives automatic caching, loading states, and error handling for free.

### Extraction Stubs (v1 → v1.5)

`src/services/extraction/index.ts` exists in v1 with an empty stub that returns `status: 'failed'`. When v1.5 ships:
1. `ocr.ts` gets the MLKit implementation
2. `structurer.ts` gets the cloud AI call
3. `validator.ts` gets confidence scoring
4. The orchestrator in `index.ts` wires them together

The review screen (`app/document/review.tsx`) already accepts pre-filled data — it was built for manual entry, AI just fills the same fields.

---

## Folder Structure

```
medvault/
├── app/                            # Expo Router — screens only
│   ├── _layout.tsx                 # Root: QueryClientProvider, global.css import
│   ├── (tabs)/
│   │   ├── _layout.tsx             # Tab bar (5 tabs)
│   │   ├── index.tsx               # Dashboard
│   │   ├── members.tsx             # Family list
│   │   ├── documents.tsx           # Document browser
│   │   ├── expenses.tsx            # Expense dashboard
│   │   └── settings.tsx            # App settings
│   ├── member/
│   │   ├── add.tsx                 # Add member form
│   │   ├── [id].tsx                # Member profile
│   │   ├── edit/[id].tsx           # Edit member
│   │   ├── [id]/family-tree.tsx    # Lineage visualization
│   │   ├── [id]/heritage.tsx       # Heritage condition log
│   │   ├── [id]/risks.tsx          # Inherited risk panel
│   │   └── [id]/medicines.tsx      # Prescription history
│   ├── document/
│   │   ├── capture.tsx             # Camera / gallery
│   │   ├── review.tsx              # Extraction review screen
│   │   ├── manual-entry.tsx        # Manual fallback
│   │   ├── [id].tsx                # Document detail
│   │   └── forms/                  # Type-specific forms
│   │       ├── prescription.tsx
│   │       ├── lab.tsx
│   │       ├── bill.tsx
│   │       ├── xray.tsx
│   │       ├── vaccine.tsx
│   │       └── discharge.tsx
│   ├── heritage/add.tsx            # Quick-add ancestor
│   ├── medicine/[name].tsx         # Medicine detail
│   ├── export/[memberId].tsx       # PDF export wizard
│   └── search.tsx                  # Global search
│
├── src/
│   ├── db/
│   │   ├── schema.ts               # SQL DDL — source of truth
│   │   ├── migrations.ts           # runMigrations(db) — call on app boot
│   │   ├── repository.ts           # ⭐ DAL entry point
│   │   └── adapters/
│   │       ├── types.ts            # IAdapter interface
│   │       └── sqlite.adapter.ts   # v1 implementation
│   ├── components/
│   │   ├── ui/                     # Button, Card, Input, Badge, Avatar, EmptyState, ConfidenceDot
│   │   ├── members/                # MemberCard, MemberSelector
│   │   ├── documents/              # DocumentCard, DocumentTypeGrid, ImagePageViewer
│   │   ├── heritage/               # FamilyTreeNode, RiskBadge
│   │   └── expenses/               # ExpenseChart
│   ├── services/
│   │   ├── extraction/             # AI pipeline (stubs in v1)
│   │   │   ├── index.ts
│   │   │   ├── ocr.ts
│   │   │   ├── structurer.ts
│   │   │   └── validator.ts
│   │   ├── medicineInfo.ts         # Local lookup → OpenFDA → cache (Phase 6)
│   │   ├── pdfExport.ts            # PDF generation (Phase 8)
│   │   ├── fileStorage.ts          # Image save/load (expo-file-system)
│   │   ├── screening.ts            # Rule-based preventive care (Phase 3)
│   │   └── sync.ts                 # No-op stub (v2 only)
│   ├── stores/
│   │   ├── appStore.ts             # defaultCountryCode, hasCompletedOnboarding
│   │   ├── memberStore.ts          # selectedMember
│   │   └── uploadStore.ts          # active upload session
│   ├── hooks/
│   │   ├── useMembers.ts           # React Query over repository.members
│   │   ├── useDocuments.ts         # React Query over repository.documents
│   │   └── useLocale.ts            # formatCurrency/formatDate per country
│   ├── types/
│   │   ├── member.types.ts
│   │   ├── document.types.ts
│   │   ├── medicine.types.ts
│   │   ├── heritage.types.ts
│   │   └── extraction.types.ts
│   ├── utils/
│   │   ├── locale.ts               # formatCurrency(), formatDate(), getCurrencyForCountry()
│   │   ├── dateHelpers.ts          # toISODate(), parseISODate(), ageFromDob()
│   │   ├── idGen.ts                # generateId() — UUID v4
│   │   └── validators.ts           # Shared Zod schemas: memberSchema, documentSchema
│   └── constants/
│       ├── countries.ts            # 10 countries: code, name, currency, date format
│       ├── documentTypes.ts        # DOCUMENT_TYPE_LABELS, DOCUMENT_TYPE_ICONS
│       ├── colors.ts               # Design tokens (mirrors tailwind.config.js)
│       └── medicalConditions.ts    # COMMON_CONDITIONS, BLOOD_GROUPS
│
├── data/
│   └── medicines.json              # 500+ bundled medicine entries (Phase 6)
│
├── __tests__/
│   ├── utils/locale.test.ts        # ✅ passes (first test written)
│   ├── db/repository.test.ts       # placeholder
│   └── services/medicineInfo.test.ts # placeholder
│
├── .husky/
│   ├── commit-msg                  # Enforces commit format
│   ├── pre-commit                  # lint-staged
│   └── pre-push                    # tsc --noEmit
│
├── CLAUDE.md                       # High-level handoff + rules
├── ARCHITECTURE.md                 # This file
├── app.json                        # Expo config
├── babel.config.js                 # NativeWind babel preset
├── metro.config.js                 # NativeWind metro transform
├── tailwind.config.js              # Tailwind + NativeWind preset
├── global.css                      # @tailwind directives
├── nativewind-env.d.ts             # NativeWind TypeScript types
├── tsconfig.json                   # Strict TS + path aliases (@/*)
├── .eslintrc.js                    # eslint-config-expo + prettier
├── .prettierrc                     # 2 spaces, single quotes, trailing commas
└── package.json
```

---

## Database Schema

Full DDL: `src/db/schema.ts`. Tables and their relationships:

| Table | Purpose | Key FKs |
|---|---|---|
| `members` | Family member profiles | — |
| `app_settings` | Key-value store for app preferences | — |
| `documents` | All medical documents | `member_id → members` |
| `document_images` | Multi-page image URIs per document | `document_id → documents` |
| `lab_results` | Extracted test parameters and values | `document_id → documents` |
| `bill_items` | Line items from medical bills | `document_id → documents` |
| `vaccinations` | Vaccination records | `member_id → members`, `document_id → documents` |
| `medicines` | Medicines extracted from prescriptions | `document_id → documents` |
| `medicine_info` | Master medicine library (local cache) | — |
| `relationships` | Family lineage links | `from_member_id, to_member_id → members` |
| `heritage_conditions` | Inherited conditions per ancestor | `member_id → members` |
| `screening_suggestions` | Preventive care recommendations | `member_id → members` |
| `extraction_confidence` | Per-field AI confidence scores | `document_id → documents` |

**Schema version:** `SCHEMA_VERSION = 1` in `src/db/schema.ts`. Increment before adding/removing columns.

---

## Commit Message Format

Enforced by `.husky/commit-msg` for **all git clients** (terminal, VS Code, Claude Code).

```
[TYPE] Short description               (max 72 chars)
[TYPE: MD-XXXX] Short description      (ticket-linked)
```

| TYPE | When |
|---|---|
| `STORY: MD-XXXX` | Feature tied to a story ticket |
| `DEFECT: MD-XXXX` | Bug fix tied to a ticket |
| `CHORE` | Config, deps, tooling |
| `FEAT` | Feature without a ticket |
| `FIX` | Bug fix without a ticket |
| `DOCS` | Documentation only |
| `REFACTOR` | Restructuring, no behavior change |
| `TEST` | Adding or fixing tests |

```bash
git commit -m "[CHORE] Configure Husky and lint-staged"
git commit -m "[STORY: MD-1234] Add family member CRUD screens"
git commit -m "[FEAT] Scaffold repository DAL with SQLite adapter"
```

---

## Dev Environment — iOS Simulator

**One-time setup:**
1. Mac App Store → install **Xcode** (~15 GB)
2. Open Xcode once → accept license → install components
3. `xcode-select --install` (Command Line Tools)
4. Xcode → Settings (⌘,) → Platforms → **+** → iOS 17 → Download

**Daily workflow:**
```bash
cd medvault
npx expo start       # start dev server
# Press  i  to open iOS Simulator
```

**Debugging shortcuts:**

| Action | Key |
|---|---|
| Reload app | `r` in terminal |
| Open dev menu | `⌘D` in simulator |
| Copy error from red screen | Click error text → `⌘C` |
| Full stack trace | Tap the red overlay |

**When native modules are needed (v1.5):** Switch from Expo Go to a dev build:
```bash
npx expo run:ios     # ~3 min first build, then fast
```

---

## Key Config Files

| File | Purpose | When to change |
|---|---|---|
| `src/db/schema.ts` | SQL DDL | Adding/removing tables or columns |
| `src/db/repository.ts` | DAL adapter selection | Migrating v1 → v2 → v3 |
| `tailwind.config.js` | NativeWind + theme tokens | Adding design tokens |
| `tsconfig.json` | TypeScript config + path aliases | Adding new `@/` aliases |
| `.eslintrc.js` | ESLint rules | Only with user approval |
| `app.json` | Expo config (bundle ID, permissions) | Before new native feature |
| `babel.config.js` | Babel presets (NativeWind) | Only with user approval |
| `metro.config.js` | Metro bundler (NativeWind transform) | Only with user approval |
| `.husky/commit-msg` | Commit format regex | Updating commit convention |
