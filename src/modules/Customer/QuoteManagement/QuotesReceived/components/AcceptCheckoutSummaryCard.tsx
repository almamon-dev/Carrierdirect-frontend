import React from 'react';
import { Truck, Package, CheckCircle2, ShieldCheck, FileText } from 'lucide-react';

interface AcceptCheckoutSummaryCardProps {
    quote: {
        id?: string;
        requestId?: string;
        supplier: string;
        rating: string;
        pickupCity: string;
        deliveryCity: string;
        pickupAddress?: string;
        deliveryAddress?: string;
        pickupDate: string;
        deliveryDate?: string;
        vehicleType: string;
        palletType?: string;
        weight: string;
        transitTime?: string;
        handlingServices?: string | string[];
        notes?: string;
        distance?: string;
        baseFreightAmount?: number;
        extraCharges?: Array<{ type?: string; custom_name?: string; amount: number }>;
    };
}

const CompactField = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <div className="grid grid-cols-[110px_8px_1fr] items-baseline py-0.5 text-[11.5px] leading-relaxed">
        <span className="text-slate-500 dark:text-slate-400 font-medium truncate">{label}</span>
        <span className="text-slate-400 dark:text-slate-500">:</span>
        <span className="text-slate-800 dark:text-slate-200 font-semibold truncate">{value || '-'}</span>
    </div>
);

const CompactSectionHeader = ({ title, icon: Icon }: { title: string; icon: any }) => (
    <div className="flex items-center gap-1.5 pb-1.5 mb-1 border-b border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200">
        <Icon size={13.5} className="text-[#ff4a1f] shrink-0" />
        <span>{title}</span>
    </div>
);

export const AcceptCheckoutSummaryCard: React.FC<AcceptCheckoutSummaryCardProps> = ({ quote }) => {
    const pickupLoc = quote.pickupAddress || `${quote.pickupCity}`;
    const deliveryLoc = quote.deliveryAddress || `${quote.deliveryCity}`;
    const handling = Array.isArray(quote.handlingServices)
        ? quote.handlingServices.join(', ')
        : (quote.handlingServices || 'Tail-lift, Live GPS Tracking');

    const extraSummary = quote.extraCharges && quote.extraCharges.length > 0
        ? quote.extraCharges.map(c => c.custom_name || c.type).join(', ')
        : 'Included in Base Rate';

    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-lg p-4 shadow-2xs space-y-3 font-sans">
            {/* Header Banner */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded bg-orange-50 dark:bg-orange-950/40 text-[#ff4a1f] border border-orange-200/60 dark:border-orange-900/50 flex items-center justify-center font-bold text-xs shrink-0">
                        {quote.supplier.charAt(0)}
                    </div>
                    <div>
                        <div className="flex items-center gap-1">
                            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-tight">
                                {quote.supplier}
                            </h3>
                            <CheckCircle2 size={12.5} className="text-emerald-500 shrink-0" />
                        </div>
                        <span className="text-[10.5px] text-slate-400 font-medium">
                            {quote.rating} Rating • Verified Carrier Partner
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-800/60">
                        Quote Firm Offer
                    </span>
                </div>
            </div>

            {/* 2-Column Key : Value Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2.5">
                {/* Column 1: Route & Logistics Schedule */}
                <div>
                    <CompactSectionHeader title="Route & Delivery Schedule" icon={Truck} />
                    <div className="space-y-0.5">
                        <CompactField label="Pickup Location" value={pickupLoc} />
                        <CompactField label="Destination" value={deliveryLoc} />
                        <CompactField label="Pickup Date" value={quote.pickupDate} />
                        <CompactField label="Est. Delivery" value={quote.deliveryDate || 'Standard Transit Schedule'} />
                        {quote.distance && <CompactField label="Est. Distance" value={quote.distance} />}
                        {quote.transitTime && <CompactField label="Transit Window" value={quote.transitTime} />}
                    </div>
                </div>

                {/* Column 2: Cargo & Vehicle Specifications */}
                <div>
                    <CompactSectionHeader title="Cargo & Vehicle Specs" icon={Package} />
                    <div className="space-y-0.5">
                        <CompactField label="Vehicle Type" value={<span className="font-bold text-slate-900 dark:text-slate-100">{quote.vehicleType}</span>} />
                        <CompactField label="Pallet / Cargo" value={quote.palletType || 'Standard Euro Pallet'} />
                        <CompactField label="Total Weight" value={<span className="font-bold text-slate-900 dark:text-slate-100">{quote.weight}</span>} />
                        {quote.baseFreightAmount !== undefined && (
                            <CompactField label="Base Freight" value={`€${quote.baseFreightAmount.toLocaleString()}`} />
                        )}
                        <CompactField label="Extra Surcharges" value={extraSummary} />
                        <CompactField label="Handling Scope" value={handling} />
                        <CompactField label="Escrow Status" value={<span className="text-sky-600 dark:text-sky-400 font-semibold">100% Escrow Protected</span>} />
                    </div>
                </div>
            </div>

            {quote.notes && (
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-start gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                    <FileText size={13} className="text-slate-400 shrink-0 mt-0.5" />
                    <span><strong className="text-slate-700 dark:text-slate-300 font-semibold">Notes:</strong> {quote.notes}</span>
                </div>
            )}
        </div>
    );
};
