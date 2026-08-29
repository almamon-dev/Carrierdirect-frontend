import React, { useEffect } from 'react';
import { Pin, ChevronRight } from 'lucide-react';
import { NegotiationItem } from '../../types';
import { ChatMessage } from '../types';
import { ChatMessageBubble } from './ChatMessageBubble';

interface ChatMessageListProps {
    currentMessages: ChatMessage[];
    activeNegotiation: NegotiationItem;
    editingMsgId: number | string | null;
    highlightedMsgId: number | string | null;
    activePinnedIndex: number;
    setActivePinnedIndex: (idx: number) => void;
    isCustomerTyping: boolean;
    messagesEndRef: React.RefObject<HTMLDivElement>;
    handleTogglePinMessage: (id: number | string) => void;
    handleDeleteMessage: (id: number | string) => void;
    handleStartEdit: (msg: ChatMessage) => void;
    scrollToPinnedMessage: (id: number | string) => void;
    handleAcceptOffer: (msg: any) => void;
    handleRejectOffer: (msg: any) => void;
}

export const ChatMessageList: React.FC<ChatMessageListProps> = ({
    currentMessages,
    activeNegotiation,
    editingMsgId,
    highlightedMsgId,
    activePinnedIndex,
    setActivePinnedIndex,
    isCustomerTyping,
    messagesEndRef,
    handleTogglePinMessage,
    handleDeleteMessage,
    handleStartEdit,
    scrollToPinnedMessage,
    handleAcceptOffer,
    handleRejectOffer
}) => {
    const pinnedMessages = currentMessages.filter(m => m.isPinned);
    const safeIndex = pinnedMessages.length > 0 ? activePinnedIndex % pinnedMessages.length : 0;
    const currentPinned = pinnedMessages[safeIndex];

    useEffect(() => {
        if (isCustomerTyping) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
    }, [isCustomerTyping, messagesEndRef]);

    return (
        <>
            {/* Pinned Messages Banner */}
            {pinnedMessages.length > 0 && currentPinned && (
                <div
                    onClick={() => scrollToPinnedMessage(currentPinned.id)}
                    className="bg-orange-50/90 border-b border-orange-200/80 px-4 py-2 flex items-center justify-between text-xs z-10 shrink-0 cursor-pointer hover:bg-orange-100/80 transition-colors"
                >
                    <div className="flex items-center gap-2 truncate">
                        <Pin size={13} className="text-[#FF4A1F] fill-[#FF4A1F] rotate-45 shrink-0" />
                        <span className="font-semibold text-slate-700 shrink-0">Pinned ({safeIndex + 1}/{pinnedMessages.length}):</span>
                        <span className="text-slate-600 truncate">{currentPinned.text}</span>
                    </div>
                    {pinnedMessages.length > 1 && (
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                setActivePinnedIndex((safeIndex + 1) % pinnedMessages.length);
                            }}
                            className="text-[#FF4A1F] font-bold hover:underline flex items-center gap-0.5 shrink-0 ml-2"
                        >
                            Next <ChevronRight size={13} />
                        </button>
                    )}
                </div>
            )}

            {/* Scrollable Message List */}
            <div className="flex-1 min-h-0 min-w-0 overflow-y-auto p-4 sm:p-6 flex flex-col [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {currentMessages.map((msg, index) => {
                    const prevMsg = index > 0 ? currentMessages[index - 1] : null;
                    const nextMsg = index < currentMessages.length - 1 ? currentMessages[index + 1] : null;

                    return (
                        <ChatMessageBubble
                            key={msg.id}
                            msg={msg}
                            index={index}
                            prevMsg={prevMsg}
                            nextMsg={nextMsg}
                            activeNegotiation={activeNegotiation}
                            editingMsgId={editingMsgId}
                            highlightedMsgId={highlightedMsgId}
                            handleTogglePinMessage={handleTogglePinMessage}
                            handleDeleteMessage={handleDeleteMessage}
                            handleStartEdit={handleStartEdit}
                            handleAcceptOffer={handleAcceptOffer}
                            handleRejectOffer={handleRejectOffer}
                        />
                    );
                })}

                {/* Customer Typing Bubble (Clean, high contrast, non-clipped) */}
                {isCustomerTyping && (
                    <div className="flex gap-2.5 justify-start mt-3 mb-3 items-center animate-in fade-in slide-in-from-bottom-2 duration-200">
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 font-bold text-xs shrink-0 shadow-2xs">
                            {activeNegotiation.customerAvatar ? (
                                <img src={activeNegotiation.customerAvatar} alt={activeNegotiation.customer} className="w-full h-full object-cover" />
                            ) : (
                                <span>{activeNegotiation.customer.charAt(0).toUpperCase()}</span>
                            )}
                        </div>
                        <div className="bg-slate-100 dark:bg-slate-800 px-3.5 py-2 rounded-2xl rounded-tl-xs flex items-center gap-1.5 shadow-2xs border border-slate-200/80 dark:border-slate-700">
                            <span className="w-2 h-2 bg-[#00a884] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="w-2 h-2 bg-[#00a884] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="w-2 h-2 bg-[#00a884] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                        <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                            {activeNegotiation.customer} is typing...
                        </span>
                    </div>
                )}

                <div ref={messagesEndRef} className="h-4 shrink-0" />
            </div>
        </>
    );
};
