import React, { useState, useMemo } from 'react';
import { RefreshCw, Inbox } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DataTable from '@/components/tables/data-table';
import Button from '@/components/ui/button';
import EmptyState from '@/components/tables/empty-state';
import { QuotaReminderBanner } from '@/components';
import { SubscriptionLockModal } from '@/components/modals';
import { useSubscriptionQuota } from '@/hooks/useSubscriptionQuota';
import { buildSecureQuoteUrl } from '@/utils/urlSecurity';
import { ProcessingTableFilterContent } from './components/ProcessingTableFilterContent';
import { useProcessingRequests } from './hooks/useProcessingRequests';
import { useFilteredProcessingRequests } from './hooks/useFilteredProcessingRequests';
import { ProcessingFilterTabs } from './components/ProcessingFilterTabs';
import { getProcessingColumns } from './components/columns';
import { ProcessingRowActions } from './components/ProcessingRowActions';
import { CreateRequestDropdown } from '../CreateRequest/components/CreateRequestDropdown';

export default function Processing() {
    const navigate = useNavigate();
    const { requests, isLoading, isRefreshing, fetchProcessingRequests } = useProcessingRequests();
    const {
        isLoading: isQuotaLoading,
        isTrial,
        daysRemaining,
        quotesLimit,
        quotesUsed,
        isPaidUnlimited,
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
    const [priorityFilter, setPriorityFilter] = useState('all');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const handleResetFilters = () => {
        setStatusFilter('all');
        setVehicleFilter('all');
        setPriorityFilter('all');
        setStartDate('');
        setEndDate('');
    };

    const filteredRequests = useFilteredProcessingRequests({
        requests,
        activeFilterTab,
        statusFilter,
        vehicleFilter,
        priorityFilter,
        startDate,
        endDate,
    });

    const columns = useMemo(() => getProcessingColumns(navigate), [navigate]);

    return (
        <div className="p-4 md:p-6 w-full mx-auto min-h-screen font-sans antialiased bg-[#f8fafc] dark:bg-[#12161c] space-y-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight mb-1">Processing Quote Requests</h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        Track shipments currently in carrier bidding, negotiate terms, or review quotes.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => fetchProcessingRequests(true)} disabled={isRefreshing} className="h-9 px-3 text-xs font-semibold flex items-center gap-1.5 bg-white dark:bg-[#1e2329] border-slate-300 dark:border-slate-700">
                        <RefreshCw size={14} className={isRefreshing ? 'animate-spin text-[#ff4a1f]' : 'text-slate-500'} />
                        <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
                    </Button>
                    <CreateRequestDropdown
                        onCreateNew={() => checkOrLock(() => navigate('/customer/quotes/create/new'))}
                        buttonText="Create Request"
                    />
                </div>
            </div>

            {/* Quota Banner when on trial or limit reached */}
            {(isQuotaLoading || !isPaidUnlimited) && (
                <QuotaReminderBanner
                    isLoading={isQuotaLoading}
                    title={isTrial ? '7-Day Free Trial Quota Reminder' : 'Free Plan Quota Reminder'}
                    quotaUsed={quotesUsed}
                    maxQuota={quotesLimit}
                    daysRemaining={daysRemaining}
                    onUpgradeClick={handleUpgradeRedirect}
                />
            )}

            <DataTable
                data={filteredRequests}
                columns={columns}
                actions={(row: any) => <ProcessingRowActions row={row} />}
                actionsColumnClassName="w-[48px] min-w-[48px] max-w-[48px] text-right pr-2"
                headerTabs={<ProcessingFilterTabs requests={requests} activeFilterTab={activeFilterTab} setActiveFilterTab={setActiveFilterTab} />}
                filterContent={
                    <ProcessingTableFilterContent
                        statusFilter={statusFilter}
                        setStatusFilter={setStatusFilter}
                        vehicleFilter={vehicleFilter}
                        setVehicleFilter={setVehicleFilter}
                        priorityFilter={priorityFilter}
                        setPriorityFilter={setPriorityFilter}
                        startDate={startDate}
                        setStartDate={setStartDate}
                        endDate={endDate}
                        setEndDate={setEndDate}
                        onResetFilters={handleResetFilters}
                    />
                }
                searchPlaceholder="Search requests by ID, route, vehicle..."
                compact={true}
                isLoading={isLoading || isRefreshing}
                onRowClick={(row) => navigate(buildSecureQuoteUrl(row.rawId || row.id, 'view'))}
                tableLayout="fixed"
                tableClassName="w-full"
                emptyState={
                    <EmptyState
                        icon={Inbox}
                        title="No Quote Requests Found"
                        description={activeFilterTab === 'all' ? 'Create a shipping request to receive competitive carrier quotations.' : `No quote requests match the current filters.`}
                        actionLabel="Create Quote Request"
                        onAction={() => checkOrLock(() => navigate('/customer/quotes/create/new'))}
                    />
                }
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
