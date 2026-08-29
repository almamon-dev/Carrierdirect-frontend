import { NegotiationItem } from '../../types';
import { ChatMessage } from '../types';

export function generateInitialMessages(item?: NegotiationItem | null): ChatMessage[] {
    if (!item) return [];

    const origAmount = Number(item.originalAmount) || Number(String(item.budget || '').replace(/[^0-9.]/g, '')) || 3986;
    const pickupLoc = item.origin || item.pickup || 'Madrid Coslada Logistics, ES';
    const deliveryLoc = item.destination || item.delivery || 'Barcelona Port ZAL, ES';
    const customerName = item.customer || 'Customer';
    const transitTime = (item as any).transitTime || '1 - 2 Business Days';
    const additionalNotes = (item.notes && item.notes.trim().length > 5)
        ? item.notes.trim()
        : 'Includes GPS live tracking, tail-lift vehicle & loading assistance';

    const supplierQuoteProposal = `Hello ${customerName},

I’m interested in your freight request. I’d like to submit the following quote:

• Quote: €${origAmount.toLocaleString()}
• Pickup: ${pickupLoc}
• Delivery: ${deliveryLoc}
• Estimated Transit Time: ${transitTime}
• Additional Notes: ${additionalNotes}

Please let me know if you need any further information. I look forward to discussing the details with you.

Best regards`;

    const isRejected = item.status === 'Offer Declined' || item.status === 'Declined' || (item as any).status === 'rejected' || (item as any).statusRaw === 'rejected' || (item as any).revisionStatus === 'rejected';
    const isAccepted = item.status === 'Accepted' || (item as any).status === 'accepted' || (item as any).status === 'confirmed' || (item as any).status === 'completed' || (item as any).statusRaw === 'accepted' || (item as any).statusRaw === 'completed';
    const initialStatus = isAccepted ? 'accepted' : isRejected ? 'rejected' : 'pending';

    return [
        {
            id: `req-${item.rawId || item.id || 1}`,
            type: 'quote_request',
            title: 'Quote Request Received',
            sender: customerName,
            text: `${customerName} has submitted a quote request for this shipment.`,
            time: item.lastUpdated || item.requestDate || 'Today',
            newTotal: origAmount,
            previousTotal: origAmount,
            status: initialStatus,
            declineReason: (item as any).declineReason || (item as any).decline_reason
        },
        {
            id: `msg-quote-proposal-${item.rawId || item.id || 1}`,
            type: 'received',
            sender: customerName,
            avatar: customerName.charAt(0).toUpperCase(),
            text: supplierQuoteProposal,
            time: item.lastUpdated || item.requestDate || '10:05 AM'
        }
    ];
}

export function getRandomCustomerReply(item: NegotiationItem): string {
    const replies = [
        `Thank you for your message! We are checking details with our warehouse at ${item.delivery || 'destination'}.`,
        `Understood! Can you verify if the vehicle is equipped with necessary load securing equipment?`,
        `Thanks for the update. We have noted this down and our dispatch team is prepared for ${item.pickupDate || 'pickup'}.`,
        `Received and confirmed. We appreciate the fast communication regarding quote #${item.quoteId || item.id}.`
    ];
    return replies[Math.floor(Math.random() * replies.length)];
}
