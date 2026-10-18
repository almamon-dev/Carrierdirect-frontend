import { useState, useRef } from 'react';
import { NegotiationItem } from '../../types';
import { ChatMessage } from '../types';
import { generateInitialMessages } from '../utils/initialMessages';
import { useChatOfferActions } from './useChatOfferActions';
import { useChatTyping } from './useChatTyping';
import { useChatMessageMutationActions } from './useChatMessageMutationActions';
import { useChatPoller } from './useChatPoller';

export function useChatMessages(activeNegotiation: NegotiationItem, allNegotiations: NegotiationItem[]) {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [inputValue, setInputValue] = useState('');
    const [editingMsgId, setEditingMsgId] = useState<number | string | null>(null);
    const [editingText, setEditingText] = useState('');
    const [highlightedMsgId, setHighlightedMsgId] = useState<number | string | null>(null);
    const [activePinnedIndex, setActivePinnedIndex] = useState(0);
    const [negotiationStatusMap] = useState<Record<string | number, string>>({});
    const [liveOffers] = useState<Record<string | number, number>>({});

    const activeRawId = activeNegotiation?.rawId || '';
    const currentPrice = Number(activeNegotiation?.currentOffer || activeNegotiation?.originalAmount || 0);

    const [chatMessages, setChatMessages] = useState<Record<string | number, ChatMessage[]>>({});

    const updateMessagesForChat = (chatId: number | string, updater: (prev: ChatMessage[]) => ChatMessage[]) => {
        setChatMessages((prev) => {
            const current = prev[chatId] || generateInitialMessages(activeNegotiation);
            return { ...prev, [chatId]: updater(current) };
        });
    };

    const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

    const {
        isCustomerTyping,
        setIsCustomerTyping,
        notifyTyping,
        typingAutoClearTimerRef,
        typingInactivityTimerRef,
    } = useChatTyping(activeRawId);

    const { isMessagesLoading } = useChatPoller({
        activeRawId,
        activeNegotiation,
        chatMessages,
        setChatMessages,
        setIsCustomerTyping,
        typingAutoClearTimerRef,
        typingInactivityTimerRef,
    });

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

    const { handleSendMessage, handleTogglePinMessage, handleDeleteMessage } = useChatMessageMutationActions({
        activeRawId,
        updateMessagesForChat,
        editingMsgId,
        setEditingMsgId,
        setEditingText,
        setInputValue,
        notifyTyping,
        scrollToBottom,
    });

    return {
        isMessagesLoading,
        messagesEndRef,
        inputValue,
        setInputValue,
        editingMsgId,
        setEditingMsgId,
        editingText,
        setEditingText,
        highlightedMsgId,
        setHighlightedMsgId,
        activePinnedIndex,
        setActivePinnedIndex,
        isCustomerTyping,
        notifyTyping,
        negotiationStatusMap,
        liveOffers,
        chatMessages,
        setChatMessages,
        currentPrice,
        scrollToBottom,
        handleTogglePinMessage,
        handleDeleteMessage,
        handleSendMessage,
        handleSendCounterOffer,
        handleAcceptOffer,
        handleRejectOffer,
        handleStartEdit: (msg: ChatMessage) => {
            setEditingMsgId(msg.id);
            setEditingText(msg.text || '');
            setInputValue(msg.text || '');
        },
        handleCancelEdit: () => {
            setEditingMsgId(null);
            setEditingText('');
            setInputValue('');
        },
    };
}
