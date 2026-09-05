import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, CheckCircle, Loader2, XCircle, Receipt } from 'lucide-react';
import Button from '@/components/ui/button';
import { encryptId } from '@/lib/encryption';
import { QuoteData } from '../hooks/useQuoteViewDetail';

interface QuoteViewPriceCardProps {
    quote: QuoteData;
    isAccepting: boolean;
    onAccept: () => void;
    onOpenRejectModal: () => void;
}

export const QuoteViewPriceCard: React.FC<QuoteViewPriceCardProps> = ({
    quote,
    isAccepting,
    onAccept,
    onOpenRejectModal,
}) => {
    const navigate = useNavigate();
    const extraTotal = quote?.extra_charges?.reduce((sum, c) => sum + (Number(c.amount) || 0), 0) ?? 0;
    const isPending = (quote.status_raw || quote.status || '').toLowerCase() === 'pending';

    return (
        <div className="bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-[5px] p-5 sm:p-6 shadow-2xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3.5">
                <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">Rate Breakdown</h2>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-[5px] text-xs font-bold bg-orange-50 dark:bg-[#ff4a1f]/20 text-[#ff4a1f] border border-orange-200 dark:border-orange-500/30">
                    All-Inclusive Offer
                </span>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                <div className="flex justify-between items-center">
                    <span className="font-medium text-slate-500 dark:text-slate-400">Base freight transport</span>
                    <span className="font-bold text-slate-900 dark:text-slate-100">{quote.base_amount || quote.amount}</span>
                </div>

                {quote.extra_charges && quote.extra_charges.length > 0 ? (
                    <div className="border-t border-slate-100 dark:border-slate-800 pt-2">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Extra Services</span>
                        {quote.extra_charges.map((charge, i) => (
                            <div key={i} className="flex justify-between items-center py-1 border-b border-slate-50 dark:border-slate-800/50 last:border-0 text-xs">
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-[5px] bg-slate-400 shrink-0" />
                                    <span className="font-medium text-slate-600 dark:text-slate-300">
                                        {charge.custom_name || charge.type}
                                    </span>
                                </div>
                                <span className="font-bold text-slate-900 dark:text-slate-100">€{Number(charge.amount).toFixed(2)}</span>
                            </div>
                        ))}
                        {extraTotal > 0 && (
                            <div className="flex justify-between items-center pt-2 text-slate-500 text-xs">
                                <span className="font-medium">Extra charges subtotal</span>
                                <span className="font-semibold">€{extraTotal.toFixed(2)}</span>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-xs text-slate-400 italic flex items-center gap-1.5 py-1">
                        <Receipt size={13} /> Direct rate with no extra charges
                    </div>
                )}

                <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                    <div className="flex justify-between items-baseline">
                        <span className="text-xs font-bold text-slate-900 dark:text-slate-100">Total Price</span>
                        <span className="text-2xl font-black text-[#ff4a1f]">{quote.amount}</span>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-2 pt-2">
                <div className="flex gap-2">
                    <Button 
                        variant="outline"
                        className="w-1/2 h-10 text-xs font-bold text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center gap-1.5 cursor-pointer rounded-[5px]"
                        onClick={() => navigate(`/customer/quotes/negotiation/conversation/${encryptId(quote.id)}`)}
                    >
                        <MessageSquare size={14} className="text-indigo-600" />
                        <span>Chat / Negotiate</span>
                    </Button>

                    <Button 
                        className="w-1/2 h-10 text-xs font-bold bg-[#ff4a1f] hover:bg-[#e03e15] text-white shadow-md flex items-center justify-center gap-1.5 cursor-pointer rounded-[5px]"
                        onClick={onAccept}
                        disabled={isAccepting || !isPending}
                    >
                        {isAccepting ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={15} />}
                        <span>Accept & Book</span>
                    </Button>
                </div>

                {isPending && (
                    <Button
                        variant="outline"
                        className="w-full h-9 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 border-red-200 dark:border-red-900/60 flex items-center justify-center gap-1.5 cursor-pointer rounded-[5px]"
                        onClick={onOpenRejectModal}
                    >
                        <XCircle size={14} />
                        <span>Decline This Offer</span>
                    </Button>
                )}
            </div>
        </div>
    );
};
