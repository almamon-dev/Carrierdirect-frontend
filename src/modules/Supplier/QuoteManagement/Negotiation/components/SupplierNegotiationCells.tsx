import React from 'react';
import { NegotiationItem } from '../types';
import { encryptId } from '@/lib/encryption';
import { formatDisplayDate } from '@/lib/utils';

const cleanAddressWithoutZip = (addr?: string): string => {
    if (!addr || addr === '—') return addr || '—';
    return addr
        .replace(/\s*\(?ZIP:?\s*\d+\)?/gi, '')
        .replace(/\b(?:ZIP|Postal Code):?\s*\d+\b/gi, '')
        .replace(/\s+\d{4,6}\b(?=[,\s]|$)/g, '')
        .replace(/\s*,\s*,/g, ',')
        .replace(/,\s*$/g, '')
        .trim();
};

export const SupplierNegotiationQuoteIdCell: React.FC<{ row: NegotiationItem; onNavigate: (path: string) => void }> = ({ row, onNavigate }) => {
    const rawId = row.rawId || row.id;
    const encId = encryptId(rawId);
    const sKey = row.sessionKey || `ses-${rawId}`;
    const quoteText = row.quoteId || (rawId ? (String(rawId).startsWith('QT-') ? rawId : `QT-${String(rawId).padStart(4, '0')}`) : 'QT-0000');

    return (
        <div className="flex items-center min-h-[26px]">
            <button
                type="button"
                onClick={(e) => {
                    e.stopPropagation();
                    onNavigate(`/supplier/quotes/negotiation/conversation/${encId}/${sKey}`);
                }}
                className="font-bold text-slate-900 dark:text-slate-100 hover:text-[#ff4a1f] dark:hover:text-[#ff4a1f] text-left whitespace-nowrap cursor-pointer text-[13px] tracking-tight transition-colors leading-none"
            >
                {quoteText}
            </button>
        </div>
    );
};

export const SupplierNegotiationRequestIdCell: React.FC<{ row: NegotiationItem; onNavigate: (path: string) => void }> = ({ row, onNavigate }) => {
    const rawReq = row.requestId ? String(row.requestId).replace('REQ-', '').trim() : '';
    const reqText = row.requestId || (rawReq ? `REQ-${String(rawReq).padStart(4, '0')}` : 'REQ-0000');

    return (
        <div className="flex items-center min-h-[26px]">
            <button
                type="button"
                onClick={(e) => {
                    e.stopPropagation();
                    if (rawReq) onNavigate(`/supplier/quotes/requests/${encryptId(rawReq)}`);
                }}
                className="font-bold text-slate-800 dark:text-slate-200 hover:text-[#ff4a1f] dark:hover:text-[#ff4a1f] hover:underline text-left whitespace-nowrap cursor-pointer text-[13px] leading-none transition-colors"
            >
                {reqText}
            </button>
        </div>
    );
};

export const SupplierNegotiationCustomerCell: React.FC<{ row: NegotiationItem }> = ({ row }) => {
    const avatarUrl = row.customerAvatar;
    const hasValidUrl = Boolean(avatarUrl && (avatarUrl.startsWith('http') || avatarUrl.startsWith('/storage') || avatarUrl.startsWith('data:') || avatarUrl.includes('.')));
    const name = row.customer || 'Customer';
    const initial = name ? name.charAt(0).toUpperCase() : 'C';

    return (
        <div className="flex items-center gap-2 whitespace-nowrap min-w-0 min-h-[26px]" title={name}>
            <div className="w-5 h-5 min-w-[20px] min-h-[20px] aspect-square rounded-full bg-orange-100 dark:bg-[#ff4a1f]/20 border border-orange-200/60 dark:border-orange-500/20 text-[#ff4a1f] flex items-center justify-center text-[10px] font-bold shrink-0 overflow-hidden">
                {hasValidUrl ? (
                    <img
                        src={avatarUrl}
                        alt=""
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            (e.currentTarget as HTMLElement).style.display = 'none';
                        }}
                    />
                ) : (
                    <span>{initial}</span>
                )}
            </div>
            <span className="font-bold text-slate-900 dark:text-slate-100 text-[13px] truncate max-w-[110px]">
                {name}
            </span>
        </div>
    );
};

export const SupplierNegotiationAddressCell: React.FC<{ address: string }> = ({ address }) => {
    const displayAddr = cleanAddressWithoutZip(address);
    return (
        <div className="flex items-center min-w-0 w-full overflow-hidden pr-1 min-h-[26px]" title={displayAddr}>
            <span className="font-semibold text-slate-800 dark:text-slate-200 text-[12.5px] truncate block max-w-full leading-normal">
                {displayAddr}
            </span>
        </div>
    );
};

export const SupplierNegotiationVehicleCell: React.FC<{ vehicle?: string }> = ({ vehicle }) => (
    <div className="flex items-center min-h-[26px]" title={vehicle || 'Covered Van (20ft)'}>
        <span className="text-[12.5px] text-slate-800 dark:text-slate-200 font-semibold truncate max-w-[125px]">
            {vehicle || 'Covered Van (20ft)'}
        </span>
    </div>
);

export const SupplierNegotiationTransitCell: React.FC<{ transit?: string }> = ({ transit }) => {
    const displayTransit = transit || '48h';
    return (
        <div className="flex items-center justify-center min-h-[26px]" title={displayTransit}>
            <span className="text-[12.5px] text-slate-700 dark:text-slate-200 font-bold whitespace-nowrap">
                {displayTransit}
            </span>
        </div>
    );
};

export const SupplierNegotiationBudgetCell: React.FC<{ budget?: string | number; row?: NegotiationItem }> = ({ budget, row }) => {
    const rawVal = row?.budget ?? budget;
    const rawStr = String(rawVal || '').trim();
    const num = parseFloat(rawStr.replace(/[^0-9.]/g, ''));
    const isNegotiable = !rawVal || rawStr === 'Negotiable' || rawStr === '0' || rawStr === '0.00' || rawStr === '€0.00' || rawStr === '€0' || rawStr === '€ 0' || num === 0;

    if (isNegotiable) {
        return (
            <div className="flex items-center min-h-[26px]">
                <span className="whitespace-nowrap font-bold text-[12.5px] text-slate-500 dark:text-slate-400">
                    Negotiable
                </span>
            </div>
        );
    }

    const formattedNum = isNaN(num) ? rawStr : `€${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    return (
        <div className="flex items-center min-h-[26px]">
            <span className="font-bold text-slate-900 dark:text-white whitespace-nowrap text-[13px]">
                {formattedNum} <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">EUR</span>
            </span>
        </div>
    );
};

export const SupplierNegotiationStatusBadgeCell: React.FC<{ status?: string }> = ({ status }) => {
    const s = (status || "").toLowerCase().trim();
    const isBooked = s === "booked" || s === "completed" || s === "won" || s === "succeeded" || s === "paid";
    const isAccepted = s === "accepted" || s === "awarded" || s === "confirmed";
    const isCounter = s.includes("counter") || s === "negotiating" || s === "counter_offers" || s === "counter offer sent" || s === "counter received";
    const isClosed = s === "closed" || s === "rejected" || s === "expired" || s === "failed" || s === "declined" || s === "cancelled" || s === "lost";

    const badgeStyle = isBooked
        ? "bg-[#ecfdf5] dark:bg-emerald-950/40 text-[#059669] dark:text-emerald-300 border border-[#a7f3d0] dark:border-emerald-800/60"
        : isAccepted
            ? "bg-[#eff6ff] dark:bg-blue-950/40 text-[#2563eb] dark:text-blue-300 border border-[#bfdbfe] dark:border-blue-800/60"
            : isCounter
                ? "bg-[#fffbeb] dark:bg-amber-950/40 text-[#d97706] dark:text-amber-300 border border-[#fde68a] dark:border-amber-800/60"
                : isClosed
                    ? "bg-[#fef2f2] dark:bg-rose-950/40 text-[#dc2626] dark:text-rose-300 border border-[#fecaca] dark:border-rose-800/60"
                    : "bg-[#f0f9ff] dark:bg-sky-950/40 text-[#0284c7] dark:text-sky-300 border border-[#bae6fd] dark:border-sky-800/60";

    return (
        <div className="flex items-center justify-center min-h-[26px]">
            <span className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-[4px] font-bold whitespace-nowrap border ${badgeStyle}`}>
                {status || "Open"}
            </span>
        </div>
    );
};

export const SupplierNegotiationDateCell: React.FC<{ date?: string; row?: NegotiationItem }> = ({ date, row }) => {
    const rawDate = date || row?.requestDate;
    return (
        <div className="flex items-center justify-center min-h-[26px]">
            <span className="whitespace-nowrap text-[12.5px] text-slate-700 dark:text-slate-300 font-semibold leading-none">
                {formatDisplayDate(rawDate) || rawDate || '—'}
            </span>
        </div>
    );
};
