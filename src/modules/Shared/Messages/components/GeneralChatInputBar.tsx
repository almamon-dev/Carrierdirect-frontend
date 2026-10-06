import React, { useState, useRef, useEffect } from 'react';
import { Check, CornerUpLeft, Edit2, Image as ImageIcon, Paperclip, Send, Smile, X } from 'lucide-react';
import { GeneralMessage } from '@/services/messageService';

interface GeneralChatInputBarProps {
    onSendMessage: (text: string, files: File[], replyToId?: number | null) => void;
    isSending?: boolean;
    replyingTo?: GeneralMessage | null;
    onCancelReply?: () => void;
    editingMessage?: GeneralMessage | null;
    onCancelEdit?: () => void;
    onSaveEdit?: (messageId: number | string, newText: string) => Promise<boolean | any>;
    partnerName?: string;
}

const EMOJIS = ['👍', '❤️', '😂', '😮', '😢', '😡', '🙏', '🔥', '🎉', '👏', '🤝', '💯'];

export const GeneralChatInputBar: React.FC<GeneralChatInputBarProps> = ({
    onSendMessage,
    isSending = false,
    replyingTo = null,
    onCancelReply,
    editingMessage = null,
    onCancelEdit,
    onSaveEdit,
    partnerName = 'User'
}) => {
    const [inputText, setInputText] = useState('');
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);
    const docInputRef = useRef<HTMLInputElement>(null);
    const emojiPickerRef = useRef<HTMLDivElement>(null);

    // When editingMessage changes, load message text and focus textarea
    useEffect(() => {
        if (editingMessage) {
            const text = editingMessage.message || '';
            setInputText(text);
            setTimeout(() => {
                if (textareaRef.current) {
                    textareaRef.current.focus();
                    textareaRef.current.style.height = 'auto';
                    textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 140)}px`;
                    textareaRef.current.setSelectionRange(text.length, text.length);
                }
            }, 50);
        }
    }, [editingMessage]);

    // Auto-focus textarea when replying
    useEffect(() => {
        if (replyingTo && textareaRef.current) {
            textareaRef.current.focus();
        }
    }, [replyingTo]);

    // Close emoji picker when clicking outside
    useEffect(() => {
        if (!showEmojiPicker) return;
        const handleClickOutside = (e: MouseEvent) => {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(e.target as Node)) {
                setShowEmojiPicker(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showEmojiPicker]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const filesArray = Array.from(e.target.files);
            setSelectedFiles(prev => [...prev, ...filesArray].slice(0, 5));
        }
        if (e.target) e.target.value = '';
    };

    const handleRemoveFile = (index: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInputText(e.target.value);
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 140)}px`;
        }
    };

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        const trimmed = inputText.trim();
        if (!trimmed && selectedFiles.length === 0) return;

        // If in editing mode
        if (editingMessage && onSaveEdit) {
            if (trimmed && trimmed !== editingMessage.message?.trim()) {
                setIsSaving(true);
                try {
                    await onSaveEdit(editingMessage.id, trimmed);
                } finally {
                    setIsSaving(false);
                }
            }
            if (onCancelEdit) onCancelEdit();
            setInputText('');
            if (textareaRef.current) textareaRef.current.style.height = 'auto';
            return;
        }

        // Standard new message
        let finalMessage = trimmed;
        if (replyingTo) {
            const replySnippet = (replyingTo.message || 'Attachment').slice(0, 60);
            finalMessage = `Replying to: "${replySnippet}"\n${trimmed}`;
            if (onCancelReply) onCancelReply();
        }

        onSendMessage(finalMessage, selectedFiles);
        setInputText('');
        setSelectedFiles([]);
        if (textareaRef.current) textareaRef.current.style.height = 'auto';
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        } else if (e.key === 'Escape') {
            if (editingMessage && onCancelEdit) {
                onCancelEdit();
                setInputText('');
                if (textareaRef.current) textareaRef.current.style.height = 'auto';
            } else if (replyingTo && onCancelReply) {
                onCancelReply();
            }
        }
    };

    const hasContent = Boolean(inputText.trim() || selectedFiles.length > 0);

    return (
        <div className="px-4 py-2.5 bg-white dark:bg-[#12161c] border-t border-slate-200/80 dark:border-slate-800 shrink-0 z-10">
            {/* Telegram-style Clean Borderless Edit Strip */}
            {editingMessage && (
                <div className="mb-2 px-1 flex items-center justify-between text-xs animate-in fade-in">
                    <div className="flex items-center gap-2.5 min-w-0 flex-1 mr-2">
                        <Edit2 size={13} className="text-slate-500 dark:text-slate-400 shrink-0" />
                        <div className="min-w-0 flex-1">
                            <div className="text-[11px] font-semibold text-slate-700 dark:text-slate-200 leading-tight">Edit Message</div>
                            <div className="text-[12px] text-slate-500 dark:text-slate-400 truncate leading-tight mt-0.5">
                                {editingMessage.message}
                            </div>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => {
                            if (onCancelEdit) onCancelEdit();
                            setInputText('');
                            if (textareaRef.current) textareaRef.current.style.height = 'auto';
                        }}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors shrink-0"
                        title="Cancel edit (Esc)"
                    >
                        <X size={15} />
                    </button>
                </div>
            )}

            {/* Telegram-style Clean Borderless Reply Strip */}
            {!editingMessage && replyingTo && (
                <div className="mb-2 px-1 flex items-center justify-between text-xs animate-in fade-in">
                    <div
                        onClick={() => {
                            const el = document.getElementById(`msg-${replyingTo.id}`);
                            if (el) {
                                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                el.classList.add('highlight-pulse-message');
                                setTimeout(() => el.classList.remove('highlight-pulse-message'), 1800);
                            }
                        }}
                        className="flex items-center gap-2.5 min-w-0 flex-1 mr-2 cursor-pointer hover:opacity-80 transition-opacity select-none"
                        title="Click to view original message"
                    >
                        <CornerUpLeft size={13} className="text-slate-500 dark:text-slate-400 shrink-0" />
                        <div className="min-w-0 flex-1">
                            <div className="text-[11px] font-semibold text-slate-700 dark:text-slate-200 leading-tight">
                                Replying to {replyingTo.is_me ? 'yourself' : partnerName}
                            </div>
                            <div className="text-[12px] text-slate-500 dark:text-slate-400 truncate leading-tight mt-0.5">
                                {replyingTo.message || 'Attachment'}
                            </div>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onCancelReply}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors shrink-0"
                        title="Cancel reply"
                    >
                        <X size={15} />
                    </button>
                </div>
            )}

            {/* Selected Attachments Preview */}
            {selectedFiles.length > 0 && (
                <div className="mb-2 flex flex-wrap gap-2">
                    {selectedFiles.map((file, idx) => (
                        <div
                            key={idx}
                            className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg text-xs border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 shadow-2xs animate-in fade-in"
                        >
                            {file.type.startsWith('image/') ? (
                                <ImageIcon size={13} className="text-[#FF4A1F]" />
                            ) : (
                                <Paperclip size={13} className="text-blue-500" />
                            )}
                            <span className="max-w-[150px] truncate font-medium">{file.name}</span>
                            <button
                                type="button"
                                onClick={() => handleRemoveFile(idx)}
                                className="text-slate-400 hover:text-rose-500 ml-1 cursor-pointer"
                            >
                                <X size={13} />
                            </button>
                        </div>
                    ))}
                </div>
            )}

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

                    <div className="relative" ref={emojiPickerRef}>
                        <button
                            type="button"
                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                            className="h-8 w-8 sm:h-9 sm:w-9 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
                            title="Emoji"
                        >
                            <Smile size={18} />
                        </button>
                        {showEmojiPicker && (
                            <div className="absolute bottom-11 left-0 z-50 bg-white dark:bg-slate-800 shadow-xl rounded-2xl border border-slate-200 dark:border-slate-700 p-2.5 grid grid-cols-4 gap-1.5 w-52 animate-in fade-in slide-in-from-bottom-2 duration-150">
                                {EMOJIS.map(e => (
                                    <button
                                        key={e}
                                        type="button"
                                        onClick={() => {
                                            setInputText(prev => prev + e);
                                            setShowEmojiPicker(false);
                                        }}
                                        className="text-xl p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer text-center"
                                    >
                                        {e}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
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
