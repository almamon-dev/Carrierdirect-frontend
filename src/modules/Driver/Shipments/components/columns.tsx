import { formatStandardAddress } from '@/utils/addressFormatter';
import React from 'react';
import { Column } from '@/components/tables/data-table';
import Badge from '@/components/ui/badge';
import { ShipmentItem } from '../../types';

import { STATUS_CATEGORY_STYLES, STATUS_BADGE_BASE_CLASS } from '@/components/common/StatusBadge';
import { ShipmentStatusBadge } from './ShipmentStatusBadge';

const getPriorityClass = (p: string) => {
    const s = (p || '').toLowerCase();
    if (s === 'urgent' || s === 'high') return `${STATUS_BADGE_BASE_CLASS} ${STATUS_CATEGORY_STYLES.action_required.className}`;
    return `${STATUS_BADGE_BASE_CLASS} ${STATUS_CATEGORY_STYLES.neutral.className}`;
};


export const getShipmentColumns = (navigate: (path: string) => void): Column<ShipmentItem>[] => [
    {
        id: 'orderNumber',
        label: 'Load ID',
        sortable: true,
        className: 'w-[145px] min-w-[140px]',
        render: (row) => (
            <div className="flex items-center h-5 min-w-0 overflow-hidden">
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/driver/shipments/${row.id}`);
                    }}
                    className="font-bold text-[#ff4a1f] hover:underline text-left whitespace-nowrap cursor-pointer text-xs leading-none truncate block max-w-full"
                    title={row.orderNumber}
                >
                    {row.orderNumber}
                </button>
            </div>
        )
    },
    {
        id: 'trackingNumber',
        label: 'Tracking #',
        sortable: true,
        className: 'w-[115px] min-w-[110px]',
        render: (row) => (
            <div className="flex items-center h-5 min-w-0 overflow-hidden">
                <span className="font-mono text-xs text-slate-600 dark:text-slate-400 leading-none whitespace-nowrap truncate block max-w-full" title={row.trackingNumber}>
                    {row.trackingNumber}
                </span>
            </div>
        )
    },
    {
        id: 'customer',
        label: 'Customer',
        sortable: true,
        className: 'w-[130px] min-w-[125px]',
        render: (row) => (
            <div className="flex items-center gap-2 min-w-0 h-5">
                <div className="w-5 h-5 min-w-[20px] min-h-[20px] rounded-full bg-orange-100 dark:bg-[#ff4a1f]/20 border border-orange-200/60 text-[#ff4a1f] flex items-center justify-center text-[10px] font-bold shrink-0 aspect-square">
                    {row.shipper.company ? row.shipper.company.charAt(0).toUpperCase() : 'C'}
                </div>
                <span className="font-semibold text-slate-900 dark:text-slate-100 text-xs truncate max-w-[100px] leading-tight" title={row.shipper.company}>
                    {row.shipper.company}
                </span>
            </div>
        )
    },
    {
        id: 'pickup',
        label: 'Pickup Address',
        className: 'w-[18%] min-w-[130px] max-w-[180px]',
        render: (row) => {
            const address = formatStandardAddress(row.shipper || row, 'pickup');
            return (
                <div className="flex items-center min-w-0 pr-1 h-5" title={address}>
                    <span className="font-medium text-slate-800 dark:text-slate-200 text-xs truncate leading-normal">
                        {address}
                    </span>
                </div>
            );
        }
    },
    {
        id: 'delivery',
        label: 'Delivery Address',
        className: 'w-[18%] min-w-[130px] max-w-[180px]',
        render: (row) => {
            const address = formatStandardAddress(row.consignee || row, 'delivery');
            return (
                <div className="flex items-center min-w-0 pr-1 h-5" title={address}>
                    <span className="font-medium text-slate-800 dark:text-slate-200 text-xs truncate leading-normal">
                        {address}
                    </span>
                </div>
            );
        }
    },
    {
        id: 'distance',
        label: 'Distance',
        sortable: true,
        className: 'w-[75px] min-w-[70px] text-center',
        render: (row) => (
            <div className="flex items-center justify-center h-5">
                <span className="whitespace-nowrap text-slate-600 dark:text-slate-400 text-xs font-semibold leading-none">
                    {row.route.distanceKm} km
                </span>
            </div>
        )
    },
    {
        id: 'cargo',
        label: 'Cargo Specs',
        sortable: true,
        className: 'w-[115px] min-w-[105px]',
        render: (row) => (
            <div className="flex items-center h-5 min-w-0" title={`${row.cargo.freightType} (${row.cargo.weightKg} kg, ${row.cargo.pallets} Plts)`}>
                <span className="whitespace-nowrap font-semibold text-slate-900 dark:text-slate-100 text-xs leading-none truncate">
                    {row.cargo.freightType}
                </span>
            </div>
        )
    },
    {
        id: 'priority',
        label: 'Priority',
        sortable: true,
        className: 'w-[85px] min-w-[80px] text-center',
        render: (row) => (
            <div className="flex items-center justify-center h-5">
                <span className={getPriorityClass(row.priority)}>
                    {row.priority}
                </span>
            </div>
        )
    },
    {
        id: 'status',
        label: 'Status',
        sortable: true,
        className: 'w-[125px] min-w-[120px] text-center',
        render: (row) => (
            <div className="flex items-center justify-center h-5">
                <ShipmentStatusBadge status={row.status} />
            </div>
        )
    },
    {
        id: 'pickupDate',
        label: 'Date',
        sortable: true,
        className: 'w-[105px] min-w-[100px] text-center',
        render: (row) => (
            <div className="flex items-center justify-center h-5">
                <span className="whitespace-nowrap text-xs text-slate-500 dark:text-slate-400 font-medium leading-none">
                    {row.shipper.pickupDate}
                </span>
            </div>
        )
    },
];
