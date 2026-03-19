import {
  isValidIndianPhone,
  isMinAge,
  isNonEmpty,
  isValidFileSize,
  isValidImageType,
} from '../../../src/utils/validators.util';

describe('isValidIndianPhone', () => {
  it('accepts valid 10-digit Indian mobile numbers', () => {
    expect(isValidIndianPhone('9876543210')).toBe(true);
    expect(isValidIndianPhone('6000000000')).toBe(true);
    expect(isValidIndianPhone('7123456789')).toBe(true);
    expect(isValidIndianPhone('8999999999')).toBe(true);
  });

  it('rejects numbers not starting with 6-9', () => {
    expect(isValidIndianPhone('5876543210')).toBe(false);
    expect(isValidIndianPhone('0123456789')).toBe(false);
    expect(isValidIndianPhone('1234567890')).toBe(false);
  });

  it('rejects numbers with wrong length', () => {
    expect(isValidIndianPhone('987654321')).toBe(false);
    expect(isValidIndianPhone('98765432100')).toBe(false);
    expect(isValidIndianPhone('')).toBe(false);
  });

  it('rejects non-numeric input', () => {
    expect(isValidIndianPhone('abcdefghij')).toBe(false);
    expect(isValidIndianPhone('98765abcde')).toBe(false);
    expect(isValidIndianPhone('+919876543210')).toBe(false);
  });
});

describe('isMinAge', () => {
  it('returns true for someone exactly minAge years old', () => {
    const today = new Date();
    const dob = new Date(
      today.getFullYear() - 18,
      today.getMonth(),
      today.getDate(),
    );
    expect(isMinAge(dob.toISOString().split('T')[0], 18)).toBe(true);
  });

  it('returns true for someone older than minAge', () => {
    expect(isMinAge('1990-01-01', 18)).toBe(true);
  });

  it('returns false for someone younger than minAge', () => {
    const today = new Date();
    const dob = new Date(
      today.getFullYear() - 17,
      today.getMonth(),
      today.getDate() + 1,
    );
    expect(isMinAge(dob.toISOString().split('T')[0], 18)).toBe(false);
  });

  it('returns false for invalid date strings', () => {
    expect(isMinAge('not-a-date', 18)).toBe(false);
    expect(isMinAge('', 18)).toBe(false);
  });
});

describe('isNonEmpty', () => {
  it('returns true for non-empty strings', () => {
    expect(isNonEmpty('hello')).toBe(true);
    expect(isNonEmpty('  hello  ')).toBe(true);
  });

  it('returns false for empty or whitespace-only strings', () => {
    expect(isNonEmpty('')).toBe(false);
    expect(isNonEmpty('   ')).toBe(false);
    expect(isNonEmpty('\t\n')).toBe(false);
  });
});

describe('isValidFileSize', () => {
  it('accepts files within the size limit', () => {
    expect(isValidFileSize(0, 10)).toBe(true);
    expect(isValidFileSize(5 * 1024 * 1024, 10)).toBe(true);
    expect(isValidFileSize(10 * 1024 * 1024, 10)).toBe(true);
  });

  it('rejects files exceeding the size limit', () => {
    expect(isValidFileSize(10 * 1024 * 1024 + 1, 10)).toBe(false);
    expect(isValidFileSize(20 * 1024 * 1024, 10)).toBe(false);
  });

  it('rejects negative file sizes', () => {
    expect(isValidFileSize(-1, 10)).toBe(false);
  });
});

describe('isValidImageType', () => {
  it('accepts JPEG and PNG', () => {
    expect(isValidImageType('image/jpeg')).toBe(true);
    expect(isValidImageType('image/png')).toBe(true);
  });

  it('rejects other MIME types', () => {
    expect(isValidImageType('image/gif')).toBe(false);
    expect(isValidImageType('image/webp')).toBe(false);
    expect(isValidImageType('application/pdf')).toBe(false);
    expect(isValidImageType('')).toBe(false);
  });
});
