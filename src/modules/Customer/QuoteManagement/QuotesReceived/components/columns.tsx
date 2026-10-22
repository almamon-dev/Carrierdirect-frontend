import React from 'react';
import { Column } from '@/components/tables/data-table';
import Skeleton from '@/components/ui/skeleton';
import {
    QuotesReceivedRequestIdCell,
    QuotesReceivedRouteCell,
    QuotesReceivedVehicleCell,
    QuotesReceivedStatusCell,
} from './QuotesReceivedCells';
import {
    GroupedQuotesCountCell,
    GroupedQuotesSuppliersCell,
    GroupedQuotesAmountCell
} from './GroupedQuotesReceivedCells';

export const getQuotesReceivedColumns = (navigate: (path: string) => void): Column<any>[] => [
    {
        id: 'requestId',
        label: 'Requested ID',
        sortable: true,
        className: 'whitespace-nowrap',
        render: (row) => <QuotesReceivedRequestIdCell row={row} onNavigate={navigate} />,
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
        className: 'w-[32%] min-w-[280px]',
        render: (row) => <QuotesReceivedRouteCell row={row} />,
        skeleton: () => (
            <div className="flex flex-col gap-1 min-w-0 pr-1 min-h-[22px]">
                <Skeleton className="h-3.5 w-40 max-w-full rounded-[3px]" />
                <Skeleton className="h-2.5 w-20 rounded-[2px]" />
            </div>
        )
    },
    {
        id: 'vehicle',
        label: 'Vehicle Type',
        sortable: true,
        className: 'w-[14%] min-w-[130px]',
        render: (row) => {
            const vehicle = row.vehicleType || row.vehicle || row.vehicle_type || row.truck_type || row.quote_request?.vehicle_type || 'Covered Van (20ft)';
            return <QuotesReceivedVehicleCell vehicle={vehicle} />;
        },
        skeleton: () => (
            <div className="flex items-center min-h-[22px]">
                <Skeleton className="h-3.5 w-24 rounded-[3px]" />
            </div>
        )
    },
    {
        id: 'quotesCount',
        label: 'Quotes Received',
        sortable: true,
        className: 'whitespace-nowrap',
        render: (row) => <GroupedQuotesCountCell row={row} onNavigate={navigate} />,
        skeleton: () => (
            <div className="flex items-center min-h-[22px]">
                <Skeleton className="h-5 w-20 rounded-[4px] !bg-orange-100/60 dark:!bg-orange-950/40" />
            </div>
        )
    },
    {
        id: 'suppliers',
        label: 'Suppliers',
        sortable: true,
        className: 'w-[16%] min-w-[145px]',
        render: (row) => <GroupedQuotesSuppliersCell row={row} />,
        skeleton: () => (
            <div className="flex items-center gap-2 min-h-[22px]">
                <Skeleton className="w-5 h-5 rounded-full shrink-0" />
                <Skeleton className="h-3.5 w-24 rounded-[3px]" />
            </div>
        )
    },
    {
        id: 'amount',
        label: 'Quote Amount',
        sortable: true,
        className: 'whitespace-nowrap',
        render: (row) => <GroupedQuotesAmountCell row={row} />,
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
        render: (row) => <QuotesReceivedStatusCell row={row} />,
        skeleton: () => (
            <div className="flex items-center justify-center min-h-[22px]">
                <Skeleton className="h-5 w-18 rounded-[3px] !bg-emerald-100/70 dark:!bg-emerald-950/50" />
            </div>
        )
    }
];
