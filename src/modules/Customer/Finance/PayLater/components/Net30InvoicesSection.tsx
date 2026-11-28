import React, { useState } from 'react';
import {
    AlertTriangle,
    Building2,
    CheckCircle2,
    Clock,
    Copy,
    Check,
    CreditCard,
    Loader2,
    ShieldAlert,
} from 'lucide-react';
import {
    BankTransferInstructions,
    StructuredPayLaterInvoice,
    StructuredPayLaterStats,
} from '../types';

interface Net30InvoicesSectionProps {
    invoices: StructuredPayLaterInvoice[];
    stats: StructuredPayLaterStats | null;
    onInitiateBankTransfer: (invoiceId: number) => Promise<BankTransferInstructions>;
    onCompleteSca: (invoice: StructuredPayLaterInvoice) => Promise<{ success: boolean; message?: string }>;
}

const STATUS_BADGE_MAP: Record<string, { label: string; classes: string }> = {
    open: {
        label: 'Open',
        classes: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60',
    },
    disputed: {
        label: 'Disputed (Clock Paused)',
        classes: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800/60',
    },
    paid: {
        label: 'Paid',
        classes: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60',
    },
    void: {
        label: 'Voided',
        classes: 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700',
    },
};

export const Net30InvoicesSection: React.FC<Net30InvoicesSectionProps> = ({
    invoices,
    stats,
    onInitiateBankTransfer,
    onCompleteSca,
}) => {
    const [busyId, setBusyId] = useState<number | null>(null);
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [activeWireInfo, setActiveWireInfo] = useState<BankTransferInstructions | null>(null);
    const [copiedRef, setCopiedRef] = useState(false);

    if (!stats?.has_overdue_block && invoices.length === 0) {
        return null;
    }

    const handleWireSelect = async (invoiceId: number) => {
        setBusyId(invoiceId);
        setFeedback(null);
        try {
            const info = await onInitiateBankTransfer(invoiceId);
            setActiveWireInfo(info);
            setFeedback({ type: 'success', text: `Bank transfer instructions ready for ${info.invoice_number}.` });
        } catch (err: any) {
            setFeedback({
                type: 'error',
                text: err?.data?.message || err?.message || 'Unable to generate bank transfer instructions.',
            });
        } finally {
            setBusyId(null);
        }
    };

    const handleSca = async (invoice: StructuredPayLaterInvoice) => {
        setBusyId(invoice.id);
        setFeedback(null);
        try {
            const res = await onCompleteSca(invoice);
            setFeedback({
                type: res.success ? 'success' : 'error',
                text: res.message || (res.success ? '3DS authentication completed.' : 'Authentication was not completed.'),
            });
        } catch (err: any) {
            setFeedback({
                type: 'error',
                text: err?.message || 'Failed to complete 3DS authentication.',
            });
        } finally {
            setBusyId(null);
        }
    };

    const handleCopyRef = (value: string) => {
        navigator.clipboard?.writeText(value);
        setCopiedRef(true);
        setTimeout(() => setCopiedRef(false), 1800);
    };

    return (
        <div className="space-y-2.5">
            {stats?.has_overdue_block && (
                <div className="p-3.5 bg-rose-50 dark:bg-rose-950/35 border border-rose-200 dark:border-rose-800/60 rounded-[4px] flex items-start gap-2.5 text-xs">
                    <ShieldAlert size={16} className="text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                    <div>
                        <div className="font-bold text-rose-900 dark:text-rose-200">
                            Pay Later Facility Temporarily Suspended (Overdue Invoice)
                        </div>
                        <p className="text-[11px] text-rose-700 dark:text-rose-300 mt-0.5">
                            You have overdue Net-30 invoices. New Pay Later bookings are blocked until overdue balances are settled via card authentication or SEPA/wire transfer.
                        </p>
                    </div>
                </div>
            )}

            {feedback && (
                <div
                    className={`p-2.5 rounded-[4px] border text-xs flex items-center justify-between gap-2 ${
                        feedback.type === 'success'
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/30 dark:border-emerald-800 dark:text-emerald-200'
                            : 'bg-rose-50 border-rose-200 text-rose-800 dark:bg-rose-950/30 dark:border-rose-800 dark:text-rose-200'
                    }`}
                >
                    <span>{feedback.text}</span>
                    <button
                        type="button"
                        onClick={() => setFeedback(null)}
                        className="text-[11px] underline cursor-pointer shrink-0"
                    >
                        Dismiss
                    </button>
                </div>
            )}

            {activeWireInfo && (
                <div className="p-3.5 bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/60 rounded-[4px] text-xs space-y-2">
                    <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 font-bold text-blue-900 dark:text-blue-200">
                            <Building2 size={15} className="text-blue-600 dark:text-blue-400 shrink-0" />
                            <span>SEPA / Wire Bank Transfer Instructions — {activeWireInfo.invoice_number}</span>
                        </div>
                        <button
                            type="button"
                            onClick={() => setActiveWireInfo(null)}
                            className="text-[11px] text-blue-700 dark:text-blue-300 hover:underline cursor-pointer"
                        >
                            Close
                        </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                        <div className="p-2 bg-white dark:bg-[#1e2329] rounded border border-blue-100 dark:border-blue-900/40">
                            <div className="text-slate-500">Amount Due</div>
                            <div className="font-bold text-slate-900 dark:text-white mt-0.5">{activeWireInfo.amount_formatted}</div>
                        </div>
                        <div className="p-2 bg-white dark:bg-[#1e2329] rounded border border-blue-100 dark:border-blue-900/40 sm:col-span-2 flex items-center justify-between gap-2">
                            <div>
                                <div className="text-slate-500">Payment Reference (Required in Memo)</div>
                                <div className="font-mono font-bold text-slate-900 dark:text-white mt-0.5">{activeWireInfo.reference}</div>
                            </div>
                            <button
                                type="button"
                                onClick={() => handleCopyRef(activeWireInfo.reference)}
                                className="px-2 py-1 text-[10.5px] font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded flex items-center gap-1 cursor-pointer shrink-0"
                            >
                                {copiedRef ? <Check size={11} /> : <Copy size={11} />}
                                <span>{copiedRef ? 'Copied' : 'Copy Ref'}</span>
                            </button>
                        </div>
                    </div>
                    {typeof activeWireInfo.instructions === 'object' && activeWireInfo.instructions ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-[11px]">
                            {Object.entries(activeWireInfo.instructions).map(([key, val]) => (
                                <div key={key} className="p-2 bg-white/80 dark:bg-[#1e2329] rounded border border-blue-100 dark:border-blue-900/40">
                                    <div className="text-slate-500 capitalize">{key.replace(/_/g, ' ')}</div>
                                    <div className="font-semibold text-slate-800 dark:text-slate-100 break-all mt-0.5">{String(val)}</div>
                                </div>
                            ))}
                        </div>
                    ) : activeWireInfo.instructions ? (
                        <p className="text-[11px] text-blue-800 dark:text-blue-200">{String(activeWireInfo.instructions)}</p>
                    ) : null}
                </div>
            )}

            {invoices.length > 0 && (
                <div className="bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-[4px] p-4 shadow-2xs space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2.5">
                        <div>
                            <h3 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                                <Clock size={14} className="text-[#ff4a1f]" />
                                <span>Net-30 Credit Ledger (Clock Starts at POD Submission)</span>
                            </h3>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                                Invoices lock in 30 days after Proof of Delivery is submitted. Disputes pause collection timers until resolved.
                            </p>
                        </div>
                        {stats && (
                            <div className="flex items-center gap-2 text-[11px] font-semibold">
                                <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                                    Open: {stats.open_count}
                                </span>
                                {stats.disputed_count > 0 && (
                                    <span className="px-2 py-0.5 rounded bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300">
                                        Disputed: {stats.disputed_count}
                                    </span>
                                )}
                                {stats.overdue_count > 0 && (
                                    <span className="px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300">
                                        Overdue: {stats.overdue_count}
                                    </span>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                        {invoices.map((inv) => {
                            const badge = STATUS_BADGE_MAP[inv.status] || STATUS_BADGE_MAP.open;
                            const isBusy = busyId === inv.id;

                            return (
                                <div key={inv.id} className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
                                    <div className="space-y-0.5 min-w-0">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="font-bold text-slate-900 dark:text-white font-mono">
                                                {inv.invoice_number}
                                            </span>
                                            {inv.order_number && (
                                                <span className="text-[11px] text-slate-500">Order {inv.order_number}</span>
                                            )}
                                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold border ${badge.classes}`}>
                                                {badge.label}
                                            </span>
                                            {inv.is_overdue && inv.status === 'open' && (
                                                <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 flex items-center gap-1">
                                                    <AlertTriangle size={10} /> Overdue
                                                </span>
                                            )}
                                            {inv.in_collections && (
                                                <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-rose-600 text-white">
                                                    In Collections
                                                </span>
                                            )}
                                        </div>

                                        <div className="text-[11px] text-slate-500 dark:text-slate-400 flex flex-wrap items-center gap-x-3 gap-y-0.5">
                                            {inv.supplier_name && <span>Carrier: {inv.supplier_name}</span>}
                                            {inv.pod_submitted_at ? (
                                                <span>
                                                    POD: {new Date(inv.pod_submitted_at).toLocaleDateString()}
                                                </span>
                                            ) : (
                                                <span>Due timer starts on delivery POD</span>
                                            )}
                                            {inv.due_at && (
                                                <span>
                                                    Due: <strong>{inv.due_date_formatted || new Date(inv.due_at).toLocaleDateString()}</strong>
                                                    {typeof inv.days_until_due === 'number' && inv.status === 'open' && (
                                                        <> ({inv.days_until_due >= 0 ? `${inv.days_until_due}d left` : `${Math.abs(inv.days_until_due)}d past due`})</>
                                                    )}
                                                </span>
                                            )}
                                            {inv.bank_transfer_reference && (
                                                <span className="font-mono text-blue-600 dark:text-blue-400">
                                                    Wire Ref: {inv.bank_transfer_reference}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                                        <span className="font-bold font-mono text-slate-900 dark:text-white mr-1">
                                            {inv.total_amount_formatted}
                                        </span>

                                        {inv.requires_sca_action && inv.sca_client_secret && inv.status === 'open' && (
                                            <button
                                                type="button"
                                                disabled={isBusy}
                                                onClick={() => handleSca(inv)}
                                                className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-[3px] text-[11px] font-semibold inline-flex items-center gap-1 cursor-pointer disabled:opacity-50"
                                            >
                                                {isBusy ? <Loader2 size={11} className="animate-spin" /> : <CreditCard size={11} />}
                                                <span>Complete 3DS Auth</span>
                                            </button>
                                        )}

                                        {inv.status === 'open' && (
                                            <button
                                                type="button"
                                                disabled={isBusy}
                                                onClick={() => handleWireSelect(inv.id)}
                                                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-[3px] text-[11px] font-semibold inline-flex items-center gap-1 cursor-pointer disabled:opacity-50"
                                            >
                                                {isBusy ? <Loader2 size={11} className="animate-spin" /> : <Building2 size={11} />}
                                                <span>{inv.bank_transfer_reference ? 'View Bank Transfer' : 'Pay by SEPA / Wire'}</span>
                                            </button>
                                        )}

                                        {inv.status === 'paid' && (
                                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                                                <CheckCircle2 size={12} /> Settled
                                            </span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Net30InvoicesSection;

