/**
 * Normalize a Nigerian phone number to international format (no + prefix).
 * - '08012345678'  → '2348012345678'
 * - '+2348012345678' → '2348012345678'
 * - '2348012345678'  → '2348012345678'
 * - '8012345678'     → '2348012345678'
 */
export function normalizeNigerianPhone(phone: string): string {
  // Strip everything except digits
  let digits = phone.replace(/[^0-9]/g, '')

  // If starts with '0' (local format like 08012345678), replace leading 0 with '234'
  if (digits.startsWith('0')) {
    digits = '234' + digits.slice(1)
  }
  // If it's 10 digits and doesn't start with 234 (e.g. '8012345678'), prepend '234'
  else if (digits.length === 10 && !digits.startsWith('234')) {
    digits = '234' + digits
  }

  return digits
}
