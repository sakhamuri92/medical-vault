import { useAppStore } from '@/stores/appStore';
import { formatCurrency, formatDate, getCurrencyForCountry } from '@/utils/locale';

export function useLocale(countryCodeOverride?: string) {
  const defaultCode = useAppStore((s) => s.defaultCountryCode);
  const code = countryCodeOverride ?? defaultCode;

  return {
    countryCode: code,
    currency: getCurrencyForCountry(code),
    formatCurrency: (amount: number) => formatCurrency(amount, code),
    formatDate: (isoDate: string) => formatDate(isoDate, code),
  };
}
