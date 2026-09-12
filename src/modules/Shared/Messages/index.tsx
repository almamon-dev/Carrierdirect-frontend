import React, { useState, useEffect } from 'react';
import { Pin, X } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGeneralMessages } from '@/hooks/useGeneralMessages';
import { ConversationUser, MessageAttachment, GeneralMessage } from '@/services/messageService';
import { GeneralChatSidebar } from './components/GeneralChatSidebar';
import { GeneralChatStreamHeader } from './components/GeneralChatStreamHeader';
import { GeneralChatMessagesArea } from './components/GeneralChatMessagesArea';
import { GeneralChatInputBar } from './components/GeneralChatInputBar';
import { GeneralChatDetailsPanel } from './components/GeneralChatDetailsPanel';
import { GeneralChatImageLightbox } from './components/GeneralChatImageLightbox';
import { GeneralChatEmptyView } from './components/GeneralChatEmptyView';
import { NewMessageModal } from './components/NewMessageModal';

// Encrypt/decrypt id helper for URL masking
const encryptId = (id: number | string): string => {
    try {
        return btoa(String(id)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    } catch {
        return String(id);
    }
};

const decryptId = (hash?: string): string | undefined => {
    if (!hash) return undefined;
    const str = String(hash).trim();
    if (/^\d+$/.test(str)) return str;
    try {
        let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
        while (base64.length % 4) base64 += "=";
        const decoded = atob(base64);
        if (/^\d+$/.test(decoded)) return decoded;
        return str;
    } catch {
        return str;
    }
};

interface SharedMessagesProps {
    role: 'supplier' | 'customer';
}

export const SharedMessages: React.FC<SharedMessagesProps> = ({ role }) => {
    const { partnerId: routePartnerHash } = useParams<{ partnerId?: string }>();
    const navigate = useNavigate();

    const rawPartnerId = decryptId(routePartnerHash);

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
        editMessage,
        deleteMessage,
        toggleReaction,
        togglePin
    } = useGeneralMessages(rawPartnerId, role);

    const [searchQuery, setSearchQuery] = useState('');
    const [filterTab, setFilterTab] = useState<'all' | 'unread'>('all');
    const [showDetailsPanel, setShowDetailsPanel] = useState(false);
    const [detailsPanelInitialTab, setDetailsPanelInitialTab] = useState<'profile' | 'pinned' | 'photos' | 'docs'>('profile');
    const [lightboxImages, setLightboxImages] = useState<MessageAttachment[]>([]);
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
    const [isNewMessageModalOpen, setIsNewMessageModalOpen] = useState(false);
    const [replyingTo, setReplyingTo] = useState<GeneralMessage | null>(null);
    const [editingMessage, setEditingMessage] = useState<GeneralMessage | null>(null);

    const basePath = role === 'supplier' ? '/supplier/messages' : '/customer/messages';

    // Reset parent/window scroll on mount so page never loads scrolled down
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
        selectPartner(uid, partnerItem.user);
        navigate(`${basePath}/${encryptId(uid)}/ses-${uid}`);
    };

    const handleSelectDirectoryUser = (user: ConversationUser) => {
        setReplyingTo(null);
        setEditingMessage(null);
        selectPartner(user.id, user);
        navigate(`${basePath}/${encryptId(user.id)}/ses-${user.id}`);
    };

    const handleStartNewConversation = (user: ConversationUser) => {
        setReplyingTo(null);
        setEditingMessage(null);
        setIsNewMessageModalOpen(false);
        navigate(`${basePath}/${encryptId(user.id)}/ses-${user.id}`);
        startNewConversation(user);
    };

    const handleStartEditMessage = (msg: GeneralMessage) => {
        setReplyingTo(null);
        setEditingMessage(msg);
    };

    const convPartner = conversations.find(c => Number(c.user?.id || (c as any).partner_id || (c as any).id) === Number(activePartnerId))?.user;
    const dirPartner = directoryUsers.find(u => Number(u?.id) === Number(activePartnerId));

    const effectivePartner: any = (() => {
        if (!activePartnerId) return null;
        const fallback = {
            id: Number(activePartnerId),
            name: 'Partner',
            company_name: 'Partner',
            user_type: role === 'supplier' ? 'customer' : 'supplier',
            is_verified: false,
            is_online: false,
            last_seen_human: 'Offline'
        };
        return {
            ...fallback,
            ...(activePartner || {}),
            ...(dirPartner || {}),
            ...(convPartner || {})
        };
    })();

    return (
        <div className="w-full h-full max-h-full flex flex-col p-1 sm:p-2.5 md:p-4 box-border overflow-hidden">
            <div className="flex flex-1 min-h-0 h-full bg-white dark:bg-[#12161c] border border-slate-200 dark:border-slate-800 rounded-lg sm:rounded-xl overflow-hidden shadow-xs relative">
                
                {/* Left Sidebar: Conversations list */}
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
                                onToggleDetailsPanel={() => setShowDetailsPanel(prev => !prev)}
                            />

                            {/* Dynamic Pinned Messages Bar (Telegram / WhatsApp Style) */}
                            {(() => {
                                const pinnedMessages = messages.filter(m => Boolean(m.is_pinned));
                                if (pinnedMessages.length === 0) return null;
                                const latestPinned = pinnedMessages[pinnedMessages.length - 1];

                                return (
                                    <div className="px-4 py-2 bg-slate-50/95 dark:bg-[#151a21] border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between z-10 animate-in fade-in">
                                        <div
                                            onClick={() => {
                                                const el = document.getElementById(`msg-${latestPinned.id}`);
                                                if (el) {
                                                    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                                    el.classList.remove('highlight-pulse-message');
                                                    void el.offsetWidth;
                                                    el.classList.add('highlight-pulse-message');
                                                    setTimeout(() => el.classList.remove('highlight-pulse-message'), 1800);
                                                }
                                            }}
                                            className="flex items-center gap-2.5 min-w-0 flex-1 cursor-pointer hover:opacity-85 transition-opacity select-none"
                                            title="Click to view pinned message"
                                        >
                                            <Pin size={13} className="text-amber-500 fill-amber-500 shrink-0" />
                                            <div className="min-w-0 flex-1">
                                                <div className="text-[11px] font-semibold text-slate-700 dark:text-slate-200 leading-tight flex items-center gap-1.5">
                                                    <span>Pinned Message</span>
                                                    {pinnedMessages.length > 1 && (
                                                        <span
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setDetailsPanelInitialTab('pinned');
                                                                setShowDetailsPanel(true);
                                                            }}
                                                            className="text-[10px] px-1.5 py-0.2 bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 rounded-full font-bold hover:bg-amber-200 transition-colors"
                                                            title="View all pinned messages in details panel"
                                                        >
                                                            {pinnedMessages.length} pinned (view all)
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="text-[12px] text-slate-500 dark:text-slate-400 truncate leading-tight mt-0.5">
                                                    {latestPinned.message || (latestPinned.attachments?.length ? 'Attachment' : 'Message')}
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => togglePin(latestPinned.id)}
                                            className="text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 p-1 rounded-full hover:bg-slate-200/60 dark:hover:bg-slate-800 cursor-pointer transition-colors shrink-0 ml-2"
                                            title="Unpin message"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                );
                            })()}

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
                                onSendMessage={(text, files, replyToId) => sendMessage({ receiver_id: Number(activePartnerId), message: text, attachments: files, reply_to_id: replyToId })}
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

                {/* Right: Details Panel - Inline on XL+, Slide-over Overlay on mobile/tablet */}
                {activePartnerId && showDetailsPanel && (
                    <>
                        {/* Mobile/Tablet Backdrop */}
                        <div
                            className="xl:hidden fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs"
                            onClick={() => setShowDetailsPanel(false)}
                        />

                        {/* Panel Container */}
                        <div className="fixed xl:static top-0 right-0 bottom-0 z-50 xl:z-10 w-[300px] sm:w-[340px] xl:w-[320px] 2xl:w-[340px] shrink-0 h-full bg-white dark:bg-[#12161c] border-l border-slate-200 dark:border-slate-800 shadow-2xl xl:shadow-none flex flex-col animate-in slide-in-from-right duration-200">
                            <GeneralChatDetailsPanel
                                partner={effectivePartner}
                                messages={messages}
                                isLoading={isLoadingMessages}
                                onTogglePin={togglePin}
                                initialTab={detailsPanelInitialTab}
                                onClose={() => setShowDetailsPanel(false)}
                                onOpenImageLightbox={(imgs, idx) => {
                                    setLightboxImages(imgs);
                                    setLightboxIndex(idx);
                                }}
                            />
                        </div>
                    </>
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
