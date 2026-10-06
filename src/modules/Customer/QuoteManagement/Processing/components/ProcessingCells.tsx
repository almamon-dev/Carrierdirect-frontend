import React from 'react';
import { formatDisplayDate } from '@/lib/utils';
import { buildSecureQuoteUrl } from '@/utils/urlSecurity';

const cleanAddressWithoutZip = (addr: string): string => {
    if (!addr || addr === '—') return addr;
    return addr
        .replace(/\s*\(?ZIP:?\s*\d+\)?/gi, '')
        .replace(/\b(?:ZIP|Postal Code):?\s*\d+\b/gi, '')
        .replace(/\s+\d{4,6}\b(?=[,\s]|$)/g, '')
        .replace(/\s*,\s*,/g, ',')
        .replace(/,\s*$/g, '')
        .trim();
};

export const ProcessingRequestIdCell: React.FC<{ row: any; onNavigate: (path: string) => void }> = ({ row, onNavigate }) => {
    const rawId = row.rawId || row.id;
    const reqText = row.requestId || (rawId ? (String(rawId).startsWith('REQ-') ? rawId : `REQ-${String(rawId).padStart(4, '0')}`) : 'REQ-0000');

    return (
        <div className="flex items-center min-h-[26px]">
            <button
                type="button"
                onClick={(e) => {
                    e.stopPropagation();
                    onNavigate(buildSecureQuoteUrl(rawId, 'view'));
                }}
                className="font-bold text-slate-900 dark:text-slate-100 hover:text-[#ff4a1f] dark:hover:text-[#ff4a1f] text-left whitespace-nowrap cursor-pointer text-[13.5px] tracking-tight transition-colors leading-none"
            >
                {reqText}
            </button>
        </div>
    );
};

export const ProcessingAddressCell: React.FC<{ address: string }> = ({ address }) => {
    const displayAddr = cleanAddressWithoutZip(address);
    return (
        <div className="flex items-center min-w-0 w-full overflow-hidden pr-1 min-h-[26px]" title={displayAddr}>
            <span className="font-medium text-slate-700 dark:text-slate-300 text-[13px] truncate block max-w-full leading-normal">
                {displayAddr}
            </span>
        </div>
    );
};

export const ProcessingVehicleCell: React.FC<{ vehicleType: string }> = ({ vehicleType }) => (
    <div className="flex items-center min-w-0 min-h-[26px]" title={vehicleType}>
        <span className="text-[13px] text-slate-800 dark:text-slate-200 font-medium truncate block max-w-full">
            {vehicleType || '—'}
        </span>
    </div>
);

export const ProcessingTransitTimeCell: React.FC<{ time: string }> = ({ time }) => (
    <div className="flex items-center min-w-0 min-h-[26px]" title={time}>
        <span className="text-[13px] text-slate-700 dark:text-slate-300 font-medium truncate block max-w-full">
            {time || '—'}
        </span>
    </div>
);

export const ProcessingBudgetCell: React.FC<{ budget: any }> = ({ budget }) => {
    const rawStr = String(budget || '').trim();
    const num = parseFloat(rawStr.replace(/[^0-9.]/g, ''));
    const isNegotiable = !budget || rawStr === 'Negotiable' || rawStr === '0' || rawStr === '0.00' || rawStr === '€0.00' || rawStr === '€0' || num === 0;

    if (isNegotiable) {
        return (
            <div className="flex items-center justify-end min-h-[26px]">
                <span className="whitespace-nowrap font-semibold text-[13px] text-slate-500 dark:text-slate-400">
                    Negotiable
                </span>
            </div>
        );
    }

    const formatted = isNaN(num) ? rawStr : `€${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    return (
        <div className="flex items-center justify-end min-h-[26px]">
            <span className="font-bold text-slate-900 dark:text-white whitespace-nowrap text-[13.5px]">
                {formatted} <span className="text-[11.5px] font-semibold text-slate-500 dark:text-slate-400">EUR</span>
            </span>
        </div>
    );
};

export const ProcessingPriorityBadgeCell: React.FC<{ priority: string }> = ({ priority }) => {
    const p = (priority || '').toLowerCase().trim();
    const badgeStyle = p === 'urgent'
        ? 'bg-[#fff1f2] dark:bg-rose-950/40 text-[#e11d48] dark:text-rose-300 border-[#fecdd3] dark:border-rose-800/60'
        : p === 'high'
            ? 'bg-[#fff7ed] dark:bg-orange-950/40 text-[#ea580c] dark:text-orange-300 border-[#fed7aa] dark:border-orange-800/60'
            : 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';

    return (
        <div className="flex items-center justify-center min-h-[26px]">
            <span className={`inline-flex items-center gap-1 text-[11.5px] px-2 py-0.5 rounded-[4px] font-semibold whitespace-nowrap border ${badgeStyle}`}>
                {priority || 'Standard'}
            </span>
        </div>
    );
};

export const ProcessingBidsCountCell: React.FC<{ row: any; onNavigate: (path: string) => void }> = ({ row, onNavigate }) => {
    const count = Number(row.bidsCount || 0);
    const rawId = row.rawId || row.id;

    return (
        <div className="flex items-center justify-center min-h-[26px]">
            {count > 0 ? (
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        onNavigate(`/customer/quotes/received?requestId=${rawId}`);
                    }}
                    className="whitespace-nowrap text-[13px] text-[#ff4a1f] font-bold hover:underline cursor-pointer leading-none"
                >
                    {count} {count === 1 ? 'Quote' : 'Quotes'}
                </button>
            ) : (
                <span className="whitespace-nowrap text-[13px] text-slate-400 dark:text-slate-500 font-medium leading-none">
                    0 Quotes
                </span>
            )}
        </div>
    );
};

export const ProcessingStatusBadgeCell: React.FC<{ status: string }> = ({ status }) => {
    const s = (status || '').toLowerCase().trim();
    const isCompleted = s === 'completed' || s === 'accepted' || s === 'awarded' || s === 'won' || s === 'succeeded' || s === 'paid';
    const isInProgress = s === 'in progress' || s === 'in_progress' || s === 'active' || s === 'bidding active' || s === 'negotiating';
    const isProcessing = s === 'processing' || s === 'pending' || s === 'draft' || s === 'waiting';
    const isCancelled = s === 'cancelled' || s === 'expired' || s === 'closed' || s === 'rejected' || s === 'failed';

    const badgeStyle = isCompleted
        ? 'bg-[#ecfdf5] dark:bg-emerald-950/40 text-[#059669] dark:text-emerald-300 border border-[#a7f3d0] dark:border-emerald-800/60'
        : isInProgress
            ? 'bg-[#eff6ff] dark:bg-blue-950/40 text-[#2563eb] dark:text-blue-300 border border-[#bfdbfe] dark:border-blue-800/60'
            : isProcessing
                ? 'bg-[#fffbeb] dark:bg-amber-950/40 text-[#d97706] dark:text-amber-300 border border-[#fde68a] dark:border-amber-800/60'
                : isCancelled
                    ? 'bg-[#fef2f2] dark:bg-rose-950/40 text-[#dc2626] dark:text-rose-300 border border-[#fecaca] dark:border-rose-800/60'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700';

    return (
        <div className="flex items-center justify-center min-h-[26px]">
            <span className={`inline-flex items-center gap-1 text-[11.5px] px-2 py-0.5 rounded-[4px] font-semibold whitespace-nowrap border ${badgeStyle}`}>
                {status || 'Active'}
            </span>
        </div>
    );
};

export const ProcessingDateCell: React.FC<{ date: any }> = ({ date }) => (
    <div className="flex items-center justify-center min-h-[26px]">
        <span className="whitespace-nowrap text-[13px] text-slate-600 dark:text-slate-400 font-medium leading-none">
            {formatDisplayDate(date)}
        </span>
    </div>
);
