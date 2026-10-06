import { decryptId, encryptId } from "@/lib/encryption";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCustomerNegotiations } from "../../hooks/useCustomerNegotiations";
import { CustomerChatItem, CustomerContactGroup } from "../types";
import apiClient from "@/lib/axios";

export function useCustomerChatNegotiation() {
    const { id, sessionKey } = useParams<{ id: string; sessionKey?: string }>();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [filterTab, setFilterTab] = useState<"all" | "unread">("all");
    const { negotiations = [], isLoading = false } = useCustomerNegotiations() || {};

    const allNegotiations = useMemo(() => {
        return Array.isArray(negotiations) ? negotiations : [];
    }, [negotiations]);

    const resolvedActiveRawId = useMemo(() => {
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
    }, [id, allNegotiations]);

    const [activeChatId, setActiveChatId] = useState<number | string>(resolvedActiveRawId);
    const [readChatIds, setReadChatIds] = useState<Record<string | number, boolean>>({});

    useEffect(() => {
        if (resolvedActiveRawId) {
            setActiveChatId(resolvedActiveRawId);
            setReadChatIds(prev => ({
                ...prev,
                [resolvedActiveRawId]: true,
                [String(resolvedActiveRawId)]: true
            }));
            apiClient.post(`/customer/negotiations/${resolvedActiveRawId}/seen`).catch(() =>
                apiClient.post(`/negotiations/${resolvedActiveRawId}/seen`).catch(() => {})
            );
        } else if (allNegotiations.length > 0 && !activeChatId) {
            const firstId = allNegotiations[0].rawId;
            setActiveChatId(firstId);
            setReadChatIds(prev => ({
                ...prev,
                [firstId]: true,
                [String(firstId)]: true
            }));
            apiClient.post(`/customer/negotiations/${firstId}/seen`).catch(() =>
                apiClient.post(`/negotiations/${firstId}/seen`).catch(() => {})
            );
        }
    }, [resolvedActiveRawId, allNegotiations.length]);

    const chats: CustomerChatItem[] = useMemo(() => {
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
    }, [allNegotiations, activeChatId, readChatIds]);

    // Group chats by unique supplier / client (Fiverr Style)
    const contactGroups: CustomerContactGroup[] = useMemo(() => {
        const groupMap = new Map<string, CustomerContactGroup>();

        chats.forEach(chat => {
            const senderId = chat.raw?.sender_id || chat.raw?.supplier_id || chat.raw?.user_id;
            const supplierKey = senderId
                ? `sender_${senderId}`
                : (chat.name || chat.carrier || chat.company || "supplier_partner").trim().toLowerCase();

            const isChatActive = String(chat.id) === String(activeChatId);
            const chatUnreadCount = isChatActive ? 0 : (chat.unreadCount || 0);
            const isChatUnread = !isChatActive && Boolean(chat.unread && chatUnreadCount > 0);

            if (!groupMap.has(supplierKey)) {
                groupMap.set(supplierKey, {
                    contactId: supplierKey,
                    senderId: senderId,
                    name: chat.name || chat.carrier || chat.company || "Carrier Partner",
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
    }, [chats, activeChatId]);

    // Find the currently active contact group containing activeChatId
    const activeContactGroup = useMemo(() => {
        if (!contactGroups.length) return null;
        const found = contactGroups.find(g => g.quotes.some(q => String(q.id) === String(activeChatId)));
        return found || contactGroups[0] || null;
    }, [contactGroups, activeChatId]);

    const activeChat = useMemo(() => {
        if (activeContactGroup) {
            const foundInGroup = activeContactGroup.quotes.find(q => String(q.id) === String(activeChatId));
            if (foundInGroup) return foundInGroup;
            if (activeContactGroup.quotes.length > 0) return activeContactGroup.quotes[0];
        }
        return chats.find(c => String(c.id) === String(activeChatId)) || chats[0] || null;
    }, [chats, activeContactGroup, activeChatId]);

    // Filter contact groups based on search & filter tabs
    const filteredContactGroups = useMemo(() => {
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

                if (filterTab === "unread") {
                    return matchesSearch && group.hasUnread && group.totalUnreadCount > 0;
                }
                return matchesSearch;
            })
            .sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));
    }, [contactGroups, searchQuery, filterTab]);

    const filteredChats = useMemo(() => {
        return chats
            .filter(chat => {
                const matchesSearch = chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    chat.preview.toLowerCase().includes(searchQuery.toLowerCase());
                if (filterTab === "unread") {
                    return matchesSearch && chat.unread && chat.unreadCount > 0;
                }
                return matchesSearch;
            })
            .sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));
    }, [chats, searchQuery, filterTab]);

    const handleSelectChat = (chatId: number | string) => {
        const rawNum = Number(String(chatId).replace(/[^0-9]/g, "")) || chatId;
        const targetChat = chats.find(c => String(c.id) === String(chatId) || String(c.raw?.rawId) === String(chatId) || String(c.raw?.id) === String(chatId));
        const effectiveId = targetChat?.id || rawNum || chatId;

        setActiveChatId(effectiveId);
        setReadChatIds(prev => ({ ...prev, [effectiveId]: true, [String(effectiveId)]: true }));
        apiClient.post(`/customer/negotiations/${effectiveId}/seen`).catch(() =>
            apiClient.post(`/negotiations/${effectiveId}/seen`).catch(() => {})
        );
        const encId = encryptId(effectiveId);
        const sKey = targetChat?.raw?.session_key || targetChat?.raw?.sessionKey || `ses-${effectiveId}`;
        navigate(`/customer/quotes/negotiation/conversation/${encId}/${sKey}`);
    };

    const handleSelectContact = (group: CustomerContactGroup, preferredQuoteId?: number | string) => {
        const targetId = preferredQuoteId || (group.quotes.length > 0 ? group.quotes[0].id : activeChatId);
        if (targetId) {
            const targetChat = group.quotes.find(q => String(q.id) === String(targetId)) || group.quotes[0];
            setActiveChatId(targetId);
            setReadChatIds(prev => ({ ...prev, [targetId]: true, [String(targetId)]: true }));
            apiClient.post(`/customer/negotiations/${targetId}/seen`).catch(() =>
                apiClient.post(`/negotiations/${targetId}/seen`).catch(() => {})
            );
            const encId = encryptId(targetId);
            const sKey = targetChat?.raw?.session_key || targetChat?.raw?.sessionKey || `ses-${targetId}`;
            navigate(`/customer/quotes/negotiation/conversation/${encId}/${sKey}`);
        }
    };

    const contactQuotes = useMemo(() => {
        return activeContactGroup?.quotes || (activeChat ? [activeChat] : []);
    }, [activeContactGroup, activeChat]);

    return {
        id,
        navigate,
        searchQuery,
        setSearchQuery,
        filterTab,
        setFilterTab,
        isLoading,
        allNegotiations,
        activeChatId,
        chats,
        activeChat,
        contactGroups,
        filteredContactGroups,
        activeContactGroup,
        contactQuotes,
        filteredChats,
        handleSelectChat,
        handleSelectContact
    };
}
