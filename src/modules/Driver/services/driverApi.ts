import apiClient from '@/lib/axios';
import { initialDriverProfile } from '../Profile/data/profileData';
import { initialDashboardMetrics, activeTripSummary, telemetryData } from '../Dashboard/data/dashboardData';
import { initialShipmentsList } from '../Shipments/data/shipmentsData';
import { initialDriverConversations, initialChatMessages } from '../Chat/data/chatData';
import { initialDriverNotifications } from '../Notifications/data/notificationsData';
import { DriverProfile, ShipmentItem, ShipmentStatus, DriverChatMessage, DriverNotification } from '../types';

const STORAGE_KEYS = {
    PROFILE: 'driver_portal_profile',
    SHIPMENTS: 'driver_portal_shipments',
    MESSAGES: 'driver_portal_messages',
    CONVERSATIONS: 'driver_portal_conversations',
    NOTIFICATIONS: 'driver_portal_notifications',
};

// Helper: Local storage with fallback
function getLocalItem<T>(key: string, fallback: T): T {
    try {
        const stored = localStorage.getItem(key);
        if (stored) return JSON.parse(stored);
    } catch {
        // ignore parse error
    }
    return fallback;
}

function setLocalItem<T>(key: string, data: T): void {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch {
        // ignore
    }
}

export const driverApi = {
    // ── Driver Profile ───────────────────────────────────────────────
    async getProfile(): Promise<DriverProfile> {
        try {
            const res = await apiClient.get('/driver/profile');
            if (res.data?.data) return res.data.data;
        } catch {
            // fallback to local dummy
        }
        return getLocalItem<DriverProfile>(STORAGE_KEYS.PROFILE, initialDriverProfile);
    },

    async updateProfile(updates: Partial<DriverProfile>): Promise<DriverProfile> {
        try {
            const res = await apiClient.put('/driver/profile', updates);
            if (res.data?.data) return res.data.data;
        } catch {
            // fallback to local
        }
        const current = getLocalItem<DriverProfile>(STORAGE_KEYS.PROFILE, initialDriverProfile);
        const updated = { ...current, ...updates };
        setLocalItem(STORAGE_KEYS.PROFILE, updated);
        window.dispatchEvent(new Event('driver-profile-updated'));
        return updated;
    },

    async toggleDutyStatus(status: 'online' | 'offline' | 'on_trip' | 'break'): Promise<DriverProfile> {
        return this.updateProfile({ dutyStatus: status });
    },

    // ── Dashboard ────────────────────────────────────────────────────
    async getDashboardMetrics() {
        try {
            const res = await apiClient.get('/driver/dashboard/metrics');
            if (res.data?.data) return res.data.data;
        } catch {
            // fallback
        }
        return initialDashboardMetrics;
    },

    async getActiveTripSummary() {
        try {
            const res = await apiClient.get('/driver/trips/active');
            if (res.data?.data) return res.data.data;
        } catch {
            // fallback
        }
        return activeTripSummary;
    },

    async getTelemetry() {
        try {
            const res = await apiClient.get('/driver/telemetry');
            if (res.data?.data) return res.data.data;
        } catch {
            // fallback
        }
        return telemetryData;
    },

    // ── Shipments ────────────────────────────────────────────────────
    async getShipments(): Promise<ShipmentItem[]> {
        try {
            const res = await apiClient.get('/driver/shipments');
            const list = res.data?.data || res.data;
            if (Array.isArray(list)) return list;
        } catch {
            // fallback
        }
        return getLocalItem<ShipmentItem[]>(STORAGE_KEYS.SHIPMENTS, initialShipmentsList);
    },

    async getShipmentById(id: string): Promise<ShipmentItem | null> {
        const shipments = await this.getShipments();
        return shipments.find((s) => s.id === id || s.orderNumber === id) || null;
    },

    async updateShipmentMilestone(id: string, newStatus: ShipmentStatus): Promise<ShipmentItem> {
        try {
            const res = await apiClient.patch(`/driver/shipments/${id}/status`, { status: newStatus });
            if (res.data?.data) return res.data.data;
        } catch {
            // fallback
        }
        const shipments = getLocalItem<ShipmentItem[]>(STORAGE_KEYS.SHIPMENTS, initialShipmentsList);
        const updated = shipments.map((s) => (s.id === id ? { ...s, status: newStatus, updatedAt: new Date().toISOString() } : s));
        setLocalItem(STORAGE_KEYS.SHIPMENTS, updated);
        return updated.find((s) => s.id === id) as ShipmentItem;
    },

    async submitPOD(id: string, podData: { receiverName: string; signatureUrl?: string; documentPhotos?: string[]; notes?: string }): Promise<ShipmentItem> {
        try {
            const res = await apiClient.post(`/driver/shipments/${id}/pod`, podData);
            if (res.data?.data) return res.data.data;
        } catch {
            // fallback
        }
        const shipments = getLocalItem<ShipmentItem[]>(STORAGE_KEYS.SHIPMENTS, initialShipmentsList);
        const updated = shipments.map((s) => {
            if (s.id === id) {
                return {
                    ...s,
                    status: 'delivered' as ShipmentStatus,
                    podData: {
                        ...podData,
                        uploadedAt: new Date().toISOString(),
                    },
                    updatedAt: new Date().toISOString(),
                };
            }
            return s;
        });
        setLocalItem(STORAGE_KEYS.SHIPMENTS, updated);
        return updated.find((s) => s.id === id) as ShipmentItem;
    },

    // ── Live Chat ────────────────────────────────────────────────────
    async getConversations() {
        return getLocalItem(STORAGE_KEYS.CONVERSATIONS, initialDriverConversations);
    },

    async getMessages(conversationId: string): Promise<DriverChatMessage[]> {
        const all = getLocalItem(STORAGE_KEYS.MESSAGES, initialChatMessages);
        return all[conversationId] || [];
    },

    async sendMessage(conversationId: string, messageText: string, type: DriverChatMessage['type'] = 'text'): Promise<DriverChatMessage> {
        const newMessage: DriverChatMessage = {
            id: `msg-${Date.now()}`,
            senderId: 'DRV-9872',
            senderName: 'Mike Icorse Dady',
            senderRole: 'driver',
            message: messageText,
            type,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isMe: true,
            status: 'sent',
        };

        const all = getLocalItem(STORAGE_KEYS.MESSAGES, initialChatMessages);
        const currentList = all[conversationId] || [];
        all[conversationId] = [...currentList, newMessage];
        setLocalItem(STORAGE_KEYS.MESSAGES, all);
        return newMessage;
    },

    // ── Notifications ────────────────────────────────────────────────
    async getNotifications(): Promise<DriverNotification[]> {
        return getLocalItem<DriverNotification[]>(STORAGE_KEYS.NOTIFICATIONS, initialDriverNotifications);
    },

    async markNotificationAsRead(id: string): Promise<DriverNotification[]> {
        const notifs = getLocalItem<DriverNotification[]>(STORAGE_KEYS.NOTIFICATIONS, initialDriverNotifications);
        const updated = notifs.map((n) => (n.id === id ? { ...n, isRead: true } : n));
        setLocalItem(STORAGE_KEYS.NOTIFICATIONS, updated);
        return updated;
    },

    async markAllNotificationsRead(): Promise<DriverNotification[]> {
        const notifs = getLocalItem<DriverNotification[]>(STORAGE_KEYS.NOTIFICATIONS, initialDriverNotifications);
        const updated = notifs.map((n) => ({ ...n, isRead: true }));
        setLocalItem(STORAGE_KEYS.NOTIFICATIONS, updated);
        return updated;
    },
};
