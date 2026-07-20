import React from 'react';
import Button from '@/components/ui/button';

export default function CounterOfferMessage({ msg }: { msg: any }) {
    return (
        <div className="flex justify-center my-5">
            <div className="bg-white border border-slate-200 rounded-2xl p-4 w-full max-w-sm mx-auto text-center shadow-[0_2px_8px_rgb(0,0,0,0.04)]">
                <div className="flex items-center justify-center gap-1.5 mb-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    <h3 className="text-[14px] font-bold text-slate-900">{msg.title}</h3>
                </div>
                <p className="text-[12px] text-slate-500 mb-4">{msg.time}</p>
                
                <div className="bg-slate-50 rounded-xl p-3 mb-4 flex items-center justify-center gap-5">
                    <div className="text-center">
                        <p className="text-[11px] text-slate-500 font-semibold mb-0.5">Previous</p>
                        <p className="text-[13px] font-bold text-slate-400 line-through">BDT {msg.previousTotal?.toLocaleString()}</p>
                    </div>
                    <div className="w-px h-8 bg-slate-200"></div>
                    <div className="text-center">
                        <p className="text-[11px] text-emerald-600 font-bold mb-0.5">New Offer</p>
                        <p className="text-[15px] font-black text-emerald-600">BDT {msg.newTotal?.toLocaleString()}</p>
                    </div>
                </div>

                <div className="flex gap-2">
                    <Button variant="outline" className="flex-1 h-9 rounded-full text-slate-700 border-slate-200 hover:bg-slate-100 text-[13px] font-semibold">
                        Reject
                    </Button>
                    <Button variant="primary" className="flex-1 h-9 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-[13px] font-semibold">
                        Accept Offer
                    </Button>
                </div>
            </div>
        </div>
    );
}
