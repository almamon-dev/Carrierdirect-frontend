import React from 'react';
import { GeneralChatSidebar } from './components/GeneralChatSidebar';
import { GeneralChatStreamHeader } from './components/GeneralChatStreamHeader';
import { GeneralChatMessagesArea } from './components/GeneralChatMessagesArea';
import { GeneralChatInputBar } from './components/GeneralChatInputBar';
import { GeneralChatImageLightbox } from './components/GeneralChatImageLightbox';
import { GeneralChatEmptyView } from './components/GeneralChatEmptyView';
import { NewMessageModal } from './components/NewMessageModal';
import { GeneralChatPinnedMessagesBar } from './components/GeneralChatPinnedMessagesBar';
import { GeneralChatDetailsDrawer } from './components/GeneralChatDetailsDrawer';
import { useSharedMessagesState } from './components/useSharedMessagesState';

interface SharedMessagesProps {
    role: 'supplier' | 'customer' | 'driver';
}

export const SharedMessages: React.FC<SharedMessagesProps> = ({ role }) => {
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
        fetchConversations,
        fetchDirectoryUsers,
        sendMessage,
        editMessage,
        deleteMessage,
        toggleReaction,
        togglePin,
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
    } = useSharedMessagesState(role);

    return (
        <div className="w-full h-full max-h-full flex flex-col p-1 sm:p-2.5 md:p-4 box-border overflow-hidden">
            <div className="flex flex-1 min-h-0 h-full bg-white dark:bg-[#12161c] border border-slate-200 dark:border-slate-800 rounded-lg sm:rounded-xl overflow-hidden shadow-xs relative">
                {/* Left Sidebar */}
                <div className={`w-full lg:w-[320px] xl:w-[360px] shrink-0 h-full ${activePartnerId ? 'hidden lg:flex' : 'flex'}`}>
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
                                onToggleDetailsPanel={() => setShowDetailsPanel((prev) => !prev)}
                                isLoading={Boolean(activePartnerId && !activePartner && !convPartner && !dirPartner && isLoadingConversations)}
                            />

                            <GeneralChatPinnedMessagesBar
                                messages={messages}
                                onOpenAllPinned={() => {
                                    setDetailsPanelInitialTab('pinned');
                                    setShowDetailsPanel(true);
                                }}
                                onTogglePin={togglePin}
                            />

                            <GeneralChatMessagesArea
                                messages={messages}
                                isLoadingMessages={isLoadingMessages}
                                isChatLoaded={isChatLoaded}
                                partner={effectivePartner}
                                onOpenLightbox={(imgs, idx) => {
                                    setLightboxImages(imgs);
                                    setLightboxIndex(idx);
                                }}
                                onStartEditMessage={handleStartEditMessage}
                                onDeleteMessage={deleteMessage}
                                onReplyMessage={(msg) => {
                                    setEditingMessage(null);
                                    setReplyingTo(msg);
                                }}
                                onToggleReaction={toggleReaction}
                                onTogglePin={togglePin}
                            />

                            <GeneralChatInputBar
                                onSendMessage={(text, files, replyToId) =>
                                    sendMessage({
                                        receiver_id: Number(activePartnerId),
                                        message: text,
                                        attachments: files,
                                        reply_to_id: replyToId,
                                    })
                                }
                                isSending={isSending}
                                replyingTo={replyingTo}
                                onCancelReply={() => setReplyingTo(null)}
                                editingMessage={editingMessage}
                                onCancelEdit={() => setEditingMessage(null)}
                                onSaveEdit={editMessage}
                                partnerName={effectivePartner?.name || effectivePartner?.company_name || 'User'}
                            />
                        </>
                    )}
                </div>

                {/* Right: Details Panel Drawer */}
                {activePartnerId && (
                    <GeneralChatDetailsDrawer
                        show={showDetailsPanel}
                        onClose={() => setShowDetailsPanel(false)}
                        partner={effectivePartner}
                        messages={messages}
                        isLoading={isLoadingMessages}
                        initialTab={detailsPanelInitialTab}
                        onTogglePin={togglePin}
                        onOpenImageLightbox={(imgs, idx) => {
                            setLightboxImages(imgs);
                            setLightboxIndex(idx);
                        }}
                    />
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
