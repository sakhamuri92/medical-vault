# Claude Config Refactor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor `.claude/` configuration to integrate Superpowers skills with the existing orchestrator, strip all rules that duplicate what the expo plugin skill covers, merge security-compliance into code-guardian, and commit a shared `settings.json` for all contributors.

**Architecture:** The orchestrator becomes the single routing entry point — it invokes Superpowers skills (brainstorming, frontend-design, code-review) when available, and falls back to custom agents when not. Rule files become thin project-override docs that defer to the expo plugin skill for all Expo/RN/NativeWind conventions.

**Tech Stack:** Claude Code agents (`.md` frontmatter), JSON hooks, NativeWind v4, Expo SDK 54 project.

**Spec:** `docs/superpowers/specs/2026-04-25-claude-config-refactor-design.md`

---

## File Map

| Action  | Path                                               |
| ------- | -------------------------------------------------- |
| Delete  | `.claude/rules/examples/accessibility-patterns.md` |
| Delete  | `.claude/rules/examples/nativewind-patterns.md`    |
| Delete  | `.claude/rules/examples/react-native-elements.md`  |
| Delete  | `.claude/rules/examples/repository-pattern.md`     |
| Delete  | `.claude/rules/examples/security-patterns.md`      |
| Delete  | `.claude/rules/examples/typescript-patterns.md`    |
| Delete  | `.claude/agents/security-compliance.md`            |
| Rewrite | `.claude/rules/coding-standards.md`                |
| Rewrite | `.claude/rules/accessibility.md`                   |
| Rewrite | `.claude/rules/code-quality.md`                    |
| Rewrite | `.claude/agents/orchestrator.md`                   |
| Rewrite | `.claude/agents/code-guardian.md`                  |
| Update  | `.claude/agents/doc-writer.md`                     |
| Create  | `.claude/settings.json`                            |
| Update  | `.claude/hooks.json`                               |
| Update  | `CLAUDE.md`                                        |

---

## Task 1: Delete examples/ directory and security-compliance agent

**Files:**

- Delete: `.claude/rules/examples/` (6 files)
- Delete: `.claude/agents/security-compliance.md`

- [ ] **Step 1: Delete all 6 example files**

```bash
rm .claude/rules/examples/accessibility-patterns.md \
   .claude/rules/examples/nativewind-patterns.md \
   .claude/rules/examples/react-native-elements.md \
   .claude/rules/examples/repository-pattern.md \
   .claude/rules/examples/security-patterns.md \
   .claude/rules/examples/typescript-patterns.md
```

- [ ] **Step 2: Delete security-compliance agent**

```bash
rm .claude/agents/security-compliance.md
```

- [ ] **Step 3: Verify deletions**

```bash
ls .claude/rules/examples/ 2>&1
ls .claude/agents/
```

Expected output for `examples/`:

```
ls: .claude/rules/examples/: No such file or directory
```

Expected output for `agents/`:

```
code-guardian.md  doc-writer.md  orchestrator.md
```

- [ ] **Step 4: Commit**

```bash
git add -A .claude/rules/examples/ .claude/agents/security-compliance.md
git commit -m "[chore] Remove examples/ rule files and security-compliance agent"
```

---

## Task 2: Rewrite coding-standards.md

**Files:**

- Rewrite: `.claude/rules/coding-standards.md`

- [ ] **Step 1: Write the new file**

Replace the entire contents of `.claude/rules/coding-standards.md` with:

```markdown
# MedVault Coding Standards

**Primary source:** `expo` plugin skill — authoritative for all Expo/RN/NativeWind conventions.
**This file:** Project-specific overrides only. Never duplicate what the expo skill covers.
**Secondary source for UI design:** `frontend-design` plugin skill.
**Last updated:** 2026-04-25

## NativeWind Color Tokens

Project-defined tokens in `tailwind.config.js`:

| Token                        | Use                            |
| ---------------------------- | ------------------------------ |
| `primary-50` / `primary-100` | Backgrounds, tints             |
| `primary-500`                | Mid accent                     |
| `primary-600`                | Main brand (buttons, links)    |
| `primary-700`                | Dark accent (text on light bg) |
| `primary-900`                | Darkest primary                |
| `success`                    | Success states                 |
| `warning`                    | Warning states                 |
| `danger`                     | Error / danger states          |

Use only these tokens. Never hardcode hex values in `className` strings.

`tailwindcss` MUST stay on v3.x — NativeWind v4 is incompatible with Tailwind v4.

## Function Length

Target ~50 lines. Hard cap 60 lines — split if exceeded.
Extract computation to `src/utils/`. Extract reusable JSX to `src/components/`.

## Naming Conventions

- Booleans: `is`/`has`/`should` prefix — `isLoading`, `hasCompletedOnboarding`
- Event handlers: `handle` prefix — `handleMemberPress`
- Variables: descriptive camelCase — `memberCountryCode` not `code`
- No abbreviations: write `error`, `button`, `value`, `callback`, `function`, `message`

## Architecture Flow
```

screen (app/) → hook (useQuery/useMutation) → repository.ts → adapter → SQLite

```

- Screens render JSX and call hooks only — no `repository`, no `expo-sqlite`, no `fetch`
- Zustand = global UI state | React Query = async/DB state | `useState` = local only

## Comments Policy

Default: no comments. Add only when the WHY is non-obvious.
```

- [ ] **Step 2: Verify file length and key content**

```bash
wc -l .claude/rules/coding-standards.md
grep -c "expo plugin skill" .claude/rules/coding-standards.md
grep "primary-600" .claude/rules/coding-standards.md
```

Expected:

```
      52 .claude/rules/coding-standards.md
1
| `primary-600` | Main brand (buttons, links) |
```

- [ ] **Step 3: Commit**

```bash
git add .claude/rules/coding-standards.md
git commit -m "[chore] Slim coding-standards to project overrides only, defer to expo skill"
```

---

## Task 3: Rewrite accessibility.md

**Files:**

- Rewrite: `.claude/rules/accessibility.md`

- [ ] **Step 1: Write the new file**

Replace the entire contents of `.claude/rules/accessibility.md` with:

````markdown
# MedVault Accessibility Rules

**Primary source:** `expo` plugin skill — authoritative for WCAG basics, touch targets (44×44), accessibilityLabel, accessibilityRole, accessibilityHint, accessibilityState, TextInput label pairing.
**This file:** Medical-app-specific overrides only. Never duplicate what the expo skill covers.
**Standard:** WCAG 2.1 Level AA
**Last updated:** 2026-04-25

## Medical-App Overrides

### A11Y-S01: No color as sole information carrier [STRICT]

Error/warning states need text + icon, not just color.
Applies to: lab results, risk badges, medication alerts, expense warnings.

```tsx
// Wrong — color only
<View className="bg-red-500 p-2" />

// Correct — color + icon + text
<View className="bg-red-50 border border-red-200 flex-row items-center gap-2 p-3 rounded-lg">
  <Text accessibilityElementsHidden={true} className="text-red-600">!</Text>
  <Text className="text-red-700 text-sm font-medium">High risk — consult your doctor</Text>
</View>
```
````

### A11Y-S02: Announce dynamic content changes [STRICT]

Form results, upload progress, search results → `AccessibilityInfo.announceForAccessibility`.

```tsx
import { AccessibilityInfo } from 'react-native';
AccessibilityInfo.announceForAccessibility('Member record saved successfully');
```

### A11Y-S03: Form validation errors use accessibilityLiveRegion [STRICT]

Form validation errors: `accessibilityLiveRegion="polite"`.
Critical medical alerts: `accessibilityLiveRegion="assertive"`.

```tsx
{
  errors.name && (
    <Text
      accessibilityLiveRegion="polite"
      accessibilityRole="alert"
      className="text-red-600 text-sm mt-1"
    >
      {errors.name.message}
    </Text>
  );
}
```

### A11Y-S04: Modal focus management [STRICT]

Modals need `accessibilityViewIsModal={true}`. Must have accessible close button.

```tsx
<Modal visible={isVisible} accessibilityViewIsModal={true}>
  <Pressable onPress={handleClose} accessibilityLabel="Close" accessibilityRole="button">
    ...
  </Pressable>
</Modal>
```

### A11Y-S05: Support dynamic text sizes [STRICT]

Never set `allowFontScaling={false}` on any `Text`. Layout must accommodate 200% text scale without truncation.

### A11Y-S06: Sufficient color contrast [STRICT]

Normal text (<18pt): 4.5:1 min | Large text (≥18pt / 14pt bold): 3:1 min | UI components: 3:1 min.
`text-gray-400` on white fails for body text — use only for placeholder text.

### A11Y-S07: FlatList/SectionList accessibility [STRICT]

Container: `accessibilityRole="list"`. Each item component root: `accessibilityRole="listitem"`.

```tsx
<FlatList accessibilityRole="list" ... />
// inside renderItem:
<View accessibilityRole="listitem">...</View>
```

````

- [ ] **Step 2: Verify file content**

```bash
grep -c "A11Y-S0" .claude/rules/accessibility.md
grep "expo plugin skill" .claude/rules/accessibility.md
````

Expected:

```
7
**Primary source:** `expo` plugin skill — authoritative for WCAG basics...
```

- [ ] **Step 3: Commit**

```bash
git add .claude/rules/accessibility.md
git commit -m "[chore] Slim accessibility to medical-app overrides only, defer to expo skill"
```

---

## Task 4: Rewrite code-quality.md

**Files:**

- Rewrite: `.claude/rules/code-quality.md`

- [ ] **Step 1: Write the new file**

Replace the entire contents of `.claude/rules/code-quality.md` with:

````markdown
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
````

### SEC-03: expo-secure-store for auth token [CRITICAL]

Auth tokens must be stored via `expo-secure-store` only.
Never use `AsyncStorage`, never store tokens in plain `expo-sqlite`.

### SEC-04: Deep link URL allowlisting [HIGH]

`expo-linking` handlers must validate scheme = `medvault://` and route against an explicit allowlist before processing params.

````

- [ ] **Step 2: Verify file content**

```bash
grep -c "SEC-0" .claude/rules/code-quality.md
grep "expo-secure-store" .claude/rules/code-quality.md
````

Expected:

```
4
Auth tokens must be stored via `expo-secure-store` only.
```

- [ ] **Step 3: Commit**

```bash
git add .claude/rules/code-quality.md
git commit -m "[chore] Slim code-quality rules, merge SEC rules from retired security-compliance"
```

---

## Task 5: Rewrite orchestrator.md

**Files:**

- Rewrite: `.claude/agents/orchestrator.md`

- [ ] **Step 1: Write the new file**

Replace the entire contents of `.claude/agents/orchestrator.md` with:

```markdown
---
name: orchestrator
description: 'Spawn when starting a complex task, a new session, or a pre-merge review. Routes to Superpowers skills when available, falls back to custom agents when not. Always the single entry point — never spawn sub-agents directly.'
model: claude-sonnet-4-6
---

You are the orchestrator for MedVault. You are the single entry point for all sessions. You coordinate — you do not write code or docs yourself.

## Project Memory

Read at session start:

- `/Users/venky/.claude/projects/-Users-venky-Documents-medical-vault-medvault/memory/MEMORY.md` — index
- `/Users/venky/.claude/projects/-Users-venky-Documents-medical-vault-medvault/memory/project_medvault.md` — phase + facts
- `/Users/venky/.claude/projects/-Users-venky-Documents-medical-vault-medvault/memory/user_preferences.md` — working preferences
- `/Users/venky/Documents/medical-vault/medvault/CLAUDE.md` — session handoff state

## Task Routing

| Task type                     | Superpowers available | Action                                                 |
| ----------------------------- | --------------------- | ------------------------------------------------------ |
| Design / feature / brainstorm | Yes                   | Invoke `superpowers:brainstorming` skill               |
| Design / feature / brainstorm | No                    | Run inline clarifying-question workflow (see below)    |
| Code generation / review      | Yes or No             | Invoke `code-guardian` sub-agent                       |
| Pre-merge review              | Yes                   | Invoke `code-review` skill + `code-guardian` sub-agent |
| Pre-merge review              | No                    | Invoke `code-guardian` sub-agent only                  |
| Session end / docs            | Yes or No             | Invoke `doc-writer` sub-agent                          |
| Architecture change requested | —                     | Stop and ask user — never proceed unilaterally         |

**After all sub-agent work completes:** invoke `doc-writer` to write consolidated summary to memory and sync CLAUDE.md.

## Superpowers Detection

Attempt to invoke the relevant Superpowers skill via the `Skill` tool.
If the skill is unavailable (tool error or plugin not enabled), fall back to the inline workflow silently — no warnings, no hard stops. Behavior must match the VS Code / no-plugin experience exactly.

## Inline Brainstorm Workflow (no Superpowers)

When Superpowers is unavailable and the task is design/feature/brainstorm:

1. Explore project context: read CLAUDE.md, ARCHITECTURE.md, recent `git log --oneline -10`
2. Ask clarifying questions one at a time — purpose, constraints, success criteria
3. Propose 2–3 approaches with trade-offs and a recommendation
4. Present design section by section, get approval after each
5. Invoke `doc-writer` to write spec to `docs/superpowers/specs/`
6. Route to `code-guardian` for implementation quality enforcement

## Sub-Agents

| Agent           | subagent_type   | Use when                                                   |
| --------------- | --------------- | ---------------------------------------------------------- |
| `code-guardian` | `code-guardian` | Code review, auditing files, enforcing standards           |
| `doc-writer`    | `doc-writer`    | Session handoff, CLAUDE.md, ARCHITECTURE.md, memory writes |

## Session Types

**Pre-merge review:**

1. Spawn `code-guardian` on changed files. Wait for report.
2. If Superpowers available: also invoke `code-review` skill on same files.
3. After both pass: spawn `doc-writer` to update CLAUDE.md handoff.
4. Remind: `npm run typecheck && npm run lint && npm test -- --watchAll=false`
5. If deps/config changed: remind to run `npx expo-doctor`

**End-of-session:**

1. Spawn `doc-writer` — updates CLAUDE.md handoff + project memory
2. Remind: commit in-progress work with `[WIP]` prefix
3. Remind: `npm run typecheck && npm run lint`

## Consolidated Report Format
```

## Orchestrator Report

**Session:** [YYYY-MM-DD] | **Phase:** [from CLAUDE.md] | **Task:** [what was requested]

### Sub-agent results

code-guardian: [N critical, N warnings — or "not run"]
code-review skill: [summary — or "not run / unavailable"]
doc-writer: [what was updated — or "not run"]

### Next steps

1. [Top priority]
2. [Second action, if any]

```

## What You Never Do

- Write code → route to code-guardian
- Write documentation → route to doc-writer
- Make architectural decisions → stop and ask user
- Modify config files without explicit user approval
- Spawn security-compliance (retired) → code-guardian handles security inline
```

- [ ] **Step 2: Verify routing table and Superpowers detection sections exist**

```bash
grep -c "Superpowers" .claude/agents/orchestrator.md
grep "code-review" .claude/agents/orchestrator.md | head -3
grep "security-compliance" .claude/agents/orchestrator.md
```

Expected:

```
5
2. If Superpowers available: also invoke `code-review` skill on same files.
| Pre-merge review              | Yes                   | Invoke `code-review` skill + `code-guardian` sub-agent |
Spawn security-compliance (retired) → code-guardian handles security inline
```

- [ ] **Step 3: Commit**

```bash
git add .claude/agents/orchestrator.md
git commit -m "[chore] Rewrite orchestrator with Superpowers routing and graceful degradation"
```

---

## Task 6: Rewrite code-guardian.md

**Files:**

- Rewrite: `.claude/agents/code-guardian.md`

- [ ] **Step 1: Write the new file**

Replace the entire contents of `.claude/agents/code-guardian.md` with:

```markdown
---
name: code-guardian
description: 'Always-active code quality enforcer for MedVault. Inline: self-corrects during code generation. Explicit: spawn for a full audit. Defers to expo plugin skill for Expo/RN/NativeWind conventions — never duplicates them.'
model: claude-sonnet-4-6
---

You are the code guardian for MedVault. You enforce project-specific rules on every code change. You do not duplicate what the `expo` plugin skill covers.

## Rule Files

Read at session start:

1. `.claude/rules/coding-standards.md` — project overrides: tokens, naming, architecture flow, function length
2. `.claude/rules/code-quality.md` — ESLint rules + slim security (SEC-01 through SEC-04)
3. `.claude/rules/accessibility.md` — medical-app a11y overrides (A11Y-S01 through A11Y-S07)

**Expo/RN/NativeWind conventions:** defer to the `expo` plugin skill. Do not re-check what it covers.
**UI design patterns:** defer to the `frontend-design` plugin skill.

## Inline Enforcement (during code generation)

Self-correct before outputting if you detect any of the following. Rewrite the violating section — do not output bad code and comment on it afterward.

**Code quality:**

1. NativeWind: hardcoded hex in `className` instead of project color tokens (`primary-50/100/500/600/700/900`, `success`, `warning`, `danger`)
2. Function over ~50 lines — extract
3. `any` type — use interface, `unknown` + type guard, or generic `<T>`
4. Abbreviations: `err`, `btn`, `val`, `cb`, `fn`, `msg` — write full words
5. `eslint-disable` comment — fix the code instead
6. `console.log` — remove; PHI in `console.warn/error` — use entity IDs only

**Security:** 7. Hardcoded secret — string with `sk-`, `pk_`, `Bearer `, `AIza`, `AKIA` prefix, or variable `secret`/`apiKey`/`token` assigned a string literal 8. Auth token stored in `AsyncStorage` or plain SQLite — must use `expo-secure-store` 9. Deep link handler without scheme validation (`medvault://`) and route allowlist

**Accessibility (medical-app overrides):** 10. Color-only error/warning state — needs text + icon alongside color 11. `allowFontScaling={false}` on any `Text` 12. Form validation error `Text` without `accessibilityLiveRegion="polite"` 13. `Modal` without `accessibilityViewIsModal={true}` 14. `FlatList`/`SectionList` without `accessibilityRole="list"` on container

## Explicit Audit Report
```

## code-guardian Audit

**Files:** [list] | **Date:** [YYYY-MM-DD]

### Coding Standards Issues (coding-standards.md)

[findings or "None"]

### Code Quality / Security Issues (code-quality.md)

ESLint: [findings or "None"]
Security: [findings or "None"]

### Accessibility Issues (accessibility.md)

[findings or "None"]

### Summary

[N] critical | [N] warnings | [N] clean files
Next: [top 1-2 fixes]

````

## Verification After Changes

```bash
# After dep/config changes only
npx expo-doctor

# Always after code changes
npm run typecheck
npx eslint 'src/**/*.{ts,tsx}' 'app/**/*.{ts,tsx}' --fix
npm run lint
npm test -- --watchAll=false
````

## What You Never Do

- Add `eslint-disable` comments
- Write `any` to satisfy TypeScript
- Log PHI in console output
- Hardcode secrets or API keys
- Store auth tokens outside `expo-secure-store`
- Re-check Expo/RN conventions covered by the expo plugin skill

````

- [ ] **Step 2: Verify inline checklist and expo skill reference**

```bash
grep -c "^\d\+\." .claude/agents/code-guardian.md || grep -c "^[0-9]" .claude/agents/code-guardian.md
grep "expo plugin skill" .claude/agents/code-guardian.md | wc -l
grep "expo-secure-store" .claude/agents/code-guardian.md
````

Expected: checklist items present, 2+ references to expo plugin skill, expo-secure-store mentioned.

- [ ] **Step 3: Commit**

```bash
git add .claude/agents/code-guardian.md
git commit -m "[chore] Rewrite code-guardian with merged security rules and expo skill delegation"
```

---

## Task 7: Update doc-writer.md

**Files:**

- Update: `.claude/agents/doc-writer.md` (add CLAUDE.md Key File Locations ownership)

- [ ] **Step 1: Add the new responsibility section**

In `.claude/agents/doc-writer.md`, find the `## Your Only Jobs` section and replace it with:

```markdown
## Your Only Jobs

1. **Session handoff** — Rewrite the `## ⚠️ Session Handoff State` block in CLAUDE.md.
2. **Architecture updates** — Keep ARCHITECTURE.md accurate: folder tree, schema, tech stack versions, commit format.
3. **CLAUDE.md config sync** — When any agent is added/removed or a rule file changes, update:
   - `CLAUDE.md` Key File Locations table (add/remove rows, update descriptions)
   - `CLAUDE.md` Key Rules section (update rule file descriptions)
4. **JSDoc** — Single-line `/** Why this exists */` ONLY when a future reader would make a wrong assumption.
```

- [ ] **Step 2: Verify the new job is present**

```bash
grep "Key File Locations" .claude/agents/doc-writer.md
grep "config sync" .claude/agents/doc-writer.md
```

Expected: both lines present.

- [ ] **Step 3: Commit**

```bash
git add .claude/agents/doc-writer.md
git commit -m "[chore] Add CLAUDE.md config sync responsibility to doc-writer"
```

---

## Task 8: Create settings.json

**Files:**

- Create: `.claude/settings.json`

- [ ] **Step 1: Create the file**

Create `.claude/settings.json` with this exact content:

```json
{
  "enabledPlugins": {
    "superpowers@claude-plugins-official": true,
    "expo@claude-plugins-official": true,
    "frontend-design@claude-plugins-official": true,
    "skill-creator@claude-plugins-official": true,
    "code-review@claude-plugins-official": true
  }
}
```

- [ ] **Step 2: Validate JSON**

```bash
node -e "JSON.parse(require('fs').readFileSync('.claude/settings.json','utf8')); console.log('valid')"
```

Expected: `valid`

- [ ] **Step 3: Verify supabase plugin is absent**

```bash
grep "supabase" .claude/settings.json
```

Expected: no output (empty — supabase is intentionally excluded until v3).

- [ ] **Step 4: Commit**

```bash
git add .claude/settings.json
git commit -m "[chore] Add committed settings.json with shared plugin config for all contributors"
```

---

## Task 9: Update hooks.json

**Files:**

- Update: `.claude/hooks.json`

- [ ] **Step 1: Write the updated file**

Replace the entire contents of `.claude/hooks.json` with:

```json
{
  "hooks": {
    "Stop": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "echo '\n⚠️  SESSION ENDING — orchestrator will route to doc-writer for memory + CLAUDE.md update.'"
          }
        ]
      }
    ],
    "PreToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "echo 'code-guardian: rules from .claude/rules/ apply to this change'"
          }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "echo 'code-guardian: verify change passes inline checklist before proceeding'"
          }
        ]
      }
    ]
  }
}
```

- [ ] **Step 2: Validate JSON**

```bash
node -e "JSON.parse(require('fs').readFileSync('.claude/hooks.json','utf8')); console.log('valid')"
```

Expected: `valid`

- [ ] **Step 3: Verify PostToolUse hook is present**

```bash
grep "PostToolUse" .claude/hooks.json
```

Expected: `"PostToolUse": [`

- [ ] **Step 4: Commit**

```bash
git add .claude/hooks.json
git commit -m "[chore] Add PostToolUse hook to hooks.json"
```

---

## Task 10: Update CLAUDE.md

**Files:**

- Update: `CLAUDE.md` (Key File Locations table, Key Rules section)

- [ ] **Step 1: Update the Key Rules section**

In `CLAUDE.md`, find and replace the rule file descriptions block:

Find:

```markdown
**Rule files (read during all coding sessions):**

- `.claude/rules/coding-standards.md` — Expo SDK 54, NativeWind v4, naming, architecture
- `.claude/rules/code-quality.md` — ESLint fix guide + sanitization + security (combined)
- `.claude/rules/accessibility.md` — WCAG 2.1 AA + React Native a11y (general + strict)
```

Replace with:

```markdown
**Rule files (read during all coding sessions):**

- `.claude/rules/coding-standards.md` — project overrides only: tokens, naming, architecture; expo skill is primary source
- `.claude/rules/code-quality.md` — ESLint rules + slim security (secrets, PHI logs, secure storage, deep links)
- `.claude/rules/accessibility.md` — medical-app a11y overrides only; expo skill covers generic WCAG
```

- [ ] **Step 2: Update the Key File Locations table**

Find the entire Key File Locations table and replace it with:

```markdown
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
```

- [ ] **Step 3: Verify changes**

```bash
grep "security-compliance" CLAUDE.md
grep "examples/" CLAUDE.md
grep "expo skill" CLAUDE.md
```

Expected:

- First two: no output (both removed)
- Third: present in the rule file descriptions

- [ ] **Step 4: Commit**

```bash
git add CLAUDE.md
git commit -m "[chore] Update CLAUDE.md: remove retired files from Key File Locations, slim Key Rules"
```

---

## Task 11: Final verification

- [ ] **Step 1: Check no unintended files changed**

```bash
git status
```

Expected: `nothing to commit, working tree clean`

- [ ] **Step 2: Verify agent file count**

```bash
ls .claude/agents/
```

Expected:

```
code-guardian.md  doc-writer.md  orchestrator.md
```

- [ ] **Step 3: Verify examples/ is gone**

```bash
ls .claude/rules/
```

Expected:

```
accessibility.md  code-quality.md  coding-standards.md
```

- [ ] **Step 4: Verify settings.json is tracked by git**

```bash
git ls-files .claude/settings.json
```

Expected:

```
.claude/settings.json
```

- [ ] **Step 5: Verify settings.local.json is NOT tracked**

```bash
git ls-files .claude/settings.local.json
```

Expected: no output (empty — local file, not committed).

- [ ] **Step 6: Review commit log**

```bash
git log --oneline -10
```

Expected: 8 new commits (Tasks 1–10, one commit each) on top of the spec commit.
