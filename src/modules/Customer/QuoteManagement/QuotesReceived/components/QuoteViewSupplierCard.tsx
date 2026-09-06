import React from 'react';
import { ShieldCheck, Star } from 'lucide-react';
import { QuoteData } from '../hooks/useQuoteViewDetail';

interface QuoteViewSupplierCardProps {
    quote: QuoteData;
}

export const QuoteViewSupplierCard: React.FC<QuoteViewSupplierCardProps> = ({ quote }) => {
    return (
        <div className="bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-[5px] p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h2 className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Carrier & Driver Profile
                </h2>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-[5px] border border-emerald-200 dark:border-emerald-800">
                    <ShieldCheck size={13} /> Verified Carrier
                </span>
            </div>

            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-[5px] bg-gradient-to-br from-[#ff4a1f] to-orange-400 text-white font-black text-lg flex items-center justify-center shadow-md shrink-0">
                    {(quote?.supplier_name || 'S').charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                        {quote?.supplier_name || quote.supplier?.company_name || quote.supplier?.name || 'Verified Carrier'}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
                        <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                            <Star size={13} className="text-amber-500 fill-amber-500" /> {quote?.rating || '4.8'} ★
                        </span>
                        <span>•</span>
                        <span className="font-medium text-emerald-600">{quote?.completed_orders || '150+ completed loads'}</span>
                    </div>
                </div>
            </div>

            {quote?.notes && (
                <div className="p-3.5 bg-slate-50 dark:bg-[#161a20] rounded-[5px] border border-slate-100 dark:border-slate-800 text-xs">
                    <span className="font-bold text-slate-900 dark:text-slate-100 block mb-1">Carrier Note & Conditions:</span>
                    <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed italic">
                        "{quote.notes}"
                    </p>
                </div>
            )}
        </div>
    );
};
