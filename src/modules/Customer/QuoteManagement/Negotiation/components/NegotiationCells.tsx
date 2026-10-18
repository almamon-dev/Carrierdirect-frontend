import React from 'react';
import { CustomerNegotiationItem } from '../types';
import { encryptId } from '@/lib/encryption';
import { 
    PriorityCell, 
    StatusCell, 
    NegotiationStatusBadgeCell, 
    NegotiationDateCell 
} from './NegotiationStatusCells';

export { PriorityCell, StatusCell, NegotiationStatusBadgeCell, NegotiationDateCell };

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

export const NegotiationQuoteIdCell: React.FC<{ row: CustomerNegotiationItem | any; onNavigate: (path: string) => void }> = ({ row, onNavigate }) => {
    const rawId = row.rawId || row.id;
    const quoteText = row.quoteId || row.quote_id || (rawId ? (String(rawId).startsWith('QT-') ? rawId : `QT-${String(rawId).padStart(4, '0')}`) : 'QT-0000');

    return (
        <div className="flex items-center min-h-[26px]">
            <button
                type="button"
                onClick={(e) => {
                    e.stopPropagation();
                    onNavigate(`/customer/quotes/negotiation/conversation/${encryptId(rawId)}`);
                }}
                className="font-bold text-slate-900 dark:text-slate-100 hover:text-[#ff4a1f] dark:hover:text-[#ff4a1f] text-left whitespace-nowrap cursor-pointer text-[13px] tracking-tight transition-colors leading-none"
            >
                {quoteText}
            </button>
        </div>
    );
};

export const NegotiationIdCell = NegotiationQuoteIdCell;

export const NegotiationRequestIdCell: React.FC<{ row: CustomerNegotiationItem | any; onNavigate: (path: string) => void }> = ({ row, onNavigate }) => {
    const rawReq = row.requestId ? String(row.requestId).replace('REQ-', '') : (row.quote_request_id || row.quote_request?.id || '');
    const reqText = row.requestId || row.request_id || (rawReq ? `REQ-${String(rawReq).padStart(4, '0')}` : 'REQ-0000');

    return (
        <div className="flex items-center min-h-[26px]">
            <button
                type="button"
                onClick={(e) => {
                    e.stopPropagation();
                    if (rawReq) onNavigate(`/customer/quotes/create/view/${rawReq}`);
                }}
                className="font-bold text-slate-800 dark:text-slate-200 hover:text-[#ff4a1f] dark:hover:text-[#ff4a1f] hover:underline text-left whitespace-nowrap cursor-pointer text-[13px] leading-none transition-colors"
            >
                {reqText}
            </button>
        </div>
    );
};

export const SupplierCell: React.FC<{ row: CustomerNegotiationItem | any }> = ({ row }) => {
    const avatarUrl = row.customerAvatar || row.supplierAvatar || row.supplier?.profile_picture;
    const hasValidUrl = Boolean(avatarUrl && (avatarUrl.startsWith('http') || avatarUrl.startsWith('/storage') || avatarUrl.startsWith('data:') || avatarUrl.includes('.')));
    const name = row.customer || row.supplier || row.supplierName || row.supplier_name || 'Supplier';
    const initial = name ? name.charAt(0).toUpperCase() : 'S';

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

export const NegotiationSupplierCell = SupplierCell;

export const NegotiationAddressCell: React.FC<{ address: string }> = ({ address }) => {
    const displayAddr = cleanAddressWithoutZip(address);
    return (
        <div className="flex items-center min-w-0 w-full overflow-hidden pr-1 min-h-[26px]" title={displayAddr}>
            <span className="font-semibold text-slate-800 dark:text-slate-200 text-[12.5px] truncate block max-w-full leading-normal">
                {displayAddr}
            </span>
        </div>
    );
};

export const NegotiationVehicleCell: React.FC<{ vehicle: string }> = ({ vehicle }) => (
    <div className="flex items-center min-h-[26px]" title={vehicle}>
        <span className="text-[12.5px] text-slate-800 dark:text-slate-200 font-semibold truncate max-w-[125px]">
            {vehicle || 'Covered Van (20ft)'}
        </span>
    </div>
);

export const NegotiationTransitCell: React.FC<{ transit?: string; time?: string }> = ({ transit, time }) => {
    const displayTransit = transit || time || '48h';
    return (
        <div className="flex items-center justify-center min-h-[26px]" title={displayTransit}>
            <span className="text-[12.5px] text-slate-700 dark:text-slate-200 font-bold whitespace-nowrap">
                {displayTransit}
            </span>
        </div>
    );
};

export const NegotiationTransitTimeCell = NegotiationTransitCell;

export const NegotiationBudgetCell: React.FC<{ budget?: string | number; row?: any; amount?: any }> = ({ budget, row, amount }) => {
    const rawVal = row?.currentOffer || row?.amount || row?.originalAmount || row?.amount_raw || budget || amount;
    const rawStr = String(rawVal || '').trim();
    const num = parseFloat(rawStr.replace(/[^0-9.]/g, ''));
    const isNegotiable = !rawVal || rawStr === 'Negotiable' || rawStr === '0' || rawStr === '0.00' || rawStr === '€0.00' || rawStr === '€0' || num === 0;

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

export const NegotiationAmountCell = NegotiationBudgetCell;
