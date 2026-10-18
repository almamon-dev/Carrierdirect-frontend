import { ShipmentItem, ShipmentStatus } from '../../../types';

export interface StatusDisplayConfig {
    label: string;
    color: string;
    nextActionTitle: string;
    nextActionDesc: string;
    eta: string;
    buttonLabel: string;
    buttonColor: string;
    actionType: 'pickup' | 'transit' | 'navigate' | 'pod' | 'none';
}

export function getStatusDisplay(shipment: ShipmentItem): StatusDisplayConfig {
    const status: ShipmentStatus = shipment.status;
    const fromCity = shipment.shipper.city || 'Origin';
    const toCity = shipment.consignee.city || 'Destination';

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
                buttonLabel: 'Navigate to Destination',
                buttonColor: 'bg-[#FF4A1F] hover:bg-[#E03E15]',
                actionType: 'navigate',
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
