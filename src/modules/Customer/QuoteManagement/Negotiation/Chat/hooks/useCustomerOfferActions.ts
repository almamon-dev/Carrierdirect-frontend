import apiClient from '@/lib/axios';
import { CustomerChatItem, CustomerChatMessage } from '../types';

interface UseCustomerOfferActionsProps {
    activeChatId: string | number;
    activeChat: CustomerChatItem | null;
    updateMessagesForActiveChat: (updater: (prev: CustomerChatMessage[]) => CustomerChatMessage[]) => void;
    scrollToBottom: () => void;
}

export const useCustomerOfferActions = ({
    activeChatId,
    activeChat,
    updateMessagesForActiveChat,
    scrollToBottom,
}: UseCustomerOfferActionsProps) => {
    const handleSendCounterOffer = async (amount: number, note: string) => {
        const newOfferMsg: CustomerChatMessage = {
            id: `offer-${Date.now()}`,
            type: 'offer',
            title: 'Counter Offer Submitted',
            text: note || `You submitted a revised counter rate of € ${amount.toLocaleString()}`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            newTotal: amount,
            previousTotal: activeChat?.currentPrice || 0,
            status: 'pending'
        };
        updateMessagesForActiveChat(prev => [...prev, newOfferMsg]);
        setTimeout(scrollToBottom, 100);

        try {
            await apiClient.post(`/customer/negotiations/${activeChatId}/counter-offer`, {
                amount, proposed_amount: amount, note, negotiation_id: activeChatId
            });
            window.dispatchEvent(new CustomEvent('carrierdirect_notif_update'));
        } catch {
            await apiClient.post(`/negotiations/${activeChatId}/counter-offer`, {
                amount, proposed_amount: amount, note, negotiation_id: activeChatId
            }).catch(() => {});
            window.dispatchEvent(new CustomEvent('carrierdirect_notif_update'));
        }
    };

    const handleAcceptOffer = async (offerMsg: any) => {
        const acceptedTotal = Number(offerMsg?.newTotal || offerMsg?.proposed_amount || activeChat?.currentPrice || 0);
        const isCounter = Boolean(
            offerMsg?.type === 'offer' || 
            offerMsg?.message_type === 'offer' || 
            offerMsg?.isCounterOffer || 
            (offerMsg?.title && String(offerMsg.title).toLowerCase().includes('counter'))
        );
        const confirmMsg: CustomerChatMessage = {
            id: `system-${Date.now()}`,
            type: 'system',
            text: isCounter
                ? `✅ Counter offer of € ${acceptedTotal.toLocaleString()} has been accepted and confirmed!`
                : `✅ Quote offer of € ${acceptedTotal.toLocaleString()} has been accepted and confirmed!`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        updateMessagesForActiveChat(prev =>
            prev.map(m => (m.type === 'quote_request' || m.id === offerMsg?.id || m.type === 'offer') ? { ...m, status: 'accepted' as const, newTotal: acceptedTotal } : m).concat(confirmMsg)
        );
        if (activeChat?.raw) {
            activeChat.raw.status = 'accepted';
            activeChat.raw.status_raw = 'accepted';
        }
        setTimeout(scrollToBottom, 100);

        try {
            await apiClient.post(`/customer/negotiations/${activeChatId}/accept`, {
                offer_id: offerMsg?.id, amount: acceptedTotal, proposed_amount: acceptedTotal
            });
            window.dispatchEvent(new CustomEvent('carrierdirect_notif_update'));
        } catch {
            await apiClient.post(`/negotiations/${activeChatId}/accept`, {
                offer_id: offerMsg?.id, amount: acceptedTotal, proposed_amount: acceptedTotal
            }).catch(() => {});
            window.dispatchEvent(new CustomEvent('carrierdirect_notif_update'));
        }
    };

    const handleRejectOffer = async (offerMsg: any, reason?: string) => {
        const reasonText = reason ? ` (Reason: "${reason}")` : '';
        const declineMsg: CustomerChatMessage = {
            id: `system-${Date.now()}`,
            type: 'system',
            text: `❌ Offer declined${reasonText}. You may submit an alternative rate.`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        updateMessagesForActiveChat(prev =>
            prev.map(m => (m.id === offerMsg?.id || (offerMsg?.type === 'quote_request' && m.type === 'quote_request')) ? { ...m, status: 'rejected' as const, declineReason: reason } : m).concat(declineMsg)
        );
        setTimeout(scrollToBottom, 100);

        try {
            await apiClient.post(`/customer/negotiations/${activeChatId}/reject`, { offer_id: offerMsg?.id, reason: reason || '', decline_reason: reason || '' });
            window.dispatchEvent(new CustomEvent('carrierdirect_notif_update'));
        } catch {
            await apiClient.post(`/negotiations/${activeChatId}/reject`, { offer_id: offerMsg?.id, reason: reason || '', decline_reason: reason || '' }).catch(() => {});
            window.dispatchEvent(new CustomEvent('carrierdirect_notif_update'));
        }
    };

    return {
        handleSendCounterOffer,
        handleAcceptOffer,
        handleRejectOffer,
    };
};
