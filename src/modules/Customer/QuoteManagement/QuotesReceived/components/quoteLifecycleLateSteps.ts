import { Check, Truck, AlertCircle, XCircle, CheckCheck } from 'lucide-react';
import { formatDisplayDate } from '@/lib/utils';
import { QuoteLifecycleStep, formatStepTimestamp } from './quoteLifecycleTypes';

export interface LateStepsParams {
    acceptedBid: any;
    isAccepted: boolean;
    hasOrder: boolean;
    order: any;
    rawOrderStatus: string;
    isCompleted: boolean;
    isInTransit: boolean;
    isRejected: boolean;
    isExpired: boolean;
    acceptedTime?: string;
    transitTime?: string;
    completedTime?: string;
}

export const buildLateLifecycleSteps = ({
    acceptedBid,
    isAccepted,
    hasOrder,
    rawOrderStatus,
    isCompleted,
    isInTransit,
    isRejected,
    isExpired,
    acceptedTime,
    transitTime,
    completedTime,
}: LateStepsParams): QuoteLifecycleStep[] => {
    // Step 4: Award & Booking
    let step4Status: QuoteLifecycleStep['status'] = 'pending';
    let step4Title = 'Award & Booking';
    let step4Subtitle = 'Awaiting Selection';
    let step4Desc = 'Customer awards the winning carrier and confirms shipment booking.';
    const winningSupplierName = acceptedBid?.supplier_name || acceptedBid?.supplier?.company_name || acceptedBid?.supplier?.name || 'Carrier';

    if (isCompleted || isInTransit) {
        step4Status = 'completed';
        step4Title = 'Carrier Awarded';
        step4Subtitle = winningSupplierName;
        step4Desc = `Awarded to ${winningSupplierName} at ${acceptedBid?.amount || 'accepted rate'}.`;
    } else if (isAccepted || hasOrder) {
        step4Status = 'completed';
        step4Title = 'Carrier Awarded';
        step4Subtitle = winningSupplierName;
        step4Desc = `Awarded to ${winningSupplierName} at ${acceptedBid?.amount || 'accepted rate'}. Booking confirmed.`;
    } else if (isRejected) {
        step4Status = 'rejected';
        step4Title = 'Offers Declined';
        step4Subtitle = 'Request Closed';
        step4Desc = 'Shipper declined submitted offers or closed the RFQ.';
    } else if (isExpired) {
        step4Status = 'expired';
        step4Title = 'Request Expired';
        step4Subtitle = 'Validity Passed';
        step4Desc = 'The RFQ bidding window has expired.';
    }

    const step4: QuoteLifecycleStep = {
        id: 'decision',
        title: step4Title,
        subtitle: step4Subtitle,
        description: step4Desc,
        timestamp: acceptedTime,
        dateFormatted: isAccepted 
            ? (formatStepTimestamp(acceptedTime) || formatDisplayDate(acceptedTime) || 'Awarded')
            : (step4Status === 'rejected' ? 'Declined' : (step4Status === 'expired' ? 'Expired' : 'Pending Selection')),
        status: step4Status,
        icon: isAccepted ? Check : (isRejected ? XCircle : (isExpired ? AlertCircle : Check)),
        actor: 'Customer'
    };

    // Step 5: Dispatched & In Transit
    let step5Status: QuoteLifecycleStep['status'] = 'pending';
    let step5Subtitle = 'Pending Booking';
    let step5Desc = 'Carrier allocates fleet, picks up cargo, and initiates freight transit.';

    if (isCompleted) {
        step5Status = 'completed';
        step5Subtitle = 'Transit Fulfilled';
        step5Desc = 'Cargo departed pickup and arrived safely at destination.';
    } else if (isInTransit) {
        step5Status = 'active';
        step5Subtitle = rawOrderStatus === 'picked_up' ? 'Picked Up' : 'On Route';
        step5Desc = 'Carrier has dispatched driver and freight is currently en route.';
    } else if (isAccepted || hasOrder) {
        step5Status = 'active';
        step5Subtitle = 'Preparing Dispatch';
        step5Desc = 'Carrier is scheduling vehicle & driver dispatch for pickup.';
    }

    const step5: QuoteLifecycleStep = {
        id: 'in_transit',
        title: 'Dispatch & Transit',
        subtitle: step5Subtitle,
        description: step5Desc,
        timestamp: transitTime,
        dateFormatted: step5Status === 'completed' 
            ? 'Fulfilled' 
            : (step5Status === 'active' ? (isInTransit ? 'In Transit' : 'Scheduled') : 'Pending Award'),
        status: step5Status,
        icon: Truck,
        actor: 'Carrier Fleet'
    };

    // Step 6: Delivered & Fulfilled
    let step6Status: QuoteLifecycleStep['status'] = 'pending';
    let step6Subtitle = 'Pending Delivery';
    let step6Desc = 'Cargo delivered at destination dock, signed by recipient, and order fulfilled.';

    if (isCompleted) {
        step6Status = 'completed';
        step6Subtitle = 'Delivered & Complete';
        step6Desc = 'Shipment fulfilled with confirmed consignee sign-off.';
    } else if (rawOrderStatus === 'delivered' || rawOrderStatus === 'pod_uploaded') {
        step6Status = 'active';
        step6Subtitle = 'Delivery Sign-off';
        step6Desc = 'Cargo arrived at destination. Final delivery sign-off in progress.';
    }

    const step6: QuoteLifecycleStep = {
        id: 'delivered',
        title: 'Delivered & Completed',
        subtitle: step6Subtitle,
        description: step6Desc,
        timestamp: completedTime,
        dateFormatted: step6Status === 'completed' 
            ? (formatStepTimestamp(completedTime) || 'Delivered')
            : (step6Status === 'active' ? 'Sign-off' : 'Pending Delivery'),
        status: step6Status,
        icon: CheckCheck,
        actor: 'Customer & Carrier'
    };

    return [step4, step5, step6];
};
