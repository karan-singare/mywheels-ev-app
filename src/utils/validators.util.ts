/**
 * Validation utility functions for the MyWheels EV app.
 *
 * Pure functions — no external dependencies.
 */

const INDIAN_PHONE_REGEX = /^[6-9]\d{9}$/;
const VALID_IMAGE_TYPES = new Set(['image/jpeg', 'image/png']);

/**
 * Validates an Indian 10-digit mobile number.
 * Must start with 6-9 and contain exactly 10 digits.
 */
export function isValidIndianPhone(phone: string): boolean {
  return INDIAN_PHONE_REGEX.test(phone);
}

/**
 * Checks whether a date-of-birth string yields at least `minAge` years old today.
 * Expects an ISO date string (YYYY-MM-DD) or any format parseable by `new Date()`.
 */
export function isMinAge(dob: string, minAge: number): boolean {
  const birthDate = new Date(dob);
  if (Number.isNaN(birthDate.getTime())) {
    return false;
  }

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age >= minAge;
}

/**
 * Returns true if the trimmed value is non-empty.
 */
export function isNonEmpty(value: string): boolean {
  return value.trim().length > 0;
}

/**
 * Validates that a file size (in bytes) does not exceed `maxMB` megabytes.
 */
export function isValidFileSize(sizeBytes: number, maxMB: number): boolean {
  return sizeBytes >= 0 && sizeBytes <= maxMB * 1024 * 1024;
}

/**
 * Validates that a MIME type is an accepted image type (JPEG or PNG).
 */
export function isValidImageType(mimeType: string): boolean {
  return VALID_IMAGE_TYPES.has(mimeType);
}
