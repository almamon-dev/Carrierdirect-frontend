import React from 'react';
import { formatDisplayDate } from '@/lib/utils';

export interface QuoteHistoryDrawerSummaryCardsProps {
    createdAt?: string;
    allBidsCount: number;
    quoteAmount?: string | number;
    activeIndex: number;
}

export const QuoteHistoryDrawerSummaryCards: React.FC<QuoteHistoryDrawerSummaryCardsProps> = ({
    createdAt,
    allBidsCount,
    quoteAmount,
    activeIndex,
}) => {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-2.5 rounded-[5px] bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-0.5">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block">Created</span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate block">
                    {formatDisplayDate(createdAt)}
                </span>
            </div>

            <div className="p-2.5 rounded-[5px] bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-0.5">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block">Total Bids</span>
                <span className="text-xs font-bold text-[#ff4a1f] truncate block">
                    {allBidsCount > 0 ? `${allBidsCount} Offers Received` : '1 Offer Received'}
                </span>
            </div>

            <div className="p-2.5 rounded-[5px] bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-0.5">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block">Best Amount</span>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 truncate block">
                    {quoteAmount || '€ 44.130'}
                </span>
            </div>

            <div className="p-2.5 rounded-[5px] bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-0.5">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block">Current Stage</span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate block">
                    {activeIndex !== -1 ? `Stage ${activeIndex + 1} / 6` : 'Active'}
                </span>
            </div>
        </div>
    );
};
