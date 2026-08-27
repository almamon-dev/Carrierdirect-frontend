import { useState, useRef } from 'react';
import { apiClient } from '@/lib/axios';
import { NegotiationItem } from '../../types';
import { ChatMessage } from '../types';
import { generateInitialMessages, getRandomCustomerReply } from '../utils/initialMessages';

export function useChatMessages(activeNegotiation: NegotiationItem, allNegotiations: NegotiationItem[]) {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [inputValue, setInputValue] = useState('');
    const [editingMsgId, setEditingMsgId] = useState<number | string | null>(null);
    const [editingText, setEditingText] = useState('');
    const [highlightedMsgId, setHighlightedMsgId] = useState<number | string | null>(null);
    const [activePinnedIndex, setActivePinnedIndex] = useState(0);
    const [isCustomerTyping, setIsCustomerTyping] = useState(false);
    const [negotiationStatusMap, setNegotiationStatusMap] = useState<Record<string | number, string>>({});
    const [liveOffers, setLiveOffers] = useState<Record<string | number, number>>({});

    const [chatMessages, setChatMessages] = useState<Record<string | number, ChatMessage[]>>(() => {
        const initialMap: Record<string | number, ChatMessage[]> = {};
        allNegotiations.forEach(item => {
            const saved = localStorage.getItem(`cd_neg_msgs_${item.rawId}`);
            if (saved) {
                try { initialMap[item.rawId] = JSON.parse(saved); }
                catch { initialMap[item.rawId] = generateInitialMessages(item); }
            } else {
                initialMap[item.rawId] = generateInitialMessages(item);
            }
        });
        return initialMap;
    });

    const updateMessagesForChat = (chatId: number | string, updater: (prev: ChatMessage[]) => ChatMessage[]) => {
        setChatMessages(prev => {
            const current = prev[chatId] || generateInitialMessages(activeNegotiation);
            const updated = updater(current);
            try { localStorage.setItem(`cd_neg_msgs_${chatId}`, JSON.stringify(updated)); } catch {}
            return { ...prev, [chatId]: updated };
        });
    };

    const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

    const handleTogglePinMessage = (msgId: number | string) => {
        updateMessagesForChat(activeNegotiation.rawId, prev =>
            prev.map(m => m.id === msgId ? { ...m, isPinned: !m.isPinned } : m)
        );
    };

    const handleDeleteMessage = (msgId: number | string) => {
        updateMessagesForChat(activeNegotiation.rawId, prev =>
            prev.map(m => m.id === msgId ? { ...m, isDeleted: true, isPinned: false } : m)
        );
    };

    const handleSendMessage = async (text: string, files?: File[]) => {
        if (!text.trim() && (!files || files.length === 0)) return;
        if (editingMsgId) {
            updateMessagesForChat(activeNegotiation.rawId, prev =>
                prev.map(m => m.id === editingMsgId ? { ...m, text, isEdited: true } : m)
            );
            setEditingMsgId(null); setEditingText(''); setInputValue(''); return;
        }

        const attachments = files && files.length > 0 ? files.map(f => ({
            name: f.name,
            size: `${(f.size / 1024).toFixed(1)} KB`,
            type: f.type.startsWith('image/') ? 'image' as const : 'file' as const,
            url: URL.createObjectURL(f)
        })) : undefined;

        const newMsg: ChatMessage = {
            id: `msg-${Date.now()}`,
            type: 'sent',
            text,
            attachments,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        updateMessagesForChat(activeNegotiation.rawId, prev => [...prev, newMsg]);
        setInputValue('');
        setTimeout(scrollToBottom, 100);

        try { await apiClient.post('/chat/send', { quote_id: activeNegotiation.rawId, message: text }); } catch {}

        setIsCustomerTyping(true);
        setTimeout(() => {
            setIsCustomerTyping(false);
            const customerMsg: ChatMessage = {
                id: `msg-${Date.now() + 1}`,
                type: 'received',
                sender: activeNegotiation.customer,
                avatar: activeNegotiation.customer.charAt(0).toUpperCase(),
                text: getRandomCustomerReply(activeNegotiation),
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            updateMessagesForChat(activeNegotiation.rawId, prev => [...prev, customerMsg]);
            setTimeout(scrollToBottom, 100);
        }, 1400);
    };

    const currentPrice = liveOffers[activeNegotiation.rawId] || activeNegotiation.currentOffer || activeNegotiation.originalAmount || 1850;

    const handleSendCounterOffer = async (amount: number, note: string) => {
        const currency = activeNegotiation.currency || '€';
        const newOfferMsg: ChatMessage = {
            id: `offer-${Date.now()}`,
            type: 'offer',
            title: 'Counter Offer Submitted',
            text: note || `You submitted an updated counter offer for ${currency} ${amount.toLocaleString()}`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            newTotal: amount,
            previousTotal: currentPrice,
            status: 'pending'
        };
        updateMessagesForChat(activeNegotiation.rawId, prev => [...prev, newOfferMsg]);
        setLiveOffers(prev => ({ ...prev, [activeNegotiation.rawId]: amount }));
        setTimeout(scrollToBottom, 100);

        try { await apiClient.post(`/supplier/quotes/${activeNegotiation.rawId}/revise`, { amount, message: note }); } catch {}

        setIsCustomerTyping(true);
        setTimeout(() => {
            setIsCustomerTyping(false);
            const customerMsg: ChatMessage = {
                id: `msg-${Date.now() + 1}`,
                type: 'received',
                sender: activeNegotiation.customer,
                avatar: activeNegotiation.customer.charAt(0).toUpperCase(),
                text: `We have received your revised counter rate of ${currency} ${amount.toLocaleString()}. Our team is reviewing it to confirm booking.`,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            updateMessagesForChat(activeNegotiation.rawId, prev => [...prev, customerMsg]);
            setTimeout(scrollToBottom, 100);
        }, 1800);
    };

    const handleAcceptOffer = (offerMsg: any) => {
        const currency = activeNegotiation.currency || '€';
        const acceptedTotal = offerMsg.newTotal || currentPrice;
        setLiveOffers(prev => ({ ...prev, [activeNegotiation.rawId]: acceptedTotal }));
        setNegotiationStatusMap(prev => ({ ...prev, [activeNegotiation.rawId]: 'Accepted' }));
        const confirmMsg: ChatMessage = {
            id: `system-${Date.now()}`,
            type: 'system',
            text: `✅ Counter offer of ${currency} ${acceptedTotal.toLocaleString()} has been accepted and confirmed!`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        updateMessagesForChat(activeNegotiation.rawId, prev =>
            prev.map(m => m.id === offerMsg.id ? { ...m, status: 'accepted' as const } : m).concat(confirmMsg)
        );
        setTimeout(scrollToBottom, 100);
    };

    const handleRejectOffer = (offerMsg: any) => {
        setNegotiationStatusMap(prev => ({ ...prev, [activeNegotiation.rawId]: 'Counter Declined' }));
        const declineMsg: ChatMessage = {
            id: `system-${Date.now()}`,
            type: 'system',
            text: `❌ Counter offer declined. You may submit an alternative rate.`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        updateMessagesForChat(activeNegotiation.rawId, prev =>
            prev.map(m => m.id === offerMsg.id ? { ...m, status: 'rejected' as const } : m).concat(declineMsg)
        );
        setTimeout(scrollToBottom, 100);
    };

    return {
        messagesEndRef,
        inputValue, setInputValue,
        editingMsgId, setEditingMsgId,
        editingText, setEditingText,
        highlightedMsgId, setHighlightedMsgId,
        activePinnedIndex, setActivePinnedIndex,
        isCustomerTyping,
        negotiationStatusMap,
        liveOffers,
        chatMessages,
        currentPrice,
        scrollToBottom,
        handleTogglePinMessage,
        handleDeleteMessage,
        handleSendMessage,
        handleSendCounterOffer,
        handleAcceptOffer,
        handleRejectOffer
    };
}
