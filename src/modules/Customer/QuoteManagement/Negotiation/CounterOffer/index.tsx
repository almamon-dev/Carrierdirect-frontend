import React, { useState } from 'react';
import Button from '@/components/ui/button';
import { CheckCircle2, XCircle, Clock, Tag } from 'lucide-react';
import { DeclineOfferModal } from '../Chat/components/DeclineOfferModal';

export default function CounterOfferMessage({
    msg,
    onAccept,
    onReject
}: {
    msg: any;
    onAccept?: (msg: any) => void;
    onReject?: (msg: any, reason?: string) => void;
}) {
    const [localStatus, setLocalStatus] = useState<'pending' | 'accepted' | 'rejected' | null>(null);
    const [localReason, setLocalReason] = useState<string>('');
    const [showDeclineModal, setShowDeclineModal] = useState(false);

    const status = localStatus || msg.status || 'pending';
    const declineReason = localReason || msg.declineReason || msg.reason || '';
    const isSentByMe = msg.title?.toLowerCase().includes('submitted') || msg.isSent;
    const currency = msg.currency || '€';

    const handleConfirmDecline = (reasonText: string) => {
        setLocalStatus('rejected');
        setLocalReason(reasonText);
        onReject?.(msg, reasonText);
    };

    return (
        <div className="flex justify-center my-3 font-sans">
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 w-full max-w-[360px] mx-auto text-left shadow-xs space-y-3 font-sans">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-orange-50 text-[#FF4A1F] flex items-center justify-center shrink-0">
                            <Tag className="w-3.5 h-3.5" />
                        </div>
                        <div>
                            <h3 className="text-[13px] font-bold text-slate-900 leading-tight">{msg.title || 'Counter offer'}</h3>
                            <p className="text-[10.5px] text-slate-400 font-medium mt-0.5">{msg.time}</p>
                        </div>
                    </div>

                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${status === 'accepted' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                            status === 'rejected' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                                'bg-amber-50 text-amber-700 border border-amber-200/80'
                        }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${status === 'accepted' ? 'bg-emerald-500' :
                                status === 'rejected' ? 'bg-rose-500' : 'bg-amber-500 animate-pulse'
                            }`} />
                        {status === 'accepted' ? 'Accepted' : status === 'rejected' ? 'Declined' : 'Pending review'}
                    </span>
                </div>

                {/* Revision Reason / Offer Note */}
                {(msg.notes || msg.revisionReason || msg.note || msg.text) && (
                    <div className="bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-0.5">
                            Revision Reason / Note
                        </span>
                        <p className="text-[12px] text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
                            {msg.notes || msg.revisionReason || msg.note || msg.text}
                        </p>
                    </div>
                )}

                {/* Price Comparison */}
                <div className="flex items-center justify-between pt-2.5 pb-0.5 border-t border-slate-100">
                    <div>
                        <span className="text-[11px] text-slate-400 font-medium block">Previous offer</span>
                        <p className="text-[13px] font-semibold text-slate-400 line-through mt-0.5">
                            {currency} {msg.previousTotal ? msg.previousTotal.toLocaleString() : '42,500'}
                        </p>
                    </div>

                    <div className="text-right">
                        <span className="text-[11px] text-[#FF4A1F] font-semibold block">New proposed price</span>
                        <p className="text-lg font-bold text-[#FF4A1F] leading-tight mt-0.5">
                            {currency} {msg.newTotal ? msg.newTotal.toLocaleString() : '40,000'}
                        </p>
                    </div>
                </div>

                {/* Status Badges or Action Buttons */}
                {status === 'accepted' && (
                    <div className="flex items-center justify-center gap-1.5 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200/80 rounded-xl text-xs font-semibold">
                        <CheckCircle2 size={15} className="text-emerald-600" />
                        <span>Counter offer accepted & confirmed</span>
                    </div>
                )}

                {status === 'rejected' && (
                    <div className="flex items-center justify-center gap-1.5 py-2 bg-rose-50 text-rose-700 border border-rose-200/80 rounded-xl text-xs font-semibold">
                        <XCircle size={15} className="text-rose-600" />
                        <span>Counter offer declined</span>
                    </div>
                )}

                {status === 'pending' && (
                    isSentByMe ? (
                        <div className="flex items-center justify-center gap-1.5 py-2 bg-amber-50 text-amber-800 border border-amber-200/80 rounded-xl text-xs font-semibold">
                            <Clock size={14} className="text-amber-600 animate-pulse" />
                            <span>Awaiting response from other party...</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 pt-1">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setShowDeclineModal(true)}
                                className="flex-1 h-9 rounded-[3px] text-slate-700 border-slate-200 hover:bg-slate-50 text-xs font-semibold cursor-pointer transition-all"
                            >
                                Decline offer
                            </Button>
                            <Button
                                type="button"
                                variant="primary"
                                onClick={() => {
                                    setLocalStatus('accepted');
                                    onAccept?.(msg);
                                }}
                                className="flex-1 h-9 rounded-[3px] bg-[#FF4A1F] hover:bg-[#E03E15] text-white text-xs font-semibold cursor-pointer shadow-xs transition-all"
                            >
                                Accept offer
                            </Button>
                        </div>
                    )
                )}
            </div>

            <DeclineOfferModal
                isOpen={showDeclineModal}
                onClose={() => setShowDeclineModal(false)}
                offerAmount={msg.newTotal || msg.amount}
                currency={currency}
                onConfirm={handleConfirmDecline}
            />
        </div>
    );
}
