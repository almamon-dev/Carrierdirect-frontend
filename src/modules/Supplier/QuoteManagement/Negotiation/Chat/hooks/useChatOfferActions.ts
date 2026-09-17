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
    const handleSendCounterOffer = async (amount: number, note: string, extraCharges?: any[], baseFreight?: number) => {
        const newOfferMsg: ChatMessage = {
            id: `offer-${Date.now()}`,
            type: 'offer',
            title: 'Counter Offer Submitted',
            text: note || `You submitted a counter rate of € ${amount.toLocaleString()}`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            newTotal: amount,
            previousTotal: currentPrice,
            status: 'pending',
            is_me: true,
            is_my_offer: true,
            extra_charges: extraCharges || [],
            base_amount: baseFreight,
        } as any;
        updateMessagesForChat(activeRawId, prev => [...prev, newOfferMsg]);
        setTimeout(scrollToBottom, 100);

        try {
            await apiClient.post(`/supplier/negotiations/${activeRawId}/counter-offer`, {
                amount,
                proposed_amount: amount,
                note,
                extra_charges: extraCharges,
                base_amount: baseFreight,
                negotiation_id: activeRawId
            });
            window.dispatchEvent(new CustomEvent("carrierdirect_notif_update"));
        } catch {
            await apiClient.post(`/negotiations/${activeRawId}/counter-offer`, {
                amount,
                proposed_amount: amount,
                note,
                extra_charges: extraCharges,
                base_amount: baseFreight,
                negotiation_id: activeRawId
            }).catch(() => {});
            window.dispatchEvent(new CustomEvent("carrierdirect_notif_update"));
        }
    };

    const handleAcceptOffer = async (offerMsg: any) => {
        const acceptedTotal = Number(offerMsg?.newTotal || offerMsg?.proposed_amount || currentPrice);
        const supplierName = (activeNegotiation?.raw as any)?.user?.name || "Supplier";
        const rawQuoteNum = (activeNegotiation as any)?.quoteNo || activeNegotiation?.quoteId || activeNegotiation?.id || "0003";
        const quoteNoStr = String(rawQuoteNum).startsWith("QT-") ? rawQuoteNum : `QT-${String(rawQuoteNum).padStart(4, "0")}`;

        const supplierTextMsg: ChatMessage = {
            id: `accept-text-${Date.now()}`,
            type: "sent",
            text: "Hi,\nWe've reviewed your counter offer and we accept it.\nPlease proceed with the payment.",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            is_me: true
        } as any;

        const confirmMsg: ChatMessage = {
            id: `system-${Date.now() + 1}`,
            type: 'system',
            text: `Offer Accepted\n${supplierName} has accepted your counter offer (${quoteNoStr}).`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: 'accepted',
            newTotal: acceptedTotal
        };

        updateMessagesForChat(activeRawId, prev =>
            prev.map(m => (m.type === 'quote_request' || m.id === offerMsg?.id || m.type === 'offer') ? { ...m, status: 'accepted' as const, newTotal: acceptedTotal } : m).concat([supplierTextMsg, confirmMsg])
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
            window.dispatchEvent(new CustomEvent("carrierdirect_notif_update"));
        } catch {
            await apiClient.post(`/negotiations/${activeRawId}/accept`, {
                offer_id: offerMsg?.id,
                amount: acceptedTotal,
                proposed_amount: acceptedTotal
            }).catch(() => {});
            window.dispatchEvent(new CustomEvent("carrierdirect_notif_update"));
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
