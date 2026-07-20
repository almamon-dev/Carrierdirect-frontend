import React from 'react';
import { FileText, Check, CheckCircle2 } from 'lucide-react';
import Button from '@/components/ui/button';

export default function PODAction({ isPodAccepted, setIsPodAccepted }: { isPodAccepted: boolean, setIsPodAccepted: (v: boolean) => void }) {
    if (isPodAccepted) {
        return (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center gap-3 shadow-sm">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                    <CheckCircle2 size={16} />
                </div>
                <div>
                    <h4 className="text-[14px] font-bold text-emerald-900">Order Completed</h4>
                    <p className="text-[12px] text-emerald-700 mt-0.5 leading-snug">Delivery accepted successfully.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex flex-col gap-2 shadow-sm">
            <div className="flex items-start gap-2">
                <div className="mt-0.5 text-amber-600"><FileText size={18} /></div>
                <div>
                    <h4 className="text-[14px] font-bold text-amber-900">Proof of Delivery Received</h4>
                    <p className="text-[12px] text-amber-700 mt-0.5 leading-snug">Please review the POD document and accept to complete the order.</p>
                </div>
            </div>
            <div className="flex gap-2 mt-1">
                <Button variant="outline" className="flex-1 h-8 text-[12px] font-semibold text-amber-700 border-amber-300 hover:bg-amber-100 bg-white">View POD</Button>
                <Button variant="primary" className="flex-1 h-8 text-[12px] font-semibold bg-amber-600 hover:bg-amber-700 text-white" onClick={() => setIsPodAccepted(true)}>
                    <Check size={14} className="mr-1.5" /> Accept Delivery
                </Button>
            </div>
        </div>
    );
}
