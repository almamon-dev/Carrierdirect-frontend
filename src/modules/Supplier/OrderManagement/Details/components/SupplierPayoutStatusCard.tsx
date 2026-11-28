import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    AlertTriangle,
    CalendarClock,
    CheckCircle2,
    Clock,
    ExternalLink,
    Loader2,
    ShieldAlert,
    Wallet,
} from 'lucide-react';

export interface SupplierPayoutStatus {
    order_id: number;
    order_number?: string;
    payment_model?: string;
    payment_term?: string;
    is_pay_later?: boolean;
    payout_status?: string;
    expected_payout_at?: string | null;
    supplier_accepted_pay_later_at?: string | null;
    stripe_connect_linked?: boolean;
    pod_status?: string | null;
    pod_auto_approve_at?: string | null;
    pod_is_flagged?: boolean;
    has_open_dispute?: boolean;
    dispute?: {
        dispute_number?: string;
        status?: string;
        reason?: string;
    } | null;
    pay_later_invoice?: {
        invoice_number?: string;
        status?: string;
        due_at?: string | null;
        paid_at?: string | null;
        is_overdue?: boolean;
    } | null;
    transfer?: {
        id?: number;
        status?: string;
        stripe_transfer_id?: string | null;
        gross_amount_cents?: number;
        platform_fee_cents?: number;
        stripe_fee_cents?: number;
        net_amount_cents?: number;
        reversed_amount_cents?: number;
        currency?: string;
        hold_reason?: string | null;
        failure_code?: string | null;
        next_retry_at?: string | null;
        released_at?: string | null;
    } | null;
}

interface SupplierPayoutStatusCardProps {
    payoutStatus: SupplierPayoutStatus | null;
    onAcceptPayLaterTerms: () => Promise<void>;
}

const PAYOUT_STATUS_BADGES: Record<string, { label: string; classes: string }> = {
    completed: {
        label: 'Payout Released',
        classes: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60',
    },
    released: {
        label: 'Payout Released',
        classes: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60',
    },
    transfer_pending_account: {
        label: 'Connect Account Required',
        classes: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60',
    },
    held: {
        label: 'Payout Held (Under Review)',
        classes: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/60',
    },
    disputed: {
        label: 'Held — Open Dispute',
        classes: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/60',
    },
    pending: {
        label: 'Pending Delivery / Release',
        classes: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
    },
};

export const SupplierPayoutStatusCard: React.FC<SupplierPayoutStatusCardProps> = ({
    payoutStatus,
    onAcceptPayLaterTerms,
}) => {
    const [accepting, setAccepting] = useState(false);

    if (!payoutStatus) return null;

    const statusKey = String(payoutStatus.payout_status || payoutStatus.transfer?.status || 'pending').toLowerCase();
    const badge = PAYOUT_STATUS_BADGES[statusKey] || {
        label: statusKey.replace(/_/g, ' '),
        classes: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/60',
    };

    const handleConfirmTerms = async () => {
        setAccepting(true);
        try {
            await onAcceptPayLaterTerms();
        } finally {
            setAccepting(false);
        }
    };

    const currency = (payoutStatus.transfer?.currency || 'EUR').toUpperCase();
    const netAmountMajor = typeof payoutStatus.transfer?.net_amount_cents === 'number'
        ? (payoutStatus.transfer.net_amount_cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        : null;

    return (
        <div className="bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-[4px] p-4 shadow-2xs space-y-3 text-xs font-sans">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center gap-2">
                    <Wallet size={15} className="text-[#ff4a1f] shrink-0" />
                    <span className="font-bold text-slate-900 dark:text-slate-100">
                        Escrow & Settlement Tracker
                    </span>
                    {payoutStatus.is_pay_later ? (
                        <span className="px-2 py-0.5 rounded-[4px] text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800/60">
                            Pay Later (Net-30)
                        </span>
                    ) : (
                        <span className="px-2 py-0.5 rounded-[4px] text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700">
                            Escrow Hold
                        </span>
                    )}
                </div>

                <span className={`px-2 py-0.5 rounded-[4px] text-[10.5px] font-semibold border capitalize ${badge.classes}`}>
                    {badge.label}
                </span>
            </div>

            {(!payoutStatus.stripe_connect_linked || statusKey === 'transfer_pending_account') && (
                <div className="p-2.5 bg-amber-50 dark:bg-amber-950/35 border border-amber-200 dark:border-amber-800/60 rounded-[4px] flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200">
                        <AlertTriangle size={14} className="text-amber-600 shrink-0" />
                        <span className="text-[11px]">
                            Connect your Stripe payout account so funds can be transferred automatically.
                        </span>
                    </div>
                    <Link
                        to="/supplier/wallet"
                        className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded text-[11px] font-semibold inline-flex items-center gap-1"
                    >
                        <span>Setup Payouts</span>
                        <ExternalLink size={11} />
                    </Link>
                </div>
            )}

            {payoutStatus.has_open_dispute && payoutStatus.dispute && (
                <div className="p-2.5 bg-rose-50 dark:bg-rose-950/35 border border-rose-200 dark:border-rose-800/60 rounded-[4px] flex items-start gap-2 text-rose-800 dark:text-rose-200">
                    <ShieldAlert size={14} className="text-rose-600 shrink-0 mt-0.5" />
                    <div className="space-y-0.5 text-[11px]">
                        <div className="font-bold">
                            Payout Held — Active Dispute ({payoutStatus.dispute.dispute_number || payoutStatus.dispute.status})
                        </div>
                        {payoutStatus.dispute.reason && <p>{payoutStatus.dispute.reason}</p>}
                    </div>
                </div>
            )}

            {payoutStatus.pod_is_flagged && (
                <div className="p-2.5 bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 rounded-[4px] flex items-center gap-2 text-amber-800 dark:text-amber-200 text-[11px]">
                    <AlertTriangle size={14} className="text-amber-600 shrink-0" />
                    <span>POD has been flagged for geofence / compliance verification prior to payout release.</span>
                </div>
            )}

            {payoutStatus.is_pay_later && !payoutStatus.supplier_accepted_pay_later_at && (
                <div className="p-2.5 bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/60 rounded-[4px] flex flex-wrap items-center justify-between gap-2">
                    <div className="text-[11px] text-indigo-900 dark:text-indigo-200">
                        <span className="font-bold">Action Required:</span> Confirm Net-30 Pay Later settlement terms for this order.
                    </div>
                    <button
                        type="button"
                        disabled={accepting}
                        onClick={handleConfirmTerms}
                        className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-[11px] font-semibold inline-flex items-center gap-1 cursor-pointer disabled:opacity-50"
                    >
                        {accepting ? <Loader2 size={11} className="animate-spin" /> : <CheckCircle2 size={11} />}
                        <span>Confirm Net-30 Terms</span>
                    </button>
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-[11px]">
                <div className="p-2.5 bg-slate-50 dark:bg-slate-900/40 rounded border border-slate-100 dark:border-slate-800">
                    <div className="text-slate-500 flex items-center gap-1">
                        <CalendarClock size={12} /> Expected Payout
                    </div>
                    <div className="font-semibold text-slate-900 dark:text-white mt-0.5">
                        {payoutStatus.expected_payout_at
                            ? new Date(payoutStatus.expected_payout_at).toLocaleDateString()
                            : payoutStatus.is_pay_later
                                ? '30 days after POD'
                                : 'After POD verification'}
                    </div>
                </div>

                {payoutStatus.pod_auto_approve_at && (
                    <div className="p-2.5 bg-slate-50 dark:bg-slate-900/40 rounded border border-slate-100 dark:border-slate-800">
                        <div className="text-slate-500 flex items-center gap-1">
                            <Clock size={12} /> 48h POD Auto-Approval
                        </div>
                        <div className="font-semibold text-slate-900 dark:text-white mt-0.5">
                            {new Date(payoutStatus.pod_auto_approve_at).toLocaleString()}
                        </div>
                    </div>
                )}

                {payoutStatus.pay_later_invoice && (
                    <div className="p-2.5 bg-slate-50 dark:bg-slate-900/40 rounded border border-slate-100 dark:border-slate-800">
                        <div className="text-slate-500">Customer Invoice ({payoutStatus.pay_later_invoice.invoice_number})</div>
                        <div className="font-semibold text-slate-900 dark:text-white mt-0.5 capitalize">
                            {payoutStatus.pay_later_invoice.status}
                            {payoutStatus.pay_later_invoice.is_overdue ? ' (Overdue)' : ''}
                        </div>
                    </div>
                )}

                {payoutStatus.transfer?.stripe_transfer_id && (
                    <div className="p-2.5 bg-emerald-50/50 dark:bg-emerald-950/20 rounded border border-emerald-200/70 dark:border-emerald-900/40">
                        <div className="text-emerald-700 dark:text-emerald-400">Stripe Transfer</div>
                        <div className="font-mono font-bold text-slate-900 dark:text-white mt-0.5 truncate" title={payoutStatus.transfer.stripe_transfer_id}>
                            {payoutStatus.transfer.stripe_transfer_id}
                            {netAmountMajor ? ` • ${currency} ${netAmountMajor}` : ''}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SupplierPayoutStatusCard;

