import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGeneralMessages } from '@/hooks/useGeneralMessages';
import { ConversationUser, MessageAttachment, GeneralMessage } from '@/services/messageService';
import { decryptId, encryptId } from './sharedMessagesIdUtils';

export const useSharedMessagesState = (role: 'supplier' | 'customer' | 'driver') => {
    const { partnerId: routePartnerHash } = useParams<{ partnerId?: string }>();
    const navigate = useNavigate();
    const rawPartnerId = decryptId(routePartnerHash);

    const generalMessages = useGeneralMessages(rawPartnerId, role);

    const [searchQuery, setSearchQuery] = useState('');
    const [filterTab, setFilterTab] = useState<'all' | 'unread'>('all');
    const [showDetailsPanel, setShowDetailsPanel] = useState(false);
    const [detailsPanelInitialTab, setDetailsPanelInitialTab] = useState<'profile' | 'pinned' | 'photos' | 'docs'>('profile');
    const [lightboxImages, setLightboxImages] = useState<MessageAttachment[]>([]);
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
    const [isNewMessageModalOpen, setIsNewMessageModalOpen] = useState(false);
    const [replyingTo, setReplyingTo] = useState<GeneralMessage | null>(null);
    const [editingMessage, setEditingMessage] = useState<GeneralMessage | null>(null);

    const basePath = role === 'driver' ? '/driver/chat' : role === 'supplier' ? '/supplier/messages' : '/customer/messages';

    useEffect(() => {
        window.scrollTo(0, 0);
        const mainEl = document.querySelector('main');
        if (mainEl) {
            mainEl.scrollTop = 0;
        }
    }, []);

    const handleSelectPartner = (partnerItem: any) => {
        const uid = partnerItem.user?.id || partnerItem.partner_id || partnerItem.id;
        setReplyingTo(null);
        setEditingMessage(null);
        generalMessages.selectPartner(uid, partnerItem.user);
        navigate(`${basePath}/${encryptId(uid)}/ses-${uid}`);
    };

    const handleSelectDirectoryUser = (user: ConversationUser) => {
        setReplyingTo(null);
        setEditingMessage(null);
        generalMessages.selectPartner(user.id, user);
        navigate(`${basePath}/${encryptId(user.id)}/ses-${user.id}`);
    };

    const handleStartNewConversation = (user: ConversationUser) => {
        setReplyingTo(null);
        setEditingMessage(null);
        setIsNewMessageModalOpen(false);
        navigate(`${basePath}/${encryptId(user.id)}/ses-${user.id}`);
        generalMessages.startNewConversation(user);
    };

    const handleStartEditMessage = (msg: GeneralMessage) => {
        setReplyingTo(null);
        setEditingMessage(msg);
    };

    const convPartner = generalMessages.conversations.find(
        (c) => Number(c.user?.id || (c as any).partner_id || (c as any).id) === Number(generalMessages.activePartnerId)
    )?.user;
    const dirPartner = generalMessages.directoryUsers.find((u) => Number(u?.id) === Number(generalMessages.activePartnerId));

    const effectivePartner: any = (() => {
        if (!generalMessages.activePartnerId) return null;
        const fallback = {
            id: Number(generalMessages.activePartnerId),
            name: 'Partner',
            company_name: 'Partner',
            user_type: role === 'supplier' ? 'customer' : role === 'driver' ? 'dispatcher' : 'supplier',
            is_verified: false,
            is_online: false,
            last_seen_human: 'Offline',
        };
        return {
            ...fallback,
            ...(generalMessages.activePartner || {}),
            ...(dirPartner || {}),
            ...(convPartner || {}),
        };
    })();

    return {
        ...generalMessages,
        basePath,
        searchQuery,
        setSearchQuery,
        filterTab,
        setFilterTab,
        showDetailsPanel,
        setShowDetailsPanel,
        detailsPanelInitialTab,
        setDetailsPanelInitialTab,
        lightboxImages,
        setLightboxImages,
        lightboxIndex,
        setLightboxIndex,
        isNewMessageModalOpen,
        setIsNewMessageModalOpen,
        replyingTo,
        setReplyingTo,
        editingMessage,
        setEditingMessage,
        handleSelectPartner,
        handleSelectDirectoryUser,
        handleStartNewConversation,
        handleStartEditMessage,
        convPartner,
        dirPartner,
        effectivePartner,
        navigate,
    };
};
