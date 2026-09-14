import React from 'react';
import { ShieldCheck, Star, MapPin, ArrowRight, Clock, FileCheck } from 'lucide-react';
import { Column } from '@/components/tables/data-table';
import Badge from '@/components/ui/badge';
import { formatDisplayDate } from '@/lib/utils';
import { PODOrderItem } from '../types';

export const getPODColumns = (
    navigate: (path: string, options?: any) => void,
    onPreviewPOD: (order: PODOrderItem) => void
): Column<PODOrderItem>[] => [
    {
        id: 'order_id',
        label: 'Job ID',
        sortable: true,
        className: 'w-[100px] min-w-[100px]',
        render: (row) => {
            const displayId = row.order_id || row.order_no || row.order_number || (row.id ? `ORD-${String(row.id).padStart(4, '0')}` : 'ORD-0001');
            return (
                <button
                    type="button"
                    onClick={() => navigate(`/supplier/orders/details/${row.slug || row.id}`, { state: { orderData: row } })}
                    className="text-[#ff4a1f] font-bold hover:underline whitespace-nowrap cursor-pointer text-xs"
                >
                    {displayId}
                </button>
            );
        }
    },
    {
        id: 'customer',
        label: 'Customer / Shipper',
        sortable: true,
        className: 'min-w-[200px]',
        render: (row) => {
            const name = row.customer_name || row.customer?.company_name || row.customer?.name || 'Verified Shipper';
            const avatar = row.customer?.profile_picture || row.customer?.avatar || row.customer_avatar;
            const rating = row.customer_rating || row.customer?.rating || '4.9';
            const completedLoads = row.customer?.completed_orders || '120+ loads';
            const completedText = typeof completedLoads === 'number' ? `${completedLoads} completed` : String(completedLoads);

            return (
                <div className="flex items-center gap-2.5 py-0.5 min-w-0">
                    {avatar ? (
                        <img
                            src={avatar.startsWith('http') || avatar.startsWith('/') ? avatar : `/storage/${avatar}`}
                            alt={name}
                            className="w-7 h-7 min-w-[28px] min-h-[28px] aspect-square rounded-full object-cover shrink-0 border border-slate-200 dark:border-slate-700 shadow-2xs"
                            onError={(e) => { (e.currentTarget as HTMLElement).style.display = 'none'; }}
                        />
                    ) : (
                        <div className="w-7 h-7 min-w-[28px] min-h-[28px] aspect-square rounded-full bg-gradient-to-br from-[#ff4a1f] to-orange-400 text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-2xs">
                            {name.charAt(0).toUpperCase()}
                        </div>
                    )}
                    <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-1.5">
                            <span className="font-bold text-slate-900 dark:text-slate-100 text-xs truncate" title={name}>
                                {name}
                            </span>
                            {(row.customer_verified ?? row.customer?.is_verified ?? true) && (
                                <span title="Verified Shipper" className="inline-flex items-center">
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
        className: 'min-w-[180px]',
        render: (row) => {
            const origin = row.pickup_city || (row.pickup_address ? row.pickup_address.split(',')[0]?.trim() : '') || 'Berlin';
            const destination = row.delivery_city || (row.delivery_address ? row.delivery_address.split(',')[0]?.trim() : '') || 'Munich';

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
        id: 'driver',
        label: 'Driver & Vehicle',
        className: 'min-w-[140px]',
        render: (row) => {
            const driver = row.driver || row.driver_name || 'Carrier Driver';
            const vehicle = row.vehicle || row.vehicle_type || row.vehicle_plate || 'Covered Van';

            return (
                <div className="flex flex-col text-xs leading-tight">
                    <span className="font-semibold text-slate-800 dark:text-slate-200 whitespace-nowrap">{driver}</span>
                    <span className="text-[11px] text-slate-400 dark:text-slate-500 whitespace-nowrap">{vehicle}</span>
                </div>
            );
        }
    },
    {
        id: 'delivery_date',
        label: 'Delivery Date',
        sortable: true,
        className: 'w-[115px] min-w-[115px]',
        render: (row) => (
            <div className="flex items-center gap-1.5 min-h-[26px]">
                <Clock size={12} className="text-slate-400 shrink-0" />
                <span className="whitespace-nowrap text-xs text-slate-700 dark:text-slate-300 font-semibold">
                    {formatDisplayDate(row.delivery_date || row.pickup_date, 'Today')}
                </span>
            </div>
        )
    },
    {
        id: 'document',
        label: 'POD Document',
        className: 'min-w-[145px]',
        render: (row) => {
            const hasDoc = row.has_pod;
            const fileName = row.pod_file_name || `Signed_POD_${row.order_id || row.id}.pdf`;

            if (hasDoc) {
                return (
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onPreviewPOD(row);
                        }}
                        className="inline-flex items-center gap-1.5 px-2 py-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 rounded-md text-[11px] font-semibold hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors cursor-pointer truncate max-w-[140px]"
                        title={fileName}
                    >
                        <FileCheck size={13} className="text-emerald-600 shrink-0" />
                        <span className="truncate">{fileName}</span>
                    </button>
                );
            }

            return (
                <span className="text-xs text-slate-400 dark:text-slate-500 italic">
                    Not Attached
                </span>
            );
        }
    },
    {
        id: 'pod_status',
        label: 'POD Status',
        sortable: true,
        className: 'w-[125px] min-w-[125px] text-center',
        render: (row) => {
            const podStatus = row.pod_status;
            let variant: any = 'outline';
            let label = 'Not Uploaded';

            if (podStatus === 'Approved') {
                variant = 'success';
                label = 'Approved';
            } else if (podStatus === 'Pending Review') {
                variant = 'warning';
                label = 'In Review';
            } else if (podStatus === 'Rejected') {
                variant = 'critical';
                label = 'Rejected';
            } else {
                variant = 'outline';
                label = 'Not Uploaded';
            }

            return (
                <div className="flex items-center min-h-[26px]">
                    <Badge variant={variant} showDot className="text-[10.5px] font-bold whitespace-nowrap">
                        {label}
                    </Badge>
                </div>
            );
        }
    }
];

export default getPODColumns;
