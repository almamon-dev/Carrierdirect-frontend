import React, { useState } from "react";
import { FileText, BadgeCheck, MoreVertical } from "lucide-react";
import Skeleton from "@/components/ui/skeleton";
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
    const [showMenu, setShowMenu] = useState(false);

    return (
        <div className={`flex-1 min-w-0 flex flex-col min-h-0 h-full bg-[#F8FAFC] dark:bg-[#0f1318] relative ${showDetailsPanel ? "border-r border-slate-200 dark:border-slate-800" : ""
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
                    {/* Header matching Supplier side */}
                    <div className="h-[60px] bg-white dark:bg-[#12161c] border-b border-slate-200 dark:border-slate-800 px-3 sm:px-4 flex items-center justify-between z-10 sticky top-0 shadow-2xs font-sans shrink-0 box-border">
                        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                            {isLoading && (!activeChat || !activeChat.name) ? (
                                <div className="flex items-center gap-3">
                                    <Skeleton className="w-9 h-9 sm:w-10 sm:h-10 rounded-full shrink-0 aspect-square" />
                                    <div className="space-y-1.5 min-w-0">
                                        <Skeleton className="h-4 w-32 rounded-md" />
                                        <Skeleton className="h-3 w-20 rounded-md" />
                                    </div>
                                </div>
                            ) : activeChat ? (
                                <>
                                    <div className="relative shrink-0">
                                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-sm overflow-hidden bg-[#EFF6FF] dark:bg-blue-950/40 text-[#2563EB] dark:text-blue-400 border border-[#BFDBFE] dark:border-blue-900/50 shadow-2xs">
                                            {activeChat.avatar && (activeChat.avatar.startsWith("http") || activeChat.avatar.startsWith("/storage") || activeChat.avatar.startsWith("data:") || activeChat.avatar.includes(".")) ? (
                                                <img
                                                    src={activeChat.avatar}
                                                    alt=""
                                                    className="w-full h-full object-contain"
                                                    onError={(e) => { e.currentTarget.style.display = "none"; }}
                                                />
                                            ) : (
                                                <span>{(activeChat.name || "S").split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase() || "S1"}</span>
                                            )}
                                        </div>
                                        <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 sm:w-3 sm:h-3 border-2 border-white dark:border-[#12161c] rounded-full z-10 shadow-2xs ${activeChat.isOnline ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-600"}`} />
                                    </div>
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-1.5 min-w-0">
                                            <h2 className="text-[13.5px] sm:text-[14.5px] font-bold text-slate-900 dark:text-white truncate max-w-[130px] sm:max-w-[220px] md:max-w-none">
                                                {activeChat.name}
                                            </h2>
                                            {activeChat.isVerified !== false && (
                                                <span title="Verified Partner" className="inline-flex items-center text-[#FF6A00] shrink-0">
                                                    <BadgeCheck size={14} className="shrink-0 fill-[#FF6A00]/20" />
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-[11px] sm:text-[11.5px] text-slate-500 font-medium mt-0.5 flex items-center gap-1.5 truncate">
                                            <span className="shrink-0 text-slate-500 font-normal">
                                                {activeChat.lastSeenHuman ? (activeChat.lastSeenHuman.toLowerCase().startsWith('active') ? activeChat.lastSeenHuman : `Active ${activeChat.lastSeenHuman}`) : (activeChat.isOnline ? "Active now" : "Offline")}
                                            </span>
                                            <span className="text-slate-300 dark:text-slate-700">•</span>
                                            <span className="font-semibold text-slate-600 dark:text-slate-300 shrink-0">{activeChat.quoteNo}</span>
                                        </div>
                                    </div>
                                </>
                            ) : null}
                        </div>

                        {/* Right Action Menu (Matches Supplier side) */}
                        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0 relative">
                            <button
                                type="button"
                                onClick={() => setShowMenu(!showMenu)}
                                className="h-8 w-8 rounded-[4px] flex items-center justify-center cursor-pointer text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-colors"
                                title="More Options"
                                aria-label="More options"
                            >
                                <MoreVertical size={18} />
                            </button>

                            {showMenu && (
                                <div className="absolute right-0 top-full mt-1.5 w-44 bg-white dark:bg-slate-800 rounded-[4px] shadow-lg border border-slate-200 dark:border-slate-700 py-1 z-50 animate-in fade-in-50 duration-100 text-xs font-medium">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowDetailsPanel(!showDetailsPanel);
                                            setShowMenu(false);
                                        }}
                                        className="w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 cursor-pointer flex items-center justify-between"
                                    >
                                        <span>{showDetailsPanel ? "Hide Quote Details" : "View Quote Details"}</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            navigator.clipboard.writeText(String(activeChat.quoteNo || activeChat.id));
                                            setShowMenu(false);
                                        }}
                                        className="w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 cursor-pointer"
                                    >
                                        Copy Quote ID
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Messages Area matching Supplier side styling */}
                    <div className="flex-1 min-h-0 min-w-0 overflow-y-auto p-2.5 sm:p-4 md:p-6 space-y-3 bg-[#F8FAFC] dark:bg-[#0f1318] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                        {isLoading ? (
                            <div className="space-y-4 py-2 animate-in fade-in duration-150">
                                {/* 1. Supplier Quote Activity Speech Bubble (LEFT ALIGNED) */}
                                <div className="flex gap-2.5 items-start justify-start group relative w-full">
                                    <Skeleton className="w-8 h-8 rounded-full shrink-0 aspect-square mt-0.5" />
                                    <div className="w-[440px] sm:w-[460px] max-w-full">
                                        <div className="p-3.5 rounded-2xl rounded-tl-xs bg-white dark:bg-[#12161c] border border-slate-200/90 dark:border-slate-800 shadow-2xs space-y-2">
                                            <Skeleton className="h-3.5 w-60 rounded-md" />
                                            <Skeleton className="h-3.5 w-44 rounded-md" />
                                            <Skeleton className="h-2.5 w-12 rounded-md" />
                                        </div>
                                    </div>
                                </div>

                                {/* 2. Supplier Quote Details Card (LEFT ALIGNED with pl-[42px]) */}
                                <div className="flex items-center justify-start pl-0 sm:pl-[42px] w-full my-1.5">
                                    <div className="w-[440px] sm:w-[460px] max-w-full bg-white dark:bg-[#12161c] border border-slate-200/90 dark:border-slate-800 rounded-[4px] p-3.5 shadow-2xs space-y-3 font-sans">
                                        {/* Header */}
                                        <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800">
                                            <div className="flex items-center gap-2">
                                                <Skeleton className="w-6 h-6 rounded-[4px] shrink-0" />
                                                <div className="space-y-1">
                                                    <Skeleton className="h-3.5 w-36 rounded-md" />
                                                    <Skeleton className="h-2.5 w-14 rounded-md" />
                                                </div>
                                            </div>
                                            <Skeleton className="h-5 w-20 rounded-[4px]" />
                                        </div>

                                        {/* Route section */}
                                        <div className="space-y-2 py-1">
                                            <div className="flex items-center justify-between">
                                                <Skeleton className="h-3.5 w-52 rounded-md" />
                                                <Skeleton className="h-2.5 w-12 rounded-md" />
                                            </div>
                                            <Skeleton className="h-3.5 w-56 rounded-md" />
                                        </div>

                                        {/* Pricing Breakdown */}
                                        <div className="border-t border-slate-100 dark:border-slate-800 pt-2.5 space-y-2">
                                            <div className="flex items-center justify-between">
                                                <Skeleton className="h-3 w-28 rounded-md" />
                                                <Skeleton className="h-3.5 w-16 rounded-md" />
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <Skeleton className="h-3 w-20 rounded-md" />
                                                <Skeleton className="h-3.5 w-14 rounded-md" />
                                            </div>
                                        </div>

                                        {/* Total Row */}
                                        <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex items-center justify-between">
                                            <Skeleton className="h-4 w-32 rounded-md" />
                                            <Skeleton className="h-5 w-24 rounded-md" />
                                        </div>

                                        {/* Action buttons matching Customer offer card */}
                                        <div className="grid grid-cols-2 gap-2 pt-1">
                                            <Skeleton className="h-9 w-full rounded-[4px]" />
                                            <Skeleton className="h-9 w-full rounded-[4px]" />
                                        </div>
                                    </div>
                                </div>

                                {/* 3. Customer Reply Bubble (RIGHT ALIGNED) */}
                                <div className="flex justify-end w-full pt-2">
                                    <div className="space-y-1 flex flex-col items-end max-w-[80%] sm:max-w-[70%]">
                                        <div className="p-3.5 rounded-[4px] bg-[#d9fdd3]/70 dark:bg-[#005c4b]/50 border border-emerald-200/50 dark:border-emerald-700/30 shadow-2xs space-y-2">
                                            <Skeleton className="h-3.5 w-56 rounded-md" />
                                            <Skeleton className="h-3.5 w-40 rounded-md" />
                                        </div>
                                        <Skeleton className="h-2.5 w-14 rounded-md mr-1" />
                                    </div>
                                </div>

                                {/* 4. Status / Confirmation Banner (RIGHT ALIGNED) */}
                                <div className="flex justify-end w-full pt-1">
                                    <div className="w-[380px] max-w-full p-3 rounded-[4px] bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800 space-y-1.5">
                                        <div className="flex items-center gap-2">
                                            <Skeleton className="w-4 h-4 rounded-full shrink-0" />
                                            <Skeleton className="h-3.5 w-32 rounded-md" />
                                        </div>
                                        <Skeleton className="h-3 w-64 rounded-md" />
                                    </div>
                                </div>
                            </div>
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
