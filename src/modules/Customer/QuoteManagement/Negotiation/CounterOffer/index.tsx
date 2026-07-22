import React, { useState } from 'react';
import Button from '@/components/ui/button';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';

export default function CounterOfferMessage({ msg }: { msg: any }) {
    const [status, setStatus] = useState<'pending' | 'accepted' | 'rejected'>('pending');

    const isSentByMe = msg.title?.toLowerCase().includes('submitted') || msg.isSent;

    return (
        <div className="flex justify-center my-5">
            <div className="bg-white border border-slate-200 rounded-2xl p-4 w-full max-w-sm mx-auto text-center shadow-[0_2px_8px_rgb(0,0,0,0.04)]">
                <div className="flex items-center justify-center gap-1.5 mb-1">
                    <div className={`w-2 h-2 rounded-full ${
                        status === 'accepted' ? 'bg-emerald-500' :
                        status === 'rejected' ? 'bg-rose-500' : 'bg-amber-500'
                    }`}></div>
                    <h3 className="text-[13px] font-bold text-slate-800">{msg.title || 'Counter Offer'}</h3>
                </div>
                <p className="text-[11.5px] text-slate-500 mb-3">{msg.text || msg.time}</p>
                
                <div className="bg-slate-50 rounded-xl p-3 mb-4 flex items-center justify-center gap-5">
                    <div className="text-center">
                        <p className="text-[11px] text-slate-500 font-semibold mb-0.5">Previous</p>
                        <p className="text-[13px] font-bold text-slate-400 line-through">€ {msg.previousTotal?.toLocaleString()}</p>
                    </div>
                    <div className="w-px h-8 bg-slate-200"></div>
                    <div className="text-center">
                        <p className="text-[11px] text-[#FF4A1F] font-bold mb-0.5">New Offer</p>
                        <p className="text-[15px] font-bold text-[#FF4A1F]">€ {msg.newTotal?.toLocaleString()}</p>
                    </div>
                </div>

                {status === 'accepted' && (
                    <div className="flex items-center justify-center gap-1.5 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold">
                        <CheckCircle2 size={16} className="text-emerald-600" />
                        <span>Offer Accepted</span>
                    </div>
                )}

                {status === 'rejected' && (
                    <div className="flex items-center justify-center gap-1.5 py-2 bg-rose-50 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold">
                        <XCircle size={16} className="text-rose-600" />
                        <span>Offer Rejected</span>
                    </div>
                )}

                {status === 'pending' && (
                    isSentByMe ? (
                        <div className="flex items-center justify-center gap-1.5 py-2 bg-amber-50 text-amber-700 border border-amber-200/80 rounded-xl text-xs font-bold">
                            <Clock size={15} className="text-amber-600 animate-pulse" />
                            <span>Awaiting response from party...</span>
                        </div>
                    ) : (
                        <div className="flex gap-2">
                            <Button 
                                type="button"
                                variant="outline" 
                                onClick={() => setStatus('rejected')}
                                className="flex-1 h-9 rounded-full text-slate-700 border-slate-200 hover:bg-slate-100 text-[12.5px] font-semibold cursor-pointer"
                            >
                                Reject
                            </Button>
                            <Button 
                                type="button"
                                variant="primary" 
                                onClick={() => setStatus('accepted')}
                                className="flex-1 h-9 rounded-full bg-[#FF4A1F] hover:bg-[#E03E15] text-white text-[12.5px] font-semibold cursor-pointer shadow-2xs"
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
