import React from 'react';
import { Column } from '@/components/tables/data-table';
import Skeleton from '@/components/ui/skeleton';
import { formatDisplayDate } from '@/lib/utils';
import { QuoteRequest } from '../../data/quoteRequestsData';
import {
    SupplierRequestIdCell,
    SupplierCustomerCell,
    SupplierRouteCell,
    SupplierBudgetCell,
    SupplierStatusBadgeCell,
} from './SupplierQuoteRequestCells';

export const getSupplierColumns = (navigate: (path: string) => void): Column<QuoteRequest>[] => [
    {
        id: 'id',
        label: 'Request ID',
        className: 'w-[110px] whitespace-nowrap',
        sortable: true,
        render: (row) => {
            const rawDate = row.requestDate || row.pickupDate || (row as any).date || (row as any).created_at;
            return (
                <div className="flex flex-col justify-center min-h-[26px]">
                    <SupplierRequestIdCell row={row} onNavigate={navigate} />
                    {rawDate && (
                        <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 mt-1 leading-none whitespace-nowrap">
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
        )
    },
    {
        id: 'customer',
        label: 'Customer',
        className: 'w-[24%] min-w-[180px]',
        sortable: true,
        render: (row) => <SupplierCustomerCell row={row} />,
        skeleton: () => (
            <div className="flex items-center gap-2 min-h-[22px]">
                <Skeleton className="w-5 h-5 rounded-full shrink-0" />
                <Skeleton className="h-3.5 w-24 rounded-[3px]" />
            </div>
        )
    },
    {
        id: 'route',
        label: 'Route',
        className: 'w-[42%] min-w-[320px]',
        render: (row) => <SupplierRouteCell row={row} />,
        skeleton: () => (
            <div className="flex flex-col gap-1 min-w-0 pr-1 min-h-[22px]">
                <Skeleton className="h-3.5 w-40 max-w-full rounded-[3px]" />
                <Skeleton className="h-2.5 w-20 rounded-[2px]" />
            </div>
        )
    },
    {
        id: 'budget',
        label: 'Budget',
        className: 'w-[125px] whitespace-nowrap',
        sortable: true,
        render: (row) => <SupplierBudgetCell budget={row.budget} />,
        skeleton: () => (
            <div className="flex items-center min-h-[22px]">
                <Skeleton className="h-4 w-20 rounded-[3px] !bg-emerald-100/70 dark:!bg-emerald-950/40" />
            </div>
        )
    },
    {
        id: 'status',
        label: 'Status',
        className: 'w-[115px] text-center whitespace-nowrap',
        sortable: true,
        render: (row) => <SupplierStatusBadgeCell status={row.status} />,
        skeleton: () => (
            <div className="flex items-center justify-center min-h-[22px]">
                <Skeleton className="h-5 w-18 rounded-[3px] !bg-emerald-100/70 dark:!bg-emerald-950/50" />
            </div>
        )
    }
];

