import React from 'react';
import { Plane } from 'lucide-react';
import { formatDisplayDate } from '@/lib/utils';
import { encryptId } from '@/lib/encryption';
import { QuoteRequest } from '../../data/quoteRequestsData';

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

export const SupplierRequestIdCell: React.FC<{ row: QuoteRequest; onNavigate: (path: string) => void }> = ({ row, onNavigate }) => {
    const reqText = row.id ? (String(row.id).startsWith('REQ-') ? row.id : `REQ-${String(row.id).padStart(4, '0')}`) : 'REQ-0000';
    const rawId = String(row.rawId || row.slug || row.id).replace('REQ-', '').trim();
    return (
        <div className="flex items-center min-h-[26px]">
            <button
                type="button"
                onClick={() => onNavigate(`/supplier/quotes/requests/${encryptId(rawId)}`)}
                className="font-bold text-slate-900 dark:text-slate-100 hover:text-[#ff4a1f] dark:hover:text-[#ff4a1f] text-left whitespace-nowrap cursor-pointer text-[13.5px] tracking-tight transition-colors leading-none"
            >
                {reqText}
            </button>
        </div>
    );
};

export const SupplierCustomerCell: React.FC<{ row: QuoteRequest }> = ({ row }) => {
    const name = row.customer || 'Customer';
    return (
        <div className="flex items-center gap-2 min-w-0 pr-1 min-h-[26px]" title={name}>
            {row.customerAvatar ? (
                <img
                    src={row.customerAvatar}
                    alt={name}
                    className="w-5 h-5 min-w-[20px] min-h-[20px] rounded-full object-cover shrink-0 aspect-square border border-slate-200 dark:border-slate-700 shadow-2xs"
                    onError={(e) => { (e.currentTarget as HTMLElement).style.display = 'none'; }}
                />
            ) : (
                <div className="w-5 h-5 min-w-[20px] min-h-[20px] rounded-full bg-orange-100 dark:bg-[#ff4a1f]/20 border border-orange-200/60 text-[#ff4a1f] flex items-center justify-center text-[10px] font-bold shrink-0 aspect-square">
                    {name ? name.charAt(0).toUpperCase() : 'C'}
                </div>
            )}
            <span className="font-semibold text-slate-900 dark:text-slate-100 text-[13px] truncate block max-w-full leading-normal">
                {name}
            </span>
        </div>
    );
};

export const SupplierAddressCell: React.FC<{ address: string }> = ({ address }) => {
    const displayAddr = cleanAddressWithoutZip(address);
    return (
        <div className="flex items-center min-w-0 w-full overflow-hidden pr-1 min-h-[26px]" title={displayAddr}>
            <span className="font-medium text-slate-700 dark:text-slate-300 text-[13px] truncate block max-w-full leading-normal">
                {displayAddr}
            </span>
        </div>
    );
};

export const SupplierDistanceCell: React.FC<{ distance: string }> = ({ distance }) => {
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

export const SupplierBudgetCell: React.FC<{ budget: string | number }> = ({ budget }) => {
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

export const SupplierPriorityBadgeCell: React.FC<{ priority: string }> = ({ priority }) => {
    const p = (priority || '').toLowerCase().trim();
    const badgeStyle = p === 'urgent'
        ? 'bg-[#fff1f2] dark:bg-rose-950/40 text-[#e11d48] dark:text-rose-300 border-[#fecdd3] dark:border-rose-800/60'
        : p === 'high'
            ? 'bg-[#fff7ed] dark:bg-orange-950/40 text-[#ea580c] dark:text-orange-300 border-[#fed7aa] dark:border-orange-800/60'
            : 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';

    return (
        <div className="flex items-center justify-center min-h-[26px]">
            <span className={`inline-flex items-center gap-1 text-[11.5px] px-2 py-0.5 rounded-[4px] font-semibold whitespace-nowrap border ${badgeStyle}`}>
                {priority}
            </span>
        </div>
    );
};

export const SupplierStatusBadgeCell: React.FC<{ status: string }> = ({ status }) => {
    const s = (status || '').toLowerCase().trim();
    const isCompleted = s === 'completed' || s === 'accepted' || s === 'awarded' || s === 'won' || s === 'succeeded' || s === 'paid' || s === 'booked';
    const isInProgress = s === 'in progress' || s === 'in_progress' || s === 'active' || s === 'bidding active' || s === 'negotiating' || s === 'quoted';
    const isProcessing = s === 'processing' || s === 'pending' || s === 'draft' || s === 'waiting' || s === 'new' || s === 'viewed';
    const isCancelled = s === 'cancelled' || s === 'expired' || s === 'closed' || s === 'rejected' || s === 'failed' || s === 'lost' || s === 'declined';

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
                {status || 'New'}
            </span>
        </div>
    );
};

export const SupplierDateCell: React.FC<{ row: QuoteRequest }> = ({ row }) => {
    const dateVal = row.requestDate && row.requestDate !== 'N/A' && row.requestDate !== 'null'
        ? row.requestDate
        : formatDisplayDate(row.pickupDate || (row as any).date || (row as any).created_at || (row as any).requested_date || row.requestDate);

    return (
        <div className="flex items-center justify-center min-h-[26px]">
            <span className="whitespace-nowrap text-[13px] text-slate-600 dark:text-slate-400 font-medium leading-none">
                {dateVal}
            </span>
        </div>
    );
};
