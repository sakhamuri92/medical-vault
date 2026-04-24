# Accessibility Patterns — MedVault Examples

## Pressable with Full Accessibility

```typescript
<Pressable
  onPress={handleMemberPress}
  accessibilityLabel="John Smith - age 45"
  accessibilityHint="Opens health records for this family member"
  accessibilityRole="button"
  accessibilityState={{ disabled: isLoading }}
  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
  className="flex-row items-center p-3 bg-white rounded-xl"
>
  <Image source={{ uri: member.photoUri }} accessibilityElementsHidden={true} className="w-12 h-12 rounded-full" />
  <Text className="text-gray-900 font-medium ml-3">{member.name}</Text>
</Pressable>
```

## TextInput with Label

```typescript
<View className="mb-4">
  <Text className="text-sm font-medium text-gray-700 mb-1">Full name</Text>
  <TextInput
    accessibilityLabel="Full name"
    accessibilityHint="Enter the family member's full legal name"
    value={value}
    onChangeText={onChange}
    className="border border-gray-300 rounded-lg px-3 py-2 text-base"
    placeholder="e.g. John Smith"
  />
</View>
```

## Form Validation Error with Live Region

```typescript
{errors.name && (
  <Text
    accessibilityLiveRegion="polite"
    accessibilityRole="alert"
    className="text-red-600 text-sm mt-1"
  >
    {errors.name.message}
  </Text>
)}
```

## Dynamic Content Announcement

```typescript
import { AccessibilityInfo } from 'react-native';

// After successful save
const handleSaveSuccess = () => {
  AccessibilityInfo.announceForAccessibility('Member record saved successfully');
  router.back();
};

// After search results load
const handleSearchComplete = (count: number) => {
  AccessibilityInfo.announceForAccessibility(
    `Found ${count} ${count === 1 ? 'result' : 'results'}`,
  );
};
```

## Modal with Focus Management

```typescript
<Modal
  visible={isVisible}
  onRequestClose={handleClose}
  accessibilityViewIsModal={true}
  transparent={true}
  animationType="slide"
>
  <View className="flex-1 justify-end bg-black/50">
    <View className="bg-white rounded-t-3xl p-6">
      <Pressable
        onPress={handleClose}
        accessibilityLabel="Close"
        accessibilityRole="button"
        className="absolute top-4 right-4 min-w-[44px] min-h-[44px] items-center justify-center"
      >
        <Text className="text-gray-500 text-lg">X</Text>
      </Pressable>
      {/* modal content */}
    </View>
  </View>
</Modal>
```

## Color + Icon + Text (not color alone)

```typescript
// Wrong — color only
<View className="bg-red-500 p-2" />

// Correct — color + icon + text
<View className="bg-red-50 border border-red-200 flex-row items-center gap-2 p-3 rounded-lg">
  <Text accessibilityElementsHidden={true} className="text-red-600">!</Text>
  <Text className="text-red-700 text-sm font-medium">
    High risk — consult your doctor
  </Text>
</View>
```

## FlatList Accessibility

```typescript
const renderMemberItem = useCallback(
  ({ item }: { item: Member }) => (
    <View accessibilityRole="listitem">
      <MemberCard member={item} />
    </View>
  ),
  []
);

<FlatList
  data={members}
  accessibilityRole="list"
  keyExtractor={(item) => item.id}
  renderItem={renderMemberItem}
/>
```

## Touch Target with hitSlop

```typescript
// Icon button that's visually small but meets 44x44 minimum
<Pressable
  onPress={handleDelete}
  accessibilityLabel="Delete document"
  accessibilityRole="button"
  hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
  className="p-1"
>
  <Icon name="trash" size={20} color="#dc2626" />
</Pressable>
```
