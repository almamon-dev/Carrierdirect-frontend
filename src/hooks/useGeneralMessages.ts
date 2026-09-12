import { useState, useEffect, useCallback, useRef } from 'react';
import messageService, {
    GeneralMessage,
    ConversationPartnerItem,
    ConversationUser,
    MessageAttachment,
    SendMessagePayload,
    extractMessagesArray
} from '@/services/messageService';
import { decryptId } from '@/lib/encryption';
import { isImageAttachment } from '@/modules/Shared/Messages/components/GeneralChatMessageBubble';
import { formatLocalTime } from '@/modules/Customer/QuoteManagement/Negotiation/Chat/utils/customerChatUtils';

export const parseRawAttachments = (m: any): any[] => {
    if (!m) return [];

    let raw = m.attachments ?? m.files ?? m.media ?? m.documents ?? m.images ?? m.photos ?? m.attachment ?? m.file ?? m.document ?? m.image ?? m.photo ?? m.file_url ?? m.file_path ?? m.image_url ?? m.photo_url ?? m.path ?? m.url ?? null;

    if (!raw) {
        if (typeof m.message === 'string') {
            const trimmed = m.message.trim();
            if (m.message_type === 'image' || m.message_type === 'file' || m.type === 'image' || m.type === 'file' || /\.(jpg|jpeg|png|webp|gif|svg|bmp|avif|pdf|docx?|xlsx?|csv|zip)($|\?)/i.test(trimmed)) {
                return [trimmed];
            }
        }
        if (typeof m.text === 'string') {
            const trimmed = m.text.trim();
            if (m.message_type === 'image' || m.message_type === 'file' || m.type === 'image' || m.type === 'file' || /\.(jpg|jpeg|png|webp|gif|svg|bmp|avif|pdf|docx?|xlsx?|csv|zip)($|\?)/i.test(trimmed)) {
                return [trimmed];
            }
        }
        if (typeof m.body === 'string') {
            const trimmed = m.body.trim();
            if (m.message_type === 'image' || m.message_type === 'file' || m.type === 'image' || m.type === 'file' || /\.(jpg|jpeg|png|webp|gif|svg|bmp|avif|pdf|docx?|xlsx?|csv|zip)($|\?)/i.test(trimmed)) {
                return [trimmed];
            }
        }
        return [];
    }

    if (typeof raw === 'string') {
        const trimmed = raw.trim();
        if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
            try {
                const parsed = JSON.parse(trimmed);
                return Array.isArray(parsed) ? parsed : [parsed];
            } catch {}
        }
        if (trimmed.includes(',') && !trimmed.startsWith('http') && !trimmed.startsWith('data:')) {
            return trimmed.split(',').map(s => s.trim()).filter(Boolean);
        }
        return [trimmed];
    }

    if (Array.isArray(raw)) {
        return raw;
    }

    if (typeof raw === 'object' && raw !== null) {
        return [raw];
    }

    return [];
};

export const decodePartnerId = (hash?: any): number | null => {
    if (!hash) return null;
    const str = String(hash).trim();
    if (/^\d+$/.test(str)) return Number(str);
    try {
        let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
        while (base64.length % 4) base64 += "=";
        const decoded = atob(base64);
        if (/^\d+$/.test(decoded)) return Number(decoded);
    } catch {}
    const num = Number(str);
    return isNaN(num) ? null : num;
};

export const useGeneralMessages = (
    initialPartnerId?: number | string | null,
    role?: 'supplier' | 'customer' | string
) => {
    const initialRawId = decodePartnerId(initialPartnerId);

    const [conversations, setConversations] = useState<ConversationPartnerItem[]>([]);
    const [directoryUsers, setDirectoryUsers] = useState<ConversationUser[]>([]);
    const [unreadCount, setUnreadCount] = useState<number>(0);
    const [isLoadingConversations, setIsLoadingConversations] = useState<boolean>(false);
    const [isLoadingDirectory, setIsLoadingDirectory] = useState<boolean>(false);

    const [activePartnerId, setActivePartnerId] = useState<number | null>(initialRawId || null);
    const [activePartner, setActivePartner] = useState<ConversationUser | null>(null);
    const [messages, setMessages] = useState<GeneralMessage[]>([]);
    const [isLoadingMessages, setIsLoadingMessages] = useState<boolean>(false);
    const [loadedPartnerIds, setLoadedPartnerIds] = useState<Set<number>>(new Set());
    const [isSending, setIsSending] = useState<boolean>(false);

    const activePartnerIdRef = useRef<number | null>(activePartnerId);
    activePartnerIdRef.current = activePartnerId;

    const messagesCacheRef = useRef<Map<number, GeneralMessage[]>>(new Map());

    // 1. Fetch directory users from API
    const fetchDirectoryUsers = useCallback(async () => {
        setIsLoadingDirectory(true);
        try {
            const users = await messageService.getDirectoryUsers(role);
            setDirectoryUsers(users);
        } catch (err) {
            console.error('Failed to fetch directory users:', err);
        } finally {
            setIsLoadingDirectory(false);
        }
    }, [role]);

    // 2. Fetch conversations from API
    const fetchConversations = useCallback(async (silent = true) => {
        if (!silent) setIsLoadingConversations(true);
        try {
            const [convRes, countRes]: [any, any] = await Promise.all([
                messageService.getConversations().catch(() => ({ data: [] })),
                messageService.getUnreadCount().catch(() => ({ data: { unread_count: 0 } }))
            ]);

            const rawList: any[] = Array.isArray(convRes?.data?.data)
                ? convRes.data.data
                : Array.isArray(convRes?.data)
                ? convRes.data
                : Array.isArray(convRes?.data?.items)
                ? convRes.data.items
                : [];

            const list: ConversationPartnerItem[] = rawList.map((raw: any) => {
                const userObj = raw.user || raw.partner || raw.recipient || raw.sender || raw;
                const userId = Number(raw.partner_id || raw.recipient_id || raw.user_id || userObj?.id || raw.id);
                const userName = userObj?.name || userObj?.company_name || raw.name || raw.company_name || 'User';

                return {
                    user: {
                        id: userId,
                        name: userName,
                        user_type: userObj?.user_type || raw.user_type || 'user',
                        email: userObj?.email || raw.email || '',
                        avatar: userObj?.avatar || raw.avatar || '',
                        company_name: userObj?.company_name || raw.company_name || userName,
                        is_verified: Boolean(userObj?.is_verified ?? raw.is_verified ?? userObj?.email_verified_at),
                        role: userObj?.role || raw.role || (userObj?.user_type ? userObj.user_type.charAt(0).toUpperCase() + userObj.user_type.slice(1) : undefined),
                        designation: userObj?.designation || raw.designation,
                        department: userObj?.department || raw.department,
                        is_online: Boolean(userObj?.is_online ?? raw.is_online),
                        last_seen_at: userObj?.last_seen_at || raw.last_seen_at || null,
                        last_seen_human: userObj?.last_seen_human || raw.last_seen_human || (Boolean(userObj?.is_online ?? raw.is_online) ? "Active Now" : "Offline")
                    },
                    last_message: raw.last_message ? {
                        id: Number(raw.last_message.id || 0),
                        sender_id: Number(raw.last_message.sender_id || 0),
                        message: raw.last_message.message || raw.last_message.body || raw.last_message.text || '',
                        message_type: raw.last_message.message_type || (raw.last_message.attachments?.length ? 'file' : 'text'),
                        is_me: Boolean(raw.last_message.is_me),
                        is_read: Boolean(raw.last_message.is_read),
                        created_at_human: raw.last_message.created_at_human,
                        time: raw.last_message.time
                    } : null,
                    unread_count: Number(raw.unread_count || raw.unseen_count || 0),
                    last_message_at: raw.last_message_at || raw.updated_at || raw.created_at || null
                };
            });

            setConversations(prev => {
                // Shallow check if anything changed to avoid re-rendering entire layout
                if (prev.length === list.length) {
                    const hasChanged = list.some((item, idx) => {
                        const p = prev[idx];
                        return !p || p.user.id !== item.user.id || p.unread_count !== item.unread_count || p.last_message?.id !== item.last_message?.id;
                    });
                    if (!hasChanged) return prev;
                }
                return list;
            });

            const count = countRes?.data?.unread_count ?? countRes?.data?.count ?? 0;
            setUnreadCount(Number(count));
        } catch (err) {
            console.error('Failed to fetch conversations:', err);
        } finally {
            if (!silent) setIsLoadingConversations(false);
        }
    }, []);

    // 3. Fetch messages for active partner from backend database API
    const fetchMessages = useCallback(async (partnerId: number | string, silent = true) => {
        if (!partnerId) return;
        const cleanId = decodePartnerId(partnerId);
        if (!cleanId) return;

        if (!silent) {
            setIsLoadingMessages(true);
        }

        try {
            const res: any = await messageService.getMessages(cleanId);
            const rawMsgs = extractMessagesArray(res) || [];

            const normalized: GeneralMessage[] = rawMsgs.map((m: any, idx: number) => {
                const senderId = Number(m.sender_id || m.sender?.id || m.from_user_id || 0);
                const receiverId = Number(m.receiver_id || m.receiver?.id || m.to_user_id || m.recipient_id || 0);
                const isMe = m.is_me !== undefined ? Boolean(m.is_me) : (senderId ? senderId !== cleanId : receiverId === cleanId);

                const rawAttachments = parseRawAttachments(m);
                const hasAttachments = rawAttachments.length > 0;
                const hasImg = rawAttachments.some(isImageAttachment);
                const msgType = m.message_type || m.type || (hasImg ? 'image' : (hasAttachments ? 'file' : 'text'));

                return {
                    id: Number(m.id || Date.now() + idx),
                    sender_id: senderId,
                    receiver_id: receiverId,
                    reply_to_id: m.reply_to_id ?? m.reply_to?.id ?? null,
                    reply_to: m.reply_to ? {
                        id: Number(m.reply_to.id),
                        sender_id: Number(m.reply_to.sender_id),
                        message: m.reply_to.message,
                        message_type: m.reply_to.message_type,
                        is_me: m.reply_to.is_me !== undefined ? Boolean(m.reply_to.is_me) : (Number(m.reply_to.sender_id) === Number(senderId) ? isMe : !isMe)
                    } : null,
                    message: m.message || m.body || m.text || m.content || '',
                    message_type: msgType,
                    attachments: hasAttachments ? rawAttachments : null,
                    is_me: isMe,
                    is_read: Boolean(m.is_read || m.read_at),
                    read_at: m.read_at,
                    is_pinned: Boolean(m.is_pinned ?? (m as any).isPinned),
                    pinned_at: m.pinned_at || null,
                    is_edited: Boolean(m.is_edited),
                    time: formatLocalTime(m.created_at, m.time),
                    date: m.date || (m.created_at ? new Date(m.created_at).toLocaleDateString() : ''),
                    created_at_human: m.created_at_human || 'Just now',
                    created_at: m.created_at || new Date().toISOString()
                };
            });

            messagesCacheRef.current.set(cleanId, normalized);

            if (activePartnerIdRef.current === cleanId) {
                setMessages(normalized);
                setLoadedPartnerIds(prev => new Set(prev).add(cleanId));
            }
        } catch (err) {
            console.error(`Failed to fetch messages for partner ${cleanId}:`, err);
        } finally {
            setIsLoadingMessages(false);
        }
    }, []);

    // 4. Select a partner to open conversation
    const selectPartner = useCallback((partnerId: number | string, userObj?: ConversationUser) => {
        const cleanId = decodePartnerId(partnerId);
        if (!cleanId) return;

        const isSamePartner = activePartnerIdRef.current === cleanId;
        setActivePartnerId(cleanId);
        activePartnerIdRef.current = cleanId;

        if (userObj) {
            setActivePartner(userObj);
        }

        const isCached = messagesCacheRef.current.has(cleanId);
        const cached = messagesCacheRef.current.get(cleanId) || [];

        if (isSamePartner && isCached) {
            fetchMessages(cleanId, true);
        } else if (isCached) {
            setMessages(cached);
            setIsLoadingMessages(false);
            fetchMessages(cleanId, true);
        } else {
            setMessages([]);
            setIsLoadingMessages(false);
            fetchMessages(cleanId, true);
        }
    }, [fetchMessages]);

    // Sync active partner info whenever conversations or directory users update
    useEffect(() => {
        if (!activePartnerId) return;
        const found = conversations.find(c => Number(c.user?.id) === Number(activePartnerId));
        if (found?.user) {
            setActivePartner(prev => ({ ...(prev || {}), ...found.user }));
        } else {
            const dir = directoryUsers.find(u => Number(u.id) === Number(activePartnerId));
            if (dir) {
                setActivePartner(prev => ({ ...(prev || {}), ...dir }));
            }
        }
    }, [conversations, directoryUsers, activePartnerId]);

    // 5. Start new conversation
    const startNewConversation = useCallback(async (user: ConversationUser) => {
        if (!user || !user.id) return;
        const targetId = Number(user.id);

        setConversations(prev => {
            if (prev.some(c => Number(c.user?.id) === targetId)) return prev;
            return [{
                user,
                last_message: null,
                unread_count: 0,
                last_message_at: new Date().toISOString()
            }, ...prev];
        });

        selectPartner(targetId, user);
    }, [selectPartner]);

    // 6. Send a message
    const sendMessage = useCallback(async (payloadOrText: string | SendMessagePayload, maybeFiles?: File[], maybeReplyToId?: number | null): Promise<boolean> => {
        let receiverId = activePartnerId;
        let text = '';
        let files: File[] = [];
        let replyToId: number | null = null;

        if (typeof payloadOrText === 'object' && payloadOrText !== null) {
            receiverId = Number(payloadOrText.receiver_id || activePartnerId);
            text = payloadOrText.message || '';
            files = payloadOrText.attachments || [];
            replyToId = payloadOrText.reply_to_id ? Number(payloadOrText.reply_to_id) : (maybeReplyToId ? Number(maybeReplyToId) : null);
        } else {
            text = String(payloadOrText || '');
            files = maybeFiles || [];
            replyToId = maybeReplyToId ? Number(maybeReplyToId) : null;
        }

        if (!receiverId) return false;
        if (!text.trim() && files.length === 0) return false;

        const tempId = Date.now();
        const now = new Date();
        const formattedTime = formatLocalTime(now.toISOString());

        const tempAttachments: MessageAttachment[] = files.map(file => {
            const isImg = file.type.startsWith('image/');
            const url = URL.createObjectURL(file);
            return {
                name: file.name,
                url: url,
                path: url,
                mime: file.type,
                type: isImg ? 'image' : 'file',
                size: `${Math.round(file.size / 1024)} KB`
            };
        });

        const targetReply = replyToId ? messages.find(m => m.id === Number(replyToId)) : null;

        const optimisticMessage: GeneralMessage = {
            id: tempId,
            sender_id: 0,
            receiver_id: receiverId,
            reply_to_id: replyToId || null,
            reply_to: targetReply ? {
                id: targetReply.id,
                sender_id: targetReply.sender_id,
                message: targetReply.message,
                message_type: targetReply.message_type,
                is_me: targetReply.is_me
            } : null,
            message: text.trim(),
            message_type: tempAttachments.some(a => a.type === 'image') ? 'image' : (tempAttachments.length ? 'file' : 'text'),
            attachments: tempAttachments.length > 0 ? tempAttachments : null,
            is_me: true,
            is_read: false,
            time: formattedTime,
            date: now.toLocaleDateString(),
            created_at_human: 'Just now',
            created_at: now.toISOString()
        };

        setMessages(prev => [...prev, optimisticMessage]);

        const partnerId = receiverId;
        const currentCache = messagesCacheRef.current.get(partnerId) || [];
        messagesCacheRef.current.set(partnerId, [...currentCache, optimisticMessage]);

        setConversations(prev => {
            const existing = prev.find(c => Number(c.user?.id) === partnerId);
            const others = prev.filter(c => Number(c.user?.id) !== partnerId);
            const user = existing?.user || activePartner || {
                id: partnerId,
                name: 'Partner',
                user_type: role === 'supplier' ? 'customer' : 'supplier',
                email: '',
                avatar: '',
                company_name: 'Partner'
            };

            const updatedItem: ConversationPartnerItem = {
                user,
                last_message: {
                    id: tempId,
                    sender_id: 0,
                    message: text.trim() || (files.length ? 'Sent an attachment' : ''),
                    message_type: String(optimisticMessage.message_type),
                    is_me: true,
                    is_read: true,
                    created_at_human: 'Just now',
                    time: formattedTime
                },
                unread_count: 0,
                last_message_at: now.toISOString()
            };

            return [updatedItem, ...others];
        });

        setIsSending(true);

        try {
            const res: any = await messageService.sendMessage({
                receiver_id: partnerId,
                message: text.trim(),
                reply_to_id: replyToId || undefined,
                attachments: files
            });
            const serverMsg = res?.data?.data || res?.data || res;
            const realId = serverMsg?.id ? Number(serverMsg.id) : tempId;
            const rawAttachments = parseRawAttachments(serverMsg);

            setMessages(prev =>
                prev.map(m =>
                    m.id === tempId
                        ? {
                            ...m,
                            id: realId,
                            attachments: rawAttachments.length > 0 ? rawAttachments : m.attachments,
                            created_at_human: serverMsg?.created_at_human || m.created_at_human
                        }
                        : m
                )
            );

            const updatedCache = (messagesCacheRef.current.get(partnerId) || []).map(m =>
                m.id === tempId ? { ...m, id: realId } : m
            );
            messagesCacheRef.current.set(partnerId, updatedCache);

            return true;
        } catch (err) {
            console.error('Failed to send message:', err);
            return false;
        } finally {
            setIsSending(false);
        }
    }, [activePartnerId, activePartner, role]);

    // 7. Edit/Update a message
    const editMessage = useCallback(async (messageId: number | string, newText: string) => {
        const id = Number(messageId);
        const trimmed = newText.trim();
        if (!trimmed) return false;

        // Optimistic update
        setMessages(prev => prev.map(m => m.id === id ? { ...m, message: trimmed, is_edited: true } : m));

        if (activePartnerId) {
            const currentCache = messagesCacheRef.current.get(activePartnerId) || [];
            messagesCacheRef.current.set(
                activePartnerId,
                currentCache.map(m => m.id === id ? { ...m, message: trimmed, is_edited: true } : m)
            );
        }

        try {
            await messageService.updateMessage(id, trimmed);
            return true;
        } catch (err) {
            console.error('Failed to edit message:', err);
            return false;
        }
    }, [activePartnerId]);

    // 8. Delete a message
    const deleteMessage = useCallback(async (messageId: number | string) => {
        try {
            await messageService.deleteMessage(messageId);
            setMessages(prev => prev.filter(m => m.id !== Number(messageId)));

            if (activePartnerId) {
                const currentCache = messagesCacheRef.current.get(activePartnerId) || [];
                messagesCacheRef.current.set(activePartnerId, currentCache.filter(m => m.id !== Number(messageId)));
            }

            return true;
        } catch (err) {
            console.error('Failed to delete message:', err);
            return false;
        }
    }, [activePartnerId]);


    // 9. Toggle message reaction
    const toggleReaction = useCallback((messageId: number | string, emoji: string) => {
        const id = Number(messageId);
        setMessages(prev => prev.map(m => {
            if (m.id === id) {
                const currentReaction = (m as any).reaction;
                const newReaction = currentReaction === emoji ? null : emoji;
                return { ...m, reaction: newReaction };
            }
            return m;
        }));
    }, []);

    // 10. Toggle pin message (Dynamic backend persistence)
    const togglePin = useCallback(async (messageId: number | string) => {
        const id = Number(messageId);
        
        // Optimistic update
        setMessages(prev => prev.map(m => m.id === id ? { ...m, is_pinned: !m.is_pinned } : m));

        if (activePartnerId) {
            const currentCache = messagesCacheRef.current.get(activePartnerId) || [];
            messagesCacheRef.current.set(
                activePartnerId,
                currentCache.map(m => m.id === id ? { ...m, is_pinned: !m.is_pinned } : m)
            );
        }

        try {
            const res: any = await messageService.togglePin(id);
            const serverMsg = res?.data?.data || res?.data || res;
            if (serverMsg && typeof serverMsg === 'object' && 'is_pinned' in serverMsg) {
                const serverPinned = Boolean(serverMsg.is_pinned);
                setMessages(prev => prev.map(m => m.id === id ? { ...m, is_pinned: serverPinned, pinned_at: serverMsg.pinned_at || m.pinned_at } : m));
                if (activePartnerId) {
                    const currentCache = messagesCacheRef.current.get(activePartnerId) || [];
                    messagesCacheRef.current.set(
                        activePartnerId,
                        currentCache.map(m => m.id === id ? { ...m, is_pinned: serverPinned, pinned_at: serverMsg.pinned_at || m.pinned_at } : m)
                    );
                }
            }
            return true;
        } catch (err) {
            console.error('Failed to toggle pin:', err);
            // Revert on error
            setMessages(prev => prev.map(m => m.id === id ? { ...m, is_pinned: !m.is_pinned } : m));
            return false;
        }
    }, [activePartnerId]);

    // Initialize data on mount
    useEffect(() => {
        fetchConversations(true);
        fetchDirectoryUsers();
    }, [fetchConversations, fetchDirectoryUsers]);

    // Polling / auto-refresh every 20 seconds silently
    useEffect(() => {
        const interval = setInterval(() => {
            fetchConversations(true);
            if (activePartnerIdRef.current) {
                fetchMessages(activePartnerIdRef.current, true);
            }
        }, 20000);

        return () => clearInterval(interval);
    }, [fetchConversations, fetchMessages]);

    // Fetch messages when initialPartnerId changes
    useEffect(() => {
        if (initialRawId) {
            selectPartner(initialRawId);
        }
    }, [initialRawId, selectPartner]);

    const isChatLoaded = activePartnerId ? loadedPartnerIds.has(activePartnerId) : false;

    return {
        conversations,
        directoryUsers,
        unreadCount,
        isLoadingConversations,
        isLoadingDirectory,
        isLoadingMessages,
        isChatLoaded,
        isSending,
        activePartnerId,
        activePartner,
        messages,
        selectPartner,
        startNewConversation,
        fetchConversations,
        fetchDirectoryUsers,
        fetchMessages,
        sendMessage,
        editMessage,
        deleteMessage,
        toggleReaction,
        togglePin
    };
};

export default useGeneralMessages;
