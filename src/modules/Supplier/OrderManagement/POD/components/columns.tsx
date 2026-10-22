import { formatStandardAddress } from '@/utils/addressFormatter';
import React from 'react';
import { MapPin, FileText } from 'lucide-react';
import { Column } from '@/components/tables/data-table';
import { StatusBadge } from '@/components/common/StatusBadge';
import { PODOrderItem } from '../types';
import { formatDisplayDate } from '@/lib/utils';

export const getPODColumns = (
    navigate: (path: string) => void,
    onPreviewPOD: (order: PODOrderItem) => void
): Column<PODOrderItem>[] => [
        {
            id: 'order_id',
            label: 'Order ID',
            sortable: true,
            className: 'w-[110px] min-w-[100px]',
            render: (row) => {
                const rawId = row.order_no || row.order_number || row.id;
                const cleanNum = String(row.id || '').replace(/^ORD-0*/i, '');
                const idText = String(rawId).startsWith('ORD-') ? String(rawId) : `ORD-${String(cleanNum || rawId).padStart(4, '0')}`;
                const targetSlug = row.slug || String(row.id);

                return (
                    <div className="flex items-center h-5">
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/supplier/orders/details/${targetSlug}`);
                            }}
                            className="font-bold text-[#ff4a1f] hover:underline whitespace-nowrap text-xs text-left cursor-pointer transition-colors leading-none"
                        >
                            {idText}
                        </button>
                    </div>
                );
            },
        },
        {
            id: 'customer',
            label: 'Customer',
            sortable: true,
            className: 'w-[130px] min-w-[120px]',
            render: (row) => {
                const name = row.customer_name || row.customer?.name || row.customer?.company_name || 'Customer';
                const initial = name ? name.charAt(0).toUpperCase() : 'C';
                return (
                    <div className="flex items-center gap-2 min-w-0 h-5" title={name}>
                        <div className="w-5 h-5 min-w-[20px] min-h-[20px] rounded-full bg-orange-100 dark:bg-[#ff4a1f]/20 border border-orange-200/60 text-[#ff4a1f] flex items-center justify-center text-[10px] font-bold shrink-0 aspect-square">
                            {initial}
                        </div>
                        <span className="font-semibold text-slate-900 dark:text-slate-100 text-xs truncate max-w-[105px] leading-tight">
                            {name}
                        </span>
                    </div>
                );
            },
        },
        {
            id: 'pickup',
            label: 'Pickup Address',
            sortable: true,
            className: 'min-w-[130px] max-w-[190px]',
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
            className: 'min-w-[130px] max-w-[190px]',
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
            id: 'pickup_date',
            label: 'Schedule Date',
            sortable: true,
            className: 'w-[100px] min-w-[95px] text-center',
            render: (row) => (
                <div className="flex items-center justify-center h-5">
                    <span className="whitespace-nowrap text-xs text-slate-500 dark:text-slate-400 font-medium leading-none">
                        {formatDisplayDate(row.pickup_date)}
                    </span>
                </div>
            ),
        },
        {
            id: 'driver',
            label: 'Driver',
            sortable: true,
            className: 'w-[130px] min-w-[120px]',
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
                        <div className="flex items-center gap-1.5 h-5 min-w-0" title={dName}>
                            <div className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-[9px] font-bold shrink-0 aspect-square">
                                {dName.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-xs font-semibold text-slate-800 dark:text-slate-100 truncate max-w-[110px] leading-none">
                                {dName}
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
            id: 'document',
            label: 'POD Doc',
            className: 'w-[75px] min-w-[70px] text-center',
            render: (row) => {
                const hasDoc = row.has_pod;
                const fileName = row.pod_file_name || `Signed_POD_${row.order_id || row.id}.pdf`;

                if (hasDoc) {
                    return (
                        <div className="flex items-center justify-center h-5">
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onPreviewPOD(row);
                                }}
                                className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800/70 text-emerald-600 dark:text-emerald-400 transition-all cursor-pointer shadow-2xs group"
                                title={fileName ? `Preview ${fileName}` : 'Preview POD Document'}
                            >
                                <FileText size={13} className="group-hover:scale-110 transition-transform" />
                            </button>
                        </div>
                    );
                }

                return (
                    <div className="flex items-center justify-center h-5">
                        <span className="text-xs text-slate-300 dark:text-slate-600 font-medium select-none">—</span>
                    </div>
                );
            },
        },
        {
            id: 'pod_status',
            label: 'POD Status',
            sortable: true,
            className: 'w-[105px] min-w-[100px] text-center',
            render: (row) => {
                const podStatus = row.pod_status;
                if (podStatus === 'Approved') {
                    return (
                        <div className="flex items-center justify-center h-5">
                            <StatusBadge status="Approved" category="success" />
                        </div>
                    );
                } else if (podStatus === 'Pending Review') {
                    return (
                        <div className="flex items-center justify-center h-5">
                            <StatusBadge status="In Review" category="action_required" />
                        </div>
                    );
                } else if (podStatus === 'Rejected') {
                    return (
                        <div className="flex items-center justify-center h-5">
                            <StatusBadge status="Rejected" category="failed" />
                        </div>
                    );
                }

                return (
                    <div className="flex items-center justify-center h-5">
                        <StatusBadge status="Not Uploaded" category="neutral" />
                    </div>
                );
            },
        },
        {
            id: 'status',
            label: 'Status',
            sortable: true,
            className: 'w-[100px] min-w-[95px] text-center',
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
                    <div className="flex items-center justify-center h-5">
                        <StatusBadge status={displayStatus} />
                    </div>
                );
            },
        },
        {
            id: 'payment_status',
            label: 'Payment Terms',
            sortable: true,
            className: 'w-[120px] min-w-[115px] text-center',
            render: (row) => {
                const isPayLater = Boolean(row.is_pay_later || row.payment_method === 'pay_later' || row.payment_status?.toLowerCase().includes('pay later') || row.payment_status?.toLowerCase().includes('due'));
                const isPaid = Boolean(!isPayLater && (row.is_paid || row.payment_status?.toLowerCase().includes('paid') || row.status?.toLowerCase() === 'delivered' || row.status_raw === 'completed'));

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
            id: 'amount',
            label: 'Net Payout',
            sortable: true,
            className: 'w-[100px] min-w-[95px] text-right pr-2',
            render: (row) => {
                let formattedAmt = '—';
                const raw = row.amount_raw ?? row.amount ?? row.total_amount;
                if (typeof raw === 'number') {
                    formattedAmt = `€${raw.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
                } else if (typeof raw === 'string' && raw) {
                    formattedAmt = raw.startsWith('€') || raw.startsWith('EUR') || raw.startsWith('$') ? raw : `€${raw}`;
                }
                return (
                    <div className="flex items-center justify-end h-5">
                        <span className="whitespace-nowrap text-xs font-bold text-emerald-600 dark:text-emerald-400 leading-none">
                            {formattedAmt}
                        </span>
                    </div>
                );
            },
        },
    ];

export default getPODColumns;
