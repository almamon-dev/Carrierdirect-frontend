import React from 'react';
import { StandardRouteCell } from '@/components/common/StandardRouteCell';
import { Column } from '@/components/tables/data-table';
import Skeleton from '@/components/ui/skeleton';
import { formatDisplayDate } from '@/lib/utils';
import {
    BudgetCell,
} from '../../CreateRequest/components/CreateRequestCells';
import {
    TrackBidIdCell,
    TrackBidSupplierCell,
    TrackBidSupplierSkeleton,
    TrackBidStatusCell
} from './TrackBidsCells';

export const getTrackBidsColumns = (
    navigate: (path: string) => void,
    quoteRequestDetails?: any
): Column<any>[] => [
    {
        id: 'id',
        label: 'Quote ID',
        sortable: true,
        className: 'w-[95px] whitespace-nowrap',
        render: (row) => {
            const rawDate = row.created_at || row.date || row.received_at || row.submitted_at || row.quote_request?.created_at;
            return (
                <div className="flex flex-col justify-center min-h-[26px]">
                    <TrackBidIdCell row={row} navigate={navigate} />
                    {rawDate && (
                        <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 mt-0.5 leading-none whitespace-nowrap">
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
        id: 'route',
        label: 'Route',
        className: 'min-w-[190px]',
        render: (row) => {
            const rowWithDetails = {
                ...quoteRequestDetails,
                ...row,
                pickup_address: row.pickup_address || quoteRequestDetails?.pickup_address,
                delivery_address: row.delivery_address || quoteRequestDetails?.delivery_address,
            };
            return <StandardRouteCell row={rowWithDetails} />;
        },
        skeleton: () => (
            <div className="flex flex-col gap-1 min-w-0 pr-1 min-h-[22px]">
                <Skeleton className="h-3.5 w-40 max-w-full rounded-[4px]" />
                <Skeleton className="h-2.5 w-20 rounded-[2px]" />
            </div>
        )
    },
    {
        id: 'supplier',
        label: 'Supplier Details',
        sortable: true,
        className: 'w-[160px] min-w-[125px]',
        render: (row) => <TrackBidSupplierCell row={row} />,
        skeleton: () => <TrackBidSupplierSkeleton />
    },
    {
        id: 'vehicle',
        label: 'Vehicle Type',
        sortable: true,
        className: 'w-[125px] min-w-[105px]',
        render: (row) => {
            const vehicle = row.vehicle || row.vehicle_type || row.truck_type || quoteRequestDetails?.vehicle_type || 'Covered Van (20ft)';
            return (
                <div className="flex items-center min-h-[26px]" title={vehicle}>
                    <span className="text-[12.5px] text-slate-800 dark:text-slate-200 font-semibold whitespace-nowrap">
                        {vehicle}
                    </span>
                </div>
            );
        },
        skeleton: () => (
            <div className="flex items-center min-h-[22px]">
                <Skeleton className="h-3.5 w-20 rounded-[4px]" />
            </div>
        )
    },
    {
        id: 'amount',
        label: 'Quote Amount',
        sortable: true,
        className: 'w-[115px] whitespace-nowrap',
        render: (row) => {
            const rawVal = row.amount_raw ?? row.amount ?? row.offer_amount ?? row.quote_amount;
            return <BudgetCell budget={rawVal} />;
        },
        skeleton: () => (
            <div className="flex items-center min-h-[22px]">
                <Skeleton className="h-4 w-20 rounded-[4px] !bg-emerald-100/70 dark:!bg-emerald-950/40" />
            </div>
        )
    },
    {
        id: 'status',
        label: 'Status',
        sortable: true,
        className: 'w-[110px] text-center whitespace-nowrap',
        render: (row) => <TrackBidStatusCell row={row} />,
        skeleton: () => (
            <div className="flex items-center justify-center min-h-[22px]">
                <Skeleton className="h-5 w-20 rounded-[4px] !bg-blue-100/70 dark:!bg-blue-950/50" />
            </div>
        )
    }
];

export { resolveTrackBidStatus } from './TrackBidsCells';
