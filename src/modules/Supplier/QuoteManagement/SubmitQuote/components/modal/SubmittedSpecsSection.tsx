import React from 'react';
import { Receipt, Truck } from 'lucide-react';
import { QuoteRequest } from '../../../data/quoteRequestsData';

interface SubmittedSpecsSectionProps {
    requestDetails: QuoteRequest;
    validity?: string;
    paymentTerm?: string;
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

export const DetailRow: React.FC<{ label: string; value: React.ReactNode; labelWidth?: string }> = ({
    label,
    value,
    labelWidth = "w-32"
}) => (
    <div className="flex items-start py-1 text-[11.5px] min-w-0">
        <span className={`${labelWidth} shrink-0 text-slate-500 dark:text-slate-400 font-medium pt-0.5`}>{label}</span>
        <span className="w-3.5 shrink-0 text-slate-400 font-bold text-center pt-0.5">:</span>
        <div className="flex-1 min-w-0 font-semibold text-slate-800 dark:text-slate-200 leading-snug">{value}</div>
    </div>
);

export const SubmittedSpecsSection: React.FC<SubmittedSpecsSectionProps> = ({
    requestDetails,
    validity,
    paymentTerm,
}) => {
    return (
        <div className="space-y-3 min-w-0">
            <div className="space-y-0.5 min-w-0">
                <h4 className="text-[11.5px] font-bold text-slate-800 dark:text-slate-200 pb-0.5 border-b border-slate-100 dark:border-slate-800 flex items-center gap-1.5">
                    <Receipt size={12} className="text-[#ff4a1f]" />
                    <span>Quotation Terms & Shipper Budget</span>
                </h4>
                <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
                    <DetailRow label="Quote Validity" value={formatValidity(validity)} />
                    <DetailRow label="Payment Terms" value={formatPaymentTerm(paymentTerm)} />
                    <DetailRow label="Shipper Budget" value={<span className="font-semibold text-slate-800 dark:text-slate-200">{requestDetails.budget || 'Open / Flexible'}</span>} />
                </div>
            </div>

            <div className="space-y-0.5 min-w-0">
                <h4 className="text-[11.5px] font-bold text-slate-800 dark:text-slate-200 pb-0.5 border-b border-slate-100 dark:border-slate-800 flex items-center gap-1.5">
                    <Truck size={12} className="text-[#ff4a1f]" />
                    <span>Vehicle & Shipment Specifications</span>
                </h4>
                <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
                    <DetailRow label="Vehicle Type" value={requestDetails.vehicleType && requestDetails.vehicleType !== '—' ? requestDetails.vehicleType : 'Standard Haulage'} />
                    <DetailRow label="Total Weight" value={requestDetails.weight && requestDetails.weight !== '—' ? requestDetails.weight : '—'} />
                    <DetailRow label="Load Type" value={requestDetails.loadType && requestDetails.loadType !== '—' ? requestDetails.loadType : 'General Freight'} />
                    <DetailRow label="Items Summary" value={requestDetails.itemsCount && requestDetails.itemsCount !== '—' ? requestDetails.itemsCount : '—'} />
                    <DetailRow label="Total Volume" value={getDisplayVolume(requestDetails)} />
                    <DetailRow label="Transit Distance" value={requestDetails.distance && requestDetails.distance !== '—' ? requestDetails.distance : '—'} />
                </div>
            </div>
        </div>
    );
};
