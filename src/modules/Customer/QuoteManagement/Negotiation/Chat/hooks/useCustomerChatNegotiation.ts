import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { decryptId } from '@/lib/encryption';
import { useCustomerNegotiations } from '../../hooks/useCustomerNegotiations';
import { CustomerChatItem } from '../types';

export function useCustomerChatNegotiation() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [filterTab, setFilterTab] = useState<'all' | 'unread'>('all');
    const { negotiations: dynamicNegotiations, isLoading } = useCustomerNegotiations();

    const allNegotiations = useMemo(() => {
        return Array.isArray(dynamicNegotiations) ? dynamicNegotiations : [];
    }, [dynamicNegotiations]);

    const resolvedActiveRawId = useMemo(() => {
        if (!id) return allNegotiations[0]?.rawId || '';
        const decrypted = decryptId(id);
        const rawNum = Number(String(decrypted).replace(/[^0-9]/g, ''));
        const matched = allNegotiations.find(n =>
            n.rawId === rawNum ||
            String(n.rawId) === String(decrypted) ||
            n.sessionKey === id ||
            n.id === decrypted ||
            n.id === id ||
            (n as any).slug === id
        );
        return matched?.rawId || rawNum || allNegotiations[0]?.rawId || '';
    }, [id, allNegotiations]);

    const [activeChatId, setActiveChatId] = useState<number | string>(resolvedActiveRawId);

    useEffect(() => {
        if (resolvedActiveRawId) {
            setActiveChatId(resolvedActiveRawId);
        } else if (allNegotiations.length > 0 && !activeChatId) {
            setActiveChatId(allNegotiations[0].rawId);
        }
    }, [resolvedActiveRawId, allNegotiations]);

    const chats: CustomerChatItem[] = useMemo(() => {
        return allNegotiations.map(n => {
            const isTargetActive = String(n.rawId) === String(activeChatId);
            return {
                id: n.rawId,
                name: n.supplier || n.customer || '',
                avatar: (n.supplier || n.customer || 'C').charAt(0).toUpperCase(),
                preview: n.notes || `${n.pickup} → ${n.delivery}`,
                time: n.lastUpdated || n.requestDate || '',
                unreadCount: n.unreadCount || 0,
                unread: (n.unreadCount || 0) > 0,
                active: isTargetActive,
                quoteNo: n.quoteId || (typeof n.id === 'string' && n.id.startsWith('QT-') ? n.id : `QT-${String(n.rawId).padStart(4, '0')}`),
                baseFreight: `€ ${Number(n.currentOffer || n.originalAmount || 0).toLocaleString()}`,
                isVerified: true,
                isPinned: Boolean(n.priority === 'Urgent'),
                raw: n,
                routeText: `${n.pickup} → ${n.delivery}`,
                origin: n.origin || n.pickup,
                destination: n.destination || n.delivery,
                distance: n.distance || '—',
                currentPrice: Number(n.currentOffer || n.originalAmount || 0),
                vehicleType: n.vehicleType || '—'
            };
        });
    }, [allNegotiations, activeChatId]);

    const activeChat = useMemo(() => {
        return chats.find(c => String(c.id) === String(activeChatId)) || chats[0] || null;
    }, [chats, activeChatId]);

    const filteredChats = useMemo(() => {
        return chats
            .filter(chat => {
                const matchesSearch = chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    chat.preview.toLowerCase().includes(searchQuery.toLowerCase());
                if (filterTab === 'unread') {
                    return matchesSearch && (chat.unread || chat.unreadCount > 0);
                }
                return matchesSearch;
            })
            .sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));
    }, [chats, searchQuery, filterTab]);

    const handleSelectChat = (chatId: number | string) => {
        setActiveChatId(chatId);
    };

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
        filteredChats,
        handleSelectChat
    };
}
