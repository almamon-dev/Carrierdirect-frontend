import { ShipmentItem, ShipmentStatus } from '../../../types';

export interface StatusDisplayConfig {
    label: string;
    color: string;
    nextActionTitle: string;
    nextActionDesc: string;
    eta: string;
    buttonLabel: string;
    buttonColor: string;
    actionType: 'pickup' | 'transit' | 'navigate' | 'pod' | 'none' | 'at_hub' | 'handover' | 'accept_handover' | 'at_delivery';
    isActionDisabled?: boolean;
}

export function getStatusDisplay(shipment: ShipmentItem): StatusDisplayConfig {
    const status: ShipmentStatus = shipment.status;
    const fromCity = shipment.shipper.city || 'Origin';
    const toCity = shipment.consignee.city || 'Destination';
    const isRelay = Boolean(shipment.isRelay);
    const isLeg2 = Boolean(shipment.isDeliveryOnly);
    const hubLocation = (shipment.hubLocation && !shipment.hubLocation.toLowerCase().includes('transit hub'))
        ? shipment.hubLocation
        : 'Intermediate Hub';
    const partnerName = shipment.partnerDriver?.driver_name || (isLeg2 ? 'Leg 1 Driver' : 'Leg 2 Driver');
    const handover = shipment.handover;

    // ==========================================
    // 1. RELAY WORKFLOW – DRIVER 1 (Leg 1: Pickup to Hub)
    // ==========================================
    if (isRelay && !isLeg2) {
        if ((handover && handover.status === 'accepted') || status === 'completed') {
            return {
                label: 'Leg 1 Completed • Handed Over',
                color: 'text-emerald-600 dark:text-emerald-400',
                nextActionTitle: 'Cargo Handed Over to Driver 2',
                nextActionDesc: `Cargo successfully received by ${partnerName} at ${hubLocation}. Leg 1 duty is completed.`,
                eta: 'Completed',
                buttonLabel: 'Leg 1 Completed • Handed Over',
                buttonColor: 'bg-emerald-600 opacity-90 cursor-default',
                actionType: 'none',
                isActionDisabled: true,
            };
        }

        if (handover && handover.status === 'pending_acceptance' || status === 'handover_pending') {
            return {
                label: 'Handover Pending Acceptance',
                color: 'text-violet-600 dark:text-violet-400',
                nextActionTitle: `Awaiting Acceptance by ${partnerName}`,
                nextActionDesc: `Handover OTP: ${handover?.otp_code || 'Generated'}. Share this code with ${partnerName} to accept cargo.`,
                eta: 'Awaiting Acceptance',
                buttonLabel: 'View Handover OTP & Cargo',
                buttonColor: 'bg-violet-600 hover:bg-violet-700',
                actionType: 'handover',
            };
        }

        switch (status) {
            case 'assigned':
            case 'accepted':
                return {
                    label: `Assigned (Leg 1: Pickup ➔ ${hubLocation})`,
                    color: 'text-indigo-600 dark:text-indigo-400',
                    nextActionTitle: 'Pickup at consignor facility',
                    nextActionDesc: `Proceed to ${shipment.shipper.address || fromCity} for loading`,
                    eta: shipment.shipper.pickupTimeWindow || 'Scheduled Pickup',
                    buttonLabel: 'Confirm Goods Picked Up',
                    buttonColor: 'bg-indigo-600 hover:bg-indigo-700',
                    actionType: 'pickup',
                };
            case 'at_pickup':
            case 'picked_up':
                return {
                    label: 'Pickup Complete',
                    color: 'text-blue-600 dark:text-blue-400',
                    nextActionTitle: `Depart towards ${hubLocation}`,
                    nextActionDesc: `Cargo loaded. Depart on transit corridor to ${hubLocation}`,
                    eta: 'Ready to depart',
                    buttonLabel: `Depart • Start Transit to ${hubLocation}`,
                    buttonColor: 'bg-blue-600 hover:bg-blue-700',
                    actionType: 'transit',
                };
            case 'in_transit':
                return {
                    label: `In Transit to ${hubLocation}`,
                    color: 'text-[#FF4A1F]',
                    nextActionTitle: `Arrive at Hub: ${hubLocation}`,
                    nextActionDesc: `Deliver cargo to relay point for handover to ${partnerName}`,
                    eta: `Transit to ${hubLocation}`,
                    buttonLabel: `Confirm Arrival at ${hubLocation}`,
                    buttonColor: 'bg-amber-600 hover:bg-amber-700',
                    actionType: 'at_hub',
                };
            case 'at_hub':
                return {
                    label: `Arrived at ${hubLocation} Hub`,
                    color: 'text-purple-600 dark:text-purple-400',
                    nextActionTitle: `Handover Cargo to ${partnerName}`,
                    nextActionDesc: 'Upload cargo condition photos, generate OTP code, and transfer load.',
                    eta: `At ${hubLocation}`,
                    buttonLabel: 'Handover Shipment to Driver 2',
                    buttonColor: 'bg-violet-600 hover:bg-violet-700',
                    actionType: 'handover',
                };
            default:
                return {
                    label: 'Leg 1 Completed • Handed Over',
                    color: 'text-emerald-600 dark:text-emerald-400',
                    nextActionTitle: 'Leg 1 Finished',
                    nextActionDesc: 'Cargo successfully handed over to Driver 2.',
                    eta: 'Completed',
                    buttonLabel: 'Leg 1 Completed • Handed Over',
                    buttonColor: 'bg-emerald-600 opacity-90 cursor-default',
                    actionType: 'none',
                    isActionDisabled: true,
                };
        }
    }

    // ==========================================
    // 2. RELAY WORKFLOW – DRIVER 2 (Leg 2: Hub to Destination)
    // ==========================================
    if (isRelay && isLeg2) {
        if (status === 'completed') {
            return {
                label: 'Completed',
                color: 'text-emerald-600 dark:text-emerald-400',
                nextActionTitle: 'Delivery Approved & Completed',
                nextActionDesc: 'Customer has verified and approved the Proof of Delivery.',
                eta: 'Completed',
                buttonLabel: '',
                buttonColor: '',
                actionType: 'none',
            };
        }

        if (status === 'delivered') {
            return {
                label: 'Awaiting Review',
                color: 'text-amber-600 dark:text-amber-400',
                nextActionTitle: 'Awaiting Customer POD Verification',
                nextActionDesc: 'Proof of Delivery (POD) uploaded. Awaiting customer sign-off & approval.',
                eta: 'Under Review',
                buttonLabel: '',
                buttonColor: '',
                actionType: 'none',
            };
        }

        if (status === 'at_delivery') {
            return {
                label: 'Arrived at Consignee',
                color: 'text-purple-600 dark:text-purple-400',
                nextActionTitle: 'Sign-off and POD verification',
                nextActionDesc: 'Obtain receiver digital signature and complete delivery proof.',
                eta: 'Dock ready',
                buttonLabel: 'Upload POD & Complete Delivery',
                buttonColor: 'bg-emerald-600 hover:bg-emerald-700',
                actionType: 'pod',
            };
        }

        // Check if handover is pending acceptance from Driver 1
        if (handover && handover.status === 'pending_acceptance' || status === 'handover_pending') {
            return {
                label: 'Handover Ready at Hub',
                color: 'text-amber-600 dark:text-amber-400',
                nextActionTitle: `Accept Cargo from ${partnerName}`,
                nextActionDesc: `Cargo is waiting at ${hubLocation}. Verify cargo condition and enter handover OTP.`,
                eta: 'Ready for Handover',
                buttonLabel: 'Accept Handover from Driver 1',
                buttonColor: 'bg-emerald-600 hover:bg-emerald-700',
                actionType: 'accept_handover',
            };
        }

        // Check if handover is already accepted, ready to roll
        const isHandoverAccepted = handover?.status === 'accepted' || status === 'handover_accepted';
        if (isHandoverAccepted && status !== 'in_transit') {
            return {
                label: 'Handover Accepted • Ready to Depart',
                color: 'text-blue-600 dark:text-blue-400',
                nextActionTitle: `Depart towards ${toCity}`,
                nextActionDesc: `Cargo received from ${partnerName}. Begin final transit to ${shipment.consignee.address || toCity}`,
                eta: 'Ready to depart',
                buttonLabel: 'Depart • Start Final Transit',
                buttonColor: 'bg-blue-600 hover:bg-blue-700',
                actionType: 'transit',
            };
        }

        if (status === 'in_transit' && (isHandoverAccepted || shipment.currentActiveLeg === 2)) {
            return {
                label: 'In Transit to Destination',
                color: 'text-[#FF4A1F]',
                nextActionTitle: 'Delivery at consignee location',
                nextActionDesc: `${shipment.consignee.address || toCity}`,
                eta: `${shipment.consignee.deliveryTimeWindow || '12:00 PM - 05:00 PM'}`,
                buttonLabel: 'Confirm Arrival at Destination',
                buttonColor: 'bg-purple-600 hover:bg-purple-700',
                actionType: 'at_delivery',
            };
        }

        // Before handover: Driver 2 is waiting for Driver 1
        return {
            label: 'Assigned (Leg 2: Awaiting Cargo)',
            color: 'text-slate-500 dark:text-slate-400',
            nextActionTitle: `Awaiting Arrival of ${partnerName}`,
            nextActionDesc: `Driver 1 is currently transporting cargo to ${hubLocation}. You will be notified once ready for handover.`,
            eta: `Waiting at ${hubLocation}`,
            buttonLabel: 'Awaiting Hub Arrival & Handover',
            buttonColor: 'bg-slate-400 dark:bg-slate-700 opacity-60 cursor-not-allowed',
            actionType: 'none',
            isActionDisabled: true,
        };
    }

    // ==========================================
    // 3. SINGLE DRIVER SHIPMENT WORKFLOW
    // ==========================================
    switch (status) {
        case 'assigned':
        case 'accepted':
            return {
                label: 'Assigned',
                color: 'text-indigo-600 dark:text-indigo-400',
                nextActionTitle: 'Pickup at consignor facility',
                nextActionDesc: `Proceed to ${shipment.shipper.address || fromCity} for loading`,
                eta: shipment.shipper.pickupTimeWindow || 'Scheduled Pickup',
                buttonLabel: 'Confirm Goods Picked Up',
                buttonColor: 'bg-indigo-600 hover:bg-indigo-700',
                actionType: 'pickup',
            };
        case 'at_pickup':
        case 'picked_up':
            return {
                label: 'Pickup Complete',
                color: 'text-blue-600 dark:text-blue-400',
                nextActionTitle: 'Depart towards destination',
                nextActionDesc: `Cargo loaded. Depart on transit corridor to ${toCity}`,
                eta: 'Ready to depart',
                buttonLabel: 'Depart • Start Highway Transit',
                buttonColor: 'bg-blue-600 hover:bg-blue-700',
                actionType: 'transit',
            };
        case 'in_transit':
            return {
                label: 'In Transit',
                color: 'text-[#FF4A1F]',
                nextActionTitle: 'Delivery at consignee location',
                nextActionDesc: `${shipment.consignee.address || toCity}`,
                eta: `${shipment.consignee.deliveryTimeWindow || '12:00 PM - 05:00 PM'} (${shipment.consignee.deliveryDate || '11 Oct 2026'})`,
                buttonLabel: 'Confirm Arrival at Destination',
                buttonColor: 'bg-purple-600 hover:bg-purple-700',
                actionType: 'at_delivery',
            };
        case 'at_delivery':
            return {
                label: 'Arrived at Consignee',
                color: 'text-purple-600 dark:text-purple-400',
                nextActionTitle: 'Sign-off and POD verification',
                nextActionDesc: 'Obtain receiver digital signature and stamped BOL',
                eta: 'Dock ready',
                buttonLabel: 'Upload POD & Complete Delivery',
                buttonColor: 'bg-emerald-600 hover:bg-emerald-700',
                actionType: 'pod',
            };
        case 'delivered':
            return {
                label: 'Awaiting Review',
                color: 'text-amber-600 dark:text-amber-400',
                nextActionTitle: 'Awaiting Customer POD Verification',
                nextActionDesc: 'Proof of Delivery (POD) uploaded. Awaiting customer sign-off & escrow settlement.',
                eta: 'Under Review',
                buttonLabel: '',
                buttonColor: '',
                actionType: 'none',
            };
        case 'completed':
            return {
                label: 'Completed',
                color: 'text-emerald-600 dark:text-emerald-400',
                nextActionTitle: 'Delivery Approved & Completed',
                nextActionDesc: 'Customer has verified and approved the Proof of Delivery.',
                eta: 'Completed',
                buttonLabel: '',
                buttonColor: '',
                actionType: 'none',
            };
        default:
            return {
                label: 'Assigned',
                color: 'text-[#FF4A1F]',
                nextActionTitle: 'Pickup Goods',
                nextActionDesc: `Facility: ${fromCity}`,
                eta: 'Scheduled',
                buttonLabel: 'Confirm Goods Picked Up',
                buttonColor: 'bg-[#FF4A1F] hover:bg-[#E03E15]',
                actionType: 'pickup',
            };
    }
}
