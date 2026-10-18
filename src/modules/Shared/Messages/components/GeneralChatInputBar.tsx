import React from 'react';
import { Check, Image as ImageIcon, Paperclip, Send } from 'lucide-react';
import { GeneralMessage } from '@/services/messageService';
import { GeneralChatEditReplyBanners } from './GeneralChatEditReplyBanners';
import { GeneralChatAttachmentPreviews } from './GeneralChatAttachmentPreviews';
import { GeneralChatEmojiPicker } from './GeneralChatEmojiPicker';
import { useGeneralChatInput } from './useGeneralChatInput';

export interface GeneralChatInputBarProps {
    onSendMessage: (text: string, files: File[], replyToId?: number | null) => void;
    isSending?: boolean;
    replyingTo?: GeneralMessage | null;
    onCancelReply?: () => void;
    editingMessage?: GeneralMessage | null;
    onCancelEdit?: () => void;
    onSaveEdit?: (messageId: number | string, newText: string) => Promise<boolean | any>;
    partnerName?: string;
}

export const GeneralChatInputBar: React.FC<GeneralChatInputBarProps> = ({
    onSendMessage,
    isSending = false,
    replyingTo = null,
    onCancelReply,
    editingMessage = null,
    onCancelEdit,
    onSaveEdit,
    partnerName = 'User',
}) => {
    const {
        inputText,
        setInputText,
        selectedFiles,
        setSelectedFiles,
        showEmojiPicker,
        setShowEmojiPicker,
        isSaving,
        textareaRef,
        imageInputRef,
        docInputRef,
        handleFileChange,
        handleTextareaInput,
        handleSubmit,
        handleKeyDown,
        hasContent,
    } = useGeneralChatInput({
        onSendMessage,
        replyingTo,
        onCancelReply,
        editingMessage,
        onCancelEdit,
        onSaveEdit,
    });

    return (
        <div className="px-4 py-2.5 bg-white dark:bg-[#12161c] border-t border-slate-200/80 dark:border-slate-800 shrink-0 z-10">
            <GeneralChatEditReplyBanners
                editingMessage={editingMessage}
                replyingTo={replyingTo}
                partnerName={partnerName}
                onCancelEdit={() => {
                    if (onCancelEdit) onCancelEdit();
                    setInputText('');
                    if (textareaRef.current) textareaRef.current.style.height = 'auto';
                }}
                onCancelReply={onCancelReply}
            />

            <GeneralChatAttachmentPreviews
                selectedFiles={selectedFiles}
                onRemoveFile={(idx) => setSelectedFiles((prev) => prev.filter((_, i) => i !== idx))}
            />

            <form onSubmit={handleSubmit} className="flex items-center gap-2">
                <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
                    <input type="file" ref={imageInputRef} onChange={handleFileChange} accept="image/*" multiple className="hidden" />
                    <button
                        type="button"
                        onClick={() => imageInputRef.current?.click()}
                        disabled={Boolean(editingMessage)}
                        className={`h-8 w-8 sm:h-9 sm:w-9 flex items-center justify-center rounded-full transition-colors ${
                            editingMessage
                                ? 'text-slate-300 dark:text-slate-600 cursor-not-allowed'
                                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer'
                        }`}
                        title="Attach Photo"
                    >
                        <ImageIcon size={18} />
                    </button>

                    <input
                        type="file"
                        ref={docInputRef}
                        onChange={handleFileChange}
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.txt,.zip,.rar,image/*"
                        multiple
                        className="hidden"
                    />
                    <button
                        type="button"
                        onClick={() => docInputRef.current?.click()}
                        disabled={Boolean(editingMessage)}
                        className={`h-8 w-8 sm:h-9 sm:w-9 flex items-center justify-center rounded-full transition-colors ${
                            editingMessage
                                ? 'text-slate-300 dark:text-slate-600 cursor-not-allowed'
                                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer'
                        }`}
                        title="Attach Document"
                    >
                        <Paperclip size={18} />
                    </button>

                    <GeneralChatEmojiPicker
                        showEmojiPicker={showEmojiPicker}
                        setShowEmojiPicker={setShowEmojiPicker}
                        onSelectEmoji={(emoji) => setInputText((prev) => prev + emoji)}
                    />
                </div>

                <div className="flex-1 min-w-0 bg-slate-100/90 dark:bg-[#232a34] rounded-[22px] px-3.5 py-2 border border-transparent focus-within:border-slate-300 dark:focus-within:border-slate-600 focus-within:bg-white dark:focus-within:bg-[#1c222b] focus-within:ring-2 focus-within:ring-slate-300/30 dark:focus-within:ring-slate-700/50 transition-all flex items-center">
                    <textarea
                        ref={textareaRef}
                        rows={1}
                        value={inputText}
                        onChange={handleTextareaInput}
                        onKeyDown={handleKeyDown}
                        placeholder={editingMessage ? 'Edit your message...' : 'Type a message...'}
                        className="w-full resize-none max-h-32 p-0 m-0 text-[13px] sm:text-[13.5px] bg-transparent border-none text-slate-800 dark:text-slate-100 placeholder:text-slate-400 font-medium focus:outline-none focus:ring-0 leading-[20px] block"
                    />
                </div>

                <button
                    type="submit"
                    disabled={!hasContent || isSending || isSaving}
                    className={`h-9 w-9 flex items-center justify-center rounded-full transition-all shrink-0 ${
                        hasContent && !isSending && !isSaving
                            ? 'bg-[#00a884] hover:bg-[#008f70] text-white shadow-xs active:scale-95 cursor-pointer'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                    }`}
                    title={editingMessage ? 'Save changes' : 'Send message'}
                >
                    {isSaving ? (
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : editingMessage ? (
                        <Check size={16} />
                    ) : (
                        <Send size={15} />
                    )}
                </button>
            </form>
        </div>
    );
};

export default GeneralChatInputBar;
