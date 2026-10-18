import React from 'react';
import { ShieldCheck } from 'lucide-react';

export interface AcceptCheckoutHeaderProps {
    quoteId: string;
    requestId: string;
}

export const AcceptCheckoutHeader: React.FC<AcceptCheckoutHeaderProps> = ({
    quoteId,
    requestId,
}) => {
    return (
        <div className="mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
                <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                        Complete Booking
                    </h1>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/70 dark:border-slate-700/70">
                        {quoteId}
                    </span>
                    <span className="text-xs text-slate-400 dark:text-slate-500">
                        •
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        Request: <strong className="text-slate-700 dark:text-slate-300 font-semibold">{requestId}</strong>
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-900/40">
                    <ShieldCheck size={14} className="text-emerald-500" />
                    <span>100% Escrow Protected</span>
                </span>
            </div>
        </div>
    );
};
