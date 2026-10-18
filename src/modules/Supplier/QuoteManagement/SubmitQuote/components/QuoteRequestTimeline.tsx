import { Calendar, Check, CheckCircle2, Clock, Plus, XCircle } from 'lucide-react';
import React from 'react';
import { QuoteRequest } from '../../data/quoteRequestsData';

interface QuoteRequestTimelineProps {
    requestDetails: QuoteRequest;
}

export const QuoteRequestTimeline: React.FC<QuoteRequestTimelineProps> = ({ requestDetails }) => {
    const quote = (requestDetails as any).quote_submitted;
    const submittedAt = quote?.submitted_at || quote?.created_at || requestDetails.requestDate || '11 Oct 2026, 10:32 AM';
    const isWon = Boolean(
        (requestDetails as any).is_won ||
        (requestDetails.status || '').toLowerCase() === 'won' ||
        quote?.status === 'accepted' ||
        quote?.status === 'won'
    );
    const isLost = Boolean(
        (requestDetails as any).is_lost ||
        (requestDetails.status || '').toLowerCase() === 'lost' ||
        quote?.status === 'rejected' ||
        quote?.status === 'lost'
    );

    return (
        <div className="bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-[4px] shadow-2xs p-3.5 sm:p-4 space-y-2.5 font-sans">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                <Calendar size={13} className="text-[#ea580c] shrink-0" />
                <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    Quote Request Timeline
                </h3>
            </div>

            <div className="pl-0.5">
                {/* Step 1: Offer Submitted */}
                <div className="flex items-start gap-2.5">
                    <div className="flex flex-col items-center self-stretch shrink-0">
                        <div className="w-5 h-5 rounded-full bg-[#10b981] text-white flex items-center justify-center shrink-0 shadow-2xs">
                            <Check size={11} strokeWidth={2.8} />
                        </div>
                        <div className="w-0.5 flex-1 bg-emerald-200 dark:bg-emerald-900/60 my-0.5 min-h-[10px]" />
                    </div>
                    <div className="flex-1 pb-2 flex items-start justify-between gap-3 min-w-0">
                        <div className="space-y-0.5 min-w-0">
                            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-tight">
                                Offer submitted
                            </h4>
                            <p className="text-[11.5px] text-slate-500 dark:text-slate-400 leading-snug">
                                Your commercial offer has been sent to the customer.
                            </p>
                        </div>
                        <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 shrink-0 whitespace-nowrap mt-0.5">
                            {submittedAt}
                        </span>
                    </div>
                </div>

                {/* Step 2: Awaiting Customer Response */}
                <div className="flex items-start gap-2.5">
                    <div className="flex flex-col items-center self-stretch shrink-0">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 shadow-2xs ${isWon || isLost
                                ? 'bg-emerald-500 text-white'
                                : 'bg-amber-500 text-white'
                            }`}>
                            <Clock size={11} strokeWidth={2.5} />
                        </div>
                        <div className={`w-0.5 flex-1 my-0.5 min-h-[10px] ${isWon ? 'bg-emerald-200 dark:bg-emerald-900/60' : 'bg-slate-200 dark:bg-slate-700'
                            }`} />
                    </div>
                    <div className="flex-1 pb-2 flex items-start justify-between gap-3 min-w-0">
                        <div className="space-y-0.5 min-w-0">
                            <h4 className={`text-xs font-bold leading-tight ${isWon || isLost
                                    ? 'text-slate-800 dark:text-slate-200'
                                    : 'text-amber-800 dark:text-amber-400'
                                }`}>
                                Awaiting customer response
                            </h4>
                            <p className="text-[11.5px] text-slate-500 dark:text-slate-400 leading-snug">
                                {isWon
                                    ? 'Customer has reviewed and accepted your offer.'
                                    : isLost
                                        ? 'Customer has completed review of received bids.'
                                        : 'The customer is reviewing your offer. You will be notified once they respond.'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Step 3: Customer Decision */}
                <div className="flex items-start gap-2.5">
                    <div className="flex flex-col items-center shrink-0">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${isWon
                                ? 'bg-emerald-600 text-white'
                                : isLost
                                    ? 'bg-rose-500 text-white'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700'
                            }`}>
                            {isWon ? (
                                <CheckCircle2 size={12} strokeWidth={2.5} />
                            ) : isLost ? (
                                <XCircle size={12} strokeWidth={2.5} />
                            ) : (
                                <Plus size={11} strokeWidth={2.5} />
                            )}
                        </div>
                    </div>
                    <div className="flex-1 flex items-start justify-between gap-3 min-w-0 pt-0.5">
                        <div className="space-y-0.5 min-w-0">
                            <h4 className={`text-xs font-semibold leading-tight ${isWon
                                    ? 'text-emerald-700 dark:text-emerald-400 font-bold'
                                    : isLost
                                        ? 'text-rose-600 dark:text-rose-400 font-bold'
                                        : 'text-slate-500 dark:text-slate-400 font-medium'
                                }`}>
                                Customer decision
                            </h4>
                            <p className="text-[11.5px] text-slate-400 leading-snug">
                                {isWon ? 'Offer accepted • Quote Won!' : isLost ? 'Not selected for this job' : 'Pending...'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
