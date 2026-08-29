import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { decryptId, encryptId } from '@/lib/encryption';
import { NegotiationItem } from '../../types';
import { useSupplierNegotiations, SAMPLE_NEGOTIATIONS } from '../../hooks/useSupplierNegotiations';
import { useChatMessages } from './useChatMessages';

export function useChatNegotiation() {
    const { id, sessionKey } = useParams<{ id: string; sessionKey?: string }>();
    const navigate = useNavigate();

    const [searchQuery, setSearchQuery] = useState('');
    const [filterTab, setFilterTab] = useState<'all' | 'unread'>('all');
    const [showMobileDetails, setShowMobileDetails] = useState(false);

    const { negotiations = [], isLoading = false } = useSupplierNegotiations() || {};
    const allNegotiations: NegotiationItem[] = useMemo(() => {
        return Array.isArray(negotiations) ? negotiations : [];
    }, [negotiations]);

    const decryptedRawId = useMemo(() => {
        if (!id) return allNegotiations[0]?.rawId || '';
        const decrypted = decryptId(id);
        const rawNum = Number(String(decrypted).replace(/[^0-9]/g, ''));
        const matched = allNegotiations.find(n =>
            n.rawId === rawNum ||
            String(n.rawId) === String(decrypted) ||
            n.sessionKey === id ||
            n.id === decrypted ||
            n.id === id
        );
        return matched?.rawId || rawNum || allNegotiations[0]?.rawId || '';
    }, [id, allNegotiations]);

    const [activeChatId, setActiveChatId] = useState<number | string>(decryptedRawId);

    useEffect(() => {
        if (decryptedRawId) {
            setActiveChatId(decryptedRawId);
        } else if (allNegotiations.length > 0 && !activeChatId) {
            setActiveChatId(allNegotiations[0].rawId);
        }
    }, [decryptedRawId, allNegotiations]);

    const activeNegotiation = useMemo(() => {
        const found = allNegotiations.find(
            n => String(n.rawId) === String(activeChatId) || n.id === String(activeChatId)
        );
        return found || allNegotiations[0] || null;
    }, [allNegotiations, activeChatId]);

    const [pinnedChatIds, setPinnedChatIds] = useState<Record<string | number, boolean>>({ 1048: true, 2: true });
    const [readChatIds, setReadChatIds] = useState<Record<string | number, boolean>>({ [activeChatId]: true });

    useEffect(() => {
        if (id && (!id.startsWith('enc_') || id.length < 50)) {
            const raw = decryptId(id);
            const encId = encryptId(raw);
            const sKey = sessionKey || activeNegotiation?.sessionKey || `ses-${raw}`;
            navigate(`/supplier/quotes/negotiation/conversation/${encId}/${sKey}`, { replace: true });
        }
    }, [id, sessionKey, activeNegotiation, navigate]);

    const messagesHook = useChatMessages(activeNegotiation, allNegotiations);

    const handleSelectChat = (item: NegotiationItem) => {
        setActiveChatId(item.rawId);
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

    const filteredChats = useMemo(() => {
        return allNegotiations
            .filter((item) => {
                const searchLower = searchQuery.toLowerCase();
                const matches =
                    item.customer.toLowerCase().includes(searchLower) ||
                    item.quoteId.toLowerCase().includes(searchLower) ||
                    item.pickup.toLowerCase().includes(searchLower) ||
                    item.delivery.toLowerCase().includes(searchLower);
                const isUnread = !readChatIds[item.rawId] && (item.unreadCount || 0) > 0;
                return filterTab === 'unread' ? matches && isUnread : matches;
            })
            .sort((a, b) => (pinnedChatIds[b.rawId] ? 1 : 0) - (pinnedChatIds[a.rawId] ? 1 : 0));
    }, [allNegotiations, searchQuery, filterTab, readChatIds, pinnedChatIds]);

    return {
        sessionKey,
        searchQuery, setSearchQuery,
        filterTab, setFilterTab,
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
