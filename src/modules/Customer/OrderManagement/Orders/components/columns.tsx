import React from 'react';
import { Link } from 'react-router-dom';
import { CreditCard, Calendar, ShieldCheck, FileText } from 'lucide-react';
import Badge from '@/components/ui/badge';
import { Column } from '@/components/tables/data-table';
import { CustomerOrderItem } from '../types';
import { encryptId } from '@/lib/encryption';

function formatStripeDateTime(dateStr?: string): string {
    if (!dateStr) return '—';
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
}

export const getOrderColumns = (
    _handleRatingClick?: (order: CustomerOrderItem) => void,
    _role: string = 'customer'
): Column<CustomerOrderItem>[] => [
    {
        id: 'amount',
        label: 'Amount',
        sortable: true,
        className: 'min-w-[140px] whitespace-nowrap',
        render: (row) => {
            const numVal = Number(row.gross_amount ?? row.total_amount ?? row.amount_raw);
            let formattedAmt = '€0.00 EUR';
            if (!isNaN(numVal) && numVal > 0) {
                formattedAmt = `€${numVal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} EUR`;
            } else if (row.gross_amount_formatted) {
                formattedAmt = row.gross_amount_formatted.includes('EUR') 
                    ? row.gross_amount_formatted 
                    : `${row.gross_amount_formatted} EUR`;
            } else if (row.total_amount_formatted) {
                formattedAmt = row.total_amount_formatted.includes('EUR') 
                    ? row.total_amount_formatted 
                    : `${row.total_amount_formatted} EUR`;
            } else if (row.amount) {
                formattedAmt = String(row.amount).includes('EUR') 
                    ? String(row.amount) 
                    : `${row.amount} EUR`;
            }

            return (
                <div className="flex items-center min-h-[22px]">
                    <span className="text-[13px] font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                        {formattedAmt}
                    </span>
                </div>
            );
        }
    },
    {
        id: 'status',
        label: 'Status',
        sortable: true,
        className: 'min-w-[110px] whitespace-nowrap',
        render: (row) => {
            const rawStatus = String(row.status_raw || row.status || 'confirmed').toLowerCase().trim();
            let displayStatus = 'Succeeded';
            let variant: any = 'success';

            if (rawStatus === 'completed' || rawStatus === 'pod accepted' || rawStatus === 'paid' || rawStatus === 'won') {
                displayStatus = 'Succeeded';
                variant = 'success';
            } else if (rawStatus.includes('review') || rawStatus.includes('pod_uploaded') || rawStatus === 'delivered') {
                displayStatus = 'POD Review';
                variant = 'secondary';
            } else if (rawStatus.includes('cancel') || rawStatus.includes('reject')) {
                displayStatus = 'Cancelled';
                variant = 'critical';
            } else if (rawStatus === 'in_transit' || rawStatus === 'on_the_way' || rawStatus === 'in_progress' || rawStatus === 'picked_up') {
                displayStatus = 'In Transit';
                variant = 'warning';
            } else if (rawStatus === 'driver_assigned' || rawStatus === 'assigned') {
                displayStatus = 'Driver Assigned';
                variant = 'info';
            } else if (rawStatus === 'confirmed' || rawStatus === 'booked' || rawStatus === 'pending') {
                displayStatus = 'Succeeded';
                variant = 'success';
            } else {
                displayStatus = row.status || (rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1));
                variant = 'secondary';
            }

            return (
                <div className="flex items-center min-h-[22px]">
                    <Badge variant={variant} className="text-[10px] font-semibold whitespace-nowrap px-2 py-0.5 rounded">
                        {displayStatus}
                    </Badge>
                </div>
            );
        }
    },
    {
        id: 'payment_method',
        label: 'Payment Method',
        sortable: true,
        className: 'min-w-[140px] whitespace-nowrap',
        render: (row: any) => {
            const cardLast4 = row.card_last4 || '4242';
            const cardBrand = (row.card_brand || 'visa').toUpperCase();
            const isPayLater = String(row.payment_method || row.payment_status || '').toLowerCase().includes('later');

            if (isPayLater) {
                return (
                    <div className="flex items-center gap-1.5 min-h-[22px]">
                        <span className="px-1.5 py-0.5 text-[9.5px] font-extrabold uppercase tracking-wider rounded bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                            CREDIT
                        </span>
                        <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                            Net-30 Pay Later
                        </span>
                    </div>
                );
            }

            return (
                <div className="flex items-center gap-1.5 min-h-[22px]">
                    <span className="px-1.5 py-0.5 text-[9.5px] font-extrabold uppercase tracking-wider rounded bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                        {cardBrand === 'VISA' ? 'VISA' : cardBrand}
                    </span>
                    <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                        •••• {cardLast4}
                    </span>
                </div>
            );
        }
    },
    {
        id: 'description',
        label: 'Description',
        sortable: true,
        className: 'min-w-[240px] whitespace-nowrap',
        render: (row: any) => {
            const rawId = row.order_number || row.order_id || (row.id ? `ORD-${String(row.id).padStart(4, '0')}` : 'ORD-0001');
            const targetId = row.rawId || row.raw_id || row.id || rawId;
            const quoteId = row.quote_id || row.quote_request_id || row.id || 1;
            const desc = row.description || row.title || `CarrierDirect Escrow: Quote #${quoteId}`;

            return (
                <div className="flex items-center gap-2 min-h-[22px]">
                    <Link
                        to={`/customer/orders/${encryptId(targetId)}`}
                        className="text-xs font-semibold text-slate-800 dark:text-slate-200 hover:text-[#ff4a1f] hover:underline whitespace-nowrap transition-colors"
                        title={desc}
                    >
                        {desc}
                    </Link>
                </div>
            );
        }
    },
    {
        id: 'customer_email',
        label: 'Customer',
        sortable: true,
        className: 'min-w-[180px] whitespace-nowrap',
        render: (row: any) => {
            const email = row.customer_email || row.supplier_email || row.supplier?.email || 'customer@carrierdirect.com';

            return (
                <div className="flex items-center min-h-[22px]">
                    <span className="text-xs text-slate-600 dark:text-slate-400 font-normal whitespace-nowrap" title={email}>
                        {email}
                    </span>
                </div>
            );
        }
    },
    {
        id: 'date',
        label: 'Date',
        sortable: true,
        className: 'min-w-[160px] whitespace-nowrap',
        render: (row: any) => {
            const dateStr = row.created_at_time || row.date_human || row.created_at || row.date || row.order_date;
            return (
                <div className="flex items-center min-h-[22px]">
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-normal whitespace-nowrap">
                        {formatStripeDateTime(dateStr)}
                    </span>
                </div>
            );
        }
    }
];

export default getOrderColumns;
