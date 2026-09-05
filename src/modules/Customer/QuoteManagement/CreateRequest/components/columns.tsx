import React from 'react';
import { Column } from '@/components/tables/data-table';
import Skeleton from '@/components/ui/skeleton';
import { CustomerQuoteRequestItem } from '../types';
import { 
    RequestIdCell, TitleCell, AddressCell, DistanceCell, 
    BudgetCell, QuotesCountCell, PriorityBadgeCell, 
    StatusBadgeCell, DateCell 
} from './CreateRequestCells';

export const getCustomerColumns = (navigate: (path: string) => void): Column<CustomerQuoteRequestItem>[] => [
    { 
        id: 'id', 
        label: 'Request ID', 
        className: 'w-[95px] min-w-[95px]',
        sortable: true,
        render: (row) => <RequestIdCell row={row} onNavigate={navigate} />,
        skeleton: () => (
            <div className="flex items-center min-h-[26px]">
                <Skeleton className="h-4 w-16 rounded-[3px] !bg-orange-100/70 dark:!bg-orange-950/40" />
            </div>
        )
    },
    {
        id: 'title',
        label: 'Title',
        className: 'min-w-[140px] max-w-[200px]',
        sortable: true,
        render: (row) => <TitleCell row={row} />,
        skeleton: () => (
            <div className="flex items-center min-w-0 pr-1 min-h-[26px]">
                <Skeleton className="h-3.5 w-28 max-w-full rounded-[3px]" />
            </div>
        )
    },
    { 
        id: 'pickup', 
        label: 'Pickup Address', 
        className: 'min-w-0',
        render: (row) => <AddressCell address={row.pickup} />,
        skeleton: () => (
            <div className="flex items-center min-w-0 pr-1 min-h-[26px]">
                <Skeleton className="h-3.5 w-32 max-w-full rounded-[3px]" />
            </div>
        )
    },
    { 
        id: 'delivery', 
        label: 'Delivery Address', 
        className: 'min-w-0',
        render: (row) => <AddressCell address={row.delivery} />,
        skeleton: () => (
            <div className="flex items-center min-w-0 pr-1 min-h-[26px]">
                <Skeleton className="h-3.5 w-32 max-w-full rounded-[3px]" />
            </div>
        )
    },
    { 
        id: 'distance', 
        label: 'Distance', 
        className: 'w-[75px] text-center',
        sortable: true,
        render: (row) => <DistanceCell distance={row.distance} />,
        skeleton: () => (
            <div className="flex items-center justify-center min-h-[26px]">
                <Skeleton className="h-3.5 w-12 rounded-[3px]" />
            </div>
        )
    },
    { 
        id: 'budget', 
        label: 'Budget', 
        className: 'w-[90px]',
        sortable: true,
        render: (row) => <BudgetCell budget={row.budget} />,
        skeleton: () => (
            <div className="flex items-center min-h-[26px]">
                <Skeleton className="h-4 w-16 rounded-[3px] !bg-emerald-100/70 dark:!bg-emerald-950/40" />
            </div>
        )
    },
    { 
        id: 'quotesReceived', 
        label: 'Quotes', 
        className: 'w-[75px] text-center',
        sortable: true,
        render: (row) => <QuotesCountCell count={row.quotesReceived} />,
        skeleton: () => (
            <div className="flex items-center justify-center min-h-[26px]">
                <Skeleton className="h-4 w-14 rounded-[3px]" />
            </div>
        )
    },
    { 
        id: 'priority', 
        label: 'Priority', 
        className: 'w-[80px] text-center',
        sortable: true,
        render: (row) => <PriorityBadgeCell priority={row.priority} />,
        skeleton: () => (
            <div className="flex items-center justify-center min-h-[26px]">
                <Skeleton className="h-5 w-14 rounded-[3px] !bg-amber-100/70 dark:!bg-amber-950/50" />
            </div>
        )
    },
    { 
        id: 'status', 
        label: 'Status', 
        className: 'w-[105px] text-center',
        sortable: true,
        render: (row) => <StatusBadgeCell status={row.status} />,
        skeleton: () => (
            <div className="flex items-center justify-center min-h-[26px]">
                <Skeleton className="h-5 w-18 rounded-[3px] !bg-emerald-100/70 dark:!bg-emerald-950/50" />
            </div>
        )
    },
    { 
        id: 'date', 
        label: 'Date', 
        className: 'w-[110px] text-center',
        sortable: true,
        render: (row) => <DateCell row={row} />,
        skeleton: () => (
            <div className="flex items-center justify-center min-h-[26px]">
                <Skeleton className="h-3.5 w-16 rounded-[3px]" />
            </div>
        )
    }
];
