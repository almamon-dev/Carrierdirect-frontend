import React, { useState } from 'react';
import Button from '@/components/ui/button';
import { CheckCircle2, XCircle, Clock, Tag, ArrowDown, Sparkles } from 'lucide-react';

export default function CounterOfferMessage({ msg }: { msg: any }) {
    const [status, setStatus] = useState<'pending' | 'accepted' | 'rejected'>('pending');

    const isSentByMe = msg.title?.toLowerCase().includes('submitted') || msg.isSent;

    return (
        <div className="flex justify-center my-6 font-sans">
            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 w-full max-w-md mx-auto text-left shadow-sm space-y-4 font-sans">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-md bg-orange-50 text-[#FF4A1F] flex items-center justify-center font-bold shrink-0">
                            <Tag className="w-4 h-4" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-slate-900 leading-tight">{msg.title || 'Counter Offer'}</h3>
                            <p className="text-xs text-slate-400 font-medium mt-0.5">{msg.time}</p>
                        </div>
                    </div>

                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${status === 'accepted' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                            status === 'rejected' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                                'bg-amber-50 text-amber-700 border border-amber-200/80'
                        }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${status === 'accepted' ? 'bg-emerald-500' :
                                status === 'rejected' ? 'bg-rose-500' : 'bg-amber-500 animate-pulse'
                            }`} />
                        {status === 'accepted' ? 'Accepted' : status === 'rejected' ? 'Rejected' : 'Pending Review'}
                    </span>
                </div>

                {/* Offer Note */}
                {msg.text && (
                    <p className="text-xs text-slate-600 leading-relaxed font-medium bg-slate-50 p-3 rounded-md border border-slate-100">
                        {msg.text}
                    </p>
                )}

                {/* Price Comparison Card */}
                <div className="bg-slate-50/90 rounded-md p-4 flex items-center justify-between gap-4 border border-slate-200/80">
                    <div className="space-y-0.5">
                        <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">Previous Offer</span>
                        <p className="text-sm font-bold text-slate-400 line-through">
                            € {msg.previousTotal ? msg.previousTotal.toLocaleString() : '42,500'}
                        </p>
                    </div>

                    <div className="w-px h-10 bg-slate-200/80" />

                    <div className="space-y-0.5 text-right">
                        <span className="text-[11px] text-[#FF4A1F] font-bold uppercase tracking-wider block">New Proposed Price</span>
                        <p className="text-xl font-black text-[#FF4A1F]">
                            € {msg.newTotal ? msg.newTotal.toLocaleString() : '40,000'}
                        </p>
                    </div>
                </div>

                {/* Status Badges or Action Buttons */}
                {status === 'accepted' && (
                    <div className="flex items-center justify-center gap-2 py-3 bg-emerald-50 text-emerald-700 border border-emerald-200/80 rounded-md text-xs font-bold">
                        <CheckCircle2 size={16} className="text-emerald-600" />
                        <span>Counter Offer Accepted & Confirmed</span>
                    </div>
                )}

                {status === 'rejected' && (
                    <div className="flex items-center justify-center gap-2 py-3 bg-rose-50 text-rose-700 border border-rose-200/80 rounded-md text-xs font-bold">
                        <XCircle size={16} className="text-rose-600" />
                        <span>Counter Offer Declined</span>
                    </div>
                )}

                {status === 'pending' && (
                    isSentByMe ? (
                        <div className="flex items-center justify-center gap-2 py-2.5 bg-amber-50 text-amber-800 border border-amber-200/80 rounded-md text-xs font-bold">
                            <Clock size={15} className="text-amber-600 animate-pulse" />
                            <span>Awaiting response from other party...</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3 pt-1">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setStatus('rejected')}
                                className="flex-1 h-10 rounded-md text-slate-700 border-slate-200 hover:bg-slate-100 text-xs font-bold cursor-pointer transition-all"
                            >
                                Decline Offer
                            </Button>
                            <Button
                                type="button"
                                variant="primary"
                                onClick={() => setStatus('accepted')}
                                className="flex-1 h-10 rounded-md bg-[#FF4A1F] hover:bg-[#E03E15] text-white text-xs font-bold cursor-pointer shadow-md transition-all"
                            >
                                Accept Offer
                            </Button>
                        </div>
                    )
                )}
            </div>
        </div>
    );
}
