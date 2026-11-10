import { formatStandardAddress } from '@/utils/addressFormatter';
import React from 'react';
import { Column } from '@/components/tables/data-table';
import { StatusBadge } from '@/components/common/StatusBadge';
import { SupplierOrderItem } from '../types';
import { formatDisplayDate } from '@/lib/utils';
import { StandardRouteCell } from '@/components/common/StandardRouteCell';
import Skeleton from '@/components/ui/skeleton';
import {
    renderPaymentStatusBadge,
    renderPodBadge,
    renderOrderStatusBadge,
} from './orderColumnRenderers';

export const getOrderColumns = (
    navigate: (path: string) => void
): Column<SupplierOrderItem>[] => [
    {
        id: 'order_id',
        label: 'Order ID',
        sortable: true,
        className: 'w-[115px] whitespace-nowrap',
        render: (row) => {
            const rawId = row.order_no || row.order_number || row.id;
            const cleanNum = String(row.id || '').replace(/^ORD-0*/i, '');
            const idText = String(rawId).startsWith('ORD-') ? String(rawId) : `ORD-${String(cleanNum || rawId).padStart(4, '0')}`;
            const targetSlug = row.slug || String(row.id);
            const rawDate = row.pickup_date || row.created_at || row.date || row.order_date;

            return (
                <div className="flex flex-col justify-center min-h-[26px]">
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/supplier/orders/details/${targetSlug}`);
                        }}
                        className="font-bold text-slate-900 dark:text-slate-100 hover:text-[#ff4a1f] dark:hover:text-[#ff4a1f] text-left whitespace-nowrap cursor-pointer text-[12.5px] tracking-tight transition-colors leading-none"
                    >
                        {idText}
                    </button>
                    {rawDate && (
                        <span className="text-[10.5px] font-medium text-slate-400 dark:text-slate-500 mt-0.5 leading-none whitespace-nowrap">
                            {formatDisplayDate(rawDate)}
                        </span>
                    )}
                </div>
            );
        },
        skeleton: () => (
            <div className="flex flex-col gap-1 min-h-[22px]">
                <Skeleton className="h-4 w-16 rounded-[3px] !bg-orange-100/70 dark:!bg-orange-950/40" />
                <Skeleton className="h-2.5 w-12 rounded-[2px]" />
            </div>
        ),
    },
    {
        id: 'customer',
        label: 'Customer',
        sortable: true,
        className: 'w-[18%] min-w-[150px]',
        render: (row) => {
            const name = row.customer_name || row.customer?.name || row.customer?.company_name || row.client?.name || 'Customer';
            const initial = name ? name.charAt(0).toUpperCase() : 'C';
            return (
                <div className="flex items-center gap-2 min-w-0 pr-1 min-h-[26px]" title={name}>
                    <div className="w-5 h-5 min-w-[20px] min-h-[20px] rounded-full bg-orange-100 dark:bg-[#ff4a1f]/20 border border-orange-200/60 text-[#ff4a1f] flex items-center justify-center text-[10px] font-bold shrink-0 aspect-square">
                        {initial}
                    </div>
                    <span className="font-semibold text-slate-900 dark:text-slate-100 text-[12px] truncate block max-w-full leading-normal">
                        {name}
                    </span>
                </div>
            );
        },
        skeleton: () => (
            <div className="flex items-center gap-2 min-h-[22px]">
                <Skeleton className="w-5 h-5 rounded-full shrink-0" />
                <Skeleton className="h-3.5 w-24 rounded-[3px]" />
            </div>
        ),
    },
    {
        id: 'route',
        label: 'Route',
        className: 'w-[32%] min-w-[280px]',
        render: (row) => <StandardRouteCell row={row} />,
        skeleton: () => (
            <div className="flex flex-col gap-1 min-w-0 pr-1 min-h-[22px]">
                <Skeleton className="h-3.5 w-40 max-w-full rounded-[3px]" />
                <Skeleton className="h-2.5 w-20 rounded-[2px]" />
            </div>
        ),
    },
    {
        id: 'driver',
        label: 'Driver',
        sortable: true,
        className: 'w-[150px] min-w-[140px]',
        render: (row) => {
            const dName = row.driver_name && row.driver_name !== '-' ? row.driver_name : (row.driver && row.driver !== '-' ? row.driver : '');
            const hasRealDriver = Boolean(
                dName &&
                !dName.toLowerCase().includes('assigned carrier') &&
                !dName.toLowerCase().includes('assigned driver') &&
                !dName.toLowerCase().includes('unassigned') &&
                !dName.toLowerCase().includes('pending')
            );

            if (hasRealDriver) {
                return (
                    <div className="flex items-center gap-2 min-h-[26px] min-w-0" title={dName}>
                        <div className="w-5 h-5 min-w-[20px] min-h-[20px] rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800 flex items-center justify-center text-[10px] font-bold shrink-0 aspect-square shadow-2xs">
                            {dName.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-semibold text-slate-900 dark:text-slate-100 text-[12px] truncate block max-w-[110px] leading-normal">
                            {dName}
                        </span>
                    </div>
                );
            }

            return (
                <div className="flex items-center min-h-[26px]">
                    <StatusBadge status="Unassigned" category="pending" />
                </div>
            );
        },
        skeleton: () => (
            <div className="flex items-center gap-2 min-h-[22px]">
                <Skeleton className="w-5 h-5 rounded-full shrink-0" />
                <Skeleton className="h-3.5 w-20 rounded-[3px]" />
            </div>
        ),
    },
    {
        id: 'status',
        label: 'Status',
        sortable: true,
        className: 'w-[115px] min-w-[110px] text-center whitespace-nowrap',
        render: (row) => (
            <div className="flex items-center justify-center min-h-[26px]">
                {renderOrderStatusBadge(row)}
            </div>
        ),
        skeleton: () => (
            <div className="flex items-center justify-center min-h-[22px]">
                <Skeleton className="h-5 w-18 rounded-[3px]" />
            </div>
        ),
    },
    {
        id: 'payment_status',
        label: 'Payment Terms',
        sortable: true,
        className: 'w-[125px] min-w-[120px] text-center whitespace-nowrap',
        render: (row) => (
            <div className="flex items-center justify-center min-h-[26px]">
                {renderPaymentStatusBadge(row)}
            </div>
        ),
        skeleton: () => (
            <div className="flex items-center justify-center min-h-[22px]">
                <Skeleton className="h-5 w-18 rounded-[3px]" />
            </div>
        ),
    },
    {
        id: 'pod',
        label: 'POD Status',
        sortable: true,
        className: 'w-[110px] min-w-[105px] text-center whitespace-nowrap',
        render: (row) => (
            <div className="flex items-center justify-center min-h-[26px]">
                {renderPodBadge(row)}
            </div>
        ),
        skeleton: () => (
            <div className="flex items-center justify-center min-h-[22px]">
                <Skeleton className="h-5 w-18 rounded-[3px]" />
            </div>
        ),
    },
    {
        id: 'payout',
        label: 'Net Payout',
        sortable: true,
        className: 'w-[125px] whitespace-nowrap text-right pr-2',
        render: (row) => {
            const raw = row.amount_raw ?? row.amount ?? row.total_amount ?? row.net_payout ?? (row as any).payment?.payout_amount ?? (row as any).payment?.total;
            let formattedAmt = '—';
            let num = 0;
            if (typeof raw === 'number') {
                num = raw;
                formattedAmt = `€${raw.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
            } else if (typeof raw === 'string' && raw) {
                num = parseFloat(raw.replace(/[^0-9.]/g, ''));
                formattedAmt = isNaN(num) || num === 0 ? raw : `€${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
            }

            return (
                <div className="flex items-center justify-end min-h-[26px]">
                    <span className="font-bold text-slate-900 dark:text-white whitespace-nowrap text-[12.5px]">
                        {formattedAmt}{' '}
                        <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                            EUR
                        </span>
                    </span>
                </div>
            );
        },
        skeleton: () => (
            <div className="flex items-center justify-end min-h-[22px]">
                <Skeleton className="h-4 w-20 rounded-[3px] !bg-emerald-100/70 dark:!bg-emerald-950/40" />
            </div>
        ),
    },
    // Optional standalone columns for user column view customization
    {
        id: 'pickup',
        label: 'Pickup Address',
        defaultHidden: true,
        className: 'min-w-[160px] max-w-[220px]',
        render: (row) => {
            const address = formatStandardAddress(row, 'pickup');
            return (
                <div className="flex items-center min-h-[26px] truncate" title={address}>
                    <span className="font-medium text-slate-800 dark:text-slate-200 text-[13px] truncate">
                        {address}
                    </span>
                </div>
            );
        },
    },
    {
        id: 'delivery',
        label: 'Delivery Address',
        defaultHidden: true,
        className: 'min-w-[160px] max-w-[220px]',
        render: (row) => {
            const address = formatStandardAddress(row, 'delivery');
            return (
                <div className="flex items-center min-h-[26px] truncate" title={address}>
                    <span className="font-medium text-slate-800 dark:text-slate-200 text-[13px] truncate">
                        {address}
                    </span>
                </div>
            );
        },
    },
    {
        id: 'date',
        label: 'Schedule Date',
        defaultHidden: true,
        className: 'w-[110px] text-center',
        render: (row) => (
            <div className="flex items-center justify-center min-h-[26px]">
                <span className="whitespace-nowrap text-[13px] text-slate-600 dark:text-slate-400 font-medium">
                    {formatDisplayDate(row.pickup_date || row.created_at || row.date || row.order_date)}
                </span>
            </div>
        ),
    },
];

export default getOrderColumns;
