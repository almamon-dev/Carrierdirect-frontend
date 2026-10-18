import React, { useState } from "react";
import { FileText } from "lucide-react";
import { CustomerChatItem, CustomerChatMessage } from "../types";
import { CustomerChatMessageBubble } from "./CustomerChatMessageBubble";
import { CustomerChatTypingIndicator } from "./CustomerChatTypingIndicator";
import { CustomerChatCenterHeader } from "./CustomerChatCenterHeader";
import { CustomerChatMessagesSkeleton } from "./CustomerChatMessagesSkeleton";
import ChatInputActions from "../../Actions";
import CounterOfferModal from "../../Actions/components/CounterOfferModal";

interface CustomerChatCenterPanelProps {
    activeChat: CustomerChatItem | null;
    showDetailsPanel: boolean;
    setShowDetailsPanel: (val: boolean) => void;
    currentMessages: CustomerChatMessage[];
    editingMsgId: number | string | null;
    isSupplierTyping: boolean;
    messagesEndRef: React.RefObject<HTMLDivElement | null>;
    inputValue: string;
    setInputValue: (val: string) => void;
    scrollToBottom: () => void;
    handleSendMessage: (text: string, files?: File[]) => void;
    handleSendCounterOffer: (amount: number, note: string, extraCharges?: any[], baseFreight?: number) => void;
    handleAcceptOffer: (msg: any) => void;
    handleRejectOffer: (msg: any, reason?: string) => void;
    handleTogglePinMessage: (id: number | string) => void;
    handleDeleteMessage: (id: number | string) => void;
    handleStartEdit: (msg: CustomerChatMessage) => void;
    handleCancelEdit: () => void;
    notifyTyping: (isTyping?: boolean) => void;
    isLoading?: boolean;
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
    notifyTyping,
    isLoading = false,
}) => {
    const [showTopCounterModal, setShowTopCounterModal] = useState(false);

    return (
        <div className={`flex-1 min-w-0 flex flex-col min-h-0 h-full bg-[#F8FAFC] dark:bg-[#0f1318] relative ${
            showDetailsPanel ? "border-r border-slate-200 dark:border-slate-800" : ""
        }`}>
            {!activeChat && !isLoading ? (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400 bg-white dark:bg-[#12161c]">
                    <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                        <FileText size={24} className="text-slate-400" />
                    </div>
                    <h3 className="text-base font-bold text-slate-700 dark:text-slate-200">No Negotiation Selected</h3>
                    <p className="text-xs text-slate-400 max-w-sm mt-1">Select a negotiation conversation to view messages and make offers.</p>
                </div>
            ) : (
                <>
                    <CustomerChatCenterHeader
                        activeChat={activeChat}
                        isLoading={isLoading}
                        showDetailsPanel={showDetailsPanel}
                        setShowDetailsPanel={setShowDetailsPanel}
                    />

                    {/* Messages Area */}
                    <div className="flex-1 min-h-0 min-w-0 overflow-y-auto p-2.5 sm:p-4 md:p-6 space-y-3 bg-[#F8FAFC] dark:bg-[#0f1318] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                        {isLoading ? (
                            <CustomerChatMessagesSkeleton />
                        ) : (
                            currentMessages.map((msg, index) => {
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
                                        spacingClass={isFirstInGroup ? "mt-4" : "mt-1"}
                                        editingMsgId={editingMsgId}
                                        onAcceptOffer={handleAcceptOffer}
                                        onRejectOffer={handleRejectOffer}
                                        onSendCounterOffer={handleSendCounterOffer}
                                        onOpenCounterOffer={() => setShowTopCounterModal(true)}
                                        onStartEdit={handleStartEdit}
                                        onDeleteMessage={handleDeleteMessage}
                                        onTogglePinMessage={handleTogglePinMessage}
                                    />
                                );
                            })
                        )}

                        <CustomerChatTypingIndicator isSupplierTyping={isSupplierTyping} activeChat={activeChat} />
                        <div ref={messagesEndRef} className="mt-4" />
                    </div>

                    {/* Chat Input Actions */}
                    <ChatInputActions
                        inputValue={inputValue}
                        setInputValue={setInputValue}
                        scrollToBottom={scrollToBottom}
                        onSendMessage={handleSendMessage}
                        onSendCounterOffer={handleSendCounterOffer}
                        onTyping={notifyTyping}
                        isEditing={!!editingMsgId}
                        onCancelEdit={handleCancelEdit}
                        initialBaseFreight={activeChat?.baseFreightAmount || activeChat?.raw?.base_amount_raw}
                        originalOfferAmount={activeChat?.currentPrice || activeChat?.raw?.amount || activeChat?.raw?.total_price}
                        targetBudget={activeChat?.raw?.budget || activeChat?.raw?.target_budget}
                        carrierName={activeChat?.carrier || activeChat?.company || activeChat?.name}
                        extraCharges={activeChat?.extraCharges || activeChat?.raw?.extra_charges}
                    />

                    {/* Modal */}
                    <CounterOfferModal
                        isOpen={showTopCounterModal}
                        onClose={() => setShowTopCounterModal(false)}
                        isSupplier={false}
                        initialBaseFreight={activeChat?.baseFreightAmount || activeChat?.raw?.base_amount_raw}
                        originalOfferAmount={activeChat?.currentPrice || activeChat?.raw?.amount || activeChat?.raw?.total_price}
                        targetBudget={activeChat?.raw?.budget || activeChat?.raw?.target_budget}
                        carrierName={activeChat?.carrier || activeChat?.company || activeChat?.name}
                        extraCharges={activeChat?.extraCharges || activeChat?.raw?.extra_charges}
                        currency="€"
                        onSubmit={(amt, note, extras, base) => handleSendCounterOffer(amt, note, extras, base)}
                    />
                </>
            )}
        </div>
    );
};
