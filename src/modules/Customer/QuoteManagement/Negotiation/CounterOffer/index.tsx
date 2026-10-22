import React, { useState } from "react";
import { DeclineOfferModal } from "../Chat/components/DeclineOfferModal";
import { QuotePaymentInstructionModal } from "../Chat/components/QuotePaymentInstructionModal";
import { useCounterOfferMessageData } from "./useCounterOfferMessageData";
import { CounterOfferCardBody } from "./CounterOfferCardBody";
import { CounterOfferCardActions } from "./CounterOfferCardActions";
import { CounterOfferCardMenu } from "./CounterOfferCardMenu";
import { CounterOfferSpeechBubble } from "./CounterOfferSpeechBubble";

export interface CounterOfferMessageProps {
    msg: any;
    activeChat?: any;
    activeNegotiation?: any;
    isSupplier?: boolean;
    onAccept?: (msg: any) => void;
    onReject?: (msg: any, reason?: string) => void;
    onOpenCounterOffer?: () => void;
    onTogglePin?: () => void;
    onDelete?: () => void;
}

export default function CounterOfferMessage({
    msg,
    activeChat,
    activeNegotiation,
    isSupplier,
    onAccept,
    onReject,
    onOpenCounterOffer,
    onTogglePin,
    onDelete,
}: CounterOfferMessageProps) {
    const [isAccepting, setIsAccepting] = useState(false);
    const [localStatus, setLocalStatus] = useState<"pending" | "accepted" | "rejected" | null>(null);
    const [localReason, setLocalReason] = useState<string>("");
    const [showDeclineModal, setShowDeclineModal] = useState(false);
    const [showInstructionModal, setShowInstructionModal] = useState(false);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    const status = localStatus || msg.status || "pending";
    const currency = msg.currency || "€";

    const {
        activeData,
        isSupplierSide,
        isSentByMe,
        otherPartyName,
        quoteNum,
        pickupLoc,
        deliveryLoc,
        distanceStr,
        pickupDate,
        deliveryDate,
        palletType,
        vehicleType,
        notesText,
        prevPrice,
        proposedPrice,
        extraList,
        basePrice,
        orderId,
        targetQuoteId,
        isOrderPaid,
        isSupplierOffer,
        isRevised,
        bubbleType,
        avatarInitials,
    } = useCounterOfferMessageData(msg, activeChat, activeNegotiation, isSupplier);

    const isSuperseded = status === "superseded" || msg.is_superseded === true;
    const isWithdrawn = status === "withdrawn";
    const isAccepted = status === "accepted" || msg.status === "accepted";
    const isDeclined = status === "rejected" || status === "declined" || (activeData as any)?.status === "Offer Declined" || (activeData as any)?.status === "rejected";
    const isPending = !isSuperseded && !isWithdrawn && !isAccepted && !isDeclined;
    const canAccept = !isSentByMe && isPending;

    const handleConfirmAccept = () => {
        setIsAccepting(true);
        setLocalStatus("accepted");
        if (!isSupplierSide) {
            setShowInstructionModal(true);
        }
        if (onAccept) onAccept(msg);
        setTimeout(() => setIsAccepting(false), 200);
    };

    const handleConfirmDecline = (reason: string) => {
        setLocalStatus("rejected");
        setLocalReason(reason);
        setShowDeclineModal(false);
        if (onReject) onReject(msg, reason);
    };

    return (
        <div className="space-y-2 w-full my-1.5">
            <CounterOfferSpeechBubble
                isSentByMe={isSentByMe}
                bubbleType={bubbleType}
                otherPartyName={otherPartyName}
                quoteNum={quoteNum}
                proposedPrice={proposedPrice}
                currency={currency}
                time={msg.time}
                activeData={activeData}
                avatarInitials={avatarInitials}
            />

            {/* 2. Counter Offer Details Card */}
            <div className={`flex items-center ${isSentByMe ? 'justify-end' : 'justify-start pl-[42px]'} w-full my-1.5`}>
                <div className="relative w-[440px] sm:w-[460px] max-w-full group">
                    <div
                        id={`msg-bubble-${msg.id}`}
                        className="bg-white dark:bg-[#12161c] border border-slate-200/90 dark:border-slate-800 rounded-[4px] p-3.5 w-full text-left shadow-2xs space-y-2.5 font-sans transition-all duration-300"
                    >
                        <CounterOfferCardBody
                            isRevised={isRevised}
                            isSupplierOffer={isSupplierOffer}
                            isSentByMe={isSentByMe}
                            quoteNum={quoteNum}
                            time={msg.time}
                            pickupLoc={pickupLoc}
                            deliveryLoc={deliveryLoc}
                            distanceStr={distanceStr}
                            currency={currency}
                            basePrice={basePrice}
                            extraList={extraList}
                            prevPrice={prevPrice}
                            proposedPrice={proposedPrice}
                            palletType={palletType}
                            vehicleType={vehicleType}
                            pickupDate={pickupDate}
                            deliveryDate={deliveryDate}
                            notesText={notesText}
                            isDetailsOpen={isDetailsOpen}
                            setIsDetailsOpen={setIsDetailsOpen}
                        />

                        <CounterOfferCardActions
                            isAccepted={isAccepted}
                            isOrderPaid={isOrderPaid}
                            isDeclined={isDeclined}
                            isSuperseded={isSuperseded}
                            canAccept={canAccept}
                            isSupplierSide={isSupplierSide}
                            isAccepting={isAccepting}
                            currency={currency}
                            proposedPrice={proposedPrice}
                            localReason={localReason}
                            otherPartyName={otherPartyName}
                            orderId={orderId}
                            quoteId={targetQuoteId}
                            onConfirmAccept={handleConfirmAccept}
                            onOpenCounterOffer={onOpenCounterOffer}
                            onShowDeclineModal={() => setShowDeclineModal(true)}
                            onShowInstructionModal={() => setShowInstructionModal(true)}
                        />

                        <CounterOfferCardMenu
                            isSentByMe={isSentByMe}
                            quoteNum={quoteNum}
                            currency={currency}
                            proposedPrice={proposedPrice}
                            basePrice={basePrice}
                            pickupLoc={pickupLoc}
                            deliveryLoc={deliveryLoc}
                            status={status}
                            isPinned={msg.isPinned}
                            onTogglePin={onTogglePin}
                            onDelete={onDelete}
                        />
                    </div>
                </div>
            </div>

            {/* Modals */}
            <DeclineOfferModal
                isOpen={showDeclineModal}
                onClose={() => setShowDeclineModal(false)}
                offerAmount={proposedPrice}
                onConfirm={handleConfirmDecline}
            />

            <QuotePaymentInstructionModal
                isOpen={showInstructionModal}
                onClose={() => setShowInstructionModal(false)}
                quoteId={targetQuoteId}
                quoteAmount={proposedPrice}
                supplierName={otherPartyName}
            />
        </div>
    );
}
