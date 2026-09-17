import { formatLocalTime } from '@/modules/Customer/QuoteManagement/Negotiation/Chat/utils/customerChatUtils';
import { NegotiationItem } from '../../types';
import { ChatMessage } from '../types';
import { generateInitialMessages } from './initialMessages';

export const mapRawChatMessages = (
    rawMsgs: any[],
    activeNegotiation: NegotiationItem,
    isQuoteAccepted: boolean,
    isQuoteRejected: boolean,
    quoteDeclineReason?: string
): ChatMessage[] => {
    const hasAnyCounterOffers = Array.isArray(rawMsgs) && rawMsgs.some((m: any) => {
        const rType = String(m.type || m.message_type || '').toLowerCase();
        return rType === 'offer' || rType === 'counter_offer' || rType === 'counter-offer' || Boolean(m.proposed_amount);
    });

    const initialItems = generateInitialMessages(activeNegotiation).map(init => {
        if (init.type === 'quote_request') {
            if (isQuoteAccepted) return { ...init, status: 'accepted' as const };
            if (isQuoteRejected) return { ...init, status: 'rejected' as const, declineReason: quoteDeclineReason || init.declineReason };
            if (hasAnyCounterOffers || (activeNegotiation as any)?.revisionStatus === 'pending' || (activeNegotiation as any)?.revision_status === 'pending' || (activeNegotiation.currentOffer && activeNegotiation.originalAmount && activeNegotiation.currentOffer !== activeNegotiation.originalAmount)) {
                return { ...init, status: 'superseded' as const, is_superseded: true };
            }
        }
        return init;
    });

    const mapped: ChatMessage[] = rawMsgs.map((m: any) => {
        const isSent = m.is_me !== undefined ? Boolean(m.is_me) : Boolean(m.sender_type === 'supplier' || (m.sender_id && (activeNegotiation as any)?.raw?.user_id && m.sender_id === (activeNegotiation as any).raw.user_id));
        const rawType = String(m.type || m.message_type || '').toLowerCase();
        const textContent = String(m.text || m.message || m.message_text || m.body || '');

        const isOffer = 
            rawType === 'offer' || 
            rawType === 'counter_offer' || 
            rawType === 'counter-offer' ||
            m.isCounterOffer === true ||
            (Boolean(m.proposed_amount) && rawType !== 'quote_request' && rawType !== 'system') ||
            textContent.toLowerCase().includes('submitted a counter offer') ||
            textContent.toLowerCase().includes('counter offer of');

        const isSystem = rawType === 'system' || textContent.startsWith('✅') || textContent.startsWith('❌') || textContent.startsWith('Offer Accepted') || textContent.startsWith('Payment completed!') || textContent.startsWith('Booking confirmed!');
        const isQuoteRequest = rawType === 'quote_request';

        const msgType = isSystem ? 'system' : (isQuoteRequest ? 'quote_request' : (isOffer ? 'offer' : (isSent ? 'sent' : 'received')));

        const proposedAmt = m.proposed_amount ? Number(m.proposed_amount) : (m.newTotal ? Number(m.newTotal) : (m.amount ? Number(m.amount) : undefined));
        const prevAmt = m.previous_amount ? Number(m.previous_amount) : (m.previousTotal ? Number(m.previousTotal) : (activeNegotiation?.currentOffer || activeNegotiation?.originalAmount || undefined));

        return {
            id: m.id || `msg-${Date.now()}-${Math.random()}`,
            type: msgType,
            attachments: m.attachments || (m.attachment ? [m.attachment] : undefined),
            text: textContent,
            time: formatLocalTime(m.created_at, m.time || m.created_at_formatted),
            sender: m.sender || m.sender_name,
            avatar: m.avatar,
            seen: Boolean(m.is_read || m.seen || m.read_at),
            seenAt: m.seen_at || m.read_at,
            isRead: Boolean(m.is_read),
            deliveryStatus: m.is_read ? 'seen' : (m.delivery_status || 'sent'),
            status: m.status || 'pending',
            declineReason: m.decline_reason || m.declineReason,
            newTotal: proposedAmt,
            previousTotal: prevAmt,
            base_amount: m.base_amount !== undefined && m.base_amount !== null ? Number(m.base_amount) : undefined,
            extra_charges: m.extra_charges || m.extraCharges || undefined,
            extraCharges: m.extra_charges || m.extraCharges || undefined,
            title: m.title || (isOffer ? (isSent ? 'Counter Offer Submitted' : 'Counter Offer Received') : undefined),
            notes: m.notes || (textContent.toLowerCase().includes('submitted a counter offer') ? '' : textContent),
            is_me: isSent,
            is_my_offer: m.is_my_offer !== undefined ? Boolean(m.is_my_offer) : isSent,
            isPinned: Boolean(m.is_pinned ?? m.isPinned),
            isDeleted: Boolean(m.is_deleted ?? m.isDeleted),
            isEdited: Boolean(m.is_edited ?? m.edited_at),
        };
    });

    const quoteRequestCard = initialItems.find(item => item.type === 'quote_request');
    const filteredMapped = mapped.filter(m => m.type !== 'quote_request');
    return quoteRequestCard ? [quoteRequestCard, ...filteredMapped] : filteredMapped;
};
