import React, { useState } from 'react';
import { useChatNegotiation } from './hooks/useChatNegotiation';
import { ChatSidebar } from './components/ChatSidebar';
import { ChatHeader } from './components/ChatHeader';
import { ChatMessageList } from './components/ChatMessageList';
import { ChatDetailsSidebar } from './components/ChatDetailsSidebar';
import { CallComingSoonModal } from './components/CallComingSoonModal';
import { ChatSkeletonLoader } from './components/ChatSkeletonLoader';
import { generateInitialMessages } from './utils/initialMessages';
import ChatInputActions from '@/modules/Customer/QuoteManagement/Negotiation/Actions';

export default function SupplierNegotiationChat() {
    const {
        sessionKey,
        messagesEndRef,
        inputValue, setInputValue,
        searchQuery, setSearchQuery,
        filterTab, setFilterTab,
        editingMsgId, setEditingMsgId,
        editingText, setEditingText,
        highlightedMsgId, setHighlightedMsgId,
        activePinnedIndex, setActivePinnedIndex,
        showMobileDetails, setShowMobileDetails,
        isCustomerTyping,
        notifyTyping,
        negotiationStatusMap,
        liveOffers,
        allNegotiations,
        activeNegotiation,
        pinnedChatIds,
        readChatIds,
        chatMessages,
        currentPrice,
        filteredChats,
        scrollToBottom,
        handleSelectChat,
        togglePinChat,
        handleTogglePinMessage,
        handleDeleteMessage,
        handleSendMessage,
        handleSendCounterOffer,
        handleAcceptOffer,
        handleRejectOffer,
        isLoading
    } = useChatNegotiation();

    const [callModal, setCallModal] = React.useState<{ isOpen: boolean; type: 'audio' | 'video' }>({
        isOpen: false,
        type: 'audio'
    });
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
    const [sidebarWidth, setSidebarWidth] = useState<number>(320);
    const [isResizing, setIsResizing] = useState<boolean>(false);

    if (isLoading && allNegotiations.length === 0) {
        return <ChatSkeletonLoader />;
    }

    const currentMessages = activeNegotiation?.rawId
        ? (chatMessages[activeNegotiation.rawId] || chatMessages[String(activeNegotiation.rawId)] || chatMessages[Number(activeNegotiation.rawId)] || generateInitialMessages(activeNegotiation))
        : [];

    const handleStartEdit = (msg: any) => {
        setEditingMsgId(msg.id);
        setEditingText(msg.text);
        setInputValue(msg.text);
    };

    const handleCancelEdit = () => {
        setEditingMsgId(null);
        setEditingText('');
        setInputValue('');
    };

    const scrollToPinnedMessage = (msgId: number | string) => {
        const el = document.getElementById(`msg-bubble-${msgId}`);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setHighlightedMsgId(msgId);
            setTimeout(() => setHighlightedMsgId(null), 2500);
        }
    };

    const toggleSidebarCollapse = () => {
        setIsSidebarCollapsed(prev => !prev);
    };

    const handleResizeStart = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsResizing(true);
        const startX = e.clientX;
        const startW = sidebarWidth;

        const handleMouseMove = (moveEvent: MouseEvent) => {
            const delta = moveEvent.clientX - startX;
            const newWidth = Math.min(Math.max(startW + delta, 240), 460);
            setSidebarWidth(newWidth);
        };

        const handleMouseUp = () => {
            setIsResizing(false);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    };

    return (
        <div className={`p-4 md:p-6 w-full mx-auto h-[calc(100vh-64px)] flex flex-col font-sans ${isResizing ? 'select-none cursor-col-resize' : ''}`}>
            <div className="flex flex-1 min-h-[500px] min-w-0 bg-white border border-slate-200 rounded-md overflow-hidden shadow-sm relative">
                {/* Left Sidebar */}
                <ChatSidebar
                    allNegotiations={allNegotiations}
                    filteredChats={filteredChats}
                    activeNegotiation={activeNegotiation}
                    pinnedChatIds={pinnedChatIds}
                    readChatIds={readChatIds}
                    chatMessages={chatMessages}
                    liveOffers={liveOffers}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    filterTab={filterTab}
                    setFilterTab={setFilterTab}
                    handleSelectChat={handleSelectChat}
                    togglePinChat={togglePinChat}
                    isCollapsed={isSidebarCollapsed}
                    onToggleCollapse={toggleSidebarCollapse}
                    sidebarWidth={sidebarWidth}
                    onResizeStart={handleResizeStart}
                    isResizing={isResizing}
                />

                {/* Middle Chat Area */}
                <div className="flex-1 min-w-0 flex flex-col min-h-0 h-full bg-white relative">
                    {!activeNegotiation ? (
                        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
                            <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">Select a negotiation to view messages</p>
                        </div>
                    ) : (
                        <>
                            <ChatHeader
                                activeNegotiation={activeNegotiation}
                                sessionKey={sessionKey}
                                showMobileDetails={showMobileDetails}
                                setShowMobileDetails={setShowMobileDetails}
                                onCallClick={(type) => setCallModal({ isOpen: true, type })}
                            />

                            <ChatMessageList
                                currentMessages={currentMessages}
                                activeNegotiation={activeNegotiation}
                                editingMsgId={editingMsgId}
                                highlightedMsgId={highlightedMsgId}
                                activePinnedIndex={activePinnedIndex}
                                setActivePinnedIndex={setActivePinnedIndex}
                                isCustomerTyping={isCustomerTyping}
                                messagesEndRef={messagesEndRef}
                                handleTogglePinMessage={handleTogglePinMessage}
                                handleDeleteMessage={handleDeleteMessage}
                                handleStartEdit={handleStartEdit}
                                scrollToPinnedMessage={scrollToPinnedMessage}
                                handleAcceptOffer={handleAcceptOffer}
                                handleRejectOffer={handleRejectOffer}
                            />

                            <ChatInputActions
                                inputValue={inputValue}
                                setInputValue={setInputValue}
                                scrollToBottom={scrollToBottom}
                                onSendMessage={handleSendMessage}
                                onSendCounterOffer={handleSendCounterOffer}
                                onTyping={notifyTyping}
                                isSupplier={true}
                                isEditing={!!editingMsgId}
                                onCancelEdit={handleCancelEdit}
                                initialBaseFreight={currentPrice}
                                currency="€"
                            />
                        </>
                    )}
                </div>

                {/* Right Details Sidebar */}
                {activeNegotiation && (
                    <ChatDetailsSidebar
                        activeNegotiation={activeNegotiation}
                        negotiationStatusMap={negotiationStatusMap}
                        currentPrice={currentPrice}
                        liveOffers={liveOffers}
                        showMobileDetails={showMobileDetails}
                        setShowMobileDetails={setShowMobileDetails}
                        chatMessages={{ ...chatMessages, [activeNegotiation.rawId]: currentMessages, [activeNegotiation.id]: currentMessages }}
                        onCallClick={(type) => setCallModal({ isOpen: true, type })}
                    />
                )}
            </div>

            <CallComingSoonModal
                isOpen={callModal.isOpen}
                onClose={() => setCallModal(prev => ({ ...prev, isOpen: false }))}
                type={callModal.type}
            />
        </div>
    );
}
