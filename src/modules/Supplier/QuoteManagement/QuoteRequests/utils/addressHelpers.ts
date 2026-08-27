/**
 * Supplier Address Resolver Utility
 * Extracts and cleans pickup/delivery addresses from various backend response shapes.
 */

export const resolveAddress = (q: any, type: 'pickup' | 'delivery'): string => {
    if (type === 'delivery') {
        const val = q.delivery_address || q.location?.destination || q.destination || q.delivery_full_address || q.deliveryFullAddress;
        if (typeof val === 'string' && val.trim()) {
            return val.trim();
        }
        return '—';
    } else {
        const val = q.pickup_address || q.location?.origin || q.origin || q.pickup_full_address || q.pickupFullAddress;
        if (typeof val === 'string' && val.trim()) {
            return val.trim();
        }
        return '—';
    }
};
