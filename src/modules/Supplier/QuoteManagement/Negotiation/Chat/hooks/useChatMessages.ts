import { useState, useRef, useEffect } from 'react';
import { apiClient } from '@/lib/axios';
import { NegotiationItem } from '../../types';
import { ChatMessage } from '../types';
import { generateInitialMessages } from '../utils/initialMessages';
import { mapRawChatMessages } from '../utils/chatMessageMapper';
import { useChatOfferActions } from './useChatOfferActions';

export function useChatMessages(activeNegotiation: NegotiationItem | null, allNegotiations: NegotiationItem[]) {
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

    useEffect(() => {
        if (!activeRawId || !activeNegotiation) return;
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
                const hasAcceptedMsg = Array.isArray(rawMsgs) && rawMsgs.some((m: any) => m.status === 'accepted' || (typeof m.message === 'string' && m.message.includes('accepted')));
                const isQuoteAccepted = quoteObj?.status === 'accepted' || quoteObj?.status === 'Accepted' || quoteObj?.status === 'confirmed' || quoteObj?.status === 'completed' || (activeNegotiation as any)?.status === 'Accepted' || hasAcceptedMsg;
                const isQuoteRejected = quoteObj?.status === 'rejected' || quoteObj?.status === 'declined' || (activeNegotiation as any)?.status === 'Offer Declined' || (activeNegotiation as any)?.status === 'rejected';
                const quoteDeclineReason = quoteObj?.decline_reason || quoteObj?.declineReason;

                if (rawData?.is_customer_typing !== undefined || rawData?.is_typing !== undefined) {
                    setIsCustomerTyping(Boolean(rawData?.is_customer_typing ?? rawData?.is_typing));
                }

                if (Array.isArray(rawMsgs) && rawMsgs.length > 0) {
                    const finalMessages = mapRawChatMessages(rawMsgs, activeNegotiation, isQuoteAccepted, isQuoteRejected, quoteDeclineReason);
                    setChatMessages(prev => ({ ...prev, [activeRawId]: finalMessages, [String(activeRawId)]: finalMessages }));
                }
            } catch {}
        };
        fetchMessages();
        apiClient.post(`/supplier/negotiations/${activeRawId}/seen`).catch(() => apiClient.post(`/negotiations/${activeRawId}/seen`).catch(() => {}));
        const timer = setInterval(fetchMessages, 4000);
        return () => clearInterval(timer);
    }, [activeRawId, activeNegotiation]);

    const { handleSendCounterOffer, handleAcceptOffer, handleRejectOffer } = useChatOfferActions({
        activeRawId,
        activeNegotiation,
        currentPrice,
        updateMessagesForChat,
        scrollToBottom,
    });

    const handleSendMessage = async (text: string, files?: File[]) => {
        const hasText = Boolean(text && text.trim());
        const hasFiles = Boolean(files && files.length > 0);
        if (!hasText && !hasFiles) return;

        if (editingMsgId) {
            updateMessagesForChat(activeRawId, prev => prev.map(m => m.id === editingMsgId ? { ...m, text, isEdited: true } : m));
            setEditingMsgId(null); setEditingText(''); setInputValue(''); return;
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

    const lastTypingSentRef = useRef<number>(0);
    const notifyTyping = () => {
        const now = Date.now();
        if (now - lastTypingSentRef.current < 2500) return;
        lastTypingSentRef.current = now;
        apiClient.post(`/supplier/negotiations/${activeRawId}/typing`).catch(() => apiClient.post(`/negotiations/${activeRawId}/typing`).catch(() => {}));
    };

    return {
        messagesEndRef, inputValue, setInputValue, editingMsgId, setEditingMsgId, editingText, setEditingText,
        highlightedMsgId, setHighlightedMsgId, activePinnedIndex, setActivePinnedIndex, isCustomerTyping, notifyTyping,
        negotiationStatusMap, liveOffers, chatMessages, setChatMessages, currentPrice, scrollToBottom,
        handleTogglePinMessage: (msgId: number | string) => updateMessagesForChat(activeRawId, prev => prev.map(m => m.id === msgId ? { ...m, isPinned: !m.isPinned } : m)),
        handleDeleteMessage: (msgId: number | string) => updateMessagesForChat(activeRawId, prev => prev.map(m => m.id === msgId ? { ...m, isDeleted: true, isPinned: false } : m)),
        handleSendMessage, handleSendCounterOffer, handleAcceptOffer, handleRejectOffer,
        handleStartEdit: (msg: ChatMessage) => { setEditingMsgId(msg.id); setEditingText(msg.text || ''); setInputValue(msg.text || ''); },
        handleCancelEdit: () => { setEditingMsgId(null); setEditingText(''); setInputValue(''); }
    };
}
