import React from 'react';
import { FileText, Check, CheckCircle2, ShieldCheck } from 'lucide-react';
import Button from '@/components/ui/button';

export default function PODAction({ isPodAccepted, setIsPodAccepted }: { isPodAccepted: boolean, setIsPodAccepted: (v: boolean) => void }) {
    if (isPodAccepted) {
        return (
            <div className="bg-emerald-50 border border-emerald-200 rounded-md p-4 flex items-center gap-3 shadow-2xs font-sans">
                <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                    <CheckCircle2 size={18} />
                </div>
                <div>
                    <h4 className="text-xs font-bold text-emerald-900">Order Completed & Escrow Released</h4>
                    <p className="text-[11px] text-emerald-700 mt-0.5 leading-snug">
                        Delivery POD accepted. Funds released to carrier.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-amber-50/80 border border-amber-200 rounded-md p-4 flex flex-col gap-3 shadow-2xs font-sans">
            <div className="flex items-start gap-2.5">
                <div className="mt-0.5 text-amber-600 shrink-0"><FileText size={18} /></div>
                <div>
                    <h4 className="text-xs font-bold text-amber-900">Proof of Delivery (POD) Received</h4>
                    <p className="text-[11px] text-amber-800 mt-0.5 leading-relaxed">
                        The carrier uploaded the delivery receipt. Review and confirm POD to release Escrow funds.
                    </p>
                </div>
            </div>
            <div className="flex gap-2 pt-1">
                <Button
                    variant="outline"
                    className="flex-1 h-8 text-xs font-semibold text-amber-800 border-amber-300 hover:bg-amber-100 bg-white cursor-pointer"
                >
                    View Document
                </Button>
                <Button
                    variant="primary"
                    className="flex-1 h-8 text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white cursor-pointer shadow-2xs"
                    onClick={() => setIsPodAccepted(true)}
                >
                    <Check size={14} className="mr-1.5" /> Accept Delivery
                </Button>
            </div>
        </div>
    );
}
