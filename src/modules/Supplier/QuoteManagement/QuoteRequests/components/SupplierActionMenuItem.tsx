import React from 'react';
import { Lock, Send, CheckCircle2, Trophy, Clock } from 'lucide-react';
import { QuoteRequest } from '../../data/quoteRequestsData';

interface SupplierActionButtonProps {
    row: QuoteRequest;
    onQuoteAction: (row: QuoteRequest) => void;
    onClose: () => void;
}

export const SupplierActionButton: React.FC<SupplierActionButtonProps> = ({
    row,
    onQuoteAction,
    onClose,
}) => {
    const isQuoted = (row.status || '').toLowerCase() === 'quoted' || (row.status || '').toLowerCase() === 'done' || Boolean(row.isQuoted || row.hasQuoted);
    const isBooked = (row.status || '').toLowerCase() === 'booked' || (row.status || '').toLowerCase() === 'won';
    const isExpired = Boolean(
        (row as any).is_expired ||
        (row.status || '').toLowerCase() === 'expired' ||
        (row.status || '').toLowerCase() === 'cancelled' ||
        (row.status || '').toLowerCase() === 'completed'
    );

    if (isBooked) {
        return (
            <button
                type="button"
                className="w-full text-left px-3.5 py-2 text-xs text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 flex items-center gap-2.5 transition-colors font-bold cursor-pointer"
                onClick={() => { onClose(); onQuoteAction(row); }}
            >
                <Trophy size={14} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Booked / Won</span>
            </button>
        );
    }

    if (isExpired) {
        return (
            <div className="w-full text-left px-3.5 py-2 text-xs text-slate-400 dark:text-slate-500 flex items-center gap-2.5 font-medium cursor-not-allowed bg-slate-50/50 dark:bg-slate-800/30 select-none">
                <Clock size={14} className="text-slate-400 shrink-0" />
                <span>Expired (Closed)</span>
            </div>
        );
    }

    if (isQuoted) {
        return (
            <button
                type="button"
                className="w-full text-left px-3.5 py-2 text-xs text-indigo-700 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 flex items-center gap-2.5 transition-colors font-bold cursor-pointer"
                onClick={() => { onClose(); onQuoteAction(row); }}
            >
                <CheckCircle2 size={14} className="text-indigo-600 dark:text-indigo-400 shrink-0" />
                <span>Quoted (Update Offer)</span>
            </button>
        );
    }

    if (row.priority === 'Urgent') {
        return (
            <button
                type="button"
                className="w-full text-left px-3.5 py-2 text-xs text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 flex items-center gap-2.5 transition-colors font-medium cursor-pointer"
                onClick={() => { onClose(); onQuoteAction(row); }}
            >
                <Lock size={14} className="text-amber-500 shrink-0" />
                <span>Locked (Priority RFQ)</span>
            </button>
        );
    }

    return (
        <button
            type="button"
            className="w-full text-left px-3.5 py-2 text-xs text-[#ff4a1f] hover:bg-orange-50 dark:hover:bg-[#ff4a1f]/10 flex items-center gap-2.5 transition-colors font-bold cursor-pointer"
            onClick={() => { onClose(); onQuoteAction(row); }}
        >
            <Send size={14} className="text-[#ff4a1f] shrink-0" />
            <span>Submit Quote</span>
        </button>
    );
};
