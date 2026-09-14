import React from 'react';
import Modal from '@/components/modals/modal';
import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';
import { Building2, CheckCircle2, Clock, XCircle, ArrowUpRight, Receipt, ShieldCheck } from 'lucide-react';
import { WithdrawalItem } from '../index';

interface WithdrawalDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    item: WithdrawalItem | null;
}

export const WithdrawalDetailsModal: React.FC<WithdrawalDetailsModalProps> = ({
    isOpen,
    onClose,
    item,
}) => {
    if (!item) return null;

    const s = item.status;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`Settlement Details - ${item.id}`}
            size="md"
        >
            <div className="space-y-4 pt-1 font-sans">
                {/* Header Summary Box */}
                <div
    className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-[4px] border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between">
                    <div>
                        <span className="text-[11px] font-bold text-slate-400  tracking-wider block mb-0.5">
                            Net Payout Amount
                        </span>
                        <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                            {item.netAmount}
                        </p>
                    </div>

                    <Badge
                        variant="secondary"
                        className={`text-xs font-semibold px-3 py-1 border ${
                            s === 'Completed'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/50'
                                : s === 'Processing'
                                ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/50'
                                : 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-900/50'
                        }`}
                    >
                        {s === 'Completed' ? <CheckCircle2 size={13} className="mr-1 inline text-emerald-500" /> : s === 'Processing' ? <Clock size={13} className="mr-1 inline text-amber-500" /> : <XCircle size={13} className="mr-1 inline text-rose-500" />}
                        {s}
                    </Badge>
                </div>

                {/* Details Breakdown */}
                <div className="space-y-2.5 text-xs">
                    <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                        <span className="text-slate-500 dark:text-slate-400 font-medium">Transaction ID</span>
                        <span className="font-bold text-slate-900 dark:text-slate-100 font-mono">{item.id}</span>
                    </div>

                    <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                        <span className="text-slate-500 dark:text-slate-400 font-medium">Initiated Date</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{item.date}</span>
                    </div>

                    <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                        <span className="text-slate-500 dark:text-slate-400 font-medium">Payout Method</span>
                        <div className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200">
                            <Building2 size={13} className="text-[#635bff]" />
                            <span>{item.method}</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                        <span className="text-slate-500 dark:text-slate-400 font-medium">Reference Code</span>
                        <span className="font-mono text-slate-700 dark:text-slate-300">{item.reference}</span>
                    </div>

                    <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                        <span className="text-slate-500 dark:text-slate-400 font-medium">Gross Total</span>
                        <span className="font-bold text-slate-900 dark:text-slate-100">{item.amount}</span>
                    </div>

                    <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                        <span className="text-slate-500 dark:text-slate-400 font-medium">Carrier Direct Platform Fee</span>
                        <span className="font-semibold text-rose-600 dark:text-rose-400">-{item.fee}</span>
                    </div>
                </div>

                {/* Stripe Trust Note */}
                <div
    className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-200/60 dark:border-slate-700/60 flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-300">
                    <ShieldCheck size={16} className="text-[#635bff] shrink-0" />
                    <span>Payouts are securely processed and transferred directly to your bank account via Stripe Connect.</span>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={onClose}
                        className="h-9 px-4 text-xs font-semibold cursor-pointer"
                    >
                        Close
                    </Button>
                </div>
            </div>
        </Modal>
    );
};
