import { StandardRouteCell } from '@/components/common/StandardRouteCell';
import { formatStandardAddress } from '@/utils/addressFormatter';
import React from 'react';
import { Plane } from 'lucide-react';
import { formatDisplayDate } from '@/lib/utils';
import { encryptId } from '@/lib/encryption';
import { QuoteRequest } from '../../data/quoteRequestsData';

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

export const SupplierAddressCell: React.FC<{ address?: string; row?: any; type?: 'pickup' | 'delivery' }> = ({ address, row, type = 'pickup' }) => {
    const displayAddr = row ? formatStandardAddress(row, type) : formatStandardAddress(address);
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
    const isActionRequired = p === 'urgent' || p === 'high';
    const category = isActionRequired ? 'action_required' : 'neutral';

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

export { SupplierStatusBadgeCell } from './SupplierStatusBadgeCell';

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

export const SupplierRouteCell: React.FC<{ row: any }> = ({ row }) => {
    return <StandardRouteCell row={row} />;
};
