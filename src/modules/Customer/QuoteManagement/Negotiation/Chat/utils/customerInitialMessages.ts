import { CustomerChatMessage } from '../types';

export const generateCustomerInitialMessages = (chatItem: any): CustomerChatMessage[] => {
    if (!chatItem) return [];
    const raw = chatItem?.raw || chatItem;
    const origAmount = Number(raw?.originalAmount || chatItem?.currentPrice || 0);
    const pickupLoc = raw?.origin || raw?.pickup || chatItem?.origin || 'Pickup Location';
    const deliveryLoc = raw?.destination || raw?.delivery || chatItem?.destination || 'Delivery Destination';
    const quoteNum = chatItem?.quoteNo || raw?.quoteId || (raw?.id ? `QT-${String(raw.id).padStart(4, '0')}` : 'QT-0001');
    const customerName = raw?.customer || 'Customer';
    const transitTime = raw?.transitTime || '1 - 2 Business Days';
    const additionalNotes = (raw?.notes && raw.notes.trim().length > 5)
        ? raw.notes.trim()
        : 'Includes GPS live tracking, tail-lift vehicle & loading assistance';

    const supplierProposal = `Hello ${customerName},

I’m interested in your freight request. I’d like to submit the following quote:

• Quote: €${origAmount.toLocaleString()}
• Pickup: ${pickupLoc}
• Delivery: ${deliveryLoc}
• Estimated Transit Time: ${transitTime}
• Additional Notes: ${additionalNotes}

Please let me know if you need any further information. I look forward to discussing the details with you.

Best regards`;

    const isRejected = raw?.status === 'rejected' || raw?.status === 'declined' || raw?.status === 'Declined' || raw?.status === 'Offer Declined' || raw?.revisionStatus === 'rejected' || raw?.status_raw === 'rejected';
    const isAccepted = raw?.status === 'accepted' || raw?.status === 'Accepted' || raw?.status === 'completed' || raw?.status === 'confirmed' || raw?.revisionStatus === 'accepted' || raw?.status_raw === 'accepted' || raw?.status_raw === 'completed';
    const initialStatus = isAccepted ? 'accepted' : isRejected ? 'rejected' : 'pending';

    return [
        {
            id: `req-${chatItem?.id || raw?.id || 1}`,
            type: 'quote_request',
            title: 'Quote Request Received',
            sender: customerName,
            text: `${customerName} has submitted a quote request for this shipment.`,
            time: raw?.lastUpdated || raw?.requestDate || 'Today',
            newTotal: origAmount,
            previousTotal: origAmount,
            quoteNo: quoteNum,
            status: initialStatus,
            declineReason: raw?.declineReason || raw?.decline_reason
        },
        {
            id: `msg-quote-proposal-${chatItem?.id || raw?.id || 1}`,
            type: 'received',
            sender: chatItem?.name || raw?.supplier || 'Carrier Partner',
            avatar: chatItem?.avatar || (raw?.supplier || 'C').charAt(0).toUpperCase(),
            text: supplierProposal,
            time: raw?.lastUpdated || raw?.requestDate || '10:05 AM'
        }
    ];
};
