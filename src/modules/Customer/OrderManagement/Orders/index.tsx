import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PackageSearch, CheckCircle2 } from 'lucide-react';
import EmptyState from '@/components/tables/empty-state';
import RatingModal from '@/components/modals/rating-modal';
import { encryptId } from '@/lib/encryption';

import { DataTable } from '../components/DataTable';
import { useOrders } from './hooks/useOrders';
import { getOrderColumns } from './components/columns';
import { OrderFilterTabs, TableFilterContent } from './components/OrderFilters';
import { OrderHeaderActions, OrderRowActions } from './components/OrderActions';
import { PodReviewModal } from './components/PodReviewModal';

export default function CustomerOrdersPage() {
    const navigate = useNavigate();
    const {
        orders,
        stats,
        isLoading,
        isRefreshing,
        activeTab,
        setActiveTab,
        statusFilter,
        setStatusFilter,
        paymentFilter,
        setPaymentFilter,
        startDate,
        setStartDate,
        endDate,
        setEndDate,
        ratingTarget,
        setRatingTarget,
        selectedPodOrder,
        setSelectedPodOrder,
        actionMessage,
        setActionMessage,
        filteredOrders,
        handleResetFilters,
        handleApprovePod,
        handleRatingSubmit,
        handleExportCSV,
        fetchOrders,
    } = useOrders();

    const columns = useMemo(
        () =>
            getOrderColumns((order) =>
                setRatingTarget({
                    id: String(order.id),
                    supplier: order.supplier_name || order.supplier?.name || 'Supplier',
                    route: order.route || '',
                })
            ),
        [setRatingTarget]
    );

    return (
        <div className="p-4 md:p-6 w-full mx-auto min-h-screen font-sans antialiased bg-[#f8fafc] dark:bg-[#12161c] space-y-3.5">
            {/* Action Feedback Banner */}
            {actionMessage && (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-lg text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center justify-between gap-2 shadow-2xs animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="flex items-center gap-2">
                        <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                        <span>{actionMessage}</span>
                    </div>
                    <button
                        onClick={() => setActionMessage(null)}
                        className="text-emerald-700 hover:text-emerald-900 text-xs font-semibold cursor-pointer underline ml-2"
                    >
                        Dismiss
                    </button>
                </div>
            )}

            {/* Header with Title and Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight mb-1">
                        Customer Orders
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        Track active shipments, verify delivery POD receipts, download invoices, and manage freight escrow payments.
                    </p>
                </div>

                <OrderHeaderActions
                    isRefreshing={isRefreshing}
                    onRefresh={() => fetchOrders(true)}
                    onExportCSV={handleExportCSV}
                    onCreateRequest={() => navigate('/customer/quotes/create/new')}
                />
            </div>

            {/* Main DataTable Grid */}
            <DataTable
                data={filteredOrders}
                columns={columns}
                actions={(row: any) => (
                    <OrderRowActions
                        row={row}
                        onOpenRating={(target) => setRatingTarget(target)}
                        onOpenPodReview={(order) => setSelectedPodOrder(order)}
                    />
                )}
                actionsColumnClassName="w-[120px] min-w-[120px] text-right pr-3.5"
                headerTabs={
                    <OrderFilterTabs
                        orders={orders}
                        stats={stats}
                        activeTab={activeTab}
                        onSelectTab={setActiveTab}
                    />
                }
                filterContent={
                    <TableFilterContent
                        statusFilter={statusFilter}
                        setStatusFilter={setStatusFilter}
                        paymentFilter={paymentFilter}
                        setPaymentFilter={setPaymentFilter}
                        startDate={startDate}
                        setStartDate={setStartDate}
                        endDate={endDate}
                        setEndDate={setEndDate}
                        onResetFilters={handleResetFilters}
                    />
                }
                searchPlaceholder="Search by Order ID, description, customer email, or amount..."
                compact={true}
                isLoading={isLoading || isRefreshing}
                onRowClick={(row) =>
                    navigate(`/customer/orders/${encryptId(row.id)}`, { state: { orderData: row } })
                }
                tableClassName="w-full"
                emptyState={
                    <EmptyState
                        icon={PackageSearch}
                        title="No Orders Found"
                        description={
                            (activeTab as any) === 'all'
                                ? "You haven't placed any logistics orders yet. Accept a winning quote to initiate dispatch."
                                : `No orders match '${activeTab.replace('_', ' ')}'.`
                        }
                        actionLabel="View Quotes Received"
                        onAction={() => navigate('/customer/quotes/received')}
                    />
                }
            />

            {/* POD Review & Acceptance Modal */}
            <PodReviewModal
                isOpen={Boolean(selectedPodOrder)}
                onClose={() => setSelectedPodOrder(null)}
                order={selectedPodOrder}
                onApprove={handleApprovePod}
            />

            {/* Carrier Rating & Review Modal */}
            {ratingTarget && (
                <RatingModal
                    isOpen={Boolean(ratingTarget)}
                    onClose={() => setRatingTarget(null)}
                    orderId={ratingTarget.id}
                    targetName={ratingTarget.supplier}
                    targetRole="Supplier"
                    orderTitle={ratingTarget.route}
                    onSubmit={handleRatingSubmit}
                />
            )}
        </div>
    );
}
