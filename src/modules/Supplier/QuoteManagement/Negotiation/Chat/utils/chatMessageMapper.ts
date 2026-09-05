import { ChatMessage } from '../types';
import { NegotiationItem } from '../../types';
import { generateInitialMessages } from './initialMessages';
import { formatLocalTime } from '@/modules/Customer/QuoteManagement/Negotiation/Chat/utils/customerChatUtils';

export const mapRawChatMessages = (
    rawMsgs: any[],
    activeNegotiation: NegotiationItem,
    isQuoteAccepted: boolean,
    isQuoteRejected: boolean,
    quoteDeclineReason?: string
): ChatMessage[] => {
    const initialItems = generateInitialMessages(activeNegotiation).map(init => {
        if (init.type === 'quote_request') {
            if (isQuoteAccepted) return { ...init, status: 'accepted' as const };
            if (isQuoteRejected) return { ...init, status: 'rejected' as const, declineReason: quoteDeclineReason || init.declineReason };
        }
        return init;
    });

    const mapped: ChatMessage[] = rawMsgs.map((m: any) => {
        const isSent = Boolean(m.is_me || m.sender_type === 'supplier' || m.sender_id === 2);
        return {
            id: m.id || `msg-${Date.now()}-${Math.random()}`,
            type: m.type === 'system' ? 'system' : (m.message_type === 'offer' ? 'offer' : (m.message_type === 'quote_request' ? 'quote_request' : (isSent ? 'sent' : 'received'))),
            attachments: m.attachments || (m.attachment ? [m.attachment] : undefined),
            text: m.text || m.message || m.message_text || m.body || '',
            time: formatLocalTime(m.created_at, m.time || m.created_at_formatted),
            sender: m.sender || m.sender_name,
            avatar: m.avatar,
            seen: Boolean(m.is_read || m.seen || m.read_at),
            seenAt: m.seen_at || m.read_at,
            isRead: Boolean(m.is_read),
            deliveryStatus: m.is_read ? 'seen' : (m.delivery_status || 'sent'),
            status: m.status,
            declineReason: m.decline_reason || m.declineReason,
            newTotal: m.proposed_amount ? Number(m.proposed_amount) : m.newTotal,
            previousTotal: m.previous_amount ? Number(m.previous_amount) : m.previousTotal
        };
    });

    const baseCards = initialItems.filter(item => item.type === 'quote_request' || String(item.id).includes('quote-proposal'));
    return [...baseCards, ...mapped.filter(m => m.type !== 'quote_request' && !String(m.id).includes('quote-proposal'))];
};
