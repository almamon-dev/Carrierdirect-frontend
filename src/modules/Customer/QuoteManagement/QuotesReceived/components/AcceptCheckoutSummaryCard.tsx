import React from "react";
import { Truck, Package, CheckCircle2, FileText } from "lucide-react";

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
        notes?: string;
        distance?: string;
        baseFreightAmount?: number;
    };
}

const CompactField = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <div className="grid grid-cols-[90px_10px_1fr] items-baseline py-1 text-xs border-b border-slate-50 dark:border-slate-800/30 last:border-0">
        <span className="text-slate-500 dark:text-slate-400 font-medium truncate">{label}</span>
        <span className="text-slate-400 dark:text-slate-500 text-center select-none">:</span>
        <span className="text-slate-800 dark:text-slate-200 font-medium truncate pl-1">{value || "—"}</span>
    </div>
);

const CompactSectionHeader = ({ title, icon: Icon }: { title: string; icon: any }) => (
    <div className="flex items-center gap-1.5 pb-1.5 mb-1 border-b border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200">
        <Icon size={13} className="text-[#ff4a1f] shrink-0" />
        <span>{title}</span>
    </div>
);

export const AcceptCheckoutSummaryCard: React.FC<AcceptCheckoutSummaryCardProps> = ({ quote }) => {
    const pickupLoc = quote.pickupAddress || quote.pickupCity;
    const deliveryLoc = quote.deliveryAddress || quote.deliveryCity;

    return (
        <div className="bg-white dark:bg-[#1e2329] border border-slate-200/70 dark:border-slate-800/80 rounded-md p-4 space-y-3.5 font-sans">
            {/* Carrier / Supplier Profile Banner */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
                <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-center font-bold text-xs shrink-0">
                        {quote.supplier.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                        <div className="flex items-center gap-1">
                            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-tight">
                                {quote.supplier}
                            </h3>
                            <CheckCircle2 size={12} className="text-emerald-500 shrink-0" />
                        </div>
                        <span className="text-[11px] text-slate-400 dark:text-slate-500 hidden sm:inline">•</span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1">
                            <span className="text-amber-500 font-semibold">{quote.rating}</span>
                            <span className="text-slate-400">Verified Carrier</span>
                        </span>
                    </div>
                </div>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-900/40">
                    Firm Offer
                </span>
            </div>

            {/* Essential 2-Column Key : Value Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                {/* Column 1: Route & Schedule */}
                <div className="space-y-0.5">
                    <CompactSectionHeader title="Route & Schedule" icon={Truck} />
                    <CompactField label="Pickup" value={pickupLoc} />
                    <CompactField label="Delivery" value={deliveryLoc} />
                    <CompactField label="Pickup Date" value={quote.pickupDate} />
                    <CompactField label="Est. Delivery" value={quote.deliveryDate || "Standard Delivery"} />
                    {quote.distance && <CompactField label="Distance" value={quote.distance} />}
                </div>

                {/* Column 2: Cargo & Vehicle Specifications */}
                <div className="space-y-0.5">
                    <CompactSectionHeader title="Cargo & Vehicle" icon={Package} />
                    <CompactField label="Vehicle Type" value={<span className="font-semibold text-slate-800 dark:text-slate-200">{quote.vehicleType}</span>} />
                    <CompactField label="Cargo Type" value={quote.palletType || "Standard Cargo"} />
                    <CompactField label="Total Weight" value={<span className="font-semibold text-slate-800 dark:text-slate-200">{quote.weight}</span>} />
                </div>
            </div>

            {/* Notes / Special Instructions (Only if present and relevant) */}
            {quote.notes && (
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-start gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                    <FileText size={12} className="text-slate-400 shrink-0 mt-0.5" />
                    <span className="leading-normal">
                        <strong className="text-slate-700 dark:text-slate-300 font-medium">Notes:</strong> {quote.notes}
                    </span>
                </div>
            )}
        </div>
    );
};
