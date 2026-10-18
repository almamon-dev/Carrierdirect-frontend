import { apiClient } from '@/lib/axios';
import {
    MessageAttachment,
    GeneralMessage,
    ConversationUser,
    ConversationPartnerItem,
    SendMessagePayload,
    extractMessagesArray,
    mapRawDirectoryUser,
} from './messageTypes';

export type {
    MessageAttachment,
    GeneralMessage,
    ConversationUser,
    ConversationPartnerItem,
    SendMessagePayload,
};
export { extractMessagesArray, mapRawDirectoryUser };

export const messageService = {
    async sendHeartbeat() {
        try {
            return await apiClient.post('/user/heartbeat', {});
        } catch {
            try {
                return await apiClient.post('/messages/heartbeat', {});
            } catch {
                return null;
            }
        }
    },

    async getConversations(page: number = 1, perPage: number = 20) {
        try {
            return await apiClient.get('/messages/conversations', {
                params: { page, per_page: perPage },
                silent: true,
            });
        } catch {
            return { data: [] };
        }
    },

    async startConversation(recipientId: number) {
        try {
            return await apiClient.post('/messages/conversations/start', {
                recipient_id: recipientId,
                receiver_id: recipientId,
                user_id: recipientId,
            });
        } catch {
            try {
                return await apiClient.post('/messages/start', {
                    recipient_id: recipientId,
                    receiver_id: recipientId,
                });
            } catch {
                return { data: { success: true } };
            }
        }
    },

    async getMessages(partnerId: number | string, page: number = 1) {
        const id = String(partnerId);

        try {
            const res: any = await apiClient.get(`/messages/conversations/${id}`, { params: { page }, silent: true });
            if (res?.data || res?.messages) return res;
        } catch {}

        try {
            const res: any = await apiClient.get(`/messages/${id}`, { params: { page }, silent: true });
            if (res?.data || res?.messages) return res;
        } catch {}

        try {
            const res: any = await apiClient.get(`/messages/user/${id}`, { params: { page }, silent: true });
            if (res?.data || res?.messages) return res;
        } catch {}

        return { data: [] };
    },

    async sendMessage(payload: SendMessagePayload | FormData) {
        if (payload instanceof FormData) {
            return await apiClient.post('/messages/send', payload);
        }

        const receiverId = Number(payload.receiver_id);
        const text = payload.message || '';
        const hasAttachments = Boolean(payload.attachments && payload.attachments.length > 0);

        if (!hasAttachments) {
            return await apiClient.post('/messages/send', {
                receiver_id: receiverId,
                message: text,
                ...(payload.reply_to_id ? { reply_to_id: payload.reply_to_id } : {}),
            });
        }

        const fd = new FormData();
        fd.append('receiver_id', String(receiverId));
        if (text) {
            fd.append('message', text);
        }
        if (payload.reply_to_id) {
            fd.append('reply_to_id', String(payload.reply_to_id));
        }
        if (payload.attachments) {
            payload.attachments.forEach((file) => {
                fd.append('attachments[]', file);
            });
        }

        return await apiClient.post('/messages/send', fd);
    },

    async markAsRead(partnerId: number | string) {
        try {
            return await apiClient.post(`/messages/conversations/${partnerId}/read`);
        } catch {
            try {
                return await apiClient.post(`/messages/user/${partnerId}/read`);
            } catch {
                return null;
            }
        }
    },

    async updateMessage(messageId: number | string, newText: string) {
        return apiClient.put(`/messages/${messageId}`, { message: newText });
    },

    async deleteMessage(messageId: number | string, type: 'everyone' | 'for_me' = 'everyone') {
        return apiClient.delete(`/messages/${messageId}`, { params: { type } });
    },

    async togglePin(messageId: number | string) {
        return apiClient.patch(`/messages/${messageId}/pin`);
    },

    async getUnreadCount() {
        return apiClient.get('/messages/unread-count');
    },

    async getDirectoryUsers(currentRole?: 'supplier' | 'customer' | string): Promise<ConversationUser[]> {
        try {
            const targetRole = currentRole === 'customer' ? 'supplier' : currentRole === 'supplier' ? 'customer' : currentRole;
            const res: any = await apiClient.get('/messages/users', {
                params: currentRole
                    ? {
                          role: targetRole,
                          user_type: targetRole,
                          current_role: currentRole,
                      }
                    : undefined,
                silent: true,
            });
            const list = Array.isArray(res?.data?.data) ? res.data.data : Array.isArray(res?.data) ? res.data : [];
            return list.map(mapRawDirectoryUser);
        } catch (err) {
            console.error('Error fetching /messages/users:', err);
            return [];
        }
    },
};

export default messageService;
