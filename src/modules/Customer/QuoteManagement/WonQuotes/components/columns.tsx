import React from 'react';
import { Column } from '@/components/tables/data-table';
import Skeleton from '@/components/ui/skeleton';
import { CustomerWonQuoteItem } from '../types';
import {
    QuotesReceivedQuoteIdCell,
    QuotesReceivedRequestIdCell,
    QuotesReceivedSupplierCell,
    QuotesReceivedAddressCell,
    QuotesReceivedVehicleCell,
    QuotesReceivedAmountCell,
    QuotesReceivedDateCell,
} from '../../QuotesReceived/components/QuotesReceivedCells';

export const getCustomerWonQuoteColumns = (navigate: (path: string) => void): Column<CustomerWonQuoteItem>[] => [
    {
        id: 'quoteId',
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
        className: 'w-[140px] min-w-[130px]',
        render: (row) => <QuotesReceivedSupplierCell row={row} />,
        skeleton: () => (
            <div className="flex items-center gap-2 min-h-[22px]">
                <Skeleton className="w-5 h-5 rounded-full shrink-0" />
                <Skeleton className="h-3.5 w-20 rounded-[3px]" />
            </div>
        )
    },
    {
        id: 'route',
        label: 'Route / Location',
        sortable: false,
        className: 'w-[200px] min-w-[190px]',
        render: (row) => {
            const addr = row.pickup || row.delivery || row.route || (row.origin && row.destination ? `${row.origin} → ${row.destination}` : '—');
            return <QuotesReceivedAddressCell address={addr} />;
        },
    },
    {
        id: 'vehicle',
        label: 'Vehicle',
        sortable: true,
        className: 'w-[110px] min-w-[100px]',
        render: (row) => {
            const veh = row.vehicle || row.vehicleType || row.vehicle_type || 'Covered Van (20ft)';
            return <QuotesReceivedVehicleCell vehicle={veh} />;
        },
    },
    {
        id: 'amount',
        label: 'Amount',
        sortable: true,
        className: 'w-[100px] min-w-[90px]',
        render: (row) => <QuotesReceivedAmountCell row={row} />,
    },
    {
        id: 'deliveryStatus',
        label: 'Status',
        sortable: true,
        className: 'w-[135px] min-w-[130px]',
        render: (row) => {
            const hist = row.historyStatus || row.status || 'Booked';
            const delivery = row.deliveryStatus;

            let label = hist;
            let color = 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border-blue-200 dark:border-blue-800';

            if (hist === 'Completed' || delivery === 'Completed') {
                label = 'Completed';
                color = 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
            } else if (hist === 'Declined') {
                label = 'Declined';
                color = 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border-rose-200 dark:border-rose-800';
            } else if (hist === 'Expired') {
                label = 'Expired';
                color = 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700';
            } else if (delivery && delivery !== 'Confirmed') {
                label = delivery;
                if (delivery === 'Driver Assigned') {
                    color = 'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border-purple-200 dark:border-purple-800';
                } else if (delivery === 'In Transit') {
                    color = 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 dark:border-amber-800';
                } else if (delivery === 'Delivered') {
                    color = 'bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300 border-teal-200 dark:border-teal-800';
                } else if (delivery === 'POD Pending') {
                    color = 'bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300 border-orange-200 dark:border-orange-800';
                }
            } else {
                label = 'Booked';
                color = 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border-blue-200 dark:border-blue-800';
            }

            return (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-[3px] text-xs font-semibold border ${color}`}>
                    {label}
                </span>
            );
        },
    },
    {
        id: 'date',
        label: 'Date',
        sortable: true,
        className: 'w-[100px] min-w-[90px]',
        render: (row) => <QuotesReceivedDateCell row={row} />,
    },
];
