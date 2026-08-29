import Modal from '@/components/modals/modal';
import Button from '@/components/ui/button';
import { ArrowLeft, BadgeCheck, CheckCircle2, MessageSquare, Receipt, ShieldCheck, Truck } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { QuoteRequest } from '../../data/quoteRequestsData';

interface SubmissionMeta {
    extraCharges?: Array<{ type: string; customName?: string; amount: string }>;
    validity?: string;
    paymentTerm?: string;
    basePrice?: string;
}

interface QuoteSubmittedSuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    requestDetails: QuoteRequest;
    totalOffer: string;
    submissionMeta?: SubmissionMeta;
}

const formatValidity = (val?: string) => {
    if (!val) return '48 Hours (Standard)';
    const map: Record<string, string> = {
        '12h': '12 Hours',
        '24h': '24 Hours (1 Day)',
        '48h': '48 Hours (Standard)',
        '3d': '3 Days',
        '5d': '5 Days',
        '7d': '7 Days (1 Week)',
        '14d': '14 Days',
    };
    return map[val] || val;
};

const formatPaymentTerm = (term?: string) => {
    if (!term) return 'Net 15 Days (CarrierDirect Escrow)';
    const map: Record<string, string> = {
        'immediate': 'Immediate POD Clearance',
        'net7': 'Net 7 Days',
        'net15': 'Net 15 Days (CarrierDirect Escrow)',
        'net30': 'Net 30 Days',
        'net60': 'Net 60 Days',
        'advance': '50% Advance Settlement',
    };
    return map[term] || term;
};

const getDisplayVolume = (req: QuoteRequest) => {
    if (req.volume && req.volume !== '—') return req.volume;
    if (req.dimensions && req.dimensions.length > 0) {
        const d = req.dimensions[0];
        if (d.length && d.length !== '—' && d.width && d.width !== '—' && d.height && d.height !== '—') {
            return `${d.length} × ${d.width} × ${d.height} cm`;
        }
    }
    return '—';
};

const DetailRow: React.FC<{ label: string; value: React.ReactNode; labelWidth?: string }> = ({
    label,
    value,
    labelWidth = "w-36"
}) => (
    <div className="flex items-start py-2 text-[12px] min-w-0">
        <span className={`${labelWidth} shrink-0 text-slate-500 dark:text-slate-400 font-medium pt-0.5`}>{label}</span>
        <span className="w-4 shrink-0 text-slate-400 font-bold text-center pt-0.5">:</span>
        <div className="flex-1 min-w-0 font-semibold text-slate-800 dark:text-slate-200 leading-snug">{value}</div>
    </div>
);

export const QuoteSubmittedSuccessModal: React.FC<QuoteSubmittedSuccessModalProps> = ({
    isOpen,
    onClose,
    requestDetails,
    totalOffer,
    submissionMeta,
}) => {
    const navigate = useNavigate();
    const customerName = requestDetails.customer || 'Verified Shipper';
    const cleanId = String(requestDetails.rawId || requestDetails.id || '').replace('REQ-', '').trim();
    const numericOffer = parseFloat(totalOffer || '0');
    const extraCharges = submissionMeta?.extraCharges || [];
    const hasExtraCharges = extraCharges.length > 0;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="2xl"
            className="!max-w-4xl w-full"
            showCloseButton={true}
        >
            <div className="flex flex-col font-sans max-h-[82vh] overflow-y-auto overflow-x-hidden px-1 sm:px-2 py-1 space-y-4">

                {/* Header: Customer Profile & Success Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="relative shrink-0">
                            <div className="w-11 h-11 rounded-full overflow-hidden bg-orange-50 dark:bg-[#ff4a1f]/10 text-[#FF4A1F] border border-orange-200 dark:border-orange-500/30 flex items-center justify-center font-bold text-base shadow-2xs">
                                {requestDetails.customerAvatar ? (
                                    <img src={requestDetails.customerAvatar} alt={customerName} className="w-full h-full object-cover" />
                                ) : (
                                    <span>{customerName.charAt(0).toUpperCase()}</span>
                                )}
                            </div>
                            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full z-10 shadow-2xs" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-1.5">
                                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 truncate">{customerName}</h3>
                                <span className="inline-flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 px-2 py-0.5 rounded-full text-[10.5px] font-bold shrink-0">
                                    <BadgeCheck size={12} className="text-emerald-600 dark:text-emerald-400" />
                                    Verified Shipper
                                </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-2 mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                                <span className="font-semibold text-[#FF4A1F]">{requestDetails.id || `REQ-${cleanId || '0001'}`}</span>
                                <span>•</span>
                                <span className="font-bold text-amber-600">★ {requestDetails.customerRating || 4.8}</span>
                                {requestDetails.customerOrdersCount ? (
                                    <>
                                        <span>•</span>
                                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{requestDetails.customerOrdersCount} shipments</span>
                                    </>
                                ) : null}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-md text-emerald-700 dark:text-emerald-400 text-xs font-bold shrink-0 self-start sm:self-auto">
                        <CheckCircle2 size={14} className="text-emerald-600 dark:text-emerald-400" />
                        <span>Quotation Submitted</span>
                    </div>
                </div>

                {/* Two-Column Structured Grid: Left (Specifications & Terms) | Right (Route & Commercial Breakdown) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5 pt-1 pb-1">

                    {/* LEFT COLUMN: Quotation Terms & Vehicle & Shipment Specifications */}
                    <div className="space-y-4 min-w-0">
                        {/* Section 1: Quotation Terms & Shipper Budget */}
                        <div className="space-y-1 min-w-0">
                            <h4 className="text-[11.5px] font-bold text-slate-700 dark:text-slate-300 pb-1 border-b border-slate-100 dark:border-slate-800 flex items-center gap-1.5">
                                <Receipt size={13} className="text-[#ff4a1f]" />
                                <span>Quotation Terms & Shipper Budget</span>
                            </h4>
                            <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
                                <DetailRow
                                    label="Quote Validity"
                                    value={formatValidity(submissionMeta?.validity)}
                                />
                                <DetailRow
                                    label="Payment Terms"
                                    value={formatPaymentTerm(submissionMeta?.paymentTerm)}
                                />
                                <DetailRow
                                    label="Shipper Budget"
                                    value={
                                        <span className="font-bold text-emerald-700 dark:text-emerald-400">
                                            {requestDetails.budget || 'Open / Flexible'}
                                        </span>
                                    }
                                />
                            </div>
                        </div>

                        {/* Section 2: Vehicle & Shipment Specifications */}
                        <div className="space-y-1 min-w-0">
                            <h4 className="text-[11.5px] font-bold text-slate-700 dark:text-slate-300 pb-1 border-b border-slate-100 dark:border-slate-800 flex items-center gap-1.5">
                                <Truck size={13} className="text-[#ff4a1f]" />
                                <span>Vehicle & Shipment Specifications</span>
                            </h4>
                            <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
                                <DetailRow
                                    label="Vehicle Type"
                                    value={requestDetails.vehicleType && requestDetails.vehicleType !== '—' ? requestDetails.vehicleType : 'Standard Haulage'}
                                />
                                <DetailRow
                                    label="Total Weight"
                                    value={requestDetails.weight && requestDetails.weight !== '—' ? requestDetails.weight : '—'}
                                />
                                <DetailRow
                                    label="Load Type"
                                    value={requestDetails.loadType && requestDetails.loadType !== '—' ? requestDetails.loadType : 'General Freight'}
                                />
                                <DetailRow
                                    label="Items Summary"
                                    value={requestDetails.itemsCount && requestDetails.itemsCount !== '—' ? requestDetails.itemsCount : '—'}
                                />
                                <DetailRow
                                    label="Total Volume"
                                    value={getDisplayVolume(requestDetails)}
                                />
                                <DetailRow
                                    label="Transit Distance"
                                    value={requestDetails.distance && requestDetails.distance !== '—' ? requestDetails.distance : '—'}
                                />
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Route & Pickup/Delivery + Commercial Offer Breakdown */}
                    <div className="space-y-4 min-w-0">
                        {/* Section 1: Route & Location Details */}
                        <div className="space-y-1 min-w-0">
                            <h4 className="text-[11.5px] font-bold text-slate-700 dark:text-slate-300 pb-1 border-b border-slate-100 dark:border-slate-800 flex items-center gap-1.5">
                                <ShieldCheck size={13} className="text-emerald-600 dark:text-emerald-400" />
                                <span>Route & Location Details</span>
                            </h4>
                            <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
                                <DetailRow
                                    label="Pickup Address"
                                    value={
                                        <div className="flex items-start gap-1.5 min-w-0" title={requestDetails.pickupFullAddress || requestDetails.pickup}>
                                            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 mt-1" />
                                            <div className="flex-1 min-w-0">
                                                <div className="line-clamp-2 break-words leading-snug text-slate-800 dark:text-slate-200 font-semibold">
                                                    {requestDetails.pickupFullAddress || requestDetails.pickup || '—'}
                                                </div>
                                                {requestDetails.pickupDate && (
                                                    <div className="text-[11px] text-slate-500 dark:text-slate-400 font-normal mt-0.5">
                                                        📅 Pickup: {requestDetails.pickupDate} {requestDetails.pickupTimeWindow ? `(${requestDetails.pickupTimeWindow})` : ''}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    }
                                />
                                <DetailRow
                                    label="Delivery Address"
                                    value={
                                        <div className="flex items-start gap-1.5 min-w-0" title={requestDetails.deliveryFullAddress || requestDetails.delivery}>
                                            <span className="w-2 h-2 rounded-full bg-red-500 shrink-0 mt-1" />
                                            <div className="flex-1 min-w-0">
                                                <div className="line-clamp-2 break-words leading-snug text-slate-800 dark:text-slate-200 font-semibold">
                                                    {requestDetails.deliveryFullAddress || requestDetails.delivery || '—'}
                                                </div>
                                                {requestDetails.deliveryDate && (
                                                    <div className="text-[11px] text-slate-500 dark:text-slate-400 font-normal mt-0.5">
                                                        📅 Delivery: {requestDetails.deliveryDate} {requestDetails.deliveryTimeWindow ? `(${requestDetails.deliveryTimeWindow})` : ''}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    }
                                />
                            </div>
                        </div>

                        {/* Section 2: Commercial Offer Breakdown (Without Platform Fee) */}
                        <div className="space-y-1 min-w-0">
                            <h4 className="text-[11.5px] font-bold text-slate-700 dark:text-slate-300 pb-1 border-b border-slate-100 dark:border-slate-800 flex items-center gap-1.5">
                                <Receipt size={13} className="text-[#ff4a1f]" />
                                <span>Commercial Offer Breakdown</span>
                            </h4>
                            <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
                                {submissionMeta?.basePrice && hasExtraCharges && (
                                    <DetailRow
                                        label="Base Freight Rate"
                                        value={
                                            <span className="font-semibold text-slate-700 dark:text-slate-300">
                                                € {parseFloat(submissionMeta.basePrice || '0').toFixed(2)}
                                            </span>
                                        }
                                    />
                                )}
                                {hasExtraCharges && extraCharges.map((ch, i) => (
                                    <DetailRow
                                        key={i}
                                        label={ch.type === 'Custom' ? (ch.customName || 'Custom Surcharge') : ch.type}
                                        value={
                                            <span className="font-semibold text-slate-600 dark:text-slate-300">
                                                +€ {parseFloat(ch.amount || '0').toFixed(2)}
                                            </span>
                                        }
                                    />
                                ))}
                                <DetailRow
                                    label="Submitted Offer"
                                    value={
                                        <span className="text-base font-extrabold text-[#ff4a1f]">
                                            € {numericOffer.toFixed(2)} <span className="text-[11px] font-normal text-slate-500">(Total Gross)</span>
                                        </span>
                                    }
                                />
                                <DetailRow
                                    label="Security Escrow"
                                    value={
                                        <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                                            <BadgeCheck size={14} className="text-emerald-600 dark:text-emerald-400" />
                                            100% Guaranteed by Platform
                                        </span>
                                    }
                                />
                                <DetailRow
                                    label="Settlement Mode"
                                    value={
                                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                            CarrierDirect Escrow Protected
                                        </span>
                                    }
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modal Footer Actions */}
                <div className="pt-3.5 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-end gap-2.5">
                    <Button
                        variant="outline"
                        size="sm"
                        className="text-xs h-9 px-4 font-semibold text-slate-700 dark:text-slate-200 cursor-pointer"
                        onClick={onClose}
                    >
                        Close
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="text-xs h-9 px-4 font-bold border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 bg-indigo-50/60 hover:bg-indigo-100/80 dark:bg-indigo-950/40 cursor-pointer flex items-center gap-1.5"
                        onClick={() => {
                            onClose();
                            navigate('/supplier/quotes/negotiation');
                        }}
                    >
                        <MessageSquare size={13} className="text-indigo-600 dark:text-indigo-400" /> View Negotiation
                    </Button>
                    <Button
                        variant="primary"
                        size="sm"
                        className="text-xs h-9 px-4 font-bold bg-[#ff4a1f] hover:bg-[#e03e15] text-white shadow-xs cursor-pointer flex items-center gap-1.5"
                        onClick={() => {
                            onClose();
                            navigate('/supplier/quotes/requests');
                        }}
                    >
                        <ArrowLeft size={13} /> Back to Requests
                    </Button>
                </div>
            </div>
        </Modal>
    );
};
