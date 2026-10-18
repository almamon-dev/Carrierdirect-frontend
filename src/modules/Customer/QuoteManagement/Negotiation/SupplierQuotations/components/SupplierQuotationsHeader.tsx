import React from 'react';
import { ArrowLeft, MessageSquare, RefreshCw, BadgeCheck } from 'lucide-react';
import Button from '@/components/ui/button';

export interface SupplierQuotationsHeaderProps {
    supplierName: string;
    firstRawId?: string | number;
    isRefreshing: boolean;
    onBack: () => void;
    onOpenChat: () => void;
    onRefresh: () => void;
}

export const SupplierQuotationsHeader: React.FC<SupplierQuotationsHeaderProps> = ({
    supplierName,
    firstRawId,
    isRefreshing,
    onBack,
    onOpenChat,
    onRefresh,
}) => {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1 border-b border-slate-200/60 dark:border-slate-800">
            <div className="flex items-center gap-3">
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full hover:bg-slate-200/70 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors -ml-1 cursor-pointer shrink-0"
                    onClick={onBack}
                    title="Back to Negotiation Chat"
                >
                    <ArrowLeft size={18} />
                </Button>
                <div>
                    <div className="flex items-center gap-1.5">
                        <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight leading-none">
                            {supplierName}
                        </h1>
                        <BadgeCheck size={16} className="text-[#FF4A1F] shrink-0" />
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
                        All quotations and price counter offers submitted by this carrier partner.
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
                {firstRawId && (
                    <button
                        type="button"
                        onClick={onOpenChat}
                        className="h-8.5 px-3.5 bg-[#FF4A1F] hover:bg-[#e03f19] text-white text-xs font-semibold rounded-[4px] flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                    >
                        <MessageSquare size={13.5} />
                        <span>Open Active Chat</span>
                    </button>
                )}
                <button
                    type="button"
                    onClick={onRefresh}
                    disabled={isRefreshing}
                    className="h-8.5 px-3 bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-[4px] flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer shrink-0 disabled:opacity-60"
                >
                    <RefreshCw size={13} className={isRefreshing ? "animate-spin text-[#ff4a1f]" : "text-slate-500"} />
                    <span>{isRefreshing ? "Refreshing..." : "Refresh"}</span>
                </button>
            </div>
        </div>
    );
};
