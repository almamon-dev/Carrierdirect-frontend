import { formatStandardAddress } from '@/utils/addressFormatter';
import React from 'react';
import { Column } from '@/components/tables/data-table';
import { StatusBadge } from '@/components/common/StatusBadge';
import { formatDisplayDate } from '@/lib/utils';
import { StandardRouteCell } from '@/components/common/StandardRouteCell';
import Skeleton from '@/components/ui/skeleton';
import { SupplierOrder, checkHasRealDriver } from '../../data/ordersData';

export interface AssignedDriverItem {
    name: string;
    initial: string;
    driverType?: 'internal' | 'subcontractor';
    company?: string;
    legLabel?: string;
}

export const resolveRowDrivers = (row: SupplierOrder): AssignedDriverItem[] => {
    const drivers: AssignedDriverItem[] = [];

    // 1. If legs array has valid drivers
    if (Array.isArray(row.legs) && row.legs.length > 0) {
        row.legs.forEach((leg: any, idx: number) => {
            const name = String(leg?.driver_name || leg?.name || '').trim();
            if (name && name !== '-' && !name.toLowerCase().includes('unassigned') && !name.toLowerCase().includes('pending')) {
                drivers.push({
                    name,
                    initial: name.charAt(0).toUpperCase(),
                    driverType: leg?.driver_type || (leg?.subcontractor_company ? 'subcontractor' : 'internal'),
                    company: leg?.subcontractor_company,
                    legLabel: leg?.journey_leg || `Leg ${idx + 1}`,
                });
            }
        });
        if (drivers.length > 0) return drivers;
    }

    // 2. Primary Driver
    if (checkHasRealDriver(row)) {
        const primaryName = String(row.driver || row.driver_name || '').trim();
        drivers.push({
            name: primaryName,
            initial: primaryName.charAt(0).toUpperCase(),
            driverType: row.driver_type,
            company: row.subcontractor_company,
            legLabel: row.is_relay ? 'Leg 1' : undefined,
        });

        // 3. Secondary Driver for Relay
        const leg2Name = String(row.leg2_driver_name || '').trim();
        if (leg2Name && leg2Name !== '-' && !leg2Name.toLowerCase().includes('unassigned') && !leg2Name.toLowerCase().includes('pending')) {
            drivers.push({
                name: leg2Name,
                initial: leg2Name.charAt(0).toUpperCase(),
                driverType: row.leg2_driver_type,
                company: row.leg2_subcontractor_company,
                legLabel: row.leg2_journey_leg || 'Leg 2',
            });
        }
    }

    return drivers;
};

export const getActiveJobColumns = (
    navigate: (path: string) => void
): Column<SupplierOrder>[] => [
    {
        id: 'id',
        label: 'Job ID',
        sortable: true,
        className: 'w-[115px] whitespace-nowrap',
        render: (row) => {
            const rawDate = row.pickupDate || (row as any).pickup_date || (row as any).date || (row as any).created_at;
            return (
                <div className="flex flex-col justify-center min-h-[26px]">
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/supplier/orders/details/${row.slug}`);
                        }}
                        className="font-bold text-slate-900 dark:text-slate-100 hover:text-[#ff4a1f] dark:hover:text-[#ff4a1f] text-left whitespace-nowrap cursor-pointer text-[12.5px] tracking-tight transition-colors leading-none"
                    >
                        {row.id}
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
            const name = row.customer || 'Customer';
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
        id: 'assigned_drivers',
        label: 'Drivers',
        sortable: true,
        className: 'w-[165px] min-w-[150px]',
        render: (row) => {
            const drivers = resolveRowDrivers(row);
            const count = drivers.length;

            if (count === 0) {
                return (
                    <div className="flex items-center min-h-[26px]" title="No driver assigned yet">
                        <StatusBadge status="Unassigned" category="pending" />
                    </div>
                );
            }

            const tooltipText = drivers
                .map(
                    (d, i) =>
                        `${d.legLabel || `Driver ${i + 1}`}: ${d.name} (${
                            d.driverType === 'subcontractor'
                                ? d.company || 'Subcontractor'
                                : 'In-House Fleet'
                        })`
                )
                .join('\n');

            if (count === 1) {
                const d = drivers[0];
                const isSub = d.driverType === 'subcontractor';
                return (
                    <div className="flex items-center gap-2 min-h-[26px] min-w-0" title={tooltipText}>
                        <div
                            className={`w-5 h-5 min-w-[20px] min-h-[20px] rounded-full flex items-center justify-center text-[10px] font-bold border border-slate-200/80 dark:border-slate-700 shadow-2xs shrink-0 aspect-square ${
                                isSub
                                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                                    : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                            }`}
                        >
                            {d.initial}
                        </div>
                        <span className="font-semibold text-slate-900 dark:text-slate-100 text-[12px] truncate block max-w-[110px] leading-normal">
                            {d.name}
                        </span>
                        {isSub && (
                            <span className="text-[9px] font-bold px-1 py-0.5 rounded-[3px] bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400 shrink-0 leading-none">
                                Sub
                            </span>
                        )}
                    </div>
                );
            }

            // Multiple Drivers (Relay / Multi-Leg)
            return (
                <div className="flex items-center gap-1.5 min-h-[26px] min-w-0" title={tooltipText}>
                    <div className="flex items-center -space-x-1.5 overflow-visible shrink-0">
                        {drivers.slice(0, 2).map((d, idx) => (
                            <div
                                key={idx}
                                className="w-5 h-5 min-w-[20px] min-h-[20px] rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-white dark:border-[#1e2329] shadow-2xs shrink-0 bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300"
                                title={d.name}
                            >
                                {d.initial}
                            </div>
                        ))}
                    </div>
                    <span className="px-1.5 py-0.5 rounded-[3px] text-[9.5px] font-bold bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 shrink-0 leading-none">
                        Relay ({count})
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100 text-[12px] truncate block max-w-[95px] leading-normal">
                        {drivers[0]?.name}
                    </span>
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
                <StatusBadge status={row.status || 'Confirmed'} />
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
        render: (row) => {
            const isPayLater = Boolean(
                row.is_pay_later ||
                row.payment_method === 'pay_later' ||
                row.invoice_type === 'pay_later' ||
                row.payment_status?.toLowerCase().includes('pay later')
            );
            const isPaid = Boolean(
                !isPayLater && (row.is_paid || row.payment_status?.toLowerCase().includes('paid') || row.status === 'Delivered')
            );

            return (
                <div className="flex items-center justify-center min-h-[26px]">
                    {isPayLater ? (
                        <StatusBadge status="Pay Later (Due)" category="financial_hold" />
                    ) : isPaid ? (
                        <StatusBadge status="Paid" category="success" />
                    ) : (
                        <StatusBadge status="In Escrow" category="financial_hold" />
                    )}
                </div>
            );
        },
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
            const rawPayout = row.netPayout || row.agreedPrice || '';
            const rawStr = String(rawPayout).trim();
            const num = parseFloat(rawStr.replace(/[^0-9.]/g, ''));
            const formattedNum = isNaN(num) || num === 0 ? rawStr : `€${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

            return (
                <div className="flex items-center justify-end min-h-[26px]">
                    <span className="font-bold text-slate-900 dark:text-white whitespace-nowrap text-[12.5px]">
                        {formattedNum}{' '}
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
    // Optional standalone columns for user custom column view toggle
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
                    {formatDisplayDate(row.pickupDate || (row as any).pickup_date)}
                </span>
            </div>
        ),
    },
];

export default getActiveJobColumns;
