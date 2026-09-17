import React, { useState } from "react";
import { Info, FileText } from "lucide-react";
import { CustomerChatItem, CustomerChatMessage } from "../types";
import { CustomerChatMessageBubble } from "./CustomerChatMessageBubble";
import { CustomerChatTypingIndicator } from "./CustomerChatTypingIndicator";
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
    handleSendCounterOffer: (amount: number, note: string) => void;
    handleAcceptOffer: (msg: any) => void;
    handleRejectOffer: (msg: any, reason?: string) => void;
    handleTogglePinMessage: (id: number | string) => void;
    handleDeleteMessage: (id: number | string) => void;
    handleStartEdit: (msg: CustomerChatMessage) => void;
    handleCancelEdit: () => void;
    notifyTyping: (isTyping?: boolean) => void;
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
}) => {
    const [showTopCounterModal, setShowTopCounterModal] = useState(false);

    return (
        <div className={`flex-1 flex flex-col min-h-0 h-full bg-white dark:bg-[#12161c] relative lg:col-span-8 ${showDetailsPanel ? "xl:col-span-6 border-r border-slate-200 dark:border-slate-800" : "xl:col-span-9"
            }`}>
            {!activeChat ? (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
                    <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                        <FileText size={24} className="text-slate-400" />
                    </div>
                    <h3 className="text-base font-bold text-slate-700 dark:text-slate-200">No Negotiation Selected</h3>
                    <p className="text-xs text-slate-400 max-w-sm mt-1">Select a negotiation conversation to view messages and make offers.</p>
                </div>
            ) : (
                <>
                    {/* Header */}
                    <div className="h-14 px-4 sm:px-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-[#12161c] shrink-0">
                        <div className="flex items-center gap-3 min-w-0">
                            <div className="relative shrink-0">
                                <div className="w-9 h-9 rounded-full overflow-hidden bg-orange-50 dark:bg-orange-950/40 border border-orange-200/80 dark:border-orange-900/50 flex items-center justify-center text-[#FF4A1F] font-bold text-xs shadow-2xs">
                                    {activeChat.avatar && (activeChat.avatar.startsWith("http") || activeChat.avatar.startsWith("/storage") || activeChat.avatar.startsWith("data:") || activeChat.avatar.includes(".")) ? (
                                        <img
                                            src={activeChat.avatar}
                                            alt=""
                                            className="w-full h-full object-contain"
                                            onError={(e) => { e.currentTarget.style.display = "none"; }}
                                        />
                                    ) : (
                                        <span>{(activeChat.name || "S").charAt(0).toUpperCase()}</span>
                                    )}
                                </div>
                                <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 border-2 border-white dark:border-[#12161c] rounded-full z-10 ${activeChat.isOnline ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-600"}`} />
                            </div>
                            <div className="min-w-0">
                                <h2 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">{activeChat.name}</h2>
                                <p className="text-[11px] text-slate-500 truncate flex items-center gap-1.5">
                                    <span className={activeChat.isOnline ? "text-emerald-600 font-semibold" : "text-slate-400"}>
                                        {activeChat.lastSeenHuman || (activeChat.isOnline ? "Active now" : "Offline")}
                                    </span>
                                    <span className="text-slate-300 dark:text-slate-700">•</span>
                                    <span className="font-semibold text-slate-700 dark:text-slate-300">{activeChat.quoteNo}</span>

                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => setShowDetailsPanel(!showDetailsPanel)}
                            className={`p-2 rounded-lg transition-colors cursor-pointer ${showDetailsPanel ? "bg-slate-100 dark:bg-slate-800 text-[#ff4a1f]" : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                                }`}
                            title={showDetailsPanel ? "Hide Quote Details" : "Show Quote Details"}
                        >
                            <Info size={16} />
                        </button>
                    </div>

                    {/* Messages Area */}
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
                        })}

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
                        onSubmit={(amt, note) => handleSendCounterOffer(amt, note)}
                    />
                </>
            )}
        </div>
    );
};
