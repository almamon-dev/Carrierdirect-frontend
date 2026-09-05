import React from 'react';

interface AcceptCheckoutSummaryCardProps {
    quote: {
        supplier: string;
        rating: string;
        pickupCity: string;
        deliveryCity: string;
        pickupDate: string;
        vehicleType: string;
        weight: string;
    };
}

export const AcceptCheckoutSummaryCard: React.FC<AcceptCheckoutSummaryCardProps> = ({ quote }) => {
    return (
        <div className="bg-white border border-slate-200 rounded-[5px] p-5 sm:p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-[5px] bg-orange-50 text-[#ff4a1f] border border-orange-200 flex items-center justify-center font-bold text-base shrink-0">
                        {quote.supplier.charAt(0)}
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-slate-900">{quote.supplier}</h3>
                        <span className="text-xs text-slate-500 font-medium">{quote.rating} Rating • Verified Carrier</span>
                    </div>
                </div>
                <span className="inline-flex items-center px-3 py-0.5 rounded-[5px] text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Quote Firm Offer
                </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs sm:text-[13px] bg-slate-50 p-4 rounded-[5px] border border-slate-200/80">
                <div>
                    <span className="text-slate-500 font-medium block text-xs">Route:</span>
                    <span className="font-bold text-slate-900 mt-0.5 block">{quote.pickupCity} ➔ {quote.deliveryCity}</span>
                </div>
                <div>
                    <span className="text-slate-500 font-medium block text-xs">Pickup date:</span>
                    <span className="font-bold text-slate-900 mt-0.5 block">{quote.pickupDate}</span>
                </div>
                <div>
                    <span className="text-slate-500 font-medium block text-xs">Vehicle spec:</span>
                    <span className="font-bold text-slate-900 mt-0.5 block">{quote.vehicleType} ({quote.weight})</span>
                </div>
            </div>
        </div>
    );
};
