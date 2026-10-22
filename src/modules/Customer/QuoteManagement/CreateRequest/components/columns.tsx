import React from 'react';
import { Column } from '@/components/tables/data-table';
import Skeleton from '@/components/ui/skeleton';
import { CustomerQuoteRequestItem } from '../types';
import { 
    RequestIdCell, TitleCell, RequestRouteCell, 
    BudgetCell, QuotesCountCell, StatusBadgeCell 
} from './CreateRequestCells';

export const getCustomerColumns = (navigate: (path: string) => void): Column<CustomerQuoteRequestItem>[] => [
    { 
        id: 'id', 
        label: 'Request ID', 
        className: 'w-[110px] whitespace-nowrap',
        sortable: true,
        render: (row) => <RequestIdCell row={row} onNavigate={navigate} />,
        skeleton: () => (
            <div className="flex flex-col gap-1 min-h-[22px]">
                <Skeleton className="h-4 w-16 rounded-[3px] !bg-orange-100/70 dark:!bg-orange-950/40" />
                <Skeleton className="h-2.5 w-12 rounded-[2px]" />
            </div>
        )
    },
    {
        id: 'title',
        label: 'Title',
        className: 'w-[28%] min-w-[150px]',
        sortable: true,
        render: (row) => <TitleCell row={row} />,
        skeleton: () => (
            <div className="flex items-center min-w-0 pr-1 min-h-[22px]">
                <Skeleton className="h-3.5 w-28 max-w-full rounded-[3px]" />
            </div>
        )
    },
    { 
        id: 'route', 
        label: 'Route', 
        className: 'w-[36%] min-w-[210px]',
        render: (row) => <RequestRouteCell row={row} />,
        skeleton: () => (
            <div className="flex flex-col gap-1 min-w-0 pr-1 min-h-[22px]">
                <Skeleton className="h-3.5 w-40 max-w-full rounded-[3px]" />
                <Skeleton className="h-2.5 w-20 rounded-[2px]" />
            </div>
        )
    },
    { 
        id: 'quotesReceived', 
        label: 'Quotes', 
        className: 'w-[95px] text-center whitespace-nowrap',
        sortable: true,
        render: (row) => <QuotesCountCell count={row.quotesReceived} rawId={row.rawId || row.id} onNavigate={navigate} />,
        skeleton: () => (
            <div className="flex items-center justify-center min-h-[22px]">
                <Skeleton className="h-5 w-16 rounded-[3px]" />
            </div>
        )
    },
    { 
        id: 'budget', 
        label: 'Budget', 
        className: 'w-[125px] whitespace-nowrap',
        sortable: true,
        render: (row) => <BudgetCell budget={row.budget} />,
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
        render: (row) => <StatusBadgeCell status={row.status} />,
        skeleton: () => (
            <div className="flex items-center justify-center min-h-[22px]">
                <Skeleton className="h-5 w-20 rounded-[3px] !bg-blue-100/70 dark:!bg-blue-950/50" />
            </div>
        )
    }
];
