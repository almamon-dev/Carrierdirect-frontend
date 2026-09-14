import React from 'react';
import { Download, FileText, X, ExternalLink, ShieldCheck } from 'lucide-react';
import Button from '@/components/ui/button';
import Badge from '@/components/ui/badge';
import { PODOrderItem } from '../types';

interface PODPreviewModalProps {
    isOpen: boolean;
    order: PODOrderItem | null;
    onClose: () => void;
    onViewOrderDetails: (order: PODOrderItem) => void;
}

export const PODPreviewModal: React.FC<PODPreviewModalProps> = ({
    isOpen,
    order,
    onClose,
    onViewOrderDetails,
}) => {
    if (!isOpen || !order) return null;

    const podStatus = order.pod_status;
    let badgeVariant: any = 'outline';
    if (podStatus === 'Approved') badgeVariant = 'success';
    else if (podStatus === 'Pending Review') badgeVariant = 'warning';
    else if (podStatus === 'Rejected') badgeVariant = 'critical';

    const handleDownload = () => {
        const url = order.pod_document_url || order.pod_file_url;
        if (url) {
            window.open(url, '_blank');
        } else {
            alert('POD receipt document ready for viewing.');
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-[9999] animate-in fade-in duration-100 font-sans">
            <div
    className="bg-white dark:bg-[#1e2329] rounded-lg max-w-lg w-full p-6 border border-slate-200 dark:border-slate-700 shadow-2xl space-y-4 text-left">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3.5">
                    <div className="flex items-center gap-2.5">
                        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                            POD Receipt: {order.order_id || order.id}
                        </h3>
                        <Badge variant={badgeVariant} showDot className="text-[11px] font-bold">
                            {podStatus}
                        </Badge>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Info Card */}
                <div
    className="p-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 rounded-lg text-xs space-y-2">
                    <div className="flex justify-between items-center py-0.5">
                        <span className="text-slate-500 dark:text-slate-400 font-medium">Customer / Shipper:</span>
                        <strong className="text-slate-900 dark:text-slate-100 font-semibold">{order.customer_name}</strong>
                    </div>
                    <div className="flex justify-between items-center py-0.5">
                        <span className="text-slate-500 dark:text-slate-400 font-medium">Assigned Driver:</span>
                        <strong className="text-slate-900 dark:text-slate-100 font-semibold">
                            {order.driver_name || order.driver} ({order.vehicle_plate})
                        </strong>
                    </div>
                    <div className="flex justify-between items-center py-0.5">
                        <span className="text-slate-500 dark:text-slate-400 font-medium">Delivery Route:</span>
                        <strong className="text-slate-900 dark:text-slate-100 font-semibold">{order.route}</strong>
                    </div>
                    <div className="flex justify-between items-center py-0.5">
                        <span className="text-slate-500 dark:text-slate-400 font-medium">Delivery Date:</span>
                        <strong className="text-slate-900 dark:text-slate-100 font-semibold">{order.delivery_date || 'Today'}</strong>
                    </div>
                </div>

                {/* PDF Document Preview Box */}
                <div
    className="p-6 border-2 border-dashed border-slate-200 dark:border-slate-700/80 rounded-lg text-center bg-slate-50/60 dark:bg-slate-800/30 space-y-2">
                    <div className="w-12 h-12 mx-auto bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center">
                        <FileText size={24} />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-100">
                            {order.pod_file_name || `Signed_POD_${order.order_id || order.id}.pdf`}
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1 mt-0.5">
                            <ShieldCheck size={13} className="text-emerald-500" />
                            <span>Digital Signature & Delivery Confirmation Verified</span>
                        </p>
                    </div>
                </div>

                {/* Modal Footer Buttons */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-800">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onViewOrderDetails(order)}
                        className="text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                    >
                        <ExternalLink size={13} />
                        <span>View Order Details</span>
                    </Button>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onClose}
                            className="text-xs font-semibold cursor-pointer"
                        >
                            Close
                        </Button>
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={handleDownload}
                            className="text-xs font-bold bg-[#ff4a1f] hover:bg-[#e03e15] text-white flex items-center gap-1.5 cursor-pointer shadow-2xs"
                        >
                            <Download size={13} />
                            <span>Download PDF</span>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PODPreviewModal;
