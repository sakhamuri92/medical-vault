# NativeWind v4 Patterns — MedVault Examples

## className vs style

```typescript
// Wrong — inline style objects
<View style={{ backgroundColor: '#2563eb', padding: 16, borderRadius: 8 }}>
<Text style={{ color: '#1d4ed8', fontSize: 18, fontWeight: 'bold' }}>

// Correct — NativeWind className
<View className="bg-primary-600 p-4 rounded-lg">
<Text className="text-primary-700 text-lg font-bold">
```

## Project Color Tokens (from tailwind.config.js)

```typescript
// Use defined tokens — not raw hex
className = 'bg-primary-50'; // lightest primary
className = 'bg-primary-100'; // light primary
className = 'bg-primary-500'; // mid primary
className = 'bg-primary-600'; // main brand color (buttons)
className = 'bg-primary-700'; // dark primary (text on light)
className = 'bg-primary-900'; // darkest primary
className = 'bg-success'; // success states
className = 'bg-warning'; // warning states
className = 'bg-danger'; // error/danger states

// Wrong — hardcoded hex
className = 'bg-[#2563eb]';
className = 'text-[#1d4ed8]';
```

## Common Layout Patterns

```typescript
// Full-screen container
<View className="flex-1 bg-white">

// Centered content
<View className="flex-1 items-center justify-center">

// Row with gap
<View className="flex-row items-center gap-3">

// Card
<View className="bg-white rounded-xl shadow-sm p-4 mb-3">

// Safe area padding (use expo-router's built-in safe area handling)
<View className="flex-1 px-4 pt-4">
```

## Dark Mode

```typescript
// Light/dark mode via dark: prefix
<View className="bg-white dark:bg-gray-900">
<Text className="text-gray-900 dark:text-white">
<Pressable className="bg-primary-600 dark:bg-primary-500">
```

## Platform Variants

```typescript
// iOS/Android specific classes
<View className="ios:pt-12 android:pt-8">
<Text className="ios:text-lg android:text-base">
```

## tailwindcss Version Lock

The project MUST stay on tailwindcss v3.x. NativeWind v4 is incompatible with Tailwind CSS v4.
Do NOT upgrade tailwindcss beyond 3.x without confirming NativeWind v4 compatibility.
