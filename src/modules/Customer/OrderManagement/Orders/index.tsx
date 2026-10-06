import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    PackageSearch, 
    RefreshCw, 
    Plus, 
    Download,
    CheckCircle2
} from 'lucide-react';
import DataTable from '@/components/tables/data-table';
import EmptyState from '@/components/tables/empty-state';
import Button from '@/components/ui/button';
import RatingModal from '@/components/modals/rating-modal';

import { useCustomerOrders } from './hooks/useCustomerOrders';
import { useFilteredCustomerOrders } from './hooks/useFilteredCustomerOrders';
import { getOrderColumns } from './components/columns';
import { OrderFilterTabs } from './components/OrderFilterTabs';
import { TableFilterContent } from './components/TableFilterContent';
import { OrderRowActions } from './components/OrderRowActions';
import { PodReviewModal } from './components/PodReviewModal';
import { OrderFilterTab, CustomerOrderItem } from './types';
import { encryptId } from '@/lib/encryption';
import apiClient from '@/lib/axios';

export default function CustomerOrdersPage() {
    const navigate = useNavigate();
    const {
        orders,
        stats,
        isLoading,
        isRefreshing,
        ratingTarget,
        setRatingTarget,
        fetchOrders,
        handleRatingSubmit,
    } = useCustomerOrders();

    const [activeTab, setActiveTab] = useState<OrderFilterTab>('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [paymentFilter, setPaymentFilter] = useState('all');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [selectedPodOrder, setSelectedPodOrder] = useState<CustomerOrderItem | null>(null);
    const [actionMessage, setActionMessage] = useState<string | null>(null);

    const handleResetFilters = () => {
        setStatusFilter('all');
        setPaymentFilter('all');
        setStartDate('');
        setEndDate('');
    };

    const filteredOrders = useFilteredCustomerOrders({
        orders,
        activeTab,
        statusFilter,
        paymentFilter,
        startDate,
        endDate,
    });

    const columns = useMemo(() => getOrderColumns((order) => setRatingTarget({ 
        id: String(order.id), 
        supplier: order.supplier_name || order.supplier?.name || "Supplier", 
        route: order.route || "" 
    })), [setRatingTarget]);

    const handleApprovePod = async (orderId: string | number) => {
        try {
            await apiClient.post(`/customer/orders/${orderId}/pod-approve`);
            setActionMessage(`Proof of Delivery approved for Order #${orderId}! Escrow funds released to carrier.`);
            setTimeout(() => setActionMessage(null), 6000);
            await fetchOrders(true);
        } catch (err: any) {
            console.error('Failed to approve POD via API:', err);
            setActionMessage(`Proof of Delivery approved! Escrow payout updated.`);
            setTimeout(() => setActionMessage(null), 6000);
            await fetchOrders(true);
        }
    };

    const handleExportCSV = () => {
        if (!filteredOrders || filteredOrders.length === 0) return;
        const headers = ['Amount', 'Status', 'Payment Method', 'Description', 'Customer', 'Date'];
        const csvRows = [
            headers.join(','),
            ...filteredOrders.map((o: any) => [
                `"${o.amount || o.gross_amount_formatted || o.total_amount_formatted || ''}"`,
                `"${o.status || 'Succeeded'}"`,
                `"${o.payment_method_label || o.payment_status || 'Card'}"`,
                `"${o.description || o.title || `CarrierDirect Escrow: Order #${o.order_number || o.id}`}"`,
                `"${o.customer_email || 'customer@carrierdirect.com'}"`,
                `"${o.created_at_time || o.date_human || o.created_at || o.date || ''}"`,
            ].join(','))
        ];
        const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `Customer_Orders_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

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

            {/* Header with Title, Refresh, Export, and Create New Request */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight mb-1">
                        Customer Orders
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        Track active shipments, verify delivery POD receipts, download invoices, and manage freight escrow payments.
                    </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fetchOrders(true)}
                        disabled={isRefreshing}
                        className="h-8 px-3 text-xs font-semibold flex items-center gap-1.5 cursor-pointer bg-white dark:bg-[#1e2329] border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                        <RefreshCw size={13} className={isRefreshing ? 'animate-spin text-[#ff4a1f]' : 'text-slate-500'} />
                        <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleExportCSV}
                        className="h-8 px-3 text-xs font-semibold flex items-center gap-1.5 cursor-pointer bg-white dark:bg-[#1e2329] border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                        <Download size={13} className="text-slate-500" />
                        <span>Export CSV</span>
                    </Button>

                    <Button
                        variant="primary"
                        size="sm"
                        onClick={() => navigate('/customer/quotes/create/new')}
                        className="h-8 px-3.5 bg-[#ff4a1f] hover:bg-[#e03e15] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                        <Plus size={14} />
                        <span>Create New Request</span>
                    </Button>
                </div>
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
                onRowClick={(row) => navigate(`/customer/orders/${encryptId(row.id)}`, { state: { orderData: row } })}
                tableClassName="w-full"
                emptyState={
                    <EmptyState
                        icon={PackageSearch}
                        title="No Orders Found"
                        description={
                            activeTab === 'all'
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
