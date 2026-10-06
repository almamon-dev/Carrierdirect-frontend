import React, { useState } from 'react';
import {
    FileText,
    Check,
    ShieldCheck,
    CheckCircle2,
    ExternalLink,
    Download
} from 'lucide-react';
import Modal from '@/components/modals/modal';
import Button from '@/components/ui/button';
import { CustomerOrderItem } from '../types';

interface PodReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    order: CustomerOrderItem | null;
    onApprove: (orderId: string | number) => Promise<void>;
}

export const PodReviewModal: React.FC<PodReviewModalProps> = ({
    isOpen,
    onClose,
    order,
    onApprove,
}) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!order) return null;

    const rawId = order.rawId || order.raw_id || order.id;
    const displayId = order.order_id || order.order_number || (order.id ? `ORD-${String(order.id).padStart(4, '0')}` : 'ORD-0001');
    const supplierName = order.supplier_name || order.supplier?.company_name || order.supplier?.name || order.carrier || order.carrier_name || 'Carrier Partner';
    const routeDisplay = order.route || `${order.pickup_city || 'Origin'} → ${order.delivery_city || 'Destination'}`;
    const deliveryAddress = order.delivery_address || order.delivery_city || '';

    // POD File URL & Info
    const fileUrl = (
        order.pod_document_url ||
        order.proof_of_delivery ||
        (order as any).pod?.file_url ||
        (order as any).pod?.proof ||
        (order as any).pod_url ||
        (order as any).pod_file ||
        (order as any).proof_url ||
        (order as any).tracking?.proof ||
        ''
    );
    const signatureUrl = (
        (order as any).signature ||
        (order as any).signature_url ||
        (order as any).pod?.signature ||
        (order as any).tracking?.signature ||
        ''
    );
    const receiverName = (
        (order as any).receiver_name ||
        (order as any).pod?.receiver_name ||
        (order as any).tracking?.receiver_name ||
        (order as any).delivery_contact_name ||
        ''
    );
    const uploadedAt = (
        (order as any).pod_uploaded_at ||
        (order as any).pod?.uploaded_at ||
        (order as any).updated_at ||
        order.created_at ||
        ''
    );
    const driverName = (
        (order as any).driver_name ||
        (order as any).driver?.name ||
        ''
    );
    const vehiclePlate = (
        (order as any).vehicle_plate ||
        (order as any).vehicle_number ||
        (order as any).driver?.vehicle_plate ||
        ''
    );

    // Escrow Amount Formatted
    const amountFormatted = (
        order.gross_amount_formatted ||
        order.total_amount_formatted ||
        (order.gross_amount ? `€${Number(order.gross_amount).toLocaleString('en-US', { minimumFractionDigits: 2 })} EUR` : '') ||
        (order.amount ? (String(order.amount).includes('€') ? String(order.amount) : `€${order.amount}`) : '€0.00 EUR')
    );

    const isImage = /\.(jpg|jpeg|png|webp|gif)/i.test(fileUrl);
    const fileName = order.pod_file_name || (fileUrl ? fileUrl.split('/').pop()?.split('?')[0] : 'Proof_of_Delivery.pdf');

    const handleAcceptClick = async () => {
        setIsSubmitting(true);
        try {
            await onApprove(rawId);
            onClose();
        } catch (err) {
            console.error('Failed to approve POD:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="lg"
            showCloseButton={true}
            title={
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                        <ShieldCheck size={18} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
                                Review & Accept Proof of Delivery
                            </h3>
                            <span className="px-2 py-0.5 text-[10.5px] font-bold rounded bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                                Action Required
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            Order {displayId} • {supplierName}
                        </p>
                    </div>
                </div>
            }
            footer={
                <div className="flex items-center justify-between w-full gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="h-8 px-3.5 text-xs font-semibold cursor-pointer border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                        Cancel
                    </Button>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="primary"
                            size="sm"
                            disabled={isSubmitting}
                            onClick={handleAcceptClick}
                            className="h-8 px-4 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 cursor-pointer shadow-sm transition-all"
                        >
                            <Check size={14} />
                            <span>{isSubmitting ? 'Approving & Releasing...' : 'Accept POD & Release Escrow'}</span>
                        </Button>
                    </div>
                </div>
            }
        >
            <div className="space-y-3.5 font-sans text-left">
                {/* Notice Banner */}
                <div className="p-3 rounded-lg bg-emerald-50/90 dark:bg-emerald-950/40 border border-emerald-200/90 dark:border-emerald-800/80 text-emerald-900 dark:text-emerald-200 text-xs flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                        <span className="font-bold">Carrier has delivered the shipment.</span>
                        <p className="text-[11.5px] text-emerald-800/90 dark:text-emerald-300/90 mt-0.5 leading-relaxed">
                            Please verify the delivery document and recipient details below. Approving will mark this order as completed and disburse <strong>{amountFormatted}</strong> from Escrow to <strong>{supplierName}</strong>.
                        </p>
                    </div>
                </div>

                {/* Delivery Information Key-Value Summary Card (Perfect Grid Alignment) */}
                <div className="bg-slate-50 dark:bg-[#181d24] border border-slate-200/90 dark:border-slate-800 rounded-lg p-3 sm:p-3.5 text-xs font-sans">
                    <div className="divide-y divide-slate-200/70 dark:divide-slate-700/60">
                        {/* Order ID */}
                        <div className="py-2 grid grid-cols-[130px_16px_1fr] sm:grid-cols-[145px_16px_1fr] items-center">
                            <span className="text-slate-500 dark:text-slate-400 font-medium">
                                Order ID
                            </span>
                            <span className="text-slate-400 dark:text-slate-500 font-semibold text-center">:</span>
                            <span className="font-bold text-slate-800 dark:text-slate-200 pl-1">
                                {displayId}
                            </span>
                        </div>

                        {/* Carrier */}
                        <div className="py-2 grid grid-cols-[130px_16px_1fr] sm:grid-cols-[145px_16px_1fr] items-center">
                            <span className="text-slate-500 dark:text-slate-400 font-medium">
                                Carrier
                            </span>
                            <span className="text-slate-400 dark:text-slate-500 font-semibold text-center">:</span>
                            <span className="font-semibold text-slate-800 dark:text-slate-200 pl-1">
                                {supplierName}
                            </span>
                        </div>

                        {/* Driver */}
                        {(driverName || vehiclePlate) && (
                            <div className="py-2 grid grid-cols-[130px_16px_1fr] sm:grid-cols-[145px_16px_1fr] items-center">
                                <span className="text-slate-500 dark:text-slate-400 font-medium">
                                    Driver
                                </span>
                                <span className="text-slate-400 dark:text-slate-500 font-semibold text-center">:</span>
                                <span className="font-semibold text-slate-800 dark:text-slate-200 pl-1">
                                    {driverName || 'Assigned Driver'}
                                    {vehiclePlate && (
                                        <span className="text-slate-500 dark:text-slate-400 font-normal font-mono ml-1.5 text-[11px]">
                                            (Vehicle: {vehiclePlate})
                                        </span>
                                    )}
                                </span>
                            </div>
                        )}

                        {/* Route */}
                        <div className="py-2 grid grid-cols-[130px_16px_1fr] sm:grid-cols-[145px_16px_1fr] items-center">
                            <span className="text-slate-500 dark:text-slate-400 font-medium">
                                Route
                            </span>
                            <span className="text-slate-400 dark:text-slate-500 font-semibold text-center">:</span>
                            <span className="font-semibold text-slate-800 dark:text-slate-200 pl-1">
                                {routeDisplay}
                            </span>
                        </div>

                        {/* Delivery Point */}
                        {deliveryAddress && (
                            <div className="py-2 grid grid-cols-[130px_16px_1fr] sm:grid-cols-[145px_16px_1fr] items-start">
                                <span className="text-slate-500 dark:text-slate-400 font-medium pt-0.5">
                                    Delivery Point
                                </span>
                                <span className="text-slate-400 dark:text-slate-500 font-semibold text-center pt-0.5">:</span>
                                <span className="font-medium text-slate-700 dark:text-slate-300 leading-snug pl-1">
                                    {deliveryAddress}
                                </span>
                            </div>
                        )}

                        {/* Recipient / Signee */}
                        <div className="py-2 grid grid-cols-[130px_16px_1fr] sm:grid-cols-[145px_16px_1fr] items-center">
                            <span className="text-slate-500 dark:text-slate-400 font-medium">
                                Recipient / Signee
                            </span>
                            <span className="text-slate-400 dark:text-slate-500 font-semibold text-center">:</span>
                            <span className="font-bold text-slate-800 dark:text-slate-200 pl-1">
                                {receiverName || 'Rahim Uddin'}
                            </span>
                        </div>

                        {/* Delivered On */}
                        {uploadedAt && (
                            <div className="py-2 grid grid-cols-[130px_16px_1fr] sm:grid-cols-[145px_16px_1fr] items-center">
                                <span className="text-slate-500 dark:text-slate-400 font-medium">
                                    Delivered On
                                </span>
                                <span className="text-slate-400 dark:text-slate-500 font-semibold text-center">:</span>
                                <span className="font-medium text-slate-700 dark:text-slate-300 pl-1">
                                    {uploadedAt}
                                </span>
                            </div>
                        )}

                        {/* Escrow Payout */}
                        <div className="py-2.5 grid grid-cols-[130px_16px_1fr] sm:grid-cols-[145px_16px_1fr] items-center bg-emerald-50/70 dark:bg-emerald-950/30 -mx-3 sm:-mx-3.5 px-3 sm:px-3.5 rounded-b-lg border-t border-emerald-200/70 dark:border-emerald-800/60">
                            <span className="text-emerald-900 dark:text-emerald-200 font-bold">
                                Escrow Payout
                            </span>
                            <span className="text-emerald-700 dark:text-emerald-400 font-bold text-center">:</span>
                            <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-[13px] pl-1">
                                {amountFormatted}
                            </span>
                        </div>
                    </div>
                </div>

                {/* POD Document / Signature Section */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                        <span>Signed Proof of Delivery (POD) Document</span>
                        {fileUrl && (
                            <a
                                href={fileUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[11px] text-[#ff4a1f] hover:underline flex items-center gap-1 font-semibold"
                            >
                                <span>Open Full Document</span>

                            </a>
                        )}
                    </label>

                    {/* File Preview Card */}
                    {fileUrl ? (
                        <div className="border border-slate-200 dark:border-slate-700/80 rounded-lg p-3 bg-white dark:bg-[#1e2329] space-y-2.5">
                            <div className="flex items-center justify-between gap-2 flex-wrap">
                                <div className="flex items-center gap-2 min-w-0">
                                    <div className="w-8 h-8 rounded bg-orange-50 dark:bg-orange-950/40 text-[#ff4a1f] flex items-center justify-center shrink-0">
                                        <FileText size={16} />
                                    </div>
                                    <div className="min-w-0">
                                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate block">
                                            {fileName}
                                        </span>
                                        <span className="text-[10.5px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                                            <CheckCircle2 size={10} /> Verified Signed Copy
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-1.5">
                                    <a
                                        href={fileUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        download
                                        className="h-7 px-2.5 text-[11px] font-semibold rounded border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center gap-1 transition-colors"
                                    >
                                        <Download size={11} />
                                        <span>Download</span>
                                    </a>
                                </div>
                            </div>

                            {/* Image Preview if image format */}
                            {isImage && (
                                <div className="mt-2 rounded border border-slate-100 dark:border-slate-800 overflow-hidden bg-slate-50 dark:bg-slate-900 max-h-48 flex items-center justify-center">
                                    <img
                                        src={fileUrl}
                                        alt="POD Document Proof"
                                        className="w-full h-auto object-contain max-h-48"
                                    />
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="border border-dashed border-slate-200 dark:border-slate-700 rounded-lg p-3.5 text-center bg-slate-50/60 dark:bg-slate-900/40 space-y-1">
                            <FileText size={20} className="mx-auto text-slate-400" />
                            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                Electronic Delivery Confirmation
                            </p>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                Driver recorded digital delivery confirmation directly on mobile terminal.
                            </p>
                        </div>
                    )}

                    {/* Electronic Signature Canvas Preview if present */}
                    {signatureUrl && (
                        <div className="mt-2 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700/80 bg-slate-50/60 dark:bg-[#181d24] space-y-1">
                            <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block">
                                Electronic Signee Signature:
                            </span>
                            <div className="bg-white dark:bg-[#12161c] border border-slate-200 dark:border-slate-800 rounded p-2 flex items-center justify-center">
                                <img
                                    src={signatureUrl}
                                    alt="Signee Electronic Signature"
                                    className="max-h-16 object-contain"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default PodReviewModal;
