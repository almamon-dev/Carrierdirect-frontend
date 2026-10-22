import { formatStandardAddress } from '@/utils/addressFormatter';
import React from 'react';
import { MapPin } from 'lucide-react';
import { Column } from '@/components/tables/data-table';
import { StatusBadge } from '@/components/common/StatusBadge';
import { SupplierOrderItem } from '../types';
import { formatDisplayDate } from '@/lib/utils';
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
        className: 'w-[130px] min-w-[120px]',
        render: (row) => {
            const rawId = row.order_no || row.order_number || row.id;
            const cleanNum = String(row.id || '').replace(/^ORD-0*/i, '');
            const idText = String(rawId).startsWith('ORD-') ? String(rawId) : `ORD-${String(cleanNum || rawId).padStart(4, '0')}`;
            const targetSlug = row.slug || String(row.id);

            return (
                <div className="flex items-center h-5">
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/supplier/orders/details/${targetSlug}`);
                        }}
                        className="font-bold text-[#ff4a1f] hover:underline whitespace-nowrap text-xs text-left cursor-pointer transition-colors leading-none"
                    >
                        {idText}
                    </button>
                </div>
            );
        },
    },
    {
        id: 'customer',
        label: 'Customer',
        sortable: true,
        className: 'w-[140px] min-w-[130px]',
        render: (row) => {
            const name = row.customer_name || row.customer?.name || row.customer?.company_name || row.client?.name || 'Customer';
            const initial = name ? name.charAt(0).toUpperCase() : 'C';
            return (
                <div className="flex items-center gap-2 min-w-0 h-5" title={name}>
                    <div className="w-5 h-5 min-w-[20px] min-h-[20px] rounded-full bg-orange-100 dark:bg-[#ff4a1f]/20 border border-orange-200/60 text-[#ff4a1f] flex items-center justify-center text-[10px] font-bold shrink-0 aspect-square">
                        {initial}
                    </div>
                    <span className="font-semibold text-slate-900 dark:text-slate-100 text-xs truncate max-w-[110px] leading-tight">
                        {name}
                    </span>
                </div>
            );
        },
    },
    {
        id: 'pickup',
        label: 'Pickup Address',
        sortable: true,
        className: 'w-[18%] min-w-[140px] max-w-[220px]',
        render: (row) => {
            const address = formatStandardAddress(row, 'pickup');
            return (
                <div className="flex items-center gap-1.5 min-w-0 pr-1 h-5" title={address}>
                    <MapPin size={12} className="text-[#ff4a1f] shrink-0" />
                    <span className="font-medium text-slate-800 dark:text-slate-200 text-xs truncate leading-normal">
                        {address}
                    </span>
                </div>
            );
        },
    },
    {
        id: 'delivery',
        label: 'Delivery Address',
        sortable: true,
        className: 'w-[18%] min-w-[140px] max-w-[220px]',
        render: (row) => {
            const address = formatStandardAddress(row, 'delivery');
            return (
                <div className="flex items-center gap-1.5 min-w-0 pr-1 h-5" title={address}>
                    <MapPin size={12} className="text-emerald-500 shrink-0" />
                    <span className="font-medium text-slate-800 dark:text-slate-200 text-xs truncate leading-normal">
                        {address}
                    </span>
                </div>
            );
        },
    },
    {
        id: 'date',
        label: 'Schedule Date',
        sortable: true,
        className: 'w-[105px] min-w-[100px] text-center',
        render: (row) => (
            <div className="flex items-center justify-center h-5">
                <span className="whitespace-nowrap text-xs text-slate-500 dark:text-slate-400 font-medium leading-none">
                    {formatDisplayDate(row.pickup_date || row.created_at || row.date || row.order_date)}
                </span>
            </div>
        ),
    },
    {
        id: 'driver',
        label: 'Driver',
        sortable: true,
        className: 'w-[140px] min-w-[130px]',
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
                    <div className="flex items-center gap-1.5 h-5 min-w-0" title={dName}>
                        <div className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-[9px] font-bold shrink-0 aspect-square">
                            {dName.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-xs font-semibold text-slate-800 dark:text-slate-100 truncate max-w-[120px] leading-none">
                            {dName}
                        </span>
                    </div>
                );
            }

            return (
                <div className="flex items-center h-5">
                    <StatusBadge status="Unassigned" category="pending" />
                </div>
            );
        },
    },
    {
        id: 'status',
        label: 'Status',
        sortable: true,
        className: 'w-[110px] min-w-[105px] text-center',
        render: (row) => renderOrderStatusBadge(row),
    },
    {
        id: 'payment_status',
        label: 'Payment Terms',
        sortable: true,
        className: 'w-[130px] min-w-[125px] text-center',
        render: (row) => renderPaymentStatusBadge(row),
    },
    {
        id: 'pod',
        label: 'POD Status',
        sortable: true,
        className: 'w-[110px] min-w-[105px] text-center',
        render: (row) => renderPodBadge(row),
    },
    {
        id: 'payout',
        label: 'Net Payout',
        sortable: true,
        className: 'w-[110px] min-w-[105px] text-right pr-2',
        render: (row) => {
            let formattedAmt = '—';
            const raw = row.amount_raw ?? row.amount ?? row.total_amount ?? row.net_payout ?? (row as any).payment?.payout_amount ?? (row as any).payment?.total;
            if (typeof raw === 'number') {
                formattedAmt = `€${raw.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
            } else if (typeof raw === 'string' && raw) {
                formattedAmt = raw.startsWith('€') || raw.startsWith('EUR') || raw.startsWith('$') ? raw : `€${raw}`;
            }
            return (
                <div className="flex items-center justify-end h-5">
                    <span className="whitespace-nowrap text-xs font-bold text-emerald-600 dark:text-emerald-400 leading-none">
                        {formattedAmt}
                    </span>
                </div>
            );
        },
    },
];

export default getOrderColumns;
