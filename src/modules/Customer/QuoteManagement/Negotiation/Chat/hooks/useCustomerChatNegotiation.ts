import { encryptId } from "@/lib/encryption";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCustomerNegotiations } from "../../hooks/useCustomerNegotiations";
import apiClient from "@/lib/axios";
import {
    resolveActiveNegotiationId,
    mapNegotiationsToChats,
    groupChatsBySupplier,
    filterContactGroups,
    filterChats,
    isCustomerQuoteExisting
} from "./chatNegotiationHelpers";
import { CustomerChatFilterTab, CustomerChatItem, CustomerContactGroup } from "../types";

export function useCustomerChatNegotiation() {
    const { id } = useParams<{ id: string; sessionKey?: string }>();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [filterTab, setFilterTab] = useState<CustomerChatFilterTab>("all");
    const { negotiations = [], isLoading = false } = useCustomerNegotiations() || {};

    const allNegotiations = useMemo(() => {
        return Array.isArray(negotiations) ? negotiations : [];
    }, [negotiations]);

    const resolvedActiveRawId = useMemo(() => {
        return resolveActiveNegotiationId(id, allNegotiations);
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
        return mapNegotiationsToChats(allNegotiations, activeChatId, readChatIds);
    }, [allNegotiations, activeChatId, readChatIds]);

    const contactGroups: CustomerContactGroup[] = useMemo(() => {
        return groupChatsBySupplier(chats, activeChatId);
    }, [chats, activeChatId]);

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

    const filteredContactGroups = useMemo(() => {
        return filterContactGroups(contactGroups, searchQuery, filterTab);
    }, [contactGroups, searchQuery, filterTab]);

    const filteredChats = useMemo(() => {
        return filterChats(chats, searchQuery, filterTab);
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

    const counts = useMemo(() => {
        let newCount = 0;
        let existingCount = 0;
        let unreadCount = 0;

        contactGroups.forEach((group) => {
            const hasExisting = group.quotes.some(isCustomerQuoteExisting);
            const hasNew = group.quotes.some(q => !isCustomerQuoteExisting(q));
            if (hasExisting) existingCount++;
            if (hasNew) newCount++;
            if (group.hasUnread && group.totalUnreadCount > 0) unreadCount++;
        });

        return {
            all: contactGroups.length,
            new: newCount,
            existing: existingCount,
            unread: unreadCount,
        };
    }, [contactGroups]);

    return {
        id,
        navigate,
        searchQuery,
        setSearchQuery,
        filterTab,
        setFilterTab,
        counts,
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
