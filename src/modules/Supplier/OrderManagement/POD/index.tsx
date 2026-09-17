import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { RefreshCw, Download, Upload, FileCheck } from 'lucide-react';
import Button from '@/components/ui/button';
import DataTable from '@/components/tables/data-table';
import EmptyState from '@/components/tables/empty-state';

import { PODFilterTab, PODOrderItem } from './types';
import { usePODOrders } from './hooks/usePODOrders';
import { useFilteredPODOrders } from './hooks/useFilteredPODOrders';
import { getPODColumns } from './components/columns';
import { PODFilterTabs } from './components/PODFilterTabs';
import { PODTableFilterContent } from './components/PODTableFilterContent';
import { PODRowActions } from './components/PODRowActions';
import { PODPreviewModal } from './components/PODPreviewModal';
import { PODUploadModal } from './components/PODUploadModal';

export default function PODManagement() {
    const navigate = useNavigate();
    const {
        orders,
        isLoading,
        isRefreshing,
        isSubmitting,
        fetchOrders,
        uploadPOD,
    } = usePODOrders();

    const [activeTab, setActiveTab] = useState<PODFilterTab>('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [vehicleFilter, setVehicleFilter] = useState('all');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const [previewTarget, setPreviewTarget] = useState<PODOrderItem | null>(null);
    const [uploadTarget, setUploadTarget] = useState<PODOrderItem | null>(null);
    const [showUploadModal, setShowUploadModal] = useState<boolean>(false);

    const handleResetFilters = () => {
        setStatusFilter('all');
        setVehicleFilter('all');
        setStartDate('');
        setEndDate('');
    };

    const filteredOrders = useFilteredPODOrders({
        orders,
        activeTab,
        statusFilter,
        vehicleFilter,
        startDate,
        endDate,
    });

    const columns = useMemo(() => getPODColumns(navigate, (row) => setPreviewTarget(row)), [navigate]);

    const handleExportCSV = () => {
        if (!filteredOrders || filteredOrders.length === 0) return;
        const headers = [
            'Job ID',
            'Customer / Shipper',
            'Route',
            'Driver & Vehicle',
            'Delivery Date',
            'POD Document',
            'POD Status'
        ];
        const csvRows = [
            headers.join(','),
            ...filteredOrders.map(o => [
                `"${o.order_id || o.order_no || o.order_number || o.id}"`,
                `"${o.customer_name || o.customer?.name || 'Shipper'}"`,
                `"${o.route || `${o.pickup_city || ''} -> ${o.delivery_city || ''}`}"`,
                `"${o.driver_name || o.driver || ''} (${o.vehicle || o.vehicle_type || ''})"`,
                `"${o.delivery_date || o.pickup_date || ''}"`,
                `"${o.has_pod ? o.pod_file_name || 'Attached' : 'Not Attached'}"`,
                `"${o.pod_status}"`,
            ].join(','))
        ];
        const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `Supplier_POD_Records_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div
    className="p-4 md:p-6 w-full mx-auto min-h-screen font-sans antialiased bg-[#f8fafc] dark:bg-[#12161c] space-y-5">
            {/* Header with Title, Refresh, Export, and Upload New POD */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight mb-1">
                        Proof of Delivery (POD) Management
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        Review, verify, upload, and manage delivery receipts (Challan) and recipient signatures.
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
                        onClick={() => {
                            setUploadTarget(null);
                            setShowUploadModal(true);
                        }}
                        className="h-8 px-3.5 bg-[#ff4a1f] hover:bg-[#e03e15] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                        <Upload size={14} />
                        <span>Upload New POD</span>
                    </Button>
                </div>
            </div>

            {/* Main DataTable Grid */}
            <DataTable
                data={filteredOrders}
                columns={columns}
                actions={(row: PODOrderItem) => (
                    <PODRowActions
                        row={row}
                        onPreviewPOD={(o) => setPreviewTarget(o)}
                        onUploadPOD={(o) => {
                            setUploadTarget(o);
                            setShowUploadModal(true);
                        }}
                    />
                )}
                actionsColumnClassName="w-[125px] min-w-[125px] text-right pr-3"
                headerTabs={
                    <PODFilterTabs
                        orders={orders}
                        activeTab={activeTab}
                        onSelectTab={setActiveTab}
                    />
                }
                filterContent={
                    <PODTableFilterContent
                        statusFilter={statusFilter}
                        setStatusFilter={setStatusFilter}
                        vehicleFilter={vehicleFilter}
                        setVehicleFilter={setVehicleFilter}
                        startDate={startDate}
                        setStartDate={setStartDate}
                        endDate={endDate}
                        setEndDate={setEndDate}
                        onResetFilters={handleResetFilters}
                    />
                }
                searchPlaceholder="Search by Job ID, customer, route, or driver..."
                compact={true}
                isLoading={isLoading || isRefreshing}
                onRowClick={(row) => {
                    if (row.has_pod) {
                        setPreviewTarget(row);
                    } else {
                        setUploadTarget(row);
                        setShowUploadModal(true);
                    }
                }}
                tableClassName="w-full min-w-[1000px]"
                emptyState={
                    <EmptyState
                        icon={FileCheck}
                        title="No POD Documents Found"
                        description={
                            activeTab === 'all'
                                ? "There are currently no proof of delivery documents submitted for review."
                                : `No POD records match '${activeTab.replace('_', ' ')}'.`
                        }
                        actionLabel="Browse Available Requests"
                        onAction={() => navigate('/supplier/quotes/available')}
                    />
                }
            />

            {/* Preview POD Modal */}
            <PODPreviewModal
                isOpen={Boolean(previewTarget)}
                order={previewTarget}
                onClose={() => setPreviewTarget(null)}
                onViewOrderDetails={(order) => {
                    setPreviewTarget(null);
                    navigate(`/supplier/orders/details/${order.slug || order.id}`, { state: { orderData: order } });
                }}
            />

            {/* Upload POD Modal */}
            <PODUploadModal
                isOpen={showUploadModal}
                orders={orders}
                initialOrder={uploadTarget}
                isSubmitting={isSubmitting}
                onClose={() => {
                    setShowUploadModal(false);
                    setUploadTarget(null);
                }}
                onUpload={uploadPOD}
            />
        </div>
    );
}
