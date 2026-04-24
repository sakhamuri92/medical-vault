import { COUNTRY_CURRENCY_MAP, COUNTRY_DATE_FORMAT_MAP } from '@/constants/countries';

export function formatCurrency(amount: number, countryCode: string): string {
  const currencyCode = COUNTRY_CURRENCY_MAP[countryCode] ?? 'USD';
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currencyCode,
    }).format(amount);
  } catch {
    return `${currencyCode} ${amount.toFixed(2)}`;
  }
}

export function formatDate(isoDate: string, countryCode: string): string {
  const format = COUNTRY_DATE_FORMAT_MAP[countryCode] ?? 'MM/DD/YYYY';
  const date = new Date(isoDate);
  if (isNaN(date.getTime())) return isoDate;

  // Use UTC methods so YYYY-MM-DD strings are never shifted by local timezone
  const d = String(date.getUTCDate()).padStart(2, '0');
  const m = String(date.getUTCMonth() + 1).padStart(2, '0');
  const y = String(date.getUTCFullYear());

  return format.replace('DD', d).replace('MM', m).replace('YYYY', y);
}

export function getCurrencyForCountry(countryCode: string): string {
  return COUNTRY_CURRENCY_MAP[countryCode] ?? 'USD';
}
