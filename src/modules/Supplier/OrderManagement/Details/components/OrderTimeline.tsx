import React from 'react';
import { Clock, Check } from 'lucide-react';
import { OrderTimelineStep } from '../../types/order.types';

interface OrderTimelineProps {
    timeline: OrderTimelineStep[];
}

export const OrderTimeline: React.FC<OrderTimelineProps> = ({ timeline }) => {
    return (
        <div className="p-6 bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-lg shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-slate-800 pb-3 flex items-center gap-2">
                <Clock size={16} className="text-slate-600 dark:text-slate-400" /> Shipment Timeline & Progress
            </h3>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
                {timeline.map((step, idx) => (
                    <div key={idx} className="relative flex items-start gap-4">
                        <div className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                            step.completed ? 'bg-emerald-600 text-white' :
                            step.current ? 'bg-[#ff4a1f] text-white ring-4 ring-[#ff4a1f]/20' :
                            'bg-slate-200 dark:bg-slate-700 text-slate-500'
                        }`}>
                            {step.completed ? <Check size={12} /> : idx + 1}
                        </div>
                        <div className="flex-1">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <h4 className={`text-sm font-bold ${step.current ? 'text-[#ff4a1f]' : 'text-slate-900 dark:text-slate-100'}`}>
                                    {step.title}
                                </h4>
                                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{step.timestamp}</span>
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">{step.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
