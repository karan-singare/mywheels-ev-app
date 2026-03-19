import {
  formatCurrency,
  formatDate,
  daysRemaining,
} from '../../../src/utils/formatters.util';

describe('formatCurrency', () => {
  it('formats amounts with Indian Rupee symbol', () => {
    const result = formatCurrency(4999);
    expect(result).toContain('4,999');
    expect(result).toContain('₹');
  });

  it('formats zero', () => {
    const result = formatCurrency(0);
    expect(result).toContain('₹');
    expect(result).toContain('0');
  });

  it('formats large amounts with Indian grouping', () => {
    const result = formatCurrency(100000);
    expect(result).toContain('₹');
    expect(result).toContain('1,00,000');
  });
});

describe('formatDate', () => {
  it('formats ISO date strings into readable format', () => {
    const result = formatDate('2025-03-15');
    expect(result).toContain('15');
    expect(result).toContain('Mar');
    expect(result).toContain('2025');
  });

  it('returns empty string for invalid dates', () => {
    expect(formatDate('not-a-date')).toBe('');
    expect(formatDate('')).toBe('');
  });
});

describe('daysRemaining', () => {
  it('returns positive days for future dates', () => {
    const future = new Date();
    future.setDate(future.getDate() + 10);
    const isoDate = future.toISOString().split('T')[0];
    expect(daysRemaining(isoDate)).toBe(10);
  });

  it('returns 0 for past dates', () => {
    const past = new Date();
    past.setDate(past.getDate() - 5);
    const isoDate = past.toISOString().split('T')[0];
    expect(daysRemaining(isoDate)).toBe(0);
  });

  it('returns 0 for today', () => {
    const today = new Date();
    const isoDate = today.toISOString().split('T')[0];
    expect(daysRemaining(isoDate)).toBe(0);
  });

  it('returns 0 for invalid dates', () => {
    expect(daysRemaining('not-a-date')).toBe(0);
    expect(daysRemaining('')).toBe(0);
  });
});
