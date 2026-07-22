import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, CheckCircle2, XCircle, FileText, Download, Upload, Eye, Check } from 'lucide-react';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Badge from '@/components/ui/badge';
import Select from '@/components/ui/select';
import DataTable, { Column } from '@/components/tables/data-table';
import { mockSupplierOrders, SupplierOrder } from '../data/ordersData';

export default function POD() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState<SupplierOrder[]>(mockSupplierOrders);
    const [selectedOrder, setSelectedOrder] = useState<SupplierOrder | null>(null);
    const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
    const [showPreviewModal, setShowPreviewModal] = useState<boolean>(false);
    const [statusFilter, setStatusFilter] = useState<string>('all');

    const filteredOrders = orders.filter(o => {
        if (statusFilter === 'all') return true;
        return o.podStatus.toLowerCase() === statusFilter.toLowerCase();
    });

    const handleApprovePOD = (orderId: string) => {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, podStatus: 'Approved' } : o));
    };

    const handleRejectPOD = (orderId: string) => {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, podStatus: 'Rejected' } : o));
    };

    const columns: Column<SupplierOrder>[] = [
        { 
            id: 'id', 
            label: 'Job Reference', 
            render: (row) => (
                <button 
                    onClick={() => navigate(`/supplier/orders/details/${row.slug}`)}
                    className="font-bold text-slate-900 hover:text-[#ff4a1f] hover:underline text-left"
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
                className="h-8 text-xs px-2 font-semibold"
                onClick={() => { setSelectedOrder(row); setShowPreviewModal(true); }}
            >
                <FileText size={13} className="mr-1" /> View POD
            </Button>
            {row.podStatus === 'Pending Review' && (
                <>
                    <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8 px-2 text-xs font-semibold border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                        onClick={() => handleApprovePOD(row.id)}
                        title="Approve POD"
                    >
                        <CheckCircle2 size={13} className="mr-1" /> Approve
                    </Button>
                    <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8 px-2 text-xs font-semibold border-red-200 text-red-700 hover:bg-red-50"
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
                <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} showSearch={false}>
                    <option value="all">All POD Statuses</option>
                    <option value="pending review">Pending Review</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                </Select>
            </div>
        </div>
    );

    return (
        <div className="p-4 md:p-6 w-full mx-auto min-h-screen font-sans antialiased space-y-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 tracking-tight mb-1">Proof of Delivery (POD)</h1>
                    <p className="text-xs text-slate-500 font-medium">Review, verify, and approve proof of delivery documents submitted by drivers.</p>
                </div>
                <Button 
                    variant="primary" 
                    size="sm" 
                    className="h-9 text-xs font-semibold bg-[#ff4a1f] hover:bg-[#e03e15] text-white"
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
                hideViewToggle={true}
                actions={renderActions}
                filterContent={filterContent}
            />

            {/* POD Document Preview Modal */}
            {showPreviewModal && selectedOrder && (
                <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-2xs flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-lg w-full p-6 border border-slate-200 shadow-md space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                            <h3 className="text-sm font-bold text-slate-900">POD Preview: {selectedOrder.id}</h3>
                            <Badge variant="secondary">{selectedOrder.podStatus}</Badge>
                        </div>
                        <div className="p-4 bg-slate-50 border border-slate-200 rounded text-xs space-y-2">
                            <p className="flex justify-between"><span>Customer:</span> <strong className="text-slate-900">{selectedOrder.customer}</strong></p>
                            <p className="flex justify-between"><span>Driver:</span> <strong className="text-slate-900">{selectedOrder.driver} ({selectedOrder.vehiclePlate})</strong></p>
                            <p className="flex justify-between"><span>Route:</span> <strong className="text-slate-900">{selectedOrder.pickup} → {selectedOrder.delivery}</strong></p>
                        </div>
                        <div className="p-8 border-2 border-dashed border-slate-200 rounded text-center bg-slate-50">
                            <FileText size={40} className="mx-auto text-slate-400 mb-2" />
                            <p className="text-xs font-bold text-slate-800">Signed_POD_{selectedOrder.id}.pdf</p>
                            <p className="text-[11px] text-slate-400 mt-0.5">Verified Recipient Signature Attached</p>
                        </div>
                        <div className="flex gap-2 justify-end pt-2 border-t border-slate-200">
                            <Button variant="outline" size="sm" onClick={() => setShowPreviewModal(false)}>
                                Close
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => alert(`Downloading POD...`)}>
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
                        onSubmit={(e) => {
                            e.preventDefault();
                            setShowUploadModal(false);
                            alert('POD Document uploaded successfully!');
                        }}
                        className="bg-white rounded-lg max-w-md w-full p-6 border border-slate-200 shadow-md space-y-4"
                    >
                        <h3 className="text-sm font-bold text-slate-900">Upload New POD</h3>
                        <div>
                            <label className="text-xs font-semibold text-slate-700 block mb-1">Select Order Reference</label>
                            <Select showSearch={false} className="text-xs">
                                <option value="">Select Order...</option>
                                {orders.map(o => (
                                    <option key={o.id} value={o.id}>{o.id} - {o.customer} ({o.pickup} → {o.delivery})</option>
                                ))}
                            </Select>
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-slate-700 block mb-1">Attach Signed Delivery Note / PDF</label>
                            <input type="file" className="text-xs border border-slate-200 rounded p-2 w-full" required />
                        </div>
                        <div className="flex gap-2 justify-end pt-2">
                            <Button variant="outline" size="sm" type="button" onClick={() => setShowUploadModal(false)}>
                                Cancel
                            </Button>
                            <Button variant="primary" size="sm" type="submit" className="bg-[#ff4a1f] hover:bg-[#e03e15] text-white">
                                Upload POD
                            </Button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
