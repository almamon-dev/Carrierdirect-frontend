import React from 'react';
import { Column } from '@/components/tables/data-table';
import Skeleton from '@/components/ui/skeleton';
import { formatDisplayDate } from '@/lib/utils';
import { encryptId } from '@/lib/encryption';
import {
    QuotesReceivedSupplierCell,
    QuotesReceivedAmountCell,
    QuotesReceivedStatusCell,
} from './QuotesReceivedCells';

export const getQuotesReceivedColumns = (navigate: (path: string) => void): Column<any>[] => [
    {
        id: 'id',
        label: 'Quote ID',
        sortable: true,
        className: 'w-[90px]',
        render: (row) => (
            <div className="flex items-center min-h-[26px]">
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/customer/quotes/received/view/${encryptId(row.id)}`);
                    }}
                    className="text-[#ff4a1f] font-bold hover:underline whitespace-nowrap cursor-pointer text-xs text-left"
                >
                    {row.quote_id || (row.id ? `QT-${String(row.id).padStart(4, '0')}` : 'QT-0000')}
                </button>
            </div>
        ),
        skeleton: () => <div className="flex items-center min-h-[26px]"><Skeleton className="h-4 w-16 rounded-[3px] !bg-orange-100/70 dark:!bg-orange-950/40" /></div>
    },
    {
        id: 'requestId',
        label: 'Requested ID',
        sortable: true,
        className: 'w-[100px]',
        render: (row) => {
            const reqIdVal = row.quote_request_id || row.quote_request?.id || row.rawId;
            const reqIdText = row.request_id || (reqIdVal ? `REQ-${String(reqIdVal).padStart(4, '0')}` : 'REQ-0000');
            return (
                <div className="flex items-center min-h-[26px]">
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            if (reqIdVal) navigate(`/customer/quotes/create/view/${reqIdVal}`);
                        }}
                        className="font-semibold text-slate-700 dark:text-slate-300 hover:text-[#ff4a1f] hover:underline whitespace-nowrap cursor-pointer text-xs text-left"
                    >
                        {reqIdText}
                    </button>
                </div>
            );
        },
        skeleton: () => <div className="flex items-center min-h-[26px]"><Skeleton className="h-4 w-16 rounded-[3px]" /></div>
    },
    {
        id: 'supplier',
        label: 'Supplier',
        sortable: true,
        className: 'w-[140px]',
        render: (row) => <QuotesReceivedSupplierCell row={row} />,
        skeleton: () => <div className="flex items-center gap-2 min-h-[26px]"><Skeleton className="w-5 h-5 rounded-full shrink-0" /><Skeleton className="h-3.5 w-24 rounded-[3px]" /></div>
    },
    {
        id: 'pickup',
        label: 'Pickup Address',
        className: 'min-w-0',
        render: (row) => {
            const pickup = row.pickup_address || row.quote_request?.pickup_city || row.origin_city || (row.origin ? row.origin.split(',')[0]?.trim() : '') || 'Pickup Location';
            return <div className="flex items-center min-w-0 pr-1 min-h-[26px]" title={pickup}><span className="font-medium text-slate-800 dark:text-slate-200 text-xs truncate whitespace-nowrap">{pickup}</span></div>;
        },
        skeleton: () => <div className="flex items-center min-w-0 pr-1 min-h-[26px]"><Skeleton className="h-3.5 w-32 max-w-full rounded-[3px]" /></div>
    },
    {
        id: 'delivery',
        label: 'Delivery Address',
        className: 'min-w-0',
        render: (row) => {
            const delivery = row.delivery_address || row.quote_request?.delivery_city || row.destination_city || (row.destination ? row.destination.split(',')[0]?.trim() : '') || 'Delivery Location';
            return <div className="flex items-center min-w-0 pr-1 min-h-[26px]" title={delivery}><span className="font-medium text-slate-800 dark:text-slate-200 text-xs truncate whitespace-nowrap">{delivery}</span></div>;
        },
        skeleton: () => <div className="flex items-center min-w-0 pr-1 min-h-[26px]"><Skeleton className="h-3.5 w-32 max-w-full rounded-[3px]" /></div>
    },
    {
        id: 'vehicle',
        label: 'Vehicle Type',
        sortable: true,
        className: 'w-[130px]',
        render: (row) => {
            const vehicle = row.vehicle || row.vehicle_type || row.truck_type || row.quote_request?.vehicle_type || 'Covered Van (20ft)';
            return <div className="flex items-center min-h-[26px]"><span className="text-xs text-slate-800 dark:text-slate-200 font-medium truncate max-w-[125px]" title={vehicle}>{vehicle}</span></div>;
        },
        skeleton: () => <div className="flex items-center min-h-[26px]"><Skeleton className="h-3.5 w-24 rounded-[3px]" /></div>
    },
    {
        id: 'transit',
        label: 'Transit Time',
        sortable: true,
        className: 'w-[110px] text-center',
        render: (row) => {
            const transit = row.estimated_delivery || row.estimated_time || row.transit_time || '48h';
            return <div className="flex items-center min-h-[26px]"><span className="text-xs text-slate-600 dark:text-slate-400 font-medium whitespace-nowrap">{transit}</span></div>;
        },
        skeleton: () => <div className="flex items-center min-h-[26px]"><Skeleton className="h-3.5 w-12 rounded-[3px]" /></div>
    },
    {
        id: 'amount',
        label: 'Quote Amount',
        sortable: true,
        className: 'w-[130px]',
        render: (row) => <QuotesReceivedAmountCell row={row} />,
        skeleton: () => <div className="flex items-center min-h-[26px]"><Skeleton className="h-4 w-20 rounded-[3px] !bg-emerald-100/70 dark:!bg-emerald-950/40" /></div>
    },
    {
        id: 'status',
        label: 'Status',
        sortable: true,
        className: 'w-[105px] text-center',
        render: (row) => <QuotesReceivedStatusCell row={row} />,
        skeleton: () => <div className="flex items-center min-h-[26px]"><Skeleton className="h-5 w-18 rounded-[3px] !bg-emerald-100/70 dark:!bg-emerald-950/50" /></div>
    },
    {
        id: 'date',
        label: 'Date',
        sortable: true,
        className: 'w-[105px] text-center',
        render: (row) => (
            <div className="flex items-center min-h-[26px]">
                <span className="whitespace-nowrap text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {formatDisplayDate(row.created_at || row.date || row.received_at || row.quote_request?.created_at)}
                </span>
            </div>
        ),
        skeleton: () => <div className="flex items-center min-h-[26px]"><Skeleton className="h-3.5 w-16 rounded-[3px]" /></div>
    }
];
