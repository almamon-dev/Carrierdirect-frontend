import { useState, useRef, useEffect } from 'react';
import { echo } from '@/lib/echo';
import { CustomerChatItem, CustomerChatMessage } from '../types';
import { generateCustomerInitialMessages } from '../utils/customerChatUtils';
import { mapRawCustomerChatMessages } from '../utils/customerChatMessageMapper';
import { useCustomerOfferActions } from './useCustomerOfferActions';
import { useCustomerChatTyping } from './useCustomerChatTyping';
import {
    fetchCustomerMessagesApi,
    markCustomerNegotiationSeenApi,
    sendCustomerMessageApi,
    editCustomerMessageApi,
    pinCustomerMessageApi,
    deleteCustomerMessageApi
} from './customerChatMessageApi';

export function useCustomerChatMessages(activeChat: CustomerChatItem | null, _allNegotiations: any[]) {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [inputValue, setInputValue] = useState('');
    const [editingMsgId, setEditingMsgId] = useState<number | string | null>(null);
    const [, setEditingText] = useState('');

    const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    const activeChatId = activeChat?.id || '';

    const [isMessagesLoading, setIsMessagesLoading] = useState<boolean>(true);
    const hasLoadedFromApiRef = useRef<Set<string | number>>(new Set());
    const [chatMessages, setChatMessages] = useState<Record<string | number, CustomerChatMessage[]>>({});

    const {
        isSupplierTyping,
        setIsSupplierTyping,
        notifyTyping,
        pollTypingStatus,
        typingAutoClearTimerRef
    } = useCustomerChatTyping(activeChatId);

    const updateMessagesForActiveChat = (updater: (prev: CustomerChatMessage[]) => CustomerChatMessage[]) => {
        if (!activeChatId) return;
        setChatMessages(prev => {
            const current = prev[activeChatId] || generateCustomerInitialMessages(activeChat);
            return { ...prev, [activeChatId]: updater(current) };
        });
    };

    useEffect(() => {
        if (!activeChatId || !activeChat) return;

        const alreadyLoaded = hasLoadedFromApiRef.current.has(activeChatId) || hasLoadedFromApiRef.current.has(String(activeChatId));
        if (!alreadyLoaded) setIsMessagesLoading(true);

        const fetchMessages = async () => {
            try {
                const res = await fetchCustomerMessagesApi(activeChatId);
                const rawData = res?.data?.data || res?.data || res;
                const rawMsgs = rawData?.all_messages || rawData?.messages || res?.data?.all_messages || res?.all_messages || (Array.isArray(rawData) ? rawData : []);
                const quoteObj = rawData?.quote || rawData?.original_quote || res?.data?.quote || activeChat?.raw;
                const hasAcceptedMsg = Array.isArray(rawMsgs) && rawMsgs.some((m: any) => m.status === 'accepted' || (typeof m.message === 'string' && m.message.includes('accepted')));
                const isQuoteAccepted = quoteObj?.status === 'accepted' || quoteObj?.status === 'Accepted' || quoteObj?.status === 'confirmed' || quoteObj?.status === 'completed' || activeChat?.raw?.status === 'accepted' || hasAcceptedMsg;
                const isQuoteRejected = quoteObj?.status === 'rejected' || quoteObj?.status === 'declined' || activeChat?.raw?.status === 'rejected';
                const quoteDeclineReason = quoteObj?.decline_reason || quoteObj?.declineReason || activeChat?.raw?.decline_reason;

                if (rawData?.supplier && activeChat) {
                    if (rawData.supplier.is_online !== undefined) activeChat.isOnline = Boolean(rawData.supplier.is_online);
                    if (rawData.supplier.last_seen_human) activeChat.lastSeenHuman = rawData.supplier.last_seen_human;
                }

                if (quoteObj && activeChat && Array.isArray(quoteObj.extra_charges) && quoteObj.extra_charges.length > 0) {
                    const freshCharges = quoteObj.extra_charges.map((c: any) => ({
                        id: c.id,
                        type: c.type || c.custom_name || c.customName || "Custom",
                        custom_name: c.custom_name || c.customName || c.type || "Custom",
                        label: c.type === "Custom" ? (c.custom_name || "Custom") : (c.custom_name || c.type),
                        amount: Number(c.amount || 0)
                    })).filter((c: any) => c.amount > 0);
                    activeChat.extraCharges = freshCharges;
                    activeChat.totalExtras = freshCharges.reduce((sum: number, c: any) => sum + Number(c.amount || 0), 0);
                }

                if (rawData?.is_supplier_typing !== undefined || rawData?.is_typing !== undefined) {
                    const isTypingNow = Boolean(rawData?.is_supplier_typing ?? rawData?.is_typing);
                    setIsSupplierTyping(isTypingNow);
                    if (isTypingNow) {
                        if (typingAutoClearTimerRef.current) clearTimeout(typingAutoClearTimerRef.current);
                        typingAutoClearTimerRef.current = setTimeout(() => setIsSupplierTyping(false), 3500);
                    }
                }

                if (Array.isArray(rawMsgs) && rawMsgs.length > 0) {
                    const finalMessages = mapRawCustomerChatMessages(rawMsgs, activeChat, isQuoteAccepted, isQuoteRejected, quoteDeclineReason);
                    setChatMessages(prev => {
                        const existing = prev[activeChatId] || [];
                        if (existing.length === finalMessages.length && existing[existing.length - 1]?.id === finalMessages[finalMessages.length - 1]?.id) {
                            return prev; // Do not trigger state update if messages are unchanged
                        }
                        return { ...prev, [activeChatId]: finalMessages, [String(activeChatId)]: finalMessages };
                    });
                } else if (activeChat) {
                    const finalMessages = generateCustomerInitialMessages(activeChat);
                    setChatMessages(prev => ({ ...prev, [activeChatId]: finalMessages, [String(activeChatId)]: finalMessages }));
                }
                hasLoadedFromApiRef.current.add(activeChatId);
                hasLoadedFromApiRef.current.add(String(activeChatId));
            } catch {
                if (activeChat) {
                    const finalMessages = generateCustomerInitialMessages(activeChat);
                    setChatMessages(prev => ({ ...prev, [activeChatId]: finalMessages, [String(activeChatId)]: finalMessages }));
                }
            } finally {
                setIsMessagesLoading(false);
            }
        };

        fetchMessages();
        markCustomerNegotiationSeenApi(activeChatId);

        // Real-Time Reverb WebSocket Listener
        const cleanQuoteId = String(activeChatId).replace(/[^0-9]/g, '');
        let quoteChannel: any = null;
        if (cleanQuoteId) {
            try {
                quoteChannel = echo.private(`chat.quote.${cleanQuoteId}`);
                quoteChannel.listen('.message.sent', () => {
                    fetchMessages();
                    setTimeout(scrollToBottom, 100);
                });
            } catch (err) {
                console.warn('Echo quote channel error:', err);
            }
        }

        // Relaxed fallback polling (20s) instead of aggressive 3s
        const messageTimer = setInterval(fetchMessages, 20000);
        const typingTimer = setInterval(pollTypingStatus, 3000);

        return () => {
            clearInterval(messageTimer);
            clearInterval(typingTimer);
            if (quoteChannel) {
                quoteChannel.stopListening('.message.sent');
            }
        };
    }, [activeChatId, activeChat?.raw?.status, pollTypingStatus, setIsSupplierTyping, typingAutoClearTimerRef]);

    const { handleSendCounterOffer: baseSendCounterOffer, handleAcceptOffer, handleRejectOffer } = useCustomerOfferActions({
        activeChatId,
        activeChat,
        updateMessagesForActiveChat,
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
            updateMessagesForActiveChat(prev => prev.map(m => m.id === targetEditId ? { ...m, text, isEdited: true } : m));
            setEditingMsgId(null); setEditingText(''); setInputValue('');

            if (typeof targetEditId === 'number' || (typeof targetEditId === 'string' && /^\d+$/.test(targetEditId))) {
                await editCustomerMessageApi(activeChatId, targetEditId, text);
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

        await sendCustomerMessageApi(activeChatId, text, files);
    };

    const handleTogglePinMessage = async (msgId: number | string) => {
        updateMessagesForActiveChat(prev => prev.map(m => m.id === msgId ? { ...m, isPinned: !m.isPinned } : m));
        if (typeof msgId === 'number' || (typeof msgId === 'string' && /^\d+$/.test(msgId))) {
            await pinCustomerMessageApi(activeChatId, msgId);
        }
    };

    const handleDeleteMessage = async (msgId: number | string) => {
        updateMessagesForActiveChat(prev => prev.map(m => m.id === msgId ? { ...m, isDeleted: true, isPinned: false } : m));
        if (typeof msgId === 'number' || (typeof msgId === 'string' && /^\d+$/.test(msgId))) {
            await deleteCustomerMessageApi(activeChatId, msgId);
        }
    };

    const currentMessages = activeChatId ? (chatMessages[activeChatId] || generateCustomerInitialMessages(activeChat)) : [];

    return {
        messagesEndRef, inputValue, setInputValue, editingMsgId, isSupplierTyping, notifyTyping, currentMessages,
        chatMessages, isMessagesLoading, scrollToBottom, handleSendMessage, handleSendCounterOffer, handleAcceptOffer, handleRejectOffer,
        handleTogglePinMessage, handleDeleteMessage,
        handleStartEdit: (msg: CustomerChatMessage) => { setEditingMsgId(msg.id); setEditingText(msg.text || ''); setInputValue(msg.text || ''); },
        handleCancelEdit: () => { setEditingMsgId(null); setEditingText(''); setInputValue(''); }
    };
}
