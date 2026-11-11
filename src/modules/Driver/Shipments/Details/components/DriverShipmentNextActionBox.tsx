import React from 'react';
import { Camera, CheckCircle2, MapPin, Navigation, PackageCheck, ShieldCheck } from 'lucide-react';
import { ShipmentItem, ShipmentStatus } from '../../../types';
import { requireDriverCompliance } from '../../../Compliance';
import { StatusDisplayConfig } from '../utils/statusDisplayConfig';

interface DriverShipmentNextActionBoxProps {
    shipment: ShipmentItem;
    status: ShipmentStatus;
    statusConfig: StatusDisplayConfig;
    handlePrimaryAction: () => void;
    onOpenPOD: () => void;
}

export const DriverShipmentNextActionBox: React.FC<DriverShipmentNextActionBoxProps> = ({
    shipment,
    status,
    statusConfig,
    handlePrimaryAction,
    onOpenPOD,
}) => {
    const isCompleted = status === 'completed';
    const isDelivered = status === 'delivered';
    const isRelay = Boolean(shipment.isRelay);
    const isLeg1 = isRelay && !shipment.isDeliveryOnly;
    const isLeg2 = isRelay && Boolean(shipment.isDeliveryOnly);

    // If Leg 1 driver and handover accepted:
    if (isLeg1 && (shipment.handover?.status === 'accepted' || isCompleted || isDelivered)) {
        return (
            <div className="bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-900/60 rounded-[4px] p-3.5 text-center space-y-1">
                <CheckCircle2 size={24} className="mx-auto text-emerald-600 dark:text-emerald-400" />
                <div className="text-xs font-bold text-emerald-900 dark:text-emerald-300">
                    Leg 1 Handover Completed
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Cargo successfully handed over to {shipment.partnerDriver?.driver_name || 'Driver 2'}. Your assignment for this relay load is complete.
                </p>
            </div>
        );
    }

    if (isCompleted || isDelivered) {
        return (
            <div className="bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-900/60 rounded-[4px] p-3.5 text-center space-y-1">
                <CheckCircle2 size={24} className="mx-auto text-emerald-600 dark:text-emerald-400" />
                <div className="text-xs font-bold text-emerald-900 dark:text-emerald-300">
                    {isCompleted ? 'Shipment Approved & Completed' : 'Delivered • Awaiting Review'}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {isCompleted
                        ? 'Customer has approved the Proof of Delivery (POD). Settlement finalized.'
                        : 'Proof of Delivery (POD) uploaded. Awaiting customer confirmation.'}
                </p>
            </div>
        );
    }

    return (
        <div className="bg-slate-50/80 dark:bg-[#15191e]/60 border border-slate-200/80 dark:border-slate-800 rounded-[4px] p-3 space-y-2">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block tracking-wider">
                Next Action
            </span>
            <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-[4px] bg-orange-500/10 dark:bg-orange-500/20 text-[#FF4A1F] flex items-center justify-center shrink-0 mt-0.5">
                    {statusConfig.actionType === 'handover' || statusConfig.actionType === 'accept_handover' ? (
                        <ShieldCheck size={14} className="text-violet-600 dark:text-violet-400" />
                    ) : (
                        <MapPin size={14} />
                    )}
                </div>
                <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-snug">
                        {statusConfig.nextActionTitle}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        ETA: <strong className="text-slate-700 dark:text-slate-300 font-semibold">{statusConfig.eta}</strong>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 space-y-2">
                {statusConfig.buttonLabel && (
                    <button
                        type="button"
                        onClick={handlePrimaryAction}
                        disabled={statusConfig.isActionDisabled}
                        className={`w-full h-8 px-3.5 inline-flex items-center justify-center gap-1.5 text-white rounded-[4px] text-xs font-bold shadow-2xs transition-all cursor-pointer ${statusConfig.buttonColor}`}
                    >
                        {statusConfig.actionType === 'navigate' ? (
                            <Navigation size={13} />
                        ) : statusConfig.actionType === 'handover' || statusConfig.actionType === 'accept_handover' ? (
                            <ShieldCheck size={13} />
                        ) : (
                            <PackageCheck size={13} />
                        )}
                        <span>{statusConfig.buttonLabel}</span>
                    </button>
                )}

                {/* Secondary action: POD button ONLY for final delivery driver (Single Driver or Relay Leg 2) */}
                {(!statusConfig.isActionDisabled && (status === 'in_transit' || status === 'at_delivery') && (!isRelay || isLeg2)) && (
                    <button
                        type="button"
                        onClick={() => requireDriverCompliance(onOpenPOD, 'Upload POD')}
                        className="w-full h-8 px-3.5 inline-flex items-center justify-center gap-1.5 bg-white hover:bg-slate-50 dark:bg-slate-800/80 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-[4px] text-xs font-semibold transition-colors cursor-pointer shadow-2xs"
                    >
                        <Camera size={13} className="text-[#FF4A1F]" />
                        <span>Complete Delivery & Upload POD</span>
                    </button>
                )}
            </div>
        </div>
    );
};
