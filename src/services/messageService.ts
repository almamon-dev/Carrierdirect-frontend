import { apiClient } from '@/lib/axios';

export interface MessageAttachment {
    name: string;
    url: string;
    size?: string;
    type?: 'image' | 'file' | string;
    mime?: string;
    path?: string;
}

export interface GeneralMessage {
    id: number;
    sender_id: number;
    receiver_id: number;
    message: string | null;
    message_type: 'text' | 'image' | 'file' | string;
    attachments?: MessageAttachment[] | null;
    is_me: boolean;
    is_read: boolean;
    read_at?: string | null;
    time?: string | null;
    date?: string | null;
    created_at_human?: string;
    created_at?: string;
}

export interface ConversationUser {
    id: number;
    name: string;
    user_type?: 'customer' | 'supplier' | 'admin' | string;
    email?: string;
    avatar?: string;
    company_name?: string;
}

export interface ConversationPartnerItem {
    user: ConversationUser;
    last_message?: {
        id: number;
        sender_id: number;
        message: string | null;
        message_type: string;
        is_me: boolean;
        is_read: boolean;
        created_at_human?: string;
        time?: string;
    } | null;
    unread_count: number;
    last_message_at?: string | null;
}

export interface SendMessagePayload {
    receiver_id: number;
    message?: string;
    attachments?: File[];
}

export const extractMessagesArray = (res: any): any[] | null => {
    if (!res) return null;
    if (Array.isArray(res)) return res;
    if (Array.isArray(res.data)) return res.data;
    if (Array.isArray(res.messages)) return res.messages;
    if (Array.isArray(res.items)) return res.items;
    if (Array.isArray(res.data?.data)) return res.data.data;
    if (Array.isArray(res.data?.messages)) return res.data.messages;
    if (Array.isArray(res.data?.items)) return res.data.items;
    if (Array.isArray(res.conversation?.messages)) return res.conversation.messages;
    if (Array.isArray(res.data?.conversation?.messages)) return res.data.conversation.messages;
    return null;
};

export const messageService = {
    /**
     * Get paginated conversations list
     */
    async getConversations(page: number = 1, perPage: number = 20) {
        try {
            return await apiClient.get('/messages/conversations', {
                params: { page, per_page: perPage },
                silent: true
            });
        } catch {
            return { data: [] };
        }
    },

    /**
     * Start/Open a conversation with a specific user
     */
    async startConversation(recipientId: number) {
        try {
            return await apiClient.post('/messages/conversations/start', {
                recipient_id: recipientId,
                receiver_id: recipientId,
                user_id: recipientId
            });
        } catch {
            try {
                return await apiClient.post('/messages/start', {
                    recipient_id: recipientId,
                    receiver_id: recipientId
                });
            } catch {
                return { data: { success: true } };
            }
        }
    },

    /**
     * Get messages between authenticated user and partner
     */
    async getMessages(partnerId: number | string, page: number = 1) {
        const id = String(partnerId);

        // 1. Direct conversation endpoint
        try {
            const res: any = await apiClient.get(`/messages/conversations/${id}`, { params: { page }, silent: true });
            if (res?.data || res?.messages) return res;
        } catch {}

        // 2. Direct user messages endpoint
        try {
            const res: any = await apiClient.get(`/messages/${id}`, { params: { page }, silent: true });
            if (res?.data || res?.messages) return res;
        } catch {}

        // 3. Platform fallback
        try {
            const res: any = await apiClient.get(`/messages/user/${id}`, { params: { page }, silent: true });
            if (res?.data || res?.messages) return res;
        } catch {}

        return { data: [] };
    },

    /**
     * Send a new message (supports JSON for clean text and FormData for file attachments)
     */
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
                message: text
            });
        }

        const fd = new FormData();
        fd.append('receiver_id', String(receiverId));
        if (text) {
            fd.append('message', text);
        }
        if (payload.attachments) {
            payload.attachments.forEach(file => {
                fd.append('attachments[]', file);
            });
        }

        return await apiClient.post('/messages/send', fd);
    },

    /**
     * Mark all messages in conversation as read
     */
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

    /**
     * Soft delete a message
     */
    async deleteMessage(messageId: number | string) {
        return apiClient.delete(`/messages/${messageId}`);
    },

    /**
     * Get total unread messages count
     */
    async getUnreadCount() {
        return apiClient.get('/messages/unread-count');
    },

    /**
     * Fetch users/companies from live platform endpoints
     */
    async getDirectoryUsers(currentRole?: 'supplier' | 'customer' | string): Promise<ConversationUser[]> {
        const usersMap = new Map<number, ConversationUser>();

        // 1. Fetch from direct backend endpoint /messages/users with role parameters
        try {
            const res: any = await apiClient.get('/messages/users', {
                params: {
                    role: currentRole,
                    target_role: currentRole === 'supplier' ? 'customer' : 'supplier'
                },
                silent: true
            });
            const list = Array.isArray(res?.data?.data) ? res.data.data : Array.isArray(res?.data) ? res.data : [];
            list.forEach((u: any) => {
                if (u && u.id) {
                    const uType = (u.user_type || u.role || '').toLowerCase();
                    const email = (u.email || '').toLowerCase();
                    const name = (u.name || u.display_name || '').toLowerCase();
                    const isAdmin = uType.includes('admin') || email.includes('admin@') || name.includes('admin') || u.is_admin === true || u.is_admin === 1;
                    if (isAdmin) return; // Never include admin accounts

                    if (currentRole === 'supplier') {
                        if (uType.includes('supplier') || uType.includes('carrier')) return;
                    } else if (currentRole === 'customer') {
                        if (uType.includes('customer') || uType.includes('shipper')) return;
                    }

                    usersMap.set(Number(u.id), {
                        id: Number(u.id),
                        name: u.display_name || u.company_name || u.name || 'User',
                        company_name: u.company_name || u.display_name || '',
                        user_type: uType.includes('supplier') || uType.includes('carrier') ? 'supplier' : 'customer',
                        email: u.email || '',
                        avatar: u.avatar || ''
                    });
                }
            });
            if (usersMap.size > 0) {
                return Array.from(usersMap.values());
            }
        } catch {}

        // 2. Fallback to platform endpoints
        try {
            if (currentRole === 'supplier') {
                const reqRes: any = await apiClient.get('/supplier/available-requests', { silent: true }).catch(() => null);
                const requests = Array.isArray(reqRes?.data?.data)
                    ? reqRes.data.data
                    : Array.isArray(reqRes?.data)
                    ? reqRes.data
                    : [];

                requests.forEach((r: any) => {
                    const userObj = r.user || r.customer;
                    if (userObj && userObj.id) {
                        usersMap.set(Number(userObj.id), {
                            id: Number(userObj.id),
                            name: userObj.name || userObj.company_name || 'Customer',
                            company_name: userObj.company_name || userObj.profile?.company_name || '',
                            user_type: 'customer',
                            email: userObj.email || '',
                            avatar: userObj.profile?.profile_picture || userObj.avatar || ''
                        });
                    }
                });
            } else {
                const negRes: any = await apiClient.get('/customer/negotiations', { silent: true }).catch(() => null);
                const negotiations = Array.isArray(negRes?.data?.data?.negotiations?.data)
                    ? negRes.data.data.negotiations.data
                    : Array.isArray(negRes?.data?.negotiations?.data)
                    ? negRes.data.negotiations.data
                    : Array.isArray(negRes?.data?.data)
                    ? negRes.data.data
                    : Array.isArray(negRes?.data)
                    ? negRes.data
                    : [];

                negotiations.forEach((n: any) => {
                    const supObj = n.supplier || n.user;
                    const supId = supObj?.id || n.supplier_id || n.sender_id;
                    if (supId) {
                        usersMap.set(Number(supId), {
                            id: Number(supId),
                            name: supObj?.name || n.supplier_name || n.company_name || 'Carrier Partner',
                            company_name: supObj?.company_name || n.company_name || '',
                            user_type: 'supplier',
                            email: supObj?.email || '',
                            avatar: supObj?.avatar || ''
                        });
                    }
                });
            }
        } catch {}

        return Array.from(usersMap.values());
    }
};

export default messageService;
