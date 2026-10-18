import { FileText, Send, MessageSquare } from 'lucide-react';
import { formatDisplayDate } from '@/lib/utils';
import { QuoteLifecycleStep, formatStepTimestamp } from './quoteLifecycleTypes';
import { buildLateLifecycleSteps } from './quoteLifecycleLateSteps';

export const buildQuoteLifecycleSteps = (
    quote: any, 
    requestDetail?: any, 
    allBids: any[] = []
): QuoteLifecycleStep[] => {
    const bids = Array.isArray(allBids) && allBids.length > 0 ? allBids : (quote ? [quote] : []);
    const req = requestDetail || quote?.quote_request || {};
    
    // Check if any quote was accepted or if this specific quote is accepted
    const acceptedBid = bids.find(q => {
        const s = String(q.status_raw || q.status || '').toLowerCase().trim();
        const rev = String(q.revision_status || '').toLowerCase().trim();
        return s.includes('accept') || s.includes('won') || s.includes('booked') || s === 'confirmed' || s === 'paid' || rev === 'accepted' || Boolean(q.is_paid || q.has_order || q.order_id);
    }) || (quote && (String(quote.status_raw || quote.status || '').toLowerCase().includes('accept') || quote.has_order) ? quote : null);

    const isAccepted = Boolean(acceptedBid);
    const isNegotiating = bids.some(q => {
        const s = String(q.status_raw || q.status || '').toLowerCase();
        return q.revision_status === 'pending' || s.includes('negotiat') || s.includes('counter');
    });

    const hasOrder = Boolean(acceptedBid?.has_order || acceptedBid?.order_id || acceptedBid?.order || req?.order_id || req?.order);
    const order = acceptedBid?.order || req?.order;
    const rawOrderStatus = String(order?.status || acceptedBid?.order_status || '').toLowerCase();
    
    const isCompleted = rawOrderStatus === 'completed' || rawOrderStatus === 'delivered' || Boolean(acceptedBid?.is_delivered);
    const isInTransit = ['in_transit', 'picked_up', 'in_progress', 'dispatched', 'driver_assigned'].includes(rawOrderStatus);
    const isRejected = bids.length > 0 && bids.every(q => {
        const s = String(q.status_raw || q.status || '').toLowerCase();
        return s.includes('reject') || s.includes('decline') || s.includes('cancel');
    });
    const isExpired = Boolean(req.is_expired || (req.status && String(req.status).toLowerCase().includes('expire')));

    const reqCreated = req.created_at || quote?.created_at;
    const firstBid = bids[0];
    const quoteSubmitted = firstBid?.created_at || firstBid?.submitted_at || quote?.created_at;
    const acceptedTime = acceptedBid?.accepted_at || acceptedBid?.updated_at;
    const transitTime = order?.dispatched_at || order?.pickup_date || order?.updated_at;
    const completedTime = order?.delivered_at || order?.completed_at || order?.updated_at;

    const bidsCount = bids.length;
    const lowestBid = bids.length > 0 
        ? bids.reduce((min, b) => {
            const val = b.amount_raw || parseFloat(String(b.amount || 0).replace(/[^0-9.]/g, '')) || 999999;
            return val < min.val ? { val, b } : min;
        }, { val: 999999, b: bids[0] }).b 
        : null;

    // Step 1: Request Created
    const step1: QuoteLifecycleStep = {
        id: 'request_created',
        title: 'Request Created',
        subtitle: req.formatted_id || req.request_id || 'REQ Published',
        description: 'Freight specifications submitted and broadcasted to verified carriers.',
        timestamp: reqCreated,
        dateFormatted: formatStepTimestamp(reqCreated) || formatDisplayDate(reqCreated) || 'Created',
        status: 'completed',
        icon: FileText,
        actor: 'Customer'
    };

    // Step 2: Receiving Carrier Bids
    const step2Status: QuoteLifecycleStep['status'] = bidsCount > 0 ? 'completed' : 'active';
    const step2: QuoteLifecycleStep = {
        id: 'quote_submitted',
        title: 'Carrier Bids',
        subtitle: bidsCount > 0 ? `${bidsCount} Bid${bidsCount > 1 ? 's' : ''} Received` : 'Awaiting Bids',
        description: bidsCount > 0 
            ? `Carriers submitted competitive quotes (lowest: ${lowestBid?.amount || '—'}).`
            : 'Verified carriers notified and reviewing cargo specifications.',
        timestamp: quoteSubmitted,
        dateFormatted: bidsCount > 0 
            ? (formatStepTimestamp(quoteSubmitted) || formatDisplayDate(quoteSubmitted)) 
            : 'In Progress',
        status: step2Status,
        icon: Send,
        actor: 'Verified Carriers'
    };

    // Step 3: Terms & Evaluation / Negotiation
    let step3Status: QuoteLifecycleStep['status'] = 'pending';
    let step3Title = 'Review & Evaluation';
    let step3Subtitle = 'Comparing Offers';
    let step3Desc = 'Shipper comparing carrier ratings, equipment types, and pricing.';

    if (isAccepted || hasOrder) {
        step3Status = 'completed';
        step3Subtitle = 'Review Completed';
        step3Desc = 'Shipper evaluated offers and selected the winning proposal.';
    } else if (isNegotiating) {
        step3Status = 'active';
        step3Title = 'Negotiation Active';
        step3Subtitle = 'Counter-Offers Sent';
        step3Desc = 'Direct rate negotiation and cargo scheduling in progress.';
    } else if (bidsCount > 0) {
        step3Status = 'active';
        step3Subtitle = 'Evaluating Bids';
        step3Desc = 'Shipper is actively reviewing and comparing received proposals.';
    }

    const step3: QuoteLifecycleStep = {
        id: 'negotiation',
        title: step3Title,
        subtitle: step3Subtitle,
        description: step3Desc,
        timestamp: isNegotiating ? quote?.updated_at : (bidsCount > 0 ? quoteSubmitted : undefined),
        dateFormatted: step3Status === 'completed' 
            ? 'Completed' 
            : (step3Status === 'active' ? (isNegotiating ? 'Active Chat' : 'In Review') : 'Pending Bids'),
        status: step3Status,
        icon: MessageSquare,
        actor: 'Customer & Carriers'
    };

    const lateSteps = buildLateLifecycleSteps({
        acceptedBid,
        isAccepted,
        hasOrder,
        order,
        rawOrderStatus,
        isCompleted,
        isInTransit,
        isRejected,
        isExpired,
        acceptedTime,
        transitTime,
        completedTime,
    });

    return [step1, step2, step3, ...lateSteps];
};
