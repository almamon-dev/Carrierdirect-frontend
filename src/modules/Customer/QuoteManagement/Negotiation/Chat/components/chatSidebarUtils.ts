import { CustomerChatItem, CustomerContactGroup } from "../types";

export function extractSidebarGroupsDisplay(
    filteredContactGroups: CustomerContactGroup[] = [],
    contactGroups: CustomerContactGroup[] = [],
    filteredChats: CustomerChatItem[] = [],
    chats: CustomerChatItem[] = [],
    chatMessages: Record<string | number, any[]> = {}
): CustomerContactGroup[] {
    if (filteredContactGroups && filteredContactGroups.length > 0) {
        return filteredContactGroups;
    }
    if (contactGroups && contactGroups.length > 0) {
        return contactGroups;
    }

    const map = new Map<string, CustomerContactGroup>();
    (filteredChats.length > 0 ? filteredChats : chats).forEach(chat => {
        const senderId = chat.raw?.sender_id || chat.raw?.supplier_id || chat.raw?.user_id;
        const supplierKey = senderId
            ? `sender_${senderId}`
            : (chat.name || (chat as any).carrier || (chat as any).company || "supplier_partner").trim().toLowerCase();

        const thread = chatMessages[chat.id] || chatMessages[String(chat.id)] || (chat.raw?.rawId ? chatMessages[chat.raw.rawId] : null) || [];
        const lastMsg = thread && thread.length > 0 ? thread[thread.length - 1] : null;

        let extractedPreview = chat.preview;
        let extractedTime = chat.time;

        if (lastMsg) {
            const isMe = Boolean(
                lastMsg.type === 'sent' ||
                lastMsg.sender === 'customer' ||
                (lastMsg as any).sender_type === 'customer' ||
                (lastMsg as any).is_me === true ||
                (lastMsg as any).isMe === true
            );

            let text = (lastMsg.text || (lastMsg as any).message || '').trim();
            if (!text && lastMsg.attachments && lastMsg.attachments.length > 0) {
                const isImg = lastMsg.attachments.some((a: any) => a.type === 'image' || (a.url && /\.(jpe?g|png|webp|gif)/i.test(a.url)));
                text = isImg ? '📷 Photo' : `📎 ${lastMsg.attachments[0].name || 'Attachment'}`;
            } else if (!text && lastMsg.type === 'offer') {
                const amt = lastMsg.newTotal || (lastMsg as any).amount || (chat.currentPrice || 548);
                text = `Revised Offer: € ${amt}`;
            } else if (!text && lastMsg.type === 'quote_request') {
                const amt = lastMsg.newTotal || (lastMsg as any).amount || (chat.currentPrice || 548);
                text = `Quote Request: € ${amt}`;
            } else if (!text && lastMsg.type === 'system') {
                text = (lastMsg as any).message || lastMsg.text || 'System notification';
            }

            if (text) {
                extractedPreview = isMe ? `You: ${text}` : text;
            }
            if (lastMsg.time) {
                extractedTime = lastMsg.time;
            }
        }

        if (!map.has(supplierKey)) {
            map.set(supplierKey, {
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
                latestActivityTime: extractedTime,
                latestPreview: extractedPreview,
                totalUnreadCount: chat.unreadCount || 0,
                hasUnread: Boolean(chat.unread || (chat.unreadCount && chat.unreadCount > 0)),
                hasPendingOffer: Boolean(chat.raw?.status === "Counter Received" || chat.raw?.status === "Pending"),
                isPinned: Boolean(chat.isPinned)
            });
        } else {
            const group = map.get(supplierKey)!;
            group.quotes.push(chat);
            group.totalUnreadCount += (chat.unreadCount || 0);
            group.hasUnread = group.hasUnread || Boolean(chat.unread || (chat.unreadCount && chat.unreadCount > 0));
            group.isPinned = group.isPinned || Boolean(chat.isPinned);
            if (lastMsg) {
                group.latestPreview = extractedPreview;
                group.latestActivityTime = extractedTime;
            }
        }
    });

    return Array.from(map.values());
}
