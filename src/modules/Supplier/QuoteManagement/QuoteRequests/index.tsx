/**
 * Supplier Quote Management - QuoteRequests Main Page
 * Displays available carrier quotes requests with real-time skeleton loading,
 * Quota Reminder Banner, filters, and Subscription Lock modal for priority RFQs.
 */

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Inbox, RefreshCw } from 'lucide-react';
import QuotaReminderBanner from '@/components/common/QuotaReminderBanner';
import { SubscriptionLockModal } from '@/components/modals';
import DataTable from '@/components/tables/data-table';
import Button from '@/components/ui/button';
import EmptyState from '@/components/tables/empty-state';
import { QuoteRequest } from '../data/quoteRequestsData';
import { useSupplierQuoteRequests } from './hooks/useSupplierQuoteRequests';
import { getSupplierColumns } from './components/columns';
import { SupplierRowActions } from './components/SupplierRowActions';
import { TableFilterContent } from './components/TableFilterContent';

export default function QuoteRequests() {
    const navigate = useNavigate();
    const [isLockModalOpen, setIsLockModalOpen] = useState(false);
    const [lockedFeatureName, setLockedFeatureName] = useState('Premium RFQ Bidding');

    // Data fetching and caching hook
    const { requests, isLoading, fetchRequests } = useSupplierQuoteRequests();

    const handleQuoteAction = (row: QuoteRequest) => {
        if (row.priority === 'Urgent' || row.budget === '€4,500') {
            setLockedFeatureName(`Priority RFQ Match: ${row.id}`);
            setIsLockModalOpen(true);
        } else {
            navigate(`/supplier/quotes/requests/${row.slug}`);
        }
    };

    const columns = useMemo(() => getSupplierColumns(navigate), [navigate]);

    return (
        <div className="p-4 md:p-6 w-full mx-auto space-y-5 min-h-screen font-sans antialiased">
            {/* Header Title & Refresh Button */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight mb-1">
                        Quote Requests
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        Manage and respond to customer transportation requests.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fetchRequests(true)}
                        disabled={isLoading}
                        className="h-8 px-3 text-xs font-semibold flex items-center gap-1.5 cursor-pointer bg-white dark:bg-[#1e2329] border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                        <RefreshCw size={13} className={isLoading ? "animate-spin text-[#ff4a1f]" : "text-slate-500"} />
                        <span>{isLoading ? "Refreshing..." : "Refresh"}</span>
                    </Button>
                </div>
            </div>

            {/* Carrier Quota Reminder Banner */}
            <QuotaReminderBanner
                quotaUsed={142}
                maxQuota={250}
                unitLabel="monthly quote responses"
                title="Carrier Plan Quota Reminder"
                targetUrl="/supplier/subscription"
                buttonText="Upgrade Carrier Plan"
            />

            {/* Main Data Table */}
            <DataTable
                data={requests}
                columns={columns}
                actions={(row) => <SupplierRowActions row={row} onQuoteAction={handleQuoteAction} />}
                filterContent={<TableFilterContent />}
                keyExtractor={(item) => item.id}
                searchPlaceholder="Search by ID, customer, pickup/delivery..."
                compact={true}
                hideViewToggle={true}
                isLoading={isLoading}
                skeletonCount={requests.length > 0 ? requests.length : 3}
                tableLayout="fixed"
                tableClassName="min-w-[1050px]"
                emptyState={
                    <EmptyState
                        icon={Inbox}
                        title="No Quote Requests Available"
                        description="There are currently no active quote requests waiting for carrier bids. New requests will appear here automatically."
                        actionLabel="Refresh Requests"
                        onAction={() => fetchRequests(true)}
                    />
                }
            />

            {/* Subscription Lock / Upgrade Gate Modal */}
            <SubscriptionLockModal
                isOpen={isLockModalOpen}
                onClose={() => setIsLockModalOpen(false)}
                featureName={lockedFeatureName}
                userType="supplier"
                title="Carrier Subscription Required"
                description="Upgrade your carrier account to unlock priority freight RFQs, unlimited quote submissions, and instant auto-bidding."
                requiredPlan="Professional Fleet (€49/mo)"
                benefits={[
                    "250 Monthly RFQ Quote Submissions",
                    "Priority Placement for Shippers",
                    "Stripe Express Instant Payout Clearance",
                    "ADR Hazardous Cargo Bidding Access"
                ]}
            />
        </div>
    );
}
