# React Native Elements — MedVault Examples

## HTML vs RN Elements

| HTML (WRONG) | React Native (CORRECT)             |
| ------------ | ---------------------------------- |
| `<div>`      | `<View>`                           |
| `<span>`     | `<Text>`                           |
| `<p>`        | `<Text>`                           |
| `<button>`   | `<Pressable>`                      |
| `<input>`    | `<TextInput>`                      |
| `<img>`      | `<Image>`                          |
| `<ul>/<ol>`  | `<FlatList>` or `<SectionList>`    |
| `<a>`        | `<Pressable>` with `router.push()` |

## Pressable (replaces TouchableOpacity)

```typescript
// Wrong
<TouchableOpacity onPress={handlePress}>
  <Text>Tap me</Text>
</TouchableOpacity>

// Correct
<Pressable
  onPress={handlePress}
  accessibilityLabel="Open member details"
  accessibilityRole="button"
  className="bg-primary-600 px-4 py-2 rounded-lg"
>
  <Text className="text-white font-medium">Tap me</Text>
</Pressable>
```

## FlatList with useCallback renderItem

```typescript
// Wrong — new function every render
<FlatList
  data={members}
  renderItem={({ item }) => <MemberCard member={item} />}
/>

// Correct
const renderMember = useCallback(
  ({ item }: { item: Member }) => <MemberCard member={item} />,
  []
);
<FlatList
  data={members}
  keyExtractor={(item) => item.id}
  renderItem={renderMember}
  accessibilityRole="list"
/>
```

## KeyboardAvoidingView for Forms

```typescript
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';

function AddMemberScreen() {
  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView className="flex-1 px-4">
        {/* form fields */}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
```

## Platform.OS for Platform Forks

```typescript
// Wrong — platform-specific style objects
<View style={Platform.select({ ios: { marginTop: 8 }, android: { marginTop: 4 } })} />

// Correct — NativeWind platform variants
<View className="ios:mt-2 android:mt-1" />

// Or className conditional
<View className={Platform.OS === 'ios' ? 'mt-2' : 'mt-1'} />
```

## expo-constants vs process.env

```typescript
// Wrong — always undefined at RN runtime
const apiKey = process.env.OPENFDA_KEY;

// Correct
import Constants from 'expo-constants';
const apiKey = Constants.expoConfig?.extra?.openFdaKey as string | undefined;
```
