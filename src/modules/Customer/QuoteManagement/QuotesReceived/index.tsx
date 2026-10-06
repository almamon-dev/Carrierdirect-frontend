import React, { useState, useMemo } from 'react';
import { Inbox, RefreshCw, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DataTable from '@/components/tables/data-table';
import Button from '@/components/ui/button';
import EmptyState from '@/components/tables/empty-state';
import { DeclineOfferModal } from '../Negotiation/Chat/components/DeclineOfferModal';
import { SubscriptionLockModal } from '@/components/modals';
import { useSubscriptionQuota } from '@/hooks/useSubscriptionQuota';
import { TableFilterContent } from './Filters/TableFilterContent';
import { QuoteReceivedRowActions } from './Actions/QuoteReceivedRowActions';
import { useCustomerQuotesReceived } from './hooks/useCustomerQuotesReceived';
import { useFilteredQuotesReceived } from './hooks/useFilteredQuotesReceived';
import { QuotesReceivedFilterTabs } from './components/QuotesReceivedFilterTabs';
import { CreateRequestDropdown } from '../CreateRequest/components/CreateRequestDropdown';
import { getQuotesReceivedColumns } from './components/columns';
import { encryptId } from '@/lib/encryption';

export default function QuotesReceived() {
    const navigate = useNavigate();
    const {
        quotes,
        loading,
        isRefreshing,
        actionLoading,
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
    const [statusFilter, setStatusFilter] = useState('all');
    const [vehicleFilter, setVehicleFilter] = useState('all');
    const [ratingFilter, setRatingFilter] = useState('all');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const handleResetFilters = () => {
        setStatusFilter('all');
        setVehicleFilter('all');
        setRatingFilter('all');
        setStartDate('');
        setEndDate('');
    };

    const filteredQuotes = useFilteredQuotesReceived({
        quotes,
        activeFilterTab,
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
                    <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight mb-1">Quotes Received</h1>
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
                data={filteredQuotes}
                columns={columns}
                actions={(row: any) => (
                    <QuoteReceivedRowActions row={row} isAccepting={actionLoading === (row.rawId || row.id)} onAccept={handleAccept} onReject={(r) => setRejectModalQuote(r)} />
                )}
                actionsColumnClassName="w-[130px] min-w-[130px]"
                headerTabs={<QuotesReceivedFilterTabs quotes={quotes} activeFilterTab={activeFilterTab} setActiveFilterTab={setActiveFilterTab} />}
                filterContent={
                    <TableFilterContent
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
                searchPlaceholder="Search by ID, customer, pickup/delivery..."
                compact={true}
                hideViewToggle={false}
                isLoading={loading || isRefreshing}
                onRowClick={(row) => navigate(`/customer/quotes/received/view/${encryptId(row.rawId || row.id)}`)}
                tableLayout="fixed"
                tableClassName="min-w-[1180px]"
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
