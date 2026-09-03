import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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

import { getAttachmentUrl } from '@/modules/Customer/QuoteManagement/Negotiation/Chat/utils/customerChatUtils';

export function getMediaUrl(url?: string | null): string {
  return getAttachmentUrl(url || '');
}
