import { useState, useEffect, useRef } from 'react';
import { driverApi } from '../../services/driverApi';
import { DriverChatConversation, DriverChatMessage } from '../../types';

export function useDriverChat() {
    const [conversations, setConversations] = useState<DriverChatConversation[]>([]);
    const [activeConvId, setActiveConvId] = useState<string>('conv-1');
    const [messages, setMessages] = useState<DriverChatMessage[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const loadConversations = async () => {
        try {
            const list = await driverApi.getConversations();
            setConversations(list);
            if (list.length > 0 && !activeConvId) {
                setActiveConvId(list[0].id);
            }
        } catch (err) {
            console.error('Failed to load chat conversations', err);
        } finally {
            setIsLoading(false);
        }
    };

    const loadMessages = async (convId: string) => {
        if (!convId) return;
        try {
            const msgs = await driverApi.getMessages(convId);
            setMessages(msgs);
            setTimeout(() => {
                messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        } catch (err) {
            console.error('Failed to load messages', err);
        }
    };

    useEffect(() => {
        loadConversations();
    }, []);

    useEffect(() => {
        if (activeConvId) {
            loadMessages(activeConvId);
        }
    }, [activeConvId]);

    const handleSendMessage = async (textToSend?: string) => {
        const text = textToSend || inputValue;
        if (!text.trim() || !activeConvId) return;

        const sent = await driverApi.sendMessage(activeConvId, text.trim());
        setMessages((prev) => [...prev, sent]);
        setInputValue('');

        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    const activeConversation = conversations.find((c) => c.id === activeConvId) || conversations[0];

    return {
        conversations,
        activeConvId,
        setActiveConvId,
        activeConversation,
        messages,
        inputValue,
        setInputValue,
        handleSendMessage,
        messagesEndRef,
        isLoading,
    };
}
