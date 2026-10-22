import React from 'react';
import { 
    Calendar, 
    Check, 
    Clock, 
    CheckCircle2, 
    XCircle, 
    FileText, 
    Send, 
    MessageSquare, 
    Truck, 
    CreditCard 
} from 'lucide-react';
import { QuoteRequest } from '../../data/quoteRequestsData';
import { formatDisplayDate } from '@/lib/utils';

interface QuoteRequestTimelineProps {
    requestDetails: QuoteRequest;
}

function formatDateTime(dateVal: any, fallback = '—'): string {
    if (!dateVal) return fallback;
    const str = String(dateVal).trim();
    if (!str || str === 'N/A' || str === 'null' || str === 'undefined' || str === '—') return fallback;

    try {
        const d = new Date(str);
        if (!isNaN(d.getTime())) {
            return d.toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
            });
        }
        return formatDisplayDate(str, fallback);
    } catch {
        return str || fallback;
    }
}

export const QuoteRequestTimeline: React.FC<QuoteRequestTimelineProps> = ({ requestDetails }) => {
    const quote = (requestDetails as any).quote_submitted;
    const reqStatus = String(requestDetails.status || '').toLowerCase().trim();
    const quoteStatus = String(quote?.status || '').toLowerCase().trim();
    const revStatus = String(quote?.revision_status || '').toLowerCase().trim();

    const isWon = Boolean(
        (requestDetails as any).is_won ||
        reqStatus === 'won' ||
        reqStatus === 'booked' ||
        quoteStatus === 'accepted' ||
        quoteStatus === 'won'
    );

    const isLost = Boolean(
        (requestDetails as any).is_lost ||
        reqStatus === 'lost' ||
        reqStatus === 'cancelled' ||
        quoteStatus === 'rejected' ||
        quoteStatus === 'declined' ||
        quoteStatus === 'lost'
    );

    const isNegotiating = revStatus === 'pending' || quoteStatus === 'negotiating' || quoteStatus === 'negotiation';
    const isQuoted = Boolean(quote || (requestDetails as any).hasQuoted || reqStatus === 'quoted' || isWon || isLost);

    const isPaid = Boolean(
        (requestDetails as any).is_paid ||
        (requestDetails as any).isPaid ||
        quote?.is_paid ||
        quote?.isPaid ||
        (requestDetails as any).payment_status === 'Paid' ||
        quote?.payment_status === 'Paid' ||
        ((requestDetails as any).order?.status === 'confirmed' && (requestDetails as any).order?.is_paid)
    );

    const order = (requestDetails as any).order || quote?.order;
    const orderStatus = String(order?.status || '').toLowerCase().trim();
    const podStatus = String(order?.pod_status || '').toLowerCase().trim();

    const isPodConfirmed = Boolean(
        order?.is_pod_confirmed ||
        podStatus === 'confirmed' ||
        podStatus === 'approved' ||
        podStatus === 'accepted'
    );

    const isDelivered = Boolean(
        order?.is_delivered ||
        orderStatus === 'delivered' ||
        orderStatus === 'completed' ||
        isPodConfirmed
    );

    const isCompleted = Boolean(
        order?.is_completed ||
        orderStatus === 'completed' ||
        isPodConfirmed ||
        reqStatus === 'completed'
    );

    const steps = [
        // Step 1: Request Broadcasted / Published
        {
            id: 'request_created',
            title: 'Request Published',
            description: 'Customer published cargo requirements to verified carriers.',
            date: formatDateTime(requestDetails.requestDate, 'Published'),
            status: 'completed' as const,
            icon: FileText,
        },
        // Step 2: Commercial Offer Submitted
        {
            id: 'offer_submitted',
            title: isQuoted ? 'Offer Submitted' : 'Submit Commercial Offer',
            description: isQuoted
                ? (quote?.amount
                    ? `Commercial offer of €${Number(quote.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} EUR sent to customer.`
                    : 'Your commercial offer has been sent to the customer.')
                : 'Review cargo requirements and submit your competitive bid.',
            date: isQuoted
                ? formatDateTime(quote?.submitted_at || quote?.created_at, 'Submitted')
                : 'Awaiting your bid',
            status: isQuoted ? ('completed' as const) : ('active' as const),
            icon: Send,
        },
        // Step 3: Shipper Review & Negotiation
        {
            id: 'review_negotiation',
            title: isNegotiating ? 'Rate Negotiation Active' : 'Under Customer Review',
            description: isWon
                ? 'Customer evaluated proposals and selected your offer.'
                : isLost
                    ? 'Customer completed evaluation of received proposals.'
                    : isNegotiating
                        ? 'Counter-offer terms and cargo scheduling actively in discussion.'
                        : isQuoted
                            ? 'Customer is reviewing your offer and comparing carrier proposals.'
                            : 'Customer evaluates incoming carrier quotes upon submission.',
            date: (isWon || isLost)
                ? 'Review Completed'
                : isNegotiating
                    ? 'Active Discussion'
                    : isQuoted
                        ? 'In Review'
                        : 'Upcoming',
            status: (isWon || isLost)
                ? ('completed' as const)
                : isNegotiating
                    ? ('active' as const)
                    : isQuoted
                        ? ('active' as const)
                        : ('pending' as const),
            icon: isNegotiating ? MessageSquare : Clock,
        },
        // Step 4: Decision & Carrier Award
        {
            id: 'decision_award',
            title: isWon
                ? 'Offer Accepted • Quote Won!'
                : isLost
                    ? 'Job Not Awarded'
                    : 'Customer Decision',
            description: isWon
                ? 'Congratulations! Shipper accepted your quote. Shipment awarded to your fleet.'
                : isLost
                    ? 'Customer selected another carrier proposal or declined the offer.'
                    : 'Awaiting customer final confirmation and carrier selection.',
            date: isWon
                ? formatDateTime(quote?.accepted_at || quote?.updated_at, 'Offer Accepted')
                : isLost
                    ? formatDateTime(quote?.updated_at, 'Declined')
                    : 'Pending',
            status: isWon
                ? ('completed' as const)
                : isLost
                    ? ('rejected' as const)
                    : ('pending' as const),
            icon: isWon ? CheckCircle2 : (isLost ? XCircle : Clock),
        },
        // Step 5: Escrow Payment
        {
            id: 'escrow_payment',
            title: isWon
                ? (isPaid ? 'Payment Secured in Escrow' : 'Customer Payment Pending (Escrow)')
                : 'Customer Payment (Escrow)',
            description: isWon
                ? (isPaid
                    ? 'Shipper completed payment. Funds are secured in CarrierDirect Escrow.'
                    : 'Shipper accepted quote. Awaiting customer payment confirmation into secure escrow before cargo dispatch.')
                : 'Shipper deposits funds into secure escrow upon accepting your quotation.',
            date: isWon
                ? (isPaid ? 'Payment Secured' : 'Awaiting Payment')
                : 'Pending',
            status: isWon
                ? (isPaid ? ('completed' as const) : ('active' as const))
                : ('pending' as const),
            icon: isWon ? (isPaid ? CheckCircle2 : CreditCard) : CreditCard,
        },
        // Step 6: Shipment Dispatch & Fulfillment
        {
            id: 'dispatch_fulfillment',
            title: isCompleted || isDelivered
                ? 'Shipment Delivered'
                : isWon
                    ? (isPaid ? 'Shipment Fulfillment' : 'Shipment Fulfillment (Locked)')
                    : 'Scheduled Delivery',
            description: isCompleted || isDelivered
                ? (requestDetails.delivery ? `Cargo transported and successfully delivered to ${requestDetails.delivery}.` : 'Cargo transported and successfully delivered to destination.')
                : isWon
                    ? (isPaid
                        ? `Pickup: ${requestDetails.pickupDate || 'To be scheduled'} • Destination: ${requestDetails.delivery || 'Designated route'}`
                        : 'Dispatch unlocks once shipper completes escrow payment.')
                    : `Target delivery: ${requestDetails.deliveryDate || (requestDetails.pickupDate ? `After ${requestDetails.pickupDate}` : 'Upon booking')}`,
            date: isCompleted || isDelivered
                ? formatDateTime(order?.delivered_at || order?.completed_at, 'Delivered')
                : (requestDetails.deliveryDate
                    ? formatDisplayDate(requestDetails.deliveryDate)
                    : (requestDetails.pickupDate ? formatDisplayDate(requestDetails.pickupDate) : 'Pending')),
            status: isCompleted || isDelivered
                ? ('completed' as const)
                : (isWon && isPaid ? ('upcoming' as const) : ('pending' as const)),
            icon: Truck,
        },
        // Step 7: Delivery Completed & POD Approved
        ...(isWon && (isDelivered || isCompleted) ? [
            {
                id: 'pod_completed',
                title: isCompleted
                    ? 'Delivery Completed • POD Confirmed'
                    : 'Proof of Delivery (POD) Under Review',
                description: isCompleted
                    ? 'Customer approved Proof of Delivery. Order completed and Escrow payment settled into available balance.'
                    : 'Driver submitted Proof of Delivery. Awaiting customer review and acceptance.',
                date: isCompleted
                    ? formatDateTime(order?.pod_confirmed_at || order?.completed_at, 'POD Approved')
                    : 'Awaiting Customer Approval',
                status: isCompleted ? ('completed' as const) : ('active' as const),
                icon: isCompleted ? CheckCircle2 : Clock,
            }
        ] : []),
    ];

    return (
        <div className="bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-[4px] shadow-2xs p-3.5 sm:p-4 space-y-3 font-sans">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                    <Calendar size={13} className="text-[#ea580c] shrink-0" />
                    <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        Quote Request Timeline
                    </h3>
                </div>
                <span className="text-[10.5px] font-semibold text-slate-500 dark:text-slate-400">
                    {isCompleted ? 'Delivered • Completed' : isDelivered ? 'Delivered • Awaiting POD' : isWon ? (isPaid ? 'Awarded • Paid' : 'Awarded • Awaiting Payment') : isLost ? 'Declined' : isQuoted ? 'In Progress' : 'Open'}
                </span>
            </div>

            <div className="pl-0.5 space-y-0">
                {steps.map((step, idx) => {
                    const isLast = idx === steps.length - 1;
                    const isCompleted = step.status === 'completed';
                    const isActive = step.status === 'active';
                    const isRejected = step.status === 'rejected';
                    const isUpcoming = step.status === 'upcoming';
                    const IconComponent = step.icon;

                    return (
                        <div key={step.id} className="flex items-start gap-2.5">
                            {/* Step Marker & Connector Line */}
                            <div className="flex flex-col items-center self-stretch shrink-0">
                                <div
                                    className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 shadow-2xs transition-colors ${
                                        isCompleted
                                            ? 'bg-emerald-500 text-white'
                                            : isActive
                                                ? 'bg-[#ff4a1f] text-white ring-2 ring-[#ff4a1f]/25 animate-pulse'
                                                : isRejected
                                                    ? 'bg-rose-500 text-white'
                                                    : isUpcoming
                                                        ? 'bg-blue-500 text-white'
                                                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700'
                                    }`}
                                >
                                    {isCompleted ? (
                                        <Check size={11} strokeWidth={2.8} />
                                    ) : isRejected ? (
                                        <XCircle size={11} strokeWidth={2.5} />
                                    ) : (
                                        <IconComponent size={10} strokeWidth={2.4} />
                                    )}
                                </div>

                                {!isLast && (
                                    <div
                                        className={`w-0.5 flex-1 my-0.5 min-h-[16px] transition-colors ${
                                            isCompleted && (steps[idx + 1]?.status === 'completed' || steps[idx + 1]?.status === 'active' || steps[idx + 1]?.status === 'upcoming')
                                                ? 'bg-emerald-200 dark:bg-emerald-900/60'
                                                : isActive
                                                    ? 'bg-orange-200 dark:bg-orange-900/40'
                                                    : 'bg-slate-200 dark:bg-slate-700/60'
                                        }`}
                                    />
                                )}
                            </div>

                            {/* Step Content */}
                            <div className={`flex-1 flex items-start justify-between gap-3 min-w-0 ${isLast ? 'pb-0' : 'pb-3'}`}>
                                <div className="space-y-0.5 min-w-0">
                                    <h4
                                        className={`text-xs font-bold leading-tight ${
                                            isCompleted
                                                ? 'text-slate-900 dark:text-slate-100'
                                                : isActive
                                                    ? 'text-[#ff4a1f] dark:text-[#ff6b47]'
                                                    : isRejected
                                                        ? 'text-rose-600 dark:text-rose-400'
                                                        : isUpcoming
                                                            ? 'text-blue-600 dark:text-blue-400'
                                                            : 'text-slate-500 dark:text-slate-400'
                                        }`}
                                    >
                                        {step.title}
                                    </h4>
                                    <p className="text-[11.5px] text-slate-500 dark:text-slate-400 leading-snug">
                                        {step.description}
                                    </p>
                                </div>
                                <span className={`text-[11px] shrink-0 whitespace-nowrap mt-0.5 font-medium ${
                                    isActive
                                        ? 'text-[#ff4a1f] font-semibold'
                                        : isCompleted
                                            ? 'text-slate-600 dark:text-slate-300 font-semibold'
                                            : 'text-slate-400 dark:text-slate-500'
                                }`}>
                                    {step.date}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
