import { decryptId } from "@/lib/encryption";
import { CustomerChatItem, CustomerContactGroup } from "../types";

export function resolveActiveNegotiationId(id: string | undefined, allNegotiations: any[]): number | string {
    if (!id) return allNegotiations[0]?.rawId || "";
    const decrypted = decryptId(id);
    const rawNum = Number(String(decrypted).replace(/[^0-9]/g, ""));
    const cleanDecrypted = String(decrypted).replace("REQ-", "").replace("QT-", "").trim();
    const matched = allNegotiations.find(n =>
        (rawNum && Number(n.rawId) === rawNum) ||
        String(n.rawId) === cleanDecrypted ||
        String(n.rawId) === String(decrypted) ||
        n.sessionKey === id ||
        n.id === decrypted ||
        n.id === id ||
        (n as any).slug === id
    );
    return matched?.rawId || rawNum || allNegotiations[0]?.rawId || "";
}

export function mapNegotiationsToChats(
    allNegotiations: any[],
    activeChatId: number | string,
    readChatIds: Record<string | number, boolean>
): CustomerChatItem[] {
    return allNegotiations.map(n => {
        const isTargetActive = String(n.rawId) === String(activeChatId);
        const isMarkedRead = Boolean(readChatIds[n.rawId] || readChatIds[String(n.rawId)] || isTargetActive);
        const avatarUrl = n.customerAvatar || n.supplierAvatar || (n as any).profile_picture || "";
        const supplierDisplayName = n.supplier || n.customer || "Supplier";
        const unreadCount = isMarkedRead ? 0 : Number(n.unreadCount || 0);

        return {
            id: n.rawId,
            name: supplierDisplayName,
            avatar: avatarUrl,
            preview: n.notes || `${n.pickup} → ${n.delivery}`,
            time: n.lastUpdated || n.requestDate || "",
            unreadCount: unreadCount,
            unread: unreadCount > 0,
            active: isTargetActive,
            quoteNo: n.quoteId || (typeof n.id === "string" && n.id.startsWith("QT-") ? n.id : `QT-${String(n.rawId).padStart(4, "0")}`),
            baseFreight: `€ ${Number(n.baseFreightAmount || n.currentOffer || n.originalAmount || 0).toLocaleString()}`,
            baseFreightAmount: n.baseFreightAmount || (n.totalExtras ? Math.max(0, Number(n.currentOffer || 0) - n.totalExtras) : Number(n.currentOffer || n.originalAmount || 0)),
            extraCharges: n.extraCharges || [],
            totalExtras: n.totalExtras || 0,
            isVerified: true,
            isPinned: Boolean(n.priority === "Urgent"),
            raw: n,
            routeText: `${n.pickup} → ${n.delivery}`,
            origin: n.origin || n.pickup,
            destination: n.destination || n.delivery,
            distance: n.distance || "—",
            currentPrice: Number(n.currentOffer || n.originalAmount || 0),
            vehicleType: n.vehicleType || "—",
            isOnline: Boolean(n.isOnline),
            lastSeenHuman: n.lastSeenHuman || (n.isOnline ? "Active now" : "Offline"),
            lastSeenAt: n.lastSeenAt
        };
    });
}

export function groupChatsBySupplier(
    chats: CustomerChatItem[],
    activeChatId: number | string
): CustomerContactGroup[] {
    const groupMap = new Map<string, CustomerContactGroup>();

    chats.forEach(chat => {
        const senderId = chat.raw?.sender_id || chat.raw?.supplier_id || chat.raw?.user_id;
        const supplierKey = senderId
            ? `sender_${senderId}`
            : (chat.name || (chat as any).carrier || (chat as any).company || "supplier_partner").trim().toLowerCase();

        const isChatActive = String(chat.id) === String(activeChatId);
        const chatUnreadCount = isChatActive ? 0 : (chat.unreadCount || 0);
        const isChatUnread = !isChatActive && Boolean(chat.unread && chatUnreadCount > 0);

        if (!groupMap.has(supplierKey)) {
            groupMap.set(supplierKey, {
                contactId: supplierKey,
                senderId: senderId,
                name: chat.name || (chat as any).carrier || (chat as any).company || '-',
                avatar: chat.avatar,
                isOnline: Boolean(chat.isOnline),
                lastSeenHuman: chat.lastSeenHuman,
                lastSeenAt: chat.lastSeenAt,
                isVerified: Boolean(chat.isVerified),
                quotes: [chat],
                activeQuoteId: chat.id,
                latestActivityTime: chat.time,
                latestPreview: chat.preview,
                totalUnreadCount: chatUnreadCount,
                hasUnread: isChatUnread,
                hasPendingOffer: Boolean(chat.raw?.status === "Counter Received" || chat.raw?.status === "Pending"),
                isPinned: Boolean(chat.isPinned)
            });
        } else {
            const group = groupMap.get(supplierKey)!;
            group.quotes.push(chat);
            group.totalUnreadCount += chatUnreadCount;
            group.hasUnread = group.hasUnread || isChatUnread;
            group.isPinned = group.isPinned || Boolean(chat.isPinned);
            if (chat.isOnline) {
                group.isOnline = true;
                group.lastSeenHuman = chat.lastSeenHuman;
            }
            if (chat.avatar && !group.avatar) {
                group.avatar = chat.avatar;
            }
        }
    });

    return Array.from(groupMap.values());
}

export const isCustomerQuoteExisting = (q: any): boolean => {
    const rawStatusLower = String(q.raw?.status_raw || q.raw?.status || q.status || '').toLowerCase();
    return Boolean(
        q.raw?.is_paid ||
        q.raw?.has_order ||
        q.raw?.order_id ||
        q.raw?.orderNumber ||
        q.isPaid ||
        q.hasOrder ||
        q.isBooked ||
        q.isCompleted ||
        rawStatusLower.includes('book') ||
        rawStatusLower.includes('complete') ||
        rawStatusLower.includes('order')
    );
};

export function filterContactGroups(
    contactGroups: CustomerContactGroup[],
    searchQuery: string,
    filterTab: "all" | "new" | "existing" | "unread"
): CustomerContactGroup[] {
    const query = searchQuery.trim().toLowerCase();
    return contactGroups
        .filter(group => {
            const matchesName = group.name.toLowerCase().includes(query);
            const matchesPreview = group.latestPreview.toLowerCase().includes(query);
            const matchesAnyQuote = group.quotes.some(q =>
                q.quoteNo.toLowerCase().includes(query) ||
                q.routeText.toLowerCase().includes(query) ||
                q.preview.toLowerCase().includes(query)
            );
            const matchesSearch = !query || matchesName || matchesPreview || matchesAnyQuote;
            if (!matchesSearch) return false;

            if (filterTab === "unread") {
                return group.hasUnread && group.totalUnreadCount > 0;
            }
            if (filterTab === "new") {
                return group.quotes.some(q => !isCustomerQuoteExisting(q));
            }
            if (filterTab === "existing") {
                return group.quotes.some(isCustomerQuoteExisting);
            }
            return true;
        })
        .sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));
}

export function filterChats(
    chats: CustomerChatItem[],
    searchQuery: string,
    filterTab: "all" | "new" | "existing" | "unread"
): CustomerChatItem[] {
    const query = searchQuery.trim().toLowerCase();
    return chats
        .filter(chat => {
            const matchesSearch = !query ||
                chat.name.toLowerCase().includes(query) ||
                chat.quoteNo.toLowerCase().includes(query) ||
                chat.routeText.toLowerCase().includes(query) ||
                chat.preview.toLowerCase().includes(query);
            if (!matchesSearch) return false;

            if (filterTab === "unread") {
                return chat.unread && chat.unreadCount > 0;
            }
            if (filterTab === "new") {
                return !isCustomerQuoteExisting(chat);
            }
            if (filterTab === "existing") {
                return isCustomerQuoteExisting(chat);
            }
            return true;
        })
        .sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));
}
