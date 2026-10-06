import React, { useEffect } from 'react';
import { Pin, ChevronRight } from 'lucide-react';
import Skeleton from '@/components/ui/skeleton';
import { NegotiationItem } from '../../types';
import { ChatMessage } from '../types';
import { ChatMessageBubble } from './ChatMessageBubble';

interface ChatMessageListProps {
    currentMessages: ChatMessage[];
    activeNegotiation?: NegotiationItem | null;
    editingMsgId: number | string | null;
    highlightedMsgId: number | string | null;
    activePinnedIndex: number;
    setActivePinnedIndex: (idx: number) => void;
    isCustomerTyping: boolean;
    messagesEndRef: React.RefObject<HTMLDivElement | null>;
    handleTogglePinMessage: (id: number | string) => void;
    handleDeleteMessage: (id: number | string) => void;
    handleStartEdit: (msg: ChatMessage) => void;
    scrollToPinnedMessage: (id: number | string) => void;
    handleAcceptOffer: (msg: any) => void;
    handleRejectOffer: (msg: any) => void;
    isLoading?: boolean;
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
    handleRejectOffer,
    isLoading = false
}) => {
    const safeNegotiation = activeNegotiation || ({} as NegotiationItem);
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
            {!isLoading && pinnedMessages.length > 0 && currentPinned && (
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

            {/* Stable Single Scroll Container - Never unmounts to prevent layout jerking */}
            <div className="flex-1 min-h-0 min-w-0 overflow-y-auto p-2.5 sm:p-4 md:p-6 flex flex-col [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {isLoading ? (
                    <div className="space-y-2 w-full animate-in fade-in duration-150">
                        {/* 1. Supplier Revised Offer Activity Bubble Skeleton (RIGHT ALIGNED) */}
                        <div className="flex justify-end w-full">
                            <div className="w-[440px] sm:w-[460px] max-w-full p-3 bg-white dark:bg-[#12161c] border border-slate-200/90 dark:border-slate-800 rounded-[4px] shadow-2xs space-y-2">
                                <div className="flex items-center justify-between pb-1">
                                    <div className="flex items-center gap-2">
                                        <Skeleton className="w-5 h-5 rounded-[4px] shrink-0" />
                                        <Skeleton className="h-3.5 w-36 rounded-md" />
                                    </div>
                                    <Skeleton className="h-2.5 w-12 rounded-md" />
                                </div>
                                <Skeleton className="h-3 w-full rounded-md" />
                                <Skeleton className="h-3 w-3/4 rounded-md" />
                            </div>
                        </div>

                        {/* 2. Supplier Revised Offer Details Card Skeleton (RIGHT ALIGNED) */}
                        <div className="flex justify-end w-full my-1.5">
                            <div className="w-[440px] sm:w-[460px] max-w-full bg-white dark:bg-[#12161c] border border-slate-200/90 dark:border-slate-800 rounded-[4px] p-3.5 shadow-2xs space-y-3">
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

                                {/* Route info */}
                                <div className="space-y-2 py-1">
                                    <div className="flex items-center justify-between">
                                        <Skeleton className="h-3.5 w-52 rounded-md" />
                                        <Skeleton className="h-2.5 w-12 rounded-md" />
                                    </div>
                                    <Skeleton className="h-3.5 w-56 rounded-md" />
                                </div>

                                {/* Financial breakdown */}
                                <div className="border-t border-slate-100 dark:border-slate-800 pt-2.5 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Skeleton className="h-3 w-28 rounded-md" />
                                        <Skeleton className="h-3.5 w-16 rounded-md" />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <Skeleton className="h-3 w-20 rounded-md" />
                                        <Skeleton className="h-3.5 w-14 rounded-md" />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <Skeleton className="h-3 w-28 rounded-md" />
                                        <Skeleton className="h-3.5 w-14 rounded-md" />
                                    </div>
                                </div>

                                {/* Total row */}
                                <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex items-center justify-between">
                                    <Skeleton className="h-4 w-32 rounded-md" />
                                    <Skeleton className="h-5 w-24 rounded-md" />
                                </div>

                                {/* Cargo summary & action button */}
                                <div className="flex items-center justify-between pt-1">
                                    <Skeleton className="h-3 w-40 rounded-md" />
                                    <Skeleton className="h-3 w-20 rounded-md" />
                                </div>
                                <Skeleton className="h-9 w-full rounded-[4px]" />
                            </div>
                        </div>

                        {/* 3. Customer Reply Bubble Skeleton (LEFT ALIGNED) */}
                        <div className="flex items-start gap-2.5 max-w-md pt-2">
                            <Skeleton className="w-8 h-8 rounded-full shrink-0 aspect-square mt-0.5" />
                            <div className="space-y-1 max-w-[85%]">
                                <div className="p-3.5 rounded-[4px] bg-white dark:bg-[#12161c] border border-slate-200/90 dark:border-slate-800 shadow-2xs space-y-2">
                                    <Skeleton className="h-3.5 w-16 rounded-md" />
                                    <Skeleton className="h-3.5 w-64 rounded-md" />
                                    <Skeleton className="h-3.5 w-48 rounded-md" />
                                </div>
                                <Skeleton className="h-2.5 w-12 rounded-md ml-1" />
                            </div>
                        </div>

                        {/* 4. Status Bubble / Quote Accepted Skeleton (RIGHT ALIGNED) */}
                        <div className="flex justify-end w-full pt-1">
                            <div className="p-2.5 rounded-[4px] bg-white dark:bg-[#12161c] border border-slate-200/90 dark:border-slate-800 shadow-2xs flex items-center gap-2 max-w-md">
                                <Skeleton className="w-5 h-5 rounded-full shrink-0" />
                                <div className="space-y-1">
                                    <Skeleton className="h-3.5 w-28 rounded-md" />
                                    <Skeleton className="h-2.5 w-52 rounded-md" />
                                </div>
                                <Skeleton className="h-2.5 w-12 rounded-md ml-auto" />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col flex-1 animate-in fade-in duration-150">
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
                            activeNegotiation={safeNegotiation}
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
                            {safeNegotiation.customerAvatar && (safeNegotiation.customerAvatar.startsWith('http') || safeNegotiation.customerAvatar.startsWith('/storage') || safeNegotiation.customerAvatar.startsWith('data:') || safeNegotiation.customerAvatar.includes('.')) ? (
                                <img
                                    src={safeNegotiation.customerAvatar}
                                    alt=""
                                    className="w-full h-full object-cover"
                                    onError={(e) => { (e.currentTarget as HTMLElement).style.display = 'none'; }}
                                />
                            ) : (
                                <span>{(safeNegotiation.customer || 'C').charAt(0).toUpperCase()}</span>
                            )}
                        </div>
                        <div className="bg-slate-100 dark:bg-slate-800 px-3.5 py-2 rounded-[4px] flex items-center gap-1.5 shadow-2xs border border-slate-200/80 dark:border-slate-700">
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
                )}
            </div>
        </>
    );
};
