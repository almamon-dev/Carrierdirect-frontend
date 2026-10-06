export interface ExtraChargeItem {
    id?: number | string;
    type: string;
    custom_name?: string;
    customName?: string;
    label?: string;
    amount: number;
}

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
    baseFreightAmount?: number;
    extraCharges?: ExtraChargeItem[];
    totalExtras?: number;
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
    isOnline?: boolean;
    lastSeenHuman?: string;
    lastSeenAt?: string;
}

export interface CustomerContactGroup {
    contactId: string;
    senderId?: number | string;
    name: string;
    avatar: string;
    isOnline: boolean;
    lastSeenHuman?: string;
    lastSeenAt?: string;
    isVerified: boolean;
    quotes: CustomerChatItem[];
    activeQuoteId: number | string;
    latestActivityTime: string;
    latestPreview: string;
    totalUnreadCount: number;
    hasUnread: boolean;
    hasPendingOffer: boolean;
    isPinned: boolean;
}

export interface CustomerChatAttachment {
    name: string;
    size: string;
    type: "image" | "file";
    url?: string;
}

export interface CustomerChatMessage {
    id: string | number;
    type: "sent" | "received" | "system" | "offer" | "quote_request";
    text?: string;
    time: string;
    sender?: string;
    avatar?: string;
    title?: string;
    newTotal?: number;
    previousTotal?: number;
    quoteNo?: string;
    status?: "pending" | "accepted" | "rejected" | "superseded" | "withdrawn";
    is_superseded?: boolean;
    declineReason?: string;
    attachments?: CustomerChatAttachment[];
    isPinned?: boolean;
    isDeleted?: boolean;
    isEdited?: boolean;
    seen?: boolean;
    seenAt?: string;
    isRead?: boolean;
    deliveryStatus?: "sending" | "sent" | "delivered" | "seen";
    base_amount?: number;
    extra_charges?: any[];
    extraCharges?: any[];
    is_me?: boolean;
    is_my_offer?: boolean;
    notes?: string;
    currency?: string;
}

export interface LinkPreviewData {
    url: string;
    domain: string;
    title: string;
    description: string;
    image?: string;
}
