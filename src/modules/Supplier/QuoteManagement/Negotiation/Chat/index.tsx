import React from 'react';
import { useChatNegotiation } from './hooks/useChatNegotiation';
import { ChatSidebar } from './components/ChatSidebar';
import { ChatHeader } from './components/ChatHeader';
import { ChatMessageList } from './components/ChatMessageList';
import { ChatDetailsSidebar } from './components/ChatDetailsSidebar';
import { CallComingSoonModal } from './components/CallComingSoonModal';
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
        handleRejectOffer
    } = useChatNegotiation();

    const [callModal, setCallModal] = React.useState<{ isOpen: boolean; type: 'audio' | 'video' }>({
        isOpen: false,
        type: 'audio'
    });

    const currentMessages = chatMessages[activeNegotiation.rawId] || [];

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

    return (
        <div className="p-4 md:p-6 w-full mx-auto h-[calc(100vh-64px)] flex flex-col font-sans">
            <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 min-h-[500px] bg-white border border-slate-200 rounded-md overflow-hidden shadow-sm">
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
                />

                {/* Middle Chat Area */}
                <div className="lg:col-span-8 xl:col-span-6 flex flex-col min-h-0 h-full bg-white relative">
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
                        isSupplier={true}
                        isEditing={!!editingMsgId}
                        onCancelEdit={handleCancelEdit}
                        initialBaseFreight={currentPrice}
                        currency={activeNegotiation.currency || '€'}
                    />
                </div>

                {/* Right Details Sidebar */}
                <ChatDetailsSidebar
                    activeNegotiation={activeNegotiation}
                    negotiationStatusMap={negotiationStatusMap}
                    currentPrice={currentPrice}
                    liveOffers={liveOffers}
                    showMobileDetails={showMobileDetails}
                    setShowMobileDetails={setShowMobileDetails}
                    chatMessages={chatMessages}
                    onCallClick={(type) => setCallModal({ isOpen: true, type })}
                />
            </div>

            <CallComingSoonModal
                isOpen={callModal.isOpen}
                onClose={() => setCallModal(prev => ({ ...prev, isOpen: false }))}
                type={callModal.type}
            />
        </div>
    );
}
