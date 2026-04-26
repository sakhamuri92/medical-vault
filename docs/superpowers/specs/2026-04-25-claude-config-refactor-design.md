# Claude Config Refactor — Design Spec

**Date:** 2026-04-25
**Status:** Approved
**Scope:** `.claude/` directory only — no `src/`, `app/`, or runtime code changes

---

## Objective

Refine the Claude Code configuration to:

1. Integrate Superpowers skills with the existing multi-agent orchestrator as the single entry point
2. Ensure the system works identically without Superpowers (VS Code / no-plugin mode)
3. Remove the `security-compliance` agent and merge slim security rules into `code-guardian`
4. Strip all rule content that duplicates what the `expo` plugin skill already covers
5. Replace `settings.local.json` with a committed `settings.json` so plugin config is shared across contributors

---

## Tech Stack Context

The project remains a local-first Expo app:

- Expo SDK ~54, Expo Router ~6, React 19, React Native 0.81.5
- NativeWind 4.2.3, expo-sqlite ~16.0.10 (offline cache), expo-secure-store (auth token)
- Zustand 5, TanStack Query 5, React Hook Form 7 + Zod 4
- react-native-reanimated 4.1.1, react-native-svg 15.12.1
- expo-document-picker, expo-image-picker, expo-file-system, expo-sharing, expo-haptics

---

## Rule Files

### Principle

**The `expo` plugin skill is the single source of truth for all Expo/RN/NativeWind conventions.**
Project rule files exist only for overrides that the expo skill does not cover.
If a rule duplicates expo skill content, remove it — do not re-add it in the future.
If the expo skill improves, project rules shrink further.

For UI design patterns not covered by the expo skill, the `frontend-design` skill is the secondary source.

### `coding-standards.md` — rewritten (project overrides only)

Keep:

- NativeWind color token names: `primary-50/100/500/600/700/900`, `success`, `warning`, `danger`
- Function length cap: ~50 lines target, 60 hard cap
- Naming conventions: `isLoading`/`hasX`/`shouldX` booleans, `handleX` event handlers, no abbreviations
- Architecture flow: `screen → hook (useQuery/useMutation) → repository.ts → adapter → SQLite`
- `tailwindcss` version lock: must stay on v3.x (NativeWind v4 incompatible with Tailwind v4)

Remove (covered by expo skill):

- RN elements list (View, Text, Pressable, etc.) and HTML-tag anti-patterns
- NativeWind className vs style examples
- FlatList/useCallback patterns
- KeyboardAvoidingView pattern
- Platform.OS forks
- expo-constants vs process.env
- useRouter / useLocalSearchParams usage

### `accessibility.md` — rewritten (medical-app overrides only)

Keep (medical-app specific, not covered by expo skill):

- A11Y-S01: Color + icon + text — never color alone for error/warning states
- A11Y-S02: Announce dynamic content changes via `AccessibilityInfo`
- A11Y-S03: Form validation errors use `accessibilityLiveRegion`
- A11Y-S04: Modal focus management (`accessibilityViewIsModal`)
- A11Y-S05: Never `allowFontScaling={false}` — layout must support 200% text scale
- A11Y-S06: Minimum contrast ratios (4.5:1 normal, 3:1 large text)
- A11Y-S07: FlatList/SectionList `accessibilityRole="list"` + items `"listitem"`

Remove (covered by expo skill):

- Generic WCAG rules (accessibilityLabel, accessibilityRole, accessibilityHint, accessibilityState basics)
- Touch target minimums (44x44, hitSlop)
- TextInput label pairing

### `code-quality.md` — rewritten (ESLint + slim security)

Keep:

- ESLint config reference: extends `['expo', 'prettier']`, `--max-warnings 0`
- `@typescript-eslint/no-explicit-any` fix options
- `@typescript-eslint/no-unused-vars` (prefix `_` for required unused params)
- `no-console` (only `console.warn`/`console.error` allowed)
- `prettier/prettier` auto-fix command

Slim security rules (merged from retired `security-compliance` agent):

- No hardcoded secrets (`sk-`, `pk_`, `Bearer `, `AIza`, `AKIA` prefixes)
- No PHI in `console.warn/error` — entity IDs only
- `expo-secure-store` for auth token — never `AsyncStorage` or plain SQLite for tokens
- Deep link handlers must validate scheme = `medvault://` and route against explicit allowlist

Remove:

- SEC-01 Zod at DB writes (too implementation-specific; Zod usage is covered in hooks)
- SEC-02 SQL column allowlist (adapter-specific, not a UI concern)
- SEC-03 UUID path validation (adapter-specific)
- SEC-04 No eval (standard, covered by ESLint)
- SEC-07 AsyncStorage prohibition (replaced by expo-secure-store rule above)
- SEC-09 Medicine data source (app-specific, handled in feature work)
- SEC-10 Medical disclaimer (app-specific, handled in feature work)

### `examples/` directory — deleted entirely

All 6 files removed:

- `repository-pattern.md` — expo skill covers this
- `security-patterns.md` — simplified rules now inline in code-quality.md
- `zod-validation.md` — expo skill covers form validation patterns
- `typescript-patterns.md` — expo skill covers TypeScript patterns
- `nativewind-patterns.md` — expo skill covers NativeWind
- `react-native-elements.md` — expo skill covers RN elements

---

## Agents

### Retained: 3 agents

#### `orchestrator.md` — rewritten

Single entry point for all sessions. Routing table:

| Task type                     | Superpowers available | Action                                                               |
| ----------------------------- | --------------------- | -------------------------------------------------------------------- |
| Design / feature / brainstorm | Yes                   | Invoke `brainstorming` skill → expo skill or `frontend-design` skill |
| Design / feature / brainstorm | No                    | Ask clarifying questions inline using built-in workflow              |
| Code generation / review      | Yes or No             | Invoke `code-guardian` (works identically either way)                |
| Pre-merge review              | Yes                   | Invoke `code-review` skill + `code-guardian`                         |
| Pre-merge review              | No                    | Invoke `code-guardian` only                                          |
| Session end / docs            | Yes or No             | Invoke `doc-writer` → writes memory + CLAUDE.md update               |
| Architecture change           | —                     | Stop and ask user                                                    |

After all sub-agent work: `doc-writer` writes consolidated summary to memory.

Report format unchanged (Orchestrator Report block with sub-agent results + next steps).

#### `code-guardian.md` — updated

Inline enforcement checklist updated:

- Remove: DAL violation check, `expo-sqlite` import check, `repository.create/update` without safeParse, medicine disclaimer, LLM medicine content
- Add (from retired security-compliance): hardcoded secrets check, PHI in console check, `expo-secure-store` for auth token check, deep link scheme validation check
- Reference expo skill as primary source for Expo conventions — do not duplicate

Audit report format unchanged.

#### `doc-writer.md` — updated

New explicit responsibility: when any agent is added/removed or a rule file changes, update:

- `CLAUDE.md` Key File Locations table
- `CLAUDE.md` Key Rules references
- `ARCHITECTURE.md` if tech stack changes

This mirrors the existing ARCHITECTURE.md folder-tree discipline.

### Retired: 1 agent

#### `security-compliance.md` — deleted

Slim security rules merged into `code-guardian.md`. Medical-specific audit rules (PHI DAL, medicine data source, disclaimer) handled in feature work, not a standing agent.

---

## Settings

### `.claude/settings.json` — new, committed to git

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

All contributors get the same plugin setup on clone. No manual setup required.

`supabase@claude-plugins-official` removed — deferred to v3. Re-add when v3 work begins.

### `.claude/settings.local.json` — kept for contributor overrides

Local overrides only (e.g., disable a plugin for a specific machine). Gitignored by default.

---

## Hooks

### `hooks.json` — minor updates

**Stop hook** (unchanged in behavior, updated message):

```
"Session ending — orchestrator will route to doc-writer for memory + CLAUDE.md update"
```

**PreToolUse (Edit|Write)** — unchanged: code-guardian reminder.

**PostToolUse (Edit|Write)** — new: code-guardian inline check reminder after edits complete.

---

## CLAUDE.md Updates

Doc-writer updates these sections as part of this refactor delivery:

- **Key File Locations table**: remove security-compliance row, remove all examples/ rows
- **Key Rules section**: update descriptions to reflect slimmed rule files
- **When to Stop and Ask**: remove DB-specific stop conditions that no longer exist as rules

Session Handoff block ownership is unchanged (doc-writer, every session end).

---

## Graceful Degradation

When Superpowers is not enabled:

- Orchestrator detects unavailable skills and routes directly to agents
- Code-guardian enforces all rules from its own checklist (no skill dependency)
- Doc-writer writes memory and CLAUDE.md updates independently
- Brainstorming falls back to orchestrator's inline clarifying-question workflow
- Behavior matches current VS Code / no-plugin experience exactly

No hard stops. No warnings. Transparent fallback.

---

## What Does NOT Change

- `CLAUDE.md` session handoff format
- `ARCHITECTURE.md` structure
- Agent report formats (Orchestrator Report, code-guardian Audit)
- Memory directory location and file names
- Git hooks (Husky commit-msg, pre-commit, pre-push)
- Any file in `src/`, `app/`, or project runtime code
