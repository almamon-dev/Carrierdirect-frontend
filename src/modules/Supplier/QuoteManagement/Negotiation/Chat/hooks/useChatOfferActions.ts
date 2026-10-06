import { apiClient } from '@/lib/axios';
import { useToastStore } from '@/stores/useToastStore';
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
    const showToast = useToastStore((state) => state.showToast);

    const handleSendCounterOffer = async (amount: number, note: string, extraCharges?: any[], baseFreight?: number) => {
        const cleanId = String(activeRawId).replace(/[^0-9]/g, '') || (activeNegotiation as any)?.raw?.id || activeNegotiation?.id || activeRawId;
        const newOfferMsg: ChatMessage = {
            id: `offer-${Date.now()}`,
            type: 'offer',
            title: 'Counter Offer Submitted',
            text: note || `You submitted a revised offer rate of € ${amount.toLocaleString()}`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            newTotal: amount,
            proposed_amount: amount,
            previousTotal: currentPrice,
            previous_amount: currentPrice,
            status: 'pending',
            is_me: true,
            is_my_offer: true,
            extra_charges: extraCharges || [],
            extraCharges: extraCharges || [],
            base_amount: baseFreight,
            baseFreight: baseFreight,
            currency: '€'
        } as any;
        updateMessagesForChat(activeRawId, prev => [...prev, newOfferMsg]);
        setTimeout(scrollToBottom, 100);

        try {
            await apiClient.post(`/supplier/negotiations/${cleanId}/counter-offer`, {
                amount,
                proposed_amount: amount,
                note,
                extra_charges: extraCharges,
                base_amount: baseFreight,
                base_price: baseFreight,
                quote_id: cleanId,
                negotiation_id: cleanId
            });
            window.dispatchEvent(new CustomEvent("carrierdirect_notif_update"));
            window.dispatchEvent(new CustomEvent("carrierdirect_negotiation_refresh"));
            showToast("Revised offer submitted successfully!", "success");
        } catch {
            try {
                await apiClient.post(`/negotiations/${cleanId}/counter-offer`, {
                    amount,
                    proposed_amount: amount,
                    note,
                    extra_charges: extraCharges,
                    base_amount: baseFreight,
                    base_price: baseFreight,
                    quote_id: cleanId,
                    negotiation_id: cleanId
                });
                window.dispatchEvent(new CustomEvent("carrierdirect_notif_update"));
                window.dispatchEvent(new CustomEvent("carrierdirect_negotiation_refresh"));
                showToast("Revised offer submitted successfully!", "success");
            } catch (err: any) {
                showToast(err?.response?.data?.message || "Failed to submit revised offer.", "error");
            }
        }
    };

    const handleAcceptOffer = async (offerMsg: any) => {
        const cleanId = String(activeRawId).replace(/[^0-9]/g, '') || (activeNegotiation as any)?.raw?.id || activeNegotiation?.id || activeRawId;
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
            await apiClient.post(`/supplier/negotiations/${cleanId}/accept`, {
                offer_id: offerMsg?.id,
                amount: acceptedTotal,
                proposed_amount: acceptedTotal,
                quote_id: cleanId
            });
            window.dispatchEvent(new CustomEvent("carrierdirect_notif_update"));
            window.dispatchEvent(new CustomEvent("carrierdirect_negotiation_refresh"));
            showToast("Counter offer accepted successfully!", "success");
        } catch {
            try {
                await apiClient.post(`/negotiations/${cleanId}/accept`, {
                    offer_id: offerMsg?.id,
                    amount: acceptedTotal,
                    proposed_amount: acceptedTotal,
                    quote_id: cleanId
                });
                window.dispatchEvent(new CustomEvent("carrierdirect_notif_update"));
                window.dispatchEvent(new CustomEvent("carrierdirect_negotiation_refresh"));
                showToast("Counter offer accepted successfully!", "success");
            } catch (err: any) {
                showToast(err?.response?.data?.message || "Failed to accept offer.", "error");
            }
        }
    };

    const handleRejectOffer = async (offerMsg: any, reason?: string) => {
        const cleanId = String(activeRawId).replace(/[^0-9]/g, '') || (activeNegotiation as any)?.raw?.id || activeNegotiation?.id || activeRawId;
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
            await apiClient.post(`/supplier/negotiations/${cleanId}/reject`, {
                offer_id: offerMsg?.id,
                reason: reason || '',
                decline_reason: reason || '',
                quote_id: cleanId
            });
            window.dispatchEvent(new CustomEvent("carrierdirect_notif_update"));
            window.dispatchEvent(new CustomEvent("carrierdirect_negotiation_refresh"));
        } catch {
            await apiClient.post(`/negotiations/${cleanId}/reject`, {
                offer_id: offerMsg?.id,
                reason: reason || '',
                decline_reason: reason || '',
                quote_id: cleanId
            }).catch(() => {});
            window.dispatchEvent(new CustomEvent("carrierdirect_notif_update"));
            window.dispatchEvent(new CustomEvent("carrierdirect_negotiation_refresh"));
        }
    };

    return {
        handleSendCounterOffer,
        handleAcceptOffer,
        handleRejectOffer,
    };
};
