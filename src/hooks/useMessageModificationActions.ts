import { useCallback } from 'react';
import messageService, { GeneralMessage } from '@/services/messageService';

interface UseMessageModificationActionsProps {
    activePartnerId: number | null;
    setMessages: React.Dispatch<React.SetStateAction<GeneralMessage[]>>;
    messagesCacheRef: React.MutableRefObject<Map<number, GeneralMessage[]>>;
}

export const useMessageModificationActions = ({
    activePartnerId,
    setMessages,
    messagesCacheRef,
}: UseMessageModificationActionsProps) => {
    const editMessage = useCallback(
        async (messageId: number | string, newText: string) => {
            const id = Number(messageId);
            const trimmed = newText.trim();
            if (!trimmed) return false;

            setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, message: trimmed, is_edited: true } : m)));

            if (activePartnerId) {
                const currentCache = messagesCacheRef.current.get(activePartnerId) || [];
                messagesCacheRef.current.set(
                    activePartnerId,
                    currentCache.map((m) => (m.id === id ? { ...m, message: trimmed, is_edited: true } : m))
                );
            }

            try {
                await messageService.updateMessage(id, trimmed);
                return true;
            } catch (err) {
                console.error('Failed to edit message:', err);
                return false;
            }
        },
        [activePartnerId, setMessages, messagesCacheRef]
    );

    const deleteMessage = useCallback(
        async (messageId: number | string, type: 'everyone' | 'for_me' = 'everyone') => {
            try {
                await messageService.deleteMessage(messageId, type);

                if (type === 'everyone') {
                    setMessages((prev) => prev.map((m) => (m.id === Number(messageId) ? { ...m, is_unsent: true, message: null, attachments: null } : m)));
                    if (activePartnerId) {
                        const currentCache = messagesCacheRef.current.get(activePartnerId) || [];
                        messagesCacheRef.current.set(
                            activePartnerId,
                            currentCache.map((m) => (m.id === Number(messageId) ? { ...m, is_unsent: true, message: null, attachments: null } : m))
                        );
                    }
                } else {
                    setMessages((prev) => prev.filter((m) => m.id !== Number(messageId)));
                    if (activePartnerId) {
                        const currentCache = messagesCacheRef.current.get(activePartnerId) || [];
                        messagesCacheRef.current.set(
                            activePartnerId,
                            currentCache.filter((m) => m.id !== Number(messageId))
                        );
                    }
                }

                return true;
            } catch (err) {
                console.error('Failed to delete message:', err);
                return false;
            }
        },
        [activePartnerId, setMessages, messagesCacheRef]
    );

    const toggleReaction = useCallback(
        (messageId: number | string, emoji: string) => {
            const id = Number(messageId);
            setMessages((prev) =>
                prev.map((m) => {
                    if (m.id === id) {
                        const currentReaction = (m as any).reaction;
                        return { ...m, reaction: currentReaction === emoji ? null : emoji };
                    }
                    return m;
                })
            );
        },
        [setMessages]
    );

    const togglePin = useCallback(
        async (messageId: number | string) => {
            const id = Number(messageId);
            setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, is_pinned: !m.is_pinned } : m)));

            if (activePartnerId) {
                const currentCache = messagesCacheRef.current.get(activePartnerId) || [];
                messagesCacheRef.current.set(
                    activePartnerId,
                    currentCache.map((m) => (m.id === id ? { ...m, is_pinned: !m.is_pinned } : m))
                );
            }

            try {
                const res: any = await messageService.togglePin(id);
                const serverMsg = res?.data?.data || res?.data || res;
                if (serverMsg && typeof serverMsg === 'object' && 'is_pinned' in serverMsg) {
                    const serverPinned = Boolean(serverMsg.is_pinned);
                    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, is_pinned: serverPinned, pinned_at: serverMsg.pinned_at || m.pinned_at } : m)));
                    if (activePartnerId) {
                        const currentCache = messagesCacheRef.current.get(activePartnerId) || [];
                        messagesCacheRef.current.set(
                            activePartnerId,
                            currentCache.map((m) => (m.id === id ? { ...m, is_pinned: serverPinned, pinned_at: serverMsg.pinned_at || m.pinned_at } : m))
                        );
                    }
                }
                return true;
            } catch (err) {
                console.error('Failed to toggle pin:', err);
                setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, is_pinned: !m.is_pinned } : m)));
                return false;
            }
        },
        [activePartnerId, setMessages, messagesCacheRef]
    );

    return {
        editMessage,
        deleteMessage,
        toggleReaction,
        togglePin,
    };
};
