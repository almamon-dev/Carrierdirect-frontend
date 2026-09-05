import { QuoteRequest } from '../../data/quoteRequestsData';

export function isRequestToday(item: QuoteRequest): boolean {
    if (item.isToday !== undefined) return item.isToday;
    const dStr = (item.pickupDateRaw || item.pickupDate || item.requestDate || '').toLowerCase();
    if (dStr.includes('today')) return true;
    
    try {
        const today = new Date();
        const todayIso = today.toISOString().split('T')[0];
        if (item.pickupDateRaw && item.pickupDateRaw === todayIso) return true;

        const itemDate = new Date(item.pickupDateRaw || item.pickupDate || item.requestDate);
        if (!isNaN(itemDate.getTime())) {
            return (
                itemDate.getFullYear() === today.getFullYear() &&
                itemDate.getMonth() === today.getMonth() &&
                itemDate.getDate() === today.getDate()
            );
        }
    } catch {}
    return false;
}

export function isRequestExpired(item: QuoteRequest): boolean {
    if (item.isExpired !== undefined) return item.isExpired;
    const status = (item.status || '').toLowerCase();
    if (status === 'expired' || status === 'closed' || status === 'cancelled') return true;
    
    try {
        const itemDate = new Date(item.pickupDateRaw || item.pickupDate || item.requestDate);
        if (!isNaN(itemDate.getTime())) {
            const now = new Date();
            now.setHours(0, 0, 0, 0);
            if (itemDate.getTime() < now.getTime() && !isRequestToday(item)) {
                return true;
            }
        }
    } catch {}
    return false;
}

export function isRequestUpcoming(item: QuoteRequest): boolean {
    if (item.isUpcoming !== undefined) return item.isUpcoming;
    if (isRequestExpired(item)) return false;
    if (isRequestToday(item)) return false;
    
    try {
        const itemDate = new Date(item.pickupDateRaw || item.pickupDate || item.requestDate);
        if (!isNaN(itemDate.getTime())) {
            const now = new Date();
            now.setHours(0, 0, 0, 0);
            if (itemDate.getTime() > now.getTime()) return true;
        }
    } catch {}
    
    const status = (item.status || '').toLowerCase();
    return status === 'active' || status === 'open' || status === 'pending' || !status;
}

export function isRequestUrgent(item: QuoteRequest): boolean {
    if (item.isUrgent !== undefined) return item.isUrgent;
    return (item.priority || '').toLowerCase() === 'urgent';
}
