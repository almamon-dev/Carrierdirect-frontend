import React, { useState } from 'react';
import Button from '@/components/ui/button';
import { CheckCircle2, XCircle, Clock, Tag } from 'lucide-react';

export default function CounterOfferMessage({
    msg,
    onAccept,
    onReject
}: {
    msg: any;
    onAccept?: (msg: any) => void;
    onReject?: (msg: any) => void;
}) {
    const [status, setStatus] = useState<'pending' | 'accepted' | 'rejected'>(msg.status || 'pending');
    const isSentByMe = msg.title?.toLowerCase().includes('submitted') || msg.isSent;
    const currency = msg.currency || '€';

    return (
        <div className="flex justify-center my-3 font-sans">
            <div className="bg-white border border-slate-200 rounded-xl p-3.5 w-full max-w-[360px] mx-auto text-left shadow-xs space-y-2.5 font-sans">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-orange-50 text-[#FF4A1F] flex items-center justify-center font-bold shrink-0">
                            <Tag className="w-3.5 h-3.5" />
                        </div>
                        <div>
                            <h3 className="text-xs font-bold text-slate-900 leading-tight">{msg.title || 'Counter offer'}</h3>
                            <p className="text-[10.5px] text-slate-400 font-medium">{msg.time}</p>
                        </div>
                    </div>

                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10.5px] font-semibold ${
                        status === 'accepted' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        status === 'rejected' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                        'bg-amber-50 text-amber-700 border border-amber-200/80'
                    }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                            status === 'accepted' ? 'bg-emerald-500' :
                            status === 'rejected' ? 'bg-rose-500' : 'bg-amber-500 animate-pulse'
                        }`} />
                        {status === 'accepted' ? 'Accepted' : status === 'rejected' ? 'Declined' : 'Pending review'}
                    </span>
                </div>

                {/* Offer Note */}
                {msg.text && (
                    <p className="text-[11.5px] text-slate-600 leading-relaxed font-normal bg-slate-50 p-2 rounded-md border border-slate-100">
                        {msg.text}
                    </p>
                )}

                {/* Price Comparison Card (Compact, No Uppercase) */}
                <div className="bg-slate-50/80 rounded-md p-2.5 flex items-center justify-between gap-3 border border-slate-200/70">
                    <div className="space-y-0.5">
                        <span className="text-[11px] text-slate-500 font-medium block">Previous offer</span>
                        <p className="text-xs font-semibold text-slate-400 line-through">
                            {currency} {msg.previousTotal ? msg.previousTotal.toLocaleString() : '42,500'}
                        </p>
                    </div>

                    <div className="w-px h-7 bg-slate-200" />

                    <div className="space-y-0.5 text-right">
                        <span className="text-[11px] text-[#FF4A1F] font-semibold block">New proposed price</span>
                        <p className="text-base font-extrabold text-[#FF4A1F]">
                            {currency} {msg.newTotal ? msg.newTotal.toLocaleString() : '40,000'}
                        </p>
                    </div>
                </div>

                {/* Status Badges or Action Buttons */}
                {status === 'accepted' && (
                    <div className="flex items-center justify-center gap-1.5 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200/80 rounded-md text-[11px] font-semibold">
                        <CheckCircle2 size={14} className="text-emerald-600" />
                        <span>Counter offer accepted & confirmed</span>
                    </div>
                )}

                {status === 'rejected' && (
                    <div className="flex items-center justify-center gap-1.5 py-1.5 bg-rose-50 text-rose-700 border border-rose-200/80 rounded-md text-[11px] font-semibold">
                        <XCircle size={14} className="text-rose-600" />
                        <span>Counter offer declined</span>
                    </div>
                )}

                {status === 'pending' && (
                    isSentByMe ? (
                        <div className="flex items-center justify-center gap-1.5 py-1.5 bg-amber-50 text-amber-800 border border-amber-200/80 rounded-md text-[11px] font-semibold">
                            <Clock size={13} className="text-amber-600 animate-pulse" />
                            <span>Awaiting response from other party...</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 pt-0.5">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setStatus('rejected');
                                    onReject?.(msg);
                                }}
                                className="flex-1 h-8 rounded-md text-slate-700 border-slate-200 hover:bg-slate-100 text-xs font-semibold cursor-pointer transition-all"
                            >
                                Decline offer
                            </Button>
                            <Button
                                type="button"
                                variant="primary"
                                onClick={() => {
                                    setStatus('accepted');
                                    onAccept?.(msg);
                                }}
                                className="flex-1 h-8 rounded-md bg-[#FF4A1F] hover:bg-[#E03E15] text-white text-xs font-semibold cursor-pointer shadow-xs transition-all"
                            >
                                Accept offer
                            </Button>
                        </div>
                    )
                )}
            </div>
        </div>
    );
}
