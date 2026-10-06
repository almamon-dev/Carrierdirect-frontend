import React from 'react';
import { Column } from '@/components/tables/data-table';
import Skeleton from '@/components/ui/skeleton';
import {
    ProcessingRequestIdCell,
    ProcessingAddressCell,
    ProcessingVehicleCell,
    ProcessingPriorityBadgeCell,
    ProcessingBidsCountCell,
    ProcessingStatusBadgeCell,
    ProcessingDateCell
} from './ProcessingCells';

export const getProcessingColumns = (navigate: (path: string) => void): Column<any>[] => [
    {
        id: 'id',
        label: 'Request ID',
        sortable: true,
        className: 'w-[95px] min-w-[90px]',
        render: (row) => <ProcessingRequestIdCell row={row} onNavigate={navigate} />,
        skeleton: () => (
            <div className="flex items-center min-h-[22px]">
                <Skeleton className="h-4 w-16 rounded-[3px] !bg-orange-100/70 dark:!bg-orange-950/40" />
            </div>
        )
    },
    {
        id: 'pickup',
        label: 'Pickup Address',
        className: 'w-[18%] min-w-[130px] max-w-[190px]',
        render: (row) => <ProcessingAddressCell address={row.pickup} />,
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
        render: (row) => <ProcessingAddressCell address={row.delivery} />,
        skeleton: () => (
            <div className="flex items-center min-w-0 pr-1 min-h-[22px]">
                <Skeleton className="h-3.5 w-32 max-w-full rounded-[3px]" />
            </div>
        )
    },
    {
        id: 'vehicle',
        label: 'Vehicle Type',
        sortable: true,
        className: 'w-[130px] min-w-[120px]',
        render: (row) => <ProcessingVehicleCell vehicleType={row.vehicleType} />,
        skeleton: () => (
            <div className="flex items-center min-h-[22px]">
                <Skeleton className="h-3.5 w-24 rounded-[3px]" />
            </div>
        )
    },
    {
        id: 'priority',
        label: 'Priority',
        sortable: true,
        className: 'w-[85px] min-w-[80px] text-center',
        render: (row) => <ProcessingPriorityBadgeCell priority={row.priority} />,
        skeleton: () => (
            <div className="flex items-center justify-center min-h-[22px]">
                <Skeleton className="h-5 w-14 rounded-[3px] !bg-amber-100/70 dark:!bg-amber-950/50" />
            </div>
        )
    },
    {
        id: 'bids',
        label: 'Bids / Quotes',
        sortable: true,
        className: 'w-[85px] min-w-[80px] text-center',
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
        className: 'w-[95px] min-w-[90px] text-center',
        render: (row) => <ProcessingStatusBadgeCell status={row.status} />,
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
        className: 'w-[105px] min-w-[100px] text-center',
        render: (row) => <ProcessingDateCell date={row.createdAt} />,
        skeleton: () => (
            <div className="flex items-center justify-center min-h-[22px]">
                <Skeleton className="h-3.5 w-16 rounded-[3px]" />
            </div>
        )
    }
];
