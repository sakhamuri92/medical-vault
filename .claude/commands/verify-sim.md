# verify-sim

Iterative build verification for MedVault. Runs TypeScript, lint, tests, and Expo bundle checks — fixes issues it finds — for up to **5 iterations**. After 5 iterations (or when everything is clean), compacts context and asks whether any remaining problems need a major architectural decision.

---

## How to run

Invoke with `/verify-sim` from inside the `medvault/` project root.

---

## Instructions for Claude

You are running an iterative build-and-fix loop. Follow these steps exactly.

### Setup

Set `ITERATION = 1`. Set `ALL_PASS = false`.

Work in `/Users/venky/Documents/medical-vault/medvault/` for all commands.

---

### Each iteration (repeat while ITERATION ≤ 5 and ALL_PASS = false)

**Step 1 — TypeScript check**
```bash
npm run typecheck 2>&1
```
Collect all errors. For each error: read the file, identify the type problem, fix it. Re-run after fixing to confirm resolved.

**Step 2 — Lint check**
```bash
npm run lint 2>&1
```
Collect all ESLint warnings/errors. Fix auto-fixable issues with `eslint --fix`. For others: read the file, fix manually. Do NOT disable ESLint rules — fix the underlying code. If fixing a lint rule would require an architectural change, record it as a **major issue** instead of fixing it.

**Step 3 — Tests**
```bash
npm test -- --watchAll=false 2>&1
```
If tests fail: read the failing test and the source file it tests. Fix the source file (not the test) unless the test itself is wrong. Re-run to confirm passing.

**Step 4 — Expo bundle check**
```bash
npx expo export --platform ios --dev false 2>&1 | tail -40
```
This does a full Metro bundle without a simulator. Collect any Babel/Metro/module errors. Fix them. Common fixes:
- Babel plugin misloaded as preset (or vice versa) → fix `babel.config.js`
- Missing package → check `package.json`, install with `npm install <pkg> --legacy-peer-deps`
- Import path error → fix the import in the source file
- Package version mismatch → check `npx expo-doctor` output and downgrade with `npm install <pkg>@<version> --legacy-peer-deps`

**Step 5 — Report**

Print a summary table:

| Check | Status | Issues fixed this iteration |
|---|---|---|
| TypeScript | ✅ / ❌ | count |
| Lint | ✅ / ❌ | count |
| Tests | ✅ / ❌ | count |
| Expo bundle | ✅ / ❌ | count |

If all four checks are ✅: set `ALL_PASS = true` and exit the loop early.
Otherwise: increment `ITERATION` and repeat.

---

### After the loop

**If ALL_PASS = true (clean before 5 iterations):**

> All checks pass after ITERATION iteration(s). The app should bundle cleanly.
>
> Are there any issues you noticed while testing in the simulator that still need fixing? If yes, describe them and I'll continue.

**If ITERATION reached 5 and ALL_PASS = false:**

1. List every **unfixed issue** that remains, grouped by type (TypeScript / Lint / Test / Bundle).
2. For each unfixed issue, explain why it wasn't auto-fixed (e.g. needs architectural decision, missing native dependency, requires Xcode).
3. Run `/compact` to compress the conversation context.
4. Then ask:

> I've completed 5 verification iterations. Here's what remains unfixed:
> [list]
>
> Do any of these need a major architectural change (e.g. switching a library, changing the DAL interface, updating the DB schema)? If so, describe the desired outcome and I'll plan the change with you before implementing.

---

## Rules during this skill

- Never call `expo-sqlite` directly from screen files — all DB access via `src/db/repository.ts`
- Never disable ESLint rules — fix the code
- Never use `any` in TypeScript — use proper types or `unknown` + guard
- If a fix would change `app.json`, `tailwind.config.js`, `tsconfig.json`, `metro.config.js`, or the DB schema — stop and ask the user before making it
- All npm installs use `--legacy-peer-deps` (React 19.1.0 peer conflict)
- Use `npm run typecheck` not `tsc` directly (uses project tsconfig)
