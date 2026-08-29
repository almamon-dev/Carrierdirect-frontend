import React, { useState } from 'react';
import { XCircle, AlertTriangle } from 'lucide-react';
import Modal from '@/components/modals/modal';
import Button from '@/components/ui/button';
import Textarea from '@/components/ui/textarea';

interface DeclineOfferModalProps {
    isOpen: boolean;
    onClose: () => void;
    offerAmount?: number;
    currency?: string;
    onConfirm: (reason: string) => void;
}

const QUICK_REASONS = [
    'Rate is over budget',
    'Delivery schedule changed',
    'Found another carrier',
    'Need different terms'
];

export function DeclineOfferModal({
    isOpen,
    onClose,
    offerAmount,
    currency = '€',
    onConfirm
}: DeclineOfferModalProps) {
    const [reason, setReason] = useState('');

    const handleSelectQuickReason = (text: string) => {
        setReason(text);
    };

    const handleDecline = (e: React.FormEvent) => {
        e.preventDefault();
        onConfirm(reason.trim());
        setReason('');
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Decline Counter Offer"
            size="md"
        >
            <form onSubmit={handleDecline} className="space-y-4 pt-1">
                <div className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-950/30 rounded-sm border border-red-200/80 dark:border-red-900/40">
                    <AlertTriangle className="text-red-500 shrink-0 mt-0.5" size={18} />
                    <div className="text-xs text-slate-700 dark:text-slate-300">
                        <p className="font-bold text-red-800 dark:text-red-300 mb-0.5">
                            Are you sure you want to decline this offer?
                        </p>
                        {offerAmount && (
                            <p className="text-slate-600 dark:text-slate-400">
                                Declining the proposed offer of <span className="font-bold text-slate-800 dark:text-slate-200">{currency} {offerAmount.toLocaleString()}</span>. You can state a reason to help reach an agreement.
                            </p>
                        )}
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        Quick Reason (Optional)
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                        {QUICK_REASONS.map((r) => (
                            <button
                                key={r}
                                type="button"
                                onClick={() => handleSelectQuickReason(r)}
                                className={`text-xs px-2.5 py-1 rounded-full border transition-all cursor-pointer ${reason === r
                                        ? 'bg-red-500 text-white border-red-500 font-semibold shadow-2xs'
                                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-red-300'
                                    }`}
                            >
                                {r}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Explanation / Note (Optional)
                    </label>
                    <Textarea
                        rows={3}
                        value={reason}
                        onChange={e => setReason(e.target.value)}
                        placeholder="Provide details or explain why this offer cannot be accepted..."
                        className="text-xs resize-none"
                    />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <Button type="button" variant="outline" size="sm" onClick={onClose}>
                        Keep Offer
                    </Button>
                    <Button
                        type="submit"
                        size="sm"
                        className="bg-red-500 hover:bg-red-600 text-white gap-1.5"
                    >
                        <XCircle size={15} />
                        Decline Offer
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
