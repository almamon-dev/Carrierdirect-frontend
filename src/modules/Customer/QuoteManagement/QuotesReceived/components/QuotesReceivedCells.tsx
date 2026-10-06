import React from 'react';
import { formatDisplayDate } from '@/lib/utils';
import { encryptId } from '@/lib/encryption';

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

export const QuotesReceivedQuoteIdCell: React.FC<{ row: any; onNavigate: (path: string) => void }> = ({ row, onNavigate }) => {
    const rawId = row.rawId || row.id;
    const quoteText = row.quote_id || row.quoteId || (rawId ? (String(rawId).startsWith('QT-') ? rawId : `QT-${String(rawId).padStart(4, '0')}`) : 'QT-0000');

    return (
        <div className="flex items-center min-h-[26px]">
            <button
                type="button"
                onClick={(e) => {
                    e.stopPropagation();
                    onNavigate(`/customer/quotes/received/view/${encryptId(rawId)}`);
                }}
                className="font-bold text-slate-900 dark:text-slate-100 hover:text-[#ff4a1f] dark:hover:text-[#ff4a1f] text-left whitespace-nowrap cursor-pointer text-[13px] tracking-tight transition-colors leading-none"
            >
                {quoteText}
            </button>
        </div>
    );
};

export const QuotesReceivedRequestIdCell: React.FC<{ row: any; onNavigate: (path: string) => void }> = ({ row, onNavigate }) => {
    const reqIdVal = row.quote_request_id || row.quote_request?.id || row.rawId || row.requestId || row.request_id;
    const reqIdText = row.request_id || row.requestId || (reqIdVal ? (String(reqIdVal).startsWith('REQ-') ? reqIdVal : `REQ-${String(reqIdVal).padStart(4, '0')}`) : 'REQ-0000');
    return (
        <div className="flex items-center min-h-[26px]">
            <button
                type="button"
                onClick={(e) => {
                    e.stopPropagation();
                    const cleanReqId = String(reqIdVal || '').replace('REQ-', '');
                    if (cleanReqId) onNavigate(`/customer/quotes/create/view/${cleanReqId}`);
                }}
                className="font-bold text-slate-800 dark:text-slate-200 hover:text-[#ff4a1f] dark:hover:text-[#ff4a1f] hover:underline whitespace-nowrap cursor-pointer text-[13px] text-left leading-none transition-colors"
            >
                {reqIdText}
            </button>
        </div>
    );
};

export const QuotesReceivedSupplierCell: React.FC<{ row: any }> = ({ row }) => {
    const name = row.supplier_name || row.supplier?.company_name || row.supplier?.name || row.carrier_name || row.customer || row.supplier || 'Supplier';
    const avatar = row.supplier?.profile_picture || row.supplier_avatar || row.customerAvatar || row.supplierAvatar;
    return (
        <div className="flex items-center gap-2 whitespace-nowrap min-w-0 min-h-[26px]" title={name}>
            {avatar ? (
                <img
                    src={avatar}
                    alt={name}
                    className="w-5 h-5 min-w-[20px] min-h-[20px] aspect-square rounded-full object-cover shrink-0 border border-slate-200 dark:border-slate-700 shadow-2xs"
                    onError={(e) => { (e.currentTarget as HTMLElement).style.display = 'none'; }}
                />
            ) : (
                <div className="w-5 h-5 min-w-[20px] min-h-[20px] aspect-square rounded-full bg-orange-100 dark:bg-[#ff4a1f]/20 border border-orange-200/60 dark:border-orange-500/20 text-[#ff4a1f] flex items-center justify-center text-[10px] font-bold shrink-0">
                    {name.charAt(0).toUpperCase()}
                </div>
            )}
            <span className="font-bold text-slate-900 dark:text-slate-100 text-[13px] truncate max-w-[110px]">{name}</span>
        </div>
    );
};

export const QuotesReceivedAddressCell: React.FC<{ address: string }> = ({ address }) => {
    const displayAddr = cleanAddressWithoutZip(address);
    return (
        <div className="flex items-center min-w-0 w-full overflow-hidden pr-1 min-h-[26px]" title={displayAddr}>
            <span className="font-semibold text-slate-800 dark:text-slate-200 text-[12.5px] truncate block max-w-full leading-normal">
                {displayAddr}
            </span>
        </div>
    );
};

export const QuotesReceivedVehicleCell: React.FC<{ vehicle: string }> = ({ vehicle }) => (
    <div className="flex items-center min-h-[26px]" title={vehicle}>
        <span className="text-[12.5px] text-slate-800 dark:text-slate-200 font-semibold truncate max-w-[125px]">
            {vehicle || 'Covered Van (20ft)'}
        </span>
    </div>
);

export const QuotesReceivedTransitCell: React.FC<{ transit?: string; time?: string }> = ({ transit, time }) => {
    const displayTransit = transit || time || '48h';
    return (
        <div className="flex items-center justify-center min-h-[26px]" title={displayTransit}>
            <span className="text-[12.5px] text-slate-700 dark:text-slate-200 font-bold whitespace-nowrap">
                {displayTransit}
            </span>
        </div>
    );
};

export const QuotesReceivedTransitTimeCell = QuotesReceivedTransitCell;

export const QuotesReceivedAmountCell: React.FC<{ row?: any; amount?: any }> = ({ row, amount }) => {
    const rawVal = row?.amount_raw ?? row?.amount ?? row?.offer_amount ?? row?.quote_amount ?? row?.budget ?? row?.currentOffer ?? row?.originalAmount ?? amount;
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

export const getQuoteStatusInfo = (row: any): { text: string; statusKey: string; isExpired: boolean } => {
    const raw = (row?.status_raw || row?.statusRaw || (typeof row?.status === 'string' ? row.status : '') || (typeof row === 'string' ? row : 'pending')).toLowerCase().trim();

    const expiryField = row?.valid_until || row?.expires_at || row?.expiry_date || row?.validity_date || row?.validity || row?.quote_request?.expires_at;
    let isDateExpired = false;
    if (expiryField) {
        const expiryTime = new Date(expiryField).getTime();
        if (!isNaN(expiryTime) && expiryTime < Date.now()) {
            isDateExpired = true;
        }
    }

    const reason = String(row?.reject_reason || row?.rejection_reason || row?.notes || '').toLowerCase();
    const reasonIndicatesExpiry = reason.includes('expired') || reason.includes('expiry') || reason.includes('validity') || reason.includes('time out') || reason.includes('timeout');

    if (raw === 'expired' || ((raw === 'pending' || raw === 'rejected' || raw === 'closed') && (isDateExpired || reasonIndicatesExpiry))) {
        return { text: 'Expired', statusKey: 'expired', isExpired: true };
    }

    if (row?.revision_status === 'pending' || row?.revisionStatus === 'pending') {
        return { text: 'Negotiating', statusKey: 'negotiating', isExpired: false };
    }

    if (raw === 'pending') return { text: 'Pending Review', statusKey: 'pending', isExpired: false };
    if (raw === 'negotiating' || raw.includes('counter')) return { text: 'Negotiating', statusKey: 'negotiating', isExpired: false };
    if (raw === 'accepted' || raw === 'won' || raw === 'completed' || raw === 'booked' || raw === 'paid') return { text: 'Accepted', statusKey: 'accepted', isExpired: false };
    if (raw === 'rejected' || raw === 'declined') return { text: 'Rejected', statusKey: 'rejected', isExpired: false };
    if (raw === 'cancelled') return { text: 'Cancelled', statusKey: 'cancelled', isExpired: false };

    const statusStr = typeof row?.status === 'string' ? row.status : (typeof row === 'string' ? row : 'Pending');
    const capitalized = statusStr.charAt(0).toUpperCase() + statusStr.slice(1);
    return { text: capitalized, statusKey: raw, isExpired: false };
};

export const QuotesReceivedStatusCell: React.FC<{ row?: any; status?: string }> = ({ row, status }) => {
    const { text, statusKey } = getQuoteStatusInfo(row || status || {});
    const s = statusKey.toLowerCase();
    const isCompleted = s === 'accepted' || s === 'won' || s === 'completed' || s === 'booked' || s === 'paid';
    const isInProgress = s === 'negotiating' || s === 'active' || s.includes('counter');
    const isProcessing = s === 'pending' || s === 'pending review';
    const isCancelled = s === 'expired' || s === 'rejected' || s === 'cancelled' || s === 'declined';

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
            <span className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-[4px] font-bold whitespace-nowrap border ${badgeStyle}`}>
                {text}
            </span>
        </div>
    );
};

export const QuotesReceivedStatusBadgeCell = QuotesReceivedStatusCell;

export const QuotesReceivedDateCell: React.FC<{ row?: any; date?: any }> = ({ row, date }) => {
    const dateVal = row?.created_at || row?.request_date || row?.requestDate || row?.date || row?.received_at || row?.quote_request?.created_at || date;
    return (
        <div className="flex items-center justify-center min-h-[26px]">
            <span className="whitespace-nowrap text-[12.5px] text-slate-700 dark:text-slate-300 font-semibold leading-none">
                {formatDisplayDate(dateVal)}
            </span>
        </div>
    );
};
