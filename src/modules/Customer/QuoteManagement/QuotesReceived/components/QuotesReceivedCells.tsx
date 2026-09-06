import React from 'react';
import Badge from '@/components/ui/badge';
import { getStatusBadgeClass } from '@/modules/Supplier/QuoteManagement/utils/statusStyles';

export const QuotesReceivedSupplierCell: React.FC<{ row: any }> = ({ row }) => {
    const name = row.supplier_name || row.supplier?.company_name || row.supplier?.name || row.carrier_name || 'Supplier';
    const avatar = row.supplier?.profile_picture || row.supplier_avatar;
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
            <span className="font-semibold text-slate-900 dark:text-slate-100 text-xs truncate max-w-[110px]">{name}</span>
        </div>
    );
};

export const QuotesReceivedAmountCell: React.FC<{ row: any }> = ({ row }) => {
    let formattedAmt = '—';
    const raw = row.amount_raw ?? row.amount ?? row.offer_amount ?? row.quote_amount;
    if (typeof raw === 'number') {
        formattedAmt = `€ ${raw.toLocaleString('de-DE')}`;
    } else if (typeof raw === 'string' && raw) {
        const cleanStr = raw.replace(/^€\s*|^EUR\s*|^\$\s*|^USD\s*/i, '').trim();
        const numVal = parseFloat(cleanStr.replace(/\./g, '').replace(/,/g, '.'));
        formattedAmt = !isNaN(numVal) ? `€ ${numVal.toLocaleString('de-DE')}` : `€ ${cleanStr}`;
    }
    return (
        <div className="flex items-center min-h-[26px]">
            <span className="whitespace-nowrap font-bold text-emerald-600 dark:text-emerald-400 text-xs">{formattedAmt}</span>
        </div>
    );
};

export const getQuoteStatusInfo = (row: any): { text: string; statusKey: string; isExpired: boolean } => {
    const raw = (row?.status_raw || row?.status || 'pending').toLowerCase().trim();

    // Check if validity / expiration date has passed
    const expiryField = row?.valid_until || row?.expires_at || row?.expiry_date || row?.validity_date || row?.validity || row?.quote_request?.expires_at;
    let isDateExpired = false;
    if (expiryField) {
        const expiryTime = new Date(expiryField).getTime();
        if (!isNaN(expiryTime) && expiryTime < Date.now()) {
            isDateExpired = true;
        }
    }

    // Check if reject reason or notes explicitly mention expired/validity
    const reason = String(row?.reject_reason || row?.rejection_reason || row?.notes || '').toLowerCase();
    const reasonIndicatesExpiry = reason.includes('expired') || reason.includes('expiry') || reason.includes('validity') || reason.includes('time out') || reason.includes('timeout');

    // If status is explicitly expired OR date passed (when not accepted/completed) OR reason indicates expiry
    if (raw === 'expired' || ((raw === 'pending' || raw === 'rejected' || raw === 'closed') && (isDateExpired || reasonIndicatesExpiry))) {
        return { text: 'Expired', statusKey: 'expired', isExpired: true };
    }

    if (row?.revision_status === 'pending') {
        return { text: 'Negotiating', statusKey: 'negotiating', isExpired: false };
    }

    if (raw === 'pending') return { text: 'Pending Review', statusKey: 'pending', isExpired: false };
    if (raw === 'negotiating') return { text: 'Negotiating', statusKey: 'negotiating', isExpired: false };
    if (raw === 'accepted' || raw === 'won' || raw === 'completed') return { text: 'Accepted', statusKey: 'accepted', isExpired: false };
    if (raw === 'rejected' || raw === 'declined') return { text: 'Rejected', statusKey: 'rejected', isExpired: false };
    if (raw === 'cancelled') return { text: 'Cancelled', statusKey: 'cancelled', isExpired: false };

    const capitalized = (row?.status || 'Pending').charAt(0).toUpperCase() + (row?.status || 'Pending').slice(1);
    return { text: capitalized, statusKey: raw, isExpired: false };
};

export const QuotesReceivedStatusCell: React.FC<{ row: any }> = ({ row }) => {
    const { text, statusKey } = getQuoteStatusInfo(row);
    return (
        <div className="flex items-center min-h-[26px]">
            <Badge variant="secondary" className={`whitespace-nowrap text-[10.5px] font-semibold border ${getStatusBadgeClass(statusKey)}`}>
                {text}
            </Badge>
        </div>
    );
};
