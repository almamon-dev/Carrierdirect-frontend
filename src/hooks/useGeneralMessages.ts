import { useState, useEffect, useCallback, useRef } from 'react';
import messageService, { GeneralMessage, ConversationUser, extractMessagesArray } from '@/services/messageService';
import { parseRawAttachments, decodePartnerId, normalizeGeneralMessage } from './generalMessageHelpers';
import { useConversationsList } from './useConversationsList';
import { useSendMessageAction } from './useSendMessageAction';
import { useMessageModificationActions } from './useMessageModificationActions';
import { echo } from '@/lib/echo';
import { TOKEN_CONFIG } from '@/config/auth';

export { parseRawAttachments, decodePartnerId };

function getAuthUserId(): number | null {
    try {
        const raw = localStorage.getItem(TOKEN_CONFIG.userKey);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        return parsed?.id || parsed?.user?.id || null;
    } catch {
        return null;
    }
}

export const useGeneralMessages = (
    initialPartnerId?: number | string | null,
    role?: 'supplier' | 'customer' | string
) => {
    const initialRawId = decodePartnerId(initialPartnerId);

    const {
        conversations,
        setConversations,
        directoryUsers,
        unreadCount,
        isLoadingConversations,
        isLoadingDirectory,
        fetchDirectoryUsers,
        fetchConversations,
    } = useConversationsList({ role });

    const [activePartnerId, setActivePartnerId] = useState<number | null>(initialRawId || null);
    const [activePartner, setActivePartner] = useState<ConversationUser | null>(null);
    const [messages, setMessages] = useState<GeneralMessage[]>([]);
    const [isLoadingMessages, setIsLoadingMessages] = useState<boolean>(Boolean(initialRawId));
    const [loadedPartnerIds, setLoadedPartnerIds] = useState<Set<number>>(new Set());
    const [isSending, setIsSending] = useState<boolean>(false);

    const activePartnerIdRef = useRef<number | null>(activePartnerId);
    activePartnerIdRef.current = activePartnerId;
    const messagesCacheRef = useRef<Map<number, GeneralMessage[]>>(new Map());

    const fetchMessages = useCallback(async (partnerId: number | string, silent = true) => {
        if (!partnerId) return;
        const cleanId = decodePartnerId(partnerId);
        if (!cleanId) return;

        if (!silent) setIsLoadingMessages(true);
        try {
            const res: any = await messageService.getMessages(cleanId);
            const rawMsgs = extractMessagesArray(res) || [];
            const normalized: GeneralMessage[] = rawMsgs.map((m: any, idx: number) => normalizeGeneralMessage(m, idx, cleanId));

            messagesCacheRef.current.set(cleanId, normalized);
            if (activePartnerIdRef.current === cleanId) {
                setMessages(prev => {
                    if (prev.length === normalized.length && prev[prev.length - 1]?.id === normalized[normalized.length - 1]?.id) {
                        return prev; // Prevent unnecessary re-render
                    }
                    return normalized;
                });
                setLoadedPartnerIds((prev) => new Set(prev).add(cleanId));
            }
        } catch (err) {
            console.error(`Failed to fetch messages for partner ${cleanId}:`, err);
        } finally {
            setIsLoadingMessages(false);
        }
    }, []);

    const selectPartner = useCallback((partnerId: number | string, userObj?: ConversationUser) => {
        const cleanId = decodePartnerId(partnerId);
        if (!cleanId) return;

        const isSamePartner = activePartnerIdRef.current === cleanId;
        setActivePartnerId(cleanId);
        activePartnerIdRef.current = cleanId;
        if (userObj) setActivePartner(userObj);

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
            setIsLoadingMessages(true);
            fetchMessages(cleanId, false);
        }
    }, [fetchMessages]);

    useEffect(() => {
        if (!activePartnerId) return;
        const found = conversations.find((c) => Number(c.user?.id) === Number(activePartnerId));
        if (found?.user) {
            setActivePartner((prev) => ({ ...(prev || {}), ...found.user }));
        } else {
            const dir = directoryUsers.find((u) => Number(u.id) === Number(activePartnerId));
            if (dir) setActivePartner((prev) => ({ ...(prev || {}), ...dir }));
        }
    }, [conversations, directoryUsers, activePartnerId]);

    const startNewConversation = useCallback(async (user: ConversationUser) => {
        if (!user || !user.id) return;
        const targetId = Number(user.id);
        setConversations((prev) => {
            if (prev.some((c) => Number(c.user?.id) === targetId)) return prev;
            return [{ user, last_message: null, unread_count: 0, last_message_at: new Date().toISOString() }, ...prev];
        });
        selectPartner(targetId, user);
    }, [selectPartner, setConversations]);

    const { sendMessage } = useSendMessageAction({
        activePartnerId,
        activePartner,
        role,
        messages,
        setMessages,
        setConversations,
        setIsSending,
        messagesCacheRef,
    });

    const { editMessage, deleteMessage, toggleReaction, togglePin } = useMessageModificationActions({
        activePartnerId,
        setMessages,
        messagesCacheRef,
    });

    useEffect(() => {
        fetchConversations(false);
        fetchDirectoryUsers();
    }, [fetchConversations, fetchDirectoryUsers]);

    // Live WebSocket Subscription for Direct Messages
    useEffect(() => {
        const userId = getAuthUserId();
        if (!userId) return;

        try {
            const channel = echo.private(`App.Models.User.${userId}`);
            channel.listen('.general.message.sent', (e: any) => {
                fetchConversations(true);
                if (activePartnerIdRef.current) {
                    fetchMessages(activePartnerIdRef.current, true);
                }
            });

            return () => {
                channel.stopListening('.general.message.sent');
            };
        } catch (err) {
            console.warn('Echo general message channel error:', err);
        }
    }, [fetchConversations, fetchMessages]);

    // Fallback polling relaxed to 60s
    useEffect(() => {
        const interval = setInterval(() => {
            fetchConversations(true);
            if (activePartnerIdRef.current) fetchMessages(activePartnerIdRef.current, true);
        }, 60000);
        return () => clearInterval(interval);
    }, [fetchConversations, fetchMessages]);

    useEffect(() => {
        if (initialRawId) selectPartner(initialRawId);
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
        togglePin,
    };
};

export default useGeneralMessages;
