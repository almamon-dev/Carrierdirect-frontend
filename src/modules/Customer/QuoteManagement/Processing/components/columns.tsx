import React from 'react';
import { Column } from '@/components/tables/data-table';
import Badge from '@/components/ui/badge';
import Skeleton from '@/components/ui/skeleton';
import { buildSecureQuoteUrl } from '@/utils/urlSecurity';
import { formatDisplayDate } from '@/lib/utils';
import { getStatusBadgeClass } from '@/modules/Supplier/QuoteManagement/utils/statusStyles';

export const getProcessingColumns = (navigate: (path: string) => void): Column<any>[] => [
    {
        id: 'id',
        label: 'Request ID',
        sortable: true,
        className: 'w-[100px]',
        render: (row) => (
            <div className="flex items-center min-h-[26px]">
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        navigate(buildSecureQuoteUrl(row.rawId || row.id, 'view'));
                    }}
                    className="text-[#ff4a1f] font-bold hover:underline whitespace-nowrap cursor-pointer text-xs text-left"
                >
                    {row.requestId}
                </button>
            </div>
        ),
        skeleton: () => <div className="flex items-center min-h-[26px]"><Skeleton className="h-4 w-16 rounded-[3px] !bg-orange-100/70 dark:!bg-orange-950/40" /></div>
    },
    {
        id: 'pickup',
        label: 'Pickup Address',
        className: 'min-w-0',
        render: (row) => (
            <div className="flex items-center min-w-0 pr-1 min-h-[26px]" title={row.pickup}>
                <span className="font-medium text-slate-800 dark:text-slate-200 text-xs truncate whitespace-nowrap">{row.pickup}</span>
            </div>
        ),
        skeleton: () => <div className="flex items-center min-w-0 pr-1 min-h-[26px]"><Skeleton className="h-3.5 w-32 max-w-full rounded-[3px]" /></div>
    },
    {
        id: 'delivery',
        label: 'Delivery Address',
        className: 'min-w-0',
        render: (row) => (
            <div className="flex items-center min-w-0 pr-1 min-h-[26px]" title={row.delivery}>
                <span className="font-medium text-slate-800 dark:text-slate-200 text-xs truncate whitespace-nowrap">{row.delivery}</span>
            </div>
        ),
        skeleton: () => <div className="flex items-center min-w-0 pr-1 min-h-[26px]"><Skeleton className="h-3.5 w-32 max-w-full rounded-[3px]" /></div>
    },
    {
        id: 'vehicle',
        label: 'Vehicle Type',
        sortable: true,
        className: 'w-[130px]',
        render: (row) => (
            <div className="flex items-center min-h-[26px]">
                <span className="text-xs text-slate-800 dark:text-slate-200 font-medium truncate max-w-[125px]" title={row.vehicleType}>{row.vehicleType}</span>
            </div>
        ),
        skeleton: () => <div className="flex items-center min-h-[26px]"><Skeleton className="h-3.5 w-24 rounded-[3px]" /></div>
    },
    {
        id: 'priority',
        label: 'Priority',
        sortable: true,
        className: 'w-[90px] text-center',
        render: (row) => (
            <div className="flex items-center justify-center min-h-[26px]">
                <Badge variant="secondary" className={`whitespace-nowrap text-[10.5px] font-semibold border ${
                    row.priority === 'High' ? 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60' : 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
                }`}>{row.priority}</Badge>
            </div>
        ),
        skeleton: () => <div className="flex items-center justify-center min-h-[26px]"><Skeleton className="h-5 w-14 rounded-[3px]" /></div>
    },
    {
        id: 'bids',
        label: 'Bids / Quotes',
        sortable: true,
        className: 'w-[110px] text-center',
        render: (row) => (
            <div className="flex items-center justify-center min-h-[26px]">
                {row.bidsCount > 0 ? (
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/customer/quotes/received?requestId=${row.rawId || row.id}`);
                        }}
                        className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 transition-colors cursor-pointer"
                    >
                        {row.bidsCount} Quote{row.bidsCount > 1 ? 's' : ''}
                    </button>
                ) : (
                    <span className="text-xs text-slate-400 font-medium">Awaiting Bids</span>
                )}
            </div>
        ),
        skeleton: () => <div className="flex items-center justify-center min-h-[26px]"><Skeleton className="h-5 w-16 rounded-[3px]" /></div>
    },
    {
        id: 'status',
        label: 'Status',
        sortable: true,
        className: 'w-[105px] text-center',
        render: (row) => (
            <div className="flex items-center justify-center min-h-[26px]">
                <Badge variant="secondary" className={`whitespace-nowrap text-[10.5px] font-semibold border ${getStatusBadgeClass(row.rawStatus || 'active')}`}>
                    {row.status || 'Active'}
                </Badge>
            </div>
        ),
        skeleton: () => <div className="flex items-center justify-center min-h-[26px]"><Skeleton className="h-5 w-18 rounded-[3px]" /></div>
    },
    {
        id: 'date',
        label: 'Date',
        sortable: true,
        className: 'w-[105px] text-center',
        render: (row) => (
            <div className="flex items-center justify-center min-h-[26px]">
                <span className="whitespace-nowrap text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {formatDisplayDate(row.createdAt)}
                </span>
            </div>
        ),
        skeleton: () => <div className="flex items-center justify-center min-h-[26px]"><Skeleton className="h-3.5 w-16 rounded-[3px]" /></div>
    }
];
