import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PackageSearch, RefreshCw, Plus, Download } from 'lucide-react';
import DataTable from '@/components/tables/data-table';
import Button from '@/components/ui/button';
import EmptyState from '@/components/tables/empty-state';
import RatingModal from '@/components/modals/rating-modal';
import { getOrderColumns } from './components/columns';
import { OrderRowActions } from './components/OrderRowActions';
import { OrderFilterTabs } from './components/OrderFilterTabs';
import { TableFilterContent } from './components/TableFilterContent';
import { useCustomerOrders } from './hooks/useCustomerOrders';
import { useFilteredCustomerOrders } from './hooks/useFilteredCustomerOrders';
import { OrderFilterTab } from './types';

export default function CustomerOrders() {
    const navigate = useNavigate();
    const {
        orders,
        isLoading,
        isRefreshing,
        ratingTarget,
        setRatingTarget,
        fetchOrders,
        handleRatingSubmit,
    } = useCustomerOrders();

    const [activeTab, setActiveTab] = useState<OrderFilterTab>('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [vehicleFilter, setVehicleFilter] = useState('all');
    const [paymentFilter, setPaymentFilter] = useState('all');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const handleResetFilters = () => {
        setStatusFilter('all');
        setVehicleFilter('all');
        setPaymentFilter('all');
        setStartDate('');
        setEndDate('');
    };

    const filteredOrders = useFilteredCustomerOrders({
        orders,
        activeTab,
        statusFilter,
        vehicleFilter,
        paymentFilter,
        startDate,
        endDate,
    });

    const columns = useMemo(() => getOrderColumns(navigate), [navigate]);

    const handleExportCSV = () => {
        if (!filteredOrders || filteredOrders.length === 0) return;
        const headers = ['Order ID', 'Supplier', 'Route', 'Vehicle', 'Amount', 'Payment Status', 'Status', 'Date'];
        const csvRows = [
            headers.join(','),
            ...filteredOrders.map(o => [
                `"${o.order_id || o.order_number || o.id}"`,
                `"${o.supplier_name || o.supplier?.company_name || 'Carrier'}"`,
                `"${o.route || `${o.pickup_city || ''} -> ${o.delivery_city || ''}`}"`,
                `"${o.vehicle || o.vehicle_type || ''}"`,
                `"${o.amount || o.total_amount || ''}"`,
                `"${o.payment_status || 'Paid'}"`,
                `"${o.status || 'In Transit'}"`,
                `"${o.created_at || o.date || ''}"`,
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
        <div className="p-4 md:p-6 w-full mx-auto min-h-screen font-sans antialiased bg-[#f8fafc] dark:bg-[#12161c] space-y-5">
            {/* Header with Title, Refresh, Export, and Create New Request */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight mb-1">
                        Customer Orders
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        Track active shipments, verify delivery POD receipts, download invoices, and manage freight orders.
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
                    />
                )}
                actionsColumnClassName="w-[115px] min-w-[115px] text-right pr-3"
                headerTabs={
                    <OrderFilterTabs
                        orders={orders}
                        activeTab={activeTab}
                        onSelectTab={setActiveTab}
                    />
                }
                filterContent={
                    <TableFilterContent
                        statusFilter={statusFilter}
                        setStatusFilter={setStatusFilter}
                        vehicleFilter={vehicleFilter}
                        setVehicleFilter={setVehicleFilter}
                        paymentFilter={paymentFilter}
                        setPaymentFilter={setPaymentFilter}
                        startDate={startDate}
                        setStartDate={setStartDate}
                        endDate={endDate}
                        setEndDate={setEndDate}
                        onResetFilters={handleResetFilters}
                    />
                }
                searchPlaceholder="Search by Order ID, carrier, route, or vehicle..."
                compact={true}
                isLoading={isLoading || isRefreshing}
                onRowClick={(row) => navigate(`/customer/orders/${row.id}`, { state: { orderData: row } })}
                tableClassName="w-full min-w-[1100px]"
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
