import React from 'react';
import { Plane } from 'lucide-react';
import { formatDisplayDate } from '@/lib/utils';
import { StandardRouteCell } from '@/components/common/StandardRouteCell';
import { formatStandardAddress } from '@/utils/addressFormatter';
import { CustomerQuoteRequestItem } from '../types';

export const RequestIdCell: React.FC<{ row: CustomerQuoteRequestItem; onNavigate: (path: string) => void }> = ({ row, onNavigate }) => {
    const reqText = row.id ? (String(row.id).startsWith('REQ-') ? row.id : `REQ-${String(row.id).padStart(4, '0')}`) : 'REQ-0000';
    const rawId = row.rawId || String(row.id).replace('REQ-', '');
    const dateVal = row.date || row.created_at;

    return (
        <div className="flex flex-col justify-center min-h-[26px]">
            <button
                type="button"
                onClick={() => onNavigate(`/customer/quotes/create/view/${rawId}`)}
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

export const TitleCell: React.FC<{ row: CustomerQuoteRequestItem }> = ({ row }) => {
    const title = row.title || row.request_title || row.requestTitle || '—';
    return (
        <div className="flex items-center min-w-0 w-full overflow-hidden pr-1 min-h-[26px]" title={title}>
            <span className="font-bold text-slate-900 dark:text-slate-100 text-[13.5px] whitespace-nowrap block leading-normal">
                {title}
            </span>
        </div>
    );
};

export const RequestRouteCell: React.FC<{ row: any }> = ({ row }) => {
    return <StandardRouteCell row={row} />;
};

export const AddressCell: React.FC<{ address?: string; row?: any; type?: "pickup" | "delivery" }> = ({ address, row, type = "pickup" }) => {
    const displayAddr = row ? formatStandardAddress(row, type) : formatStandardAddress(address);
    return (
        <div className="flex items-center min-w-0 w-full overflow-hidden pr-1 min-h-[26px]" title={displayAddr}>
            <span className="font-medium text-slate-700 dark:text-slate-300 text-[13px] whitespace-nowrap block leading-normal">
                {displayAddr}
            </span>
        </div>
    );
};

export const DistanceCell: React.FC<{ distance: string }> = ({ distance }) => {
    const isAir = distance?.includes('(Air)') || distance?.includes('✈');
    const cleanDist = (distance || '—').replace(/\s*\(Air\)/i, '').replace(/✈\s*/g, '').trim();

    return (
        <div className="flex items-center justify-center min-h-[26px]">
            <span
                className="whitespace-nowrap text-slate-700 dark:text-slate-200 text-[13px] font-medium leading-none inline-flex items-center justify-center gap-1.5"
                title={isAir ? `Air Flight Distance: ${cleanDist}` : `Road Distance: ${cleanDist}`}
            >
                {isAir && <Plane size={12} className="shrink-0 text-sky-500" />}
                <span>{cleanDist}</span>
            </span>
        </div>
    );
};

export const BudgetCell: React.FC<{ budget: string | number }> = ({ budget }) => {
    const rawStr = String(budget || '').trim();
    const num = parseFloat(rawStr.replace(/[^0-9.]/g, ''));
    const isNegotiable = !budget || rawStr === 'Negotiable' || rawStr === '0' || rawStr === '0.00' || rawStr === '€0.00' || rawStr === '€0' || num === 0;

    if (isNegotiable) {
        return (
            <div className="flex items-center min-h-[26px]">
                <span className="whitespace-nowrap font-semibold text-[13px] text-slate-500 dark:text-slate-400">
                    Negotiable
                </span>
            </div>
        );
    }

    const formattedNum = isNaN(num) ? rawStr : `€${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    return (
        <div className="flex items-center min-h-[26px]">
            <span className="font-bold text-slate-900 dark:text-white whitespace-nowrap text-[13.5px]">
                {formattedNum} <span className="text-[11.5px] font-semibold text-slate-500 dark:text-slate-400">EUR</span>
            </span>
        </div>
    );
};

export const QuotesCountCell: React.FC<{ count: number; rawId?: any; onNavigate?: (path: string) => void }> = ({ count, rawId, onNavigate }) => (
    <div className="flex items-center justify-center min-h-[26px]">
        {count > 0 && onNavigate ? (
            <button
                type="button"
                onClick={(e) => {
                    e.stopPropagation();
                    onNavigate(`/customer/quotes/received/${rawId}`);
                }}
                className="whitespace-nowrap text-[13px] leading-none text-[#ff4a1f] font-bold hover:underline cursor-pointer"
            >
                {count} {count === 1 ? 'Quote' : 'Quotes'}
            </button>
        ) : (
            <span className={`whitespace-nowrap text-[13px] leading-none ${count > 0 ? 'text-[#ff4a1f] font-bold' : 'text-slate-400 dark:text-slate-500 font-medium'}`}>
                {count} {count === 1 ? 'Quote' : 'Quotes'}
            </span>
        )}
    </div>
);

export const PriorityBadgeCell: React.FC<{ priority: string }> = ({ priority }) => {
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

export const StatusBadgeCell: React.FC<{ status: string }> = ({ status }) => {
    const raw = (status || '').trim();
    const clean = raw.replace(/_/g, ' ').replace(/\w/g, c => c.toUpperCase());
    const s = clean.toLowerCase();

    let colorClass = 'bg-[#D8DCE3] text-[#374151]';

    if (s === 'awaiting payment') {
        colorClass = 'bg-[#D8DCE3] text-[#374151]';
    } else if (s === 'won' || s === 'completed' || s === 'accepted' || s === 'awarded' || s === 'paid') {
        colorClass = 'bg-[#BBEBD0] text-[#166534]';
    } else if (s === 'quotes received' || s === 'quotes_received' || s === 'quoted' || s === 'in progress' || s === 'in_progress' || s === 'active') {
        colorClass = 'bg-[#BBD8F7] text-[#1E40AF]';
    } else if (s === 'negotiation' || s === 'negotiating' || s.includes('counter')) {
        colorClass = s.includes('counter received') ? 'bg-[#F5D0AD] text-[#8A4210]' : 'bg-[#BBD8F7] text-[#1E40AF]';
    } else if (s === 'pending' || s === 'processing' || s === 'waiting') {
        colorClass = 'bg-[#F5E3A3] text-[#805B10]';
    } else if (s === 'expired' || s === 'closed' || s === 'draft') {
        colorClass = 'bg-[#D8DCE3] text-[#374151]';
    } else if (s === 'cancelled' || s === 'rejected' || s === 'failed') {
        colorClass = 'bg-[#F4C2C2] text-[#991B1B]';
    }

    return (
        <div className="flex items-center justify-center min-h-[26px]">
            <span className={"inline-flex items-center justify-center px-[10px] py-[4px] text-[12px] font-semibold leading-none rounded-[2px] whitespace-nowrap shrink-0 " + colorClass}>
                {clean || 'Pending'}
            </span>
        </div>
    );
};

export const DateCell: React.FC<{ row: CustomerQuoteRequestItem }> = ({ row }) => {
    const dateVal = row.date && row.date !== 'N/A' && row.date !== 'null'
        ? row.date
        : formatDisplayDate((row as any).created_at || (row as any).requested_date || (row as any).pickup_date || row.date);

    return (
        <div className="flex items-center justify-center min-h-[26px]">
            <span className="whitespace-nowrap text-[13px] text-slate-600 dark:text-slate-400 font-medium leading-none">
                {dateVal}
            </span>
        </div>
    );
};
