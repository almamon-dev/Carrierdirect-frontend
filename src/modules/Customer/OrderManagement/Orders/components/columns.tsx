import { Column } from '@/components/tables/data-table';
import { StatusBadge, StatusCategory } from '@/components/common/StatusBadge';
import { encryptId } from '@/lib/encryption';
import { Link } from 'react-router-dom';
import { CustomerOrderItem } from '../types';

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
            },
        },
        {
            id: 'amount',
            label: 'Amount',
            sortable: true,
            className: 'min-w-[150px] whitespace-nowrap',
            render: (row) => {
                const platformFee = Number(
                    row.platform_fee ??
                    row.platform_charge ??
                    (row as any).quote?.platform_fee ??
                    0
                );
                const platformPercent = Number(
                    row.platform_charge_percent ??
                    row.platform_fee_percent ??
                    (row as any).quote?.platform_charge_percent ??
                    0
                );

                // Base freight / quotation amount without platform charge
                let baseAmtVal = Number(row.subtotal ?? row.base_amount ?? row.base_price ?? 0);
                if (!baseAmtVal || isNaN(baseAmtVal) || baseAmtVal <= 0) {
                    const rawVal = Number(row.amount_raw ?? row.gross_amount ?? row.total_amount ?? 0);
                    if (rawVal > 0) {
                        baseAmtVal = platformFee > 0 && rawVal > platformFee ? rawVal - platformFee : rawVal;
                    }
                }

                let formattedAmt = '€0.00 EUR';
                if (!isNaN(baseAmtVal) && baseAmtVal > 0) {
                    formattedAmt = `€${baseAmtVal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} EUR`;
                } else if (row.subtotal_formatted) {
                    formattedAmt = row.subtotal_formatted.includes('EUR') ? row.subtotal_formatted : `${row.subtotal_formatted} EUR`;
                } else if (row.base_amount_formatted) {
                    formattedAmt = row.base_amount_formatted.includes('EUR') ? row.base_amount_formatted : `${row.base_amount_formatted} EUR`;
                } else if (row.amount) {
                    formattedAmt = String(row.amount).includes('EUR') ? String(row.amount) : `${row.amount} EUR`;
                }

                return (
                    <div className="flex flex-col min-h-[22px] justify-center py-0.5">
                        <span className="text-[13px] font-bold text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
                            {formattedAmt}
                        </span>
                        {platformFee > 0 && (
                            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 leading-tight mt-0.5 whitespace-nowrap">
                                +€{platformFee.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{platformPercent > 0 ? ` (${platformPercent}% platform charge)` : ' (platform charge)'}
                            </span>
                        )}
                    </div>
                );
            },
        },
        {
            id: 'status',
            label: 'Payment Status',
            sortable: true,
            className: 'min-w-[120px] whitespace-nowrap',
            render: (row) => {
                const payStatus = String(row.payment_status || '').toLowerCase().trim();
                const rawStatus = String(row.status_raw || row.status || '').toLowerCase().trim();
                const payMethod = String((row as any).payment_method || '').toLowerCase().trim();

                let displayStatus = 'Paid';
                let category: StatusCategory = 'success';

                if (payMethod.includes('later') || payStatus.includes('later')) {
                    displayStatus = payStatus === 'paid' ? 'Paid (Pay Later)' : 'Net-30 Pay Later';
                    category = payStatus === 'paid' ? 'success' : 'financial_hold';
                } else if (payStatus === 'paid' || rawStatus === 'paid' || rawStatus === 'confirmed' || rawStatus === 'completed' || rawStatus === 'won') {
                    displayStatus = 'Paid';
                    category = 'success';
                } else if (payStatus.includes('escrow')) {
                    displayStatus = 'In Escrow';
                    category = 'financial_hold';
                } else if (payStatus === 'refunded' || rawStatus.includes('cancel')) {
                    displayStatus = 'Refunded';
                    category = 'neutral';
                } else if (payStatus === 'pending' || payStatus === 'unpaid' || payStatus === 'due') {
                    displayStatus = 'Pending';
                    category = 'pending';
                }

                return (
                    <div className="flex items-center min-h-[22px]">
                        <StatusBadge status={displayStatus} category={category} />
                    </div>
                );
            },
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
                            <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">Net-30 Pay Later</span>
                        </div>
                    );
                }

                return (
                    <div className="flex items-center gap-1.5 min-h-[22px]">
                        <span className="px-1.5 py-0.5 text-[9.5px] font-extrabold uppercase tracking-wider rounded bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                            {cardBrand === 'VISA' ? 'VISA' : cardBrand}
                        </span>
                        <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">•••• {cardLast4}</span>
                    </div>
                );
            },
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
            },
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
            },
        }

    ];

export default getOrderColumns;
