import React from 'react';
import { Column } from '@/components/tables/data-table';
import Skeleton from '@/components/ui/skeleton';
import {
    QuotesReceivedQuoteIdCell,
    QuotesReceivedRequestIdCell,
    QuotesReceivedSupplierCell,
    QuotesReceivedAddressCell,
    QuotesReceivedVehicleCell,
    QuotesReceivedTransitCell,
    QuotesReceivedAmountCell,
    QuotesReceivedStatusCell,
    QuotesReceivedDateCell
} from './QuotesReceivedCells';

export const getQuotesReceivedColumns = (navigate: (path: string) => void): Column<any>[] => [
    {
        id: 'id',
        label: 'Quote ID',
        sortable: true,
        className: 'w-[95px] min-w-[90px]',
        render: (row) => <QuotesReceivedQuoteIdCell row={row} onNavigate={navigate} />,
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
        render: (row) => <QuotesReceivedRequestIdCell row={row} onNavigate={navigate} />,
        skeleton: () => (
            <div className="flex items-center min-h-[22px]">
                <Skeleton className="h-4 w-16 rounded-[3px]" />
            </div>
        )
    },
    {
        id: 'supplier',
        label: 'Supplier',
        sortable: true,
        className: 'w-[130px] min-w-[125px]',
        render: (row) => <QuotesReceivedSupplierCell row={row} />,
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
        render: (row) => {
            const pickup = row.pickup || row.pickup_address || row.quote_request?.pickup_city || row.origin_city || (row.origin ? row.origin.split(',')[0]?.trim() : '') || 'Pickup Location';
            return <QuotesReceivedAddressCell address={pickup} />;
        },
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
        render: (row) => {
            const delivery = row.delivery || row.delivery_address || row.quote_request?.delivery_city || row.destination_city || (row.destination ? row.destination.split(',')[0]?.trim() : '') || 'Delivery Location';
            return <QuotesReceivedAddressCell address={delivery} />;
        },
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
        id: 'transit',
        label: 'Transit Time',
        sortable: true,
        className: 'w-[85px] min-w-[80px] text-center',
        render: (row) => {
            const transit = row.transit || row.deliveryDate || row.estimated_delivery || row.estimated_time || row.transit_time || '48h';
            return <QuotesReceivedTransitCell transit={transit} />;
        },
        skeleton: () => (
            <div className="flex items-center justify-center min-h-[22px]">
                <Skeleton className="h-3.5 w-12 rounded-[3px]" />
            </div>
        )
    },
    {
        id: 'amount',
        label: 'Quote Amount',
        sortable: true,
        className: 'w-[120px] min-w-[110px]',
        render: (row) => <QuotesReceivedAmountCell row={row} />,
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
        render: (row) => <QuotesReceivedStatusCell row={row} />,
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
        render: (row) => <QuotesReceivedDateCell row={row} />,
        skeleton: () => (
            <div className="flex items-center justify-center min-h-[22px]">
                <Skeleton className="h-3.5 w-16 rounded-[3px]" />
            </div>
        )
    }
];
