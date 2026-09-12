import React, { useRef, useEffect } from 'react';
import { GeneralMessage, MessageAttachment } from '@/services/messageService';
import { GeneralChatMessageBubble } from './GeneralChatMessageBubble';
import { GeneralChatMessagesAreaSkeleton } from './GeneralChatMessagesAreaSkeleton';
import { GeneralChatEmptyView } from './GeneralChatEmptyView';

interface GeneralChatMessagesAreaProps {
    messages: GeneralMessage[];
    isLoadingMessages: boolean;
    isChatLoaded?: boolean;
    partner: any;
    messagesEndRef?: React.RefObject<HTMLDivElement | null>;
    onOpenLightbox: (images: MessageAttachment[], index: number) => void;
    onStartEditMessage?: (msg: GeneralMessage) => void;
    onDeleteMessage: (messageId: number | string) => Promise<any>;
    onReplyMessage?: (msg: GeneralMessage) => void;
    onToggleReaction?: (messageId: number | string, emoji: string) => void;
    onTogglePin?: (messageId: number | string) => void;
}

export const GeneralChatMessagesArea: React.FC<GeneralChatMessagesAreaProps> = ({
    messages,
    isLoadingMessages,
    isChatLoaded = false,
    partner,
    onOpenLightbox,
    onStartEditMessage,
    onDeleteMessage,
    onReplyMessage,
    onToggleReaction,
    onTogglePin
}) => {
    const partnerDisplayName = partner?.company_name || partner?.name || 'Partner';
    const containerRef = useRef<HTMLDivElement>(null);
    const isInitialMount = useRef<boolean>(true);

    // Scroll ONLY the chat messages container to the bottom (never scrolls outer page/main layout)
    useEffect(() => {
        if (!containerRef.current) return;

        if (isInitialMount.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
            if (messages.length > 0) {
                isInitialMount.current = false;
            }
        } else {
            containerRef.current.scrollTo({
                top: containerRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [messages, isLoadingMessages]);

    return (
        <div
            ref={containerRef}
            className="flex-1 overflow-y-auto px-4 py-6 space-y-3 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
            {messages.length > 0 ? (
                messages.map((msg, index) => (
                    <GeneralChatMessageBubble
                        key={msg.id || index}
                        msg={msg}
                        partner={partner}
                        onOpenImageLightbox={onOpenLightbox}
                        onStartEdit={onStartEditMessage}
                        onDelete={onDeleteMessage}
                        onReply={onReplyMessage}
                        onToggleReaction={onToggleReaction}
                        onTogglePin={onTogglePin}
                    />
                ))
            ) : (
                <GeneralChatEmptyView
                    title="No messages yet"
                    description={`Send a message or attach documents below to communicate directly with ${partnerDisplayName}.`}
                />
            )}
        </div>
    );
};

export default GeneralChatMessagesArea;
