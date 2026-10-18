import { isQuoteAccepted, isQuoteNegotiation, isQuoteRejected, isQuoteNew } from '../components/QuotesReceivedFilterTabs';

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
        if (isQuoteAccepted(q)) acceptedCount++;
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

    if (activeTab === 'new') result = result.filter(isQuoteNew);
    else if (activeTab === 'negotiation') result = result.filter(isQuoteNegotiation);
    else if (activeTab === 'accepted') result = result.filter(isQuoteAccepted);
    else if (activeTab === 'rejected') result = result.filter(isQuoteRejected);

    if (statusFilter !== 'all') {
        if (statusFilter === 'pending') result = result.filter(isQuoteNew);
        else if (statusFilter === 'negotiating') result = result.filter(isQuoteNegotiation);
        else if (statusFilter === 'accepted') result = result.filter(isQuoteAccepted);
        else if (statusFilter === 'rejected') result = result.filter(isQuoteRejected);
    }

    if (vehicleFilter !== 'all') {
        result = result.filter(q => {
            const v = String(q.vehicle || q.vehicle_type || quoteRequestDetails?.vehicle_type || '').toLowerCase();
            return v.includes(vehicleFilter.toLowerCase());
        });
    }

    if (ratingFilter !== 'all') {
        const minRating = parseFloat(ratingFilter);
        result = result.filter(q => {
            const r = parseFloat(String(q.rating ?? q.supplier?.rating ?? 5.0));
            return r >= minRating;
        });
    }

    result.sort((a, b) => {
        const amtA = a.amount_raw || parseFloat(String(a.amount || a.price || a.total_amount || 0).replace(/[^0-9.]/g, '')) || 0;
        const amtB = b.amount_raw || parseFloat(String(b.amount || b.price || b.total_amount || 0).replace(/[^0-9.]/g, '')) || 0;
        if (filterMode === 'lowest_price') return amtA - amtB;
        if (filterMode === 'highest_price') return amtB - amtA;
        if (filterMode === 'top_rated') {
            const ratA = Number(a.rating || a.supplier_rating || a.supplier?.rating || 0);
            const ratB = Number(b.rating || b.supplier_rating || b.supplier?.rating || 0);
            return ratB - ratA;
        }
        if (filterMode === 'fastest') {
            const getHours = (item: any) => {
                const str = String(item.estimated_delivery || item.transit_time || item.estimated_time || '').toLowerCase();
                const num = parseInt(str.replace(/[^0-9]/g, '')) || 0;
                if (str.includes('d') || str.includes('day')) return num * 24;
                return num;
            };
            return getHours(a) - getHours(b);
        }
        if (filterMode === 'newest') {
            const dateA = new Date(a.created_at || a.date || a.submitted_at || 0).getTime();
            const dateB = new Date(b.created_at || b.date || b.submitted_at || 0).getTime();
            return dateB - dateA;
        }
        return 0;
    });

    return result;
};
