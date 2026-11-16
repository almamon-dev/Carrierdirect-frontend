import apiClient from '@/lib/axios';

export interface FeatureAnnouncement {
    id: number | string;
    feature_key: string;
    title: string;
    summary: string;
    description?: string;
    category?: 'dispatch' | 'safety' | 'telematics' | 'billing' | 'platform' | string;
    badge?: 'New' | 'Upcoming' | 'Beta' | string;
    status: 'live' | 'coming_soon' | 'archived';
    release_date?: string;
    target_role: 'all' | 'supplier' | 'driver' | 'customer';
    action_text?: string;
    action_url?: string;
    display_type?: 'modal' | 'banner' | 'both';
    is_active?: boolean;
    priority?: number;
    is_read?: boolean;
}

export interface FeatureReleaseResponse {
    version: string;
    release_title: string;
    count: number;
    unread_count: number;
    has_unseen: boolean;
    live: FeatureAnnouncement[];
    upcoming: FeatureAnnouncement[];
    all: FeatureAnnouncement[];
}

export const CURRENT_RELEASE_VERSION = 'v2.1.0';

// High-fidelity fallback releases in case network is offline
export const FALLBACK_RELEASES: FeatureAnnouncement[] = [
    {
        id: 1,
        feature_key: 'relay-dispatch',
        title: 'Driver Reassignment & Handover',
        summary: 'Now you can reassign a driver and update handover between drivers for multi-leg shipments.',
        description: 'Manage multi-driver relay dispatches and intermediate handovers smoothly with secure OTP verification and live status tracking.',
        category: 'dispatch',
        badge: 'New Feature',
        status: 'live',
        release_date: '16 Nov 2026',
        target_role: 'supplier',
        action_text: 'Details',
        action_url: '/supplier/orders',
        display_type: 'both',
        priority: 15,
        is_read: false,
    },
    {
        id: 2,
        feature_key: 'ai-delivery-delay',
        title: 'AI Delivery Delay Prediction',
        summary: 'Get proactive alerts on potential delivery delays based on traffic, route, and historical data.',
        description: 'Predictive algorithms monitor active freight legs, road incidents, weather, and borders to provide high-confidence delay warnings in advance.',
        category: 'telematics',
        badge: 'Upcoming Feature',
        status: 'coming_soon',
        release_date: 'ETA: 30 Nov 2026',
        target_role: 'all',
        action_text: 'Details',
        action_url: '',
        display_type: 'both',
        priority: 14,
        is_read: false,
    },
    {
        id: 3,
        feature_key: 'sick-leave-emergency',
        title: 'Driver Sick Leave & Emergency Auto-Reassign',
        summary: 'Report sudden illness, medical unfitness, or breakdowns directly on active trips with automated 1-click reassignment.',
        description: 'Driver duty automatically shifts offline to sick leave while securing cargo. Operations dispatch is alerted immediately to reassign a replacement carrier.',
        category: 'safety',
        badge: 'New Feature',
        status: 'live',
        release_date: '16 Nov 2026',
        target_role: 'all',
        action_text: 'Details',
        action_url: '/driver/shipments',
        display_type: 'both',
        priority: 12,
        is_read: false,
    },
    {
        id: 4,
        feature_key: 'turn-by-turn-gps',
        title: 'Turn-by-Turn Live GPS Corridor Navigation',
        summary: 'Interactive route navigation with waypoint guidance, corridor deviation alerts, and real-time destination distance.',
        description: 'Driver workspace includes real-time corridor tracking with route deviation alerts, height-restricted clearance, and automatic ETA calculation.',
        category: 'telematics',
        badge: 'Update',
        status: 'live',
        release_date: '15 Nov 2026',
        target_role: 'driver',
        action_text: 'Details',
        action_url: '/driver/navigation',
        display_type: 'both',
        priority: 10,
        is_read: false,
    },
    {
        id: 4,
        feature_key: 'telematics-fuel',
        title: 'Automated Telematics & Fuel Consumption Insights',
        summary: 'Fleet-wide OBD-II diagnostics integration with live idle fuel and driver speed reporting.',
        description: 'Suppliers get live CAN-bus diagnostics, idle fuel burn tracking, and automated European ESG CO2 compliance exports.',
        category: 'telematics',
        badge: 'Upcoming',
        status: 'coming_soon',
        release_date: 'Q1 2027',
        target_role: 'supplier',
        action_text: 'View Roadmap',
        action_url: '/supplier/fleet',
        display_type: 'both',
        priority: 7,
        is_read: false,
    },
    {
        id: 5,
        feature_key: 'instant-escrow',
        title: 'Instant Escrow Settlement & Dynamic Factoring',
        summary: 'Automated payments released immediately upon verified digital POD approval.',
        description: 'Eliminate 60-day carrier payment delays. Carriers receive automated 24-hour liquidity with integrated factoring rails and transparent settlement.',
        category: 'billing',
        badge: 'Beta',
        status: 'coming_soon',
        release_date: 'Q1 2027',
        target_role: 'all',
        action_text: 'Billing Overview',
        action_url: '/supplier/billing',
        display_type: 'modal',
        priority: 6,
        is_read: false,
    },
];

const SEEN_STORAGE_KEY = 'carrierdirect_seen_announcements_version';
const BANNER_DISMISSED_KEY = 'carrierdirect_banner_dismissed_version';
const UNREAD_COUNT_KEY = 'carrierdirect_announcements_unread_count';
const HAS_UNSEEN_KEY = 'carrierdirect_announcements_has_unseen';

let memoryCache: FeatureReleaseResponse | null = null;

export const featureReleaseService = {
    /**
     * Fetch active announcements from database API.
     */
    async getActiveAnnouncements(role?: string): Promise<FeatureReleaseResponse> {
        try {
            const roleParam = role ? `?role=${role}` : '';
            const res = await apiClient.get(`/announcements/active${roleParam}`);
            const data = res.data?.data || res.data;

            if (data && (Array.isArray(data.live) || Array.isArray(data.upcoming) || Array.isArray(data.all))) {
                const response: FeatureReleaseResponse = {
                    version: data.version || CURRENT_RELEASE_VERSION,
                    release_title: data.release_title || 'Multi-Driver Relay & Fleet Safety Updates',
                    count: data.count || (data.all?.length ?? 0),
                    unread_count: typeof data.unread_count === 'number' ? data.unread_count : 0,
                    has_unseen: Boolean(data.has_unseen),
                    live: data.live || [],
                    upcoming: data.upcoming || [],
                    all: data.all || [],
                };

                memoryCache = response;
                localStorage.setItem(HAS_UNSEEN_KEY, response.has_unseen ? '1' : '0');
                localStorage.setItem(UNREAD_COUNT_KEY, String(response.unread_count));

                return response;
            }
        } catch (err) {
            console.warn('Could not fetch announcements from database API, using fallback:', err);
        }

        // Filter fallback by role if API fails
        const filtered = FALLBACK_RELEASES.filter(item => {
            if (!role || role === 'all') return true;
            return item.target_role === 'all' || item.target_role === role;
        });

        const isSeen = localStorage.getItem(SEEN_STORAGE_KEY) === CURRENT_RELEASE_VERSION;
        const fallbackRes: FeatureReleaseResponse = {
            version: CURRENT_RELEASE_VERSION,
            release_title: 'Multi-Driver Relay & Fleet Safety Updates',
            count: filtered.length,
            unread_count: isSeen ? 0 : filtered.length,
            has_unseen: !isSeen,
            live: filtered.filter(f => f.status === 'live'),
            upcoming: filtered.filter(f => f.status === 'coming_soon'),
            all: filtered,
        };

        memoryCache = fallbackRes;
        return fallbackRes;
    },

    /**
     * Mark all active announcements as read in database for authenticated user.
     */
    async markAllAsRead(role?: string): Promise<void> {
        try {
            // Persist to database via API
            await apiClient.post('/announcements/mark-as-read', { role });
        } catch (err) {
            console.warn('Failed to mark announcements as read on database API:', err);
        }

        // Update local tracking
        localStorage.setItem(HAS_UNSEEN_KEY, '0');
        localStorage.setItem(UNREAD_COUNT_KEY, '0');
        localStorage.setItem(SEEN_STORAGE_KEY, CURRENT_RELEASE_VERSION);
        localStorage.setItem(BANNER_DISMISSED_KEY, CURRENT_RELEASE_VERSION);

        if (memoryCache) {
            memoryCache.has_unseen = false;
            memoryCache.unread_count = 0;
            memoryCache.all = memoryCache.all.map(item => ({ ...item, is_read: true }));
            memoryCache.live = memoryCache.live.map(item => ({ ...item, is_read: true }));
            memoryCache.upcoming = memoryCache.upcoming.map(item => ({ ...item, is_read: true }));
        }

        // Broadcast event so Header, Banner, and Modals immediately hide unread indicators
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('feature-announcements-read', {
                detail: { has_unseen: false, unread_count: 0 }
            }));
        }
    },

    /**
     * Mark a single announcement as read in database.
     */
    async markSingleAsRead(id: number | string): Promise<void> {
        try {
            await apiClient.post(`/announcements/${id}/read`);
        } catch (err) {
            console.warn('Failed to mark single announcement as read on database API:', err);
        }

        if (memoryCache) {
            const item = memoryCache.all.find(i => String(i.id) === String(id));
            if (item) item.is_read = true;
            memoryCache.unread_count = Math.max(0, memoryCache.unread_count - 1);
            memoryCache.has_unseen = memoryCache.unread_count > 0;
            localStorage.setItem(UNREAD_COUNT_KEY, String(memoryCache.unread_count));
            localStorage.setItem(HAS_UNSEEN_KEY, memoryCache.has_unseen ? '1' : '0');

            if (!memoryCache.has_unseen && typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('feature-announcements-read', {
                    detail: { has_unseen: false, unread_count: 0 }
                }));
            }
        }
    },

    /**
     * Check if user has unseen announcements.
     */
    hasUnseenAnnouncements(version: string = CURRENT_RELEASE_VERSION): boolean {
        try {
            if (memoryCache) {
                return Boolean(memoryCache.has_unseen);
            }
            const storedHasUnseen = localStorage.getItem(HAS_UNSEEN_KEY);
            if (storedHasUnseen !== null) {
                return storedHasUnseen === '1';
            }
            const seenVersion = localStorage.getItem(SEEN_STORAGE_KEY);
            return seenVersion !== version;
        } catch {
            return false;
        }
    },

    /**
     * Subscribe to read events across components.
     */
    subscribeToReadEvents(callback: (hasUnseen: boolean, count: number) => void): () => void {
        const handler = (e: any) => {
            const hasUnseen = Boolean(e?.detail?.has_unseen);
            const count = Number(e?.detail?.unread_count || 0);
            callback(hasUnseen, count);
        };

        if (typeof window !== 'undefined') {
            window.addEventListener('feature-announcements-read', handler);
            return () => window.removeEventListener('feature-announcements-read', handler);
        }
        return () => {};
    },

    /**
     * Check if the top announcement banner was dismissed for this version.
     */
    isBannerDismissed(version: string = CURRENT_RELEASE_VERSION): boolean {
        try {
            const hasUnseen = localStorage.getItem(HAS_UNSEEN_KEY);
            if (hasUnseen === '0') return true;
            const dismissed = localStorage.getItem(BANNER_DISMISSED_KEY);
            return dismissed === version;
        } catch {
            return false;
        }
    },

    /**
     * Dismiss the top announcement banner for this version.
     */
    dismissBanner(version: string = CURRENT_RELEASE_VERSION): void {
        try {
            localStorage.setItem(BANNER_DISMISSED_KEY, version);
        } catch (err) {
            console.error('Failed to dismiss announcement banner:', err);
        }
    },
};
