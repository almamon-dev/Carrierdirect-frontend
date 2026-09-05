import React from 'react';
import { NegotiationItem } from '../../types';
import { ChatMessage } from '../types';
import { ChatHeader } from './ChatHeader';
import { ChatMessageList } from './ChatMessageList';
import ChatInputActions from '@/modules/Customer/QuoteManagement/Negotiation/Actions';

interface SupplierChatMiddlePanelProps {
    activeNegotiation: NegotiationItem | null;
    sessionKey: string;
    showMobileDetails: boolean;
    setShowMobileDetails: (v: boolean) => void;
    onCallClick: (type: 'audio' | 'video') => void;
    currentMessages: ChatMessage[];
    editingMsgId: number | string | null;
    highlightedMsgId: number | string | null;
    activePinnedIndex: number;
    setActivePinnedIndex: (idx: number) => void;
    isCustomerTyping: boolean;
    messagesEndRef: React.RefObject<HTMLDivElement | null>;
    handleTogglePinMessage: (id: number | string) => void;
    handleDeleteMessage: (id: number | string) => void;
    handleStartEdit: (msg: any) => void;
    scrollToPinnedMessage: (msgId: number | string) => void;
    handleAcceptOffer: (msg: any) => void;
    handleRejectOffer: (msg: any, reason?: string) => void;
    inputValue: string;
    setInputValue: (v: string) => void;
    scrollToBottom: () => void;
    handleSendMessage: (text: string, files?: File[]) => void;
    handleSendCounterOffer: (amount: number, note: string) => void;
    notifyTyping: () => void;
    handleCancelEdit: () => void;
    currentPrice: number;
}

export const SupplierChatMiddlePanel: React.FC<SupplierChatMiddlePanelProps> = ({
    activeNegotiation,
    sessionKey,
    showMobileDetails,
    setShowMobileDetails,
    onCallClick,
    currentMessages,
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
    inputValue,
    setInputValue,
    scrollToBottom,
    handleSendMessage,
    handleSendCounterOffer,
    notifyTyping,
    handleCancelEdit,
    currentPrice,
}) => {
    if (!activeNegotiation) {
        return (
            <div className="flex-1 min-w-0 flex flex-col items-center justify-center p-8 text-center text-slate-400 bg-white">
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">Select a negotiation to view messages</p>
            </div>
        );
    }

    return (
        <div className="flex-1 min-w-0 flex flex-col min-h-0 h-full bg-white relative">
            <ChatHeader
                activeNegotiation={activeNegotiation}
                sessionKey={sessionKey}
                showMobileDetails={showMobileDetails}
                setShowMobileDetails={setShowMobileDetails}
                onCallClick={onCallClick}
            />

            <ChatMessageList
                currentMessages={currentMessages}
                activeNegotiation={activeNegotiation}
                editingMsgId={editingMsgId}
                highlightedMsgId={highlightedMsgId}
                activePinnedIndex={activePinnedIndex}
                setActivePinnedIndex={setActivePinnedIndex}
                isCustomerTyping={isCustomerTyping}
                messagesEndRef={messagesEndRef}
                handleTogglePinMessage={handleTogglePinMessage}
                handleDeleteMessage={handleDeleteMessage}
                handleStartEdit={handleStartEdit}
                scrollToPinnedMessage={scrollToPinnedMessage}
                handleAcceptOffer={handleAcceptOffer}
                handleRejectOffer={handleRejectOffer}
            />

            <ChatInputActions
                inputValue={inputValue}
                setInputValue={setInputValue}
                scrollToBottom={scrollToBottom}
                onSendMessage={handleSendMessage}
                onSendCounterOffer={handleSendCounterOffer}
                onTyping={notifyTyping}
                isSupplier={true}
                isEditing={!!editingMsgId}
                onCancelEdit={handleCancelEdit}
                initialBaseFreight={currentPrice}
                currency="€"
            />
        </div>
    );
};
