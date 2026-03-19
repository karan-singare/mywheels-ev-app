/**
 * Formatting utility functions for the MyWheels EV app.
 *
 * Pure functions — no external dependencies.
 */

/**
 * Formats an amount as Indian Rupees (₹).
 * Uses the Indian numbering system (en-IN locale).
 *
 * Example: formatCurrency(4999) → "₹4,999"
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Formats an ISO date string into a human-readable format.
 *
 * Example: formatDate("2025-03-15") → "15 Mar 2025"
 */
export function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Computes the number of days remaining until `endDate`.
 * Returns 0 if the end date is in the past.
 *
 * Expects an ISO date string (YYYY-MM-DD).
 */
export function daysRemaining(endDate: string): number {
  const end = new Date(endDate);
  if (Number.isNaN(end.getTime())) {
    return 0;
  }

  const today = new Date();
  // Zero out time components for a clean day diff
  const endDay = new Date(end.getFullYear(), end.getMonth(), end.getDate());
  const todayDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );

  const diffMs = endDay.getTime() - todayDay.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  return Math.max(0, diffDays);
}
