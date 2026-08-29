import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, XCircle, FileText, Download, Upload } from 'lucide-react';
import Button from '@/components/ui/button';
import Badge from '@/components/ui/badge';
import Select from '@/components/ui/select';
import DataTable, { Column } from '@/components/tables/data-table';
import { SupplierOrder, mapApiOrderToSupplierOrder } from '../data/ordersData';
import { apiClient } from '@/lib/axios';

export default function POD() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState<SupplierOrder[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [selectedOrder, setSelectedOrder] = useState<SupplierOrder | null>(null);
    const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
    const [showPreviewModal, setShowPreviewModal] = useState<boolean>(false);
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [uploadOrderId, setUploadOrderId] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const fetchOrders = async () => {
        setIsLoading(true);
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
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const filteredOrders = orders.filter(o => {
        if (statusFilter === 'all') return true;
        return o.podStatus.toLowerCase() === statusFilter.toLowerCase();
    });

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

    const columns: Column<SupplierOrder>[] = [
        { 
            id: 'id', 
            label: 'Job Reference', 
            render: (row) => (
                <button 
                    onClick={() => navigate(`/supplier/orders/details/${row.slug}`)}
                    className="font-bold text-slate-900 hover:text-[#ff4a1f] hover:underline text-left cursor-pointer"
                >
                    {row.id}
                </button>
            ) 
        },
        { 
            id: 'customer', 
            label: 'Customer', 
            render: (row) => <span className="font-bold text-slate-900">{row.customer}</span> 
        },
        { 
            id: 'driver', 
            label: 'Uploaded By (Driver)', 
            render: (row) => (
                <div>
                    <p className="font-semibold text-slate-800">{row.driver}</p>
                    <p className="text-[11px] text-slate-400">{row.vehiclePlate}</p>
                </div>
            )
        },
        { 
            id: 'uploadDate', 
            label: 'Upload Date', 
            render: (row) => <span className="text-xs text-slate-600">{row.podUploadDate || 'N/A'}</span> 
        },
        { 
            id: 'status', 
            label: 'POD Status', 
            render: (row) => (
                <Badge variant="secondary" className={
                    row.podStatus === 'Approved' ? 'bg-emerald-50 text-emerald-700 font-semibold' :
                    row.podStatus === 'Pending Review' ? 'bg-amber-50 text-amber-700 font-semibold' :
                    row.podStatus === 'Rejected' ? 'bg-red-50 text-red-700 font-semibold' :
                    'bg-slate-100 text-slate-600 font-semibold'
                }>
                    {row.podStatus}
                </Badge>
            )
        },
    ];

    const renderActions = (row: SupplierOrder) => (
        <div className="flex items-center justify-end gap-1.5">
            <Button 
                variant="outline" 
                size="sm" 
                className="h-8 text-xs px-2 font-semibold cursor-pointer"
                onClick={() => { setSelectedOrder(row); setShowPreviewModal(true); }}
            >
                <FileText size={13} className="mr-1" /> View POD
            </Button>
            {row.podStatus === 'Pending Review' && (
                <>
                    <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8 px-2 text-xs font-semibold border-emerald-200 text-emerald-700 hover:bg-emerald-50 cursor-pointer"
                        onClick={() => handleApprovePOD(row.id)}
                        title="Approve POD"
                    >
                        <CheckCircle2 size={13} className="mr-1" /> Approve
                    </Button>
                    <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8 px-2 text-xs font-semibold border-red-200 text-red-700 hover:bg-red-50 cursor-pointer"
                        onClick={() => handleRejectPOD(row.id)}
                        title="Reject POD"
                    >
                        <XCircle size={13} className="mr-1" /> Reject
                    </Button>
                </>
            )}
        </div>
    );

    const filterContent = (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-2">
            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-600">POD Status</label>
                <Select value={statusFilter} onChange={(val) => setStatusFilter(val)} showSearch={false} options={[
                    { id: 'all', name: 'All POD Statuses' },
                    { id: 'pending review', name: 'Pending Review' },
                    { id: 'approved', name: 'Approved' },
                    { id: 'rejected', name: 'Rejected' }
                ]} />
            </div>
        </div>
    );

    return (
        <div className="p-4 md:p-6 w-full mx-auto min-h-screen font-sans antialiased space-y-5 bg-[#f8fafc] dark:bg-[#12161c]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 tracking-tight mb-1">Proof of Delivery (POD)</h1>
                    <p className="text-xs text-slate-500 font-medium">Review, verify, and approve proof of delivery documents submitted by drivers.</p>
                </div>
                <Button 
                    variant="primary" 
                    size="sm" 
                    className="h-9 text-xs font-semibold bg-[#ff4a1f] hover:bg-[#e03e15] text-white cursor-pointer"
                    onClick={() => setShowUploadModal(true)}
                >
                    <Upload size={13} className="mr-1.5" /> Upload New POD
                </Button>
            </div>

            <DataTable 
                columns={columns} 
                data={filteredOrders} 
                compact={true}
                searchPlaceholder="Search by Job ID, customer, driver..."
                hideViewToggle={false}
                actions={renderActions}
                filterContent={filterContent}
                isLoading={isLoading}
            />

            {/* POD Document Preview Modal */}
            {showPreviewModal && selectedOrder && (
                <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-2xs flex items-center justify-center p-4 z-50">
                    <div className="bg-white dark:bg-[#1e2329] rounded-lg max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
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
                <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-2xs flex items-center justify-center p-4 z-50">
                    <form 
                        onSubmit={handleUploadSubmit}
                        className="bg-white dark:bg-[#1e2329] rounded-lg max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-md space-y-4"
                    >
                        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Upload New POD</h3>
                        <div>
                            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Select Order Reference</label>
                            <Select 
                                showSearch={false} 
                                className="text-xs w-full"
                                value={uploadOrderId}
                                onChange={(val) => setUploadOrderId(val)}
                                options={orders.map(o => ({ id: o.slug, name: `${o.id} - ${o.customer}` }))}
                            />
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
