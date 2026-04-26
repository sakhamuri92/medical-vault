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
