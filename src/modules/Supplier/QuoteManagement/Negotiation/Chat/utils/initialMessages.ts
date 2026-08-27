import { NegotiationItem } from '../../types';
import { ChatMessage } from '../types';

export function generateInitialMessages(item: NegotiationItem): ChatMessage[] {
    const currency = item.currency || '€';
    const origAmount = item.originalAmount || 2100;
    const currOffer = item.currentOffer || 1850;

    return [
        {
            id: 'msg-1',
            type: 'system',
            text: `Negotiation channel opened for Quote ${item.quoteId} (${item.requestTitle || `${item.pickup} → ${item.delivery}`})`,
            time: item.lastUpdated || '10:00 AM, Today'
        },
        {
            id: 'msg-2',
            type: 'received',
            sender: item.customer,
            avatar: item.customer.charAt(0).toUpperCase(),
            text: `Hello, we received your initial quote of ${currency} ${origAmount.toLocaleString()} for the freight route from ${item.pickup} to ${item.delivery}. Can we discuss a discount for regular shipments?`,
            time: '10:05 AM'
        },
        {
            id: 'msg-3',
            type: 'sent',
            text: `Hello ${item.customer}, thank you for reaching out. We have reserved an available ${item.vehicleType || 'vehicle'} for pickup on ${item.pickupDate || item.requestDate || 'scheduled date'}. We are open to counter offers.`,
            time: '10:14 AM'
        },
        {
            id: 'msg-4',
            type: 'offer',
            title: 'Counter Offer Proposed',
            text: `Proposed counter rate for route ${item.origin || item.pickup} to ${item.destination || item.delivery}.`,
            time: '10:30 AM',
            newTotal: currOffer,
            previousTotal: origAmount
        }
    ];
}

export function getRandomCustomerReply(item: NegotiationItem): string {
    const replies = [
        `Thank you for your message! We are checking details with our warehouse at ${item.delivery}.`,
        `Understood! Can you verify if the vehicle is equipped with necessary load securing straps?`,
        `Thanks for the update. We have noted this down and our dispatch team is prepared for ${item.pickupDate || 'pickup'}.`,
        `Received and confirmed. We appreciate the fast communication regarding quote ${item.quoteId}.`
    ];
    return replies[Math.floor(Math.random() * replies.length)];
}
