import React, { useEffect, useState, useRef } from "react";
import { useCustomerChatNegotiation } from "./hooks/useCustomerChatNegotiation";
import { useCustomerChatMessages } from "./hooks/useCustomerChatMessages";
import { CustomerChatSidebar } from "./components/CustomerChatSidebar";
import { CustomerChatDetailsPanel } from "./components/CustomerChatDetailsPanel";
import { CustomerChatCenterPanel } from "./components/CustomerChatCenterPanel";
import { QuotePaymentInstructionModal } from "./components/QuotePaymentInstructionModal";
import { checkIsOrderPaid, checkIsQuoteAccepted } from "./utils/customerChatPaymentStatus";

export default function CustomerNegotiationChat() {
    const [showDetailsPanel, setShowDetailsPanel] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);

    const {
        navigate,
        searchQuery,
        setSearchQuery,
        filterTab,
        setFilterTab,
        counts,
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
        handleSelectContact,
        isLoading
    } = useCustomerChatNegotiation();

    const {
        messagesEndRef,
        inputValue,
        setInputValue,
        editingMsgId,
        isSupplierTyping,
        notifyTyping,
        currentMessages,
        chatMessages,
        isMessagesLoading,
        scrollToBottom,
        handleSendMessage,
        handleSendCounterOffer,
        handleAcceptOffer,
        handleRejectOffer,
        handleTogglePinMessage,
        handleDeleteMessage,
        handleStartEdit,
        handleCancelEdit
    } = useCustomerChatMessages(activeChat, allNegotiations);

    const isOrderPaid = checkIsOrderPaid(activeChat, activeChatId, currentMessages);
    const isQuoteAccepted = checkIsQuoteAccepted(activeChat, currentMessages, isOrderPaid);

    const dismissedChatsRef = useRef<Set<string | number>>(new Set());

    useEffect(() => {
        const currentId = activeChat?.id || activeChatId;
        if (isQuoteAccepted && !isOrderPaid && currentId && !dismissedChatsRef.current.has(currentId)) {
            setShowPaymentModal(true);
        } else if (isOrderPaid) {
            setShowPaymentModal(false);
        }
    }, [activeChatId, isQuoteAccepted, isOrderPaid, activeChat?.id]);

    const handleDismissModal = () => {
        if (activeChat) {
            const currentId = activeChat.id || activeChatId;
            dismissedChatsRef.current.add(currentId);
        }
        setShowPaymentModal(false);
    };

    useEffect(() => {
        if (isSupplierTyping) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [isSupplierTyping]);

    const isInitialLoading = isLoading && allNegotiations.length === 0;
    const isChatLoading = isInitialLoading || isMessagesLoading || !activeChat?.id || (!chatMessages[activeChat.id] && !chatMessages[String(activeChat.id)]);

    const targetQuoteId =
        activeChat?.raw?.quote_id ||
        activeChat?.raw?.id ||
        (activeChat as any)?.quoteId ||
        activeChat?.id ||
        activeChatId;

    const targetAmount =
        activeChat?.currentPrice ||
        activeChat?.raw?.amount_raw ||
        activeChat?.raw?.amount ||
        45000;

    return (
        <div className="p-0 sm:p-2 md:p-3 w-full mx-auto h-full flex flex-col font-sans min-h-0 overflow-hidden box-border">
            <div className="flex flex-1 min-h-0 min-w-0 bg-white dark:bg-[#12161c] border-0 sm:border border-slate-200 dark:border-slate-800 rounded-none sm:rounded-lg overflow-hidden shadow-none sm:shadow-sm relative">
                <CustomerChatSidebar
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    filterTab={filterTab}
                    setFilterTab={setFilterTab}
                    counts={counts}
                    chats={chats}
                    filteredChats={filteredChats}
                    contactGroups={contactGroups}
                    filteredContactGroups={filteredContactGroups}
                    activeContactGroup={activeContactGroup}
                    activeChatId={activeChatId}
                    chatMessages={chatMessages}
                    handleSelectChat={handleSelectChat}
                    handleSelectContact={handleSelectContact}
                    onBack={() => navigate(-1)}
                    isCollapsed={isSidebarCollapsed}
                    onToggleCollapse={() => setIsSidebarCollapsed(prev => !prev)}
                    isLoading={isInitialLoading}
                />

                <CustomerChatCenterPanel
                    activeChat={activeChat}
                    showDetailsPanel={showDetailsPanel}
                    setShowDetailsPanel={setShowDetailsPanel}
                    currentMessages={currentMessages}
                    editingMsgId={editingMsgId}
                    isSupplierTyping={isSupplierTyping}
                    messagesEndRef={messagesEndRef}
                    inputValue={inputValue}
                    setInputValue={setInputValue}
                    scrollToBottom={scrollToBottom}
                    handleSendMessage={handleSendMessage}
                    handleSendCounterOffer={handleSendCounterOffer}
                    handleAcceptOffer={handleAcceptOffer}
                    handleRejectOffer={handleRejectOffer}
                    handleTogglePinMessage={handleTogglePinMessage}
                    handleDeleteMessage={handleDeleteMessage}
                    handleStartEdit={handleStartEdit}
                    handleCancelEdit={handleCancelEdit}
                    notifyTyping={notifyTyping}
                    isLoading={isChatLoading}
                />

                <CustomerChatDetailsPanel
                    activeChat={activeChat}
                    currentMessages={currentMessages}
                    showDetailsPanel={showDetailsPanel}
                    contactQuotes={contactQuotes}
                    onSelectQuote={handleSelectChat}
                    onClose={() => setShowDetailsPanel(false)}
                />
            </div>

            <QuotePaymentInstructionModal
                isOpen={showPaymentModal}
                onClose={handleDismissModal}
                quoteId={targetQuoteId}
                quoteAmount={targetAmount}
                supplierName={activeChat?.carrier || activeChat?.name || '-'}
                quoteData={activeChat?.raw || activeChat}
            />
        </div>
    );
}
