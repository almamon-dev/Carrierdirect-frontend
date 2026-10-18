import React from 'react';
import apiClient from '@/lib/axios';
import { ChatMessage } from '../types';

interface UseChatMessageMutationActionsProps {
    activeRawId: string | number;
    updateMessagesForChat: (chatId: number | string, updater: (prev: ChatMessage[]) => ChatMessage[]) => void;
    editingMsgId: number | string | null;
    setEditingMsgId: (id: number | string | null) => void;
    setEditingText: (text: string) => void;
    setInputValue: (val: string) => void;
    notifyTyping: (isTyping?: boolean) => void;
    scrollToBottom: () => void;
}

export function useChatMessageMutationActions({
    activeRawId,
    updateMessagesForChat,
    editingMsgId,
    setEditingMsgId,
    setEditingText,
    setInputValue,
    notifyTyping,
    scrollToBottom,
}: UseChatMessageMutationActionsProps) {
    const handleSendMessage = async (text: string, files?: File[]) => {
        const hasText = Boolean(text && text.trim());
        const hasFiles = Boolean(files && files.length > 0);
        if (!hasText && !hasFiles) return;

        notifyTyping(false);

        if (editingMsgId) {
            const targetEditId = editingMsgId;
            updateMessagesForChat(activeRawId, (prev) =>
                prev.map((m) => (m.id === targetEditId ? { ...m, text, isEdited: true } : m))
            );
            setEditingMsgId(null);
            setEditingText('');
            setInputValue('');

            if (typeof targetEditId === 'number' || (typeof targetEditId === 'string' && /^\d+$/.test(targetEditId))) {
                try {
                    await apiClient
                        .patch(`/negotiations/${activeRawId}/messages/${targetEditId}`, { message: text })
                        .catch(() => apiClient.put(`/negotiations/${activeRawId}/messages/${targetEditId}`, { message: text }).catch(() => {}));
                } catch {}
            }
            return;
        }

        const localAttachments = hasFiles
            ? files!.map((f) => ({
                  name: f.name,
                  size: f.size > 1048576 ? `${(f.size / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(f.size / 1024))} kB`,
                  type: f.type.startsWith('image/') ? ('image' as const) : ('file' as const),
                  url: URL.createObjectURL(f),
              }))
            : undefined;

        const newMsg: ChatMessage = {
            id: `msg-${Date.now()}`,
            type: 'sent',
            text: text || '',
            attachments: localAttachments,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            seen: false,
            isRead: false,
            deliveryStatus: 'sent',
        };
        updateMessagesForChat(activeRawId, (prev) => [...prev, newMsg]);
        setInputValue('');
        setTimeout(scrollToBottom, 100);

        try {
            const formData = new FormData();
            formData.append('quote_id', String(activeRawId));
            formData.append('negotiation_id', String(activeRawId));
            formData.append('message', text || '');
            formData.append('text', text || '');
            if (hasFiles) files!.forEach((f) => formData.append('attachments[]', f));
            await apiClient
                .post(`/supplier/negotiations/${activeRawId}/messages`, formData)
                .catch(() => apiClient.post(`/negotiations/${activeRawId}/messages`, formData));
        } catch {}
    };

    const handleTogglePinMessage = async (msgId: number | string) => {
        updateMessagesForChat(activeRawId, (prev) =>
            prev.map((m) => (m.id === msgId ? { ...m, isPinned: !m.isPinned } : m))
        );

        if (typeof msgId === 'number' || (typeof msgId === 'string' && /^\d+$/.test(msgId))) {
            try {
                await apiClient
                    .post(`/supplier/negotiations/${activeRawId}/messages/${msgId}/pin`)
                    .catch(() =>
                        apiClient
                            .post(`/negotiations/${activeRawId}/messages/${msgId}/pin`)
                            .catch(() => apiClient.post(`/negotiations/messages/${msgId}/pin`).catch(() => {}))
                    );
            } catch {}
        }
    };

    const handleDeleteMessage = async (msgId: number | string) => {
        updateMessagesForChat(activeRawId, (prev) =>
            prev.map((m) => (m.id === msgId ? { ...m, isDeleted: true, isPinned: false } : m))
        );

        if (typeof msgId === 'number' || (typeof msgId === 'string' && /^\d+$/.test(msgId))) {
            try {
                await apiClient
                    .delete(`/negotiations/${activeRawId}/messages/${msgId}`)
                    .catch(() => apiClient.post(`/negotiations/${activeRawId}/messages/${msgId}/delete`).catch(() => {}));
            } catch {}
        }
    };

    return {
        handleSendMessage,
        handleTogglePinMessage,
        handleDeleteMessage,
    };
}
