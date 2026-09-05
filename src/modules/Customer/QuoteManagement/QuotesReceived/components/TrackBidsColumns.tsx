import React from 'react';
import { ShieldCheck, Star, Eye, MessageCircle, MapPin, ArrowRight, Clock } from 'lucide-react';
import { Column } from '@/components/tables/data-table';
import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';
import { formatDisplayDate } from '@/lib/utils';
import { encryptId } from '@/lib/encryption';

export const getTrackBidsColumns = (
    navigate: (path: string) => void,
    quoteRequestDetails?: any
): Column<any>[] => [
    {
        id: 'id',
        label: 'Quote ID',
        sortable: true,
        className: 'w-[90px] min-w-[90px]',
        render: (row) => (
            <button
                type="button"
                onClick={() => navigate(`/customer/quotes/received/view/${encryptId(row.id)}`)}
                className="text-[#ff4a1f] font-bold hover:underline whitespace-nowrap cursor-pointer text-xs"
            >
                {row.quote_id || (row.id ? `QT-${String(row.id).padStart(4, '0')}` : 'QT-0000')}
            </button>
        )
    },
    {
        id: 'supplier',
        label: 'Supplier Details',
        sortable: true,
        className: 'min-w-[210px]',
        render: (row) => {
            const name = row.supplier_name || row.supplier?.company_name || row.supplier?.name || row.carrier_name || 'Carrier';
            const avatar = row.supplier?.profile_picture || row.supplier_avatar || row.carrier_avatar;
            const rating = row.rating || row.supplier?.rating || '4.8';
            const completedOrders = row.completed_orders ?? row.supplier?.completed_orders ?? row.supplier?.completed_orders_count ?? row.supplier?.orders_count ?? row.orders_completed ?? row.completed_loads ?? '150+ completed loads';
            const completedText = typeof completedOrders === 'number'
                ? `${completedOrders} completed orders`
                : (String(completedOrders).includes('completed') || String(completedOrders).includes('orders') || String(completedOrders).includes('loads')
                    ? String(completedOrders)
                    : `${completedOrders} completed`);

            return (
                <div className="flex items-center gap-2.5 py-0.5 min-w-0">
                    {avatar ? (
                        <img
                            src={avatar}
                            alt={name}
                            className="w-7 h-7 rounded-full object-cover shrink-0 border border-slate-200 dark:border-slate-700 shadow-2xs"
                            onError={(e) => { (e.currentTarget as HTMLElement).style.display = 'none'; }}
                        />
                    ) : (
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#ff4a1f] to-orange-400 text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-2xs">
                            {name.charAt(0).toUpperCase()}
                        </div>
                    )}
                    <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-1.5">
                            <span className="font-bold text-slate-900 dark:text-slate-100 text-xs truncate max-w-[145px]" title={name}>
                                {name}
                            </span>
                            {(row.supplier?.is_verified ?? true) && (
                                <span title="Verified Carrier" className="inline-flex items-center">
                                    <ShieldCheck size={13} className="text-emerald-500 shrink-0" />
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] mt-0.5 whitespace-nowrap">
                            <span className="flex items-center gap-0.5 font-bold text-amber-500">
                                <Star size={11} className="fill-amber-500 text-amber-500" />
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
        className: 'min-w-[170px]',
        render: (row) => {
            const origin = row.pickup_address || row.pickup_city || row.origin_city || (row.origin ? row.origin.split(',')[0]?.trim() : '') || quoteRequestDetails?.pickup_city || quoteRequestDetails?.pickup_address || 'Dhaka';
            const destination = row.delivery_address || row.delivery_city || row.destination_city || (row.destination ? row.destination.split(',')[0]?.trim() : '') || quoteRequestDetails?.delivery_city || quoteRequestDetails?.delivery_address || 'Chittagong';

            return (
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200 whitespace-nowrap min-h-[26px]" title={`${origin} → ${destination}`}>
                    <MapPin size={12} className="text-[#ff4a1f] shrink-0" />
                    <span className="truncate max-w-[75px]">{origin}</span>
                    <ArrowRight size={11} className="text-slate-400 shrink-0" />
                    <span className="truncate max-w-[75px]">{destination}</span>
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
            const vehicle = row.vehicle || row.vehicle_type || row.truck_type || quoteRequestDetails?.vehicle_type || 'Covered Van (20ft)';
            return <span className="whitespace-nowrap text-xs text-slate-700 dark:text-slate-300 font-medium truncate max-w-[125px]" title={vehicle}>{vehicle}</span>;
        }
    },
    {
        id: 'cargo',
        label: 'Cargo / Weight',
        className: 'min-w-[125px]',
        render: (row) => {
            const weightVal = row.weight || row.cargo_weight || quoteRequestDetails?.weight;
            const weightText = weightVal ? (String(weightVal).includes('KG') || String(weightVal).includes('kg') ? weightVal : `${weightVal} KG`) : '500.00 KG';
            const palletsVal = row.type_of_pallets || row.pallets || row.pallet_type || quoteRequestDetails?.type_of_pallets || quoteRequestDetails?.pallets;
            const palletsText = palletsVal && palletsVal !== 'Standard' ? palletsVal : 'Pallets';

            return (
                <div className="flex flex-col text-xs leading-tight">
                    <span className="font-semibold text-slate-800 dark:text-slate-200 whitespace-nowrap">{weightText}</span>
                    <span className="text-[11px] text-slate-400 dark:text-slate-500 whitespace-nowrap">{palletsText}</span>
                </div>
            );
        }
    },
    {
        id: 'transitTime',
        label: 'Transit Time',
        sortable: true,
        className: 'w-[105px] min-w-[105px] text-center',
        render: (row) => {
            const transit = row.estimated_delivery || row.transit_time || row.estimated_time || row.transit_days || '48h';
            const displayTransit = String(transit).includes('h') || String(transit).includes('day') || String(transit).includes('d') ? transit : `${transit}h`;
            return (
                <div className="flex items-center justify-center gap-1.5 min-h-[26px]">
                    <Clock size={12} className="text-slate-400 shrink-0" />
                    <span className="whitespace-nowrap text-xs text-slate-700 dark:text-slate-300 font-semibold">{displayTransit}</span>
                </div>
            );
        }
    },
    {
        id: 'date',
        label: 'Date',
        sortable: true,
        className: 'w-[105px] min-w-[105px] text-center',
        render: (row) => (
            <div className="flex items-center justify-center min-h-[26px]">
                <span className="whitespace-nowrap text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {formatDisplayDate(row.created_at || row.date || row.received_at || row.submitted_at || row.quote_request?.created_at)}
                </span>
            </div>
        )
    },
    {
        id: 'amount',
        label: 'Quote Amount',
        sortable: true,
        className: 'w-[120px] min-w-[120px]',
        render: (row) => {
            let formattedAmt = '—';
            const raw = row.amount_raw ?? row.amount ?? row.offer_amount ?? row.quote_amount;
            if (typeof raw === 'number') {
                formattedAmt = `€ ${raw.toLocaleString('de-DE')}`;
            } else if (typeof raw === 'string' && raw) {
                formattedAmt = raw.startsWith('€') || raw.startsWith('EUR') || raw.startsWith('$') ? raw : `€ ${raw}`;
            }
            return <span className="whitespace-nowrap text-xs font-bold text-emerald-600 dark:text-emerald-400">{formattedAmt}</span>;
        }
    },
    {
        id: 'status',
        label: 'Status',
        sortable: true,
        className: 'w-[120px] min-w-[120px] text-center',
        render: (row) => {
            const rawStatus = row.status_raw || row.status || (row.revision_status === 'pending' ? 'negotiating' : 'pending');
            const st = String(rawStatus || 'pending').toLowerCase();
            
            let displayStatus = 'Pending Review';
            let variant: any = 'warning';

            if (st.includes('pending')) {
                displayStatus = 'Pending Review';
                variant = 'warning';
            } else if (st.includes('negotiat') || row.revision_status === 'pending') {
                displayStatus = 'Negotiating';
                variant = 'secondary';
            } else if (st.includes('accept') || st.includes('won') || st.includes('approved')) {
                displayStatus = 'Accepted';
                variant = 'success';
            } else if (st.includes('reject') || st.includes('decline') || st.includes('lost') || st.includes('cancel')) {
                displayStatus = 'Rejected';
                variant = 'critical';
            } else if (st) {
                displayStatus = st.charAt(0).toUpperCase() + st.slice(1);
            }

            return (
                <div className="flex items-center justify-center min-h-[26px]">
                    <Badge variant={variant} showDot className="text-[10.5px] font-bold">
                        {displayStatus}
                    </Badge>
                </div>
            );
        }
    }
];

export const renderTrackBidsActions = (row: any, navigate: (path: string) => void) => (
    <div className="flex items-center justify-end gap-1.5">
        <Button
            variant="outline"
            size="sm"
            className="h-7 px-2 text-xs font-semibold"
            onClick={() => navigate(`/customer/quotes/received/view/${encryptId(row.id)}`)}
        >
            <Eye size={13} className="mr-1 text-slate-500" /> Details
        </Button>
        <Button
            variant="primary"
            size="sm"
            className="h-7 px-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold"
            onClick={() => navigate(`/customer/quotes/negotiation/conversation/${encryptId(row.id)}`)}
        >
            <MessageCircle size={13} className="mr-1" /> Chat
        </Button>
    </div>
);
