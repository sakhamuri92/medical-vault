# MedVault Accessibility Rules

**Standard:** WCAG 2.1 Level AA | React Native Accessibility API | iOS VoiceOver | Android TalkBack
**Examples:** `.claude/rules/examples/accessibility-patterns.md` — load for code examples
**Last updated:** 2026-04-24

## General Rules (apply everywhere)

### A11Y-01: accessibilityLabel on all interactive elements [REQUIRED]

Every `Pressable`, `TouchableOpacity`, `TouchableHighlight` must have descriptive `accessibilityLabel` (describes the ACTION, not the icon).

### A11Y-02: accessibilityRole on all semantic elements [REQUIRED]

Interactive/tappable = `"button"` | nav link = `"link"` | heading = `"header"` | image = `"image"` | checkbox = `"checkbox"` | tab = `"tab"` | list = `"list"` | alert = `"alert"`
Decorative elements: `accessibilityElementsHidden={true}`

### A11Y-03: accessibilityHint for non-obvious actions [RECOMMENDED]

When action result is non-obvious, describe what will happen.

### A11Y-04: accessibilityState for stateful elements [REQUIRED]

Buttons: `{ disabled }` | tabs: `{ selected }` | loading: `{ busy }` | checkboxes: `{ checked }`

### A11Y-05: Images must have accessibilityLabel or be hidden [REQUIRED]

Meaningful images → `accessibilityLabel` + `accessibilityRole="image"`
Decorative images → `accessibilityElementsHidden={true}` + `importantForAccessibility="no"`

### A11Y-06: TextInput must have accessibilityLabel [REQUIRED]

Always pair with visible label or `accessibilityLabel`. Never rely on `placeholder` alone.

### A11Y-07: Minimum touch target 44x44 points [REQUIRED]

Use `hitSlop` if visual element is smaller. Or `className="min-w-[44px] min-h-[44px]"`.

## Strict Rules (medical app obligations)

### A11Y-S01: No color as sole information carrier [STRICT]

Error/warning states need text + icon, not just color. Applies to: lab results, risk badges, medication alerts, expense warnings.

### A11Y-S02: Announce dynamic content changes [STRICT]

Form results, upload progress, search results → `AccessibilityInfo.announceForAccessibility('message')`.

### A11Y-S03: Error messages use accessibilityLiveRegion [STRICT]

Form validation errors: `accessibilityLiveRegion="polite"`. Critical medical alerts: `"assertive"`.

### A11Y-S04: Modal focus management [STRICT]

Modals need `accessibilityViewIsModal={true}`. Must have accessible close button (`accessibilityLabel="Close"` + `accessibilityRole="button"`).

### A11Y-S05: Support dynamic text sizes [STRICT]

Never set `allowFontScaling={false}` on any `Text`. Layout must accommodate 200% text scale without truncation.

### A11Y-S06: Sufficient color contrast [STRICT]

Normal text (<18pt): 4.5:1 min | Large text (>=18pt/14pt bold): 3:1 min | UI components: 3:1 min.
`text-gray-400` on white fails for body text — use only for placeholder text.

### A11Y-S07: FlatList/SectionList accessibility [STRICT]

Container: `accessibilityRole="list"`. Each item component root: `accessibilityRole="listitem"`.
