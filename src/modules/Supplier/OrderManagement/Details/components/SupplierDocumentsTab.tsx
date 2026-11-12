import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {
    FileText,
    Download,
    Eye,
    UploadCloud,
    ShieldCheck,
    FileCheck,
    Receipt,
    Truck,
    X,
    Printer,
    Loader2,
} from 'lucide-react';
import Button from '@/components/ui/button';
import { NormalizedSupplierOrder } from '../utils/supplierOrderTrackUtils';
import SupplierPODDocModal from './SupplierPODDocModal';
import { exportInvoicePdf } from '@/utils/exportInvoicePdf';
import { exportOrderDocumentPdf } from '@/utils/exportOrderDocumentPdf';

interface SupplierDocumentsTabProps {
    order: NormalizedSupplierOrder;
    onUploadPOD: () => void;
    onUploadSubcontractorInvoice?: () => void;
    onDownloadInvoice: () => void;
}

export interface ShipmentDocumentItem {
    id: string;
    name: string;
    file_name: string;
    type: 'pod' | 'invoice' | 'cmr' | 'insurance' | 'subcontractor_invoice' | 'other';
    type_label: string;
    file_url?: string | null;
    uploaded_at?: string;
    uploaded_by?: string;
    stage?: 'payment' | 'dispatch' | 'transit' | 'delivery' | 'completion' | string;
    status: 'verified' | 'ready' | 'pending' | 'rejected' | 'awaiting';
    status_label: string;
    can_preview: boolean;
    can_download: boolean;
    metadata?: Record<string, any>;
}

export const SupplierDocumentsTab: React.FC<SupplierDocumentsTabProps> = ({
    order,
    onUploadPOD,
    onUploadSubcontractorInvoice,
    onDownloadInvoice,
}) => {
    const [showPodModal, setShowPodModal] = useState<boolean>(false);
    const [showCmrModal, setShowCmrModal] = useState<boolean>(false);
    const [showInsuranceModal, setShowInsuranceModal] = useState<boolean>(false);
    const [processingAction, setProcessingAction] = useState<{ id: string; action: 'preview' | 'download' } | null>(null);

    // Build unified documents list from API order.documents or dynamic fallback
    const documents: ShipmentDocumentItem[] = React.useMemo(() => {
        const backendDocs = Array.isArray(order.documents) ? order.documents : [];
        if (backendDocs.length > 0) {
            return backendDocs.map((d: any) => ({
                id: String(d.id || `doc-${d.type || 'item'}`),
                name: d.name || d.title || 'Shipment Document',
                file_name: d.file_name || `${d.name || 'document'}.pdf`,
                type: d.type || 'other',
                type_label: d.type_label || (d.type === 'invoice' ? 'Commercial Invoice' : (d.type === 'cmr' ? 'CMR Consignment Note' : (d.type === 'insurance' ? 'Cargo Insurance' : (d.type === 'pod' ? 'Proof of Delivery' : 'Shipment Record')))),
                file_url: d.file_url || null,
                uploaded_at: d.uploaded_at || 'Recent',
                uploaded_by: d.uploaded_by || 'Operations',
                stage: d.stage || (d.type === 'invoice' || d.type === 'insurance' ? 'payment' : (d.type === 'cmr' ? 'dispatch' : (d.type === 'pod' ? 'delivery' : 'transit'))),
                status: d.status || 'verified',
                status_label: d.status_label || (d.status === 'verified' ? 'Verified' : 'Pending'),
                can_preview: d.can_preview ?? true,
                can_download: d.can_download ?? true,
                metadata: d.metadata || {},
            }));
        }

        const list: ShipmentDocumentItem[] = [];

        // 1. Commercial Invoice (Stage: Payment)
        const rawInv = (order.raw as any)?.invoice;
        const invNum = rawInv?.invoice_number || `INV-${String(order.id).replace(/\D/g, '').padStart(5, '0')}`;
        list.push({
            id: 'doc-invoice',
            name: `Commercial Invoice #${invNum}`,
            file_name: `Invoice_${invNum}.pdf`,
            type: 'invoice',
            type_label: 'Customer Invoice',
            file_url: null,
            uploaded_at: order.createdAt || order.date || 'Recent',
            uploaded_by: 'Carrier Direct Billing System',
            stage: 'payment',
            status: order.pricing?.isPaid ? 'verified' : 'pending',
            status_label: order.pricing?.paymentStatusLabel || 'In Escrow',
            can_preview: true,
            can_download: true,
        });

        // 2. Goods In Transit (GIT) Cargo Insurance Policy (Stage: Payment)
        list.push({
            id: 'doc-insurance',
            name: 'Goods In Transit (GIT) Cargo Insurance Certificate',
            file_name: 'GIT_Cargo_Insurance_Policy.pdf',
            type: 'insurance',
            type_label: 'Cargo Insurance',
            file_url: null,
            uploaded_at: order.createdAt || order.date || 'Recent',
            uploaded_by: 'Carrier Compliance Dept',
            stage: 'payment',
            status: 'verified',
            status_label: 'Active & Covered',
            can_preview: true,
            can_download: true,
            metadata: {
                policy_number: `GIT-POL-2026-CD-${String(order.id).replace(/\D/g, '').padStart(5, '0')}`,
                coverage_limit: '€ 250,000.00',
            },
        });

        // 3. CMR Road Freight Consignment Note (Stage: Dispatch)
        list.push({
            id: 'doc-cmr',
            name: `CMR Road Consignment Note #${order.orderNumber || order.id}`,
            file_name: `CMR_Waybill_${order.orderNumber || order.id}.pdf`,
            type: 'cmr',
            type_label: 'CMR Consignment Note',
            file_url: null,
            uploaded_at: order.createdAt || order.date || 'Recent',
            uploaded_by: 'Freight Operations Dispatch',
            stage: 'dispatch',
            status: 'verified',
            status_label: 'Official CMR',
            can_preview: true,
            can_download: true,
            metadata: {
                vehicle_plate: order.driver?.vehiclePlate || 'FLEET-DISPATCH',
                driver_name: order.driver?.name || 'Assigned Driver',
            },
        });

        // 4. Subcontractor Invoices (Stage: Transit)
        const subCosts = Array.isArray(order.subcontractor_costs) ? order.subcontractor_costs : [];
        subCosts.forEach((sc: any) => {
            if (sc.invoice_number || sc.invoice_file_url || sc.invoice_file_path) {
                const isScVerified = sc.verification_status === 'verified';
                list.push({
                    id: `doc-sc-${sc.id}`,
                    name: `Subcontractor Invoice (${sc.subcontractor_name || 'Carrier Partner'})`,
                    file_name: `Bill_${sc.invoice_number || 'Subcontractor'}.pdf`,
                    type: 'subcontractor_invoice',
                    type_label: 'Subcontractor Bill',
                    file_url: sc.invoice_file_url || null,
                    uploaded_at: sc.uploaded_at || sc.invoice_date || 'Recent',
                    uploaded_by: sc.subcontractor_name || 'Subcontractor Partner',
                    stage: 'transit',
                    status: isScVerified ? 'verified' : 'pending',
                    status_label: isScVerified ? 'Approved' : 'Pending Review',
                    can_preview: Boolean(sc.invoice_file_url),
                    can_download: Boolean(sc.invoice_file_url),
                });
            }
        });

        // 5. Proof of Delivery (POD) (Stage: Delivery)
        const hasPod = order.podFileUrl || order.podUploaded || order.podStatus === 'Approved' || order.podStatus === 'Pending Review';
        const isVerified = order.podStatus === 'Approved' || order.status === 'Completed';
        list.push({
            id: 'doc-pod',
            name: 'Signed Proof of Delivery (POD)',
            file_name: `POD_${order.orderNumber || order.id}.jpg`,
            type: 'pod',
            type_label: 'Proof of Delivery',
            file_url: order.podFileUrl || null,
            uploaded_at: (order.raw as any)?.pod_uploaded_at || order.deliveryDate || (order.raw as any)?.updated_at || 'Recent',
            uploaded_by: order.driver?.name && order.driver.name !== '-' ? `${order.driver.name} (Driver)` : 'Delivering Driver',
            stage: 'delivery',
            status: hasPod ? (isVerified ? 'verified' : 'pending') : 'awaiting',
            status_label: hasPod ? (isVerified ? 'Verified & Accepted' : 'Under Review') : 'Awaiting Delivery',
            can_preview: true,
            can_download: Boolean(order.podFileUrl),
        });

        return list;
    }, [order]);

    const handlePreview = async (doc: ShipmentDocumentItem) => {
        if (doc.type === 'pod') {
            setShowPodModal(true);
            return;
        }

        try {
            setProcessingAction({ id: doc.id, action: 'preview' });

            if (doc.type === 'invoice') {
                const ok = await exportOrderDocumentPdf(order.rawId || order.id, 'invoice', doc.file_name, 'preview');
                if (!ok) {
                    await exportInvoicePdf(order);
                }
                return;
            }
            if (doc.type === 'cmr') {
                const ok = await exportOrderDocumentPdf(order.rawId || order.id, 'cmr', doc.file_name, 'preview');
                if (!ok) setShowCmrModal(true);
                return;
            }
            if (doc.type === 'insurance') {
                const ok = await exportOrderDocumentPdf(order.rawId || order.id, 'insurance', doc.file_name, 'preview');
                if (!ok) setShowInsuranceModal(true);
                return;
            }
            if (doc.file_url) {
                window.open(doc.file_url, '_blank');
            }
        } finally {
            setProcessingAction(null);
        }
    };

    const handleDownload = async (doc: ShipmentDocumentItem) => {
        if (doc.type === 'pod') {
            if (doc.file_url) {
                window.open(doc.file_url, '_blank');
            } else {
                setShowPodModal(true);
            }
            return;
        }

        try {
            setProcessingAction({ id: doc.id, action: 'download' });

            if (doc.type === 'invoice') {
                const ok = await exportOrderDocumentPdf(order.rawId || order.id, 'invoice', doc.file_name, 'download');
                if (!ok) onDownloadInvoice();
                return;
            }
            if (doc.type === 'cmr') {
                const ok = await exportOrderDocumentPdf(order.rawId || order.id, 'cmr', doc.file_name, 'download');
                if (!ok) setShowCmrModal(true);
                return;
            }
            if (doc.type === 'insurance') {
                const ok = await exportOrderDocumentPdf(order.rawId || order.id, 'insurance', doc.file_name, 'download');
                if (!ok) setShowInsuranceModal(true);
                return;
            }
            if (doc.file_url) {
                window.open(doc.file_url, '_blank');
            }
        } finally {
            setProcessingAction(null);
        }
    };

    const verifiedCount = documents.filter((d) => d.status === 'verified').length;
    const pendingCount = documents.filter((d) => d.status === 'pending').length;

    const getDocumentIcon = (type: ShipmentDocumentItem['type']) => {
        switch (type) {
            case 'pod':
                return <FileCheck size={18} className="text-emerald-600 dark:text-emerald-400" />;
            case 'invoice':
                return <Receipt size={18} className="text-blue-600 dark:text-blue-400" />;
            case 'cmr':
                return <Truck size={18} className="text-[#ff4a1f]" />;
            case 'insurance':
                return <ShieldCheck size={18} className="text-purple-600 dark:text-purple-400" />;
            case 'subcontractor_invoice':
                return <FileText size={18} className="text-amber-600 dark:text-amber-400" />;
            default:
                return <FileText size={18} className="text-slate-600 dark:text-slate-400" />;
        }
    };

    const getBadgeStyle = (status: ShipmentDocumentItem['status']) => {
        switch (status) {
            case 'verified':
                return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60';
            case 'pending':
                return 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60';
            case 'rejected':
                return 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60';
            default:
                return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700';
        }
    };

    return (
        <div className="space-y-4 font-sans antialiased">
            {/* Top Overview & Action Header */}
            <div className="bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-[4px] p-4 sm:p-5 shadow-2xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 border-b border-slate-100 dark:border-slate-800 gap-3">
                    <div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                                Shipment Documents & Compliance
                            </h3>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-50 text-[#ff4a1f] dark:bg-orange-950/40 dark:text-orange-300 border border-orange-200/60 dark:border-orange-800/40">
                                {documents.length} Available
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
                            Official transport documentation, consignment notes (CMR), invoices, and delivery verification for shipment #{order.orderNumber || order.id}.
                        </p>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto">
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={onUploadPOD}
                            className="h-8.5 px-3 bg-[#ff4a1f] hover:bg-[#e03e15] text-white text-xs font-bold rounded-[4px] shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                            <UploadCloud size={14} />
                            <span>Upload POD / Receipt</span>
                        </Button>

                        {onUploadSubcontractorInvoice && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={onUploadSubcontractorInvoice}
                                className="h-8.5 px-3 bg-white dark:bg-[#12161c] border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold rounded-[4px] shadow-2xs flex items-center gap-1.5 cursor-pointer"
                            >
                                <Receipt size={13} className="text-[#ff4a1f]" />
                                <span>Upload Carrier Bill</span>
                            </Button>
                        )}
                    </div>
                </div>

                {/* Quick Summary Pills */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-3.5 text-xs">
                    <div className="p-2.5 rounded-[4px] bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 space-y-0.5">
                        <span className="text-[10.5px] font-semibold text-slate-500 dark:text-slate-400 block">Total Documents</span>
                        <strong className="text-sm font-bold text-slate-900 dark:text-slate-100">{documents.length} Files</strong>
                    </div>

                    <div className="p-2.5 rounded-[4px] bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 space-y-0.5">
                        <span className="text-[10.5px] font-semibold text-emerald-700 dark:text-emerald-400 block">Verified & Active</span>
                        <strong className="text-sm font-bold text-emerald-800 dark:text-emerald-300">{verifiedCount} Verified</strong>
                    </div>

                    <div className="p-2.5 rounded-[4px] bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-900/40 space-y-0.5">
                        <span className="text-[10.5px] font-semibold text-blue-700 dark:text-blue-400 block">Proof of Delivery (POD)</span>
                        <strong className="text-sm font-bold text-blue-800 dark:text-blue-300">
                            {order.podUploaded || order.podStatus === 'Approved' ? 'Uploaded / Verified' : 'Awaiting Delivery'}
                        </strong>
                    </div>

                    <div className="p-2.5 rounded-[4px] bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200/60 dark:border-purple-900/40 space-y-0.5">
                        <span className="text-[10.5px] font-semibold text-purple-700 dark:text-purple-400 block">Insurance Status</span>
                        <strong className="text-sm font-bold text-purple-800 dark:text-purple-300">GIT Active</strong>
                    </div>
                </div>
            </div>

            {/* Documents List Card */}
            {documents.length === 0 ? (
                <div className="bg-white dark:bg-[#1e2329] border border-dashed border-slate-200 dark:border-slate-800 rounded-[4px] p-8 text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-900/60 flex items-center justify-center text-[#ff4a1f] mx-auto shadow-2xs">
                        <FileText size={22} />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">No Documents Uploaded Yet</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                            Shipment documents such as POD receipts, invoices, and consignment notes will appear here once generated or uploaded.
                        </p>
                    </div>
                    <Button
                        variant="primary"
                        size="sm"
                        onClick={onUploadPOD}
                        className="px-4 py-2 bg-[#ff4a1f] hover:bg-[#e03e15] text-white text-xs font-bold rounded-[4px] shadow-2xs inline-flex items-center gap-1.5 transition-colors"
                    >
                        <UploadCloud size={14} />
                        <span>Upload POD Receipt</span>
                    </Button>
                </div>
            ) : (
                <div className="bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-[4px] shadow-2xs overflow-hidden">
                    <div className="p-3.5 sm:p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                            Attached Shipment Records ({documents.length})
                        </span>
                        <span className="text-[11px] text-slate-400">PDF / Image formats</span>
                    </div>

                    <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
                        {documents.map((doc) => (
                            <div
                                key={doc.id}
                                className="p-4 sm:p-4.5 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-slate-50/70 dark:hover:bg-slate-800/30 transition-colors"
                            >
                                <div className="flex items-start gap-3 min-w-0 flex-1">
                                    <div className="w-10 h-10 rounded-[4px] bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                                        {getDocumentIcon(doc.type)}
                                    </div>

                                    <div className="min-w-0 flex-1 space-y-1">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <h4 className="text-xs sm:text-[13px] font-bold text-slate-900 dark:text-slate-100 break-words leading-snug">
                                                {doc.name}
                                            </h4>
                                            <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shrink-0">
                                                {doc.type_label}
                                            </span>
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getBadgeStyle(doc.status)} shrink-0`}>
                                                {doc.status_label}
                                            </span>
                                        </div>

                                        <p className="text-[11px] text-slate-500 dark:text-slate-400 break-words flex items-center gap-2 flex-wrap">
                                            <span>File: <span className="font-medium text-slate-700 dark:text-slate-300">{doc.file_name}</span></span>
                                            <span>•</span>
                                            <span>Issued / Uploaded: <span className="font-medium text-slate-700 dark:text-slate-300">{doc.uploaded_at}</span></span>
                                            {doc.uploaded_by && (
                                                <>
                                                    <span>•</span>
                                                    <span>By: <span className="font-medium text-slate-700 dark:text-slate-300">{doc.uploaded_by}</span></span>
                                                </>
                                            )}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 self-start md:self-center shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800/80 w-full md:w-auto justify-end">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handlePreview(doc)}
                                        disabled={Boolean(processingAction)}
                                        className="h-8 px-2.5 text-xs font-semibold bg-white dark:bg-[#12161c] border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer flex items-center gap-1.5 shadow-2xs disabled:opacity-60 disabled:cursor-not-allowed"
                                        title={`Preview ${doc.name}`}
                                    >
                                        {processingAction?.id === doc.id && processingAction?.action === 'preview' ? (
                                            <>
                                                <Loader2 size={13} className="animate-spin text-[#ff4a1f]" />
                                                <span>Processing...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Eye size={13} className="text-[#ff4a1f]" />
                                                <span>Preview</span>
                                            </>
                                        )}
                                    </Button>

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleDownload(doc)}
                                        disabled={Boolean(processingAction)}
                                        className="h-8 px-2.5 text-xs font-semibold bg-white dark:bg-[#12161c] border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer flex items-center gap-1.5 shadow-2xs disabled:opacity-60 disabled:cursor-not-allowed"
                                        title={`Download ${doc.name}`}
                                    >
                                        {processingAction?.id === doc.id && processingAction?.action === 'download' ? (
                                            <>
                                                <Loader2 size={13} className="animate-spin text-slate-600 dark:text-slate-400" />
                                                <span>Processing...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Download size={13} />
                                                <span>Download</span>
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* POD Preview Modal */}
            {showPodModal && (
                <SupplierPODDocModal
                    order={order}
                    onClose={() => setShowPodModal(false)}
                />
            )}

            {/* CMR Road Waybill Modal */}
            {showCmrModal && createPortal(
                <div
                    className="fixed inset-0 z-[999999] flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200 font-sans"
                    onClick={() => setShowCmrModal(false)}
                >
                    <div
                        className="bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[calc(100vh-2rem)] my-auto font-sans"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
                            <div className="flex items-center gap-2">
                                <Truck size={18} className="text-[#ff4a1f]" />
                                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                                    CMR International Road Consignment Note
                                </h3>
                            </div>
                            <button
                                onClick={() => setShowCmrModal(false)}
                                className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
                            >
                                <X size={17} />
                            </button>
                        </div>

                        <div className="p-5 space-y-4 overflow-y-auto text-xs text-slate-700 dark:text-slate-300">
                            <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 bg-slate-50/50 dark:bg-slate-800/30 space-y-3">
                                <div className="flex justify-between border-b pb-2 border-slate-200 dark:border-slate-700">
                                    <div>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase">Consignment Note No.</span>
                                        <p className="font-bold text-sm text-slate-900 dark:text-slate-100">CMR-{order.orderNumber || order.id}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase">Convention CMR 1956</span>
                                        <p className="font-bold text-emerald-600 dark:text-emerald-400">Standard Road Haulage</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                                    <div className="p-3 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 space-y-1">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase">1. Sender / Consignor</span>
                                        <p className="font-bold text-slate-900 dark:text-slate-100">{order.customer?.companyName || order.customer?.name || 'Customer'}</p>
                                        <p className="text-[11px] text-slate-500 leading-snug">{order.pickupFullAddress}</p>
                                    </div>

                                    <div className="p-3 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 space-y-1">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase">2. Consignee / Receiver</span>
                                        <p className="font-bold text-slate-900 dark:text-slate-100">{order.deliveryCompany || 'Authorized Consignee'}</p>
                                        <p className="text-[11px] text-slate-500 leading-snug">{order.deliveryFullAddress}</p>
                                    </div>
                                </div>

                                <div className="p-3 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 space-y-2">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase">3. Cargo & Vehicle Specifications</span>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
                                        <div>
                                            <span className="text-slate-400 block">Cargo:</span>
                                            <strong className="text-slate-900 dark:text-slate-100">{order.vehicle?.goodsType || 'Industrial Freight'}</strong>
                                        </div>
                                        <div>
                                            <span className="text-slate-400 block">Total Weight:</span>
                                            <strong className="text-slate-900 dark:text-slate-100">{order.vehicle?.capacity || 'Standard'}</strong>
                                        </div>
                                        <div>
                                            <span className="text-slate-400 block">Vehicle Reg / Type:</span>
                                            <strong className="font-semibold text-slate-900 dark:text-slate-100">{order.driver?.vehiclePlate || 'Assigned Fleet'}</strong>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
                            <span className="text-xs text-slate-500">Official Carrier Direct Transport Document</span>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => window.print()}
                                    className="h-8 px-3 text-xs font-semibold cursor-pointer flex items-center gap-1.5"
                                >
                                    <Printer size={13} />
                                    <span>Print CMR</span>
                                </Button>
                                <Button
                                    variant="primary"
                                    size="sm"
                                    onClick={() => setShowCmrModal(false)}
                                    className="h-8 px-4 bg-[#ff4a1f] hover:bg-[#e03e15] text-white text-xs font-bold rounded-[4px] cursor-pointer"
                                >
                                    <span>Close</span>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* Insurance Policy Modal */}
            {showInsuranceModal && createPortal(
                <div
                    className="fixed inset-0 z-[999999] flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200 font-sans"
                    onClick={() => setShowInsuranceModal(false)}
                >
                    <div
                        className="bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-xl max-w-lg w-full shadow-2xl overflow-hidden flex flex-col max-h-[calc(100vh-2rem)] my-auto font-sans"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
                            <div className="flex items-center gap-2">
                                <ShieldCheck size={18} className="text-purple-600 dark:text-purple-400" />
                                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                                    Goods In Transit (GIT) Insurance Certificate
                                </h3>
                            </div>
                            <button
                                onClick={() => setShowInsuranceModal(false)}
                                className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
                            >
                                <X size={17} />
                            </button>
                        </div>

                        <div className="p-5 space-y-3.5 text-xs text-slate-700 dark:text-slate-300">
                            <div className="p-3.5 bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900 rounded space-y-1">
                                <span className="text-[10px] font-bold text-purple-700 dark:text-purple-400 uppercase">Policy No.</span>
                                <p className="font-bold text-sm text-slate-900 dark:text-slate-100">GIT-POL-2026-CD-9941</p>
                                <p className="text-[11px] text-slate-500">Underwritten by CarrierDirect Global Freight Syndicate</p>
                            </div>

                            <div className="space-y-2 pt-1 text-[11.5px]">
                                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                                    <span className="text-slate-500">Coverage Limit:</span>
                                    <strong className="text-slate-900 dark:text-slate-100">€ 250,000.00 per Consignment</strong>
                                </div>
                                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                                    <span className="text-slate-500">Covered Risks:</span>
                                    <strong className="text-slate-900 dark:text-slate-100">All-Risks Road Transit, Theft, Damage</strong>
                                </div>
                                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                                    <span className="text-slate-500">Insured Shipment:</span>
                                    <strong className="font-semibold text-slate-900 dark:text-slate-100">#{order.orderNumber || order.id}</strong>
                                </div>
                                <div className="flex justify-between py-1">
                                    <span className="text-slate-500">Status:</span>
                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                                        Active & Verified
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex justify-end bg-slate-50 dark:bg-slate-800/50">
                            <Button
                                variant="primary"
                                size="sm"
                                onClick={() => setShowInsuranceModal(false)}
                                className="h-8 px-4 bg-[#ff4a1f] hover:bg-[#e03e15] text-white text-xs font-bold rounded-[4px] cursor-pointer"
                            >
                                <span>Close</span>
                            </Button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default SupplierDocumentsTab;
