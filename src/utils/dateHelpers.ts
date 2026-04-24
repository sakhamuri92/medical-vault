export function toISODate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function parseISODate(isoDate: string): Date | null {
  const d = new Date(isoDate);
  return isNaN(d.getTime()) ? null : d;
}

export function ageFromDob(dob: string): number | null {
  const birth = parseISODate(dob);
  if (!birth) return null;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const hasBirthdayPassed =
    today.getMonth() > birth.getMonth() ||
    (today.getMonth() === birth.getMonth() && today.getDate() >= birth.getDate());
  if (!hasBirthdayPassed) age -= 1;
  return age;
}
