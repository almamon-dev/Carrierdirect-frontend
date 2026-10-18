import apiClient from '@/lib/axios';
import { initialDriverConversations, initialChatMessages } from '../Chat/data/chatData';
import { initialDriverNotifications } from '../Notifications/data/notificationsData';
import { DriverChatMessage, DriverNotification } from '../types';

export const driverChatNotificationService = {
    async getConversations() {
        try {
            const res = await apiClient.get('/messages/conversations');
            const data = res.data?.data || res.data || res;
            if (data && Array.isArray(data)) return data;
        } catch (err) {
            // fallback
        }
        return initialDriverConversations;
    },

    async getMessages(conversationId: string): Promise<DriverChatMessage[]> {
        try {
            const res = await apiClient.get('/messages/with/' + conversationId);
            const data = res.data?.data || res.data || res;
            if (data && Array.isArray(data)) return data;
        } catch (err) {
            // fallback
        }
        return initialChatMessages[conversationId] || [];
    },

    async sendMessage(
        conversationId: string,
        messageText: string,
        type: DriverChatMessage['type'] = 'text'
    ): Promise<DriverChatMessage> {
        try {
            const res = await apiClient.post('/messages/send', {
                receiver_id: conversationId,
                message: messageText,
                type,
            });
            if (res.data?.data) return res.data.data;
        } catch (err) {
            // fallback
        }
        return {
            id: 'msg-' + Date.now(),
            senderId: 'DRV-9872',
            senderName: 'Driver',
            senderRole: 'driver',
            message: messageText,
            type,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isMe: true,
            status: 'sent',
        };
    },

    async getNotifications(): Promise<DriverNotification[]> {
        try {
            const res = await apiClient.get('/notifications');
            const data = res.data?.data || res.data || res;
            if (data && Array.isArray(data)) return data;
        } catch (err) {
            // fallback
        }
        return initialDriverNotifications;
    },

    async markNotificationAsRead(id: string): Promise<DriverNotification[]> {
        try {
            await apiClient.post('/notifications/' + id + '/read');
        } catch (err) {
            // fallback
        }
        return this.getNotifications();
    },

    async markAllNotificationsRead(): Promise<DriverNotification[]> {
        try {
            await apiClient.post('/notifications/read-all');
        } catch (err) {
            // fallback
        }
        return this.getNotifications();
    },
};
