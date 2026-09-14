import React from 'react';
import Badge from '@/components/ui/badge';
import { CustomerNegotiationItem } from '../types';
import { getStatusBadgeClass } from '@/modules/Supplier/QuoteManagement/utils/statusStyles';

export const SupplierCell: React.FC<{ row: CustomerNegotiationItem }> = ({ row }) => {
    const avatarUrl = (row.customerAvatar || row.supplierAvatar);
    const hasValidUrl = Boolean(avatarUrl && (avatarUrl.startsWith('http') || avatarUrl.startsWith('/storage') || avatarUrl.startsWith('data:') || avatarUrl.includes('.')));
    const initial = ((row.customer || row.supplier) ? (row.customer || row.supplier).charAt(0).toUpperCase() : 'S');

    return (
        <div className="flex items-center gap-2 whitespace-nowrap min-w-0 min-h-[26px]">
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
            <span className="font-semibold text-slate-900 dark:text-slate-100 text-xs truncate max-w-[105px]" title={row.customer || row.supplier}>
                {row.customer || row.supplier}
            </span>
        </div>
    );
};

export const PriorityCell: React.FC<{ priority: string }> = ({ priority }) => (
    <div className="flex items-center min-h-[26px]">
        <Badge variant="secondary" className={`whitespace-nowrap text-[10.5px] font-semibold border ${
            priority === 'Urgent' ? 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60' :
            priority === 'High' ? 'bg-orange-50 text-orange-800 border-orange-200 dark:bg-orange-950/40 dark:text-orange-300 dark:border-orange-800/60' :
            'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
        }`}>
            {priority}
        </Badge>
    </div>
);

export const StatusCell: React.FC<{ status: string }> = ({ status }) => (
    <div className="flex items-center min-h-[26px]">
        <Badge variant="secondary" className={`whitespace-nowrap text-[10.5px] font-semibold border ${getStatusBadgeClass(status)}`}>
            {status}
        </Badge>
    </div>
);
