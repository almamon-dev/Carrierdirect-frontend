import { AlertTriangle, Box, CheckCircle2, GitFork, HeartPulse, MapPin, Truck, User } from 'lucide-react';
import React, { useState } from 'react';
import { requireDriverCompliance } from '../../../Compliance';
import { ReportEmergencyModal } from '../../../components/ReportEmergencyModal';
import { ShipmentItem, ShipmentStatus } from '../../../types';
import {
    getStatusDisplay,
    isRelayHandoverAccepted,
    isRelayHandoverPending,
    isRelayLeg1HandoverCompleted,
} from '../utils/statusDisplayConfig';
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
    const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);

    const fromCity = shipment.shipper?.city || 'Dhaka';
    const toCity = shipment.consignee?.city || 'Chattogram';
    const hubLocation = (shipment.hubLocation && !shipment.hubLocation.toLowerCase().includes('transit hub'))
        ? shipment.hubLocation
        : 'Transit Hub';

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
            ? (leg1?.driver_phone || shipment.driver?.phone || '')
            : (leg2?.driver_phone || shipment.partnerDriver?.driver_phone || ''))
        : (shipment.driver?.phone || '');

    const activeDriverSubtitle = isRelay
        ? (isLeg1 ? 'Driver - Leg 1' : 'Driver - Leg 2')
        : 'Driver (Single Trip)';

    const isLeg1Done = isRelayLeg1HandoverCompleted(shipment);
    const isHandoverPending = isRelayHandoverPending(shipment);
    const isHandoverAccepted = isRelayHandoverAccepted(shipment);

    const isEmergency = Boolean(
        shipment.emergency?.is_emergency ||
        shipment.emergency?.emergency_status === 'reported' ||
        status === 'emergency_hold' ||
        status === 'reassignment_required' ||
        leg1?.emergency_status === 'reported' ||
        leg1?.status === 'reassignment_required' ||
        (isLeg2 && (leg2?.emergency_status === 'reported' || leg2?.status === 'reassignment_required'))
    );

    const emergencyReason = shipment.emergency?.emergency_reason
        || (isLeg1 ? leg1?.emergency_reason : leg2?.emergency_reason)
        || 'Sick Leave';

    // Clean Operation Heading & Corridor matching reference UI
    let operationTitle = 'In Transit';
    let operationCorridor = `${fromCity} → ${toCity} (Full Trip)`;

    if (isRelay) {
        if (isLeg1) {
            operationCorridor = `(Leg 1 of 2: ${fromCity} → ${hubLocation})`;
            if (isLeg1Done) {
                operationTitle = 'Leg 1 Completed';
            } else if (status === 'at_hub' || isHandoverPending) {
                operationTitle = `At ${hubLocation}`;
            } else if (status === 'picked_up' || status === 'at_pickup') {
                operationTitle = 'Goods Picked Up';
            } else if (status === 'assigned' || status === 'accepted') {
                operationTitle = 'Ready for Pickup';
            } else {
                operationTitle = 'En Route to Transit Hub';
            }
        } else {
            // Leg 2
            operationCorridor = `(Leg 2 of 2: ${hubLocation} → ${toCity})`;
            if (status === 'delivered' || status === 'completed') {
                operationTitle = status === 'completed' ? 'Delivery Completed' : 'Delivered';
            } else if (status === 'at_delivery') {
                operationTitle = 'Arrived at Destination';
            } else if (!isHandoverAccepted) {
                operationTitle = `Awaiting Handover at ${hubLocation}`;
            } else if (status === 'handover_accepted') {
                operationTitle = 'Handover Accepted';
            } else {
                operationTitle = `En Route to ${toCity}`;
            }
        }
    } else {
        operationCorridor = `${fromCity} → ${toCity} (Full Trip)`;
        if (status === 'assigned' || status === 'accepted') {
            operationTitle = 'Ready for Pickup';
        } else if (status === 'picked_up' || status === 'at_pickup') {
            operationTitle = 'Goods Picked Up';
        } else if (status === 'at_delivery') {
            operationTitle = 'Arrived at Destination';
        } else if (status === 'delivered') {
            operationTitle = 'Delivered';
        } else if (status === 'completed') {
            operationTitle = 'Delivery Completed';
        } else {
            operationTitle = 'In Transit';
        }
    }

    // Next Action description & ETA
    let nextActionTitle = 'Deliver to Consignee';
    let nextActionEta = statusConfig.eta || '05:21 PM';

    if (isEmergency) {
        nextActionTitle = 'Duty Offline • Operations Reassignment';
        nextActionEta = 'Duty on Hold';
    } else if (isRelay) {
        if (isLeg1) {
            if (status === 'assigned' || status === 'accepted') {
                nextActionTitle = `Pickup Cargo at ${fromCity}`;
                nextActionEta = '11:30 AM';
            } else if (status === 'at_hub' || isHandoverPending) {
                nextActionTitle = `Handover to Driver 2 at ${hubLocation}`;
                nextActionEta = 'Ready at Hub';
            } else if (isLeg1Done) {
                nextActionTitle = 'Leg 1 Handover Completed';
                nextActionEta = 'Completed';
            } else {
                nextActionTitle = `Handover to Driver 2 at ${hubLocation}`;
                nextActionEta = '02:30 PM';
            }
        } else {
            // Leg 2
            if (!isHandoverAccepted) {
                nextActionTitle = `Accept Cargo Handover from Driver 1`;
                nextActionEta = 'Handover Pending';
            } else if (status === 'at_delivery') {
                nextActionTitle = 'Upload Proof of Delivery (POD)';
                nextActionEta = 'At Consignee';
            } else if (status === 'delivered' || status === 'completed') {
                nextActionTitle = 'Consignee Delivery Complete';
                nextActionEta = 'Completed';
            } else {
                nextActionTitle = 'Deliver to Consignee';
                nextActionEta = '05:21 PM';
            }
        }
    } else {
        if (status === 'assigned' || status === 'accepted') {
            nextActionTitle = `Pickup Cargo at ${fromCity}`;
            nextActionEta = '11:30 AM';
        } else if (status === 'at_delivery') {
            nextActionTitle = 'Upload Proof of Delivery (POD)';
            nextActionEta = 'At Destination';
        } else if (status === 'delivered' || status === 'completed') {
            nextActionTitle = 'Consignee Delivery Complete';
            nextActionEta = 'Completed';
        } else {
            nextActionTitle = 'Deliver to Consignee';
            nextActionEta = '05:21 PM';
        }
    }

    // Action button handling
    const handleActionClick = () => {
        if (isEmergency || isLeg1Done || status === 'delivered' || status === 'completed') {
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

    const isButtonDisabled = isEmergency || isLeg1Done || status === 'delivered' || status === 'completed';

    let buttonText = isRelay ? 'Update Status' : 'Update Delivery Status';
    if (isLeg1Done) {
        buttonText = 'Leg 1 Completed • Handed Over';
    } else if (status === 'delivered') {
        buttonText = 'Awaiting Customer Approval';
    } else if (status === 'completed') {
        buttonText = 'Delivery Completed & Approved';
    } else if (isRelay && isLeg1 && (status === 'at_hub' || isHandoverPending)) {
        buttonText = 'Initiate Handover at Hub';
    } else if (isRelay && !isLeg1 && (!isHandoverAccepted || status === 'handover_pending')) {
        buttonText = 'Accept Handover & Cargo';
    } else if (status === 'at_delivery') {
        buttonText = 'Upload POD & Complete Delivery';
    }

    return (
        <div className="bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-[4px] shadow-2xs font-sans overflow-hidden">
            {/* 1. Header: Current Operation & Active/Completed/Duty on Hold badge */}
            <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-[#1e2329]">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Current Operation
                </h3>
                {isEmergency ? (
                    <span className="px-2.5 py-0.5 rounded-[4px] text-xs font-bold bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 border border-red-200/80 dark:border-red-900/60 flex items-center gap-1 shadow-2xs">
                        <AlertTriangle size={11} className="text-[#cf222e] dark:text-red-400" />
                        <span>Duty on Hold</span>
                    </span>
                ) : isLeg1Done || status === 'completed' || status === 'delivered' ? (
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
                <div className="p-3.5 bg-orange-50/70 dark:bg-orange-950/20 border border-orange-100/80 dark:border-orange-900/40 rounded-[4px] flex items-center gap-3">
                    <div className="w-10 h-10 rounded-[4px] bg-orange-100 dark:bg-orange-950/50 text-[#FF4A1F] flex items-center justify-center shrink-0 border border-orange-200/60 dark:border-orange-800/40">
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
                <div className="p-3 bg-white dark:bg-[#161a22] border border-slate-200/90 dark:border-slate-800 rounded-[4px] flex items-center justify-between gap-3">
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
                                className="px-2.5 py-1 bg-white dark:bg-[#21262d] hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-full text-[11px] font-semibold flex items-center gap-1 cursor-pointer shadow-2xs transition-colors"
                            >
                                <GitFork size={11} className="text-indigo-600 dark:text-indigo-400" />
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

                {/* Emergency Active Alert with proper warm warning background */}
                {isEmergency && (
                    <div className="p-3.5 bg-red-50/90 dark:bg-red-950/30 border border-red-200/90 dark:border-red-900/60 rounded-[4px] text-xs space-y-1.5 animate-in fade-in duration-150">
                        <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 font-bold text-red-950 dark:text-red-200">
                                <div className="w-5 h-5 rounded-[4px] bg-red-100 dark:bg-red-900/50 text-[#cf222e] dark:text-red-400 flex items-center justify-center shrink-0">
                                    <AlertTriangle size={13} />
                                </div>
                                <span className="capitalize">Shift Offline: {emergencyReason.replace('_', ' ')}</span>
                            </div>
                            <span className="px-2 py-0.5 rounded-[4px] text-[10px] font-bold bg-white dark:bg-[#1e2329] text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800/80 shadow-2xs">
                                Reported
                            </span>
                        </div>
                        <p className="text-[11.5px] text-red-800/90 dark:text-red-300/80 leading-normal pl-7">
                            Operations dispatch alerted. Replacement carrier reassignment in progress.
                        </p>
                    </div>
                )}

                {/* 5. Primary Action & Report Sick Buttons (Rounded Full Pill Shape) */}
                <div className="pt-1 flex items-center gap-2">
                    {isEmergency ? (
                        <div className="flex-1 h-9 px-4 rounded-full text-xs font-bold bg-red-50/70 dark:bg-red-950/25 border border-red-200 dark:border-red-900/50 text-red-800 dark:text-red-300 flex items-center justify-center gap-1.5 shadow-2xs select-none">
                            <AlertTriangle size={13} className="text-[#cf222e] dark:text-red-400" />
                            <span className="truncate">Duty Offline • Shift on Hold</span>
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={handleActionClick}
                            disabled={isButtonDisabled}
                            className={`flex-1 h-9 px-4 rounded-full text-xs font-bold text-white flex items-center justify-center gap-1.5 shadow-2xs transition-all ${isButtonDisabled
                                ? 'bg-emerald-600 opacity-90 cursor-default pointer-events-none'
                                : 'bg-[#4338ca] hover:bg-[#3730a3] active:scale-99 cursor-pointer'
                                }`}
                        >
                            {isButtonDisabled ? <CheckCircle2 size={13} /> : <Box size={13} />}
                            <span>{buttonText}</span>
                        </button>
                    )}

                    {!['delivered', 'completed', 'cancelled'].includes(status) && (
                        <button
                            type="button"
                            onClick={() => setIsEmergencyModalOpen(true)}
                            className="h-9 px-4 rounded-full text-xs font-bold bg-white dark:bg-[#161b22] hover:bg-red-50/70 dark:hover:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-700 dark:text-red-300 flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0 shadow-2xs"
                            title={isEmergency ? 'Update sick leave or emergency report' : 'Report emergency or sick leave'}
                        >
                            <HeartPulse size={13} className="text-[#cf222e] dark:text-red-400" />
                            <span>{isEmergency ? 'Update Report' : 'Report Sick'}</span>
                        </button>
                    )}
                </div>
            </div>

            {/* View Legs Modal */}
            <ViewLegsModal
                isOpen={isViewLegsOpen}
                shipment={shipment}
                onClose={() => setIsViewLegsOpen(false)}
            />

            {/* Emergency / Sick Leave Modal */}
            <ReportEmergencyModal
                isOpen={isEmergencyModalOpen}
                shipment={shipment}
                onClose={() => setIsEmergencyModalOpen(false)}
                onSuccess={() => {
                    setIsEmergencyModalOpen(false);
                    window.location.reload();
                }}
            />
        </div>
    );
};
