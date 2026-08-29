export interface ChatAttachment {
    name: string;
    size: string;
    type: 'image' | 'file';
    url?: string;
}

export interface ChatMessage {
    id: number | string;
    type: 'system' | 'sent' | 'received' | 'offer' | 'quote_request';
    text: string;
    time: string;
    sender?: string;
    avatar?: string;
    title?: string;
    newTotal?: number;
    previousTotal?: number;
    attachments?: ChatAttachment[];
    isPinned?: boolean;
    isDeleted?: boolean;
    isEdited?: boolean;
    seen?: boolean;
    seenAt?: string;
    isRead?: boolean;
    deliveryStatus?: 'sending' | 'sent' | 'delivered' | 'seen';
    status?: 'pending' | 'accepted' | 'rejected';
    declineReason?: string;
}
