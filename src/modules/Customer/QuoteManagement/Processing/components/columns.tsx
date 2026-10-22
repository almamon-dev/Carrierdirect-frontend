import React from 'react';
import { Column } from '@/components/tables/data-table';
import Skeleton from '@/components/ui/skeleton';
import {
    ProcessingRequestIdCell,
    ProcessingRouteCell,
    ProcessingVehicleCell,
    ProcessingBidsCountCell,
    ProcessingStatusBadgeCell,
} from './ProcessingCells';

export const getProcessingColumns = (navigate: (path: string) => void): Column<any>[] => [
    {
        id: 'id',
        label: 'Request ID',
        sortable: true,
        className: 'w-[115px] min-w-[110px]',
        render: (row) => <ProcessingRequestIdCell row={row} onNavigate={navigate} />,
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
        className: 'w-[240px] min-w-[210px]',
        render: (row) => <ProcessingRouteCell row={row} />,
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
        className: 'w-[140px] min-w-[125px]',
        render: (row) => <ProcessingVehicleCell vehicleType={row.vehicleType} />,
        skeleton: () => (
            <div className="flex items-center min-h-[22px]">
                <Skeleton className="h-3.5 w-24 rounded-[3px]" />
            </div>
        )
    },
    {
        id: 'bids',
        label: 'Bids / Quotes',
        sortable: true,
        className: 'w-[110px] min-w-[100px] text-center',
        render: (row) => <ProcessingBidsCountCell row={row} onNavigate={navigate} />,
        skeleton: () => (
            <div className="flex items-center justify-center min-h-[22px]">
                <Skeleton className="h-4 w-12 rounded-[3px]" />
            </div>
        )
    },
    {
        id: 'status',
        label: 'Status',
        sortable: true,
        className: 'w-[125px] min-w-[115px] text-center',
        render: (row) => <ProcessingStatusBadgeCell status={row.status} />,
        skeleton: () => (
            <div className="flex items-center justify-center min-h-[22px]">
                <Skeleton className="h-5 w-18 rounded-[3px] !bg-emerald-100/70 dark:!bg-emerald-950/50" />
            </div>
        )
    }
];
