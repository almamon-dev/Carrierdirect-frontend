/**
 * Dynamic Status Badge Styling for Supplier Quotes & Negotiations
 * Standardized across CarrierDirect to 7 solid color design tokens.
 */

import { getStatusBadgeStyles, getStatusColorClass, resolveStatusCategory } from '@/components/common/StatusBadge';

export const getStatusBadgeClass = (status?: string): string => {
    return getStatusColorClass(status, 'quote');
};

export const getStatusFullBadgeClass = (status?: string): string => {
    return getStatusBadgeStyles(status, 'quote');
};

export { resolveStatusCategory };
