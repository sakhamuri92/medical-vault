import { formatDate, getCurrencyForCountry } from '../../src/utils/locale';

describe('locale utils', () => {
  it('returns correct currency for country', () => {
    expect(getCurrencyForCountry('IN')).toBe('INR');
    expect(getCurrencyForCountry('US')).toBe('USD');
    expect(getCurrencyForCountry('GB')).toBe('GBP');
    expect(getCurrencyForCountry('XX')).toBe('USD'); // fallback
  });

  it('formats date in DD/MM/YYYY for India', () => {
    expect(formatDate('2024-03-15', 'IN')).toBe('15/03/2024');
  });

  it('formats date in MM/DD/YYYY for US', () => {
    expect(formatDate('2024-03-15', 'US')).toBe('03/15/2024');
  });

  it('returns original value for invalid date', () => {
    expect(formatDate('not-a-date', 'IN')).toBe('not-a-date');
  });
});
