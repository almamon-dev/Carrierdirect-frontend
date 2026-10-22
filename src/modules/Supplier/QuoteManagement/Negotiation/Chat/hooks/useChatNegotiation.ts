import { decryptId, encryptId } from '@/lib/encryption';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSupplierNegotiations } from '../../hooks/useSupplierNegotiations';
import { NegotiationItem } from '../../types';
import { NegotiationFilterTab, SupplierChatSortOption } from '../types';
import { useChatMessages } from './useChatMessages';

export const isSupplierQuoteBooked = (q: any): boolean => {
    const rawStatusLower = String(q.status_raw || q.status || '').toLowerCase();
    const ost = String(q.order_status || q.order?.status || '').toLowerCase();
    return Boolean(
        q.is_paid ||
        q.isPaid ||
        q.has_order ||
        q.orderId ||
        q.order_id ||
        ost === 'confirmed' ||
        ost === 'in_progress' ||
        ost === 'completed' ||
        ost === 'delivered' ||
        rawStatusLower === 'booked' ||
        rawStatusLower === 'completed'
    );
};

export const isSupplierQuoteAwaitingPayment = (q: any): boolean => {
    if (isSupplierQuoteBooked(q)) return false;
    const rawStatusLower = String(q.status_raw || q.status || '').toLowerCase();
    const rev = String(q.revision_status || '').toLowerCase();
    const isAccepted = rawStatusLower === 'accepted' || rawStatusLower === 'won' || rev === 'accepted';
    return Boolean(
        q.is_awaiting_payment ||
        rawStatusLower === 'awaiting_payment' ||
        (isAccepted && !q.is_paid && !q.isPaid)
    );
};

export const isSupplierQuoteCounterOffer = (q: any): boolean => {
    if (isSupplierQuoteBooked(q) || isSupplierQuoteAwaitingPayment(q)) return false;
    const rev = String(q.revision_status || '').toLowerCase();
    const rawStatusLower = String(q.status_raw || q.status || '').toLowerCase();
    return Boolean(
        rev === 'pending' ||
        rev === 'counter_proposed' ||
        rawStatusLower.includes('counter')
    );
};

export function useChatNegotiation() {
    const { id, sessionKey } = useParams<{ id: string; sessionKey?: string }>();
    const navigate = useNavigate();

    const [searchQuery, setSearchQuery] = useState('');
    const [filterTab, setFilterTab] = useState<NegotiationFilterTab>('all');
    const [sortBy, setSortBy] = useState<SupplierChatSortOption>('recent');
    const [showMobileDetails, setShowMobileDetails] = useState(false);

    const { negotiations = [], isLoading = false } = useSupplierNegotiations() || {};
    const allNegotiations: NegotiationItem[] = useMemo(() => {
        return Array.isArray(negotiations) ? negotiations : [];
    }, [negotiations]);

    const decryptedRawId = useMemo(() => {
        if (!id) return allNegotiations[0]?.rawId || '';
        const decrypted = decryptId(id);
        const rawNum = Number(String(decrypted).replace(/[^0-9]/g, ''));
        const cleanDecrypted = String(decrypted).replace('REQ-', '').replace('QT-', '').trim();
        const matched = allNegotiations.find(n => {
            const nRawNum = Number(String(n.rawId).replace(/[^0-9]/g, ''));
            const nReqNum = Number(String(n.requestId).replace(/[^0-9]/g, ''));
            const nQuoteNum = Number(String(n.quoteId || n.id).replace(/[^0-9]/g, ''));
            return (
                (rawNum && (nRawNum === rawNum || nReqNum === rawNum || nQuoteNum === rawNum)) ||
                String(n.rawId) === cleanDecrypted ||
                String(n.rawId) === String(decrypted) ||
                n.sessionKey === id ||
                n.id === decrypted ||
                n.id === id ||
                n.requestId === decrypted ||
                n.quoteId === decrypted
            );
        });
        return matched?.rawId || rawNum || allNegotiations[0]?.rawId || '';
    }, [id, allNegotiations]);

    const [selectedChatId, setSelectedChatId] = useState<number | string | null>(null);

    useEffect(() => {
        setSelectedChatId(null);
    }, [id]);

    const activeChatId = selectedChatId ?? decryptedRawId ?? allNegotiations[0]?.rawId ?? '';

    const activeNegotiation = useMemo(() => {
        if (!allNegotiations.length) return null;
        const found = allNegotiations.find(
            n => String(n.rawId) === String(activeChatId) || n.id === String(activeChatId)
        );
        return found || allNegotiations[0] || null;
    }, [allNegotiations, activeChatId]);

    const [pinnedChatIds, setPinnedChatIds] = useState<Record<string | number, boolean>>({ 1048: true, 2: true });
    const [readChatIds, setReadChatIds] = useState<Record<string | number, boolean>>({});

    useEffect(() => {
        if (activeChatId) {
            setReadChatIds(prev => ({ ...prev, [activeChatId]: true }));
        }
    }, [activeChatId]);

    useEffect(() => {
        if (id && !id.startsWith('enc_') && allNegotiations.length > 0) {
            const raw = decryptId(id) || activeNegotiation?.rawId;
            if (raw) {
                const encId = encryptId(raw);
                const sKey = sessionKey || activeNegotiation?.sessionKey || `ses-${raw}`;
                if (encId && encId !== id) {
                    navigate(`/supplier/quotes/negotiation/conversation/${encId}/${sKey}`, { replace: true });
                }
            }
        }
    }, [id, sessionKey, activeNegotiation, allNegotiations, navigate]);

    const messagesHook = useChatMessages(activeNegotiation, allNegotiations);

    const handleSelectChat = (item: NegotiationItem) => {
        setSelectedChatId(item.rawId);
        messagesHook.setEditingMsgId(null);
        setReadChatIds(prev => ({ ...prev, [item.rawId]: true }));
        const encId = encryptId(item.rawId);
        const sKey = sessionKey || item.sessionKey || `ses-${item.rawId}`;
        navigate(`/supplier/quotes/negotiation/conversation/${encId}/${sKey}`, { replace: true });
        setShowMobileDetails(false);
    };

    const togglePinChat = (e: React.MouseEvent, chatId: number | string) => {
        e.stopPropagation();
        setPinnedChatIds(prev => ({ ...prev, [chatId]: !prev[chatId] }));
    };

    // Track how many times each customer appears to highlight repeat clients
    const repeatCustomerMap = useMemo(() => {
        const countsMap: Record<string, number> = {};
        allNegotiations.forEach((item) => {
            const key = (item.customer || '').trim().toLowerCase();
            if (key) {
                countsMap[key] = (countsMap[key] || 0) + 1;
            }
        });
        return countsMap;
    }, [allNegotiations]);

    // Group negotiations by Customer (just like customer side groups by supplier/contact)
    // to keep the sidebar clean with 1 row per customer contact, with quotes accessible in the details panel.
    const customerGroups = useMemo(() => {
        const groupMap = new Map<string, {
            rep: NegotiationItem;
            quotes: NegotiationItem[];
            totalUnreadCount: number;
            hasUnread: boolean;
            isPinned: boolean;
            isExisting: boolean;
            latestTime: string;
            latestPreview: string;
        }>();

        allNegotiations.forEach((item) => {
            const custId = item.raw?.customer_id || item.raw?.user_id;
            const custKey = custId ? `cust_${custId}` : (item.customer || 'Customer').trim().toLowerCase();

            const isItemActive = String(item.rawId) === String(activeNegotiation?.rawId) || String(item.id) === String(activeNegotiation?.id);
            const isRead = Boolean(readChatIds[item.rawId] || readChatIds[String(item.rawId)] || isItemActive);
            const itemUnread = isRead ? 0 : Number(item.unreadCount || 0);

            const isItemExisting = Boolean(
                item.isBooked ||
                item.isCompleted ||
                item.hasOrder ||
                item.orderNumber ||
                item.orderId ||
                item.status === 'Booked' ||
                item.status === 'Completed' ||
                item.statusRaw === 'booked' ||
                item.statusRaw === 'completed'
            );

            const isPinned = Boolean(pinnedChatIds[item.rawId] || pinnedChatIds[String(item.rawId)]);

            // Messages for thread
            const thread = messagesHook.chatMessages?.[item.rawId] || messagesHook.chatMessages?.[String(item.rawId)] || messagesHook.chatMessages?.[item.id] || [];
            const lastMsg = thread && thread.length > 0 ? thread[thread.length - 1] : null;

            let itemTime = item.lastUpdated || item.requestDate || '';
            let itemPreview = item.notes || '';
            if (lastMsg) {
                const isMe = Boolean(
                    lastMsg.type === 'sent' ||
                    lastMsg.sender === 'supplier' ||
                    (lastMsg as any).sender_type === 'supplier' ||
                    (lastMsg as any).is_me === true ||
                    (lastMsg as any).isMe === true
                );
                let text = (lastMsg.text || (lastMsg as any).message || '').trim();
                if (!text && lastMsg.attachments && lastMsg.attachments.length > 0) {
                    text = '📎 Attachment';
                } else if (!text && lastMsg.type === 'offer') {
                    text = `Revised Offer: € ${lastMsg.newTotal || (lastMsg as any).amount || ''}`;
                }
                if (text) itemPreview = isMe ? `You: ${text}` : text;
                if (lastMsg.time) itemTime = lastMsg.time;
            }

            if (!groupMap.has(custKey)) {
                groupMap.set(custKey, {
                    rep: { ...item },
                    quotes: [item],
                    totalUnreadCount: itemUnread,
                    hasUnread: itemUnread > 0,
                    isPinned: isPinned,
                    isExisting: isItemExisting,
                    latestTime: itemTime,
                    latestPreview: itemPreview,
                });
            } else {
                const g = groupMap.get(custKey)!;
                g.quotes.push(item);
                g.totalUnreadCount += itemUnread;
                g.hasUnread = g.hasUnread || itemUnread > 0;
                g.isPinned = g.isPinned || isPinned;
                g.isExisting = g.isExisting || isItemExisting;

                // If this item is currently active, prioritize it as the representative item
                if (isItemActive) {
                    g.rep = { ...item };
                }
                if (lastMsg) {
                    g.latestTime = itemTime;
                    g.latestPreview = itemPreview;
                }
            }
        });

        return Array.from(groupMap.values()).map(g => ({
            ...g.rep,
            unreadCount: g.totalUnreadCount,
            isOnline: g.quotes.some(q => q.isOnline),
            notes: g.latestPreview || g.rep.notes,
            lastUpdated: g.latestTime || g.rep.lastUpdated,
            allCustomerQuotes: g.quotes,
            groupIsPinned: g.isPinned,
            groupIsExisting: g.isExisting,
            groupHasUnread: g.hasUnread,
        }));
    }, [allNegotiations, activeNegotiation, messagesHook.chatMessages, readChatIds, pinnedChatIds]);


    // Counts for tabs based on grouped customer contacts
    const counts = useMemo(() => {
        let newCount = 0;
        let existingCount = 0;
        let unreadCount = 0;
        let awaitingPaymentCount = 0;
        let counterOffersCount = 0;
        let bookedCount = 0;
        let pinnedCount = 0;

        customerGroups.forEach((group) => {
            const quotes = group.allCustomerQuotes || [];
            if (quotes.some(isSupplierQuoteBooked)) bookedCount++;
            if (quotes.some(isSupplierQuoteAwaitingPayment)) awaitingPaymentCount++;
            if (quotes.some(isSupplierQuoteCounterOffer)) counterOffersCount++;
            if (group.groupIsPinned || quotes.some((q: any) => q.isPinned)) pinnedCount++;
            if (group.groupIsExisting) existingCount++;
            else newCount++;

            if (group.groupHasUnread) unreadCount++;
        });

        return {
            all: customerGroups.length,
            new: newCount,
            existing: existingCount,
            unread: unreadCount,
            awaiting_payment: awaitingPaymentCount,
            counter_offers: counterOffersCount,
            booked: bookedCount,
            pinned: pinnedCount,
        };
    }, [customerGroups]);

    const filteredChats = useMemo(() => {
        return customerGroups
            .filter((group) => {
                const searchLower = searchQuery.toLowerCase().trim();
                const matches =
                    !searchLower ||
                    group.customer.toLowerCase().includes(searchLower) ||
                    (group.allCustomerQuotes || []).some(q =>
                        (q.quoteId && q.quoteId.toLowerCase().includes(searchLower)) ||
                        (q.orderNumber && String(q.orderNumber).toLowerCase().includes(searchLower)) ||
                        (q.pickup && q.pickup.toLowerCase().includes(searchLower)) ||
                        (q.delivery && q.delivery.toLowerCase().includes(searchLower)) ||
                        (q.notes && q.notes.toLowerCase().includes(searchLower))
                    );

                if (!matches) return false;

                const quotes = group.allCustomerQuotes || [];
                if (filterTab === 'unread') return group.groupHasUnread;
                if (filterTab === 'new') return !group.groupIsExisting;
                if (filterTab === 'existing') return group.groupIsExisting;
                if (filterTab === 'awaiting_payment') return quotes.some(isSupplierQuoteAwaitingPayment);
                if (filterTab === 'counter_offers') return quotes.some(isSupplierQuoteCounterOffer);
                if (filterTab === 'booked') return quotes.some(isSupplierQuoteBooked);
                if (filterTab === 'pinned') return group.groupIsPinned || quotes.some((q: any) => q.isPinned);
                return true;
            })
            .sort((a, b) => {
                if (sortBy === 'unread_first') {
                    const diff = (b.groupHasUnread ? 1 : 0) - (a.groupHasUnread ? 1 : 0);
                    if (diff !== 0) return diff;
                } else if (sortBy === 'amount_high') {
                    const getAmt = (g: any) => Math.max(0, ...(g.allCustomerQuotes || []).map((q: any) => q.amount_raw || q.amount || 0));
                    const diff = getAmt(b) - getAmt(a);
                    if (diff !== 0) return diff;
                } else if (sortBy === 'amount_low') {
                    const getAmt = (g: any) => Math.min(...(g.allCustomerQuotes || []).map((q: any) => q.amount_raw || q.amount || 999999));
                    const diff = getAmt(a) - getAmt(b);
                    if (diff !== 0) return diff;
                }
                return (b.groupIsPinned ? 1 : 0) - (a.groupIsPinned ? 1 : 0);
            });
    }, [customerGroups, searchQuery, filterTab, sortBy]);

    return {
        sessionKey,
        searchQuery, setSearchQuery,
        filterTab, setFilterTab,
        sortBy, setSortBy,
        counts,
        repeatCustomerMap,
        showMobileDetails, setShowMobileDetails,
        allNegotiations,
        activeNegotiation,
        pinnedChatIds,
        readChatIds,
        filteredChats,
        handleSelectChat,
        togglePinChat,
        isLoading,
        ...messagesHook
    };
}
