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
    reply_to_id?: number | null;
    reply_to?: {
        id: number;
        sender_id: number;
        message: string | null;
        message_type: string;
        is_me?: boolean;
    } | null;
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
    is_edited?: boolean;
    is_pinned?: boolean;
    pinned_at?: string | null;
    updated_at?: string | null;
}

export interface ConversationUser {
    id: number;
    name: string;
    user_type?: 'customer' | 'supplier' | 'admin' | string;
    email?: string;
    avatar?: string;
    company_name?: string;
    is_verified?: boolean;
    is_online?: boolean;
    last_seen_at?: string | null;
    last_seen_human?: string;
    parent_id?: number | null;
    parent_user_id?: number | null;
    supplier_id?: number | null;
    created_by?: number | null;
    is_team_member?: boolean | number | string;
    is_member?: boolean | number;
    is_sub_user?: boolean | number;
    is_sub_account?: boolean | number;
    is_admin?: boolean | number;
    role?: any;
    department?: string;
    designation?: string;
    assigned_vehicle?: string;
    assignedVehicle?: string;
    team_id?: any;
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
    reply_to_id?: number | null;
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
     * Send heartbeat to keep user online status active
     */
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
                message: text,
                ...(payload.reply_to_id ? { reply_to_id: payload.reply_to_id } : {})
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
     * Update/Edit an existing message
     */
    async updateMessage(messageId: number | string, newText: string) {
        return apiClient.put(`/messages/${messageId}`, { message: newText });
    },

    /**
     * Soft delete a message
     */
    async deleteMessage(messageId: number | string) {
        return apiClient.delete(`/messages/${messageId}`);
    },

    /**
     * Toggle pin message status (Dynamic backend persistence)
     */
    async togglePin(messageId: number | string) {
        return apiClient.patch(`/messages/${messageId}/pin`);
    },

    /**
     * Get total unread messages count
     */
    async getUnreadCount() {
        return apiClient.get('/messages/unread-count');
    },

    /**
     * Fetch users/companies directly from backend endpoint (/messages/users)
     */
    async getDirectoryUsers(currentRole?: 'supplier' | 'customer' | string): Promise<ConversationUser[]> {
        try {
            const targetRole = currentRole === 'customer' ? 'supplier' : currentRole === 'supplier' ? 'customer' : currentRole;
            const res: any = await apiClient.get('/messages/users', {
                params: currentRole ? {
                    role: targetRole,
                    user_type: targetRole,
                    current_role: currentRole
                } : undefined,
                silent: true
            });
            const list = Array.isArray(res?.data?.data) ? res.data.data : Array.isArray(res?.data) ? res.data : [];
            return list.map((u: any) => ({
                id: Number(u.id),
                name: u.company_name || u.display_name || u.name || 'User',
                company_name: u.company_name || u.display_name || '',
                user_type: u.user_type || (typeof u.role === 'string' ? u.role : u.role?.name) || 'user',
                email: u.email || '',
                avatar: u.avatar || u.profile?.profile_picture || '',
                is_verified: Boolean(u.is_verified ?? u.profile?.is_verified ?? u.email_verified_at),
                is_online: Boolean(u.is_online),
                last_seen_at: u.last_seen_at || null,
                last_seen_human: u.last_seen_human || (u.is_online ? 'Active Now' : 'Offline'),
                parent_id: u.parent_id,
                parent_user_id: u.parent_user_id,
                supplier_id: u.supplier_id,
                created_by: u.created_by,
                is_team_member: u.is_team_member,
                is_member: u.is_member,
                is_sub_user: u.is_sub_user,
                is_sub_account: u.is_sub_account,
                is_admin: u.is_admin,
                role: u.role,
                department: u.department,
                designation: u.designation,
                assignedVehicle: u.assignedVehicle || u.assigned_vehicle,
                team_id: u.team_id || u.team_member_id
            }));
        } catch (err) {
            console.error('Error fetching /messages/users:', err);
            return [];
        }
    }
};

export default messageService;
