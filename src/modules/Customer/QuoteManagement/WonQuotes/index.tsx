import React, { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { History, RefreshCw } from 'lucide-react';
import DataTable from '@/components/tables/data-table';
import EmptyState from '@/components/tables/empty-state';
import Button from '@/components/ui/button';
import { encryptId } from '@/lib/encryption';
import { FilterTabs } from './components/FilterTabs';
import { getCustomerWonQuoteColumns } from './components/columns';
import { CustomerWonRowActions } from './components/CustomerWonRowActions';
import { useCustomerQuotesReceived } from '../QuotesReceived/hooks/useCustomerQuotesReceived';
import { CustomerWonQuoteItem, WonFilterTab } from './types';

export default function CustomerQuoteHistory() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const tabParam = searchParams.get('tab');
    const [activeTab, setActiveTab] = useState<WonFilterTab>(() => {
        if (tabParam) {
            const lower = tabParam.toLowerCase();
            if (lower === 'completed') return 'Completed';
            if (lower === 'declined') return 'Declined';
            if (lower === 'expired') return 'Expired';
            if (lower === 'booked') return 'Booked';
        }
        return 'Booked';
    });
    const { quotes = [], loading, isRefreshing, fetchQuotes } = useCustomerQuotesReceived();

    // Map historical quotes: Booked | Completed | Declined | Expired
    const historyQuotes: CustomerWonQuoteItem[] = useMemo(() => {
        return (quotes || [])
            .map((q: any) => {
                const s = String(q.status_raw || q.status || '').toLowerCase().trim();
                const ost = String(q.order_status || (q.order as any)?.status || '').toLowerCase().trim();
                const podStatus = String(q.pod_status || (q.order as any)?.pod_status || '').toLowerCase().trim();
                const isPodAccepted = podStatus === 'accepted' || podStatus === 'confirmed' || s === 'pod_accepted' || ost === 'pod_accepted' || s === 'completed' || ost === 'completed';
                const rev = String(q.revision_status || '').toLowerCase().trim();
                const hasOrder = Boolean(q.is_paid || q.has_order || q.order_id);

                // Expiry calculation
                const expiryField = q.valid_until || q.expires_at || q.expiry_date || q.quote_request?.expires_at;
                const isExpiredDate = expiryField ? (!isNaN(new Date(expiryField).getTime()) && new Date(expiryField).getTime() < Date.now()) : false;

                let historyStatus: 'Booked' | 'Completed' | 'Declined' | 'Expired' = 'Booked';

                if (isPodAccepted || ost === 'completed' || s === 'completed') {
                    historyStatus = 'Completed';
                } else if (s === 'rejected' || s === 'declined' || s === 'cancelled' || s === 'lost' || rev === 'rejected') {
                    historyStatus = 'Declined';
                } else if (s === 'expired' || (isExpiredDate && !hasOrder && s !== 'accepted')) {
                    historyStatus = 'Expired';
                } else if (s === 'accepted' || s === 'booked' || s === 'won' || s === 'confirmed' || hasOrder) {
                    historyStatus = 'Booked';
                } else {
                    historyStatus = 'Booked';
                }

                // Delivery milestones
                let deliveryStatus = 'Confirmed';
                if (historyStatus === 'Completed' || ost === 'completed' || isPodAccepted) deliveryStatus = 'Completed';
                else if (ost.includes('pod') || q.pod_status === 'pending') deliveryStatus = 'POD Pending';
                else if (ost === 'delivered') deliveryStatus = 'Delivered';
                else if (ost === 'in_transit' || ost === 'picked_up') deliveryStatus = 'In Transit';
                else if (ost === 'driver_assigned' || ost.includes('driver')) deliveryStatus = 'Driver Assigned';
                else if (historyStatus === 'Declined') deliveryStatus = 'Declined';
                else if (historyStatus === 'Expired') deliveryStatus = 'Expired';
                else deliveryStatus = 'Confirmed';

                return {
                    ...q,
                    historyStatus,
                    deliveryStatus,
                    status: historyStatus,
                };
            })
            .filter((q: any) => Boolean(q.historyStatus));
    }, [quotes]);

    const filteredHistoryQuotes = useMemo(() => {
        if (!activeTab) return historyQuotes;
        return historyQuotes.filter((q) => q.historyStatus?.toLowerCase() === activeTab.toLowerCase());
    }, [historyQuotes, activeTab]);

    const columns = useMemo(() => getCustomerWonQuoteColumns(navigate), [navigate]);

    return (
        <div className="p-3 sm:p-4 md:p-6 w-full mx-auto space-y-4 sm:space-y-5 min-h-screen font-sans antialiased bg-[#f8fafc] dark:bg-[#12161c]">
            <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                    <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight mb-1 flex items-center gap-2">
                        <History className="w-5 h-5 text-[#ff4a1f]" />
                        <span>Quote History</span>
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        Review past quote decisions, booked shipments, and archived carrier bids.
                    </p>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fetchQuotes(true)}
                    disabled={isRefreshing}
                    className="h-8 px-2.5 sm:px-3 text-xs font-semibold flex items-center gap-1.5 cursor-pointer bg-white dark:bg-[#1e2329] border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-[3px] shrink-0"
                >
                    <RefreshCw size={13} className={isRefreshing ? 'animate-spin text-[#ff4a1f]' : 'text-slate-500'} />
                    <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
                </Button>
            </div>

            <DataTable
                data={filteredHistoryQuotes}
                columns={columns}
                actions={(row) => <CustomerWonRowActions row={row} />}
                actionsColumnClassName="w-[120px] min-w-[120px] text-right"
                headerTabs={
                    <FilterTabs
                        quotes={historyQuotes}
                        activeTab={activeTab}
                        onSelectTab={(tab) => { setActiveTab(tab); setSearchParams({ tab }, { replace: true }); }}
                    />
                }
                searchPlaceholder="Search history by ID, carrier, route..."
                compact={true}
                isLoading={loading || isRefreshing}
                onRowClick={(row) => navigate(`/customer/quotes/received/view/${encryptId(row.rawId || row.id)}`)}
                tableLayout="fixed"
                tableClassName="min-w-[1050px]"
                emptyState={
                    <EmptyState
                        icon={History}
                        title="No Quotes Found"
                        description={`There are currently no quotes matching '${activeTab}'.`}
                    />
                }
            />
        </div>
    );
}
