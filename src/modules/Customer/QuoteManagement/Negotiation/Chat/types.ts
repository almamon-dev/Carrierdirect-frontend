export interface CustomerChatItem {
    id: number | string;
    name: string;
    avatar: string;
    preview: string;
    time: string;
    unreadCount: number;
    unread: boolean;
    active: boolean;
    quoteNo: string;
    baseFreight: string;
    isVerified: boolean;
    isPinned: boolean;
    raw: any;
    routeText: string;
    origin: string;
    destination: string;
    distance: string;
    currentPrice: number;
    vehicleType: string;
    carrier?: string;
    company?: string;
}

export interface CustomerChatAttachment {
    name: string;
    size: string;
    type: 'image' | 'file';
    url?: string;
}

export interface CustomerChatMessage {
    id: string | number;
    type: 'sent' | 'received' | 'system' | 'offer' | 'quote_request';
    text?: string;
    time: string;
    sender?: string;
    avatar?: string;
    title?: string;
    newTotal?: number;
    previousTotal?: number;
    quoteNo?: string;
    status?: 'pending' | 'accepted' | 'rejected';
    declineReason?: string;
    attachments?: CustomerChatAttachment[];
    isPinned?: boolean;
    isDeleted?: boolean;
    isEdited?: boolean;
    seen?: boolean;
    seenAt?: string;
    isRead?: boolean;
    deliveryStatus?: 'sending' | 'sent' | 'delivered' | 'seen';
}

export interface LinkPreviewData {
    url: string;
    domain: string;
    title: string;
    description: string;
    image?: string;
}
