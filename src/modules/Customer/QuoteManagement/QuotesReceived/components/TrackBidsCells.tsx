import React from 'react';
import Skeleton from '@/components/ui/skeleton';
import { encryptId } from '@/lib/encryption';
import { ShieldCheck, Star } from 'lucide-react';
import { StatusBadgeCell } from '../../CreateRequest/components/CreateRequestCells';
import { getQuoteStatusInfo, QuotesReceivedStatusCell } from './quoteStatusHelpers';

interface TrackBidIdCellProps {
    row: any;
    navigate: (path: string) => void;
}

export const TrackBidIdCell: React.FC<TrackBidIdCellProps> = ({ row, navigate }) => {
    const rawId = row.rawId || row.id;
    const quoteText = row.quote_id || row.quoteId || (rawId ? (String(rawId).startsWith('QT-') ? rawId : `QT-${String(rawId).padStart(4, '0')}`) : 'QT-0000');
    return (
        <div className="flex items-center min-h-[26px]">
            <button
                type="button"
                onClick={() => navigate(`/customer/quotes/received/view/${encryptId(rawId)}`)}
                className="font-bold text-slate-900 dark:text-slate-100 hover:text-[#ff4a1f] dark:hover:text-[#ff4a1f] text-left whitespace-nowrap cursor-pointer text-[13.5px] tracking-tight transition-colors leading-none"
            >
                {quoteText}
            </button>
        </div>
    );
};

export const TrackBidIdSkeleton: React.FC = () => (
    <div className="flex items-center min-h-[22px]">
        <Skeleton className="h-4 w-16 rounded-[4px] !bg-orange-100/70 dark:!bg-orange-950/40" />
    </div>
);

export const TrackBidSupplierCell: React.FC<{ row: any }> = ({ row }) => {
    const name = row.supplier_name || row.supplier?.company_name || row.supplier?.name || row.carrier_name || 'Carrier';
    const avatar = row.supplier?.profile_picture || row.supplier_avatar || row.carrier_avatar;
    const rating = row.rating !== undefined && row.rating !== null ? Number(row.rating).toFixed(1) : (row.supplier?.rating !== undefined && row.supplier?.rating !== null ? Number(row.supplier.rating).toFixed(1) : '5.0');

    return (
        <div className="flex items-center gap-2 whitespace-nowrap min-w-0 min-h-[26px]" title={name}>
            {avatar ? (
                <img
                    src={avatar}
                    alt={name}
                    className="w-5 h-5 min-w-[20px] min-h-[20px] aspect-square rounded-[4px] object-cover shrink-0 border border-slate-200 dark:border-slate-700 shadow-2xs"
                    onError={(e) => { (e.currentTarget as HTMLElement).style.display = 'none'; }}
                />
            ) : (
                <div className="w-5 h-5 min-w-[20px] min-h-[20px] aspect-square rounded-[4px] bg-orange-100 dark:bg-[#ff4a1f]/20 border border-orange-200/60 dark:border-orange-500/20 text-[#ff4a1f] flex items-center justify-center text-[10px] font-bold shrink-0">
                    {name.charAt(0).toUpperCase()}
                </div>
            )}
            <span className="font-bold text-slate-900 dark:text-slate-100 text-[13px] " title={name}>{name}</span>
            {(row.supplier?.is_verified ?? true) && (
                <span title="Verified Carrier" className="inline-flex items-center">
                    <ShieldCheck size={13} className="text-emerald-500 shrink-0" />
                </span>
            )}
            <span className="flex items-center gap-0.5 text-[11px] font-bold text-amber-500 shrink-0">
                <Star size={10} className="fill-amber-500 text-amber-500" />
                <span>{rating}</span>
            </span>
        </div>
    );
};

export const TrackBidSupplierSkeleton: React.FC = () => (
    <div className="flex items-center gap-2 min-h-[22px]">
        <Skeleton className="w-5 h-5 rounded-[4px] shrink-0" />
        <Skeleton className="h-3.5 w-24 rounded-[4px]" />
    </div>
);

export const resolveTrackBidStatus = (row: any): string => {
    return getQuoteStatusInfo(row).text;
};

export const TrackBidStatusCell: React.FC<{ row: any }> = ({ row }) => {
    return <QuotesReceivedStatusCell row={row} />;
};
