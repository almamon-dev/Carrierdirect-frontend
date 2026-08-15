import React from 'react';
import { CheckCircle2, MapPin, Clock } from 'lucide-react';
import Button from '@/components/ui/button';

export default function TimelineSection({ timeline }: { timeline: any[] }) {
    return (
        <div className="bg-white border border-slate-200 rounded-md shadow-2xs flex-1 flex flex-col font-sans">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 rounded-t-xl shrink-0">
                <h3 className="text-xs font-bold text-slate-800">Shipment Timeline & Logs</h3>
                <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                    <Clock size={12} /> Live tracking
                </span>
            </div>

            <div className="p-4 flex-1 overflow-y-auto">
                <div className="relative">
                    {/* Vertical Line */}
                    <div className="absolute left-[11px] top-3 bottom-6 w-[2px] bg-slate-100"></div>

                    <div className="space-y-4 relative">
                        {timeline.map((step, index) => (
                            <div key={index} className="flex gap-3.5 relative">
                                {/* Icon/Dot */}
                                <div className="relative z-10 flex flex-col items-center">
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 bg-white ${step.active
                                            ? 'border-[#ff4a1f] text-[#ff4a1f] ring-4 ring-orange-50'
                                            : step.completed
                                                ? 'border-emerald-500 text-emerald-500'
                                                : 'border-slate-200 text-slate-300'
                                        }`}>
                                        {step.completed ? (
                                            <CheckCircle2 size={13} fill="currentColor" className="text-white bg-emerald-500 rounded-full" />
                                        ) : step.active ? (
                                            <div className="w-2.5 h-2.5 bg-[#ff4a1f] rounded-full animate-pulse"></div>
                                        ) : (
                                            <div className="w-2 h-2 bg-slate-200 rounded-full"></div>
                                        )}
                                    </div>
                                    {/* Connecting line fill */}
                                    {index !== timeline.length - 1 && (
                                        <div className={`absolute top-6 w-[2px] h-[26px] z-0 ${step.completed && timeline[index + 1].completed ? 'bg-emerald-500' : 'bg-slate-200'}`}></div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="flex-1 pb-1">
                                    <div className="flex items-center justify-between">
                                        <h4 className={`text-xs font-bold ${step.active ? 'text-[#ff4a1f]' : step.completed ? 'text-slate-900' : 'text-slate-400'
                                            }`}>
                                            {step.status}
                                        </h4>
                                        <span className={`text-[11px] font-medium ${step.active || step.completed ? 'text-slate-500' : 'text-slate-300'
                                            }`}>
                                            {step.time}
                                        </span>
                                    </div>

                                    {/* Extra details for active step */}
                                    {step.active && step.location && (
                                        <div className="mt-2 bg-orange-50/60 rounded-lg p-2 border border-orange-100 flex items-center gap-2">
                                            <MapPin size={13} className="text-[#ff4a1f]" />
                                            <p className="text-[11.5px] font-semibold text-slate-800">{step.location}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
