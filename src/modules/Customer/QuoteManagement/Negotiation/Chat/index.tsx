import React, { useEffect, useState } from "react";
import { useCustomerChatNegotiation } from "./hooks/useCustomerChatNegotiation";
import { useCustomerChatMessages } from "./hooks/useCustomerChatMessages";
import { CustomerChatSidebar } from "./components/CustomerChatSidebar";
import { CustomerChatDetailsPanel } from "./components/CustomerChatDetailsPanel";
import { CustomerChatSkeletonLoader } from "./components/CustomerChatSkeletonLoader";
import { CustomerChatCenterPanel } from "./components/CustomerChatCenterPanel";
import { QuotePaymentInstructionModal } from "./components/QuotePaymentInstructionModal";

export default function CustomerNegotiationChat() {
    const [showDetailsPanel, setShowDetailsPanel] = useState(true);
    const [showPaymentModal, setShowPaymentModal] = useState(false);

    const {
        navigate,
        searchQuery,
        setSearchQuery,
        filterTab,
        setFilterTab,
        allNegotiations,
        activeChatId,
        chats,
        activeChat,
        filteredChats,
        handleSelectChat,
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

    // Check if the current active chat has an accepted quote but payment is pending
    const isQuoteAccepted = Boolean(
        activeChat?.raw?.status_raw === "accepted" ||
        activeChat?.raw?.status === "accepted" ||
        activeChat?.raw?.revision_status === "accepted" ||
        currentMessages.some((m) => m.type === "quote_request" && m.status === "accepted") ||
        currentMessages.some((m) => m.type === "offer" && m.status === "accepted")
    );

    const isOrderPaid = Boolean(
        activeChat?.raw?.order?.status === "in_progress" ||
        activeChat?.raw?.order?.status === "completed" ||
        activeChat?.raw?.invoice?.status === "paid"
    );

    const dismissedChatsRef = React.useRef<Set<string | number>>(new Set());

    useEffect(() => {
        if (!activeChat) return;
        const currentId = activeChat.id || activeChatId;
        if (isQuoteAccepted && !isOrderPaid && !dismissedChatsRef.current.has(currentId)) {
            setShowPaymentModal(true);
        }
    }, [activeChatId, isQuoteAccepted, isOrderPaid, activeChat]);

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

    if (isLoading && allNegotiations.length === 0) {
        return <CustomerChatSkeletonLoader />;
    }

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
            <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 min-h-0 bg-white dark:bg-[#12161c] border-0 sm:border border-slate-200 dark:border-slate-800 rounded-none sm:rounded-lg overflow-hidden shadow-none sm:shadow-sm">
                <CustomerChatSidebar
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    filterTab={filterTab}
                    setFilterTab={setFilterTab}
                    chats={chats}
                    filteredChats={filteredChats}
                    activeChatId={activeChatId}
                    handleSelectChat={handleSelectChat}
                    onBack={() => navigate(-1)}
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
                />

                <CustomerChatDetailsPanel
                    activeChat={activeChat}
                    currentMessages={currentMessages}
                    showDetailsPanel={showDetailsPanel}
                />
            </div>

            {/* Auto-popup Payment Instruction & Checkout Modal */}
            <QuotePaymentInstructionModal
                isOpen={showPaymentModal}
                onClose={handleDismissModal}
                quoteId={targetQuoteId}
                quoteAmount={targetAmount}
                supplierName={activeChat?.carrier || activeChat?.name || "Carrier Partner"}
                quoteData={activeChat?.raw || activeChat}
            />
        </div>
    );
}
