import React from 'react';
import { CheckCircle2, MapPin, Truck, PackageCheck, FileCheck, ArrowRight } from 'lucide-react';
import { ShipmentStatus } from '../../../types';

interface Props {
    status: ShipmentStatus;
    onUpdateStatus: (nextStatus: ShipmentStatus) => void;
    onOpenPOD: () => void;
}

interface Step {
    key: ShipmentStatus;
    title: string;
    desc: string;
    icon: React.ElementType;
}

const STEPS: Step[] = [
    { key: 'assigned', title: 'Assigned', desc: 'Freight load assigned to truck', icon: Truck },
    { key: 'at_pickup', title: 'At Pickup', desc: 'Arrived at shipper warehouse', icon: MapPin },
    { key: 'in_transit', title: 'In Transit', desc: 'Loaded & rolling on highway', icon: PackageCheck },
    { key: 'at_delivery', title: 'At Delivery', desc: 'Arrived at consignee dock', icon: MapPin },
    { key: 'delivered', title: 'Delivered', desc: 'POD uploaded & signed off', icon: FileCheck },
];

export const MilestoneStepper: React.FC<Props> = ({ status, onUpdateStatus, onOpenPOD }) => {
    const getStepIndex = (s: ShipmentStatus) => {
        switch (s) {
            case 'assigned':
            case 'accepted':
                return 0;
            case 'at_pickup':
                return 1;
            case 'in_transit':
                return 2;
            case 'at_delivery':
                return 3;
            case 'delivered':
                return 4;
            default:
                return 0;
        }
    };

    const currentIndex = getStepIndex(status);

    const getNextAction = () => {
        switch (status) {
            case 'assigned':
            case 'accepted':
                return {
                    label: 'Mark Arrived at Pickup',
                    action: () => onUpdateStatus('at_pickup'),
                    color: 'bg-indigo-600 hover:bg-indigo-700',
                };
            case 'at_pickup':
                return {
                    label: 'Cargo Loaded ➔ Start Transit',
                    action: () => onUpdateStatus('in_transit'),
                    color: 'bg-blue-600 hover:bg-blue-700',
                };
            case 'in_transit':
                return {
                    label: 'Mark Arrived at Delivery',
                    action: () => onUpdateStatus('at_delivery'),
                    color: 'bg-purple-600 hover:bg-purple-700',
                };
            case 'at_delivery':
                return {
                    label: 'Upload POD & Complete Delivery',
                    action: () => onOpenPOD(),
                    color: 'bg-emerald-600 hover:bg-emerald-700',
                };
            case 'delivered':
                return null;
            default:
                return null;
        }
    };

    const nextAction = getNextAction();

    return (
        <div className="bg-white dark:bg-[#1e2329] rounded-[4px] border border-slate-200/90 dark:border-slate-800 p-3.5 sm:p-4 shadow-2xs space-y-3.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h2 className="text-[13px] font-bold text-slate-900 dark:text-white">Delivery Milestones & Progress</h2>
                    <p className="text-[11px] text-slate-500">Track and update delivery checkpoints</p>
                </div>

                {nextAction && (
                    <button
                        type="button"
                        onClick={nextAction.action}
                        className={`px-3 py-1.5 text-white rounded-[4px] text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all active:scale-98 cursor-pointer ${nextAction.color}`}
                    >
                        <span>{nextAction.label}</span>
                        <ArrowRight size={13} />
                    </button>
                )}
            </div>

            {/* Steps bar */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {STEPS.map((step, idx) => {
                    const isPassed = idx < currentIndex;
                    const isCurrent = idx === currentIndex;
                    const Icon = step.icon;

                    return (
                        <div
                            key={step.key}
                            className={`p-2.5 rounded-[4px] border transition-all ${
                                isCurrent
                                    ? 'bg-orange-50/70 dark:bg-orange-950/20 border-[#FF4A1F]'
                                    : isPassed
                                    ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/50'
                                    : 'bg-slate-50/50 dark:bg-[#161a22] border-slate-200/70 dark:border-slate-800 opacity-60'
                            }`}
                        >
                            <div className="flex items-center justify-between mb-1.5">
                                <div
                                    className={`w-5 h-5 rounded-[3px] flex items-center justify-center text-[10px] font-bold ${
                                        isCurrent
                                            ? 'bg-[#FF4A1F] text-white'
                                            : isPassed
                                            ? 'bg-emerald-600 text-white'
                                            : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                                    }`}
                                >
                                    {isPassed ? <CheckCircle2 size={12} /> : idx + 1}
                                </div>
                                <Icon
                                    size={14}
                                    className={
                                        isCurrent
                                            ? 'text-[#FF4A1F]'
                                            : isPassed
                                            ? 'text-emerald-600'
                                            : 'text-slate-400'
                                    }
                                />
                            </div>
                            <div className="text-xs font-bold text-slate-900 dark:text-white truncate">{step.title}</div>
                            <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">{step.desc}</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
