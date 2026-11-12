import React, { useState } from 'react';
import { Truck, CheckCircle2, ShieldCheck, ArrowRight, FileCheck, Eye, X, FileText, User, Phone, MapPin, GitFork, Globe } from 'lucide-react';
import { ShipmentItem, ShipmentStatus } from '../../../types';
import { requireDriverCompliance } from '../../../Compliance';
import { getStatusDisplay } from '../utils/statusDisplayConfig';
import { ViewLegsModal } from './ViewLegsModal';

interface Props {
    shipment: ShipmentItem;
    onUpdateStatus: (nextStatus: ShipmentStatus) => void;
    onOpenPOD: () => void;
    onOpenGPS?: () => void;
    onOpenHandover?: () => void;
    onOpenAcceptHandover?: () => void;
}

export const DriverShipmentActionCard: React.FC<Props> = ({
    shipment,
    onUpdateStatus,
    onOpenPOD,
    onOpenGPS,
    onOpenHandover,
    onOpenAcceptHandover,
}) => {
    const status = shipment.status;
    const isRelay = Boolean(shipment.isRelay);
    const isLeg1 = isRelay && !shipment.isDeliveryOnly;
    const isLeg2 = isRelay && Boolean(shipment.isDeliveryOnly);

    const [isViewLegsOpen, setIsViewLegsOpen] = useState(false);
    const [viewDocUrl, setViewDocUrl] = useState<string | null>(null);

    const fromCity = shipment.shipper?.city || 'Dhaka';
    const toCity = shipment.consignee?.city || 'Chattogram';
    const hubLocation = (shipment.hubLocation && !shipment.hubLocation.toLowerCase().includes('transit hub'))
        ? shipment.hubLocation
        : 'Intermediate Hub';

    const statusConfig = getStatusDisplay(shipment);

    // Resolve active driver for current operation
    const leg1 = shipment.relayLegs?.find(l => l.leg_number === 1);
    const leg2 = shipment.relayLegs?.find(l => l.leg_number === 2);

    const leg1DriverName = leg1?.driver_name
        || (shipment.isDeliveryOnly ? shipment.partnerDriver?.driver_name : shipment.driver?.name)
        || 'Driver 1';

    const leg2DriverName = leg2?.driver_name
        || (shipment.isDeliveryOnly ? shipment.driver?.name : shipment.partnerDriver?.driver_name)
        || 'Driver 2';

    const activeDriverName = isRelay
        ? (isLeg1 ? leg1DriverName : leg2DriverName)
        : (shipment.driver?.name || 'Driver');

    const activeDriverPhone = isRelay
        ? (isLeg1
            ? (leg1?.driver_phone || shipment.driver?.phone || '—')
            : (leg2?.driver_phone || shipment.partnerDriver?.driver_phone || '—'))
        : (shipment.driver?.phone || '—');

    const activeDriverSubtitle = isRelay
        ? (isLeg1 ? 'Driver - Leg 1' : 'Driver - Leg 2')
        : 'Driver (Single Trip)';

    const isLeg1Done = isRelay && isLeg1 && (status === 'completed' || shipment.handover?.status === 'accepted');

    // Operation heading & corridor
    let operationTitle = 'In Transit';
    let operationCorridor = `${fromCity} ➔ ${toCity} (Full Trip)`;

    if (isRelay) {
        if (isLeg1) {
            if (isLeg1Done) {
                operationTitle = 'Leg 1 Completed';
                operationCorridor = `Leg 1 of 2: ${fromCity} ➔ ${hubLocation} (Completed)`;
            } else if (status === 'at_hub' || status === 'handover_pending') {
                operationTitle = `At ${hubLocation} Hub`;
                operationCorridor = `Leg 1 of 2: ${fromCity} ➔ ${hubLocation}`;
            } else if (status === 'picked_up' || status === 'at_pickup') {
                operationTitle = 'Goods Picked Up';
                operationCorridor = `Leg 1 of 2: ${fromCity} ➔ ${hubLocation}`;
            } else {
                operationTitle = `In Transit to ${hubLocation}`;
                operationCorridor = `Leg 1 of 2: ${fromCity} ➔ ${hubLocation}`;
            }
        } else {
            // Leg 2
            if (shipment.handover?.status === 'pending_acceptance' || status === 'handover_pending') {
                operationTitle = `Handover Ready at ${hubLocation}`;
                operationCorridor = `Leg 2 of 2: ${hubLocation} ➔ ${toCity}`;
            } else if (status === 'at_delivery') {
                operationTitle = 'Arrived at Delivery Point';
                operationCorridor = `Leg 2 of 2: ${hubLocation} ➔ ${toCity}`;
            } else if (status === 'delivered' || status === 'completed') {
                operationTitle = status === 'completed' ? 'Delivery Completed & Approved' : 'Delivered • Awaiting Customer Approval';
                operationCorridor = `Leg 2 of 2: ${hubLocation} ➔ ${toCity} (Completed)`;
            } else {
                operationTitle = 'In Transit to Delivery';
                operationCorridor = `Leg 2 of 2: ${hubLocation} ➔ ${toCity}`;
            }
        }
    } else {
        if (status === 'at_delivery') {
            operationTitle = 'Arrived at Destination';
        } else if (status === 'delivered') {
            operationTitle = 'Delivered • Awaiting Customer Approval';
        } else if (status === 'completed') {
            operationTitle = 'Delivery Completed & Approved';
        } else if (status === 'picked_up' || status === 'at_pickup') {
            operationTitle = 'Goods Picked Up';
        }
    }

    // Next Action text
    let nextActionTitle = 'Deliver to Consignee';
    let nextActionEta = '05:21 PM';

    if (isRelay) {
        if (isLeg1) {
            if (isLeg1Done) {
                nextActionTitle = 'Cargo Handed Over to Driver 2';
                nextActionEta = 'Completed';
            } else {
                nextActionTitle = `Handover to Driver 2 at ${hubLocation}`;
                nextActionEta = '02:30 PM';
            }
        } else {
            if (shipment.handover?.status === 'pending_acceptance' || status === 'handover_pending') {
                nextActionTitle = `Accept Cargo Handover from Driver 1`;
                nextActionEta = 'Now at Hub';
            } else if (status === 'at_delivery') {
                nextActionTitle = 'Upload POD & Complete Delivery';
                nextActionEta = 'Dock ready';
            } else if (status === 'delivered') {
                nextActionTitle = 'Awaiting Customer POD Verification';
                nextActionEta = 'Under Review';
            } else if (status === 'completed') {
                nextActionTitle = 'Order Completed & Payment Settled';
                nextActionEta = 'Completed';
            } else {
                nextActionTitle = 'Deliver to Consignee';
                nextActionEta = '05:21 PM';
            }
        }
    } else {
        if (status === 'at_delivery') {
            nextActionTitle = 'Upload POD & Complete Delivery';
            nextActionEta = 'Dock ready';
        } else if (status === 'delivered') {
            nextActionTitle = 'Awaiting Customer POD Verification';
            nextActionEta = 'Under Review';
        } else if (status === 'completed') {
            nextActionTitle = 'Order Completed & Payment Settled';
            nextActionEta = 'Completed';
        }
    }

    // Primary Button Label & Handler using statusConfig
    const handleActionClick = () => {
        if (isLeg1Done || statusConfig.isActionDisabled || statusConfig.actionType === 'none') {
            return;
        }

        if (statusConfig.actionType === 'pickup') {
            requireDriverCompliance(() => onUpdateStatus('picked_up'), 'Confirm Goods Picked Up');
        } else if (statusConfig.actionType === 'transit') {
            requireDriverCompliance(() => onUpdateStatus('in_transit'), 'Start Transit');
        } else if (statusConfig.actionType === 'at_hub') {
            requireDriverCompliance(() => onUpdateStatus('at_hub'), 'Confirm Arrival at Hub');
        } else if (statusConfig.actionType === 'handover') {
            if (onOpenHandover) onOpenHandover();
        } else if (statusConfig.actionType === 'accept_handover') {
            if (onOpenAcceptHandover) onOpenAcceptHandover();
        } else if (statusConfig.actionType === 'at_delivery') {
            requireDriverCompliance(() => onUpdateStatus('at_delivery'), 'Arrived at Destination');
        } else if (statusConfig.actionType === 'pod') {
            requireDriverCompliance(() => onOpenPOD(), 'Upload POD & Complete');
        } else {
            // Default step transitions
            if (isRelay && isLeg1) {
                if (status === 'assigned' || status === 'accepted') {
                    requireDriverCompliance(() => onUpdateStatus('picked_up'), 'Confirm Goods Picked Up');
                } else if (status === 'picked_up' || status === 'at_pickup') {
                    requireDriverCompliance(() => onUpdateStatus('in_transit'), 'Start Transit to Hub');
                } else if (status === 'in_transit') {
                    requireDriverCompliance(() => onUpdateStatus('at_hub'), 'Confirm Arrival at Hub');
                } else if (status === 'at_hub' || status === 'handover_pending') {
                    if (onOpenHandover) onOpenHandover();
                }
            } else if (isRelay && !isLeg1) {
                if (status === 'handover_pending' || status === 'at_hub') {
                    if (onOpenAcceptHandover) onOpenAcceptHandover();
                } else if (status === 'handover_accepted') {
                    requireDriverCompliance(() => onUpdateStatus('in_transit'), 'Start Transit to Delivery');
                } else if (status === 'in_transit') {
                    requireDriverCompliance(() => onUpdateStatus('at_delivery'), 'Arrived at Destination');
                } else if (status === 'at_delivery') {
                    requireDriverCompliance(() => onOpenPOD(), 'Upload Proof of Delivery');
                }
            } else {
                if (status === 'assigned' || status === 'accepted') {
                    requireDriverCompliance(() => onUpdateStatus('picked_up'), 'Confirm Goods Picked Up');
                } else if (status === 'picked_up' || status === 'at_pickup') {
                    requireDriverCompliance(() => onUpdateStatus('in_transit'), 'Start Transit');
                } else if (status === 'in_transit') {
                    requireDriverCompliance(() => onUpdateStatus('at_delivery'), 'Arrived at Destination');
                } else if (status === 'at_delivery') {
                    requireDriverCompliance(() => onOpenPOD(), 'Upload Proof of Delivery');
                }
            }
        }
    };

    const isButtonDisabled = isLeg1Done || Boolean(statusConfig.isActionDisabled) || status === 'delivered' || status === 'completed';

    let buttonText = isLeg1Done
        ? 'Leg 1 Completed • Handed Over'
        : (statusConfig.buttonLabel || (
            isRelay
                ? (statusConfig.actionType === 'handover'
                    ? 'Initiate Handover at Hub'
                    : (statusConfig.actionType === 'accept_handover'
                        ? 'Accept Handover & Cargo'
                        : 'Update Status'))
                : (status === 'at_delivery'
                    ? 'Upload POD & Complete Delivery'
                    : 'Update Delivery Status')
        ));

    if (status === 'delivered') {
        buttonText = 'Awaiting Customer Verification';
    } else if (status === 'completed') {
        buttonText = isRelay && isLeg1 ? 'Leg 1 Completed • Handed Over' : 'Delivery Completed & Approved';
    }

    const buttonBgClass = isButtonDisabled
        ? (statusConfig.buttonColor || 'bg-emerald-600 opacity-90 cursor-default')
        : (statusConfig.buttonColor || 'bg-[#4338ca] hover:bg-[#3730a3] active:scale-99');

    return (
        <div className="bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-[6px] shadow-xs font-sans overflow-hidden">
            {/* 1. Header: Current Operation & Active/Completed badge */}
            <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-[#1e2329]">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Current Operation
                </h3>
                {isLeg1Done || status === 'completed' || status === 'delivered' ? (
                    <span className="px-2.5 py-0.5 rounded-[4px] text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60">
                        {isLeg1Done ? 'Leg 1 Completed' : (status === 'delivered' ? 'Delivered' : 'Completed')}
                    </span>
                ) : (
                    <span className="px-2.5 py-0.5 rounded-[4px] text-xs font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/60">
                        Active
                    </span>
                )}
            </div>

            <div className="p-4 space-y-3.5">
                {/* 2. Soft Tinted Subheader Box (Orange) */}
                <div className="p-3.5 bg-orange-50/70 dark:bg-orange-950/20 border border-orange-100/80 dark:border-orange-900/40 rounded-[6px] flex items-center gap-3">
                    <div className="w-10 h-10 rounded-[6px] bg-orange-100 dark:bg-orange-950/50 text-[#FF4A1F] flex items-center justify-center shrink-0 border border-orange-200/60 dark:border-orange-800/40">
                        <Truck size={20} />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                            {operationTitle}
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                            {operationCorridor}
                        </p>
                    </div>
                </div>

                {/* 3. Driver Row Card */}
                <div className="p-3 bg-white dark:bg-[#161a22] border border-slate-200/90 dark:border-slate-800 rounded-[6px] flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 font-bold shrink-0">
                            <User size={16} />
                        </div>
                        <div>
                            <div className="text-xs font-bold text-slate-900 dark:text-white">
                                {activeDriverName}
                            </div>
                            <div className="text-[10px] text-slate-500 dark:text-slate-400">
                                {activeDriverSubtitle}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                        {/* View Legs Button for Multi-Driver */}
                        {isRelay && (
                            <button
                                type="button"
                                onClick={() => setIsViewLegsOpen(true)}
                                className="px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100/80 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/80 rounded-[4px] text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
                            >
                                <GitFork size={12} />
                                <span>View Legs</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* 4. Next Action Box */}
                <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Next Action
                    </span>
                    <div className="flex items-center gap-2 text-xs">
                        <div className="w-5 h-5 rounded-[4px] bg-orange-100 dark:bg-orange-950/50 text-[#FF4A1F] flex items-center justify-center shrink-0">
                            <MapPin size={11} />
                        </div>
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                            {nextActionTitle}
                        </span>
                        <span className="text-[11px] text-slate-400 font-medium">
                            (ETA: {nextActionEta})
                        </span>
                    </div>
                </div>

                {/* 5. Prominent Action Button */}
                <div className="pt-1">
                    <button
                        type="button"
                        onClick={handleActionClick}
                        disabled={isButtonDisabled}
                        className={`w-full h-9.5 px-4 rounded-[6px] text-xs font-bold text-white flex items-center justify-center gap-2 shadow-xs transition-all ${isButtonDisabled ? 'cursor-default pointer-events-none opacity-90' : 'cursor-pointer'} ${buttonBgClass}`}
                    >
                        <Globe size={14} />
                        <span>{buttonText}</span>
                    </button>
                </div>
            </div>

            {/* View Legs Modal */}
            <ViewLegsModal
                isOpen={isViewLegsOpen}
                shipment={shipment}
                onClose={() => setIsViewLegsOpen(false)}
            />
        </div>
    );
};
