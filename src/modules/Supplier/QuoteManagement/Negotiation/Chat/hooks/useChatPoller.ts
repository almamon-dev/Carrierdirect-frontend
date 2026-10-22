import React, { useState, useEffect } from 'react';
import apiClient from '@/lib/axios';
import { echo } from '@/lib/echo';
import { NegotiationItem } from '../../types';
import { ChatMessage } from '../types';
import { generateInitialMessages } from '../utils/initialMessages';
import { mapRawChatMessages } from '../utils/chatMessageMapper';

interface UseChatPollerProps {
    activeRawId: string | number;
    activeNegotiation: NegotiationItem;
    chatMessages: Record<string | number, ChatMessage[]>;
    setChatMessages: React.Dispatch<React.SetStateAction<Record<string | number, ChatMessage[]>>>;
    setIsCustomerTyping: (val: boolean) => void;
    typingAutoClearTimerRef: React.MutableRefObject<ReturnType<typeof setTimeout> | null>;
    typingInactivityTimerRef: React.MutableRefObject<ReturnType<typeof setTimeout> | null>;
}

export function useChatPoller({
    activeRawId,
    activeNegotiation,
    chatMessages,
    setChatMessages,
    setIsCustomerTyping,
    typingAutoClearTimerRef,
    typingInactivityTimerRef,
}: UseChatPollerProps) {
    const [isMessagesLoading, setIsMessagesLoading] = useState<boolean>(true);

    useEffect(() => {
        if (!activeRawId) return;

        const alreadyLoaded = Boolean(chatMessages[activeRawId] || chatMessages[String(activeRawId)]);
        if (!alreadyLoaded) setIsMessagesLoading(true);

        const fetchMessages = async () => {
            try {
                let res;
                try {
                    res = await apiClient.get(`/supplier/negotiations/${activeRawId}/messages`);
                } catch {
                    res = await apiClient.get(`/negotiations/${activeRawId}/messages`);
                }

                const rawData = res?.data?.data || res?.data || res;
                const rawMsgs = rawData?.all_messages || rawData?.messages || res?.data?.all_messages || res?.all_messages || (Array.isArray(rawData) ? rawData : []);
                const quoteObj = rawData?.quote || rawData?.original_quote || res?.data?.quote || activeNegotiation;
                if (quoteObj && activeNegotiation) {
                    const rawOrder = quoteObj.order || rawData?.original_quote?.order || activeNegotiation.raw?.order;
                    const rawInvoice = quoteObj.invoice || rawData?.original_quote?.invoice || activeNegotiation.raw?.invoice;
                    const isPaidFlag = Boolean(
                        quoteObj.is_paid ||
                        rawData?.original_quote?.is_paid ||
                        (rawInvoice && (rawInvoice.status === 'paid' || rawInvoice.invoice_type === 'pay_later')) ||
                        (rawOrder && ['in_progress', 'confirmed', 'completed', 'delivered'].includes(rawOrder.status))
                    );
                    const hasOrderFlag = Boolean(quoteObj.has_order || rawData?.original_quote?.has_order || rawOrder || quoteObj.order_id || rawData?.original_quote?.order_id);

                    activeNegotiation.raw = {
                        ...(activeNegotiation.raw || {}),
                        ...(quoteObj || {}),
                        has_order: hasOrderFlag,
                        is_paid: isPaidFlag,
                        order_number: quoteObj.order_number || rawData?.original_quote?.order_number || rawOrder?.order_number || activeNegotiation.raw?.order_number,
                        order_id: quoteObj.order_id || rawData?.original_quote?.order_id || rawOrder?.id || activeNegotiation.raw?.order_id,
                        order: rawOrder,
                        invoice: rawInvoice,
                    };
                    activeNegotiation.hasOrder = hasOrderFlag;
                    activeNegotiation.isPaid = isPaidFlag;
                    activeNegotiation.orderNumber = activeNegotiation.raw.order_number;
                    activeNegotiation.orderId = activeNegotiation.raw.order_id;
                }
                const hasAcceptedMsg = Array.isArray(rawMsgs) && rawMsgs.some((m: any) => m.status === 'accepted' || (typeof m.message === 'string' && m.message.includes('accepted')));
                const isQuoteAccepted = quoteObj?.status === 'accepted' || quoteObj?.status === 'Accepted' || quoteObj?.status === 'confirmed' || quoteObj?.status === 'completed' || (activeNegotiation as any)?.status === 'Accepted' || hasAcceptedMsg;
                const isQuoteRejected = quoteObj?.status === 'rejected' || quoteObj?.status === 'declined' || (activeNegotiation as any)?.status === 'Offer Declined' || (activeNegotiation as any)?.status === 'rejected';
                const quoteDeclineReason = quoteObj?.decline_reason || quoteObj?.declineReason;

                const customerObj = rawData?.customer;
                if (customerObj && activeNegotiation) {
                    if (customerObj.is_online !== undefined) activeNegotiation.isOnline = Boolean(customerObj.is_online);
                    if (customerObj.last_seen_human) activeNegotiation.lastSeenHuman = customerObj.last_seen_human;
                }

                if (quoteObj && activeNegotiation) {
                    if (Array.isArray(quoteObj.extra_charges) && quoteObj.extra_charges.length > 0) {
                        const freshCharges = quoteObj.extra_charges.map((c: any) => ({
                            id: c.id,
                            type: c.type || c.custom_name || c.customName || 'Custom',
                            customName: c.custom_name || c.customName || c.label || c.type,
                            label: c.type === 'Custom' ? (c.custom_name || c.customName || 'Custom') : (c.custom_name || c.customName || c.type),
                            amount: Number(c.amount || 0)
                        })).filter((c: any) => c.amount > 0);
                        activeNegotiation.extraCharges = freshCharges;
                        activeNegotiation.totalExtras = freshCharges.reduce((sum: number, c: any) => sum + Number(c.amount || 0), 0);
                    }
                    if (quoteObj.base_amount_raw || quoteObj.base_amount) {
                        activeNegotiation.baseFreight = Number(quoteObj.base_amount_raw ?? parseFloat(String(quoteObj.base_amount).replace(/[^0-9.]/g, '')) ?? activeNegotiation.baseFreight);
                    }
                }
                if (rawData?.is_customer_typing !== undefined || rawData?.is_typing !== undefined) {
                    const isTypingNow = Boolean(rawData?.is_customer_typing ?? rawData?.is_typing);
                    setIsCustomerTyping(isTypingNow);
                    if (isTypingNow) {
                        if (typingAutoClearTimerRef.current) clearTimeout(typingAutoClearTimerRef.current);
                        typingAutoClearTimerRef.current = setTimeout(() => setIsCustomerTyping(false), 3500);
                    }
                }

                if (Array.isArray(rawMsgs) && rawMsgs.length > 0) {
                    const finalMessages = mapRawChatMessages(rawMsgs, activeNegotiation, isQuoteAccepted, isQuoteRejected, quoteDeclineReason);
                    setChatMessages(prev => {
                        const existing = prev[activeRawId] || [];
                        if (existing.length === finalMessages.length && existing[existing.length - 1]?.id === finalMessages[finalMessages.length - 1]?.id) {
                            return prev; // Do not trigger state update if messages are unchanged
                        }
                        return { ...prev, [activeRawId]: finalMessages, [String(activeRawId)]: finalMessages };
                    });
                } else if (activeNegotiation) {
                    const finalMessages = generateInitialMessages(activeNegotiation);
                    setChatMessages(prev => ({ ...prev, [activeRawId]: finalMessages, [String(activeRawId)]: finalMessages }));
                }
            } catch {
                if (activeNegotiation) {
                    const finalMessages = generateInitialMessages(activeNegotiation);
                    setChatMessages(prev => ({ ...prev, [activeRawId]: finalMessages, [String(activeRawId)]: finalMessages }));
                }
            } finally {
                setIsMessagesLoading(false);
            }
        };

        const pollTypingStatus = async () => {
            try {
                const res = await apiClient.get(`/supplier/negotiations/${activeRawId}/typing`).catch(() =>
                    apiClient.get(`/negotiations/${activeRawId}/typing`)
                );
                const raw = res?.data?.data || res?.data || res;
                if (raw?.is_customer_typing !== undefined || raw?.is_typing !== undefined) {
                    const isTypingNow = Boolean(raw?.is_customer_typing ?? raw?.is_typing);
                    setIsCustomerTyping(isTypingNow);
                    if (isTypingNow) {
                        if (typingAutoClearTimerRef.current) clearTimeout(typingAutoClearTimerRef.current);
                        typingAutoClearTimerRef.current = setTimeout(() => setIsCustomerTyping(false), 3500);
                    }
                }
            } catch {}
        };

        fetchMessages();
        apiClient.post(`/supplier/negotiations/${activeRawId}/seen`).catch(() => apiClient.post(`/negotiations/${activeRawId}/seen`).catch(() => {}));
        
        // Real-Time Reverb WebSocket Listener
        const cleanQuoteId = String(activeRawId).replace(/[^0-9]/g, "");
        let quoteChannel: any = null;
        let userChannel: any = null;

        const handleRealtimeMessageUpdate = () => {
            fetchMessages();
        };

        window.addEventListener("carrierdirect_notif_update", handleRealtimeMessageUpdate);
        window.addEventListener("carrierdirect_quote_updated", handleRealtimeMessageUpdate);
        window.addEventListener("carrierdirect_negotiation_refresh", handleRealtimeMessageUpdate);

        if (cleanQuoteId) {
            try {
                quoteChannel = echo.private(`chat.quote.${cleanQuoteId}`);
                quoteChannel.listen(".message.sent", handleRealtimeMessageUpdate);
                quoteChannel.listen(".quote.updated", handleRealtimeMessageUpdate);
                quoteChannel.listen("quote.updated", handleRealtimeMessageUpdate);
            } catch (err) {
                console.warn("Echo quote channel error:", err);
            }
        }

        try {
            const rawUser = localStorage.getItem("carrierdirect_user_data") || localStorage.getItem("user");
            const user = rawUser ? JSON.parse(rawUser) : null;
            if (user?.id) {
                userChannel = echo.private(`App.Models.User.${user.id}`);
                userChannel.listen(".quote.updated", handleRealtimeMessageUpdate);
                userChannel.listen("quote.updated", handleRealtimeMessageUpdate);
                userChannel.notification(handleRealtimeMessageUpdate);
            }
        } catch (err) {
            console.warn("Echo user channel error in useChatPoller:", err);
        }

        // Relaxed fallback polling (20s) instead of aggressive 3s
        const messageTimer = setInterval(fetchMessages, 20000);
        const typingTimer = setInterval(pollTypingStatus, 3000);

        return () => {
            clearInterval(messageTimer);
            clearInterval(typingTimer);
            window.removeEventListener("carrierdirect_notif_update", handleRealtimeMessageUpdate);
            window.removeEventListener("carrierdirect_quote_updated", handleRealtimeMessageUpdate);
            window.removeEventListener("carrierdirect_negotiation_refresh", handleRealtimeMessageUpdate);
            if (quoteChannel) {
                quoteChannel.stopListening(".message.sent");
                quoteChannel.stopListening(".quote.updated");
                quoteChannel.stopListening("quote.updated");
            }
            if (userChannel) {
                userChannel.stopListening(".quote.updated");
                userChannel.stopListening("quote.updated");
            }
            if (typingAutoClearTimerRef.current) clearTimeout(typingAutoClearTimerRef.current);
            if (typingInactivityTimerRef.current) clearTimeout(typingInactivityTimerRef.current);
        };
    }, [activeRawId, activeNegotiation?.id, activeNegotiation?.status]);

    return { isMessagesLoading };
}
