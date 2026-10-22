import React, { useState, useMemo } from 'react';
import { Inbox, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DataTable from '@/components/tables/data-table';
import Button from '@/components/ui/button';
import EmptyState from '@/components/tables/empty-state';
import { DeclineOfferModal } from '../Negotiation/Chat/components/DeclineOfferModal';
import { SubscriptionLockModal } from '@/components/modals';
import { useSubscriptionQuota } from '@/hooks/useSubscriptionQuota';
import { TableFilterContent } from './Filters/TableFilterContent';
import { useCustomerQuotesReceived } from './hooks/useCustomerQuotesReceived';
import { useFilteredQuotesReceived } from './hooks/useFilteredQuotesReceived';
import { QuotesReceivedFilterTabs } from './components/QuotesReceivedFilterTabs';
import { CreateRequestDropdown } from '../CreateRequest/components/CreateRequestDropdown';
import { getQuotesReceivedColumns } from './components/columns';
import { GroupedQuotesExpandableRow } from './components/GroupedQuotesExpandableRow';
import { GroupedQuotesReceivedRowActions } from './Actions/GroupedQuotesReceivedRowActions';
import { encryptId } from '@/lib/encryption';

function groupQuotesByRequest(quotes: any[]) {
    const groupsMap = new Map<string, any>();

    (quotes || []).forEach((q: any) => {
        if (!q) return;
        const rawReqId = q.quote_request_id || q.quote_request?.id || q.rawId;
        const reqKey = String(rawReqId || q.requestId || q.request_id || 'unknown');

        if (!groupsMap.has(reqKey)) {
            const reqFormatted = q.requestId || q.request_id || (rawReqId ? (String(rawReqId).startsWith('REQ-') ? rawReqId : `REQ-${String(rawReqId).padStart(4, '0')}`) : 'REQ-0001');

            groupsMap.set(reqKey, {
                id: reqFormatted,
                rawId: rawReqId,
                rawRequestId: rawReqId,
                requestId: reqFormatted,
                request_id: reqFormatted,
                quote_request_id: rawReqId,
                requestTitle: q.requestTitle || reqFormatted,
                pickup: q.pickup || q.pickup_address || '-',
                pickup_address: q.pickup_address || q.pickup || '-',
                delivery: q.delivery || q.delivery_address || '-',
                delivery_address: q.delivery_address || q.delivery || '-',
                distance: q.distance || '—',
                vehicleType: q.vehicleType || q.vehicle || q.vehicle_type || 'Covered Van (20ft)',
                vehicle_type: q.vehicleType || q.vehicle || q.vehicle_type || 'Covered Van (20ft)',
                vehicle: q.vehicleType || q.vehicle || q.vehicle_type || 'Covered Van (20ft)',
                transit: q.transit || q.transit_time || q.deliveryDate || '48h',
                transit_time: q.transit || q.transit_time || q.deliveryDate || '48h',
                deliveryDate: q.deliveryDate || q.transit || '48h',
                created_at: q.created_at,
                date: q.date || q.created_at,
                quotes: [],
                suppliers: [],
                status: q.status || 'New',
                status_raw: q.status_raw || 'pending',
                supplierRating: q.supplierRating || q.rating,
            });
        }

        const group = groupsMap.get(reqKey);
        group.quotes.push(q);

        const supplierName = q.supplier?.full_name || q.supplier?.name || q.supplier_full_name || q.supplier || q.supplier_name || 'Carrier';
        group.suppliers.push({
            name: supplierName,
            avatar: q.supplierAvatar || q.customerAvatar,
            quoteId: q.id || q.quoteId,
            rawId: q.rawId || q.id,
            amount: q.amount_raw || q.amount || 0,
            status: q.status || 'New',
            transit: q.transit || q.deliveryDate || '48h',
            raw: q,
        });
    });

    return Array.from(groupsMap.values()).map((group) => {
        const parsePrice = (q: any) => {
            const val = q?.amount_raw ?? q?.amount ?? q?.offer_amount;
            if (typeof val === 'number') return val;
            const parsed = parseFloat(String(val || 0).replace(/[^0-9.]/g, ''));
            return isNaN(parsed) ? 0 : parsed;
        };

        // Sort quotes to find latest submitted quote
        const sortedQuotes = [...group.quotes].sort((a: any, b: any) => {
            const timeA = a.created_at ? new Date(a.created_at).getTime() : 0;
            const timeB = b.created_at ? new Date(b.created_at).getTime() : 0;
            if (timeB !== timeA) return timeB - timeA;
            const idA = Number(a.id || a.rawId || 0);
            const idB = Number(b.id || b.rawId || 0);
            return idB - idA;
        });

        const latestQuote = sortedQuotes[0] || null;
        const latestVal = latestQuote ? parsePrice(latestQuote) : 0;
        const latestAmount = latestVal > 0 ? latestVal : null;

        const prices = group.quotes
            .map(parsePrice)
            .filter((p: number) => p > 0);

        const lowest = prices.length > 0 ? Math.min(...prices) : null;
        const highest = prices.length > 0 ? Math.max(...prices) : null;

        return {
            ...group,
            quotesCount: group.quotes.length,
            latestQuote,
            latestAmount,
            lowestAmount: lowest,
            highestAmount: highest,
            amount: latestAmount || lowest || 0,
            amount_raw: latestAmount || lowest || 0,
        };
    });
}

export default function QuotesReceived() {
    const navigate = useNavigate();
    const {
        quotes,
        loading,
        isRefreshing,
        rejectModalQuote,
        setRejectModalQuote,
        fetchQuotes,
        handleAccept,
        handleConfirmReject,
    } = useCustomerQuotesReceived();

    const {
        isLockModalOpen,
        setIsLockModalOpen,
        modalTitle,
        modalDescription,
        checkOrLock,
        handleUpgradeRedirect,
    } = useSubscriptionQuota();

    const [activeFilterTab, setActiveFilterTab] = useState<string>('all');
    const [supplierFilter, setSupplierFilter] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [vehicleFilter, setVehicleFilter] = useState('all');
    const [ratingFilter, setRatingFilter] = useState('all');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const handleResetFilters = () => {
        setSupplierFilter('');
        setMinPrice('');
        setMaxPrice('');
        setStatusFilter('all');
        setVehicleFilter('all');
        setRatingFilter('all');
        setStartDate('');
        setEndDate('');
    };

    // 1. Group all received quotes by shipping request
    const allGroupedRequests = useMemo(() => groupQuotesByRequest(quotes), [quotes]);

    // 2. Filter the grouped requests
    const filteredRequests = useFilteredQuotesReceived({
        quotes: allGroupedRequests,
        activeFilterTab,
        supplierFilter,
        minPrice,
        maxPrice,
        statusFilter,
        vehicleFilter,
        ratingFilter,
        startDate,
        endDate,
    });

    const columns = useMemo(() => getQuotesReceivedColumns(navigate), [navigate]);

    return (
        <div className="p-3 sm:p-4 md:p-6 w-full mx-auto space-y-4 sm:space-y-5 min-h-screen font-sans antialiased bg-[#f8fafc] dark:bg-[#12161c]">
            <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                    <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight mb-1">Compare Quotes</h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        Review, compare, negotiate, and accept competitive shipping quotes from verified suppliers.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fetchQuotes(true)}
                        disabled={isRefreshing}
                        className="h-8 px-2.5 sm:px-3 text-xs font-semibold flex items-center gap-1.5 cursor-pointer bg-white dark:bg-[#1e2329] border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 shrink-0"
                    >
                        <RefreshCw size={13} className={isRefreshing ? 'animate-spin text-[#ff4a1f]' : 'text-slate-500'} />
                        <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
                    </Button>
                    <CreateRequestDropdown
                        onCreateNew={() => checkOrLock(() => navigate('/customer/quotes/create/new'))}
                        buttonText="Create Request"
                    />
                </div>
            </div>

            <DataTable
                data={filteredRequests}
                columns={columns}
                actions={(row: any) => (
                    <GroupedQuotesReceivedRowActions row={row} />
                )}
                actionsColumnClassName="w-[210px] whitespace-nowrap text-right pr-3.5 sm:pr-4"
                expandableContent={(row: any) => (
                    <GroupedQuotesExpandableRow
                        row={row}
                        onNavigate={navigate}
                        onAccept={handleAccept}
                    />
                )}
                headerTabs={
                    <QuotesReceivedFilterTabs
                        quotes={allGroupedRequests}
                        activeFilterTab={activeFilterTab}
                        setActiveFilterTab={setActiveFilterTab}
                    />
                }
                filterContent={
                    <TableFilterContent
                        supplierFilter={supplierFilter}
                        setSupplierFilter={setSupplierFilter}
                        minPrice={minPrice}
                        setMinPrice={setMinPrice}
                        maxPrice={maxPrice}
                        setMaxPrice={setMaxPrice}
                        statusFilter={statusFilter}
                        setStatusFilter={setStatusFilter}
                        vehicleFilter={vehicleFilter}
                        setVehicleFilter={setVehicleFilter}
                        ratingFilter={ratingFilter}
                        setRatingFilter={setRatingFilter}
                        startDate={startDate}
                        setStartDate={setStartDate}
                        endDate={endDate}
                        setEndDate={setEndDate}
                        onResetFilters={handleResetFilters}
                    />
                }
                keyExtractor={(item) => item?.id || item?.rawId || Math.random().toString()}
                searchPlaceholder="Search by ID, route, vehicle..."
                compact={true}
                hideViewToggle={false}
                isLoading={loading || isRefreshing}
                onRowClick={(row) => navigate(`/customer/quotes/received/${encryptId(row.rawRequestId || row.quote_request_id || row.rawId)}`)}
                tableLayout="auto"
                tableClassName="w-full"
                emptyState={
                    <EmptyState
                        icon={Inbox}
                        title="No Quotes Received Yet"
                        description={activeFilterTab === 'all' ? 'When verified suppliers submit quotes for your shipping requests, they will appear here.' : `No received quotes match '${activeFilterTab}'.`}
                        actionLabel="Create Quote Request"
                        onAction={() => checkOrLock(() => navigate('/customer/quotes/create/new'))}
                    />
                }
            />

            <DeclineOfferModal
                isOpen={Boolean(rejectModalQuote)}
                onClose={() => setRejectModalQuote(null)}
                offerAmount={rejectModalQuote?.amount_raw || (rejectModalQuote?.amount ? parseFloat(String(rejectModalQuote.amount).replace(/[^0-9.]/g, '')) : undefined)}
                currency="€"
                onConfirm={handleConfirmReject}
            />

            {/* Subscription Upgrade Modal */}
            <SubscriptionLockModal
                isOpen={isLockModalOpen}
                onClose={() => setIsLockModalOpen(false)}
                onUpgrade={handleUpgradeRedirect}
                userType="customer"
                title={modalTitle}
                description={modalDescription}
                featureName="Quote Request Quota"
                requiredPlan="Starter Shipper (€29/mo)"
                benefits={[
                    "Unlimited Single Quote Requests & RFQs",
                    "Multi-Carrier Quote Comparison & Price Breakdown",
                    "Direct Carrier Live Chat & Negotiation",
                    "Real-time Order Tracking & Digital POD (Challan)",
                    "Secure Stripe Escrow Payments & Card Checkout"
                ]}
            />
        </div>
    );
}
