import React, { useState, useRef, useEffect } from 'react';
import { Paperclip, Image as ImageIcon, Smile, Send, X, DollarSign, Calculator, Pencil, Check, AlertCircle } from 'lucide-react';
import { CounterOfferModal } from './components/CounterOfferModal';
import { AttachmentsList } from './components/AttachmentsList';

const EMOJIS = ['😀', '😂', '🥰', '😎', '🤔', '👍', '🙏', '🔥', '✨', '💯', '🎉', '💡', '✅', '❌', '🚚', '📦'];
const MAX_FILE_SIZE_BYTES = 200 * 1024 * 1024; // 200 MB limit

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
    currency?: string;
}) {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previewModalFile, setPreviewModalFile] = useState<File | null>(null);
    const [showAllFilesModal, setShowAllFilesModal] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [showCounterOfferModal, setShowCounterOfferModal] = useState(false);
    const [fileErrorMessage, setFileErrorMessage] = useState<string | null>(null);

    const imageInputRef = useRef<HTMLInputElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const emojiPickerRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
                setShowEmojiPicker(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Smooth WhatsApp-style auto-resize without layout shifting
    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = '20px';
            const scrollH = textarea.scrollHeight;
            if (scrollH > 20) {
                const newHeight = Math.min(scrollH, 120);
                textarea.style.height = `${newHeight}px`;
            }
        }
    }, [inputValue]);

    const handleSend = () => {
        if (!inputValue.trim() && selectedFiles.length === 0) return;
        if (onSendMessage) {
            onSendMessage(inputValue, selectedFiles.length > 0 ? selectedFiles : undefined);
        }
        setInputValue('');
        setSelectedFiles([]);
        if (textareaRef.current) {
            textareaRef.current.style.height = '20px';
        }
        setTimeout(scrollToBottom, 50);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const incomingFiles = Array.from(e.target.files);
            const validFiles: File[] = [];
            const oversizedFiles: File[] = [];

            incomingFiles.forEach(file => {
                if (file.size > MAX_FILE_SIZE_BYTES) {
                    oversizedFiles.push(file);
                } else {
                    validFiles.push(file);
                }
            });

            if (oversizedFiles.length > 0) {
                const sampleName = oversizedFiles[0].name;
                const sizeMb = (oversizedFiles[0].size / (1024 * 1024)).toFixed(1);
                setFileErrorMessage(`"${sampleName}" exceeds the 200 MB size limit (${sizeMb} MB). Max allowed size is 200 MB.`);
                setTimeout(() => setFileErrorMessage(null), 6000);
            } else {
                setFileErrorMessage(null);
            }

            if (validFiles.length > 0) {
                setSelectedFiles(prev => [...prev, ...validFiles]);
            }
        }
        e.target.value = '';
    };

    const removeFile = (index: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleAddEmoji = (emoji: string) => {
        setInputValue(inputValue + emoji);
        setShowEmojiPicker(false);
        if (onTyping) onTyping();
        if (textareaRef.current) textareaRef.current.focus();
    };

    const hasContent = Boolean(inputValue.trim() || selectedFiles.length > 0);

    return (
        <div className="relative border-t border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-[#181d24] transition-colors">
            {/* 200MB Max File Validation Error Banner */}
            {fileErrorMessage && (
                <div className="flex items-center justify-between px-4 py-2 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-xs font-semibold border-b border-rose-200/80 dark:border-rose-900/40 animate-in fade-in duration-150">
                    <span className="flex items-center gap-1.5">
                        <AlertCircle size={14} className="text-rose-600 shrink-0" />
                        <span>{fileErrorMessage}</span>
                    </span>
                    <button type="button" onClick={() => setFileErrorMessage(null)} className="hover:opacity-75 p-1 cursor-pointer">
                        <X size={13} />
                    </button>
                </div>
            )}

            {/* Edit Message Indicator Banner */}
            {isEditing && (
                <div className="flex items-center justify-between px-4 py-1.5 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 text-xs font-semibold border-b border-amber-200/60 dark:border-amber-900/40 animate-in fade-in duration-150">
                    <span className="flex items-center gap-1.5">
                        <Pencil size={13} className="text-amber-600" /> Editing Message
                    </span>
                    <button type="button" onClick={onCancelEdit} className="hover:underline flex items-center gap-0.5 text-[11px] cursor-pointer">
                        <X size={12} /> Cancel
                    </button>
                </div>
            )}

            {/* Attached files preview chips */}
            <AttachmentsList
                selectedFiles={selectedFiles}
                onRemoveFile={removeFile}
                previewModalFile={previewModalFile}
                setPreviewModalFile={setPreviewModalFile}
                showAllFilesModal={showAllFilesModal}
                setShowAllFilesModal={setShowAllFilesModal}
            />

            {/* Main Action Bar */}
            <div className="flex items-end gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-2 sm:py-2.5">
                {/* Left Attachment Actions */}
                <div className="flex items-center gap-0.5 text-slate-400 dark:text-slate-500 shrink-0 pb-0.5">
                    <input type="file" ref={imageInputRef} onChange={handleFileSelect} accept="image/*" multiple className="hidden" />
                    <button
                        type="button"
                        onClick={() => imageInputRef.current?.click()}
                        className="h-8 w-8 sm:h-9 sm:w-9 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
                        title="Attach Photo"
                    >
                        <ImageIcon size={18} />
                    </button>

                    <input type="file" ref={fileInputRef} onChange={handleFileSelect} multiple className="hidden" />
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="h-8 w-8 sm:h-9 sm:w-9 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
                        title="Attach Document"
                    >
                        <Paperclip size={18} />
                    </button>

                    <div className="relative" ref={emojiPickerRef}>
                        <button
                            type="button"
                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                            className="h-8 w-8 sm:h-9 sm:w-9 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
                            title="Insert Emoji"
                        >
                            <Smile size={18} />
                        </button>
                        {showEmojiPicker && (
                            <div className="absolute bottom-11 left-0 z-50 bg-white dark:bg-slate-800 shadow-xl rounded-2xl border border-slate-200 dark:border-slate-700 p-2.5 grid grid-cols-4 gap-1.5 w-52 animate-in fade-in slide-in-from-bottom-2 duration-150">
                                {EMOJIS.map(e => (
                                    <button
                                        key={e}
                                        type="button"
                                        onClick={() => handleAddEmoji(e)}
                                        className="text-xl p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer text-center"
                                    >
                                        {e}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* WhatsApp-Style Clean Input Field (consistent radius & zero layout jumping) */}
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

                {/* Right Actions: Counter Offer & Send Button */}
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

            {/* Counter / Revision Offer Modal */}
            <CounterOfferModal
                isOpen={showCounterOfferModal}
                onClose={() => setShowCounterOfferModal(false)}
                isSupplier={isSupplier}
                initialBaseFreight={initialBaseFreight}
                currency={currency}
                onSubmit={(amt, note) => onSendCounterOffer && onSendCounterOffer(amt, note)}
            />
        </div>
    );
}
