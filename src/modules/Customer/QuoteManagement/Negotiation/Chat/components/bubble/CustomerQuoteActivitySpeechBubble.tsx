import React from 'react';
import { CustomerChatItem, CustomerChatMessage } from '../../types';
import { QuoteActivityBubble } from './QuoteActivityBubble';

interface CustomerQuoteActivitySpeechBubbleProps {
    msg: CustomerChatMessage;
    activeChat: CustomerChatItem | null;
    isSentByMe: boolean;
    supplierDisplayName: string;
    quoteNum: string;
    pickupLoc: string;
    deliveryLoc: string;
    dist: string;
    avatarInitials: string;
}

export const CustomerQuoteActivitySpeechBubble: React.FC<CustomerQuoteActivitySpeechBubbleProps> = ({
    msg,
    activeChat,
    isSentByMe,
    supplierDisplayName,
    quoteNum,
    pickupLoc,
    deliveryLoc,
    dist,
    avatarInitials,
}) => {
    if (isSentByMe) {
        return (
            <div className="flex justify-end w-full">
                <div className="w-[440px] sm:w-[460px] max-w-full">
                    <QuoteActivityBubble
                        type="quote_request"
                        actorName={supplierDisplayName}
                        quoteNumber={quoteNum}
                        origin={pickupLoc}
                        destination={deliveryLoc}
                        distance={dist}
                        time={msg.time || '9:15 PM'}
                        isSent={true}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="flex gap-2.5 items-start justify-start group relative w-full">
            <div className="w-8 h-8 min-w-[32px] min-h-[32px] rounded-full bg-sky-100 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 flex items-center justify-center text-sky-600 dark:text-sky-400 font-bold text-xs shrink-0 mt-0.5 shadow-2xs select-none overflow-hidden">
                {activeChat?.avatar && (activeChat.avatar.startsWith('http') || activeChat.avatar.startsWith('/storage') || activeChat.avatar.startsWith('data:') || activeChat.avatar.includes('.')) ? (
                    <img src={activeChat.avatar} alt="" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                ) : (
                    avatarInitials
                )}
            </div>

            <div className="w-[440px] sm:w-[460px] max-w-full">
                <QuoteActivityBubble
                    type="quote_request"
                    actorName={supplierDisplayName}
                    quoteNumber={quoteNum}
                    origin={pickupLoc}
                    destination={deliveryLoc}
                    distance={dist}
                    time={msg.time || '9:15 PM'}
                    isSent={false}
                />
            </div>
        </div>
    );
};
