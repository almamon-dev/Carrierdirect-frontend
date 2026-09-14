import { useState, useRef, useEffect, useCallback } from 'react';
import apiClient from '@/lib/axios';
import { CustomerChatItem, CustomerChatMessage } from '../types';
import { generateCustomerInitialMessages } from '../utils/customerChatUtils';
import { mapRawCustomerChatMessages } from '../utils/customerChatMessageMapper';
import { useCustomerOfferActions } from './useCustomerOfferActions';

export function useCustomerChatMessages(activeChat: CustomerChatItem | null, allNegotiations: any[]) {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [inputValue, setInputValue] = useState('');
    const [editingMsgId, setEditingMsgId] = useState<number | string | null>(null);
    const [editingText, setEditingText] = useState('');
    const [isSupplierTyping, setIsSupplierTyping] = useState(false);

    const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    const activeChatId = activeChat?.id || '';

    const [chatMessages, setChatMessages] = useState<Record<string | number, CustomerChatMessage[]>>(() => {
        const initialMap: Record<string | number, CustomerChatMessage[]> = {};
        allNegotiations.forEach(n => {
            initialMap[n.rawId] = generateCustomerInitialMessages(n);
        });
        return initialMap;
    });

    const updateMessagesForActiveChat = (updater: (prev: CustomerChatMessage[]) => CustomerChatMessage[]) => {
        if (!activeChatId) return;
        setChatMessages(prev => {
            const current = prev[activeChatId] || generateCustomerInitialMessages(activeChat);
            return { ...prev, [activeChatId]: updater(current) };
        });
    };

    // Typing debounce and receiver timeout refs
    const typingInactivityTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const lastTypingSentRef = useRef<number>(0);
    const typingAutoClearTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const notifyTyping = useCallback((isTyping = true) => {
        if (!activeChatId) return;

        if (!isTyping) {
            if (typingInactivityTimerRef.current) {
                clearTimeout(typingInactivityTimerRef.current);
                typingInactivityTimerRef.current = null;
            }
            lastTypingSentRef.current = 0;
            apiClient.post(`/customer/negotiations/${activeChatId}/typing`, { is_typing: false }).catch(() =>
                apiClient.post(`/negotiations/${activeChatId}/typing`, { is_typing: false }).catch(() => {})
            );
            return;
        }

        const now = Date.now();
        if (now - lastTypingSentRef.current >= 1500) {
            lastTypingSentRef.current = now;
            apiClient.post(`/customer/negotiations/${activeChatId}/typing`, { is_typing: true }).catch(() =>
                apiClient.post(`/negotiations/${activeChatId}/typing`, { is_typing: true }).catch(() => {})
            );
        }

        if (typingInactivityTimerRef.current) clearTimeout(typingInactivityTimerRef.current);
        typingInactivityTimerRef.current = setTimeout(() => {
            lastTypingSentRef.current = 0;
            apiClient.post(`/customer/negotiations/${activeChatId}/typing`, { is_typing: false }).catch(() =>
                apiClient.post(`/negotiations/${activeChatId}/typing`, { is_typing: false }).catch(() => {})
            );
        }, 2500);
    }, [activeChatId]);

    useEffect(() => {
        if (!activeChatId || !activeChat) return;

        // Reset typing state on chat change
        setIsSupplierTyping(false);
        if (typingAutoClearTimerRef.current) clearTimeout(typingAutoClearTimerRef.current);

        setChatMessages(prev => {
            if (!prev[activeChatId] || prev[activeChatId].length === 0) {
                return { ...prev, [activeChatId]: generateCustomerInitialMessages(activeChat) };
            }
            return prev;
        });

        const fetchMessagesFromApi = async () => {
            try {
                let res;
                try {
                    res = await apiClient.get(`/customer/negotiations/${activeChatId}/messages`);
                } catch {
                    res = await apiClient.get(`/negotiations/${activeChatId}/messages`);
                }

                const rawData = res?.data?.data || res?.data || res;
                const rawMsgs = rawData?.all_messages || rawData?.messages || res?.data?.all_messages || res?.all_messages || (Array.isArray(rawData) ? rawData : []);
                const quoteObj = rawData?.quote || rawData?.original_quote || res?.data?.quote || activeChat?.raw;
                const hasAcceptedMsg = Array.isArray(rawMsgs) && rawMsgs.some((m: any) => m.status === 'accepted' || (typeof m.message === 'string' && m.message.includes('accepted')));
                const isQuoteAccepted = quoteObj?.status === 'accepted' || quoteObj?.status === 'Accepted' || quoteObj?.status === 'confirmed' || quoteObj?.status === 'completed' || activeChat?.raw?.status === 'accepted' || hasAcceptedMsg;
                const isQuoteRejected = quoteObj?.status === 'rejected' || quoteObj?.status === 'declined' || activeChat?.raw?.status === 'rejected';
                const quoteDeclineReason = quoteObj?.decline_reason || quoteObj?.declineReason || activeChat?.raw?.decline_reason;

                const supplierObj = rawData?.supplier;
                if (supplierObj && activeChat) {
                    if (supplierObj.is_online !== undefined) {
                        activeChat.isOnline = Boolean(supplierObj.is_online);
                    }
                    if (supplierObj.last_seen_human) {
                        activeChat.lastSeenHuman = supplierObj.last_seen_human;
                    }
                }
                if (rawData?.is_supplier_typing !== undefined || rawData?.is_typing !== undefined) {
                    const isTypingNow = Boolean(rawData?.is_supplier_typing ?? rawData?.is_typing);
                    setIsSupplierTyping(isTypingNow);
                    if (isTypingNow) {
                        if (typingAutoClearTimerRef.current) clearTimeout(typingAutoClearTimerRef.current);
                        typingAutoClearTimerRef.current = setTimeout(() => {
                            setIsSupplierTyping(false);
                        }, 3500);
                    }
                }

                if (Array.isArray(rawMsgs) && rawMsgs.length > 0) {
                    const finalMessages = mapRawCustomerChatMessages(rawMsgs, activeChat, isQuoteAccepted, isQuoteRejected, quoteDeclineReason);
                    setChatMessages(prev => ({ ...prev, [activeChatId]: finalMessages, [String(activeChatId)]: finalMessages }));
                }
            } catch {}
        };

        const pollTypingStatus = async () => {
            try {
                const res = await apiClient.get(`/customer/negotiations/${activeChatId}/typing`).catch(() =>
                    apiClient.get(`/negotiations/${activeChatId}/typing`)
                );
                const raw = res?.data?.data || res?.data || res;
                if (raw?.is_supplier_typing !== undefined || raw?.is_typing !== undefined) {
                    const isTypingNow = Boolean(raw?.is_supplier_typing ?? raw?.is_typing);
                    setIsSupplierTyping(isTypingNow);
                    if (isTypingNow) {
                        if (typingAutoClearTimerRef.current) clearTimeout(typingAutoClearTimerRef.current);
                        typingAutoClearTimerRef.current = setTimeout(() => {
                            setIsSupplierTyping(false);
                        }, 3500);
                    }
                }
            } catch {}
        };

        fetchMessagesFromApi();
        apiClient.post(`/customer/negotiations/${activeChatId}/seen`).catch(() => apiClient.post(`/negotiations/${activeChatId}/seen`).catch(() => {}));
        
        const messageTimer = setInterval(fetchMessagesFromApi, 3000);
        const typingTimer = setInterval(pollTypingStatus, 1500);

        return () => {
            clearInterval(messageTimer);
            clearInterval(typingTimer);
            if (typingAutoClearTimerRef.current) clearTimeout(typingAutoClearTimerRef.current);
            if (typingInactivityTimerRef.current) clearTimeout(typingInactivityTimerRef.current);
        };
    }, [activeChatId, activeChat?.raw?.status]);

    const { handleSendCounterOffer: baseSendCounterOffer, handleAcceptOffer, handleRejectOffer } = useCustomerOfferActions({
        activeChatId,
        activeChat,
        updateMessagesForActiveChat,
        scrollToBottom,
    });

    const handleSendCounterOffer = async (amount: number, note: string) => {
        notifyTyping(false);
        return baseSendCounterOffer(amount, note);
    };

    const handleSendMessage = async (text: string, files?: File[]) => {
        const hasText = Boolean(text && text.trim());
        const hasFiles = Boolean(files && files.length > 0);
        if (!hasText && !hasFiles) return;

        notifyTyping(false);

        if (editingMsgId) {
            const targetEditId = editingMsgId;
            updateMessagesForActiveChat(prev => prev.map(m => m.id === targetEditId ? { ...m, text, isEdited: true } : m));
            setEditingMsgId(null); setEditingText(''); setInputValue('');

            if (typeof targetEditId === 'number' || (typeof targetEditId === 'string' && /^\d+$/.test(targetEditId))) {
                try {
                    await apiClient.patch(`/negotiations/${activeChatId}/messages/${targetEditId}`, { message: text }).catch(() =>
                        apiClient.put(`/negotiations/${activeChatId}/messages/${targetEditId}`, { message: text }).catch(() => {})
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

        const newMsg: CustomerChatMessage = {
            id: `msg-${Date.now()}`,
            type: 'sent', text: text || '', attachments: localAttachments,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            seen: false, isRead: false, deliveryStatus: 'sent'
        };
        updateMessagesForActiveChat(prev => [...prev, newMsg]);
        setInputValue('');
        setTimeout(scrollToBottom, 100);

        try {
            const formData = new FormData();
            formData.append('quote_id', String(activeChatId));
            formData.append('negotiation_id', String(activeChatId));
            formData.append('message', text || '');
            formData.append('text', text || '');
            if (hasFiles) files!.forEach(f => formData.append('attachments[]', f));
            await apiClient.post(`/customer/negotiations/${activeChatId}/messages`, formData).catch(() => apiClient.post(`/negotiations/${activeChatId}/messages`, formData));
        } catch {}
    };

    const handleTogglePinMessage = async (msgId: number | string) => {
        updateMessagesForActiveChat(prev =>
            prev.map(m => m.id === msgId ? { ...m, isPinned: !m.isPinned } : m)
        );

        if (typeof msgId === 'number' || (typeof msgId === 'string' && /^\d+$/.test(msgId))) {
            try {
                await apiClient.post(`/customer/negotiations/${activeChatId}/messages/${msgId}/pin`).catch(() =>
                    apiClient.post(`/negotiations/${activeChatId}/messages/${msgId}/pin`).catch(() =>
                        apiClient.post(`/negotiations/messages/${msgId}/pin`).catch(() => {})
                    )
                );
            } catch {}
        }
    };

    const handleDeleteMessage = async (msgId: number | string) => {
        updateMessagesForActiveChat(prev =>
            prev.map(m => m.id === msgId ? { ...m, isDeleted: true, isPinned: false } : m)
        );

        if (typeof msgId === 'number' || (typeof msgId === 'string' && /^\d+$/.test(msgId))) {
            try {
                await apiClient.delete(`/negotiations/${activeChatId}/messages/${msgId}`).catch(() =>
                    apiClient.post(`/negotiations/${activeChatId}/messages/${msgId}/delete`).catch(() => {})
                );
            } catch {}
        }
    };

    const currentMessages = activeChatId ? (chatMessages[activeChatId] || generateCustomerInitialMessages(activeChat)) : [];

    return {
        messagesEndRef, inputValue, setInputValue, editingMsgId, isSupplierTyping, notifyTyping, currentMessages,
        scrollToBottom, handleSendMessage, handleSendCounterOffer, handleAcceptOffer, handleRejectOffer,
        handleTogglePinMessage,
        handleDeleteMessage,
        handleStartEdit: (msg: CustomerChatMessage) => { setEditingMsgId(msg.id); setEditingText(msg.text || ''); setInputValue(msg.text || ''); },
        handleCancelEdit: () => { setEditingMsgId(null); setEditingText(''); setInputValue(''); }
    };
}
