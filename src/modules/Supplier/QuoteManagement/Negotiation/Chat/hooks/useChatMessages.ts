import { useState, useRef, useEffect, useCallback } from 'react';
import apiClient from '@/lib/axios';
import { NegotiationItem } from '../../types';
import { ChatMessage } from '../types';
import { generateInitialMessages } from '../utils/initialMessages';
import { mapRawChatMessages } from '../utils/chatMessageMapper';
import { useChatOfferActions } from './useChatOfferActions';

export function useChatMessages(activeNegotiation: NegotiationItem, allNegotiations: NegotiationItem[]) {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [inputValue, setInputValue] = useState('');
    const [editingMsgId, setEditingMsgId] = useState<number | string | null>(null);
    const [editingText, setEditingText] = useState('');
    const [highlightedMsgId, setHighlightedMsgId] = useState<number | string | null>(null);
    const [activePinnedIndex, setActivePinnedIndex] = useState(0);
    const [isCustomerTyping, setIsCustomerTyping] = useState(false);
    const [negotiationStatusMap] = useState<Record<string | number, string>>({});
    const [liveOffers] = useState<Record<string | number, number>>({});

    const activeRawId = activeNegotiation?.rawId || '';
    const currentPrice = Number(activeNegotiation?.currentOffer || activeNegotiation?.originalAmount || 0);

    const [chatMessages, setChatMessages] = useState<Record<string | number, ChatMessage[]>>(() => {
        const initialMap: Record<string | number, ChatMessage[]> = {};
        allNegotiations.forEach(item => {
            initialMap[item.rawId] = generateInitialMessages(item);
        });
        return initialMap;
    });

    const updateMessagesForChat = (chatId: number | string, updater: (prev: ChatMessage[]) => ChatMessage[]) => {
        setChatMessages(prev => {
            const current = prev[chatId] || generateInitialMessages(activeNegotiation);
            return { ...prev, [chatId]: updater(current) };
        });
    };

    const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

    // Typing debounce and receiver timeout refs
    const typingInactivityTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const lastTypingSentRef = useRef<number>(0);
    const typingAutoClearTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const notifyTyping = useCallback((isTyping = true) => {
        if (!activeRawId) return;

        if (!isTyping) {
            if (typingInactivityTimerRef.current) {
                clearTimeout(typingInactivityTimerRef.current);
                typingInactivityTimerRef.current = null;
            }
            lastTypingSentRef.current = 0;
            apiClient.post(`/supplier/negotiations/${activeRawId}/typing`, { is_typing: false }).catch(() =>
                apiClient.post(`/negotiations/${activeRawId}/typing`, { is_typing: false }).catch(() => {})
            );
            return;
        }

        const now = Date.now();
        if (now - lastTypingSentRef.current >= 1500) {
            lastTypingSentRef.current = now;
            apiClient.post(`/supplier/negotiations/${activeRawId}/typing`, { is_typing: true }).catch(() =>
                apiClient.post(`/negotiations/${activeRawId}/typing`, { is_typing: true }).catch(() => {})
            );
        }

        if (typingInactivityTimerRef.current) clearTimeout(typingInactivityTimerRef.current);
        typingInactivityTimerRef.current = setTimeout(() => {
            lastTypingSentRef.current = 0;
            apiClient.post(`/supplier/negotiations/${activeRawId}/typing`, { is_typing: false }).catch(() =>
                apiClient.post(`/negotiations/${activeRawId}/typing`, { is_typing: false }).catch(() => {})
            );
        }, 2500);
    }, [activeRawId]);

    useEffect(() => {
        if (!activeRawId || !activeNegotiation) return;

        // Reset typing indicator when switching chats
        setIsCustomerTyping(false);
        if (typingAutoClearTimerRef.current) clearTimeout(typingAutoClearTimerRef.current);

        setChatMessages(prev => {
            if (!prev[activeRawId] || prev[activeRawId].length === 0) {
                return { ...prev, [activeRawId]: generateInitialMessages(activeNegotiation) };
            }
            return prev;
        });

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
                    if (customerObj.is_online !== undefined) {
                        activeNegotiation.isOnline = Boolean(customerObj.is_online);
                    }
                    if (customerObj.last_seen_human) {
                        activeNegotiation.lastSeenHuman = customerObj.last_seen_human;
                    }
                }

                if (quoteObj && activeNegotiation) {
                    if (Array.isArray(quoteObj.extra_charges) && quoteObj.extra_charges.length > 0) {
                        const freshCharges = quoteObj.extra_charges.map((c: any) => ({
                            id: c.id,
                            type: c.type || c.custom_name || c.customName || "Custom",
                            customName: c.custom_name || c.customName || c.label || c.type,
                            label: c.type === "Custom" ? (c.custom_name || c.customName || "Custom") : (c.custom_name || c.customName || c.type),
                            amount: Number(c.amount || 0)
                        })).filter((c: any) => c.amount > 0);
                        activeNegotiation.extraCharges = freshCharges;
                        activeNegotiation.totalExtras = freshCharges.reduce((sum: number, c: any) => sum + Number(c.amount || 0), 0);
                    }
                    if (quoteObj.base_amount_raw || quoteObj.base_amount) {
                        activeNegotiation.baseFreight = Number(quoteObj.base_amount_raw ?? parseFloat(String(quoteObj.base_amount).replace(/[^0-9.]/g, "")) ?? activeNegotiation.baseFreight);
                    }
                }
                if (rawData?.is_customer_typing !== undefined || rawData?.is_typing !== undefined) {
                    const isTypingNow = Boolean(rawData?.is_customer_typing ?? rawData?.is_typing);
                    setIsCustomerTyping(isTypingNow);
                    if (isTypingNow) {
                        if (typingAutoClearTimerRef.current) clearTimeout(typingAutoClearTimerRef.current);
                        typingAutoClearTimerRef.current = setTimeout(() => {
                            setIsCustomerTyping(false);
                        }, 3500);
                    }
                }

                if (Array.isArray(rawMsgs) && rawMsgs.length > 0) {
                    const finalMessages = mapRawChatMessages(rawMsgs, activeNegotiation, isQuoteAccepted, isQuoteRejected, quoteDeclineReason);
                    setChatMessages(prev => ({ ...prev, [activeRawId]: finalMessages, [String(activeRawId)]: finalMessages }));
                } else if (activeNegotiation) {
                    const finalMessages = generateInitialMessages(activeNegotiation);
                    setChatMessages(prev => ({ ...prev, [activeRawId]: finalMessages, [String(activeRawId)]: finalMessages }));
                }
            } catch {}
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
                        typingAutoClearTimerRef.current = setTimeout(() => {
                            setIsCustomerTyping(false);
                        }, 3500);
                    }
                }
            } catch {}
        };

        fetchMessages();
        apiClient.post(`/supplier/negotiations/${activeRawId}/seen`).catch(() => apiClient.post(`/negotiations/${activeRawId}/seen`).catch(() => {}));
        
        const messageTimer = setInterval(fetchMessages, 3000);
        const typingTimer = setInterval(pollTypingStatus, 1500);

        return () => {
            clearInterval(messageTimer);
            clearInterval(typingTimer);
            if (typingAutoClearTimerRef.current) clearTimeout(typingAutoClearTimerRef.current);
            if (typingInactivityTimerRef.current) clearTimeout(typingInactivityTimerRef.current);
        };
    }, [activeRawId, activeNegotiation?.id, activeNegotiation?.status]);

    const { handleSendCounterOffer: baseSendCounterOffer, handleAcceptOffer, handleRejectOffer } = useChatOfferActions({
        activeRawId,
        activeNegotiation,
        currentPrice,
        updateMessagesForChat,
        scrollToBottom,
    });

    const handleSendCounterOffer = async (amount: number, note: string, extraCharges?: any[], baseFreight?: number) => {
        notifyTyping(false);
        return baseSendCounterOffer(amount, note, extraCharges, baseFreight);
    };

    const handleSendMessage = async (text: string, files?: File[]) => {
        const hasText = Boolean(text && text.trim());
        const hasFiles = Boolean(files && files.length > 0);
        if (!hasText && !hasFiles) return;

        notifyTyping(false);

        if (editingMsgId) {
            const targetEditId = editingMsgId;
            updateMessagesForChat(activeRawId, prev => prev.map(m => m.id === targetEditId ? { ...m, text, isEdited: true } : m));
            setEditingMsgId(null); setEditingText(''); setInputValue('');

            if (typeof targetEditId === 'number' || (typeof targetEditId === 'string' && /^\d+$/.test(targetEditId))) {
                try {
                    await apiClient.patch(`/negotiations/${activeRawId}/messages/${targetEditId}`, { message: text }).catch(() =>
                        apiClient.put(`/negotiations/${activeRawId}/messages/${targetEditId}`, { message: text }).catch(() => {})
                    );
                } catch {}
            }
            return;
        }

        const localAttachments = hasFiles ? files!.map(f => ({
            name: f.name,
            size: f.size > 1048576 ? `${(f.size / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(f.size / 1024))} kB`,
            type: f.type.startsWith('image/') ? ('image' as const) : ('file' as const),
            url: URL.createObjectURL(f)
        })) : undefined;

        const newMsg: ChatMessage = {
            id: `msg-${Date.now()}`,
            type: 'sent',
            text: text || '',
            attachments: localAttachments,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            seen: false, isRead: false, deliveryStatus: 'sent'
        };
        updateMessagesForChat(activeRawId, prev => [...prev, newMsg]);
        setInputValue('');
        setTimeout(scrollToBottom, 100);

        try {
            const formData = new FormData();
            formData.append('quote_id', String(activeRawId));
            formData.append('negotiation_id', String(activeRawId));
            formData.append('message', text || '');
            formData.append('text', text || '');
            if (hasFiles) files!.forEach(f => formData.append('attachments[]', f));
            await apiClient.post(`/supplier/negotiations/${activeRawId}/messages`, formData).catch(() => apiClient.post(`/negotiations/${activeRawId}/messages`, formData));
        } catch {}
    };

    const handleTogglePinMessage = async (msgId: number | string) => {
        updateMessagesForChat(activeRawId, prev =>
            prev.map(m => m.id === msgId ? { ...m, isPinned: !m.isPinned } : m)
        );

        if (typeof msgId === 'number' || (typeof msgId === 'string' && /^\d+$/.test(msgId))) {
            try {
                await apiClient.post(`/supplier/negotiations/${activeRawId}/messages/${msgId}/pin`).catch(() =>
                    apiClient.post(`/negotiations/${activeRawId}/messages/${msgId}/pin`).catch(() =>
                        apiClient.post(`/negotiations/messages/${msgId}/pin`).catch(() => {})
                    )
                );
            } catch {}
        }
    };

    const handleDeleteMessage = async (msgId: number | string) => {
        updateMessagesForChat(activeRawId, prev =>
            prev.map(m => m.id === msgId ? { ...m, isDeleted: true, isPinned: false } : m)
        );

        if (typeof msgId === 'number' || (typeof msgId === 'string' && /^\d+$/.test(msgId))) {
            try {
                await apiClient.delete(`/negotiations/${activeRawId}/messages/${msgId}`).catch(() =>
                    apiClient.post(`/negotiations/${activeRawId}/messages/${msgId}/delete`).catch(() => {})
                );
            } catch {}
        }
    };

    return {
        messagesEndRef, inputValue, setInputValue, editingMsgId, setEditingMsgId, editingText, setEditingText,
        highlightedMsgId, setHighlightedMsgId, activePinnedIndex, setActivePinnedIndex, isCustomerTyping, notifyTyping,
        negotiationStatusMap, liveOffers, chatMessages, setChatMessages, currentPrice, scrollToBottom,
        handleTogglePinMessage,
        handleDeleteMessage,
        handleSendMessage, handleSendCounterOffer, handleAcceptOffer, handleRejectOffer,
        handleStartEdit: (msg: ChatMessage) => { setEditingMsgId(msg.id); setEditingText(msg.text || ''); setInputValue(msg.text || ''); },
        handleCancelEdit: () => { setEditingMsgId(null); setEditingText(''); setInputValue(''); }
    };
}
