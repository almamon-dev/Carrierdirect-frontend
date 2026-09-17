import React from 'react';
import { Truck, MapPin, Navigation, CheckCircle2, ArrowRight } from 'lucide-react';
import { NormalizedSupplierOrder } from '../utils/supplierOrderTrackUtils';

interface SupplierMapSectionProps {
    order: NormalizedSupplierOrder;
    timeline: any[];
}

export const SupplierMapSection: React.FC<SupplierMapSectionProps> = ({ order, timeline }) => {
    const fromCity = encodeURIComponent(order.from || 'London');
    const toCity = encodeURIComponent(order.to || 'Manchester');

    // Map the 5 primary tracking milestones directly from the authoritative timeline
    const milestoneSteps = [
        { 
            id: 1, 
            label: 'Order Confirmed', 
            completed: Boolean(timeline?.[0]?.completed && !timeline?.[0]?.active),
            active: Boolean(timeline?.[0]?.active)
        },
        { 
            id: 2, 
            label: 'Driver Assigned', 
            completed: Boolean(timeline?.[1]?.completed && !timeline?.[1]?.active),
            active: Boolean(timeline?.[1]?.active)
        },
        { 
            id: 3, 
            label: 'Goods Picked Up', 
            completed: Boolean(timeline?.[2]?.completed && !timeline?.[2]?.active),
            active: Boolean(timeline?.[2]?.active)
        },
        { 
            id: 4, 
            label: 'In Transit', 
            completed: Boolean(timeline?.[3]?.completed && !timeline?.[3]?.active),
            active: Boolean(timeline?.[3]?.active)
        },
        { 
            id: 5, 
            label: 'Delivered', 
            completed: Boolean(timeline?.[6]?.completed || timeline?.[5]?.completed || (timeline?.[4]?.completed && !timeline?.some(t => t.active))),
            active: Boolean(timeline?.[4]?.active || (timeline?.[5]?.active && !timeline?.[6]?.completed))
        }
    ];

    return (
        <div className="w-full bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xs overflow-hidden font-sans">
            {/* Header / Corridor Status Bar */}
            <div className="px-3.5 py-2.5 bg-slate-50/80 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between flex-wrap gap-2 text-xs">
                <div className="flex items-center gap-2">
                    <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                    </span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">Active Transit Corridor</span>
                    <span className="text-slate-300 dark:text-slate-700">•</span>
                    <span className="text-slate-500 dark:text-slate-400 font-medium">GPS Telematics Active</span>
                </div>

                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 font-medium text-xs">
                    <span className="flex items-center gap-1 bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 shadow-2xs">
                        <Navigation size={11} className="text-[#ff4a1f]" />
                        <span className="font-bold text-slate-900 dark:text-slate-100">{order.from}</span>
                        <ArrowRight size={10} className="text-slate-400" />
                        <span className="font-bold text-slate-900 dark:text-slate-100">{order.to}</span>
                    </span>
                </div>
            </div>

            {/* Map Frame */}
            <div className="w-full h-[155px] sm:h-[175px] relative overflow-hidden bg-slate-100 dark:bg-[#15191e]">
                <iframe
                    title="Shipment Route Corridor"
                    src={`https://maps.google.com/maps?q=${fromCity}+to+${toCity}&t=&z=7&ie=UTF8&iwloc=&output=embed`}
                    width="100%"
                    height="100%"
                    style={{ border: 0, filter: 'opacity(0.85) grayscale(0.15)' }}
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 via-transparent to-transparent pointer-events-none" />
                
                {/* Floating Corridor badge */}
                <div className="absolute bottom-2.5 left-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs px-2.5 py-1 rounded-md border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-2 text-[11px]">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-slate-600 dark:text-slate-300 font-medium">Direct Road Freight Route</span>
                </div>
            </div>

            {/* Dedicated Clean Progress Stepper Bar (100% Synchronized with Timeline) */}
            <div className="p-3 sm:p-4 bg-white dark:bg-[#1e2329] border-t border-slate-100 dark:border-slate-800/80">
                <div className="grid grid-cols-5 gap-1 items-start relative">
                    {milestoneSteps.map((step, idx) => {
                        const isCompleted = step.completed;
                        const isCurrent = step.active;

                        return (
                            <div key={step.id} className="flex flex-col items-center text-center relative group">
                                {/* Connecting horizontal bar to next step */}
                                {idx < milestoneSteps.length - 1 && (
                                    <div
                                        className={`absolute top-3 left-1/2 w-full h-0.5 -z-0 transition-colors ${
                                            isCompleted && (milestoneSteps[idx + 1]?.completed || milestoneSteps[idx + 1]?.active)
                                                ? milestoneSteps[idx + 1]?.completed
                                                    ? 'bg-emerald-500'
                                                    : 'bg-orange-400'
                                                : 'bg-slate-200 dark:bg-slate-700'
                                        }`}
                                    />
                                )}

                                {/* Step Circle Indicator */}
                                <div
                                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold z-10 border-2 transition-all ${
                                        isCompleted
                                            ? 'bg-emerald-500 border-white dark:border-[#1e2329] text-white shadow-2xs'
                                            : isCurrent
                                            ? 'bg-[#ff4a1f] border-orange-200 dark:border-orange-950 text-white ring-3 ring-orange-100 dark:ring-orange-950/70 scale-105'
                                            : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-400'
                                    }`}
                                >
                                    {isCompleted ? (
                                        <CheckCircle2 size={13} className="text-white" />
                                    ) : isCurrent ? (
                                        <Truck size={11} className="text-white animate-pulse" />
                                    ) : (
                                        <span>{idx + 1}</span>
                                    )}
                                </div>

                                {/* Clean Step Title */}
                                <span
                                    className={`mt-1.5 text-[10.5px] sm:text-[11.5px] font-semibold tracking-tight transition-colors ${
                                        isCurrent
                                            ? 'text-[#ff4a1f] font-bold'
                                            : isCompleted
                                            ? 'text-slate-800 dark:text-slate-200 font-medium'
                                            : 'text-slate-400 dark:text-slate-500'
                                    }`}
                                >
                                    {step.label}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default SupplierMapSection;
