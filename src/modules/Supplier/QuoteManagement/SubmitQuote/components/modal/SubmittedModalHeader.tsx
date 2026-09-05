import React from 'react';
import { BadgeCheck, CheckCircle2 } from 'lucide-react';
import { QuoteRequest } from '../../../data/quoteRequestsData';

interface SubmittedModalHeaderProps {
    requestDetails: QuoteRequest;
    customerName: string;
    cleanId: string;
}

export const SubmittedModalHeader: React.FC<SubmittedModalHeaderProps> = ({
    requestDetails,
    customerName,
    cleanId,
}) => (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-[5px] overflow-hidden bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-semibold text-xs shrink-0 shadow-2xs">
                {requestDetails.customerAvatar ? (
                    <img src={requestDetails.customerAvatar} alt={customerName} className="w-full h-full object-cover" onError={(e) => { (e.currentTarget as HTMLElement).style.display = 'none'; }} />
                ) : (
                    <span>{customerName.charAt(0).toUpperCase()}</span>
                )}
            </div>
            <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5">
                    <h3 className="text-[13px] font-semibold text-slate-800 dark:text-slate-100 truncate">{customerName}</h3>
                    <span className="inline-flex items-center gap-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/80 px-1.5 py-0.2 rounded-[2px] text-[10px] font-medium shrink-0">
                        <BadgeCheck size={11} className="text-blue-600 dark:text-blue-400" />
                        Verified Shipper
                    </span>
                </div>
                <div className="flex flex-wrap items-center gap-1.5 mt-0.2 text-[11px] text-slate-500 dark:text-slate-400">
                    <span className="font-medium text-slate-600 dark:text-slate-300">{requestDetails.id || `REQ-${cleanId || '0001'}`}</span>
                    <span>•</span>
                    <span className="font-medium text-amber-600">★ {requestDetails.customerRating || 4.8}</span>
                    {requestDetails.customerOrdersCount ? (
                        <>
                            <span>•</span>
                            <span className="text-slate-600 dark:text-slate-300 font-medium">{requestDetails.customerOrdersCount} shipments</span>
                        </>
                    ) : null}
                </div>
            </div>
        </div>

        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 rounded-[3px] text-emerald-700 dark:text-emerald-400 text-[11px] font-medium shrink-0 self-start sm:self-auto">
            <CheckCircle2 size={12} className="text-emerald-600 dark:text-emerald-400" />
            <span>Quotation Submitted</span>
        </div>
    </div>
);
