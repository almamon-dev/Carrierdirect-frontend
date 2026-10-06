import React from 'react';
import { Column } from '@/components/tables/data-table';
import Badge from '@/components/ui/badge';
import { ShipmentItem } from '../../types';

const getPriorityClass = (p: string) => {
    if (p === 'Urgent') return 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300';
    if (p === 'High') return 'bg-orange-50 text-orange-800 border-orange-200 dark:bg-orange-950/40 dark:text-orange-300';
    return 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300';
};

const getStatusBadgeClass = (status?: string): string => {
    const s = (status || '').toLowerCase().trim();
    if (s === 'delivered' || s === 'completed') {
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60';
    }
    if (s === 'in_transit' || s === 'in transit') {
        return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/60';
    }
    if (s === 'at_pickup' || s === 'picked_up' || s === 'at_delivery') {
        return 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800/60';
    }
    if (s === 'assigned' || s === 'driver_assigned' || s === 'accepted') {
        return 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60';
    }
    if (s === 'cancelled') {
        return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/60';
    }
    return 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300';
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
        render: (row) => (
            <div className="flex items-center min-w-0 pr-1 h-5" title={row.shipper.address ? `${row.shipper.address}, ${row.shipper.city}` : row.shipper.city}>
                <span className="font-medium text-slate-800 dark:text-slate-200 text-xs truncate leading-normal">
                    {row.shipper.address ? `${row.shipper.address}, ${row.shipper.city}` : row.shipper.city}
                </span>
            </div>
        )
    },
    {
        id: 'delivery',
        label: 'Delivery Address',
        className: 'w-[18%] min-w-[130px] max-w-[180px]',
        render: (row) => (
            <div className="flex items-center min-w-0 pr-1 h-5" title={row.consignee.address ? `${row.consignee.address}, ${row.consignee.city}` : row.consignee.city}>
                <span className="font-medium text-slate-800 dark:text-slate-200 text-xs truncate leading-normal">
                    {row.consignee.address ? `${row.consignee.address}, ${row.consignee.city}` : row.consignee.city}
                </span>
            </div>
        )
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
                <Badge variant="secondary" className={`whitespace-nowrap text-[10.5px] font-semibold border ${getPriorityClass(row.priority)}`}>
                    {row.priority}
                </Badge>
            </div>
        )
    },
    {
        id: 'status',
        label: 'Status',
        sortable: true,
        className: 'w-[125px] min-w-[120px] text-center',
        render: (row) => {
            const displayLabel = row.status === 'in_transit' ? 'In Transit' :
                row.status === 'at_pickup' ? 'At Pickup' :
                row.status === 'at_delivery' ? 'At Delivery' :
                row.status === 'delivered' ? 'Delivered' : 'Assigned';

            return (
                <div className="flex items-center justify-center h-5">
                    <Badge variant="secondary" className={`whitespace-nowrap text-[10.5px] font-semibold border ${getStatusBadgeClass(row.status)}`}>
                        {displayLabel}
                    </Badge>
                </div>
            );
        }
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
