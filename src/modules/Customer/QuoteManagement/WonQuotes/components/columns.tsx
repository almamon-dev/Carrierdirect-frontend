import { StandardRouteCell } from '@/components/common/StandardRouteCell';
import { formatStandardRoute, formatCompactRoute } from "@/utils/addressFormatter";
import React from 'react';
import { Column } from '@/components/tables/data-table';
import Skeleton from '@/components/ui/skeleton';
import { CustomerWonQuoteItem } from '../types';
import { formatDisplayDate } from '@/lib/utils';
import { encryptId } from '@/lib/encryption';
import {
    QuotesReceivedSupplierCell,
    QuotesReceivedVehicleCell,
    QuotesReceivedAmountCell,
} from '../../QuotesReceived/components/QuotesReceivedCells';

export const getCustomerWonQuoteColumns = (navigate: (path: string) => void): Column<CustomerWonQuoteItem>[] => [
    {
        id: 'quoteId',
        label: 'Quote ID',
        sortable: true,
        className: 'w-[115px] min-w-[110px]',
        render: (row) => {
            const rawId = row.rawId || row.id;
            const quoteText = row.quoteId || row.quote_id || (rawId ? (String(rawId).startsWith('QT-') ? rawId : `QT-${String(rawId).padStart(4, '0')}`) : 'QT-0000');
            const rawReq = row.requestId ? String(row.requestId).replace('REQ-', '') : (row.quote_request_id || row.quote_request?.id || '');
            const reqText = row.requestId || row.request_id || (rawReq ? `REQ-${String(rawReq).padStart(4, '0')}` : '');

            return (
                <div className="flex flex-col justify-center min-h-[26px]">
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/customer/quotes/received/view/${encryptId(rawId)}`);
                        }}
                        className="font-bold text-slate-900 dark:text-slate-100 hover:text-[#ff4a1f] dark:hover:text-[#ff4a1f] text-left whitespace-nowrap cursor-pointer text-[13px] tracking-tight transition-colors leading-none"
                    >
                        {quoteText}
                    </button>
                    {reqText && (
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                if (rawReq) navigate(`/customer/quotes/create/view/${rawReq}`);
                            }}
                            className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 hover:text-[#ff4a1f] hover:underline text-left mt-1 leading-none whitespace-nowrap cursor-pointer"
                        >
                            {reqText}
                        </button>
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
        id: 'supplier',
        label: 'Supplier',
        sortable: true,
        className: 'w-[145px] min-w-[130px]',
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
        label: 'Route',
        sortable: false,
        className: 'w-[36%] min-w-[280px]',
        render: (row) => <StandardRouteCell row={row} />,
    },
    {
        id: 'vehicle',
        label: 'Vehicle',
        sortable: true,
        className: 'w-[130px] min-w-[120px]',
        render: (row) => {
            const veh = row.vehicle || row.vehicleType || row.vehicle_type || 'Covered Van (20ft)';
            return <QuotesReceivedVehicleCell vehicle={veh} />;
        },
    },
    {
        id: 'amount',
        label: 'Amount',
        sortable: true,
        className: 'w-[125px] min-w-[115px]',
        render: (row) => <QuotesReceivedAmountCell row={row} />,
    },
    {
        id: 'deliveryStatus',
        label: 'Status',
        sortable: true,
        className: 'w-[130px] min-w-[120px] text-center',
        render: (row) => {
            const hist = row.historyStatus || row.status || 'Booked';
            const delivery = row.deliveryStatus;
            const rawDate = row.date || row.created_at || row.booked_at;

            let label = hist;
            let colorClass = 'bg-[#BBD8F7] text-[#1E40AF]';

            if (hist === 'Completed' || delivery === 'Completed') {
                label = 'Completed';
                colorClass = 'bg-[#BBEBD0] text-[#166534]';
            } else if (hist === 'Declined') {
                label = 'Declined';
                colorClass = 'bg-[#F4C2C2] text-[#991B1B]';
            } else if (hist === 'Expired') {
                label = 'Expired';
                colorClass = 'bg-[#D8DCE3] text-[#374151]';
            } else if (delivery && delivery !== 'Confirmed') {
                label = delivery;
                if (delivery === 'Driver Assigned' || delivery === 'In Transit') {
                    colorClass = 'bg-[#BBD8F7] text-[#1E40AF]';
                } else if (delivery === 'Delivered') {
                    colorClass = 'bg-[#BBEBD0] text-[#166534]';
                } else if (delivery === 'POD Pending') {
                    colorClass = 'bg-[#F5D0AD] text-[#8A4210]';
                }
            } else {
                label = 'Booked';
                colorClass = 'bg-[#BBEBD0] text-[#166534]';
            }

            return (
                <div className="flex flex-col items-center justify-center min-h-[26px]">
                    <span className={`inline-flex items-center justify-center px-[10px] py-[3.5px] text-[11.5px] font-semibold leading-none rounded-[2px] whitespace-nowrap ${colorClass}`}>
                        {label}
                    </span>
                    {rawDate && (
                        <span className="text-[10.5px] font-medium text-slate-400 dark:text-slate-500 mt-1 leading-none whitespace-nowrap">
                            {formatDisplayDate(rawDate)}
                        </span>
                    )}
                </div>
            );
        },
    },
];
