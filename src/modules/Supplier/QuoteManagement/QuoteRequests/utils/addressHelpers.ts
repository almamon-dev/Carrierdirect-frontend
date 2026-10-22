import { formatStandardAddress } from '@/utils/addressFormatter';

/**
 * Supplier Address Resolver Utility
 * Extracts and cleans pickup/delivery addresses using standardized format:
 * Country, City, State/Region, ZIP
 */
export const resolveAddress = (q: any, type: 'pickup' | 'delivery'): string => {
    return formatStandardAddress(q, type);
};
