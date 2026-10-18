import {
    GeneralMessage,
    ConversationPartnerItem,
    MessageAttachment,
} from '@/services/messageService';
import { isImageAttachment } from '@/modules/Shared/Messages/components/generalChatAttachmentUtils';
import { formatLocalTime } from '@/modules/Customer/QuoteManagement/Negotiation/Chat/utils/customerChatUtils';

export const parseRawAttachments = (m: any): any[] => {
    if (!m) return [];

    let raw =
        m.attachments ??
        m.files ??
        m.media ??
        m.documents ??
        m.images ??
        m.photos ??
        m.attachment ??
        m.file ??
        m.document ??
        m.image ??
        m.photo ??
        m.file_url ??
        m.file_path ??
        m.image_url ??
        m.photo_url ??
        m.path ??
        m.url ??
        null;

    if (!raw) {
        const textCand = typeof m.message === 'string' ? m.message : typeof m.text === 'string' ? m.text : typeof m.body === 'string' ? m.body : '';
        if (textCand) {
            const trimmed = textCand.trim();
            if (
                m.message_type === 'image' ||
                m.message_type === 'file' ||
                m.type === 'image' ||
                m.type === 'file' ||
                /\.(jpg|jpeg|png|webp|gif|svg|bmp|avif|pdf|docx?|xlsx?|csv|zip)($|\?)/i.test(trimmed)
            ) {
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
            return trimmed.split(',').map((s) => s.trim()).filter(Boolean);
        }
        return [trimmed];
    }

    if (Array.isArray(raw)) return raw;
    if (typeof raw === 'object' && raw !== null) return [raw];
    return [];
};

export const decodePartnerId = (hash?: any): number | null => {
    if (!hash) return null;
    const str = String(hash).trim();
    if (/^\d+$/.test(str)) return Number(str);
    try {
        let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
        while (base64.length % 4) base64 += '=';
        const decoded = atob(base64);
        if (/^\d+$/.test(decoded)) return Number(decoded);
    } catch {}
    const num = Number(str);
    return isNaN(num) ? null : num;
};

export const normalizeConversationItem = (raw: any): ConversationPartnerItem => {
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
            last_seen_human: userObj?.last_seen_human || raw.last_seen_human || (Boolean(userObj?.is_online ?? raw.is_online) ? 'Active Now' : 'Offline'),
        },
        last_message: raw.last_message ? {
            id: Number(raw.last_message.id || 0),
            sender_id: Number(raw.last_message.sender_id || 0),
            message: raw.last_message.message || raw.last_message.body || raw.last_message.text || '',
            message_type: raw.last_message.message_type || (raw.last_message.attachments?.length ? 'file' : 'text'),
            is_unsent: Boolean(raw.last_message.is_unsent),
            is_me: Boolean(raw.last_message.is_me),
            is_read: Boolean(raw.last_message.is_read),
            created_at_human: raw.last_message.created_at_human,
            time: raw.last_message.time,
        } : null,
        unread_count: Number(raw.unread_count || raw.unseen_count || 0),
        last_message_at: raw.last_message_at || raw.updated_at || raw.created_at || null,
    };
};

export const normalizeGeneralMessage = (m: any, idx: number, cleanId: number): GeneralMessage => {
    const senderId = Number(m.sender_id || m.sender?.id || m.from_user_id || 0);
    const receiverId = Number(m.receiver_id || m.receiver?.id || m.to_user_id || m.recipient_id || 0);
    const isMe = m.is_me !== undefined ? Boolean(m.is_me) : senderId ? senderId !== cleanId : receiverId === cleanId;

    const rawAttachments = parseRawAttachments(m);
    const hasAttachments = rawAttachments.length > 0;
    const hasImg = rawAttachments.some(isImageAttachment);
    const msgType = m.message_type || m.type || (hasImg ? 'image' : hasAttachments ? 'file' : 'text');

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
            is_me: m.reply_to.is_me !== undefined ? Boolean(m.reply_to.is_me) : Number(m.reply_to.sender_id) === Number(senderId) ? isMe : !isMe,
        } : null,
        message: m.message || m.body || m.text || m.content || '',
        message_type: msgType,
        attachments: hasAttachments ? rawAttachments : null,
        is_me: isMe,
        is_read: Boolean(m.is_read || m.read_at),
        read_at: m.read_at,
        is_pinned: Boolean(m.is_pinned ?? (m as any).isPinned),
        pinned_at: m.pinned_at || null,
        is_unsent: Boolean(m.is_unsent === true || m.is_unsent === 1 || m.is_unsent === '1' || m.is_unsent === 'true' || m.unsent_at),
        unsent_at: m.unsent_at || null,
        is_edited: Boolean(m.is_edited === true || m.is_edited === 1 || m.is_edited === '1' || m.is_edited === 'true' || m.edited_at),
        time: formatLocalTime(m.created_at, m.time),
        date: m.date || (m.created_at ? new Date(m.created_at).toLocaleDateString() : ''),
        created_at_human: m.created_at_human || 'Just now',
        created_at: m.created_at || new Date().toISOString(),
    };
};
