import { StandardRouteCell } from '@/components/common/StandardRouteCell';
import { formatStandardAddress } from '@/utils/addressFormatter';
import React from 'react';
import { NegotiationItem } from '../types';
import { encryptId } from '@/lib/encryption';
import { formatDisplayDate } from '@/lib/utils';

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

export const SupplierNegotiationAddressCell: React.FC<{ address?: string; row?: any; type?: 'pickup' | 'delivery' }> = ({ address, row, type = 'pickup' }) => {
    const displayAddr = row ? formatStandardAddress(row, type) : formatStandardAddress(address);
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
    let displayLabel = status || "Open";

    let colorClass = "bg-[#BBD8F7] text-[#1E40AF]"; // default in progress/open

    if (s === "completed" || s === "booked" || s === "won" || s === "paid" || s === "accepted" || s === "awarded" || s === "confirmed") {
        colorClass = "bg-[#BBEBD0] text-[#166534]";
    } else if (s === "counter received" || s === "counter offer received") {
        colorClass = "bg-[#F5D0AD] text-[#8A4210]";
    } else if (s.includes("counter") || s === "negotiating" || s === "counter_offers" || s === "counter offer sent" || s === "open") {
        colorClass = "bg-[#BBD8F7] text-[#1E40AF]";
    } else if (s === "closed" || s === "expired" || s === "draft") {
        colorClass = "bg-[#D8DCE3] text-[#374151]";
    } else if (s === "rejected" || s === "failed" || s === "declined" || s === "cancelled" || s === "lost") {
        colorClass = "bg-[#F4C2C2] text-[#991B1B]";
    }

    return (
        <div className="flex items-center justify-center min-h-[26px]">
            <span className={`inline-flex items-center justify-center px-[10px] py-[4px] text-[12px] font-semibold leading-none rounded-[2px] whitespace-nowrap ${colorClass}`}>
                {displayLabel}
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

export const SupplierNegotiationRouteCell: React.FC<{ row: any }> = ({ row }) => {
    return <StandardRouteCell row={row} />;
};
