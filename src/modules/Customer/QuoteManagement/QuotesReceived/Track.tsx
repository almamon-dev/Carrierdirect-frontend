import { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Inbox } from 'lucide-react';
import DataTable from '@/components/tables/data-table';
import EmptyState from '@/components/tables/empty-state';
import { decryptId, encryptId } from '@/lib/encryption';
import { QuoteLifecycleTracker } from './components/QuoteLifecycleTracker';
import { getTrackBidsColumns } from './components/TrackBidsColumns';
import { TrackBidsRowActions } from './Actions/TrackBidsRowActions';
import { TrackBidsFilterContent } from './components/TrackBidsFilterContent';
import { DeclineOfferModal } from '../Negotiation/Chat/components/DeclineOfferModal';
import { isQuoteAccepted } from './components/QuotesReceivedFilterTabs';
import { useTrackBids } from './hooks/useTrackBids';
import { TrackHeader } from './components/TrackHeader';
import { TrackOverviewCard } from './components/TrackOverviewCard';
import { TrackHeaderTabs } from './components/TrackHeaderTabs';

export default function TrackBids() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const cleanId = id ? (decryptId(id) || id) : '';
    const formattedReqId = cleanId ? (cleanId.startsWith('REQ-') ? cleanId : `REQ-${String(cleanId).padStart(4, '0')}`) : 'REQ-0001';

    const {
        quotes,
        quoteRequestDetails,
        isLoading,
        isRefreshing,
        activeTab,
        setActiveTab,
        statusFilter,
        setStatusFilter,
        vehicleFilter,
        setVehicleFilter,
        ratingFilter,
        setRatingFilter,
        filterMode,
        setFilterMode,
        actionLoading,
        rejectModalQuote,
        setRejectModalQuote,
        handleResetFilters,
        fetchBids,
        handleAccept,
        handleConfirmReject,
        tabCounts,
        filteredAndSortedQuotes,
    } = useTrackBids(cleanId);

    const columns = useMemo(() => getTrackBidsColumns(navigate, quoteRequestDetails), [navigate, quoteRequestDetails]);

    const lowestBidVal = useMemo(() => {
        if (quotes.length === 0) return null;
        const prices = quotes.map(q => q.amount_raw || parseFloat(String(q.amount || 0).replace(/[^0-9.]/g, '')) || 0).filter(p => p > 0);
        if (prices.length === 0) return null;
        return Math.min(...prices);
    }, [quotes]);

    const lowestBidPrice = lowestBidVal ? `€ ${lowestBidVal.toLocaleString()}` : null;

    return (
        <div className="p-4 md:p-6 w-full mx-auto space-y-5 min-h-screen font-sans bg-[#f8fafc] dark:bg-[#12161c]">
            <TrackHeader
                formattedReqId={formattedReqId}
                cleanId={cleanId}
                status={quoteRequestDetails?.status}
                isRefreshing={isRefreshing}
                onBack={() => navigate('/customer/quotes/create')}
                onRefresh={() => fetchBids(true)}
                onViewSpecs={() => navigate(`/customer/quotes/create/view/${cleanId}`)}
                onNewRequest={() => navigate('/customer/quotes/create/new')}
            />

            <TrackOverviewCard
                quoteRequestDetails={quoteRequestDetails}
                quotesCount={quotes.length}
                lowestBidPrice={lowestBidPrice}
            />

            <QuoteLifecycleTracker
                quote={quotes.find(q => isQuoteAccepted(q)) || quotes[0]}
                requestDetail={quoteRequestDetails}
                allBids={quotes}
            />

            <DataTable
                data={filteredAndSortedQuotes}
                columns={columns}
                actions={(row: any) => (
                    <TrackBidsRowActions
                        row={row}
                        isAccepting={actionLoading === (row.rawId || row.id)}
                        onAccept={(actionId) => handleAccept(actionId, row)}
                        onReject={(r) => setRejectModalQuote(r)}
                    />
                )}
                actionsColumnClassName="w-[76px] min-w-[70px] text-right pr-3.5 sm:pr-4"
                headerTabs={
                    <TrackHeaderTabs
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                        tabCounts={tabCounts}
                    />
                }
                filterContent={
                    <TrackBidsFilterContent
                        statusFilter={statusFilter}
                        setStatusFilter={setStatusFilter}
                        vehicleFilter={vehicleFilter}
                        setVehicleFilter={setVehicleFilter}
                        ratingFilter={ratingFilter}
                        setRatingFilter={setRatingFilter}
                        sortBy={filterMode}
                        setSortBy={setFilterMode}
                        onResetFilters={handleResetFilters}
                    />
                }
                searchPlaceholder="Search offers by carrier, vehicle or location..."
                compact={true}
                isLoading={isLoading}
                onRowClick={(row) => navigate(`/customer/quotes/received/view/${encryptId(row.rawId || row.id)}`)}
                tableLayout="fixed"
                tableClassName="w-full min-w-[1150px]"
                keyExtractor={(item) => item?.id || item?.rawId || Math.random().toString()}
                emptyState={
                    <EmptyState
                        icon={Inbox}
                        title="No Carrier Offers Found"
                        description={activeTab === 'all' ? "When carriers submit bids for this request, they will appear here in real-time." : `No carrier offers match the '${activeTab}' filter tab.`}
                        actionLabel="View Specifications"
                        onAction={() => cleanId && navigate(`/customer/quotes/create/view/${cleanId}`)}
                    />
                }
            />

            <DeclineOfferModal
                isOpen={Boolean(rejectModalQuote)}
                onClose={() => setRejectModalQuote(null)}
                onConfirm={handleConfirmReject}
                offerAmount={rejectModalQuote?.amount_raw || rejectModalQuote?.amount}
            />
        </div>
    );
}
