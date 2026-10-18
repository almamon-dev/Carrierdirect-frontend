import React from 'react';
import {
    Check, Clock, MapPin, FileCheck, Download, ShieldCheck
} from 'lucide-react';
import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';

export interface QuoteHistoryDrawerStepItemProps {
    s: any;
    idx: number;
    isLast: boolean;
    isCompletedNext: boolean;
    req: any;
    quote: any;
    podUrl?: string;
    podFileName: string;
}

export const QuoteHistoryDrawerStepItem: React.FC<QuoteHistoryDrawerStepItemProps> = ({
    s,
    idx,
    isLast,
    isCompletedNext,
    req,
    quote,
    podUrl,
    podFileName,
}) => {
    const isCompleted = s.status === 'completed';
    const isActive = s.status === 'active';
    const isRejected = s.status === 'rejected';
    const isExpired = s.status === 'expired';

    let dotBg = 'bg-white dark:bg-slate-900 border-[1.5px] border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300';
    if (isCompleted) {
        dotBg = 'bg-[#10b981] border-[#10b981] text-white shadow-2xs';
    } else if (isActive) {
        dotBg = 'bg-[#ff5722] border-[#ff5722] text-white ring-4 ring-[#ff5722]/20 shadow-2xs';
    } else if (isRejected) {
        dotBg = 'bg-rose-500 border-rose-500 text-white shadow-2xs';
    } else if (isExpired) {
        dotBg = 'bg-amber-500 border-amber-500 text-white shadow-2xs';
    }

    return (
        <div className="relative flex gap-3.5 group">
            {/* Timeline Marker Dot & Centered Connecting Line */}
            <div className="relative z-10 flex flex-col items-center shrink-0">
                <div className={`w-7 h-7 min-w-[28px] min-h-[28px] aspect-square rounded-full flex items-center justify-center font-bold transition-all shrink-0 ${dotBg}`}>
                    {isCompleted ? (
                        <Check size={14} strokeWidth={3} className="text-white" />
                    ) : (
                        <span className="text-xs font-bold">{idx + 1}</span>
                    )}
                </div>
                {/* Connecting Line between steps */}
                {!isLast && (
                    <div className={`absolute top-7 w-[2px] h-[calc(100%+16px)] z-0 ${
                        isCompleted && isCompletedNext
                            ? 'bg-[#10b981]' 
                            : 'bg-slate-200 dark:bg-slate-700'
                    }`} />
                )}
            </div>

            {/* Step Content Card */}
            <div className={`flex-1 p-3.5 rounded-[5px] border transition-all ${
                isActive 
                    ? 'bg-orange-50/60 dark:bg-orange-950/20 border-orange-200 dark:border-orange-900/40 shadow-2xs' 
                    : isCompleted 
                        ? 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 shadow-2xs' 
                        : 'bg-slate-50/50 dark:bg-slate-900 border-slate-100 dark:border-slate-800/60 opacity-60'
            }`}>
                <div className="flex items-start justify-between gap-2">
                    <div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                                {s.title}
                            </span>
                            {s.actor && (
                                <Badge variant="outline" className="text-[9.5px] font-semibold py-0 px-1.5 bg-slate-100 dark:bg-slate-700/80 border-slate-200 dark:border-slate-600">
                                    {s.actor}
                                </Badge>
                            )}
                        </div>
                        <p className="text-[11.5px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                            {s.description}
                        </p>
                    </div>

                    <div className="text-right shrink-0">
                        <div className="inline-flex items-center gap-1 text-[10.5px] font-bold text-slate-700 dark:text-slate-300">
                            <Clock size={11} className="text-slate-400 shrink-0" />
                            <span>{s.dateFormatted || 'Pending'}</span>
                        </div>
                        <span className={`text-[10px] font-bold capitalize block mt-0.5 ${
                            isCompleted ? 'text-emerald-600 dark:text-emerald-400' :
                            isActive ? 'text-[#ff4a1f]' :
                            isRejected ? 'text-rose-600' :
                            isExpired ? 'text-amber-600' :
                            'text-slate-400'
                        }`}>
                            {s.status}
                        </span>
                    </div>
                </div>

                {/* Extra Milestone Artifacts */}
                {s.id === 'request_created' && (
                    <div className="mt-2.5 pt-2.5 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-300">
                        <div className="flex items-center gap-1.5 font-medium">
                            <MapPin size={12} className="text-[#ff4a1f] shrink-0" />
                            <span>{req?.pickup_city || 'Dhaka'} → {req?.delivery_city || 'Chittagong'}</span>
                        </div>
                        <span className="font-semibold text-slate-700 dark:text-slate-200">
                            {req?.weight || '500 KG'} • {req?.vehicle_type || 'Covered Van'}
                        </span>
                    </div>
                )}

                {s.id === 'pod_upload' && (
                    <div className="mt-3 p-2.5 rounded-[4px] bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/60 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-[3px] bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 flex items-center justify-center shrink-0">
                                <FileCheck size={13} />
                            </div>
                            <div>
                                <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 block truncate max-w-[180px]">
                                    {podFileName}
                                </span>
                                <span className="text-[9.5px] text-emerald-700 dark:text-emerald-400 font-medium">
                                    {isCompleted ? '✓ Verified by Carrier Delivery Crew' : 'Pending Physical Delivery'}
                                </span>
                            </div>
                        </div>

                        {isCompleted && (
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-6 px-2 text-[10.5px] font-semibold border-emerald-300 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-700 dark:text-emerald-300 cursor-pointer"
                                onClick={() => {
                                    if (podUrl) window.open(podUrl, '_blank');
                                    else alert('Signed POD document downloaded successfully.');
                                }}
                            >
                                <Download size={11} className="mr-1" /> View POD
                            </Button>
                        )}
                    </div>
                )}

                {s.id === 'pod_acceptance' && isCompleted && (
                    <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-between text-[11px]">
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                            <ShieldCheck size={13} /> Payout Released from Escrow
                        </span>
                        <span className="font-bold text-slate-900 dark:text-slate-100">
                            {quote?.amount || '€ 44.130'}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};
