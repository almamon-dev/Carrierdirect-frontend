import { useState, useEffect, useRef } from 'react';
import apiClient from '@/lib/axios';
import { CustomerChatItem, CustomerChatMessage } from '../types';
import { generateCustomerInitialMessages } from '../utils/customerChatUtils';

export function useCustomerChatMessages(activeChat: CustomerChatItem | null, allNegotiations: any[]) {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [inputValue, setInputValue] = useState('');
    const [editingMsgId, setEditingMsgId] = useState<number | string | null>(null);
    const [editingText, setEditingText] = useState('');
    const [isSupplierTyping, setIsSupplierTyping] = useState(false);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const activeChatId = activeChat?.id || '';

    // In-memory chat messages state without localStorage
    const [chatMessages, setChatMessages] = useState<Record<string | number, CustomerChatMessage[]>>(() => {
        const initialMap: Record<string | number, CustomerChatMessage[]> = {};
        allNegotiations.forEach(n => {
            initialMap[n.rawId] = generateCustomerInitialMessages(n);
        });
        return initialMap;
    });

    // Database API fetch and Seen state synchronization
    useEffect(() => {
        if (!activeChatId || !activeChat) return;

        // 1. Initial messages setup
        setChatMessages(prev => {
            if (!prev[activeChatId] || prev[activeChatId].length === 0) {
                return { ...prev, [activeChatId]: generateCustomerInitialMessages(activeChat) };
            }
            return prev;
        });

        // 2. Fetch latest messages from database API
        const fetchMessagesFromApi = async () => {
            try {
                let res;
                try {
                    res = await apiClient.get(`/customer/negotiations/${activeChatId}/messages`);
                } catch {
                    res = await apiClient.get(`/negotiations/${activeChatId}/messages`);
                }

                const rawData = res?.data?.data || res?.data || res;
                const rawMsgs = rawData?.all_messages || rawData?.messages || res?.data?.all_messages || res?.all_messages || (Array.isArray(rawData) ? rawData : (Array.isArray(res?.data) ? res.data : []));
                const quoteObj = rawData?.quote || rawData?.original_quote || res?.data?.quote || activeChat?.raw;
                
                const hasAcceptedMsg = Array.isArray(rawMsgs) && rawMsgs.some((m: any) => m.status === 'accepted' || (typeof m.message === 'string' && m.message.includes('accepted')));
                const isQuoteAccepted = quoteObj?.status === 'accepted' || quoteObj?.status === 'Accepted' || quoteObj?.status === 'confirmed' || quoteObj?.status === 'completed' || activeChat?.raw?.status === 'accepted' || activeChat?.raw?.status === 'Accepted' || activeChat?.raw?.status_raw === 'accepted' || activeChat?.raw?.status_raw === 'completed' || hasAcceptedMsg;
                
                const isQuoteRejected = quoteObj?.status === 'rejected' || quoteObj?.status === 'declined' || quoteObj?.revision_status === 'rejected' || activeChat?.raw?.status === 'rejected' || activeChat?.raw?.status === 'Declined' || activeChat?.raw?.status_raw === 'rejected';
                const quoteDeclineReason = quoteObj?.decline_reason || quoteObj?.declineReason || activeChat?.raw?.decline_reason || activeChat?.raw?.declineReason;

                if (rawData?.is_supplier_typing !== undefined || rawData?.is_typing !== undefined) {
                    setIsSupplierTyping(Boolean(rawData?.is_supplier_typing ?? rawData?.is_typing));
                }

                if (Array.isArray(rawMsgs) && rawMsgs.length > 0) {
                    const initialItems = generateCustomerInitialMessages(activeChat).map(init => {
                        if (init.type === 'quote_request') {
                            if (isQuoteAccepted) {
                                return { ...init, status: 'accepted' as const };
                            }
                            if (isQuoteRejected) {
                                return { ...init, status: 'rejected' as const, declineReason: quoteDeclineReason || init.declineReason };
                            }
                        }
                        return init;
                    });

                    const mapped: CustomerChatMessage[] = rawMsgs.map((m: any) => {
                        const isSent = Boolean(m.is_me || m.sender_type === 'customer' || m.sender_id === 5);
                        return {
                            id: m.id || `msg-${Date.now()}-${Math.random()}`,
                            type: m.type === 'system' ? 'system' : (m.message_type === 'offer' ? 'offer' : (m.message_type === 'quote_request' ? 'quote_request' : (isSent ? 'sent' : 'received'))),
                            attachments: m.attachments || (m.attachment ? [m.attachment] : undefined),
                            text: m.text || m.message || m.message_text || m.body || '',
                            time: m.time || m.created_at_formatted || new Date(m.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                            sender: m.sender || m.sender_name,
                            avatar: m.avatar,
                            seen: Boolean(m.is_read || m.seen || m.read_at),
                            seenAt: m.seen_at || m.read_at,
                            isRead: Boolean(m.is_read),
                            deliveryStatus: m.is_read ? 'seen' : (m.delivery_status || 'sent'),
                            status: m.status,
                            declineReason: m.decline_reason || m.declineReason,
                            newTotal: m.proposed_amount ? Number(m.proposed_amount) : m.newTotal,
                            previousTotal: m.previous_amount ? Number(m.previous_amount) : m.previousTotal
                        };
                    });

                    const requestCard = initialItems.find(item => item.type === 'quote_request') || initialItems[0];
                    const finalMessages = mapped.some(m => m.type === 'quote_request') ? mapped : (requestCard ? [requestCard, ...mapped] : mapped);
                    setChatMessages(prev => ({ ...prev, [activeChatId]: finalMessages, [String(activeChatId)]: finalMessages }));
                } else if (isQuoteAccepted || isQuoteRejected) {
                    const fallback = generateCustomerInitialMessages(activeChat).map(init => (
                        init.type === 'quote_request'
                            ? { ...init, status: isQuoteAccepted ? ('accepted' as const) : ('rejected' as const), declineReason: quoteDeclineReason }
                            : init
                    ));
                    setChatMessages(prev => ({ ...prev, [activeChatId]: fallback, [String(activeChatId)]: fallback }));
                }
            } catch {}
        };

        fetchMessagesFromApi();

        // 3. Mark incoming messages as seen in database
        const markAsSeenInDatabase = async () => {
            try {
                await apiClient.post(`/customer/negotiations/${activeChatId}/seen`);
            } catch {
                await apiClient.post(`/negotiations/${activeChatId}/seen`).catch(() => {});
            }
        };
        markAsSeenInDatabase();

        const timer = setInterval(fetchMessagesFromApi, 4000);
        return () => clearInterval(timer);
    }, [activeChatId, activeChat]);

    const updateMessagesForActiveChat = (updater: (prev: CustomerChatMessage[]) => CustomerChatMessage[]) => {
        if (!activeChatId) return;
        setChatMessages(prev => {
            const current = prev[activeChatId] || generateCustomerInitialMessages(activeChat);
            return { ...prev, [activeChatId]: updater(current) };
        });
    };

    const handleTogglePinMessage = (msgId: number | string) => {
        updateMessagesForActiveChat(prev => prev.map(m => m.id === msgId ? { ...m, isPinned: !m.isPinned } : m));
    };

    const handleDeleteMessage = (msgId: number | string) => {
        updateMessagesForActiveChat(prev => prev.map(m => m.id === msgId ? { ...m, isDeleted: true, isPinned: false } : m));
    };

    const handleStartEdit = (msg: CustomerChatMessage) => {
        setEditingMsgId(msg.id);
        setEditingText(msg.text || '');
        setInputValue(msg.text || '');
    };

    const handleCancelEdit = () => {
        setEditingMsgId(null);
        setEditingText('');
        setInputValue('');
    };

    const handleSendMessage = async (text: string, files?: File[]) => {
        const hasText = Boolean(text && text.trim());
        const hasFiles = Boolean(files && files.length > 0);
        if (!hasText && !hasFiles) return;

        if (editingMsgId) {
            updateMessagesForActiveChat(prev => prev.map(m => m.id === editingMsgId ? { ...m, text, isEdited: true } : m));
            setEditingMsgId(null);
            setEditingText('');
            setInputValue('');
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
            type: 'sent',
            text: text || '',
            attachments: localAttachments,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            seen: false,
            isRead: false,
            deliveryStatus: 'sent'
        };
        updateMessagesForActiveChat(prev => [...prev, newMsg]);
        setInputValue('');
        setTimeout(scrollToBottom, 100);

        try {
            if (hasFiles) {
                const formData = new FormData();
                formData.append('quote_id', String(activeChatId));
                formData.append('negotiation_id', String(activeChatId));
                formData.append('message', text || '');
                formData.append('text', text || '');
                files!.forEach(f => {
                    formData.append('attachments[]', f);
                });
                await apiClient.post(`/customer/negotiations/${activeChatId}/messages`, formData).catch(() => {
                    return apiClient.post(`/negotiations/${activeChatId}/messages`, formData);
                });
            } else {
                await apiClient.post(`/customer/negotiations/${activeChatId}/messages`, {
                    quote_id: activeChatId,
                    message: text,
                    text,
                    negotiation_id: activeChatId
                }).catch(() => {
                    return apiClient.post(`/negotiations/${activeChatId}/messages`, {
                        quote_id: activeChatId,
                        message: text,
                        text,
                        negotiation_id: activeChatId
                    });
                });
            }
        } catch {}
    };

    const handleSendCounterOffer = async (amount: number, note: string) => {
        const newOfferMsg: CustomerChatMessage = {
            id: `offer-${Date.now()}`,
            type: 'offer',
            title: 'Counter Offer Submitted',
            text: note || `You submitted a revised counter rate of € ${amount.toLocaleString()}`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            newTotal: amount,
            previousTotal: activeChat?.currentPrice || 0,
            status: 'pending'
        };
        updateMessagesForActiveChat(prev => [...prev, newOfferMsg]);
        setTimeout(scrollToBottom, 100);

        try {
            await apiClient.post(`/customer/negotiations/${activeChatId}/counter-offer`, {
                amount,
                proposed_amount: amount,
                note,
                negotiation_id: activeChatId
            });
        } catch {
            await apiClient.post(`/negotiations/${activeChatId}/counter-offer`, {
                amount,
                proposed_amount: amount,
                note,
                negotiation_id: activeChatId
            }).catch(() => {});
        }
    };

    const handleAcceptOffer = async (offerMsg: any) => {
        const acceptedTotal = Number(offerMsg?.newTotal || offerMsg?.proposed_amount || activeChat?.currentPrice || 0);
        const confirmMsg: CustomerChatMessage = {
            id: `system-${Date.now()}`,
            type: 'system',
            text: `✅ Counter offer of € ${acceptedTotal.toLocaleString()} has been accepted and confirmed!`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        updateMessagesForActiveChat(prev =>
            prev.map(m => (m.type === 'quote_request' || m.id === offerMsg?.id || m.type === 'offer') ? { ...m, status: 'accepted' as const, newTotal: acceptedTotal } : m).concat(confirmMsg)
        );
        if (activeChat?.raw) {
            activeChat.raw.status = 'accepted';
            activeChat.raw.status_raw = 'accepted';
        }
        setTimeout(scrollToBottom, 100);

        try {
            await apiClient.post(`/customer/negotiations/${activeChatId}/accept`, {
                offer_id: offerMsg?.id,
                amount: acceptedTotal,
                proposed_amount: acceptedTotal
            });
        } catch {
            await apiClient.post(`/negotiations/${activeChatId}/accept`, {
                offer_id: offerMsg?.id,
                amount: acceptedTotal,
                proposed_amount: acceptedTotal
            }).catch(() => {});
        }
    };

    const handleRejectOffer = async (offerMsg: any, reason?: string) => {
        const reasonText = reason ? ` (Reason: "${reason}")` : '';
        const declineMsg: CustomerChatMessage = {
            id: `system-${Date.now()}`,
            type: 'system',
            text: `❌ Offer declined${reasonText}. You may submit an alternative rate.`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        updateMessagesForActiveChat(prev =>
            prev.map(m => (m.id === offerMsg?.id || (offerMsg?.type === 'quote_request' && m.type === 'quote_request')) ? { ...m, status: 'rejected' as const, declineReason: reason } : m).concat(declineMsg)
        );
        setTimeout(scrollToBottom, 100);

        try {
            await apiClient.post(`/customer/negotiations/${activeChatId}/reject`, { offer_id: offerMsg?.id, reason: reason || '', decline_reason: reason || '' });
        } catch {
            await apiClient.post(`/negotiations/${activeChatId}/reject`, { offer_id: offerMsg?.id, reason: reason || '', decline_reason: reason || '' }).catch(() => {});
        }
    };

    const lastTypingSentRef = useRef<number>(0);
    const notifyTyping = () => {
        const now = Date.now();
        if (now - lastTypingSentRef.current < 2500) return;
        lastTypingSentRef.current = now;
        apiClient.post(`/customer/negotiations/${activeChatId}/typing`).catch(() => {
            apiClient.post(`/negotiations/${activeChatId}/typing`).catch(() => {});
        });
    };

    const currentMessages = activeChatId ? (chatMessages[activeChatId] || generateCustomerInitialMessages(activeChat)) : [];

    return {
        messagesEndRef,
        inputValue,
        setInputValue,
        editingMsgId,
        isSupplierTyping,
        notifyTyping,
        currentMessages,
        scrollToBottom,
        handleSendMessage,
        handleSendCounterOffer,
        handleAcceptOffer,
        handleRejectOffer,
        handleTogglePinMessage,
        handleDeleteMessage,
        handleStartEdit,
        handleCancelEdit
    };
}
