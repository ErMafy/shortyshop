// ================================================
// Voucher Utilities
// ================================================

import { v4 as uuidv4 } from 'uuid';
import { getStorePrefix } from './stores';

/**
 * Generate a readable voucher code.
 * Format: PREFIX-XXXXXX (e.g., SSU-8K4P2X)
 */
export function generateVoucherCode(storeSlug: string): string {
  const prefix = getStorePrefix(storeSlug);
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Exclude confusing chars (0,O,1,I)
  let code = '';
  const bytes = new Uint8Array(6);
  crypto.getRandomValues(bytes);
  for (let i = 0; i < 6; i++) {
    code += chars[bytes[i] % chars.length];
  }
  return `${prefix}-${code}`;
}

/**
 * Generate a secure redeem token (UUID v4).
 */
export function generateRedeemToken(): string {
  return uuidv4();
}

/**
 * Format currency amount in EUR.
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
}

/**
 * Format a date in Italian locale.
 */
export function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat('it-IT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(dateStr));
}

/**
 * Check if a voucher is expired.
 */
export function isExpired(expiresAt: string): boolean {
  return new Date(expiresAt) < new Date();
}

/**
 * Get expiry date (30 days from now).
 */
export function getExpiryDate(): string {
  const date = new Date();
  date.setDate(date.getDate() + 30);
  return date.toISOString();
}
