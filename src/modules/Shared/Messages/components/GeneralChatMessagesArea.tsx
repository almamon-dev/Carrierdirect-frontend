import React from 'react';
import { GeneralMessage, MessageAttachment } from '@/services/messageService';
import { GeneralChatMessageBubble } from './GeneralChatMessageBubble';
import { GeneralChatMessagesAreaSkeleton } from './GeneralChatMessagesAreaSkeleton';
import { GeneralChatEmptyView } from './GeneralChatEmptyView';

interface GeneralChatMessagesAreaProps {
    messages: GeneralMessage[];
    isLoadingMessages: boolean;
    isChatLoaded?: boolean;
    partner: any;
    messagesEndRef: React.RefObject<HTMLDivElement>;
    onOpenLightbox: (images: MessageAttachment[], index: number) => void;
    onDeleteMessage: (messageId: number | string) => Promise<any>;
}

export const GeneralChatMessagesArea: React.FC<GeneralChatMessagesAreaProps> = ({
    messages,
    isLoadingMessages,
    isChatLoaded = false,
    partner,
    messagesEndRef,
    onOpenLightbox,
    onDeleteMessage
}) => {
    const partnerDisplayName = partner?.company_name || partner?.name || 'Partner';

    return (
        <div className="flex-1 overflow-y-auto p-4 space-y-3 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {messages.length > 0 ? (
                messages.map((msg, index) => (
                    <GeneralChatMessageBubble
                        key={msg.id || index}
                        msg={msg}
                        partner={partner}
                        onOpenImageLightbox={onOpenLightbox}
                        onDelete={onDeleteMessage}
                    />
                ))
            ) : (
                <GeneralChatEmptyView
                    title="No messages yet"
                    description={`Send a message or attach documents below to communicate directly with ${partnerDisplayName}.`}
                />
            )}
            <div ref={messagesEndRef} />
        </div>
    );
};

export default GeneralChatMessagesArea;
