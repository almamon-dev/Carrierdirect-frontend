import React, { useState } from 'react';
import { Column } from '@/components/tables/data-table';
import { StatusBadge, StatusCategory } from '@/components/common/StatusBadge';
import { StandardRouteCell } from '@/components/common/StandardRouteCell';
import { encryptId } from '@/lib/encryption';
import { Check, Copy, ShieldCheck, Truck, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CustomerOrderItem } from '../types';

const CopyableOrderIdCell: React.FC<{ orderIdText: string; targetId: string | number; dateStr?: string }> = ({
    orderIdText,
    targetId,
    dateStr,
}) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        navigator.clipboard.writeText(orderIdText);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    const formattedDate = (() => {
        if (!dateStr) return '';
        try {
            const d = new Date(dateStr);
            if (isNaN(d.getTime())) return dateStr;
            return d.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
            });
        } catch {
            return dateStr;
        }
    })();

    return (
        <div className="flex flex-col justify-center min-h-[30px] pr-2">
            <div className="flex items-center gap-1.5">
                <Link
                    to={`/customer/orders/track/${encryptId(targetId)}`}
                    onClick={(e) => e.stopPropagation()}
                    className="text-[12.5px] font-bold text-slate-900 dark:text-slate-100 hover:text-[#ff4a1f] dark:hover:text-[#ff4a1f] tracking-tight whitespace-nowrap transition-colors"
                    title="Click to Live Track Shipment"
                >
                    {orderIdText}
                </Link>
                <button
                    type="button"
                    onClick={handleCopy}
                    className="p-0.5 rounded-[3px] text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    title={`Copy ${orderIdText}`}
                >
                    {copied ? (
                        <Check size={12} className="text-emerald-500" />
                    ) : (
                        <Copy size={12} />
                    )}
                </button>
            </div>
            {formattedDate && (
                <span className="text-[10.5px] text-slate-400 dark:text-slate-500 font-medium whitespace-nowrap mt-0.5 leading-none">
                    {formattedDate}
                </span>
            )}
        </div>
    );
};

const DriverSupplierCell: React.FC<{ row: any }> = ({ row }) => {
    const driverName = row.driver_name || row.driver?.name;
    const vehiclePlate = row.vehicle_plate || row.driver?.vehicle_plate;

    const supplierName =
        row.supplier_name ||
        row.supplier?.company_name ||
        row.carrier ||
        row.carrier_name ||
        row.supplier?.name ||
        'Verified Supplier';

    const isVerified = row.carrier_verified ?? row.supplier?.is_verified ?? true;
    const avatar = row.carrier_avatar || row.supplier_avatar || row.supplier?.profile_picture;
    const initial = driverName ? driverName.charAt(0).toUpperCase() : (supplierName ? supplierName.charAt(0).toUpperCase() : 'D');

    return (
        <div className="flex items-center gap-2 min-h-[32px] min-w-0 pr-1" title={driverName ? `Driver: ${driverName} (${supplierName})` : `Supplier: ${supplierName}`}>
            <div className={`w-7 h-7 min-w-[28px] rounded-full flex items-center justify-center text-[10.5px] font-bold shrink-0 overflow-hidden aspect-square border ${
                driverName 
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border-blue-200/80 dark:border-blue-800' 
                    : 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200/80 dark:border-amber-800'
            }`}>
                {avatar && (avatar.startsWith('http') || avatar.startsWith('/')) ? (
                    <img src={avatar} alt="" className="w-full h-full object-cover" />
                ) : (
                    <span>{initial}</span>
                )}
            </div>

            <div className="flex flex-col min-w-0 max-w-[210px]">
                {/* 1. Driver Name (Primary) */}
                <div className="flex items-center gap-1.5 min-w-0">
                    {driverName ? (
                        <span className="font-bold text-slate-900 dark:text-slate-100 text-[12.5px] truncate block leading-tight">
                            {driverName}
                        </span>
                    ) : (
                        <span className="inline-flex items-center gap-1 text-[9.5px] font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 px-1.5 py-0.25 rounded-[3px] border border-amber-200/80 dark:border-amber-900/60 leading-tight">
                            <span className="w-1 h-1 rounded-full bg-amber-500 animate-pulse" />
                            Unassigned Driver
                        </span>
                    )}
                </div>

                {/* 2. Supplier Name (Subtext without redundant label) */}
                <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate leading-tight mt-0.5" title={supplierName}>
                    <span className="truncate text-slate-500 dark:text-slate-400 hover:text-[#ff4a1f] transition-colors">
                        {supplierName}
                    </span>
                    {isVerified && (
                        <span title="CMR Verified Supplier" className="inline-flex shrink-0">
                            <ShieldCheck size={11} className="text-emerald-500" />
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export const getOrderColumns = (
    _handleRatingClick?: (order: CustomerOrderItem) => void,
    _role: string = 'customer'
): Column<CustomerOrderItem>[] => [
    {
        id: 'order_id',
        label: 'Order ID & Date',
        sortable: true,
        className: 'min-w-[160px] whitespace-nowrap',
        render: (row: any) => {
            const orderIdText =
                row.order_number ||
                row.order_id ||
                (row.id ? `ORD-${String(row.id).padStart(4, '0')}` : 'ORD-0001');
            const targetId = row.rawId || row.raw_id || row.id || orderIdText;
            const dateStr = row.created_at_time || row.date_human || row.created_at || row.date || row.order_date;
            return <CopyableOrderIdCell orderIdText={orderIdText} targetId={targetId} dateStr={dateStr} />;
        },
    },
    {
        id: 'route',
        label: 'Corridor Route & Checkpoint',
        sortable: false,
        className: 'w-[32%] min-w-[260px]',
        render: (row: any) => <StandardRouteCell row={row} showCargo={false} />,
    },
    {
        id: 'driver_supplier',
        label: 'Driver & Supplier',
        sortable: true,
        className: 'min-w-[190px]',
        render: (row: any) => <DriverSupplierCell row={row} />,
    },
    {
        id: 'status',
        label: 'Shipment Status',
        sortable: true,
        className: 'min-w-[125px] whitespace-nowrap',
        render: (row: any) => {
            const rawStatus = String(row.status_raw || row.status || '').toLowerCase().trim();
            const statusLabel = String(row.status || '').trim();
            const podStatus = String(row.pod_status || row.pod?.status || '').toLowerCase().trim();
            const hasPod = Boolean(row.proof_of_delivery || row.proof || row.pod_url);

            let displayStatus = 'Confirmed';
            let category: StatusCategory = 'pending';

            if (rawStatus.includes('cancel') || rawStatus.includes('reject')) {
                displayStatus = 'Cancelled';
                category = 'failed';
            } else if (rawStatus === 'completed' || rawStatus.includes('accepted')) {
                displayStatus = 'Completed';
                category = 'success';
            } else if (rawStatus === 'pod_uploaded' || rawStatus === 'pod_review' || (rawStatus === 'delivered' && (hasPod || podStatus === 'pending'))) {
                displayStatus = 'POD Review';
                category = 'action_required';
            } else if (rawStatus === 'delivered') {
                displayStatus = 'Delivered';
                category = 'success';
            } else if (rawStatus === 'in_transit' || rawStatus === 'picked_up' || rawStatus === 'on_the_way') {
                displayStatus = 'In Transit';
                category = 'in_progress';
            } else if (rawStatus === 'driver_assigned' || rawStatus === 'assigned') {
                displayStatus = 'Driver Assigned';
                category = 'financial_hold';
            } else if (rawStatus === 'confirmed' || rawStatus === 'booked') {
                displayStatus = 'Confirmed';
                category = 'pending';
            } else if (statusLabel) {
                displayStatus = statusLabel;
            }

            return (
                <div className="flex items-center min-h-[30px]">
                    <StatusBadge status={displayStatus} category={category} />
                </div>
            );
        },
    },
    {
        id: 'amount',
        label: 'Freight & Escrow',
        sortable: true,
        className: 'min-w-[155px] whitespace-nowrap',
        render: (row: any) => {
            const platformFee = Number(
                row.platform_fee ??
                row.platform_charge ??
                (row as any).quote?.platform_fee ??
                0
            );
            const totalAmt = Number(
                row.total_amount ??
                row.gross_amount ??
                row.amount_raw ??
                (row.amount ? parseFloat(String(row.amount).replace(/[^0-9.]/g, '')) : 0)
            );
            const quoteAmt = Number(
                (row as any).quote_amount ??
                row.subtotal ??
                (row as any).quote?.amount ??
                totalAmt
            );

            const displayAmt = totalAmt > 0 ? totalAmt : (quoteAmt > 0 ? quoteAmt : Number(row.base_amount ?? 0));
            const formattedAmt = `€${displayAmt.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

            const payStatus = String(row.payment_status || '').toLowerCase().trim();
            const payMethod = String((row as any).payment_method || '').toLowerCase().trim();
            const isPayLater = payMethod.includes('later') || payStatus.includes('later');

            let paymentBadgeText = 'Paid (Escrow)';
            let paymentBadgeColor = 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800';

            if (isPayLater) {
                paymentBadgeText = 'Net-30 Credit';
                paymentBadgeColor = 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800';
            } else if (payStatus === 'pending' || payStatus === 'unpaid') {
                paymentBadgeText = 'Pending Escrow';
                paymentBadgeColor = 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800';
            } else if (payStatus.includes('refund')) {
                paymentBadgeText = 'Refunded';
                paymentBadgeColor = 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700';
            }

            return (
                <div className="flex flex-col min-h-[30px] justify-center py-0.5">
                    <span className="text-[12.5px] font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
                        {formattedAmt}{' '}
                        <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">
                            EUR
                        </span>
                    </span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                        <span className={`text-[9.5px] font-bold px-1.5 py-0.25 rounded-[3px] border ${paymentBadgeColor} leading-tight`}>
                            {paymentBadgeText}
                        </span>
                    </div>
                </div>
            );
        },
    },
];

export default getOrderColumns;
