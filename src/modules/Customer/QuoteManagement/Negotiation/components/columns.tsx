import React from 'react';
import { Column } from '@/components/tables/data-table';
import Skeleton from '@/components/ui/skeleton';
import { CustomerNegotiationItem } from '../types';
import {
    NegotiationQuoteIdCell,
    NegotiationRequestIdCell,
    SupplierCell,
    NegotiationAddressCell,
    NegotiationVehicleCell,
    NegotiationTransitCell,
    NegotiationBudgetCell,
    StatusCell,
    NegotiationDateCell
} from './NegotiationCells';

export const getNegotiationColumns = (navigate: (path: string) => void): Column<CustomerNegotiationItem>[] => [
    {
        id: 'id',
        label: 'Quote ID',
        sortable: true,
        className: 'w-[95px] min-w-[90px]',
        render: (row) => <NegotiationQuoteIdCell row={row} onNavigate={navigate} />,
        skeleton: () => (
            <div className="flex items-center min-h-[22px]">
                <Skeleton className="h-4 w-16 rounded-[3px] !bg-orange-100/70 dark:!bg-orange-950/40" />
            </div>
        )
    },
    {
        id: 'requestId',
        label: 'Requested ID',
        sortable: true,
        className: 'w-[95px] min-w-[90px]',
        render: (row) => <NegotiationRequestIdCell row={row} onNavigate={navigate} />,
        skeleton: () => (
            <div className="flex items-center min-h-[22px]">
                <Skeleton className="h-4 w-16 rounded-[3px]" />
            </div>
        )
    },
    {
        id: 'customer',
        label: 'Supplier',
        sortable: true,
        className: 'w-[130px] min-w-[125px]',
        render: (row) => <SupplierCell row={row} />,
        skeleton: () => (
            <div className="flex items-center gap-2 min-h-[22px]">
                <Skeleton className="w-5 h-5 rounded-full shrink-0" />
                <Skeleton className="h-3.5 w-20 rounded-[3px]" />
            </div>
        )
    },
    {
        id: 'pickup',
        label: 'Pickup Address',
        className: 'w-[16%] min-w-[120px] max-w-[180px]',
        render: (row) => <NegotiationAddressCell address={row.pickup} />,
        skeleton: () => (
            <div className="flex items-center min-w-0 pr-1 min-h-[22px]">
                <Skeleton className="h-3.5 w-32 max-w-full rounded-[3px]" />
            </div>
        )
    },
    {
        id: 'delivery',
        label: 'Delivery Address',
        className: 'w-[16%] min-w-[120px] max-w-[180px]',
        render: (row) => <NegotiationAddressCell address={row.delivery} />,
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
        className: 'w-[125px] min-w-[115px]',
        render: (row) => <NegotiationVehicleCell vehicle={row.vehicleType || 'Covered Van (20ft)'} />,
        skeleton: () => (
            <div className="flex items-center min-h-[22px]">
                <Skeleton className="h-3.5 w-24 rounded-[3px]" />
            </div>
        )
    },
    {
        id: 'transit',
        label: 'Transit Time',
        sortable: true,
        className: 'w-[85px] min-w-[80px] text-center',
        render: (row) => <NegotiationTransitCell transit={row.deliveryDate || '48h'} />,
        skeleton: () => (
            <div className="flex items-center justify-center min-h-[22px]">
                <Skeleton className="h-3.5 w-12 rounded-[3px]" />
            </div>
        )
    },
    {
        id: 'budget',
        label: 'Quote Amount',
        sortable: true,
        className: 'w-[120px] min-w-[110px]',
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
        className: 'w-[95px] min-w-[90px] text-center',
        render: (row) => <StatusCell status={row.status} />,
        skeleton: () => (
            <div className="flex items-center justify-center min-h-[22px]">
                <Skeleton className="h-5 w-18 rounded-[3px] !bg-emerald-100/70 dark:!bg-emerald-950/50" />
            </div>
        )
    },
    {
        id: 'requestDate',
        label: 'Date',
        sortable: true,
        className: 'w-[105px] min-w-[100px] text-center',
        render: (row) => <NegotiationDateCell date={row.requestDate} />,
        skeleton: () => (
            <div className="flex items-center justify-center min-h-[22px]">
                <Skeleton className="h-3.5 w-16 rounded-[3px]" />
            </div>
        )
    }
];

export const getCustomerNegotiationColumns = getNegotiationColumns;
