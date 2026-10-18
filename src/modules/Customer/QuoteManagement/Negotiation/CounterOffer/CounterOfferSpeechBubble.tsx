import React from "react";
import { QuoteActivityBubble, ActivityBubbleType } from "../Chat/components/bubble/QuoteActivityBubble";

interface CounterOfferSpeechBubbleProps {
    isSentByMe: boolean;
    bubbleType: ActivityBubbleType;
    otherPartyName: string;
    quoteNum: string;
    proposedPrice: number;
    currency: string;
    time?: string;
    activeData?: any;
    avatarInitials: string;
}

export const CounterOfferSpeechBubble: React.FC<CounterOfferSpeechBubbleProps> = ({
    isSentByMe,
    bubbleType,
    otherPartyName,
    quoteNum,
    proposedPrice,
    currency,
    time,
    activeData,
    avatarInitials,
}) => {
    if (isSentByMe) {
        return (
            <div className="flex justify-end w-full">
                <div className="w-[440px] sm:w-[460px] max-w-full">
                    <QuoteActivityBubble
                        type={bubbleType}
                        actorName={otherPartyName}
                        quoteNumber={quoteNum}
                        amount={proposedPrice}
                        currency={currency}
                        time={time || ""}
                        isSent={true}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="flex gap-2.5 items-start justify-start group relative w-full">
            <div className="w-8 h-8 min-w-[32px] min-h-[32px] rounded-full bg-sky-100 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 flex items-center justify-center text-sky-600 dark:text-sky-400 font-bold text-xs shrink-0 mt-0.5 shadow-2xs select-none overflow-hidden">
                {activeData?.avatar && (activeData.avatar.startsWith('http') || activeData.avatar.startsWith('/storage') || activeData.avatar.startsWith('data:') || activeData.avatar.includes('.')) ? (
                    <img src={activeData.avatar} alt="" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                ) : (
                    avatarInitials
                )}
            </div>

            <div className="w-[440px] sm:w-[460px] max-w-full">
                <QuoteActivityBubble
                    type={bubbleType}
                    actorName={otherPartyName}
                    quoteNumber={quoteNum}
                    amount={proposedPrice}
                    currency={currency}
                    time={time || ""}
                    isSent={false}
                />
            </div>
        </div>
    );
};
