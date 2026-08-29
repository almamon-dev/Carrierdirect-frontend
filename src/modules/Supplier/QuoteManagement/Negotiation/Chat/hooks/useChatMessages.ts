import { useState, useRef, useEffect } from 'react';
import { apiClient } from '@/lib/axios';
import { NegotiationItem } from '../../types';
import { ChatMessage } from '../types';
import { generateInitialMessages } from '../utils/initialMessages';

export function useChatMessages(activeNegotiation: NegotiationItem | null, allNegotiations: NegotiationItem[]) {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [inputValue, setInputValue] = useState('');
    const [editingMsgId, setEditingMsgId] = useState<number | string | null>(null);
    const [editingText, setEditingText] = useState('');
    const [highlightedMsgId, setHighlightedMsgId] = useState<number | string | null>(null);
    const [activePinnedIndex, setActivePinnedIndex] = useState(0);
    const [isCustomerTyping, setIsCustomerTyping] = useState(false);
    const [negotiationStatusMap, setNegotiationStatusMap] = useState<Record<string | number, string>>({});
    const [liveOffers, setLiveOffers] = useState<Record<string | number, number>>({});

    const activeRawId = activeNegotiation?.rawId || '';
    const currentPrice = Number(activeNegotiation?.currentOffer || activeNegotiation?.originalAmount || 0);

    const [chatMessages, setChatMessages] = useState<Record<string | number, ChatMessage[]>>(() => {
        const initialMap: Record<string | number, ChatMessage[]> = {};
        allNegotiations.forEach(item => {
            initialMap[item.rawId] = generateInitialMessages(item);
        });
        return initialMap;
    });

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
                const rawMsgs = rawData?.all_messages || rawData?.messages || res?.data?.all_messages || res?.all_messages || (Array.isArray(rawData) ? rawData : (Array.isArray(res?.data) ? res.data : []));
                const quoteObj = rawData?.quote || rawData?.original_quote || res?.data?.quote || activeNegotiation;
                
                const hasAcceptedMsg = Array.isArray(rawMsgs) && rawMsgs.some((m: any) => m.status === 'accepted' || (typeof m.message === 'string' && m.message.includes('accepted')));
                const isQuoteAccepted = quoteObj?.status === 'accepted' || quoteObj?.status === 'Accepted' || quoteObj?.status === 'confirmed' || quoteObj?.status === 'completed' || (activeNegotiation as any)?.status === 'Accepted' || (activeNegotiation as any)?.status === 'accepted' || (activeNegotiation as any)?.statusRaw === 'accepted' || hasAcceptedMsg;
                
                const isQuoteRejected = quoteObj?.status === 'rejected' || quoteObj?.status === 'declined' || quoteObj?.status === 'Offer Declined' || (activeNegotiation as any)?.status === 'Offer Declined' || (activeNegotiation as any)?.status === 'Declined' || (activeNegotiation as any)?.status === 'rejected' || (activeNegotiation as any)?.statusRaw === 'rejected';
                const quoteDeclineReason = quoteObj?.decline_reason || quoteObj?.declineReason || (activeNegotiation as any)?.declineReason || (activeNegotiation as any)?.decline_reason;

                if (rawData?.is_customer_typing !== undefined || rawData?.is_typing !== undefined) {
                    setIsCustomerTyping(Boolean(rawData?.is_customer_typing ?? rawData?.is_typing));
                }

                if (Array.isArray(rawMsgs) && rawMsgs.length > 0) {
                    const initialItems = generateInitialMessages(activeNegotiation).map(init => {
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

                    const mapped: ChatMessage[] = rawMsgs.map((m: any) => {
                        const isSent = Boolean(m.is_me || m.sender_type === 'supplier' || m.sender_id === 2);
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
                    setChatMessages(prev => ({ ...prev, [activeRawId]: finalMessages, [String(activeRawId)]: finalMessages }));
                } else if (isQuoteAccepted || isQuoteRejected) {
                    const fallback = generateInitialMessages(activeNegotiation).map(init => (
                        init.type === 'quote_request'
                            ? { ...init, status: isQuoteAccepted ? ('accepted' as const) : ('rejected' as const), declineReason: quoteDeclineReason }
                            : init
                    ));
                    setChatMessages(prev => ({ ...prev, [activeRawId]: fallback, [String(activeRawId)]: fallback }));
                }
            } catch {}
        };
        fetchMessages();

        const markAsSeenInDatabase = async () => {
            try {
                await apiClient.post(`/supplier/negotiations/${activeRawId}/seen`);
            } catch {
                await apiClient.post(`/negotiations/${activeRawId}/seen`).catch(() => {});
            }
        };
        markAsSeenInDatabase();

        const timer = setInterval(fetchMessages, 4000);
        return () => clearInterval(timer);
    }, [activeRawId, activeNegotiation]);

    const updateMessagesForChat = (chatId: number | string, updater: (prev: ChatMessage[]) => ChatMessage[]) => {
        setChatMessages(prev => {
            const current = prev[chatId] || generateInitialMessages(activeNegotiation);
            return { ...prev, [chatId]: updater(current) };
        });
    };

    const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

    const handleTogglePinMessage = (msgId: number | string) => {
        updateMessagesForChat(activeRawId, prev =>
            prev.map(m => m.id === msgId ? { ...m, isPinned: !m.isPinned } : m)
        );
    };

    const handleDeleteMessage = (msgId: number | string) => {
        updateMessagesForChat(activeRawId, prev =>
            prev.map(m => m.id === msgId ? { ...m, isDeleted: true, isPinned: false } : m)
        );
    };

    const handleSendMessage = async (text: string, files?: File[]) => {
        const hasText = Boolean(text && text.trim());
        const hasFiles = Boolean(files && files.length > 0);
        if (!hasText && !hasFiles) return;

        if (editingMsgId) {
            updateMessagesForChat(activeRawId, prev =>
                prev.map(m => m.id === editingMsgId ? { ...m, text, isEdited: true } : m)
            );
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
            seen: false,
            isRead: false,
            deliveryStatus: 'sent'
        };
        updateMessagesForChat(activeRawId, prev => [...prev, newMsg]);
        setInputValue('');
        setTimeout(scrollToBottom, 100);

        try {
            if (hasFiles) {
                const formData = new FormData();
                formData.append('quote_id', String(activeRawId));
                formData.append('negotiation_id', String(activeRawId));
                formData.append('message', text || '');
                formData.append('text', text || '');
                files!.forEach(f => {
                    formData.append('attachments[]', f);
                });
                await apiClient.post(`/supplier/negotiations/${activeRawId}/messages`, formData).catch(() => {
                    return apiClient.post(`/negotiations/${activeRawId}/messages`, formData);
                });
            } else {
                await apiClient.post(`/supplier/negotiations/${activeRawId}/messages`, {
                    quote_id: activeRawId,
                    message: text,
                    text,
                    negotiation_id: activeRawId
                }).catch(() => {
                    return apiClient.post(`/negotiations/${activeRawId}/messages`, {
                        quote_id: activeRawId,
                        message: text,
                        text,
                        negotiation_id: activeRawId
                    });
                });
            }
        } catch {}
    };

    const handleSendCounterOffer = async (amount: number, note: string) => {
        const newOfferMsg: ChatMessage = {
            id: `offer-${Date.now()}`,
            type: 'offer',
            title: 'Counter Offer Submitted',
            text: note || `You submitted a counter rate of € ${amount.toLocaleString()}`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            newTotal: amount,
            previousTotal: currentPrice,
            status: 'pending'
        };
        updateMessagesForChat(activeRawId, prev => [...prev, newOfferMsg]);
        setTimeout(scrollToBottom, 100);

        try {
            await apiClient.post(`/supplier/negotiations/${activeRawId}/counter-offer`, {
                amount,
                proposed_amount: amount,
                note,
                negotiation_id: activeRawId
            });
        } catch {
            await apiClient.post(`/negotiations/${activeRawId}/counter-offer`, {
                amount,
                proposed_amount: amount,
                note,
                negotiation_id: activeRawId
            }).catch(() => {});
        }
    };

    const handleAcceptOffer = async (offerMsg: any) => {
        const acceptedTotal = Number(offerMsg?.newTotal || offerMsg?.proposed_amount || currentPrice);
        const confirmMsg: ChatMessage = {
            id: `system-${Date.now()}`,
            type: 'system',
            text: `✅ Counter offer of € ${acceptedTotal.toLocaleString()} has been accepted!`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        updateMessagesForChat(activeRawId, prev =>
            prev.map(m => (m.type === 'quote_request' || m.id === offerMsg?.id || m.type === 'offer') ? { ...m, status: 'accepted' as const, newTotal: acceptedTotal } : m).concat(confirmMsg)
        );
        if (activeNegotiation) {
            (activeNegotiation as any).status = 'Accepted';
            (activeNegotiation as any).statusRaw = 'accepted';
        }
        setTimeout(scrollToBottom, 100);

        try {
            await apiClient.post(`/supplier/negotiations/${activeRawId}/accept`, {
                offer_id: offerMsg?.id,
                amount: acceptedTotal,
                proposed_amount: acceptedTotal
            });
        } catch {
            await apiClient.post(`/negotiations/${activeRawId}/accept`, {
                offer_id: offerMsg?.id,
                amount: acceptedTotal,
                proposed_amount: acceptedTotal
            }).catch(() => {});
        }
    };

    const handleRejectOffer = async (offerMsg: any, reason?: string) => {
        const reasonText = reason ? ` (Reason: "${reason}")` : '';
        const declineMsg: ChatMessage = {
            id: `system-${Date.now()}`,
            type: 'system',
            text: `❌ Offer declined${reasonText}.`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        updateMessagesForChat(activeRawId, prev =>
            prev.map(m => (m.id === offerMsg?.id || (offerMsg?.type === 'quote_request' && m.type === 'quote_request')) ? { ...m, status: 'rejected' as const, declineReason: reason } : m).concat(declineMsg)
        );
        setTimeout(scrollToBottom, 100);

        try {
            await apiClient.post(`/supplier/negotiations/${activeRawId}/reject`, { offer_id: offerMsg?.id, reason: reason || '', decline_reason: reason || '' });
        } catch {
            await apiClient.post(`/negotiations/${activeRawId}/reject`, { offer_id: offerMsg?.id, reason: reason || '', decline_reason: reason || '' }).catch(() => {});
        }
    };

    const currentMessages = activeRawId ? (chatMessages[activeRawId] || (activeNegotiation ? generateInitialMessages(activeNegotiation) : [])) : [];

    const lastTypingSentRef = useRef<number>(0);
    const notifyTyping = () => {
        const now = Date.now();
        if (now - lastTypingSentRef.current < 2500) return;
        lastTypingSentRef.current = now;
        apiClient.post(`/supplier/negotiations/${activeRawId}/typing`).catch(() => {
            apiClient.post(`/negotiations/${activeRawId}/typing`).catch(() => {});
        });
    };

    return {
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
        currentMessages,
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
        }
    };
}
