import React from 'react';
import { Navigation, ArrowRight, CheckCircle2, Truck, MapPin, PackageCheck, FileCheck } from 'lucide-react';
import { ShipmentItem, ShipmentStatus } from '../../../types';

interface Props {
    shipment: ShipmentItem;
}

export const DriverShipmentMapSection: React.FC<Props> = ({ shipment }) => {
    const fromCity = encodeURIComponent(shipment.shipper.city || 'Origin');
    const toCity = encodeURIComponent(shipment.consignee.city || 'Destination');

    const getStepState = (status: ShipmentStatus) => {
        const orderMap: Record<ShipmentStatus, number> = {
            assigned: 1,
            accepted: 1,
            at_pickup: 2,
            in_transit: 3,
            at_delivery: 4,
            delivered: 5,
            cancelled: 0,
        };

        const currentNum = orderMap[status] || 1;

        return [
            { id: 1, label: 'Assigned', completed: currentNum > 1, active: currentNum === 1, icon: Truck },
            { id: 2, label: 'At Pickup Dock', completed: currentNum > 2, active: currentNum === 2, icon: MapPin },
            { id: 3, label: 'In Transit', completed: currentNum > 3, active: currentNum === 3, icon: PackageCheck },
            { id: 4, label: 'At Consignee Dock', completed: currentNum > 4, active: currentNum === 4, icon: MapPin },
            { id: 5, label: 'Delivered & POD', completed: currentNum === 5, active: false, icon: FileCheck },
        ];
    };

    const steps = getStepState(shipment.status);

    return (
        <div className="w-full bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-lg shadow-2xs overflow-hidden font-sans">
            {/* Top Subheader with Corridor Info */}
            <div className="px-3.5 py-2.5 bg-slate-50/80 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between flex-wrap gap-2 text-xs">
                <div className="flex items-center gap-2">
                    <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">Live Shipment Corridor</span>
                    <span className="text-slate-300 dark:text-slate-700">•</span>
                    <span className="text-slate-500 dark:text-slate-400 font-medium">GPS Signal Active</span>
                </div>

                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 font-medium text-xs">
                    <span className="flex items-center gap-1.5 bg-white dark:bg-slate-900 px-2.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 shadow-2xs">
                        <Navigation size={11} className="text-[#FF4A1F]" />
                        <span className="font-bold text-slate-900 dark:text-slate-100">{shipment.shipper.city}</span>
                        <ArrowRight size={10} className="text-slate-400" />
                        <span className="font-bold text-slate-900 dark:text-slate-100">{shipment.consignee.city}</span>
                    </span>
                </div>
            </div>

            {/* Map Frame */}
            <div className="w-full h-[160px] sm:h-[185px] relative overflow-hidden bg-slate-100 dark:bg-[#15191e]">
                <iframe
                    title="Driver Live Route"
                    src={`https://maps.google.com/maps?q=${fromCity}+to+${toCity}&t=&z=7&ie=UTF8&iwloc=&output=embed`}
                    width="100%"
                    height="100%"
                    style={{ border: 0, filter: 'opacity(0.88) grayscale(0.1)' }}
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/25 via-transparent to-transparent pointer-events-none" />

                {/* Floating Corridor Distance badge */}
                <div className="absolute bottom-2.5 left-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs px-2.5 py-1 rounded-md border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-2 text-[11px]">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-slate-700 dark:text-slate-200 font-medium">
                        Direct Highway Route: <strong className="text-slate-900 dark:text-white font-bold">{shipment.route.distanceKm} km</strong> ({shipment.route.estimatedDuration})
                    </span>
                </div>
            </div>

            {/* Stepper Progress Bar */}
            <div className="p-3 sm:p-4 bg-white dark:bg-[#1e2329] border-t border-slate-100 dark:border-slate-800/80">
                <div className="grid grid-cols-5 gap-1 items-start relative">
                    {steps.map((step, idx) => {
                        const isCompleted = step.completed;
                        const isCurrent = step.active;

                        return (
                            <div key={step.id} className="flex flex-col items-center text-center relative group">
                                {/* Connecting horizontal bar */}
                                {idx < steps.length - 1 && (
                                    <div
                                        className={`absolute top-3 left-1/2 w-full h-0.5 -z-0 transition-colors ${
                                            isCompleted && (steps[idx + 1]?.completed || steps[idx + 1]?.active)
                                                ? steps[idx + 1]?.completed
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
                                            ? 'bg-[#FF4A1F] border-orange-200 dark:border-orange-950 text-white ring-3 ring-orange-100 dark:ring-orange-950/70 scale-105'
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

                                {/* Step Title */}
                                <span
                                    className={`mt-1.5 text-[10px] sm:text-[11.5px] font-semibold tracking-tight transition-colors ${
                                        isCurrent
                                            ? 'text-[#FF4A1F] font-bold'
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
