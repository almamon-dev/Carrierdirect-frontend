import React from 'react';
import { Truck, MapPin, PackageCheck, FileCheck, CheckCircle2, ShieldCheck, Camera } from 'lucide-react';
import { ShipmentItem, ShipmentStatus } from '../../../types';
import { ShipmentStatusBadge } from '../../components/ShipmentStatusBadge';
import { requireDriverCompliance } from '../../../Compliance';

interface Props {
    shipment: ShipmentItem;
    onUpdateStatus: (nextStatus: ShipmentStatus) => void;
    onOpenPOD: () => void;
}

export const DriverShipmentActionCard: React.FC<Props> = ({
    shipment,
    onUpdateStatus,
    onOpenPOD,
}) => {
    const pod = shipment.podData;

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
        <div className="bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-lg shadow-2xs font-sans overflow-hidden">
            {/* Header */}
            <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-[#15191e]/50">
                <div className="flex items-center gap-2">
                    <Truck size={14} className="text-[#FF4A1F]" />
                    <h3 className="text-xs sm:text-[13px] font-bold text-slate-900 dark:text-slate-100">
                        Milestone & Delivery Sign-Off
                    </h3>
                </div>
                <ShipmentStatusBadge status={shipment.status} />
            </div>

            {/* Action Area */}
            <div className="p-4 space-y-3">
                {nextAction ? (
                    <div className="space-y-2.5">
                        <div>
                            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                                {nextAction.title}
                            </h4>
                            <p className="text-[11.5px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                                {nextAction.description}
                            </p>
                        </div>

                        {/* Action Buttons in the same row */}
                        <div className="pt-0.5 flex items-center gap-2 flex-wrap">
                            <button
                                type="button"
                                onClick={nextAction.onClick}
                                className={`h-8 px-4 w-auto inline-flex items-center justify-center gap-2 text-white rounded-[4px] text-xs font-bold shadow-2xs transition-all cursor-pointer ${nextAction.buttonColor}`}
                            >
                                <nextAction.icon size={13.5} />
                                <span>{nextAction.buttonLabel}</span>
                            </button>

                            {!pod && shipment.status !== 'delivered' && shipment.status !== 'at_delivery' && (
                                <button
                                    type="button"
                                    onClick={() => requireDriverCompliance(onOpenPOD, 'Upload POD')}
                                    className="h-8 px-3.5 w-auto inline-flex items-center justify-center gap-1.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/60 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700 rounded-[4px] text-xs font-semibold transition-colors cursor-pointer"
                                >
                                    <Camera size={12} className="text-[#FF4A1F]" />
                                    <span>Attach POD / Document</span>
                                </button>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="text-center space-y-1.5 py-1">
                        <CheckCircle2 size={24} className="mx-auto text-emerald-600 dark:text-emerald-400" />
                        <div className="text-xs font-bold text-emerald-900 dark:text-emerald-300">
                            Shipment Successfully Delivered
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                            Proof of Delivery (POD) confirmed & verified.
                        </p>
                    </div>
                )}

                {/* POD Section (Aligned Key : Value with Highlighted Colon) */}
                {pod && (
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5 text-xs">
                        <div className="grid grid-cols-[130px_14px_1fr] items-start min-w-0">
                            <span className="text-slate-500 dark:text-slate-400 font-medium text-left">Signed By</span>
                            <span className="text-[#FF4A1F] font-bold text-center select-none shrink-0">:</span>
                            <span className="font-bold text-slate-900 dark:text-slate-100">{pod.receiverName}</span>
                        </div>

                        <div className="grid grid-cols-[130px_14px_1fr] items-start min-w-0">
                            <span className="text-slate-500 dark:text-slate-400 font-medium text-left">Timestamp</span>
                            <span className="text-[#FF4A1F] font-bold text-center select-none shrink-0">:</span>
                            <span className="font-medium text-slate-700 dark:text-slate-300">{new Date(pod.uploadedAt).toLocaleString()}</span>
                        </div>

                        {pod.notes && (
                            <div className="grid grid-cols-[130px_14px_1fr] items-start min-w-0">
                                <span className="text-slate-500 dark:text-slate-400 font-medium text-left">POD Notes</span>
                                <span className="text-[#FF4A1F] font-bold text-center select-none shrink-0">:</span>
                                <span className="text-slate-600 dark:text-slate-400 italic">{pod.notes}</span>
                            </div>
                        )}

                        {pod.signatureUrl && (
                            <div className="pt-2">
                                <div className="grid grid-cols-[130px_14px_1fr] items-start min-w-0">
                                    <span className="text-slate-500 dark:text-slate-400 font-medium text-left">Signature</span>
                                    <span className="text-[#FF4A1F] font-bold text-center select-none shrink-0">:</span>
                                    <div>
                                        <img
                                            src={pod.signatureUrl}
                                            alt="Signature"
                                            className="max-h-12 w-auto object-contain bg-slate-50 dark:bg-slate-900 p-1 rounded border border-slate-200 dark:border-slate-800"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Compliance Footer (Aligned Key : Value with Highlighted Colon) */}
            <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-[#15191e]/50 text-xs">
                <div className="grid grid-cols-[130px_14px_1fr] items-center min-w-0">
                    <span className="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1 text-[11px]">
                        <ShieldCheck size={12} className="text-emerald-600" />
                        <span>Compliance</span>
                    </span>
                    <span className="text-[#FF4A1F] font-bold text-center select-none text-[11px] shrink-0">:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 text-[11px]">Verified Active</span>
                </div>
            </div>
        </div>
    );
};
