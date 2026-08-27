import React from 'react';
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

    return (
        <>
            {/* Pinned Messages Banner */}
            {pinnedMessages.length > 0 && currentPinned && (
                <div
                    onClick={() => scrollToPinnedMessage(currentPinned.id)}
                    className="bg-orange-50/90 border-b border-orange-200/80 px-4 py-2 flex items-center justify-between text-xs z-10 shrink-0 cursor-pointer hover:bg-orange-100/80 transition-colors"
                >
                    <div className="flex items-center gap-2 min-w-0">
                        <Pin size={13} className="text-[#FF4A1F] fill-[#FF4A1F] rotate-45 shrink-0" />
                        <span className="font-bold text-slate-800 shrink-0">
                            Pinned Message {pinnedMessages.length > 1 && `(${safeIndex + 1}/${pinnedMessages.length})`}:
                        </span>
                        <span className="text-slate-600 truncate font-medium">{currentPinned.text}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-2">
                        {pinnedMessages.length > 1 && (
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    const next = (safeIndex + 1) % pinnedMessages.length;
                                    setActivePinnedIndex(next);
                                    scrollToPinnedMessage(pinnedMessages[next].id);
                                }}
                                className="p-0.5 rounded hover:bg-orange-200/60 text-slate-600 cursor-pointer"
                            >
                                <ChevronRight size={14} />
                            </button>
                        )}
                        <span className="text-[11px] font-bold text-[#FF4A1F] underline">View</span>
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleTogglePinMessage(currentPinned.id);
                            }}
                            className="text-slate-400 hover:text-slate-700 text-[11px] font-bold underline cursor-pointer"
                        >
                            Unpin
                        </button>
                    </div>
                </div>
            )}

            {/* Chat Messages Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
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

                {/* Customer Typing Bubble */}
                {isCustomerTyping && (
                    <div className="flex gap-2.5 justify-start mt-3 items-center animate-in fade-in duration-200">
                        <div className="w-7 h-7 rounded-full bg-orange-50 border border-orange-200 flex items-center justify-center text-[#FF4A1F] font-bold text-xs">
                            {activeNegotiation.customer.charAt(0).toUpperCase()}
                        </div>
                        <div className="bg-slate-100 px-4 py-2.5 rounded-2xl rounded-tl-sm flex items-center gap-1.5 shadow-2xs border border-slate-200/60">
                            <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                        <span className="text-[11px] text-slate-400 font-medium italic">{activeNegotiation.customer} is typing...</span>
                    </div>
                )}

                <div ref={messagesEndRef} className="mt-4" />
            </div>
        </>
    );
};
