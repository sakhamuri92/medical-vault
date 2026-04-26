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
