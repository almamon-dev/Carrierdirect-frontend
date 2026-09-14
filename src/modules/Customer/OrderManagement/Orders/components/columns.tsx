import React from 'react';
import { Column } from '@/components/tables/data-table';
import Badge from '@/components/ui/badge';
import { ShieldCheck, Star, MapPin, ArrowRight, Clock } from 'lucide-react';
import { formatDisplayDate } from '@/lib/utils';
import { CustomerOrderItem } from '../types';

export const getOrderColumns = (
    navigate: (path: string, options?: any) => void
): Column<CustomerOrderItem>[] => [
    {
        id: 'order_id',
        label: 'Order ID',
        sortable: true,
        className: 'w-[100px] min-w-[100px]',
        render: (row) => {
            const displayId = row.order_id || row.order_number || (row.id ? `ORD-${String(row.id).padStart(4, '0')}` : 'ORD-0001');
            return (
                <button
                    type="button"
                    onClick={() => navigate(`/customer/orders/details/${row.slug || row.id}`, { state: { orderData: row } })}
                    className="text-[#ff4a1f] font-bold hover:underline whitespace-nowrap cursor-pointer text-xs"
                >
                    {displayId}
                </button>
            );
        }
    },
    {
        id: 'carrier',
        label: 'Carrier / Supplier',
        sortable: true,
        className: 'min-w-[170px]',
        render: (row) => {
            const name = row.supplier_name || row.carrier_name || row.supplier?.company_name || row.supplier?.name || 'Carrier Fleet';
            const avatar = row.carrier_avatar || row.supplier?.profile_picture || row.supplier?.avatar;
            const rating = row.carrier_rating || row.supplier?.rating || row.rating || '4.8';
            const completedCount = row.supplier?.completed_orders || row.completed_orders || '150+ loads';
            const completedText = typeof completedCount === 'number' ? `${completedCount} loads` : completedCount;
            const isVerified = row.carrier_verified ?? row.supplier?.is_verified ?? true;

            return (
                <div className="flex items-center gap-2 min-w-0">
                    <div className="relative shrink-0">
                        {avatar ? (
                            <img
                                src={avatar}
                                alt={name}
                                className="w-6 h-6 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                            />
                        ) : (
                            <div className="w-6 h-6 rounded-full bg-linear-to-br from-orange-400 to-[#ff4a1f] flex items-center justify-center text-[10px] font-bold text-white shadow-2xs">
                                {name.charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col min-w-0 leading-tight">
                        <div className="flex items-center gap-1">
                            <span className="font-semibold text-xs text-slate-800 dark:text-slate-100 whitespace-nowrap" title={name}>
                                {name}
                            </span>
                            {isVerified && (
                                <span title="Verified Carrier" className="inline-flex items-center">
                                    <ShieldCheck size={11} className="text-emerald-500 shrink-0" />
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-1 text-[10.5px] text-slate-400 dark:text-slate-500 whitespace-nowrap">
                            <span className="flex items-center gap-0.5 text-amber-500 font-semibold">
                                <Star size={9.5} className="fill-amber-400 stroke-amber-500" />
                                <span>{rating}</span>
                            </span>
                            <span className="text-slate-300 dark:text-slate-600">•</span>
                            <span className="font-medium text-emerald-600 dark:text-emerald-400">
                                {completedText}
                            </span>
                        </div>
                    </div>
                </div>
            );
        }
    },
    {
        id: 'route',
        label: 'Route',
        sortable: true,
        className: 'min-w-[180px]',
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
        label: 'Vehicle Type',
        sortable: true,
        className: 'min-w-[130px]',
        render: (row) => {
            const vehicle = row.vehicle || row.vehicle_type || row.truck_type || 'Covered Van (20ft)';
            return <span className="whitespace-nowrap text-xs text-slate-700 dark:text-slate-300 font-medium" title={vehicle}>{vehicle}</span>;
        }
    },
    {
        id: 'cargo',
        label: 'Cargo / Load',
        className: 'min-w-[125px]',
        render: (row) => {
            const weightVal = row.weight || row.cargo_weight;
            const weightText = weightVal ? (String(weightVal).includes('KG') || String(weightVal).includes('kg') ? weightVal : `${weightVal} KG`) : '1,500 KG';
            const palletsVal = row.type_of_pallets || row.pallets || 'Pallets';

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
        label: 'Order Date',
        sortable: true,
        className: 'w-[105px] min-w-[105px] text-center',
        render: (row) => (
            <div className="flex items-center min-h-[26px]">
                <span className="whitespace-nowrap text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {formatDisplayDate(row.created_at || row.date || row.order_date)}
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
            const delivery = row.delivery_date || row.estimated_delivery || row.eta || row.estimated_time;
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
        id: 'amount',
        label: 'Total Amount',
        sortable: true,
        className: 'w-[120px] min-w-[120px]',
        render: (row) => {
            let formattedAmt = '—';
            const raw = row.amount_raw ?? row.amount ?? row.total_amount;
            if (typeof raw === 'number') {
                formattedAmt = `€ ${raw.toLocaleString('de-DE', { minimumFractionDigits: 2 })}`;
            } else if (typeof raw === 'string' && raw) {
                formattedAmt = raw.startsWith('€') || raw.startsWith('EUR') || raw.startsWith('$') ? raw : `€ ${raw}`;
            }
            return <span className="whitespace-nowrap text-xs font-bold text-emerald-600 dark:text-emerald-400">{formattedAmt}</span>;
        }
    },
    {
        id: 'payment',
        label: 'Payment',
        sortable: true,
        className: 'w-[115px] min-w-[115px] text-center',
        render: (row) => {
            const ps = String(row.payment_status || 'unpaid').toLowerCase().trim();
            let variant: any = 'warning';
            let label = 'Unpaid';

            if (ps === 'paid' || ps.includes('released')) {
                variant = 'success';
                label = 'Paid';
            } else if (ps.includes('escrow')) {
                variant = 'secondary';
                label = 'In Escrow';
            } else if (ps.includes('refund')) {
                variant = 'outline';
                label = 'Refunded';
            } else if (ps === 'due' || ps === 'unpaid' || ps === 'pending') {
                variant = 'warning';
                label = 'Unpaid';
            } else {
                variant = 'warning';
                label = row.payment_status ? (row.payment_status.charAt(0).toUpperCase() + row.payment_status.slice(1)) : 'Unpaid';
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
