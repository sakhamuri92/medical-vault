export const COUNTRIES = [
  { code: 'IN', name: 'India', currency: 'INR', dateFormat: 'DD/MM/YYYY' },
  { code: 'US', name: 'United States', currency: 'USD', dateFormat: 'MM/DD/YYYY' },
  { code: 'GB', name: 'United Kingdom', currency: 'GBP', dateFormat: 'DD/MM/YYYY' },
  { code: 'AU', name: 'Australia', currency: 'AUD', dateFormat: 'DD/MM/YYYY' },
  { code: 'CA', name: 'Canada', currency: 'CAD', dateFormat: 'MM/DD/YYYY' },
  { code: 'SG', name: 'Singapore', currency: 'SGD', dateFormat: 'DD/MM/YYYY' },
  { code: 'AE', name: 'United Arab Emirates', currency: 'AED', dateFormat: 'DD/MM/YYYY' },
  { code: 'DE', name: 'Germany', currency: 'EUR', dateFormat: 'DD.MM.YYYY' },
  { code: 'FR', name: 'France', currency: 'EUR', dateFormat: 'DD/MM/YYYY' },
  { code: 'NZ', name: 'New Zealand', currency: 'NZD', dateFormat: 'DD/MM/YYYY' },
] as const;

export const COUNTRY_CURRENCY_MAP: Record<string, string> = Object.fromEntries(
  COUNTRIES.map((c) => [c.code, c.currency]),
);

export const COUNTRY_DATE_FORMAT_MAP: Record<string, string> = Object.fromEntries(
  COUNTRIES.map((c) => [c.code, c.dateFormat]),
);
