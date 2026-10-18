import React from 'react';
import { QuoteActivityBubble } from '@/modules/Customer/QuoteManagement/Negotiation/Chat/components/bubble/QuoteActivityBubble';
import { NegotiationItem } from '../../../types';
import { ChatMessage } from '../../types';

interface QuoteBubbleActivityRowProps {
    isSentByMe: boolean;
    customerName: string;
    quoteNum: string | number;
    pickupLoc: string;
    deliveryLoc: string;
    distanceStr: string;
    time?: string;
    totalQuotationAmount: number;
    activeNegotiation: NegotiationItem;
    avatarInitials: string;
}

export const QuoteBubbleActivityRow: React.FC<QuoteBubbleActivityRowProps> = ({
    isSentByMe,
    customerName,
    quoteNum,
    pickupLoc,
    deliveryLoc,
    distanceStr,
    time,
    totalQuotationAmount,
    activeNegotiation,
    avatarInitials,
}) => {
    if (isSentByMe) {
        return (
            <div className="flex justify-end w-full">
                <div className="w-[440px] sm:w-[460px] max-w-full">
                    <QuoteActivityBubble
                        type="revised_offer"
                        actorName={customerName}
                        quoteNumber={String(quoteNum)}
                        origin={pickupLoc}
                        destination={deliveryLoc}
                        distance={distanceStr}
                        time={time || '-'}
                        amount={totalQuotationAmount}
                        isSent={true}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="flex gap-2.5 items-start justify-start group relative w-full">
            <div className="w-8 h-8 min-w-[32px] min-h-[32px] rounded-full bg-sky-100 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 flex items-center justify-center text-sky-600 dark:text-sky-400 font-bold text-xs shrink-0 mt-0.5 shadow-2xs select-none overflow-hidden">
                {(activeNegotiation as any)?.avatar &&
                ((activeNegotiation as any).avatar.startsWith('http') ||
                    (activeNegotiation as any).avatar.startsWith('/storage') ||
                    (activeNegotiation as any).avatar.startsWith('data:') ||
                    (activeNegotiation as any).avatar.includes('.')) ? (
                    <img
                        src={(activeNegotiation as any).avatar}
                        alt=""
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.currentTarget.style.display = 'none';
                        }}
                    />
                ) : (
                    avatarInitials
                )}
            </div>
            <div className="w-[440px] sm:w-[460px] max-w-full">
                <QuoteActivityBubble
                    type="quote_request"
                    actorName={customerName}
                    quoteNumber={String(quoteNum)}
                    origin={pickupLoc}
                    destination={deliveryLoc}
                    distance={distanceStr}
                    time={time || '-'}
                    amount={totalQuotationAmount}
                    isSent={false}
                />
            </div>
        </div>
    );
};
