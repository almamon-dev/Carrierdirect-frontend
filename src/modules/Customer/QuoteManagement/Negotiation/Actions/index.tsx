import React from 'react';
import { Send, DollarSign, Calculator, FileText, Check } from 'lucide-react';
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
    currency = '€',
    extraCharges,
}: {
    inputValue: string;
    setInputValue: (v: string) => void;
    scrollToBottom: () => void;
    onSendMessage?: (text: string, files?: File[]) => void;
    onSendCounterOffer?: (amount: number, note: string, extraCharges?: any[], baseFreight?: number) => void;
    onTyping?: (isTyping?: boolean) => void;
    isSupplier?: boolean;
    isEditing?: boolean;
    onCancelEdit?: () => void;
    initialBaseFreight?: number | string;
    originalOfferAmount?: number | string;
    targetBudget?: number | string;
    carrierName?: string;
    currency?: string;
    extraCharges?: any[];
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
        isMultiLine,
    } = useChatInputState({
        inputValue,
        setInputValue,
        scrollToBottom,
        onSendMessage,
        onTyping,
    });

    const hasContent = Boolean(inputValue.trim() || selectedFiles.length > 0);

    return (
        <div
            className="relative border-t border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-[#181d24] transition-colors shrink-0">
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

            <div className="flex items-end gap-2 sm:gap-2.5 px-3 sm:px-4 py-2 sm:py-2.5 bg-white dark:bg-[#12161c] border-t border-slate-200/80 dark:border-slate-800">
                <div className="pb-0.5">
                    <ChatInputMediaActions
                        imageInputRef={imageInputRef}
                        fileInputRef={fileInputRef}
                        emojiPickerRef={emojiPickerRef}
                        showEmojiPicker={showEmojiPicker}
                        setShowEmojiPicker={setShowEmojiPicker}
                        onFileSelect={handleFileSelect}
                        onAddEmoji={handleAddEmoji}
                    />
                </div>

                <div
                    className={`flex-1 min-w-0 bg-[#F8FAFC] dark:bg-[#202c33] ${isMultiLine ? 'rounded-[4px]' : 'rounded-full'} px-4 py-2 border border-[#E5E7EB] dark:border-slate-700 flex items-center gap-2 shadow-2xs`}>
                    <div className="grid flex-1 min-w-0 relative">
                        {/* Shadow Mirror defines natural height without JS or layout thrashing */}
                        <div
                            aria-hidden="true"
                            className="invisible whitespace-pre-wrap break-words [overflow-wrap:anywhere] col-start-1 col-end-2 row-start-1 row-end-2 min-h-[22px] max-h-36 p-0 m-0 text-[13px] sm:text-[13.5px] leading-[22px] font-normal select-none pointer-events-none"
                        >
                            {inputValue ? `${inputValue} ` : ' '}
                        </div>

                        {/* Real Textarea overlay */}
                        <textarea
                            ref={textareaRef}
                            rows={1}
                            maxLength={2000}
                            value={inputValue}
                            onChange={e => {
                                const val = e.target.value;
                                setInputValue(val);
                                if (onTyping) {
                                    if (val.trim().length > 0) {
                                        onTyping(true);
                                    } else {
                                        onTyping(false);
                                    }
                                }
                            }}
                            onBlur={() => {
                                if (onTyping) onTyping(false);
                            }}
                            onKeyDown={handleKeyDown}
                            placeholder={isEditing ? 'Update your message...' : 'Type a message...'}
                            className="w-full resize-none min-h-[22px] max-h-36 p-0 m-0 text-[13px] sm:text-[13.5px] bg-transparent border-none text-slate-800 dark:text-slate-100 placeholder:text-slate-400 font-normal focus:outline-none focus:ring-0 custom-scrollbar leading-[22px] block col-start-1 col-end-2 row-start-1 row-end-2 overflow-y-auto"
                        />
                    </div>

                    {inputValue.length > 0 && (
                        <span className={`text-[10px] sm:text-[10.5px] font-mono font-medium select-none shrink-0 self-end pb-0.5 tracking-tight transition-colors ${
                            inputValue.length > 1900 ? 'text-red-500 font-semibold' : inputValue.length > 1600 ? 'text-amber-500' : 'text-slate-400 dark:text-slate-500'
                        }`}>
                            {inputValue.length}/2000
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-2 shrink-0 pb-0.5">
                    {onSendCounterOffer && (
                        <button
                            type="button"
                            onClick={() => setShowCounterOfferModal(true)}
                            className="flex items-center gap-1.5 h-10 px-3.5 sm:px-4 text-[13px] font-semibold rounded-lg border-[1.5px] border-[#FF6A00] bg-white dark:bg-slate-800 text-[#FF6A00] hover:bg-orange-50/60 dark:hover:bg-orange-950/30 transition-all shadow-2xs hover:shadow-xs cursor-pointer active:scale-95 shrink-0"
                            title={isSupplier ? 'Revise Offer' : 'Propose Counter Rate'}
                        >
                            <FileText size={16} strokeWidth={2} className="shrink-0 text-[#FF6A00]" />
                            <span className="hidden sm:inline">{isSupplier ? 'Revise Offer' : 'Counter Offer'}</span>
                            <span className="sm:hidden inline">{isSupplier ? 'Revise' : 'Counter'}</span>
                        </button>
                    )}

                    <button
                        type="button"
                        onClick={handleSend}
                        className="h-10 w-10 min-w-[40px] flex items-center justify-center rounded-full bg-[#FF6A00] hover:bg-[#e55f00] text-white transition-all shrink-0 shadow-md shadow-orange-500/25 active:scale-95 cursor-pointer"
                        title="Send message (Enter)"
                    >
                        {isEditing ? <Check size={18} strokeWidth={2.5} /> : <Send size={16} strokeWidth={2.2} className="text-white translate-x-[1px]" />}
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
                extraCharges={extraCharges}
                onSubmit={(amt, note, extras, base) => onSendCounterOffer && onSendCounterOffer(amt, note, extras, base !== undefined ? base : (initialBaseFreight ? Number(initialBaseFreight) : undefined))}
            />
        </div>
    );
}
