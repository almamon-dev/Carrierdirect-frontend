import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { getAttachmentUrl } from '@/modules/Customer/QuoteManagement/Negotiation/Chat/utils/customerChatUtils';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDisplayDate(dateVal: any, fallback = 'Today'): string {
  if (!dateVal) return fallback;
  const str = String(dateVal).trim();
  if (!str || str === 'N/A' || str === 'null' || str === 'undefined' || str === '—') return fallback;

  try {
    const d = new Date(str);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    }
    return str.replace('Pickup: ', '').trim() || fallback;
  } catch {
    return str || fallback;
  }
}

export function getMediaUrl(url?: string | null): string {
  return getAttachmentUrl(url || '');
}

/**
 * Return direct currency symbol instead of text code (e.g. 'EUR' -> '€', 'USD' -> '$', 'BDT' -> '৳')
 */
export function getCurrencySymbol(currency?: string): string {
  if (!currency) return '€';
  const c = currency.trim().toUpperCase();
  switch (c) {
    case 'EUR':
    case '€':
      return '€';
    case 'USD':
    case '$':
      return '$';
    case 'GBP':
    case '£':
      return '£';
    case 'BDT':
    case 'TK':
    case '৳':
      return '৳';
    case 'CAD':
      return 'CA$';
    case 'AUD':
      return 'AU$';
    case 'JPY':
    case '¥':
      return '¥';
    case 'INR':
    case '₹':
      return '₹';
    default:
      return currency;
  }
}

/**
 * Format currency amount with symbol (e.g., formatCurrency(1650, 'EUR') -> '€1,650')
 */
export function formatCurrency(amount: number | string | undefined | null, currency: string = 'EUR'): string {
  if (amount === undefined || amount === null || amount === '-' || amount === '' || amount === 'Negotiable') {
    return typeof amount === 'string' && amount === 'Negotiable' ? 'Negotiable' : '—';
  }

  const str = String(amount).trim();
  if (str.startsWith('€') || str.startsWith('$') || str.startsWith('£') || str.startsWith('৳') || str.startsWith('₹')) {
    return str;
  }

  const num = typeof amount === 'number' ? amount : parseFloat(str.replace(/[^0-9.-]/g, ''));
  if (isNaN(num)) return str;

  const symbol = getCurrencySymbol(currency);
  const formattedNum = num.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  return `${symbol}${formattedNum}`;
}
