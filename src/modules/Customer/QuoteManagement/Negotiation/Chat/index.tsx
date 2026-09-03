import React, { useEffect } from 'react';
import { FileText, Info } from 'lucide-react';
import Button from '@/components/ui/button';
import ChatInputActions from '../Actions';
import { useCustomerChatNegotiation } from './hooks/useCustomerChatNegotiation';
import { useCustomerChatMessages } from './hooks/useCustomerChatMessages';
import { CustomerChatSidebar } from './components/CustomerChatSidebar';
import { CustomerChatMessageBubble } from './components/CustomerChatMessageBubble';
import { CustomerChatDetailsPanel } from './components/CustomerChatDetailsPanel';
import { CustomerChatSkeletonLoader } from './components/CustomerChatSkeletonLoader';

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

                {/* Left Sidebar: Chats List */}
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

                {/* Center / Main Chat Area */}
                <div className={`${showDetailsPanel ? 'xl:col-span-6 lg:col-span-8' : 'lg:col-span-8 xl:col-span-9'} flex flex-col min-h-0 h-full border-r border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0b1016]`}>
                    {!activeChat ? (
                        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
                            <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                                <FileText size={24} className="text-slate-400" />
                            </div>
                            <h3 className="text-base font-bold text-slate-700 dark:text-slate-200">No Negotiation Selected</h3>
                            <p className="text-xs text-slate-400 max-w-sm mt-1">Select a quotation chat from the list to view negotiation history and submit counter offers.</p>
                        </div>
                    ) : (
                        <>
                            {/* Chat Header */}
                            <div className="h-16 px-4 sm:px-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-[#12161c] shrink-0">
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-950/60 border border-orange-200 dark:border-orange-900/60 flex items-center justify-center font-bold text-[#FF4A1F] text-sm shrink-0 shadow-2xs">
                                        {activeChat.avatar}
                                    </div>
                                    <div className="min-w-0">
                                        <h2 className="text-[13.5px] font-bold text-slate-900 dark:text-white truncate">{activeChat.name}</h2>
                                        <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate">{activeChat.quoteNo} • {activeChat.routeText}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowDetailsPanel(prev => !prev)}
                                        className={`h-8 w-8 rounded-full flex items-center justify-center cursor-pointer transition-colors border ${
                                            showDetailsPanel
                                                ? 'bg-orange-50 text-[#FF4A1F] border-orange-200 shadow-2xs dark:bg-orange-950/40 dark:text-orange-400 dark:border-orange-900/50'
                                                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 border-slate-200/80 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                                        }`}
                                        title={showDetailsPanel ? 'Hide Quote Details' : 'Show Quote Details'}
                                    >
                                        <Info size={16} />
                                    </button>
                                </div>
                            </div>

                            {/* Messages Scroll Area */}
                            <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 space-y-3 [&::-webkit-scrollbar]:hidden">
                                {currentMessages.map((msg, index) => {
                                    const prevMsg = index > 0 ? currentMessages[index - 1] : null;
                                    const nextMsg = index < currentMessages.length - 1 ? currentMessages[index + 1] : null;
                                    const isFirstInGroup = !prevMsg || prevMsg.type !== msg.type || prevMsg.sender !== msg.sender;
                                    const isLastInGroup = !nextMsg || nextMsg.type !== msg.type || nextMsg.sender !== msg.sender;
                                    const spacingClass = isFirstInGroup ? 'mt-4' : 'mt-1';

                                    return (
                                        <CustomerChatMessageBubble
                                            key={msg.id}
                                            msg={msg}
                                            activeChat={activeChat}
                                            isFirstInGroup={isFirstInGroup}
                                            isLastInGroup={isLastInGroup}
                                            spacingClass={spacingClass}
                                            editingMsgId={editingMsgId}
                                            onAcceptOffer={handleAcceptOffer}
                                            onRejectOffer={handleRejectOffer}
                                            onSendCounterOffer={handleSendCounterOffer}
                                            onStartEdit={handleStartEdit}
                                            onDeleteMessage={handleDeleteMessage}
                                            onTogglePinMessage={handleTogglePinMessage}
                                        />
                                    );
                                })}

                                {/* Supplier Typing Bubble */}
                                {isSupplierTyping && activeChat && (
                                    <div className="flex gap-2.5 justify-start mt-3 mb-3 items-center animate-in fade-in slide-in-from-bottom-2 duration-200">
                                        <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 font-bold text-xs shrink-0 shadow-2xs">
                                            {activeChat.avatar ? (
                                                <img src={activeChat.avatar} alt={activeChat.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <span>{(activeChat.name || 'S').charAt(0).toUpperCase()}</span>
                                            )}
                                        </div>
                                        <div className="bg-slate-100 dark:bg-slate-800 px-3.5 py-2 rounded-2xl rounded-tl-xs flex items-center gap-1.5 shadow-2xs border border-slate-200/80 dark:border-slate-700">
                                            <span className="w-2 h-2 bg-[#00a884] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                            <span className="w-2 h-2 bg-[#00a884] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                            <span className="w-2 h-2 bg-[#00a884] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                        </div>
                                        <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                                            {activeChat.name} is typing...
                                        </span>
                                    </div>
                                )}

                                <div ref={messagesEndRef} className="mt-4" />
                            </div>

                            {/* Chat Input Bar */}
                            <ChatInputActions
                                inputValue={inputValue}
                                setInputValue={setInputValue}
                                scrollToBottom={scrollToBottom}
                                onSendMessage={handleSendMessage}
                                onSendCounterOffer={handleSendCounterOffer}
                                onTyping={notifyTyping}
                                isEditing={!!editingMsgId}
                                onCancelEdit={handleCancelEdit}
                            />
                        </>
                    )}
                </div>

                {/* Right Sidebar: Details Panel */}
                <CustomerChatDetailsPanel activeChat={activeChat} currentMessages={currentMessages} showDetailsPanel={showDetailsPanel} />

            </div>
        </div>
    );
}
