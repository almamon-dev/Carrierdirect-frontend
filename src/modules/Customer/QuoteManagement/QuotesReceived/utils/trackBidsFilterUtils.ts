import { isQuoteAccepted, isQuoteAwaitingPayment, isQuoteNegotiation, isQuoteRejected, isQuotePendingReview } from '../components/QuotesReceivedFilterTabs';

export interface FilterAndSortBidsParams {
    quotes: any[];
    activeTab: 'all' | 'new' | 'negotiation' | 'accepted' | 'rejected';
    statusFilter: string;
    vehicleFilter: string;
    ratingFilter: string;
    filterMode: string;
    quoteRequestDetails?: any;
}

export const computeTrackTabCounts = (quotes: any[]) => {
    let newCount = 0;
    let negotiationCount = 0;
    let acceptedCount = 0;
    let rejectedCount = 0;

    quotes.forEach((q) => {
        if (isQuoteAccepted(q) || isQuoteAwaitingPayment(q)) acceptedCount++;
        else if (isQuoteRejected(q)) rejectedCount++;
        else if (isQuoteNegotiation(q)) negotiationCount++;
        else newCount++;
    });

    return {
        all: quotes.length,
        new: newCount,
        negotiation: negotiationCount,
        accepted: acceptedCount,
        rejected: rejectedCount,
    };
};

export const filterAndSortBids = ({
    quotes,
    activeTab,
    statusFilter,
    vehicleFilter,
    ratingFilter,
    filterMode,
    quoteRequestDetails,
}: FilterAndSortBidsParams) => {
    let result = [...quotes];

    const sFilter = String(typeof statusFilter === 'object' && statusFilter ? ((statusFilter as any).target?.value ?? (statusFilter as any).value ?? 'all') : (statusFilter || 'all')).toLowerCase();
    const vFilter = String(typeof vehicleFilter === 'object' && vehicleFilter ? ((vehicleFilter as any).target?.value ?? (vehicleFilter as any).value ?? 'all') : (vehicleFilter || 'all')).toLowerCase();
    const rFilter = String(typeof ratingFilter === 'object' && ratingFilter ? ((ratingFilter as any).target?.value ?? (ratingFilter as any).value ?? 'all') : (ratingFilter || 'all')).toLowerCase();
    const fMode = String(typeof filterMode === 'object' && filterMode ? ((filterMode as any).target?.value ?? (filterMode as any).value ?? 'lowest_price') : (filterMode || 'lowest_price')).toLowerCase();

    if (activeTab === 'new') result = result.filter(isQuotePendingReview);
    else if (activeTab === 'negotiation') result = result.filter(isQuoteNegotiation);
    else if (activeTab === 'accepted') result = result.filter(q => isQuoteAccepted(q) || isQuoteAwaitingPayment(q));
    else if (activeTab === 'rejected') result = result.filter(isQuoteRejected);

    if (sFilter !== 'all') {
        if (sFilter === 'pending' || sFilter === 'new') result = result.filter(isQuotePendingReview);
        else if (sFilter === 'negotiating') result = result.filter(isQuoteNegotiation);
        else if (sFilter === 'accepted' || sFilter === 'awaiting_payment' || sFilter === 'awaiting payment') result = result.filter(q => isQuoteAccepted(q) || isQuoteAwaitingPayment(q));
        else if (sFilter === 'rejected') result = result.filter(isQuoteRejected);
    }

    if (vFilter !== 'all') {
        result = result.filter(q => {
            const v = String(
                q.vehicle ||
                q.vehicle_type ||
                q.vehicleType ||
                q.truck_type ||
                q.raw?.vehicle ||
                q.raw?.vehicle_type ||
                quoteRequestDetails?.vehicle_type ||
                ''
            ).toLowerCase();
            return v.includes(vFilter);
        });
    }

    if (rFilter !== 'all') {
        const minRating = parseFloat(rFilter);
        if (!isNaN(minRating)) {
            result = result.filter(q => {
                const r = parseFloat(String(
                    q.rating ??
                    q.supplierRating ??
                    q.supplier_rating ??
                    q.supplier?.rating ??
                    q.raw?.rating ??
                    5.0
                ));
                return r >= minRating;
            });
        }
    }

    result.sort((a, b) => {
        const amtA = a.amount_raw || parseFloat(String(a.amount || a.price || a.total_amount || 0).replace(/[^0-9.]/g, '')) || 0;
        const amtB = b.amount_raw || parseFloat(String(b.amount || b.price || b.total_amount || 0).replace(/[^0-9.]/g, '')) || 0;
        if (fMode === 'lowest_price') return amtA - amtB;
        if (fMode === 'highest_price') return amtB - amtA;
        if (fMode === 'top_rated') {
            const ratA = Number(a.rating || a.supplier_rating || a.supplier?.rating || 0);
            const ratB = Number(b.rating || b.supplier_rating || b.supplier?.rating || 0);
            return ratB - ratA;
        }
        if (fMode === 'fastest') {
            const getHours = (item: any) => {
                const str = String(item.estimated_delivery || item.transit_time || item.estimated_time || '').toLowerCase();
                const num = parseInt(str.replace(/[^0-9]/g, '')) || 0;
                if (str.includes('d') || str.includes('day')) return num * 24;
                return num;
            };
            return getHours(a) - getHours(b);
        }
        if (fMode === 'newest') {
            const dateA = new Date(a.created_at || a.date || a.submitted_at || 0).getTime();
            const dateB = new Date(b.created_at || b.date || b.submitted_at || 0).getTime();
            return dateB - dateA;
        }
        return 0;
    });

    return result;
};
