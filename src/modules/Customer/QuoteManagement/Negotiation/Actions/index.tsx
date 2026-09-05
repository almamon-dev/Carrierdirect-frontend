import React from 'react';
import { Send, DollarSign, Calculator, Check } from 'lucide-react';
import { CounterOfferModal } from './components/CounterOfferModal';
import { AttachmentsList } from './components/AttachmentsList';
import { ChatInputBanners } from './components/ChatInputBanners';
import { ChatInputMediaActions } from './components/ChatInputMediaActions';
import { useChatInputState } from './hooks/useChatInputState';

export default function ChatInputActions({
    inputValue,
    setInputValue,
    scrollToBottom,
    onSendMessage,
    onSendCounterOffer,
    onTyping,
    isSupplier = false,
    isEditing = false,
    onCancelEdit,
    initialBaseFreight,
    originalOfferAmount,
    targetBudget,
    carrierName,
    currency = '€'
}: {
    inputValue: string;
    setInputValue: (v: string) => void;
    scrollToBottom: () => void;
    onSendMessage?: (text: string, files?: File[]) => void;
    onSendCounterOffer?: (amount: number, note: string) => void;
    onTyping?: () => void;
    isSupplier?: boolean;
    isEditing?: boolean;
    onCancelEdit?: () => void;
    initialBaseFreight?: number | string;
    originalOfferAmount?: number | string;
    targetBudget?: number | string;
    carrierName?: string;
    currency?: string;
}) {
    const {
        selectedFiles,
        setSelectedFiles,
        previewModalFile,
        setPreviewModalFile,
        showAllFilesModal,
        setShowAllFilesModal,
        showEmojiPicker,
        setShowEmojiPicker,
        showCounterOfferModal,
        setShowCounterOfferModal,
        fileErrorMessage,
        setFileErrorMessage,
        imageInputRef,
        fileInputRef,
        emojiPickerRef,
        textareaRef,
        handleSend,
        handleKeyDown,
        handleFileSelect,
        handleAddEmoji,
    } = useChatInputState({
        inputValue,
        setInputValue,
        scrollToBottom,
        onSendMessage,
        onTyping,
    });

    const hasContent = Boolean(inputValue.trim() || selectedFiles.length > 0);

    return (
        <div className="relative border-t border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-[#181d24] transition-colors">
            <ChatInputBanners
                fileErrorMessage={fileErrorMessage}
                setFileErrorMessage={setFileErrorMessage}
                isEditing={isEditing}
                onCancelEdit={onCancelEdit}
            />

            <AttachmentsList
                selectedFiles={selectedFiles}
                onRemoveFile={(idx) => setSelectedFiles(prev => prev.filter((_, i) => i !== idx))}
                previewModalFile={previewModalFile}
                setPreviewModalFile={setPreviewModalFile}
                showAllFilesModal={showAllFilesModal}
                setShowAllFilesModal={setShowAllFilesModal}
            />

            <div className="flex items-end gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-2 sm:py-2.5">
                <ChatInputMediaActions
                    imageInputRef={imageInputRef}
                    fileInputRef={fileInputRef}
                    emojiPickerRef={emojiPickerRef}
                    showEmojiPicker={showEmojiPicker}
                    setShowEmojiPicker={setShowEmojiPicker}
                    onFileSelect={handleFileSelect}
                    onAddEmoji={handleAddEmoji}
                />

                <div className="flex-1 min-w-0 bg-slate-100/90 dark:bg-[#232a34] rounded-[22px] px-3.5 py-2 border border-transparent focus-within:border-slate-300 dark:focus-within:border-slate-600 focus-within:bg-white dark:focus-within:bg-[#1c222b] focus-within:ring-2 focus-within:ring-slate-300/30 dark:focus-within:ring-slate-700/50 transition-all flex items-center">
                    <textarea
                        ref={textareaRef}
                        rows={1}
                        value={inputValue}
                        onChange={e => {
                            setInputValue(e.target.value);
                            if (onTyping) onTyping();
                        }}
                        onKeyDown={handleKeyDown}
                        placeholder={isEditing ? 'Update your message...' : 'Type a message...'}
                        className="w-full resize-none max-h-32 p-0 m-0 text-[13px] sm:text-[13.5px] bg-transparent border-none text-slate-800 dark:text-slate-100 placeholder:text-slate-400 font-medium focus:outline-none focus:ring-0 custom-scrollbar leading-[20px] block"
                    />
                </div>

                <div className="flex items-center gap-1.5 shrink-0 pb-0.5">
                    {onSendCounterOffer && (
                        <button
                            type="button"
                            onClick={() => setShowCounterOfferModal(true)}
                            className="flex items-center gap-1 sm:gap-1.5 h-9 px-2.5 sm:px-3.5 text-xs font-bold rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/80 transition-all shadow-2xs cursor-pointer active:scale-95"
                            title={isSupplier ? 'Revise Offer' : 'Propose Counter Rate'}
                        >
                            {isSupplier ? <Calculator size={14} className="shrink-0 text-slate-500" /> : <DollarSign size={14} className="shrink-0 text-slate-500" />}
                            <span className="hidden md:inline">{isSupplier ? 'Revise Offer' : 'Counter Offer'}</span>
                            <span className="md:hidden inline">{isSupplier ? 'Revise' : 'Counter'}</span>
                        </button>
                    )}

                    <button
                        type="button"
                        onClick={handleSend}
                        disabled={!hasContent}
                        className={`h-9 w-9 flex items-center justify-center rounded-full transition-all shrink-0 ${
                            hasContent
                                ? 'bg-[#00a884] hover:bg-[#008f70] text-white shadow-xs active:scale-95 cursor-pointer'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                        }`}
                        title="Send message (Enter)"
                    >
                        {isEditing ? <Check size={16} /> : <Send size={15} />}
                    </button>
                </div>
            </div>

            <CounterOfferModal
                isOpen={showCounterOfferModal}
                onClose={() => setShowCounterOfferModal(false)}
                isSupplier={isSupplier}
                initialBaseFreight={initialBaseFreight}
                originalOfferAmount={originalOfferAmount}
                targetBudget={targetBudget}
                carrierName={carrierName}
                currency={currency}
                onSubmit={(amt, note) => onSendCounterOffer && onSendCounterOffer(amt, note)}
            />
        </div>
    );
}
