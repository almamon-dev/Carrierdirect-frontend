import React from 'react';
import { CheckCircle2, MapPin } from 'lucide-react';
import Button from '@/components/ui/button';

export default function TimelineSection({ timeline }: { timeline: any[] }) {
    return (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex-1 flex flex-col">
            <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 rounded-t-xl shrink-0">
                <h3 className="text-[15px] font-bold text-slate-900">Timeline</h3>
                <Button variant="ghost" size="sm" className="h-7 text-[12px] text-indigo-600 hover:bg-indigo-50 px-3 font-semibold">View Logs</Button>
            </div>
            
            <div className="p-4 flex-1 overflow-y-auto">
                <div className="relative">
                    {/* Vertical Line */}
                    <div className="absolute left-[11px] top-4 bottom-8 w-[2px] bg-slate-100"></div>

                    <div className="space-y-4 relative">
                        {timeline.map((step, index) => (
                            <div key={index} className="flex gap-4 relative">
                                {/* Icon/Dot */}
                                <div className="relative z-10 flex flex-col items-center">
                                    <div className={`w-[24px] h-[24px] rounded-full flex items-center justify-center border-2 bg-white ${
                                        step.active 
                                            ? 'border-indigo-600 text-indigo-600 ring-4 ring-indigo-50' 
                                            : step.completed 
                                                ? 'border-emerald-500 text-emerald-500' 
                                                : 'border-slate-200 text-slate-300'
                                    }`}>
                                        {step.completed ? (
                                            <CheckCircle2 size={12} fill="currentColor" className="text-white bg-emerald-500 rounded-full" />
                                        ) : step.active ? (
                                            <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full animate-pulse"></div>
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
                                        <h4 className={`text-[14px] font-bold ${
                                            step.active ? 'text-indigo-700' : step.completed ? 'text-slate-900' : 'text-slate-400'
                                        }`}>
                                            {step.status}
                                        </h4>
                                        <span className={`text-[12px] font-medium ${
                                            step.active || step.completed ? 'text-slate-500' : 'text-slate-300'
                                        }`}>
                                            {step.time}
                                        </span>
                                    </div>
                                    
                                    {/* Extra details for active step */}
                                    {step.active && step.location && (
                                        <div className="mt-2 bg-indigo-50/50 rounded-lg p-2.5 border border-indigo-50 flex items-center gap-2">
                                            <MapPin size={14} className="text-indigo-500" />
                                            <p className="text-[12px] font-semibold text-indigo-800">{step.location}</p>
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
