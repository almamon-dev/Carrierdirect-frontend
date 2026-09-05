import React, { useEffect } from 'react';
import { useCustomerChatNegotiation } from './hooks/useCustomerChatNegotiation';
import { useCustomerChatMessages } from './hooks/useCustomerChatMessages';
import { CustomerChatSidebar } from './components/CustomerChatSidebar';
import { CustomerChatDetailsPanel } from './components/CustomerChatDetailsPanel';
import { CustomerChatSkeletonLoader } from './components/CustomerChatSkeletonLoader';
import { CustomerChatCenterPanel } from './components/CustomerChatCenterPanel';

export default function CustomerNegotiationChat() {
    const [showDetailsPanel, setShowDetailsPanel] = React.useState(true);
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

    useEffect(() => {
        if (isSupplierTyping) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [isSupplierTyping]);

    if (isLoading && allNegotiations.length === 0) {
        return <CustomerChatSkeletonLoader />;
    }

    return (
        <div className="p-4 md:p-6 w-full mx-auto h-[calc(100vh-64px)] flex flex-col font-sans">
            <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 min-h-[500px] bg-white dark:bg-[#12161c] border border-slate-200 dark:border-slate-800 rounded-md overflow-hidden shadow-sm">
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
        </div>
    );
}
