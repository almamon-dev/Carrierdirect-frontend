import { apiClient } from '@/lib/axios';
import { NegotiationItem } from '../../types';
import { ChatMessage } from '../types';

interface UseChatOfferActionsProps {
    activeRawId: string | number;
    activeNegotiation: NegotiationItem | null;
    currentPrice: number;
    updateMessagesForChat: (chatId: number | string, updater: (prev: ChatMessage[]) => ChatMessage[]) => void;
    scrollToBottom: () => void;
}

export const useChatOfferActions = ({
    activeRawId,
    activeNegotiation,
    currentPrice,
    updateMessagesForChat,
    scrollToBottom,
}: UseChatOfferActionsProps) => {
    const handleSendCounterOffer = async (amount: number, note: string) => {
        const newOfferMsg: ChatMessage = {
            id: `offer-${Date.now()}`,
            type: 'offer',
            title: 'Counter Offer Submitted',
            text: note || `You submitted a counter rate of € ${amount.toLocaleString()}`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            newTotal: amount,
            previousTotal: currentPrice,
            status: 'pending'
        };
        updateMessagesForChat(activeRawId, prev => [...prev, newOfferMsg]);
        setTimeout(scrollToBottom, 100);

        try {
            await apiClient.post(`/supplier/negotiations/${activeRawId}/counter-offer`, {
                amount,
                proposed_amount: amount,
                note,
                negotiation_id: activeRawId
            });
        } catch {
            await apiClient.post(`/negotiations/${activeRawId}/counter-offer`, {
                amount,
                proposed_amount: amount,
                note,
                negotiation_id: activeRawId
            }).catch(() => {});
        }
    };

    const handleAcceptOffer = async (offerMsg: any) => {
        const acceptedTotal = Number(offerMsg?.newTotal || offerMsg?.proposed_amount || currentPrice);
        const isCounter = Boolean(
            offerMsg?.type === 'offer' || 
            offerMsg?.message_type === 'offer' || 
            offerMsg?.isCounterOffer || 
            (offerMsg?.title && String(offerMsg.title).toLowerCase().includes('counter'))
        );
        const confirmMsg: ChatMessage = {
            id: `system-${Date.now()}`,
            type: 'system',
            text: isCounter
                ? `✅ Counter offer of € ${acceptedTotal.toLocaleString()} has been accepted!`
                : `✅ Quote offer of € ${acceptedTotal.toLocaleString()} has been accepted!`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        updateMessagesForChat(activeRawId, prev =>
            prev.map(m => (m.type === 'quote_request' || m.id === offerMsg?.id || m.type === 'offer') ? { ...m, status: 'accepted' as const, newTotal: acceptedTotal } : m).concat(confirmMsg)
        );
        if (activeNegotiation) {
            (activeNegotiation as any).status = 'Accepted';
            (activeNegotiation as any).statusRaw = 'accepted';
        }
        setTimeout(scrollToBottom, 100);

        try {
            await apiClient.post(`/supplier/negotiations/${activeRawId}/accept`, {
                offer_id: offerMsg?.id,
                amount: acceptedTotal,
                proposed_amount: acceptedTotal
            });
        } catch {
            await apiClient.post(`/negotiations/${activeRawId}/accept`, {
                offer_id: offerMsg?.id,
                amount: acceptedTotal,
                proposed_amount: acceptedTotal
            }).catch(() => {});
        }
    };

    const handleRejectOffer = async (offerMsg: any, reason?: string) => {
        const reasonText = reason ? ` (Reason: "${reason}")` : '';
        const declineMsg: ChatMessage = {
            id: `system-${Date.now()}`,
            type: 'system',
            text: `❌ Offer declined${reasonText}.`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        updateMessagesForChat(activeRawId, prev =>
            prev.map(m => (m.id === offerMsg?.id || (offerMsg?.type === 'quote_request' && m.type === 'quote_request')) ? { ...m, status: 'rejected' as const, declineReason: reason } : m).concat(declineMsg)
        );
        setTimeout(scrollToBottom, 100);

        try {
            await apiClient.post(`/supplier/negotiations/${activeRawId}/reject`, { offer_id: offerMsg?.id, reason: reason || '', decline_reason: reason || '' });
        } catch {
            await apiClient.post(`/negotiations/${activeRawId}/reject`, { offer_id: offerMsg?.id, reason: reason || '', decline_reason: reason || '' }).catch(() => {});
        }
    };

    return {
        handleSendCounterOffer,
        handleAcceptOffer,
        handleRejectOffer,
    };
};
