import { useState, useEffect, useRef } from 'react';
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

    useEffect(() => {
        if (!activeChatId || !activeChat) return;

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

                if (rawData?.is_supplier_typing !== undefined || rawData?.is_typing !== undefined) {
                    setIsSupplierTyping(Boolean(rawData?.is_supplier_typing ?? rawData?.is_typing));
                }

                if (Array.isArray(rawMsgs) && rawMsgs.length > 0) {
                    const finalMessages = mapRawCustomerChatMessages(rawMsgs, activeChat, isQuoteAccepted, isQuoteRejected, quoteDeclineReason);
                    setChatMessages(prev => ({ ...prev, [activeChatId]: finalMessages, [String(activeChatId)]: finalMessages }));
                }
            } catch {}
        };

        fetchMessagesFromApi();
        apiClient.post(`/customer/negotiations/${activeChatId}/seen`).catch(() => apiClient.post(`/negotiations/${activeChatId}/seen`).catch(() => {}));
        const timer = setInterval(fetchMessagesFromApi, 6000);
        return () => clearInterval(timer);
    }, [activeChatId, activeChat?.raw?.status]);

    const { handleSendCounterOffer, handleAcceptOffer, handleRejectOffer } = useCustomerOfferActions({
        activeChatId,
        activeChat,
        updateMessagesForActiveChat,
        scrollToBottom,
    });

    const handleSendMessage = async (text: string, files?: File[]) => {
        const hasText = Boolean(text && text.trim());
        const hasFiles = Boolean(files && files.length > 0);
        if (!hasText && !hasFiles) return;

        if (editingMsgId) {
            updateMessagesForActiveChat(prev => prev.map(m => m.id === editingMsgId ? { ...m, text, isEdited: true } : m));
            setEditingMsgId(null); setEditingText(''); setInputValue(''); return;
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

    const lastTypingSentRef = useRef<number>(0);
    const notifyTyping = () => {
        const now = Date.now();
        if (now - lastTypingSentRef.current < 2500) return;
        lastTypingSentRef.current = now;
        apiClient.post(`/customer/negotiations/${activeChatId}/typing`).catch(() => apiClient.post(`/negotiations/${activeChatId}/typing`).catch(() => {}));
    };

    const currentMessages = activeChatId ? (chatMessages[activeChatId] || generateCustomerInitialMessages(activeChat)) : [];

    return {
        messagesEndRef, inputValue, setInputValue, editingMsgId, isSupplierTyping, notifyTyping, currentMessages,
        scrollToBottom, handleSendMessage, handleSendCounterOffer, handleAcceptOffer, handleRejectOffer,
        handleTogglePinMessage: (msgId: number | string) => updateMessagesForActiveChat(prev => prev.map(m => m.id === msgId ? { ...m, isPinned: !m.isPinned } : m)),
        handleDeleteMessage: (msgId: number | string) => updateMessagesForActiveChat(prev => prev.map(m => m.id === msgId ? { ...m, isDeleted: true, isPinned: false } : m)),
        handleStartEdit: (msg: CustomerChatMessage) => { setEditingMsgId(msg.id); setEditingText(msg.text || ''); setInputValue(msg.text || ''); },
        handleCancelEdit: () => { setEditingMsgId(null); setEditingText(''); setInputValue(''); }
    };
}
