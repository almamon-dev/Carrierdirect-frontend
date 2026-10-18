export type NotificationCategory = 'all' | 'account' | 'compliance' | 'finance' | 'quote' | 'shipment';

export interface HeaderNotification {
    id: string | number;
    title: string;
    desc: string;
    time: string;
    timestamp: number;
    createdAt?: string;
    amount?: string;
    type: 'quote' | 'order' | 'message' | 'system' | 'finance' | 'compliance' | 'account' | 'shipment';
    category?: NotificationCategory;
    subCategory?: string;
    unread: boolean;
    link?: string;
}
