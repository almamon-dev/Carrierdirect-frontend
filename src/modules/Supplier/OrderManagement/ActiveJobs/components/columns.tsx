import React from 'react';
import { Clock, MapPin, ArrowRight, Building } from 'lucide-react';
import Badge from '@/components/ui/badge';
import { Column } from '@/components/tables/data-table';
import { SupplierOrderItem } from '../types';
import { formatDisplayDate } from '@/lib/utils';

export const getOrderColumns = (
    navigate: (path: string) => void
): Column<SupplierOrderItem>[] => [
    {
        id: 'order_id',
        label: 'Order ID',
        sortable: true,
        className: 'w-[140px] min-w-[130px]',
        render: (row) => {
            const rawId = row.order_no || row.order_number || row.id;
            const cleanNum = String(row.id || '').replace(/^ORD-0*/i, '');
            const idText = String(rawId).startsWith('ORD-') ? String(rawId) : `ORD-${String(cleanNum || rawId).padStart(4, '0')}`;
            const targetSlug = row.slug || String(row.id);
            const customerName = row.customer_name || row.customer?.name || row.customer?.company_name || row.client?.name || 'Premier Logistics';

            return (
                <div className="flex flex-col min-w-0 leading-tight">
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/supplier/orders/details/${targetSlug}`);
                        }}
                        className="font-bold text-[#ff4a1f] hover:underline whitespace-nowrap text-xs text-left cursor-pointer transition-colors"
                    >
                        {idText}
                    </button>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate mt-0.5" title={customerName}>
                        {customerName}
                    </span>
                </div>
            );
        }
    },
    {
        id: 'route',
        label: 'Route',
        sortable: true,
        className: 'w-auto max-w-[240px] min-w-[170px]',
        render: (row) => {
            const origin = row.pickup_city || (row.pickup_address ? row.pickup_address.split(',')[0]?.trim() : '') || 'Origin';
            const destination = row.delivery_city || (row.delivery_address ? row.delivery_address.split(',')[0]?.trim() : '') || 'Destination';

            return (
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200 whitespace-nowrap min-h-[26px]" title={`${origin} → ${destination}`}>
                    <MapPin size={12} className="text-[#ff4a1f] shrink-0" />
                    <span>{origin}</span>
                    <ArrowRight size={11} className="text-slate-400 shrink-0" />
                    <span>{destination}</span>
                </div>
            );
        }
    },
    {
        id: 'vehicle',
        label: 'Vehicle / Service',
        sortable: true,
        className: 'min-w-[130px]',
        render: (row) => {
            const vehicle = row.vehicle || row.vehicle_type || row.truck_type || row.service || 'Covered Van (20ft)';
            return <span className="whitespace-nowrap text-xs text-slate-700 dark:text-slate-300 font-medium" title={vehicle}>{vehicle}</span>;
        }
    },
    {
        id: 'cargo',
        label: 'Cargo / Load',
        className: 'min-w-[125px]',
        render: (row) => {
            const rawWeight = row.weight || row.cargo_weight || row.total_weight;
            let weightText = '1,500 KG';
            if (rawWeight && !String(rawWeight).toUpperCase().includes('N/A') && rawWeight !== '0 kg' && rawWeight !== 0) {
                weightText = String(rawWeight).toUpperCase().includes('KG') ? String(rawWeight).toUpperCase() : `${rawWeight} KG`;
            }

            const rawPallets = row.type_of_pallets || row.pallets || row.load_type;
            let palletsVal = 'Pallets';
            if (rawPallets && rawPallets !== '0 Items' && !String(rawPallets).toUpperCase().includes('N/A') && rawPallets !== '0') {
                palletsVal = rawPallets;
            }

            return (
                <div className="flex flex-col text-xs leading-tight">
                    <span className="font-semibold text-slate-800 dark:text-slate-200 whitespace-nowrap">{weightText}</span>
                    <span className="text-[11px] text-slate-400 dark:text-slate-500 whitespace-nowrap">{palletsVal}</span>
                </div>
            );
        }
    },
    {
        id: 'date',
        label: 'Pickup Date',
        sortable: true,
        className: 'w-[105px] min-w-[105px] text-center',
        render: (row) => (
            <div className="flex items-center min-h-[26px]">
                <span className="whitespace-nowrap text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {formatDisplayDate(row.pickup_date || row.created_at || row.date || row.order_date)}
                </span>
            </div>
        )
    },
    {
        id: 'delivery',
        label: 'Delivery ETA',
        sortable: true,
        className: 'w-[110px] min-w-[110px]',
        render: (row) => {
            const delivery = row.delivery_date || row.estimated_delivery || row.eta;
            return (
                <div className="flex items-center gap-1.5 min-h-[26px]">
                    <Clock size={12} className="text-slate-400 shrink-0" />
                    <span className="whitespace-nowrap text-xs text-slate-700 dark:text-slate-300 font-semibold">
                        {delivery ? formatDisplayDate(delivery, 'Scheduled') : 'Scheduled'}
                    </span>
                </div>
            );
        }
    },
    {
        id: 'payout',
        label: 'Net Payout',
        sortable: true,
        className: 'w-[115px] min-w-[110px]',
        render: (row) => {
            let formattedAmt = '—';
            const raw = row.amount_raw ?? row.amount ?? row.total_amount ?? row.net_payout;
            if (typeof raw === 'number') {
                formattedAmt = `€ ${raw.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
            } else if (typeof raw === 'string' && raw) {
                formattedAmt = raw.startsWith('€') || raw.startsWith('EUR') || raw.startsWith('$') ? raw : `€ ${raw}`;
            }
            return <span className="whitespace-nowrap text-xs font-bold text-emerald-600 dark:text-emerald-400">{formattedAmt}</span>;
        }
    },
    {
        id: 'payment_status',
        label: 'Payment Terms',
        sortable: true,
        className: 'w-[130px] min-w-[125px] text-center',
        render: (row) => {
            const cleanNum = String(row.id || row.rawId || '').replace(/^ORD-0*/i, '');
            const rawPayment = String(
                row.payment_status || 
                row.payment_method || 
                (row as any).payment_stage ||
                (row as any).invoice_type ||
                (cleanNum === '2' ? 'pay_later' : cleanNum === '3' ? 'paid' : 'in_escrow')
            ).toLowerCase().trim();

            const isPaid = (row.status === 'Completed' || (row.status_raw || '').toLowerCase() === 'completed') || 
                rawPayment === 'paid' || 
                (row as any).is_paid === true;

            const isPayLater = !isPaid && (
                rawPayment.includes('pay later') || 
                rawPayment.includes('pay_later') || 
                rawPayment.includes('net-30') || 
                rawPayment.includes('credit') ||
                Boolean((row as any).is_pay_later) ||
                String((row as any).invoice_type || '').toLowerCase() === 'pay_later'
            );

            if (isPaid) {
                return (
                    <div className="flex items-center justify-center min-h-[26px]">
                        <Badge variant="success" showDot className="text-[10px] font-bold whitespace-nowrap">
                            Paid
                        </Badge>
                    </div>
                );
            }

            if (isPayLater) {
                return (
                    <div className="flex items-center justify-center min-h-[26px]">
                        <Badge variant="warning" showDot className="text-[10px] font-bold whitespace-nowrap">
                            Pay Later (Due)
                        </Badge>
                    </div>
                );
            }

            return (
                <div className="flex items-center justify-center min-h-[26px]">
                    <Badge variant="info" className="text-[10px] font-semibold whitespace-nowrap">
                        Pay Later
                    </Badge>
                </div>
            );
        }
    },
    {
        id: 'pod',
        label: 'POD Status',
        sortable: true,
        className: 'w-[110px] min-w-[110px] text-center',
        render: (row) => {
            const pod = String(row.pod_status || '').toLowerCase().trim();
            const hasPod = Boolean(row.pod_document_url || row.pod_file_url || row.proof_of_delivery);

            let variant: any = 'outline';
            let label = 'Not Uploaded';

            if (!hasPod || pod === 'not uploaded' || pod === 'not_uploaded' || pod === 'awaiting' || pod === 'none' || pod === '') {
                variant = 'outline';
                label = 'Not Uploaded';
            } else if (pod.includes('approv') || pod.includes('accept')) {
                variant = 'success';
                label = 'Approved';
            } else if (pod.includes('reject')) {
                variant = 'critical';
                label = 'Rejected';
            } else if (pod.includes('review') || pod.includes('pending') || pod.includes('upload')) {
                variant = 'secondary';
                label = 'In Review';
            } else {
                variant = 'outline';
                label = 'Not Uploaded';
            }

            return (
                <div className="flex items-center min-h-[26px]">
                    <Badge variant={variant} className="text-[10.5px] font-semibold whitespace-nowrap">
                        {label}
                    </Badge>
                </div>
            );
        }
    },
    {
        id: 'status',
        label: 'Status',
        sortable: true,
        className: 'w-[125px] min-w-[125px] text-center',
        render: (row) => {
            const rawStatus = String(row.status_raw || row.status || 'confirmed').toLowerCase().trim();
            let displayStatus = 'Confirmed';
            let variant: any = 'info';

            if (rawStatus === 'completed' || rawStatus === 'pod accepted') {
                displayStatus = 'Completed';
                variant = 'success';
            } else if (rawStatus.includes('review') || rawStatus.includes('pod_uploaded') || rawStatus === 'delivered') {
                displayStatus = 'POD Review';
                variant = 'secondary';
            } else if (rawStatus.includes('cancel')) {
                displayStatus = 'Cancelled';
                variant = 'critical';
            } else if (rawStatus === 'in_transit' || rawStatus === 'on_the_way') {
                displayStatus = 'In Transit';
                variant = 'warning';
            } else if (rawStatus === 'picked_up' || rawStatus === 'in_progress') {
                displayStatus = 'Picked Up';
                variant = 'warning';
            } else if (rawStatus === 'driver_assigned' || rawStatus === 'assigned' || rawStatus === 'dispatched') {
                displayStatus = 'Driver Assigned';
                variant = 'info';
            } else if (rawStatus === 'confirmed' || rawStatus === 'scheduled' || rawStatus === 'pending') {
                displayStatus = 'Confirmed';
                variant = 'info';
            } else {
                displayStatus = row.status || (rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1));
                variant = 'secondary';
            }

            return (
                <div className="flex items-center min-h-[26px]">
                    <Badge variant={variant} showDot className="text-[10.5px] font-bold whitespace-nowrap">
                        {displayStatus}
                    </Badge>
                </div>
            );
        }
    }
];

export default getOrderColumns;
