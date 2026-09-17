import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, ArrowRight, Truck } from 'lucide-react';
import Badge from '@/components/ui/badge';
import { Column } from '@/components/tables/data-table';
import { CustomerOrderItem } from '../types';
import { formatDisplayDate } from '@/lib/utils';

export const getOrderColumns = (
    handleRatingClick?: (order: CustomerOrderItem) => void,
    role: string = 'customer'
): Column<CustomerOrderItem>[] => [
        {
            id: 'order_id',
            label: 'Order ID',
            sortable: true,
            className: 'w-[95px] whitespace-nowrap',
            render: (row) => {
                const rawId = row.order_number || row.order_id || (row.id ? `ORD-${String(row.id).padStart(4, '0')}` : 'ORD-0001');
                const targetId = row.rawId || row.raw_id || row.id || rawId;
                return (
                    <div className="flex items-center min-h-[22px]">
                        <Link
                            to={`/customer/orders/details/${targetId}`}
                            className="font-bold text-[#ff4a1f] hover:underline whitespace-nowrap text-xs text-left"
                        >
                            {rawId}
                        </Link>
                    </div>
                );
            }
        },
        {
            id: 'carrier',
            label: 'Carrier / Supplier',
            sortable: true,
            className: 'whitespace-nowrap',
            render: (row) => {
                const carrierName = row.carrier || row.carrier_name || row.supplier_name || row.supplier?.company_name || row.supplier?.name || 'Carrier Direct';
                const count = row.completed_orders_count ?? row.supplier?.completed_orders_count ?? row.completed_orders ?? row.supplier?.completed_orders;
                const completedText = (count !== undefined && count !== null)
                    ? (typeof count === 'number' || !isNaN(Number(count)) ? `${Number(count)} completed` : String(count))
                    : '0 completed';

                return (
                    <div className="flex items-center gap-1.5 min-w-0 min-h-[22px]">
                        <div className="w-4.5 h-4.5 min-w-[18px] min-h-[18px] aspect-square rounded-full bg-orange-100 dark:bg-[#ff4a1f]/20 border border-orange-200/60 dark:border-orange-500/20 text-[#ff4a1f] flex items-center justify-center shrink-0">
                            <Truck size={10.5} />
                        </div>
                        <div className="flex flex-col min-w-0 leading-none gap-0.5">
                            <span className="font-semibold text-slate-900 dark:text-slate-100 text-xs whitespace-nowrap" title={carrierName}>
                                {carrierName}
                            </span>
                            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium leading-none">
                                {completedText}
                            </span>
                        </div>
                    </div>
                );
            }
        },
        {
            id: 'route',
            label: 'Route',
            sortable: true,
            className: 'whitespace-nowrap',
            render: (row) => {
                const origin = row.pickup_city || (row.pickup_address ? row.pickup_address.split(',')[0]?.trim() : '');
                const destination = row.delivery_city || (row.delivery_address ? row.delivery_address.split(',')[0]?.trim() : '');

                return (
                    <div className="flex items-center gap-1 text-xs font-semibold text-slate-800 dark:text-slate-200 leading-none min-h-[22px] whitespace-nowrap" title={`${origin} → ${destination}`}>
                        <MapPin size={11} className="text-[#ff4a1f] shrink-0" />
                        <span>{origin}</span>
                        <ArrowRight size={10} className="text-slate-400 shrink-0" />
                        <span>{destination}</span>
                    </div>
                );
            }
        },
        {
            id: 'vehicle',
            label: 'Vehicle Type',
            sortable: true,
            className: 'whitespace-nowrap',
            render: (row) => {
                const vehicle = row.vehicle || row.vehicle_type || row.truck_type || 'Covered Van (20ft)';
                return (
                    <span className="text-xs text-slate-700 dark:text-slate-300 font-medium whitespace-nowrap block leading-none" title={vehicle}>
                        {vehicle}
                    </span>
                );
            }
        },
        {
            id: 'cargo',
            label: 'Cargo / Load',
            className: 'whitespace-nowrap',
            render: (row) => {
                const weightVal = row.weight || row.cargo_weight;
                const weightText = weightVal ? (String(weightVal).includes('KG') || String(weightVal).includes('kg') ? weightVal : `${weightVal} KG`) : '1,500 KG';
                const palletsVal = row.type_of_pallets || row.pallets || '';

                return (
                    <div className="flex flex-col text-xs leading-none gap-0.5">
                        <span className="font-semibold text-slate-800 dark:text-slate-200 whitespace-nowrap">{weightText}</span>
                        {palletsVal ? (
                            <span className="text-[10px] text-slate-400 dark:text-slate-500 whitespace-nowrap leading-none">{palletsVal}</span>
                        ) : null}
                    </div>
                );
            }
        },
        {
            id: 'date',
            label: 'Order Date',
            sortable: true,
            className: 'w-[95px] text-center whitespace-nowrap',
            render: (row) => (
                <div className="flex items-center justify-center min-h-[22px]">
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
            className: 'w-[95px] whitespace-nowrap',
            render: (row) => {
                const delivery = row.delivery_date || row.estimated_delivery || row.eta || row.estimated_time;
                return (
                    <div className="flex items-center gap-1 min-h-[22px]">
                        <Clock size={11} className="text-slate-400 shrink-0" />
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
            className: 'w-[125px] whitespace-nowrap',
            render: (row) => {
                const numVal = Number(row.gross_amount ?? row.total_amount ?? row.amount_raw);
                let formattedAmt = '—';
                if (!isNaN(numVal) && numVal > 0) {
                    formattedAmt = `€ ${numVal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
                } else if (row.gross_amount_formatted || row.total_amount_formatted) {
                    formattedAmt = row.gross_amount_formatted || row.total_amount_formatted || '—';
                } else if (row.amount) {
                    formattedAmt = String(row.amount).startsWith('€') ? String(row.amount) : `€ ${row.amount}`;
                }
                return (
                    <div className="flex flex-col min-h-[22px] justify-center leading-none gap-0.5">
                        <span className="whitespace-nowrap text-xs font-bold text-slate-900 dark:text-slate-100">{formattedAmt}</span>
                        <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-semibold leading-none">5% fee included</span>
                    </div>
                );
            }
        },
        {
            id: 'payment',
            label: 'Payment',
            sortable: true,
            className: 'w-[85px] text-center whitespace-nowrap',
            render: (row) => {
                const ps = String(row.payment_status || 'unpaid').toLowerCase().trim();
                let variant: any = 'warning';
                let label = 'Unpaid';

                if (ps.includes('pay later') || ps.includes('pay_later') || ps.includes('net-30')) {
                    variant = 'info';
                    label = 'Pay Later';
                } else if (ps === 'paid' || ps.includes('released')) {
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
                    label = 'Due';
                } else {
                    variant = 'warning';
                    label = row.payment_status ? (row.payment_status.charAt(0).toUpperCase() + row.payment_status.slice(1)) : 'Unpaid';
                }

                return (
                    <div className="flex items-center justify-center min-h-[22px]">
                        <Badge variant={variant} className="text-[9.5px] font-semibold whitespace-nowrap px-1.5 py-0.25">
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
            className: 'w-[95px] text-center whitespace-nowrap',
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
                    <div className="flex items-center justify-center min-h-[22px]">
                        <Badge variant={variant} showDot className="text-[9.5px] font-bold whitespace-nowrap px-1.5 py-0.25">
                            {displayStatus}
                        </Badge>
                    </div>
                );
            }
        }
    ];

export default getOrderColumns;
