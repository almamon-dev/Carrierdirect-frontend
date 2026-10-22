import React from 'react';
import { Column } from '@/components/tables/data-table';
import Skeleton from '@/components/ui/skeleton';
import { NegotiationItem } from '../types';
import {
    SupplierNegotiationQuoteIdCell,
    SupplierNegotiationRouteCell,
    SupplierNegotiationCustomerCell,
    SupplierNegotiationVehicleCell,
    SupplierNegotiationBudgetCell,
    SupplierNegotiationStatusBadgeCell,
} from './SupplierNegotiationCells';

export const getNegotiationColumns = (navigate: (path: string) => void): Column<NegotiationItem>[] => [
    {
        id: 'id',
        label: 'Quote ID',
        sortable: true,
        className: 'w-[110px] whitespace-nowrap',
        render: (row) => {
            const rawReq = row.requestId ? String(row.requestId).replace('REQ-', '').trim() : '';
            const reqText = row.requestId || (rawReq ? `REQ-${String(rawReq).padStart(4, '0')}` : null);
            return (
                <div className="flex flex-col justify-center min-h-[26px]">
                    <SupplierNegotiationQuoteIdCell row={row} onNavigate={navigate} />
                    {reqText && (
                        <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 mt-1 leading-none whitespace-nowrap">
                            {reqText}
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
        )
    },
    {
        id: 'route',
        label: 'Route',
        className: 'w-[36%] min-w-[300px]',
        render: (row) => <SupplierNegotiationRouteCell row={row} />,
        skeleton: () => (
            <div className="flex flex-col gap-1 min-w-0 pr-1 min-h-[22px]">
                <Skeleton className="h-3.5 w-40 max-w-full rounded-[3px]" />
                <Skeleton className="h-2.5 w-20 rounded-[2px]" />
            </div>
        )
    },
    {
        id: 'customer',
        label: 'Customer',
        sortable: true,
        className: 'w-[20%] min-w-[160px]',
        render: (row) => <SupplierNegotiationCustomerCell row={row} />,
        skeleton: () => (
            <div className="flex items-center gap-2 min-h-[22px]">
                <Skeleton className="w-5 h-5 rounded-full shrink-0" />
                <Skeleton className="h-3.5 w-20 rounded-[3px]" />
            </div>
        )
    },
    {
        id: 'vehicle',
        label: 'Vehicle Type',
        sortable: true,
        className: 'w-[15%] min-w-[125px]',
        render: (row) => <SupplierNegotiationVehicleCell vehicle={row.vehicleType} />,
        skeleton: () => (
            <div className="flex items-center min-h-[22px]">
                <Skeleton className="h-3.5 w-24 rounded-[3px]" />
            </div>
        )
    },
    {
        id: 'budget',
        label: 'Quote Amount',
        sortable: true,
        className: 'w-[130px] whitespace-nowrap',
        render: (row) => <SupplierNegotiationBudgetCell budget={row.budget} row={row} />,
        skeleton: () => (
            <div className="flex items-center min-h-[22px]">
                <Skeleton className="h-4 w-20 rounded-[3px] !bg-emerald-100/70 dark:!bg-emerald-950/40" />
            </div>
        )
    },
    {
        id: 'status',
        label: 'Status',
        sortable: true,
        className: 'w-[120px] text-center whitespace-nowrap',
        render: (row) => <SupplierNegotiationStatusBadgeCell status={row.status} />,
        skeleton: () => (
            <div className="flex items-center justify-center min-h-[22px]">
                <Skeleton className="h-5 w-18 rounded-[3px] !bg-emerald-100/70 dark:!bg-emerald-950/50" />
            </div>
        )
    }
];

export const getSupplierNegotiationColumns = getNegotiationColumns;
