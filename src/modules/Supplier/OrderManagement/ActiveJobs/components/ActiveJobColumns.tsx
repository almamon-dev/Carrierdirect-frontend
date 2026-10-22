import { formatStandardAddress } from '@/utils/addressFormatter';
import React from 'react';
import { MapPin } from 'lucide-react';
import { Column } from '@/components/tables/data-table';
import { StatusBadge } from '@/components/common/StatusBadge';
import { formatDisplayDate } from '@/lib/utils';
import { SupplierOrder, checkHasRealDriver } from '../../data/ordersData';

export const getActiveJobColumns = (
    navigate: (path: string) => void
): Column<SupplierOrder>[] => [
    {
        id: 'id',
        label: 'Job ID',
        sortable: true,
        className: 'w-[125px] min-w-[120px] text-left',
        render: (row) => (
            <div className="flex items-center h-5">
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/supplier/orders/details/${row.slug}`);
                    }}
                    className="font-bold text-[#ff4a1f] hover:underline text-left cursor-pointer text-xs leading-none whitespace-nowrap"
                >
                    {row.id}
                </button>
            </div>
        ),
    },
    {
        id: 'customer',
        label: 'Customer',
        sortable: true,
        className: 'w-[140px] min-w-[130px]',
        render: (row) => {
            const initial = row.customer ? row.customer.charAt(0).toUpperCase() : 'C';
            return (
                <div className="flex items-center gap-2 min-w-0 h-5" title={row.customer}>
                    <div className="w-5 h-5 min-w-[20px] min-h-[20px] rounded-full bg-orange-100 dark:bg-[#ff4a1f]/20 border border-orange-200/60 text-[#ff4a1f] flex items-center justify-center text-[10px] font-bold shrink-0 aspect-square">
                        {initial}
                    </div>
                    <span className="font-semibold text-slate-900 dark:text-slate-100 text-xs truncate max-w-[110px] leading-tight">
                        {row.customer}
                    </span>
                </div>
            );
        },
    },
    {
        id: 'pickup',
        label: 'Pickup Address',
        sortable: true,
        className: 'w-[18%] min-w-[140px] max-w-[220px]',
        render: (row) => {
            const address = formatStandardAddress(row, 'pickup');
            return (
                <div className="flex items-center gap-1.5 min-w-0 pr-1 h-5" title={address}>
                    <MapPin size={12} className="text-[#ff4a1f] shrink-0" />
                    <span className="font-medium text-slate-800 dark:text-slate-200 text-xs truncate leading-normal">
                        {address}
                    </span>
                </div>
            );
        },
    },
    {
        id: 'delivery',
        label: 'Delivery Address',
        sortable: true,
        className: 'w-[18%] min-w-[140px] max-w-[220px]',
        render: (row) => {
            const address = formatStandardAddress(row, 'delivery');
            return (
                <div className="flex items-center gap-1.5 min-w-0 pr-1 h-5" title={address}>
                    <MapPin size={12} className="text-emerald-500 shrink-0" />
                    <span className="font-medium text-slate-800 dark:text-slate-200 text-xs truncate leading-normal">
                        {address}
                    </span>
                </div>
            );
        },
    },
    {
        id: 'date',
        label: 'Schedule Date',
        sortable: true,
        className: 'w-[110px] min-w-[105px] text-center',
        render: (row) => (
            <div className="flex items-center justify-center h-5">
                <span className="whitespace-nowrap text-xs text-slate-500 dark:text-slate-400 font-medium leading-none">
                    {formatDisplayDate(row.pickupDate)}
                </span>
            </div>
        ),
    },
    {
        id: 'driver',
        label: 'Driver & Vehicle',
        sortable: true,
        className: 'w-[150px] min-w-[140px]',
        render: (row) => {
            const hasDriver = checkHasRealDriver(row);

            if (hasDriver) {
                return (
                    <div className="flex items-center gap-1.5 h-5 min-w-0" title={`${row.driver} • ${row.vehicle || ''}`}>
                        <div className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0 bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                            {row.driver.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-xs font-semibold text-slate-800 dark:text-slate-100 truncate max-w-[120px] leading-none">
                            {row.driver}
                        </span>
                    </div>
                );
            }

            return (
                <div className="flex items-center h-5">
                    <StatusBadge status="Unassigned" category="pending" />
                </div>
            );
        },
    },
    {
        id: 'status',
        label: 'Status',
        sortable: true,
        className: 'w-[120px] min-w-[115px] text-center',
        render: (row) => {
            return (
                <div className="flex items-center justify-center h-5">
                    <StatusBadge status={row.status || 'Confirmed'} />
                </div>
            );
        },
    },
    {
        id: 'payment_status',
        label: 'Payment Terms',
        sortable: true,
        className: 'w-[135px] min-w-[130px] text-center',
        render: (row) => {
            const isPayLater = Boolean(row.is_pay_later || row.payment_method === 'pay_later' || row.invoice_type === 'pay_later' || row.payment_status?.toLowerCase().includes('pay later'));
            const isPaid = Boolean(!isPayLater && (row.is_paid || row.payment_status?.toLowerCase().includes('paid') || row.status === 'Delivered'));

            if (isPayLater) {
                return (
                    <div className="flex items-center justify-center h-5">
                        <StatusBadge status="Pay Later (Due)" category="financial_hold" />
                    </div>
                );
            }
            if (isPaid) {
                return (
                    <div className="flex items-center justify-center h-5">
                        <StatusBadge status="Paid" category="success" />
                    </div>
                );
            }
            return (
                <div className="flex items-center justify-center h-5">
                    <StatusBadge status="In Escrow" category="financial_hold" />
                </div>
            );
        },
    },
    {
        id: 'payout',
        label: 'Net Payout',
        sortable: true,
        className: 'w-[110px] min-w-[105px] text-right pr-2',
        render: (row) => (
            <div className="flex items-center justify-end h-5">
                <span className="whitespace-nowrap text-xs font-bold text-emerald-600 dark:text-emerald-400 leading-none">
                    {row.netPayout || row.agreedPrice || '—'}
                </span>
            </div>
        ),
    },
];

export default getActiveJobColumns;
