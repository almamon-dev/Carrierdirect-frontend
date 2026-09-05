import React from 'react';
import { useChatNegotiation } from './hooks/useChatNegotiation';
import { useChatLayout } from './hooks/useChatLayout';
import { ChatSidebar } from './components/ChatSidebar';
import { ChatDetailsSidebar } from './components/ChatDetailsSidebar';
import { CallComingSoonModal } from './components/CallComingSoonModal';
import { ChatSkeletonLoader } from './components/ChatSkeletonLoader';
import { SupplierChatMiddlePanel } from './components/SupplierChatMiddlePanel';
import { generateInitialMessages } from './utils/initialMessages';

export default function SupplierNegotiationChat() {
    const {
        sessionKey, messagesEndRef, inputValue, setInputValue, searchQuery, setSearchQuery,
        filterTab, setFilterTab, editingMsgId, setEditingMsgId, setEditingText, highlightedMsgId,
        setHighlightedMsgId, activePinnedIndex, setActivePinnedIndex, showMobileDetails,
        setShowMobileDetails, isCustomerTyping, notifyTyping, negotiationStatusMap, liveOffers,
        allNegotiations, activeNegotiation, pinnedChatIds, readChatIds, chatMessages, currentPrice,
        filteredChats, scrollToBottom, handleSelectChat, togglePinChat, handleTogglePinMessage,
        handleDeleteMessage, handleSendMessage, handleSendCounterOffer, handleAcceptOffer,
        handleRejectOffer, isLoading
    } = useChatNegotiation();

    const { callModal, setCallModal, isSidebarCollapsed, sidebarWidth, isResizing, toggleSidebarCollapse, handleResizeStart } = useChatLayout();

    if (isLoading && allNegotiations.length === 0) {
        return <ChatSkeletonLoader />;
    }

    const currentMessages = activeNegotiation?.rawId
        ? (chatMessages[activeNegotiation.rawId] || chatMessages[String(activeNegotiation.rawId)] || generateInitialMessages(activeNegotiation))
        : [];

    const scrollToPinnedMessage = (msgId: number | string) => {
        const el = document.getElementById(`msg-bubble-${msgId}`);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setHighlightedMsgId(msgId);
            setTimeout(() => setHighlightedMsgId(null), 2500);
        }
    };

    return (
        <div className={`p-4 md:p-6 w-full mx-auto h-[calc(100vh-64px)] flex flex-col font-sans ${isResizing ? 'select-none cursor-col-resize' : ''}`}>
            <div className="flex flex-1 min-h-[500px] min-w-0 bg-white border border-slate-200 rounded-md overflow-hidden shadow-sm relative">
                <ChatSidebar
                    allNegotiations={allNegotiations} filteredChats={filteredChats} activeNegotiation={activeNegotiation}
                    pinnedChatIds={pinnedChatIds} readChatIds={readChatIds} chatMessages={chatMessages} liveOffers={liveOffers}
                    searchQuery={searchQuery} setSearchQuery={setSearchQuery} filterTab={filterTab} setFilterTab={setFilterTab}
                    handleSelectChat={handleSelectChat} togglePinChat={togglePinChat} isCollapsed={isSidebarCollapsed}
                    onToggleCollapse={toggleSidebarCollapse} sidebarWidth={sidebarWidth} onResizeStart={handleResizeStart} isResizing={isResizing}
                />

                <SupplierChatMiddlePanel
                    activeNegotiation={activeNegotiation} sessionKey={sessionKey} showMobileDetails={showMobileDetails}
                    setShowMobileDetails={setShowMobileDetails} onCallClick={(type) => setCallModal({ isOpen: true, type })}
                    currentMessages={currentMessages} editingMsgId={editingMsgId} highlightedMsgId={highlightedMsgId}
                    activePinnedIndex={activePinnedIndex} setActivePinnedIndex={setActivePinnedIndex} isCustomerTyping={isCustomerTyping}
                    messagesEndRef={messagesEndRef} handleTogglePinMessage={handleTogglePinMessage} handleDeleteMessage={handleDeleteMessage}
                    handleStartEdit={(msg: any) => { setEditingMsgId(msg.id); setEditingText(msg.text); setInputValue(msg.text); }}
                    scrollToPinnedMessage={scrollToPinnedMessage} handleAcceptOffer={handleAcceptOffer} handleRejectOffer={handleRejectOffer}
                    inputValue={inputValue} setInputValue={setInputValue} scrollToBottom={scrollToBottom} handleSendMessage={handleSendMessage}
                    handleSendCounterOffer={handleSendCounterOffer} notifyTyping={notifyTyping}
                    handleCancelEdit={() => { setEditingMsgId(null); setEditingText(''); setInputValue(''); }} currentPrice={currentPrice}
                />

                {activeNegotiation && (
                    <ChatDetailsSidebar
                        activeNegotiation={activeNegotiation} negotiationStatusMap={negotiationStatusMap} currentPrice={currentPrice}
                        liveOffers={liveOffers} showMobileDetails={showMobileDetails} setShowMobileDetails={setShowMobileDetails}
                        chatMessages={{ ...chatMessages, [activeNegotiation.rawId]: currentMessages, [activeNegotiation.id]: currentMessages }}
                        onCallClick={(type) => setCallModal({ isOpen: true, type })}
                    />
                )}
            </div>

            <CallComingSoonModal isOpen={callModal.isOpen} onClose={() => setCallModal(prev => ({ ...prev, isOpen: false }))} type={callModal.type} />
        </div>
    );
}
