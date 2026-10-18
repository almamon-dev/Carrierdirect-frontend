import React from 'react';
import { ArrowLeft, Clock, MessageSquare, Download, Check, X } from 'lucide-react';
import Button from '@/components/ui/button';
import { encryptId } from '@/lib/encryption';
import { exportQuoteRequestPDF } from '../utils/exportQuoteRequestPdf';
import { QuoteRequest } from '../../data/quoteRequestsData';
import { useNavigate } from 'react-router-dom';

interface SubmitQuoteHeaderProps {
    requestDetails: QuoteRequest;
    isFromMyQuotes: boolean;
    isQuoted: boolean;
    isWon: boolean;
    isExpired: boolean;
    submittedAt?: string;
    showBanner: boolean;
    onDismissBanner: () => void;
}

export const SubmitQuoteHeader: React.FC<SubmitQuoteHeaderProps> = ({
    requestDetails,
    isFromMyQuotes,
    isQuoted,
    isWon,
    isExpired,
    submittedAt,
    showBanner,
    onDismissBanner,
}) => {
    const navigate = useNavigate();

    return (
        <>
            <div className="space-y-1.5 sm:space-y-2">
                <button 
                    type="button"
                    onClick={() => navigate(isFromMyQuotes ? '/supplier/quotes/my-quotes' : '/supplier/quotes/requests')} 
                    className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 inline-flex items-center transition-colors font-normal cursor-pointer"
                >
                    <ArrowLeft size={13} className="mr-1 text-slate-400" /> {isFromMyQuotes ? 'Back to My Quotes' : 'Back to Quote Requests'}
                </button>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-0.5">
                        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
                            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                                Quote Request: {requestDetails.id}
                            </h1>

                            {isQuoted ? (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60 shadow-2xs">
                                    <Check size={12} strokeWidth={2.8} />
                                    <span>Offer Submitted</span>
                                </span>
                            ) : (
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium border shrink-0 ${
                                    isWon
                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60 font-semibold'
                                        : isExpired
                                        ? 'bg-rose-50/80 text-rose-700 border-rose-200/80 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/60'
                                        : 'bg-emerald-50/80 text-emerald-800 border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60'
                                }`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${isWon ? 'bg-emerald-500' : isExpired ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                                    <span>{isWon ? 'Won' : isExpired ? 'Expired' : (requestDetails.status || 'Active')}</span>
                                    <span className="opacity-40">•</span>
                                    <span className="font-normal opacity-90">{requestDetails.priority || 'Normal'}</span>
                                </span>
                            )}
                        </div>

                        {isQuoted && submittedAt && (
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-normal">
                                Submitted on {submittedAt}
                            </p>
                        )}
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap sm:flex-nowrap">
                        {isQuoted && (
                            <div className="h-9 px-3 bg-[#fffbeb] dark:bg-amber-950/20 border border-[#fef3c7] dark:border-amber-900/40 rounded-md flex items-center gap-2 shadow-2xs shrink-0">
                                <div className="w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                                    <Clock size={12} strokeWidth={2.4} />
                                </div>
                                <div className="flex items-center gap-1.5 leading-none">
                                    <span className="text-xs font-bold text-amber-800 dark:text-amber-300 whitespace-nowrap">
                                        Awaiting customer response
                                    </span>
                                    <span className="hidden xl:inline text-[11px] text-slate-400 dark:text-slate-500 font-normal">
                                        • Reviewing offer
                                    </span>
                                </div>
                            </div>
                        )}

                        {isQuoted && (
                            <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-9 px-3 text-xs font-semibold rounded-md border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 bg-indigo-50/60 hover:bg-indigo-100/80 cursor-pointer flex items-center gap-1.5 shrink-0 transition-colors shadow-2xs"
                                onClick={() => {
                                    const targetId = (requestDetails as any).quote_submitted?.id || requestDetails.quoteId || requestDetails.rawId || requestDetails.slug || requestDetails.id;
                                    const rawId = String(targetId).replace('REQ-', '').replace('QT-', '').trim();
                                    navigate(`/supplier/quotes/negotiation/conversation/${encryptId(rawId)}`);
                                }}
                            >
                                <MessageSquare size={13} className="text-indigo-600 dark:text-indigo-400 shrink-0" />
                                <span>Negotiation</span>
                            </Button>
                        )}

                        <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-9 px-3 text-xs font-semibold rounded-md text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700 cursor-pointer flex items-center gap-1.5 shrink-0 transition-colors shadow-2xs"
                            onClick={() => exportQuoteRequestPDF(requestDetails)}
                        >
                            <Download size={13} className="text-slate-400 shrink-0" />
                            <span>Export PDF</span>
                        </Button>
                    </div>
                </div>
            </div>

            {isQuoted && showBanner && (
                <div className="bg-[#f0fdf4] dark:bg-emerald-950/20 border border-[#bbf7d0] dark:border-emerald-800/60 rounded-lg p-3 sm:p-3.5 flex items-center justify-between gap-3 shadow-2xs animate-in fade-in duration-150">
                    <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#10b981] text-white flex items-center justify-center shrink-0 shadow-2xs">
                            <Check size={13} strokeWidth={2.8} />
                        </div>
                        <div className="min-w-0">
                            <h4 className="text-xs sm:text-[13px] font-bold text-emerald-900 dark:text-emerald-200 leading-snug">
                                Your commercial offer has been sent to the customer.
                            </h4>
                            <p className="text-[11.5px] text-emerald-700 dark:text-emerald-400 leading-snug mt-0.5">
                                The customer has been notified. You will be updated once they respond.
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onDismissBanner}
                        className="text-emerald-700 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-200 p-1 rounded transition-colors cursor-pointer shrink-0"
                        title="Dismiss notification"
                    >
                        <X size={15} />
                    </button>
                </div>
            )}
        </>
    );
};
