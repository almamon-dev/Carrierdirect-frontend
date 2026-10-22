import { StandardRouteCell } from '@/components/common/StandardRouteCell';
import { formatStandardAddress, formatCompactRoute } from "@/utils/addressFormatter";
import React from 'react';
import { formatDisplayDate } from '@/lib/utils';
import { buildSecureQuoteUrl } from '@/utils/urlSecurity';

export const ProcessingRequestIdCell: React.FC<{ row: any; onNavigate: (path: string) => void }> = ({ row, onNavigate }) => {
    const rawId = row.rawId || row.id;
    const reqText = row.requestId || (rawId ? (String(rawId).startsWith('REQ-') ? rawId : `REQ-${String(rawId).padStart(4, '0')}`) : 'REQ-0000');
    const dateVal = row.createdAt || row.date || row.created_at;

    return (
        <div className="flex flex-col justify-center min-h-[26px]">
            <button
                type="button"
                onClick={(e) => {
                    e.stopPropagation();
                    onNavigate(buildSecureQuoteUrl('view', rawId));
                }}
                className="font-bold text-slate-900 dark:text-slate-100 hover:text-[#ff4a1f] dark:hover:text-[#ff4a1f] text-left whitespace-nowrap cursor-pointer text-[13.5px] tracking-tight transition-colors leading-none"
            >
                {reqText}
            </button>
            {dateVal && (
                <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 mt-1 leading-none whitespace-nowrap">
                    {formatDisplayDate(dateVal)}
                </span>
            )}
        </div>
    );
};

export const ProcessingRouteCell: React.FC<{ row: any }> = ({ row }) => {
    return <StandardRouteCell row={row} />;
};

export const ProcessingAddressCell: React.FC<{ address?: string; row?: any; type?: "pickup" | "delivery" }> = ({ address, row, type = "pickup" }) => {
    const displayAddr = row ? formatStandardAddress(row, type) : formatStandardAddress(address);
    return (
        <div className="flex items-center min-w-0 w-full overflow-hidden pr-1 min-h-[26px]" title={displayAddr}>
            <span className="font-medium text-slate-700 dark:text-slate-300 text-[13px] whitespace-nowrap block leading-normal">
                {displayAddr}
            </span>
        </div>
    );
};

export const ProcessingVehicleCell: React.FC<{ vehicleType: string }> = ({ vehicleType }) => (
    <div className="flex items-center min-w-0 min-h-[26px]" title={vehicleType}>
        <span className="text-[13px] text-slate-800 dark:text-slate-200 font-medium whitespace-nowrap block">
            {vehicleType || '—'}
        </span>
    </div>
);

export const ProcessingTransitTimeCell: React.FC<{ time: string }> = ({ time }) => (
    <div className="flex items-center min-w-0 min-h-[26px]" title={time}>
        <span className="text-[13px] text-slate-700 dark:text-slate-300 font-medium whitespace-nowrap block">
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
    const isActionRequired = p === 'urgent' || p === 'high';

    return (
        <div className="flex items-center justify-center min-h-[26px]">
            <span className={`inline-flex items-center justify-center px-[10px] py-[4px] text-[12px] font-semibold leading-none rounded-[2px] whitespace-nowrap ${
                isActionRequired ? 'bg-[#F5D0AD] text-[#8A4210]' : 'bg-[#D8DCE3] text-[#374151]'
            }`}>
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
    let displayLabel = status || 'Active';
    if (s === 'in progress' || s === 'in_progress') displayLabel = 'In Progress';
    else if (s === 'quotes received' || s === 'quotes_received') displayLabel = 'Quotes Received';
    else if (s === 'bidding active') displayLabel = 'Bidding Active';

    let category = 'in_progress';
    if (s === 'completed') category = 'success';
    else if (s === 'booked' || s === 'won' || s === 'accepted' || s === 'paid') category = 'success';
    else if (s === 'processing' || s === 'pending' || s === 'waiting') category = 'pending';
    else if (s === 'cancelled' || s === 'rejected' || s === 'failed') category = 'failed';
    else if (s === 'draft' || s === 'closed' || s === 'expired') category = 'neutral';

    const colorClass = category === 'success'
        ? 'bg-[#BBEBD0] text-[#166534]'
        : category === 'pending'
        ? 'bg-[#F5E3A3] text-[#805B10]'
        : category === 'failed'
        ? 'bg-[#F4C2C2] text-[#991B1B]'
        : category === 'neutral'
        ? 'bg-[#D8DCE3] text-[#374151]'
        : 'bg-[#BBD8F7] text-[#1E40AF]';

    return (
        <div className="flex items-center justify-center min-h-[26px]">
            <span className={`inline-flex items-center justify-center px-[10px] py-[4px] text-[12px] font-semibold leading-none rounded-[2px] whitespace-nowrap ${colorClass}`}>
                {displayLabel}
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
