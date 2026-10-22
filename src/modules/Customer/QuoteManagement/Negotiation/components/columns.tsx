import React from 'react';
import { Column } from '@/components/tables/data-table';
import Skeleton from '@/components/ui/skeleton';
import { CustomerNegotiationItem } from '../types';
import {
    NegotiationQuoteIdCell,
    NegotiationRouteCell,
    SupplierCell,
    NegotiationVehicleCell,
    NegotiationBudgetCell,
    StatusCell,
    NegotiationDateCell,
} from './NegotiationCells';

export const getNegotiationColumns = (navigate: (path: string) => void): Column<CustomerNegotiationItem>[] => [
    {
        id: 'id',
        label: 'Quote ID',
        sortable: true,
        className: 'whitespace-nowrap',
        render: (row) => <NegotiationQuoteIdCell row={row} onNavigate={navigate} />,
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
        className: 'w-[32%] min-w-[210px]',
        render: (row) => <NegotiationRouteCell row={row} />,
        skeleton: () => (
            <div className="flex flex-col gap-1 min-w-0 pr-1 min-h-[22px]">
                <Skeleton className="h-3.5 w-40 max-w-full rounded-[3px]" />
                <Skeleton className="h-2.5 w-20 rounded-[2px]" />
            </div>
        )
    },
    {
        id: 'customer',
        label: 'Supplier',
        sortable: true,
        className: 'w-[18%] min-w-[130px]',
        render: (row) => <SupplierCell row={row} />,
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
        className: 'w-[14%] min-w-[120px]',
        render: (row) => <NegotiationVehicleCell vehicle={row.vehicleType || 'Covered Van (20ft)'} />,
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
        className: 'whitespace-nowrap',
        render: (row) => <NegotiationBudgetCell budget={row.budget} row={row} />,
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
        className: 'text-center whitespace-nowrap',
        render: (row) => <StatusCell status={row.status} row={row} />,
        skeleton: () => (
            <div className="flex items-center justify-center min-h-[22px]">
                <Skeleton className="h-5 w-18 rounded-[3px] !bg-emerald-100/70 dark:!bg-emerald-950/50" />
            </div>
        )
    },
    {
        id: 'date',
        label: 'Date',
        sortable: true,
        className: 'text-center whitespace-nowrap',
        render: (row) => <NegotiationDateCell row={row} />,
        skeleton: () => (
            <div className="flex items-center justify-center min-h-[22px]">
                <Skeleton className="h-4 w-16 rounded-[2px]" />
            </div>
        )
    }
];

export const getCustomerNegotiationColumns = getNegotiationColumns;
