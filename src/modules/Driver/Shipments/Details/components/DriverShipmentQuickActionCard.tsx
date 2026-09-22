import React from 'react';
import { Truck, MapPin, PackageCheck, FileCheck, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';
import { ShipmentItem, ShipmentStatus } from '../../../types';
import { ShipmentStatusBadge } from '../../components/ShipmentStatusBadge';
import { requireDriverCompliance } from '../../../Compliance';

interface Props {
    shipment: ShipmentItem;
    onUpdateStatus: (nextStatus: ShipmentStatus) => void;
    onOpenPOD: () => void;
}

export const DriverShipmentQuickActionCard: React.FC<Props> = ({
    shipment,
    onUpdateStatus,
    onOpenPOD,
}) => {
    const getNextActionConfig = () => {
        switch (shipment.status) {
            case 'assigned':
            case 'accepted':
                return {
                    title: 'Next Step: Arrive at Shipper',
                    description: 'Mark your arrival at the pickup warehouse dock when on site.',
                    buttonLabel: 'Mark Arrived at Pickup',
                    buttonColor: 'bg-indigo-600 hover:bg-indigo-700',
                    icon: MapPin,
                    onClick: () => requireDriverCompliance(() => onUpdateStatus('at_pickup'), 'Arrive at Pickup'),
                };
            case 'at_pickup':
                return {
                    title: 'Next Step: Start Transit',
                    description: 'Confirm cargo loading is complete and depart towards destination.',
                    buttonLabel: 'Cargo Loaded • Start Transit',
                    buttonColor: 'bg-blue-600 hover:bg-blue-700',
                    icon: PackageCheck,
                    onClick: () => requireDriverCompliance(() => onUpdateStatus('in_transit'), 'Start Highway Transit'),
                };
            case 'in_transit':
                return {
                    title: 'Next Step: Arrive at Delivery',
                    description: 'Notify consignee receiver of arrival at delivery dock.',
                    buttonLabel: 'Mark Arrived at Delivery',
                    buttonColor: 'bg-purple-600 hover:bg-purple-700',
                    icon: MapPin,
                    onClick: () => requireDriverCompliance(() => onUpdateStatus('at_delivery'), 'Arrive at Delivery'),
                };
            case 'at_delivery':
                return {
                    title: 'Next Step: Complete Delivery',
                    description: 'Capture receiver digital signature and signed paper BOL for sign-off.',
                    buttonLabel: 'Upload POD & Complete',
                    buttonColor: 'bg-emerald-600 hover:bg-emerald-700',
                    icon: FileCheck,
                    onClick: () => requireDriverCompliance(() => onOpenPOD(), 'Upload POD'),
                };
            case 'delivered':
                return null;
            default:
                return null;
        }
    };

    const nextAction = getNextActionConfig();

    return (
        <div className="bg-white dark:bg-[#1e2329] p-3.5 sm:p-4 rounded-lg border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3 font-sans">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-2.5">
                <div className="flex items-center gap-2">
                    <Truck size={14} className="text-[#FF4A1F]" />
                    <h3 className="text-xs sm:text-[13px] font-bold text-slate-900 dark:text-slate-100">
                        Milestone Control
                    </h3>
                </div>
                <ShipmentStatusBadge status={shipment.status} />
            </div>

            {nextAction ? (
                <div className="space-y-2.5">
                    <div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                            {nextAction.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                            {nextAction.description}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={nextAction.onClick}
                        className={`w-full py-2 px-3 text-white rounded-md text-xs font-bold flex items-center justify-center gap-2 shadow-2xs transition-all cursor-pointer ${nextAction.buttonColor}`}
                    >
                        <nextAction.icon size={14} />
                        <span>{nextAction.buttonLabel}</span>
                    </button>
                </div>
            ) : (
                <div className="p-3 bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 rounded-lg text-center space-y-1">
                    <CheckCircle2 size={20} className="mx-auto text-emerald-600 dark:text-emerald-400" />
                    <div className="text-xs font-bold text-emerald-900 dark:text-emerald-300">
                        Shipment Successfully Completed
                    </div>
                    <p className="text-[10.5px] text-emerald-700 dark:text-emerald-400">
                        Proof of delivery confirmed and signed off.
                    </p>
                </div>
            )}

            {/* Driver Compliance Safety Badge */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px]">
                <span className="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1">
                    <ShieldCheck size={13} className="text-emerald-600" />
                    <span>Driver Compliance Status</span>
                </span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    Verified Active
                </span>
            </div>
        </div>
    );
};
