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
    is_unsent?: boolean;
    unsent_at?: string | null;
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
    rating?: number | string;
    reviews_count?: number;
    reviews?: number;
    completed_orders?: number;
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
        is_unsent?: boolean;
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

export const mapRawDirectoryUser = (u: any): ConversationUser => ({
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
    team_id: u.team_id || u.team_member_id,
    rating: u.rating ?? u.customer_rating ?? u.supplier_rating,
    reviews_count: u.reviews_count ?? u.reviews,
    reviews: u.reviews_count ?? u.reviews,
    completed_orders: u.completed_orders,
});
