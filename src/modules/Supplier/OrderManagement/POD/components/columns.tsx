import { formatStandardAddress } from '@/utils/addressFormatter';
import React from 'react';
import { FileText } from 'lucide-react';
import { Column } from '@/components/tables/data-table';
import { StatusBadge } from '@/components/common/StatusBadge';
import { PODOrderItem } from '../types';
import { formatDisplayDate } from '@/lib/utils';
import { StandardRouteCell } from '@/components/common/StandardRouteCell';
import Skeleton from '@/components/ui/skeleton';

export const getPODColumns = (
    navigate: (path: string) => void,
    onPreviewPOD: (order: PODOrderItem) => void
): Column<PODOrderItem>[] => [
    {
        id: 'order_id',
        label: 'Order ID',
        sortable: true,
        className: 'w-[115px] whitespace-nowrap',
        render: (row) => {
            const rawId = row.order_no || row.order_number || row.id;
            const cleanNum = String(row.id || '').replace(/^ORD-0*/i, '');
            const idText = String(rawId).startsWith('ORD-') ? String(rawId) : `ORD-${String(cleanNum || rawId).padStart(4, '0')}`;
            const targetSlug = row.slug || String(row.id);
            const rawDate = row.pickup_date || (row as any).date || (row as any).created_at;

            return (
                <div className="flex flex-col justify-center min-h-[26px]">
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/supplier/orders/details/${targetSlug}`);
                        }}
                        className="font-bold text-slate-900 dark:text-slate-100 hover:text-[#ff4a1f] dark:hover:text-[#ff4a1f] text-left whitespace-nowrap cursor-pointer text-[12.5px] tracking-tight transition-colors leading-none"
                    >
                        {idText}
                    </button>
                    {rawDate && (
                        <span className="text-[10.5px] font-medium text-slate-400 dark:text-slate-500 mt-0.5 leading-none whitespace-nowrap">
                            {formatDisplayDate(rawDate)}
                        </span>
                    )}
                </div>
            );
        },
        skeleton: () => (
            <div className="flex flex-col gap-1 min-h-[22px]">
                <Skeleton className="h-4 w-16 rounded-[3px] !bg-orange-100/70 dark:!bg-orange-950/40" />
                <Skeleton className="h-2.5 w-12 rounded-[2px]" />
            </div>
        ),
    },
    {
        id: 'customer',
        label: 'Customer',
        sortable: true,
        className: 'w-[18%] min-w-[150px]',
        render: (row) => {
            const name = row.customer_name || row.customer?.name || row.customer?.company_name || 'Customer';
            const initial = name ? name.charAt(0).toUpperCase() : 'C';
            return (
                <div className="flex items-center gap-2 min-w-0 pr-1 min-h-[26px]" title={name}>
                    <div className="w-5 h-5 min-w-[20px] min-h-[20px] rounded-full bg-orange-100 dark:bg-[#ff4a1f]/20 border border-orange-200/60 text-[#ff4a1f] flex items-center justify-center text-[10px] font-bold shrink-0 aspect-square">
                        {initial}
                    </div>
                    <span className="font-semibold text-slate-900 dark:text-slate-100 text-[12px] truncate block max-w-full leading-normal">
                        {name}
                    </span>
                </div>
            );
        },
        skeleton: () => (
            <div className="flex items-center gap-2 min-h-[22px]">
                <Skeleton className="w-5 h-5 rounded-full shrink-0" />
                <Skeleton className="h-3.5 w-24 rounded-[3px]" />
            </div>
        ),
    },
    {
        id: 'route',
        label: 'Route',
        className: 'w-[32%] min-w-[280px]',
        render: (row) => <StandardRouteCell row={row} />,
        skeleton: () => (
            <div className="flex flex-col gap-1 min-w-0 pr-1 min-h-[22px]">
                <Skeleton className="h-3.5 w-40 max-w-full rounded-[3px]" />
                <Skeleton className="h-2.5 w-20 rounded-[2px]" />
            </div>
        ),
    },
    {
        id: 'driver',
        label: 'Driver',
        sortable: true,
        className: 'w-[150px] min-w-[140px]',
        render: (row) => {
            const dName = row.driver_name && row.driver_name !== '-' ? row.driver_name : (row.driver && row.driver !== '-' ? row.driver : '');
            const hasRealDriver = Boolean(
                dName &&
                !dName.toLowerCase().includes('assigned carrier') &&
                !dName.toLowerCase().includes('assigned driver') &&
                !dName.toLowerCase().includes('unassigned') &&
                !dName.toLowerCase().includes('pending')
            );

            if (hasRealDriver) {
                return (
                    <div className="flex items-center gap-2 min-h-[26px] min-w-0" title={dName}>
                        <div className="w-5 h-5 min-w-[20px] min-h-[20px] rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800 flex items-center justify-center text-[10px] font-bold shrink-0 aspect-square shadow-2xs">
                            {dName.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-semibold text-slate-900 dark:text-slate-100 text-[12px] truncate block max-w-[110px] leading-normal">
                            {dName}
                        </span>
                    </div>
                );
            }

            return (
                <div className="flex items-center min-h-[26px]">
                    <StatusBadge status="Unassigned" category="pending" />
                </div>
            );
        },
        skeleton: () => (
            <div className="flex items-center gap-2 min-h-[22px]">
                <Skeleton className="w-5 h-5 rounded-full shrink-0" />
                <Skeleton className="h-3.5 w-20 rounded-[3px]" />
            </div>
        ),
    },
    {
        id: 'document',
        label: 'POD Doc',
        className: 'w-[80px] min-w-[75px] text-center',
        render: (row) => {
            const hasDoc = row.has_pod;
            const fileName = row.pod_file_name || `Signed_POD_${row.order_id || row.id}.pdf`;

            if (hasDoc) {
                return (
                    <div className="flex items-center justify-center min-h-[26px]">
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                onPreviewPOD(row);
                            }}
                            className="inline-flex items-center justify-center w-7 h-7 rounded-[4px] bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800/70 text-emerald-600 dark:text-emerald-400 transition-all cursor-pointer shadow-2xs group"
                            title={fileName ? `Preview ${fileName}` : 'Preview POD Document'}
                        >
                            <FileText size={14} className="group-hover:scale-110 transition-transform" />
                        </button>
                    </div>
                );
            }

            return (
                <div className="flex items-center justify-center min-h-[26px]">
                    <span className="text-xs text-slate-300 dark:text-slate-600 font-medium select-none">—</span>
                </div>
            );
        },
        skeleton: () => (
            <div className="flex items-center justify-center min-h-[22px]">
                <Skeleton className="h-6 w-6 rounded-[4px]" />
            </div>
        ),
    },
    {
        id: 'pod_status',
        label: 'POD Status',
        sortable: true,
        className: 'w-[115px] min-w-[110px] text-center whitespace-nowrap',
        render: (row) => {
            const podStatus = row.pod_status;
            let displayBadge = <StatusBadge status="Not Uploaded" category="neutral" />;

            if (podStatus === 'Approved') {
                displayBadge = <StatusBadge status="Approved" category="success" />;
            } else if (podStatus === 'Pending Review') {
                displayBadge = <StatusBadge status="In Review" category="action_required" />;
            } else if (podStatus === 'Rejected') {
                displayBadge = <StatusBadge status="Rejected" category="failed" />;
            }

            return (
                <div className="flex items-center justify-center min-h-[26px]">
                    {displayBadge}
                </div>
            );
        },
        skeleton: () => (
            <div className="flex items-center justify-center min-h-[22px]">
                <Skeleton className="h-5 w-18 rounded-[3px]" />
            </div>
        ),
    },
    {
        id: 'status',
        label: 'Status',
        sortable: true,
        className: 'w-[115px] min-w-[110px] text-center whitespace-nowrap',
        render: (row) => {
            const rawStatus = String(row.status_raw || row.status || 'delivered').toLowerCase().trim();
            let displayStatus = 'Delivered';

            if (rawStatus === 'completed' || rawStatus === 'pod accepted') {
                displayStatus = 'Completed';
            } else if (rawStatus.includes('review') || rawStatus.includes('pod_uploaded') || rawStatus === 'delivered') {
                displayStatus = 'Delivered';
            } else if (rawStatus.includes('cancel')) {
                displayStatus = 'Cancelled';
            } else if (rawStatus === 'in_transit' || rawStatus === 'on_the_way') {
                displayStatus = 'In Transit';
            } else if (rawStatus === 'driver_assigned' || rawStatus === 'assigned') {
                displayStatus = 'Driver Assigned';
            } else {
                displayStatus = row.status || 'Delivered';
            }

            return (
                <div className="flex items-center justify-center min-h-[26px]">
                    <StatusBadge status={displayStatus} />
                </div>
            );
        },
        skeleton: () => (
            <div className="flex items-center justify-center min-h-[22px]">
                <Skeleton className="h-5 w-18 rounded-[3px]" />
            </div>
        ),
    },
    {
        id: 'payment_status',
        label: 'Payment Terms',
        sortable: true,
        className: 'w-[125px] min-w-[120px] text-center whitespace-nowrap',
        render: (row) => {
            const isPayLater = Boolean(
                row.is_pay_later ||
                row.payment_method === 'pay_later' ||
                row.payment_status?.toLowerCase().includes('pay later') ||
                row.payment_status?.toLowerCase().includes('due')
            );
            const isPaid = Boolean(
                !isPayLater && (row.is_paid || row.payment_status?.toLowerCase().includes('paid') || row.status?.toLowerCase() === 'delivered' || row.status_raw === 'completed')
            );

            return (
                <div className="flex items-center justify-center min-h-[26px]">
                    {isPayLater ? (
                        <StatusBadge status="Pay Later (Due)" category="financial_hold" />
                    ) : isPaid ? (
                        <StatusBadge status="Paid" category="success" />
                    ) : (
                        <StatusBadge status="In Escrow" category="financial_hold" />
                    )}
                </div>
            );
        },
        skeleton: () => (
            <div className="flex items-center justify-center min-h-[22px]">
                <Skeleton className="h-5 w-18 rounded-[3px]" />
            </div>
        ),
    },
    {
        id: 'amount',
        label: 'Net Payout',
        sortable: true,
        className: 'w-[125px] whitespace-nowrap text-right pr-2',
        render: (row) => {
            const raw = row.amount_raw ?? row.amount ?? row.total_amount;
            let formattedAmt = '—';
            let num = 0;
            if (typeof raw === 'number') {
                num = raw;
                formattedAmt = `€${raw.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
            } else if (typeof raw === 'string' && raw) {
                num = parseFloat(raw.replace(/[^0-9.]/g, ''));
                formattedAmt = isNaN(num) || num === 0 ? raw : `€${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
            }

            return (
                <div className="flex items-center justify-end min-h-[26px]">
                    <span className="font-bold text-slate-900 dark:text-white whitespace-nowrap text-[12.5px]">
                        {formattedAmt}{' '}
                        <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                            EUR
                        </span>
                    </span>
                </div>
            );
        },
        skeleton: () => (
            <div className="flex items-center justify-end min-h-[22px]">
                <Skeleton className="h-4 w-20 rounded-[3px] !bg-emerald-100/70 dark:!bg-emerald-950/40" />
            </div>
        ),
    },
    // Optional standalone columns for user column view customization
    {
        id: 'pickup',
        label: 'Pickup Address',
        defaultHidden: true,
        className: 'min-w-[160px] max-w-[220px]',
        render: (row) => {
            const address = formatStandardAddress(row, 'pickup');
            return (
                <div className="flex items-center min-h-[26px] truncate" title={address}>
                    <span className="font-medium text-slate-800 dark:text-slate-200 text-[13px] truncate">
                        {address}
                    </span>
                </div>
            );
        },
    },
    {
        id: 'delivery',
        label: 'Delivery Address',
        defaultHidden: true,
        className: 'min-w-[160px] max-w-[220px]',
        render: (row) => {
            const address = formatStandardAddress(row, 'delivery');
            return (
                <div className="flex items-center min-h-[26px] truncate" title={address}>
                    <span className="font-medium text-slate-800 dark:text-slate-200 text-[13px] truncate">
                        {address}
                    </span>
                </div>
            );
        },
    },
    {
        id: 'pickup_date',
        label: 'Schedule Date',
        defaultHidden: true,
        className: 'w-[110px] text-center',
        render: (row) => (
            <div className="flex items-center justify-center min-h-[26px]">
                <span className="whitespace-nowrap text-[13px] text-slate-600 dark:text-slate-400 font-medium">
                    {formatDisplayDate(row.pickup_date)}
                </span>
            </div>
        ),
    },
];

export default getPODColumns;
