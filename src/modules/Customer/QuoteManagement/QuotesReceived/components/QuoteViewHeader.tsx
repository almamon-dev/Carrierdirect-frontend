import React from 'react';
import { MessageSquare, TrendingDown, XCircle, Check, Loader2 } from 'lucide-react';
import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';
import { getStatusBadgeClass } from '@/modules/Supplier/QuoteManagement/utils/statusStyles';

export interface QuoteViewHeaderProps {
    quote: any;
    req: any;
    statusInfo: { statusKey: string; text: string };
    isPending: boolean;
    isNegotiating: boolean;
    isAccepting: boolean;
    cleanQuoteId: string;
    cleanReqId: string;
    onNavigateChat: () => void;
    onOpenCounter: () => void;
    onOpenReject: () => void;
    onAccept: () => void;
}

export const QuoteViewHeader: React.FC<QuoteViewHeaderProps> = ({
    quote,
    req,
    statusInfo,
    isPending,
    isNegotiating,
    isAccepting,
    cleanQuoteId,
    cleanReqId,
    onNavigateChat,
    onOpenCounter,
    onOpenReject,
    onAccept,
}) => {
    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
            <div>
                <div className="flex items-center gap-2">
                    <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight mb-1">
                        Quote {quote.quote_id || `QT-${cleanQuoteId.padStart(4, '0')}`}
                    </h1>
                    <Badge variant="secondary" className={`text-[11px] font-semibold rounded-[3px] border ${getStatusBadgeClass(statusInfo.statusKey)}`}>
                        {statusInfo.text}
                    </Badge>
                </div>
                <p className="text-[13px] font-medium text-[#ff4a1f] mt-0.5">
                    For Request REQ-{cleanReqId || '—'}: {req?.request_title || 'Transportation quote specifications & supplier offer.'}
                </p>
            </div>

            {/* Header Action Buttons */}
            <div className="flex items-center flex-wrap gap-2">
                <Button
                    type="button"
                    variant={isPending || isNegotiating ? "outline" : "primary"}
                    size="sm"
                    className={
                        isPending || isNegotiating
                            ? "h-[34px] text-[12px] border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1.5 cursor-pointer font-medium rounded-[3px]"
                            : "h-[34px] text-[12px] bg-[#ff4a1f] hover:bg-[#e03e15] text-white flex items-center gap-1.5 cursor-pointer font-bold shadow-2xs rounded-[3px]"
                    }
                    onClick={onNavigateChat}
                >
                    <MessageSquare size={14} className={isPending || isNegotiating ? "text-slate-500 dark:text-slate-400" : "text-white"} />
                    <span>Chat & Negotiate</span>
                </Button>

                {(isPending || isNegotiating) && (
                    <>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-[34px] text-[12px] border-orange-200 dark:border-orange-900/50 bg-orange-50/40 dark:bg-orange-950/20 text-[#ff4a1f] hover:bg-orange-100/60 dark:hover:bg-orange-900/40 flex items-center gap-1.5 cursor-pointer font-bold rounded-[3px]"
                            onClick={onOpenCounter}
                        >
                            <TrendingDown size={14} />
                            <span>Counter Offer</span>
                        </Button>

                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-[34px] text-[12px] border-red-200 dark:border-red-900/50 bg-red-50/40 dark:bg-red-950/20 text-red-600 dark:text-red-400 hover:bg-red-100/60 dark:hover:bg-red-900/40 flex items-center gap-1.5 cursor-pointer font-medium rounded-[3px]"
                            onClick={onOpenReject}
                        >
                            <XCircle size={14} />
                            <span>Decline Offer</span>
                        </Button>

                        <Button
                            type="button"
                            variant="primary"
                            size="sm"
                            disabled={isAccepting}
                            className="h-[34px] text-[12px] bg-[#ff4a1f] hover:bg-[#e03e15] text-white flex items-center gap-1.5 cursor-pointer font-bold shadow-2xs disabled:opacity-50 rounded-[3px]"
                            onClick={onAccept}
                        >
                            {isAccepting ? (
                                <Loader2 size={14} className="animate-spin text-white" />
                            ) : (
                                <Check size={14} className="stroke-[2.5]" />
                            )}
                            <span>Accept & Book ({quote.amount})</span>
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
};
