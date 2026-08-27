/**
 * Supplier Quote Management - Negotiation Main Page
 * Matches QuoteRequests layout with Quota Reminder Banner, filters,
 * compact DataTable layout, and modular architecture.
 */

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, RefreshCw } from 'lucide-react';
import { SubscriptionLockModal } from '@/components/modals';
import DataTable from '@/components/tables/data-table';
import Button from '@/components/ui/button';
import EmptyState from '@/components/tables/empty-state';
import { NegotiationItem } from './types';
import { useSupplierNegotiations } from './hooks/useSupplierNegotiations';
import { getNegotiationColumns } from './components/columns';
import { NegotiationRowActions } from './components/NegotiationRowActions';
import { TableFilterContent } from './components/TableFilterContent';
import { encryptId } from '@/lib/encryption';

export { type NegotiationItem, type NegotiationTab } from './types';

export default function SupplierNegotiation() {
    const navigate = useNavigate();
    const [isLockModalOpen, setIsLockModalOpen] = useState(false);
    const [lockedFeatureName, setLockedFeatureName] = useState('Priority RFQ Negotiation');

    const [priorityFilter, setPriorityFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [vehicleFilter, setVehicleFilter] = useState('all');

    // Data fetching and caching hook
    const { negotiations = [], isLoading = false, fetchNegotiations } = useSupplierNegotiations() || {};

    const handleQuoteAction = (row: NegotiationItem) => {
        if (row?.priority === 'Urgent') {
            setLockedFeatureName(`Priority RFQ Negotiation: ${row?.id || 'Premium'}`);
            setIsLockModalOpen(true);
        } else {
            const encId = encryptId(row?.rawId || row?.id || '');
            const sKey = row?.sessionKey || `ses-${row?.rawId || row?.id || ''}`;
            navigate(`/supplier/quotes/negotiation/view/${encId}/${sKey}`);
        }
    };

    // Filter negotiations based on TableFilterContent selections
    const filteredData = useMemo(() => {
        const list = Array.isArray(negotiations) ? negotiations : [];
        return list.filter(item => {
            if (!item) return false;
            if (priorityFilter !== 'all' && item.priority?.toLowerCase() !== priorityFilter.toLowerCase()) {
                return false;
            }
            if (statusFilter !== 'all') {
                const normStatus = (item.status || '').toLowerCase();
                if (!normStatus.includes(statusFilter.toLowerCase())) {
                    return false;
                }
            }
            if (vehicleFilter !== 'all') {
                const normVehicle = (item.vehicleType || '').toLowerCase().replace(/[\s_-]+/g, '');
                const targetVehicle = vehicleFilter.toLowerCase().replace(/[\s_-]+/g, '');
                if (!normVehicle.includes(targetVehicle)) {
                    return false;
                }
            }
            return true;
        });
    }, [negotiations, priorityFilter, statusFilter, vehicleFilter]);

    const columns = useMemo(() => getNegotiationColumns(navigate), [navigate]);

    return (
        <div className="p-4 md:p-6 w-full mx-auto space-y-5 min-h-screen font-sans antialiased">
            {/* Header Title & Refresh Button */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight mb-1">
                        Quote Negotiations
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        Manage active customer price counter offers and track negotiation history.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fetchNegotiations && fetchNegotiations(true)}
                        disabled={isLoading}
                        className="h-8 px-3 text-xs font-semibold flex items-center gap-1.5 cursor-pointer bg-white dark:bg-[#1e2329] border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                        <RefreshCw size={13} className={isLoading ? "animate-spin text-[#ff4a1f]" : "text-slate-500"} />
                        <span>{isLoading ? "Refreshing..." : "Refresh"}</span>
                    </Button>
                </div>
            </div>

            {/* Main Data Table */}
            <DataTable
                data={filteredData || []}
                columns={columns}
                actions={(row) => <NegotiationRowActions row={row} onQuoteAction={handleQuoteAction} />}
                filterContent={
                    <TableFilterContent
                        priorityFilter={priorityFilter}
                        setPriorityFilter={setPriorityFilter}
                        statusFilter={statusFilter}
                        setStatusFilter={setStatusFilter}
                        vehicleFilter={vehicleFilter}
                        setVehicleFilter={setVehicleFilter}
                    />
                }
                keyExtractor={(item) => item?.id || Math.random().toString()}
                searchPlaceholder="Search by ID, customer, pickup/delivery..."
                compact={true}
                hideViewToggle={true}
                isLoading={isLoading}
                skeletonCount={(filteredData?.length || 0) > 0 ? filteredData.length : 3}
                tableLayout="fixed"
                tableClassName="min-w-[1050px]"
                actionsColumnClassName="w-[115px] min-w-[115px]"
                emptyState={
                    <EmptyState
                        icon={MessageSquare}
                        title="No Negotiations Available"
                        description="There are currently no active price negotiations or counter offers matching your criteria. New offers from shippers will appear here automatically."
                        actionLabel="Refresh Negotiations"
                        onAction={() => fetchNegotiations && fetchNegotiations(true)}
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
                description="Upgrade your carrier account to unlock priority freight negotiations, instant price auto-bidding, and premium cargo chat channels."
                requiredPlan="Professional Fleet (€49/mo)"
                benefits={[
                    "250 Monthly RFQ Quote Submissions",
                    "Priority Counter Offer Placement for Shippers",
                    "Stripe Express Instant Payout Clearance",
                    "ADR Hazardous Cargo Bidding Access"
                ]}
            />
        </div>
    );
}
