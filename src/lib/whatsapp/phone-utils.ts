/**
 * Phone number utilities for MyHustle.
 * Nigerian-optimized with Meta WhatsApp API compatibility.
 */

/**
 * Sanitize phone number for Meta WhatsApp API.
 * Meta requires digits only — no + prefix, no spaces, no dashes.
 */
export function sanitizePhoneForMeta(phone: string): string {
  if (!phone) return ''
  return phone.replace(/\D/g, '')
}

/**
 * Normalize phone number by removing all non-digit characters.
 */
export function normalizePhone(phone: string): string {
  if (!phone) return ''
  return phone.replace(/\D/g, '')
}

/**
 * Convert Nigerian local format to international.
 * 08012345678 → 2348012345678
 * +2348012345678 → 2348012345678
 */
export function toNigerianInternational(phone: string): string {
  const digits = normalizePhone(phone)
  if (digits.startsWith('234')) return digits
  if (digits.startsWith('0') && digits.length === 11) {
    return '234' + digits.slice(1)
  }
  return digits
}

/**
 * Compare two phone numbers accounting for format differences.
 * Compares last 10 digits to handle +234 vs 0 prefix differences.
 */
export function phonesMatch(phone1: string, phone2: string): boolean {
  const n1 = normalizePhone(phone1)
  const n2 = normalizePhone(phone2)
  if (n1 === n2) return true
  if (n1.length >= 10 && n2.length >= 10) {
    return n1.slice(-10) === n2.slice(-10)
  }
  return false
}

/**
 * Validate phone number is E.164-like format (7-15 digits starting with non-zero).
 */
export function isValidE164(phone: string): boolean {
  return /^\+?[1-9]\d{6,14}$/.test(phone)
}

/**
 * Check if a phone number looks Nigerian.
 */
export function isNigerianPhone(phone: string): boolean {
  const digits = normalizePhone(phone)
  return digits.startsWith('234') || (digits.startsWith('0') && digits.length === 11)
}

/**
 * Format phone for display: 2348012345678 → +234 801 234 5678
 */
export function formatPhoneDisplay(phone: string): string {
  const digits = toNigerianInternational(phone)
  if (digits.length === 13 && digits.startsWith('234')) {
    return `+234 ${digits.slice(3, 6)} ${digits.slice(6, 9)} ${digits.slice(9)}`
  }
  return `+${digits}`
}
