import React from 'react';
import { NegotiationItem } from '../../types';

interface NegotiationHistoryTimelineProps {
    activeNegotiation: NegotiationItem;
    currency: string;
    currentPrice: number;
}

export const NegotiationHistoryTimeline: React.FC<NegotiationHistoryTimelineProps> = ({
    activeNegotiation,
    currency,
    currentPrice
}) => {
    const displayCurrency = '€';
    const targetOffer = activeNegotiation.budget ? `€ ${activeNegotiation.budget.replace(/[^0-9.,]/g, '')}` : `€ 450`;

    return (
        <div className="px-4 pb-3 pt-1">
            <div className="space-y-0 text-[11.5px]">
                {/* Step 1 */}
                <div className="flex gap-2.5">
                    <div className="flex flex-col items-center">
                        <div className="w-2.5 h-2.5 rounded-full bg-slate-300 ring-4 ring-slate-100 shrink-0 mt-1" />
                        <div className="w-[1.5px] grow bg-slate-200 my-1" />
                    </div>
                    <div className="pb-3 min-w-0">
                        <p className="font-bold text-slate-700 leading-tight">Initial Quote ({displayCurrency} {(activeNegotiation.originalAmount || 450).toLocaleString()})</p>
                        <p className="text-slate-400 text-[10.5px] mt-0.5">{activeNegotiation.requestDate || '30 Aug 2026'}</p>
                    </div>
                </div>

                {/* Step 2 */}
                <div className="flex gap-2.5">
                    <div className="flex flex-col items-center">
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500 ring-4 ring-amber-50 shrink-0 mt-1" />
                        <div className="w-[1.5px] grow bg-slate-200 my-1" />
                    </div>
                    <div className="pb-3 min-w-0">
                        <p className="font-bold text-amber-700 leading-tight">Target Offer ({targetOffer})</p>
                        <p className="text-slate-400 text-[10.5px] mt-0.5">{activeNegotiation.lastUpdated || '8 minutes ago'}</p>
                    </div>
                </div>

                {/* Step 3 */}
                <div className="flex gap-2.5">
                    <div className="flex flex-col items-center">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#FF4A1F] ring-4 ring-orange-50 shrink-0 mt-1" />
                    </div>
                    <div className="min-w-0">
                        <p className="font-bold text-[#FF4A1F] leading-tight">Current Offer ({displayCurrency} {currentPrice.toLocaleString()})</p>
                        <p className="text-slate-400 text-[10.5px] mt-0.5">Active rate</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
