import React from 'react';
import { FileText, Info } from 'lucide-react';
import ChatInputActions from '../../Actions';
import { CustomerChatMessageBubble } from './CustomerChatMessageBubble';
import { CustomerChatTypingIndicator } from './CustomerChatTypingIndicator';
import { CustomerChatItem, CustomerChatMessage } from '../types';

interface CustomerChatCenterPanelProps {
    activeChat: CustomerChatItem | null;
    showDetailsPanel: boolean;
    setShowDetailsPanel: React.Dispatch<React.SetStateAction<boolean>>;
    currentMessages: CustomerChatMessage[];
    editingMsgId: string | number | null;
    isSupplierTyping: boolean;
    messagesEndRef: React.RefObject<HTMLDivElement | null>;
    inputValue: string;
    setInputValue: (val: string) => void;
    scrollToBottom: () => void;
    handleSendMessage: (text: string, files?: File[]) => Promise<void> | void;
    handleSendCounterOffer: (amount: number, note: string) => Promise<void> | void;
    handleAcceptOffer: (msg: CustomerChatMessage) => void;
    handleRejectOffer: (msg: CustomerChatMessage, reason?: string) => void;
    handleTogglePinMessage: (id: string | number) => void;
    handleDeleteMessage: (id: string | number) => void;
    handleStartEdit: (msg: CustomerChatMessage) => void;
    handleCancelEdit: () => void;
    notifyTyping: () => void;
}

export const CustomerChatCenterPanel: React.FC<CustomerChatCenterPanelProps> = ({
    activeChat,
    showDetailsPanel,
    setShowDetailsPanel,
    currentMessages,
    editingMsgId,
    isSupplierTyping,
    messagesEndRef,
    inputValue,
    setInputValue,
    scrollToBottom,
    handleSendMessage,
    handleSendCounterOffer,
    handleAcceptOffer,
    handleRejectOffer,
    handleTogglePinMessage,
    handleDeleteMessage,
    handleStartEdit,
    handleCancelEdit,
    notifyTyping
}) => {
    return (
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
                    <div className="h-14 px-4 sm:px-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-[#12161c] shrink-0">
                        <div className="flex items-center gap-3 min-w-0">
                            <div className="relative">
                                <div className="w-9 h-9 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 font-bold text-xs shadow-2xs">
                                    {activeChat.avatar ? (
                                        <img src={activeChat.avatar} alt={activeChat.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <span>{(activeChat.name || 'S').charAt(0).toUpperCase()}</span>
                                    )}
                                </div>
                                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#00a884] border-2 border-white dark:border-[#12161c] rounded-full" />
                            </div>
                            <div className="min-w-0">
                                <h2 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">{activeChat.name}</h2>
                                <p className="text-[11px] text-slate-500 truncate">{activeChat.quoteNo} • {activeChat.routeText}</p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => setShowDetailsPanel(!showDetailsPanel)}
                            className={`p-2 rounded-lg transition-colors cursor-pointer ${
                                showDetailsPanel ? 'bg-slate-100 dark:bg-slate-800 text-[#ff4a1f]' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                            }`}
                            title={showDetailsPanel ? 'Hide Quote Details' : 'Show Quote Details'}
                        >
                            <Info size={16} />
                        </button>
                    </div>

                    <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 space-y-3 [&::-webkit-scrollbar]:hidden">
                        {currentMessages.map((msg, index) => {
                            const prevMsg = index > 0 ? currentMessages[index - 1] : null;
                            const nextMsg = index < currentMessages.length - 1 ? currentMessages[index + 1] : null;
                            const isFirstInGroup = !prevMsg || prevMsg.type !== msg.type || prevMsg.sender !== msg.sender;
                            const isLastInGroup = !nextMsg || nextMsg.type !== msg.type || nextMsg.sender !== msg.sender;

                            return (
                                <CustomerChatMessageBubble
                                    key={msg.id}
                                    msg={msg}
                                    activeChat={activeChat}
                                    isFirstInGroup={isFirstInGroup}
                                    isLastInGroup={isLastInGroup}
                                    spacingClass={isFirstInGroup ? 'mt-4' : 'mt-1'}
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

                        <CustomerChatTypingIndicator isSupplierTyping={isSupplierTyping} activeChat={activeChat} />
                        <div ref={messagesEndRef} className="mt-4" />
                    </div>

                    <ChatInputActions
                        inputValue={inputValue}
                        setInputValue={setInputValue}
                        scrollToBottom={scrollToBottom}
                        onSendMessage={handleSendMessage}
                        onSendCounterOffer={handleSendCounterOffer}
                        onTyping={notifyTyping}
                        isEditing={!!editingMsgId}
                        onCancelEdit={handleCancelEdit}
                        originalOfferAmount={activeChat?.currentPrice || activeChat?.raw?.amount || activeChat?.raw?.total_price}
                        targetBudget={activeChat?.raw?.budget || activeChat?.raw?.target_budget}
                        carrierName={activeChat?.carrier || activeChat?.company || activeChat?.name}
                    />
                </>
            )}
        </div>
    );
};
