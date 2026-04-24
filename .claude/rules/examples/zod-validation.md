# Zod Validation — MedVault Examples

## safeParse Before Every DB Write

```typescript
import { memberSchema } from '@/utils/validators';
import { repository } from '@/db/repository';

// WRONG — no validation
async function createMember(formValues: unknown) {
  await repository.members.create(formValues); // VIOLATION
}

// CORRECT — validate first
async function createMember(formValues: unknown) {
  const result = memberSchema.safeParse(formValues);
  if (!result.success) {
    // result.error.flatten() gives field-level errors for the form
    throw new Error('Validation failed');
  }
  await repository.members.create(result.data);
}
```

## zodResolver with useForm

```typescript
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { memberSchema } from '@/utils/validators';
import type { z } from 'zod';

type MemberFormData = z.infer<typeof memberSchema>;

function AddMemberForm() {
  const { control, handleSubmit, formState: { errors } } = useForm<MemberFormData>({
    resolver: zodResolver(memberSchema),
    defaultValues: { name: '', dob: '', gender: 'M', countryCode: 'IN' },
  });

  const createMember = useCreateMember();

  const handleFormSubmit = handleSubmit(async (data) => {
    await createMember.mutateAsync(data);
  });

  return (
    <View>
      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            accessibilityLabel="Full name"
            onChangeText={onChange}
            onBlur={onBlur}
            value={value}
          />
        )}
      />
      {errors.name && (
        <Text
          accessibilityLiveRegion="polite"
          className="text-red-600 text-sm"
        >
          {errors.name.message}
        </Text>
      )}
      <Pressable
        onPress={handleFormSubmit}
        accessibilityLabel="Save member"
        accessibilityRole="button"
      >
        <Text>Save</Text>
      </Pressable>
    </View>
  );
}
```

## safeParse for Manual Error Handling

```typescript
// When you need field-level errors without throwing
const result = memberSchema.safeParse(rawData);
if (!result.success) {
  const fieldErrors = result.error.flatten().fieldErrors;
  setErrors(fieldErrors); // { name: ['Required'], dob: ['Invalid date'] }
  return;
}
// result.data is type-safe here
await repository.members.create(result.data);
```
