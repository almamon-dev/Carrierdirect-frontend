import React from 'react';
import { Column } from '@/components/tables/data-table';
import Skeleton from '@/components/ui/skeleton';
import { QuoteRequest } from '../../data/quoteRequestsData';
import {
    SupplierRequestIdCell,
    SupplierCustomerCell,
    SupplierAddressCell,
    SupplierDistanceCell,
    SupplierBudgetCell,
    SupplierPriorityBadgeCell,
    SupplierStatusBadgeCell,
    SupplierDateCell,
} from './SupplierQuoteRequestCells';

export const getSupplierColumns = (navigate: (path: string) => void): Column<QuoteRequest>[] => [
    {
        id: 'id',
        label: 'Request ID',
        className: 'w-[95px] min-w-[90px]',
        sortable: true,
        render: (row) => <SupplierRequestIdCell row={row} onNavigate={navigate} />,
        skeleton: () => (
            <div className="flex items-center min-h-[22px]">
                <Skeleton className="h-4 w-16 rounded-[3px] !bg-orange-100/70 dark:!bg-orange-950/40" />
            </div>
        )
    },
    {
        id: 'customer',
        label: 'Customer',
        className: 'w-[140px] min-w-[130px] max-w-[170px]',
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
        id: 'pickup',
        label: 'Pickup Address',
        className: 'w-[18%] min-w-[130px] max-w-[190px]',
        render: (row) => <SupplierAddressCell address={row.pickup} />,
        skeleton: () => (
            <div className="flex items-center min-w-0 pr-1 min-h-[22px]">
                <Skeleton className="h-3.5 w-32 max-w-full rounded-[3px]" />
            </div>
        )
    },
    {
        id: 'delivery',
        label: 'Delivery Address',
        className: 'w-[18%] min-w-[130px] max-w-[190px]',
        render: (row) => <SupplierAddressCell address={row.delivery} />,
        skeleton: () => (
            <div className="flex items-center min-w-0 pr-1 min-h-[22px]">
                <Skeleton className="h-3.5 w-32 max-w-full rounded-[3px]" />
            </div>
        )
    },
    {
        id: 'distance',
        label: 'Distance',
        className: 'w-[90px] min-w-[85px] text-center',
        sortable: true,
        render: (row) => <SupplierDistanceCell distance={row.distance} />,
        skeleton: () => (
            <div className="flex items-center justify-center min-h-[22px]">
                <Skeleton className="h-3.5 w-14 rounded-[3px]" />
            </div>
        )
    },
    {
        id: 'budget',
        label: 'Budget',
        className: 'w-[115px] min-w-[105px]',
        sortable: true,
        render: (row) => <SupplierBudgetCell budget={row.budget} />,
        skeleton: () => (
            <div className="flex items-center min-h-[22px]">
                <Skeleton className="h-4 w-20 rounded-[3px] !bg-emerald-100/70 dark:!bg-emerald-950/40" />
            </div>
        )
    },
    {
        id: 'priority',
        label: 'Priority',
        className: 'w-[85px] min-w-[80px] text-center',
        sortable: true,
        render: (row) => <SupplierPriorityBadgeCell priority={row.priority} />,
        skeleton: () => (
            <div className="flex items-center justify-center min-h-[22px]">
                <Skeleton className="h-5 w-14 rounded-[3px] !bg-amber-100/70 dark:!bg-amber-950/50" />
            </div>
        )
    },
    {
        id: 'status',
        label: 'Status',
        className: 'w-[95px] min-w-[90px] text-center',
        sortable: true,
        render: (row) => <SupplierStatusBadgeCell status={row.status} />,
        skeleton: () => (
            <div className="flex items-center justify-center min-h-[22px]">
                <Skeleton className="h-5 w-18 rounded-[3px] !bg-emerald-100/70 dark:!bg-emerald-950/50" />
            </div>
        )
    },
    {
        id: 'requestDate',
        label: 'Date',
        className: 'w-[105px] min-w-[100px] text-center',
        sortable: true,
        render: (row) => <SupplierDateCell row={row} />,
        skeleton: () => (
            <div className="flex items-center justify-center min-h-[22px]">
                <Skeleton className="h-3.5 w-16 rounded-[3px]" />
            </div>
        )
    }
];
