import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useGeneralMessages from '@/hooks/useGeneralMessages';
import { MessageAttachment, ConversationUser } from '@/services/messageService';
import { decryptId, encryptId } from '@/lib/encryption';
import { GeneralChatSidebar } from './components/GeneralChatSidebar';
import { GeneralChatDetailsPanel } from './components/GeneralChatDetailsPanel';
import { GeneralChatImageLightbox } from './components/GeneralChatImageLightbox';
import { NewMessageModal } from './components/NewMessageModal';
import { GeneralChatStreamHeader } from './components/GeneralChatStreamHeader';
import { GeneralChatMessagesArea } from './components/GeneralChatMessagesArea';
import { GeneralChatInputBar } from './components/GeneralChatInputBar';
import { GeneralChatEmptyView } from './components/GeneralChatEmptyView';

interface SharedMessagesProps {
    role: 'supplier' | 'customer';
}

export const SharedMessages: React.FC<SharedMessagesProps> = ({ role }) => {
    const { partnerId } = useParams<{ partnerId?: string }>();
    const navigate = useNavigate();

    const rawPartnerId = useMemo(() => {
        if (!partnerId) return undefined;
        return decryptId(partnerId);
    }, [partnerId]);

    const {
        conversations,
        directoryUsers,
        isLoadingConversations,
        isLoadingMessages,
        isChatLoaded,
        isSending,
        activePartnerId,
        activePartner,
        messages,
        selectPartner,
        startNewConversation,
        fetchConversations,
        fetchDirectoryUsers,
        sendMessage,
        deleteMessage
    } = useGeneralMessages(rawPartnerId, role);

    const [searchQuery, setSearchQuery] = useState('');
    const [filterTab, setFilterTab] = useState<'all' | 'unread'>('all');
    const [showDetailsPanel, setShowDetailsPanel] = useState(false);
    const [lightboxImages, setLightboxImages] = useState<MessageAttachment[]>([]);
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
    const [isNewMessageModalOpen, setIsNewMessageModalOpen] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const basePath = role === 'supplier' ? '/supplier/messages' : '/customer/messages';

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoadingMessages]);

    const handleSelectPartner = (partnerItem: any) => {
        const uid = partnerItem.user?.id || partnerItem.partner_id || partnerItem.id;
        selectPartner(uid, partnerItem.user);
        navigate(`${basePath}/${encryptId(uid)}/ses-${uid}`);
    };

    const handleSelectDirectoryUser = (user: ConversationUser) => {
        selectPartner(user.id, user);
        navigate(`${basePath}/${encryptId(user.id)}/ses-${user.id}`);
    };

    const handleStartNewConversation = (user: ConversationUser) => {
        setIsNewMessageModalOpen(false);
        navigate(`${basePath}/${encryptId(user.id)}/ses-${user.id}`);
        startNewConversation(user);
    };

    const effectivePartner: any = activePartner ||
        conversations.find(c => String(c.user?.id || (c as any).partner_id || (c as any).id) === String(activePartnerId))?.user ||
        directoryUsers.find(u => String(u?.id) === String(activePartnerId)) ||
        (activePartnerId ? { id: Number(activePartnerId), name: 'Partner', user_type: role === 'supplier' ? 'customer' : 'supplier' } : null);

    return (
        <div className="p-2 sm:p-4 md:p-6 w-full mx-auto h-[calc(100vh-64px)] max-h-[calc(100vh-64px)] flex flex-col font-sans box-border overflow-hidden">
            <div className="flex flex-1 min-h-0 h-full bg-white dark:bg-[#12161c] border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm relative">
                
                {/* Left Sidebar: Conversations list */}
                <div className={`w-full lg:w-[320px] xl:w-[360px] 2xl:w-[380px] shrink-0 h-full ${activePartnerId ? 'hidden lg:flex' : 'flex'}`}>
                    <GeneralChatSidebar
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        filterTab={filterTab}
                        setFilterTab={setFilterTab}
                        conversations={conversations}
                        directoryUsers={directoryUsers}
                        activePartnerId={activePartnerId}
                        onSelectPartner={handleSelectPartner}
                        onSelectDirectoryUser={handleSelectDirectoryUser}
                        onOpenNewMessage={() => setIsNewMessageModalOpen(true)}
                        role={role}
                        isLoading={isLoadingConversations}
                        onRefresh={() => {
                            fetchConversations();
                            fetchDirectoryUsers();
                        }}
                    />
                </div>

                {/* Center: Active Chat Stream */}
                <div className={`flex-1 flex flex-col min-h-0 min-w-0 h-full bg-slate-50/60 dark:bg-[#0e1217] ${!activePartnerId ? 'hidden lg:flex' : 'flex'}`}>
                    {!activePartnerId ? (
                        <GeneralChatEmptyView />
                    ) : (
                        <>
                            <GeneralChatStreamHeader
                                partner={effectivePartner}
                                onBack={() => navigate(basePath)}
                                showDetailsPanel={showDetailsPanel}
                                onToggleDetailsPanel={() => setShowDetailsPanel(prev => !prev)}
                            />

                            <GeneralChatMessagesArea
                                messages={messages}
                                isLoadingMessages={isLoadingMessages}
                                isChatLoaded={isChatLoaded}
                                partner={effectivePartner}
                                messagesEndRef={messagesEndRef}
                                onOpenLightbox={(imgs, idx) => {
                                    setLightboxImages(imgs);
                                    setLightboxIndex(idx);
                                }}
                                onDeleteMessage={deleteMessage}
                            />

                            <GeneralChatInputBar
                                onSendMessage={(text, files) => sendMessage({ receiver_id: Number(activePartnerId), message: text, attachments: files })}
                                isSending={isSending}
                            />
                        </>
                    )}
                </div>

                {/* Right: Details Panel */}
                {activePartnerId && showDetailsPanel && (
                    <div className="w-[300px] xl:w-[320px] 2xl:w-[340px] shrink-0 h-full border-l border-slate-200 dark:border-slate-800 z-10 flex">
                        <GeneralChatDetailsPanel
                            partner={effectivePartner}
                            messages={messages}
                            isLoading={isLoadingMessages}
                            onClose={() => setShowDetailsPanel(false)}
                            onOpenImageLightbox={(imgs, idx) => {
                                setLightboxImages(imgs);
                                setLightboxIndex(idx);
                            }}
                        />
                    </div>
                )}
            </div>

            {lightboxIndex !== null && lightboxImages.length > 0 && (
                <GeneralChatImageLightbox
                    images={lightboxImages}
                    currentIndex={lightboxIndex}
                    onClose={() => setLightboxIndex(null)}
                    onNext={() => setLightboxIndex((lightboxIndex + 1) % lightboxImages.length)}
                    onPrev={() => setLightboxIndex((lightboxIndex - 1 + lightboxImages.length) % lightboxImages.length)}
                />
            )}

            <NewMessageModal
                isOpen={isNewMessageModalOpen}
                onClose={() => setIsNewMessageModalOpen(false)}
                directoryUsers={directoryUsers}
                conversations={conversations}
                onSelectUser={handleStartNewConversation}
                isLoading={isLoadingConversations}
                onRefresh={fetchDirectoryUsers}
                role={role}
            />
        </div>
    );
};

export default SharedMessages;
