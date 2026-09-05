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
                    className="w-5 h-5 rounded-full object-cover shrink-0 border border-slate-200 dark:border-slate-700 shadow-2xs"
                    onError={(e) => { (e.currentTarget as HTMLElement).style.display = 'none'; }}
                />
            ) : (
                <div className="w-5 h-5 rounded-full bg-orange-100 dark:bg-[#ff4a1f]/20 border border-orange-200/60 dark:border-orange-500/20 text-[#ff4a1f] flex items-center justify-center text-[10px] font-bold shrink-0">
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

export const QuotesReceivedStatusCell: React.FC<{ row: any }> = ({ row }) => {
    const st = (row.status_raw || row.status || 'pending').toLowerCase();
    const displayStatus = row.revision_status === 'pending' ? 'Negotiating' : (row.status || 'Pending');
    return (
        <div className="flex items-center justify-center min-h-[26px]">
            <Badge variant="secondary" className={`whitespace-nowrap text-[10.5px] font-semibold border ${getStatusBadgeClass(st)}`}>
                {displayStatus}
            </Badge>
        </div>
    );
};
