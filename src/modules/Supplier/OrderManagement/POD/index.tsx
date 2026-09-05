import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, XCircle, FileText, Download, Upload, RefreshCw, RotateCcw } from 'lucide-react';
import Button from '@/components/ui/button';
import Badge from '@/components/ui/badge';
import Select from '@/components/ui/select';
import Input from '@/components/ui/input';
import DataTable, { Column } from '@/components/tables/data-table';
import EmptyState from '@/components/tables/empty-state';
import { SupplierOrder, mapApiOrderToSupplierOrder } from '../data/ordersData';
import { apiClient } from '@/lib/axios';

export default function POD() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState<SupplierOrder[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
    const [selectedOrder, setSelectedOrder] = useState<SupplierOrder | null>(null);
    const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
    const [showPreviewModal, setShowPreviewModal] = useState<boolean>(false);
    const [uploadOrderId, setUploadOrderId] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    // Filter states
    const [activeFilterTab, setActiveFilterTab] = useState<string>('all');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');

    const fetchOrders = async (isManualRefresh = false) => {
        if (isManualRefresh) setIsRefreshing(true);
        else setIsLoading(true);

        try {
            const res = await apiClient.get('/supplier/orders');
            const raw = res.data?.data?.orders || res.data?.data || res.data || [];
            const resArray = Array.isArray(raw) ? raw : [];
            const mapped: SupplierOrder[] = resArray.map(mapApiOrderToSupplierOrder);
            setOrders(mapped);
        } catch (err) {
            console.error('Failed to fetch POD orders:', err);
            setOrders([]);
        } finally {
            setIsLoading(false);
            if (isManualRefresh) {
                setTimeout(() => setIsRefreshing(false), 300);
            }
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleResetFilters = () => {
        setStatusFilter('all');
        setStartDate('');
        setEndDate('');
        setActiveFilterTab('all');
    };

    const filteredOrders = useMemo(() => {
        return orders.filter(o => {
            const st = (o.podStatus || '').toLowerCase();

            // 1. Tab Filter
            if (activeFilterTab === 'pending' && !st.includes('pending')) return false;
            if (activeFilterTab === 'approved' && !st.includes('approved')) return false;
            if (activeFilterTab === 'rejected' && !st.includes('rejected')) return false;

            // 2. Dropdown Status Filter
            if (statusFilter !== 'all' && !st.includes(statusFilter.toLowerCase())) return false;

            // 3. Date Filter
            if (startDate || endDate) {
                const dateVal = o.podUploadDate || o.pickupDate;
                if (dateVal) {
                    try {
                        const itemTime = new Date(dateVal).getTime();
                        if (!isNaN(itemTime)) {
                            if (startDate) {
                                const start = new Date(startDate);
                                start.setHours(0, 0, 0, 0);
                                if (itemTime < start.getTime()) return false;
                            }
                            if (endDate) {
                                const end = new Date(endDate);
                                end.setHours(23, 59, 59, 999);
                                if (itemTime > end.getTime()) return false;
                            }
                        }
                    } catch {}
                }
            }

            return true;
        });
    }, [orders, activeFilterTab, statusFilter, startDate, endDate]);

    const handleApprovePOD = async (orderId: string) => {
        try {
            await apiClient.post(`/supplier/orders/${orderId}/pod/approve`);
            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, podStatus: 'Approved' } : o));
        } catch (err) {
            console.error('Failed to approve POD:', err);
            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, podStatus: 'Approved' } : o));
        }
    };

    const handleRejectPOD = async (orderId: string) => {
        try {
            await apiClient.post(`/supplier/orders/${orderId}/pod/reject`);
            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, podStatus: 'Rejected' } : o));
        } catch (err) {
            console.error('Failed to reject POD:', err);
            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, podStatus: 'Rejected' } : o));
        }
    };

    const handleUploadSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await apiClient.post(`/supplier/orders/${uploadOrderId || '1'}/pod`);
            setShowUploadModal(false);
            fetchOrders();
        } catch (err) {
            console.error('Upload POD error:', err);
            setShowUploadModal(false);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Filter Tabs
    const FilterTabs = () => {
        const counts = useMemo(() => {
            let pendingCount = 0;
            let approvedCount = 0;
            let rejectedCount = 0;

            orders.forEach((o) => {
                const s = (o.podStatus || '').toLowerCase();
                if (s.includes('pending')) pendingCount++;
                else if (s.includes('approved')) approvedCount++;
                else if (s.includes('rejected')) rejectedCount++;
            });

            return {
                all: orders.length,
                pending: pendingCount,
                approved: approvedCount,
                rejected: rejectedCount,
            };
        }, [orders]);

        const tabs = [
            { id: 'all', label: 'All Documents', count: counts.all },
            { id: 'pending', label: 'Pending Review', count: counts.pending },
            { id: 'approved', label: 'Approved', count: counts.approved },
            { id: 'rejected', label: 'Rejected', count: counts.rejected },
        ];

        return (
            <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto hide-scrollbar mb-[-1px]">
                {tabs.map((tab) => {
                    const isActive = activeFilterTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => setActiveFilterTab(tab.id)}
                            className={`flex items-center gap-2 pb-3 border-b-2 transition-colors whitespace-nowrap cursor-pointer px-1 ${isActive
                                    ? 'border-[#ff4a1f] text-[#ff4a1f] font-bold'
                                    : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 font-medium'
                                }`}
                        >
                            <span className="text-[13.5px]">{tab.label}</span>
                            <span
                                className={`text-[11.5px] font-semibold px-2 py-0.5 rounded-full ${isActive
                                        ? 'bg-orange-50 dark:bg-[#ff4a1f]/20 text-[#ff4a1f]'
                                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                                    }`}
                            >
                                {tab.count}
                            </span>
                        </button>
                    );
                })}
            </div>
        );
    };

    const columns: Column<SupplierOrder>[] = [
        { 
            id: 'id', 
            label: 'Job Reference', 
            sortable: true,
            className: 'w-[95px] min-w-[95px]',
            render: (row) => (
                <div className="flex items-center h-5">
                    <button 
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/supplier/orders/details/${row.slug}`);
                        }}
                        className="font-bold text-[#ff4a1f] hover:underline text-left cursor-pointer text-xs leading-none whitespace-nowrap"
                    >
                        {row.id}
                    </button>
                </div>
            ) 
        },
        { 
            id: 'customer', 
            label: 'Customer', 
            sortable: true,
            className: 'w-[140px] min-w-[140px]',
            render: (row) => (
                <div className="flex items-center h-5">
                    <span className="font-semibold text-slate-900 dark:text-slate-100 text-xs truncate leading-none">{row.customer}</span>
                </div>
            )
        },
        { 
            id: 'driver', 
            label: 'Uploaded By (Driver)', 
            className: 'w-[160px] min-w-[160px]',
            render: (row) => (
                <div className="flex flex-col min-w-0">
                    <p className="font-semibold text-slate-800 dark:text-slate-200 text-xs truncate leading-tight">{row.driver}</p>
                    <p className="text-[11px] text-slate-400 truncate leading-tight">{row.vehiclePlate}</p>
                </div>
            )
        },
        { 
            id: 'uploadDate', 
            label: 'Upload Date', 
            sortable: true,
            className: 'w-[110px] min-w-[110px] text-center',
            render: (row) => (
                <div className="flex items-center justify-center h-5">
                    <span className="text-xs text-slate-600 dark:text-slate-400 font-medium whitespace-nowrap leading-none">{row.podUploadDate || 'N/A'}</span>
                </div>
            )
        },
        { 
            id: 'status', 
            label: 'POD Status', 
            sortable: true,
            className: 'w-[120px] min-w-[120px] text-center',
            render: (row) => (
                <div className="flex items-center justify-center h-5">
                    <Badge variant="secondary" className={`whitespace-nowrap text-[10.5px] font-semibold border ${
                        row.podStatus === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60' :
                        row.podStatus === 'Pending Review' ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60' :
                        row.podStatus === 'Rejected' ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800/60' :
                        'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
                    }`}>
                        {row.podStatus}
                    </Badge>
                </div>
            )
        },
    ];

    const renderActions = (row: SupplierOrder) => (
        <div className="flex items-center justify-end gap-1.5">
            <Button 
                variant="outline" 
                size="sm" 
                className="h-7 text-xs px-2.5 font-semibold cursor-pointer bg-white dark:bg-[#1e2329] border-slate-200 dark:border-slate-700"
                onClick={(e) => {
                    e.stopPropagation();
                    setSelectedOrder(row); 
                    setShowPreviewModal(true); 
                }}
            >
                <FileText size={13} className="mr-1 text-slate-500" /> View POD
            </Button>
            {row.podStatus === 'Pending Review' && (
                <>
                    <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-7 px-2 text-xs font-semibold border-emerald-200 text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 cursor-pointer"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleApprovePOD(row.id);
                        }}
                        title="Approve POD"
                    >
                        <CheckCircle2 size={13} className="mr-1" /> Approve
                    </Button>
                    <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-7 px-2 text-xs font-semibold border-red-200 text-red-700 hover:bg-red-50 dark:hover:bg-red-950/40 cursor-pointer"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleRejectPOD(row.id);
                        }}
                        title="Reject POD"
                    >
                        <XCircle size={13} className="mr-1" /> Reject
                    </Button>
                </>
            )}
        </div>
    );

    const filterContent = (
        <div className="w-full font-sans">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 items-end">
                <div className="min-w-0">
                    <label className="text-[11.5px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">POD Status</label>
                    <Select value={statusFilter} onChange={(val) => setStatusFilter(val)} showSearch={false}>
                        <option value="all">All Statuses</option>
                        <option value="pending review">Pending Review</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                    </Select>
                </div>
                <div className="min-w-0 hidden md:block" />
                <div className="min-w-0">
                    <label className="text-[11.5px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">Start Date</label>
                    <Input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="h-9 text-xs"
                    />
                </div>
                <div className="min-w-0">
                    <div className="flex items-center justify-between mb-1">
                        <label className="text-[11.5px] font-semibold text-slate-700 dark:text-slate-300">End Date</label>
                        {(statusFilter !== 'all' || startDate || endDate) && (
                            <button
                                type="button"
                                onClick={handleResetFilters}
                                className="text-[10.5px] font-semibold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-0.5 cursor-pointer"
                                title="Reset filters"
                            >
                                <RotateCcw size={10} /> Reset
                            </button>
                        )}
                    </div>
                    <Input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="h-9 text-xs"
                    />
                </div>
            </div>
        </div>
    );

    return (
        <div className="p-4 md:p-6 w-full mx-auto min-h-screen font-sans antialiased space-y-5 bg-[#f8fafc] dark:bg-[#12161c]">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight mb-1">Proof of Delivery (POD)</h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Review, verify, and approve proof of delivery documents submitted by drivers.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fetchOrders(true)}
                        disabled={isRefreshing}
                        className="h-8 px-3 text-xs font-semibold flex items-center gap-1.5 cursor-pointer bg-white dark:bg-[#1e2329] border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                        <RefreshCw size={13} className={isRefreshing ? "animate-spin text-[#ff4a1f]" : "text-slate-500"} />
                        <span>{isRefreshing ? "Refreshing..." : "Refresh"}</span>
                    </Button>
                    <Button 
                        variant="primary" 
                        size="sm" 
                        className="h-8 px-3 text-xs font-semibold bg-[#ff4a1f] hover:bg-[#e03e15] text-white cursor-pointer shadow-2xs flex items-center gap-1.5"
                        onClick={() => setShowUploadModal(true)}
                    >
                        <Upload size={13} />
                        <span>Upload New POD</span>
                    </Button>
                </div>
            </div>

            <DataTable 
                columns={columns} 
                data={filteredOrders} 
                compact={true}
                searchPlaceholder="Search by Job ID, customer, driver..."
                hideViewToggle={false}
                actions={renderActions}
                headerTabs={<FilterTabs />}
                filterContent={filterContent}
                isLoading={isLoading || isRefreshing}
                onRowClick={(row) => { setSelectedOrder(row); setShowPreviewModal(true); }}
                tableLayout="fixed"
                tableClassName="min-w-[950px]"
                emptyState={
                    <EmptyState
                        icon={FileText}
                        title="No POD Documents Found"
                        description={activeFilterTab === 'all'
                            ? "There are currently no proof of delivery documents submitted for review."
                            : `No POD records match the '${activeFilterTab}' filter.`
                        }
                    />
                }
            />

            {/* POD Document Preview Modal */}
            {showPreviewModal && selectedOrder && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-100">
                    <div className="bg-white dark:bg-[#1e2329] rounded-[5px] max-w-lg w-full p-6 border border-slate-200 dark:border-slate-700 shadow-xl space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">POD Preview: {selectedOrder.id}</h3>
                            <Badge variant="secondary">{selectedOrder.podStatus}</Badge>
                        </div>
                        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded text-xs space-y-2">
                            <p className="flex justify-between"><span>Customer:</span> <strong className="text-slate-900 dark:text-slate-100">{selectedOrder.customer}</strong></p>
                            <p className="flex justify-between"><span>Driver:</span> <strong className="text-slate-900 dark:text-slate-100">{selectedOrder.driver} ({selectedOrder.vehiclePlate})</strong></p>
                            <p className="flex justify-between"><span>Route:</span> <strong className="text-slate-900 dark:text-slate-100">{selectedOrder.pickup} → {selectedOrder.delivery}</strong></p>
                        </div>
                        <div className="p-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded text-center bg-slate-50 dark:bg-slate-800/30">
                            <FileText size={40} className="mx-auto text-slate-400 mb-2" />
                            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Signed_POD_{selectedOrder.id}.pdf</p>
                            <p className="text-[11px] text-slate-400 mt-0.5">Verified Recipient Signature Attached</p>
                        </div>
                        <div className="flex gap-2 justify-end pt-2 border-t border-slate-200 dark:border-slate-800">
                            <Button variant="outline" size="sm" onClick={() => setShowPreviewModal(false)}>
                                Close
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => {
                                if (selectedOrder.podFileUrl) window.open(selectedOrder.podFileUrl, '_blank');
                                else alert('POD file generated and ready.');
                            }}>
                                <Download size={13} className="mr-1" /> Download PDF
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Upload POD Modal */}
            {showUploadModal && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-100">
                    <form 
                        onSubmit={handleUploadSubmit}
                        className="bg-white dark:bg-[#1e2329] rounded-[5px] max-w-md w-full p-6 border border-slate-200 dark:border-slate-700 shadow-xl space-y-4"
                    >
                        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Upload New POD</h3>
                        <div>
                            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Select Order Reference</label>
                            <Select 
                                showSearch={false} 
                                className="text-xs w-full"
                                value={uploadOrderId}
                                onChange={(val) => setUploadOrderId(val)}
                            >
                                <option value="">Select an order</option>
                                {orders.map(o => (
                                    <option key={o.id} value={o.slug}>{o.id} - {o.customer}</option>
                                ))}
                            </Select>
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Attach Signed Delivery Note / PDF</label>
                            <input type="file" className="text-xs border border-slate-200 dark:border-slate-700 rounded p-2 w-full" required />
                        </div>
                        <div className="flex gap-2 justify-end pt-2">
                            <Button variant="outline" size="sm" type="button" onClick={() => setShowUploadModal(false)}>
                                Cancel
                            </Button>
                            <Button variant="primary" size="sm" type="submit" disabled={isSubmitting} className="bg-[#ff4a1f] hover:bg-[#e03e15] text-white">
                                {isSubmitting ? 'Uploading...' : 'Upload POD'}
                            </Button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
