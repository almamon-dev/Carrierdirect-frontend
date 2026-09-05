import React from 'react';
import Badge from '@/components/ui/badge';
import { CustomerQuoteRequestItem } from '../types';
import { formatDisplayDate } from '@/lib/utils';

export const RequestIdCell: React.FC<{ row: CustomerQuoteRequestItem; onNavigate: (path: string) => void }> = ({ row, onNavigate }) => {
    const reqText = row.id ? (String(row.id).startsWith('REQ-') ? row.id : `REQ-${String(row.id).padStart(4, '0')}`) : 'REQ-0000';
    const rawId = row.rawId || String(row.id).replace('REQ-', '');
    return (
        <div className="flex items-center min-h-[26px]">
            <button
                type="button"
                onClick={() => onNavigate(`/customer/quotes/create/view/${rawId}`)}
                className="font-bold text-[#ff4a1f] hover:underline text-left whitespace-nowrap cursor-pointer text-xs flex items-center gap-1.5 leading-none"
            >
                {reqText}
            </button>
        </div>
    );
};

export const TitleCell: React.FC<{ row: CustomerQuoteRequestItem }> = ({ row }) => {
    const title = row.title || row.request_title || row.requestTitle || '—';
    return (
        <div className="flex items-center min-w-0 pr-1 min-h-[26px]" title={title}>
            <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs truncate leading-normal">
                {title}
            </span>
        </div>
    );
};

export const AddressCell: React.FC<{ address: string }> = ({ address }) => (
    <div className="flex items-center min-w-0 pr-1 min-h-[26px]" title={address}>
        <span className="font-medium text-slate-800 dark:text-slate-200 text-xs truncate leading-normal">
            {address}
        </span>
    </div>
);

export const DistanceCell: React.FC<{ distance: string }> = ({ distance }) => (
    <div className="flex items-center justify-center min-h-[26px]">
        <span className="whitespace-nowrap text-slate-600 dark:text-slate-400 text-xs font-semibold leading-none">
            {distance}
        </span>
    </div>
);

export const BudgetCell: React.FC<{ budget: string | number }> = ({ budget }) => (
    <div className="flex items-center min-h-[26px]">
        <span className="whitespace-nowrap font-bold text-slate-900 dark:text-slate-100 text-xs leading-none">
            {budget}
        </span>
    </div>
);

export const QuotesCountCell: React.FC<{ count: number }> = ({ count }) => (
    <div className="flex items-center justify-center min-h-[26px]">
        <span className={`whitespace-nowrap text-xs font-bold leading-none ${count > 0 ? 'text-[#ff4a1f]' : 'text-slate-400 dark:text-slate-500'}`}>
            {count} {count === 1 ? 'Quote' : 'Quotes'}
        </span>
    </div>
);

export const PriorityBadgeCell: React.FC<{ priority: string }> = ({ priority }) => {
    const badgeStyle = priority === 'Urgent'
        ? 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60'
        : priority === 'High'
        ? 'bg-orange-50 text-orange-800 border-orange-200 dark:bg-orange-950/40 dark:text-orange-300 dark:border-orange-800/60'
        : 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';

    return (
        <div className="flex items-center justify-center min-h-[26px]">
            <Badge variant="secondary" className={`whitespace-nowrap text-[10.5px] font-semibold border ${badgeStyle}`}>
                {priority}
            </Badge>
        </div>
    );
};

export const StatusBadgeCell: React.FC<{ status: string }> = ({ status }) => {
    const isActive = status === 'Active' || status === 'Bidding Active' || status === 'Negotiating';
    return (
        <div className="flex items-center justify-center min-h-[26px]">
            <Badge variant="secondary" className={`whitespace-nowrap text-[10.5px] font-semibold border ${
                isActive
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60'
                    : 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
            }`}>
                {status}
            </Badge>
        </div>
    );
};

export const DateCell: React.FC<{ row: CustomerQuoteRequestItem }> = ({ row }) => {
    const dateVal = row.date && row.date !== 'N/A' && row.date !== 'null'
        ? row.date
        : formatDisplayDate((row as any).created_at || (row as any).requested_date || (row as any).pickup_date || row.date);

    return (
        <div className="flex items-center justify-center min-h-[26px]">
            <span className="whitespace-nowrap text-xs text-slate-500 dark:text-slate-400 font-medium leading-none">
                {dateVal}
            </span>
        </div>
    );
};
