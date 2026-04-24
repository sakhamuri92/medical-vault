# MedVault Coding Standards

**Stack:** React Native + Expo SDK 54 | TypeScript strict | NativeWind v4 | expo-router v6
**Examples:** `.claude/rules/examples/` — load the relevant file when a rule is violated
**Last updated:** 2026-04-24

## React Native Elements → examples/react-native-elements.md

- Use: `View`, `Text`, `Pressable`, `TextInput`, `Image`, `ScrollView`, `FlatList`, `SectionList`
- NEVER: `div`, `span`, `p`, `h1`–`h6`, `button`, `input`, `img` (HTML tags are invalid in RN)
- Use `Pressable` — not `TouchableOpacity` (deprecated in this project)
- Use `FlatList`/`SectionList` for lists — not `ScrollView` wrapping `.map()`

## NativeWind v4 Styling → examples/nativewind-patterns.md

- `className` prop for ALL styling — never `style={{}}`
- Color tokens: `primary-50/100/500/600/700/900`, `success`, `warning`, `danger`
- No hardcoded hex in className strings
- `tailwindcss` MUST stay on v3.x — NativeWind v4 is incompatible with Tailwind v4

## TypeScript → examples/typescript-patterns.md

- No `any` — use `unknown` + type guard, or a defined interface
- No unsafe `!` without a preceding runtime check
- No `as SomeType` cast without a runtime check — use type guards
- All function parameters and return types explicit when inference is ambiguous

## Function Length

- Target ~50 lines. Hard cap 60 lines — split if exceeded
- Extract computation to `src/utils/`. Extract reusable JSX to `src/components/`

## Naming Conventions

- Variables: descriptive camelCase — `memberCountryCode` not `code`
- Booleans: `is`/`has`/`should` prefix — `isLoading`, `hasCompletedOnboarding`
- Event handlers: `handle` prefix — `handleMemberPress`
- No abbreviations: `err`, `btn`, `val`, `cb`, `fn`, `msg` → write full words

## Architecture Rules → examples/repository-pattern.md

- Screens (`app/`): render JSX + call hooks only. No `repository`, no `expo-sqlite`, no `fetch`
- Flow: `screen → hook (useQuery/useMutation) → repository.ts → adapter → SQLite`
- Zustand = global UI state | React Query = async/DB state | `useState` = local only
- No `useEffect` + `setState` for data fetching — use `useQuery`

## Form Standards → examples/zod-validation.md

- `useForm({ resolver: zodResolver(schema) })` with schemas from `src/utils/validators.ts`
- `Controller` wraps custom RN inputs (not `register`)
- `handleSubmit` gates all submissions — never submit raw form values

## Expo SDK 54 Specifics → examples/react-native-elements.md

- `useCallback` for `renderItem` and event-handler props to prevent list re-renders
- `KeyboardAvoidingView` for screens with `TextInput`, `behavior={Platform.OS === 'ios' ? 'padding' : 'height'}`
- `Constants.expoConfig?.extra?.key` from `expo-constants` — never `process.env`
- `expo-file-system/legacy` import (not bare `expo-file-system`)
- `useRouter()` and `useLocalSearchParams()` from expo-router

## Comments Policy

Default: no comments. Add only when the WHY is non-obvious. Never explain what the code does.
