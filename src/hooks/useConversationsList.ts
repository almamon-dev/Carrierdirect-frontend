import { useState, useCallback } from 'react';
import messageService, {
    ConversationPartnerItem,
    ConversationUser,
} from '@/services/messageService';
import { normalizeConversationItem } from './generalMessageHelpers';

interface UseConversationsListProps {
    role?: 'supplier' | 'customer' | string;
}

export const useConversationsList = ({ role }: UseConversationsListProps) => {
    const [conversations, setConversations] = useState<ConversationPartnerItem[]>([]);
    const [directoryUsers, setDirectoryUsers] = useState<ConversationUser[]>([]);
    const [unreadCount, setUnreadCount] = useState<number>(0);
    const [isLoadingConversations, setIsLoadingConversations] = useState<boolean>(true);
    const [isLoadingDirectory, setIsLoadingDirectory] = useState<boolean>(false);

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

    const fetchConversations = useCallback(async (silent = true) => {
        if (!silent) setIsLoadingConversations(true);
        try {
            const [convRes, countRes]: [any, any] = await Promise.all([
                messageService.getConversations().catch(() => ({ data: [] })),
                messageService.getUnreadCount().catch(() => ({ data: { unread_count: 0 } })),
            ]);

            const rawList: any[] = Array.isArray(convRes?.data?.data)
                ? convRes.data.data
                : Array.isArray(convRes?.data)
                ? convRes.data
                : Array.isArray(convRes?.data?.items)
                ? convRes.data.items
                : [];

            const list: ConversationPartnerItem[] = rawList.map(normalizeConversationItem);

            setConversations((prev) => {
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

    return {
        conversations,
        setConversations,
        directoryUsers,
        unreadCount,
        isLoadingConversations,
        isLoadingDirectory,
        fetchDirectoryUsers,
        fetchConversations,
    };
};
