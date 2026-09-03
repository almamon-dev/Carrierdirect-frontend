import React, { useState, useRef, useEffect } from 'react';
import { Send, Image as ImageIcon, Paperclip, Smile, X } from 'lucide-react';

const EMOJIS = ['😀', '😂', '🥰', '😎', '🤔', '👍', '🙏', '🔥', '✨', '💯', '🎉', '💡', '✅', '❌', '🚚', '📦'];

interface GeneralChatInputBarProps {
    onSendMessage: (text: string, files: File[]) => void;
    isSending: boolean;
}

export const GeneralChatInputBar: React.FC<GeneralChatInputBarProps> = ({
    onSendMessage,
    isSending
}) => {
    const [inputText, setInputText] = useState('');
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const imageInputRef = useRef<HTMLInputElement>(null);
    const docInputRef = useRef<HTMLInputElement>(null);
    const emojiPickerRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
                setShowEmojiPicker(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
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
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
        }
    };

    const handleSubmit = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        const trimmed = inputText.trim();
        if (!trimmed && selectedFiles.length === 0) return;
        onSendMessage(trimmed, selectedFiles);
        setInputText('');
        setSelectedFiles([]);
        if (textareaRef.current) textareaRef.current.style.height = 'auto';
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    const hasContent = Boolean(inputText.trim() || selectedFiles.length > 0);

    return (
        <div className="px-4 py-3 bg-white dark:bg-[#12161c] border-t border-slate-200/80 dark:border-slate-800 shrink-0 z-10">
            {selectedFiles.length > 0 && (
                <div className="mb-2.5 flex flex-wrap gap-2">
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
                        className="h-8 w-8 sm:h-9 sm:w-9 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
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
                        placeholder="Type a message..."
                        className="w-full resize-none max-h-32 p-0 m-0 text-[13px] sm:text-[13.5px] bg-transparent border-none text-slate-800 dark:text-slate-100 placeholder:text-slate-400 font-medium focus:outline-none focus:ring-0 leading-[20px] block"
                    />
                </div>

                <button
                    type="submit"
                    disabled={!hasContent || isSending}
                    className={`h-9 w-9 flex items-center justify-center rounded-full transition-all shrink-0 ${
                        hasContent && !isSending
                            ? 'bg-[#00a884] hover:bg-[#008f70] text-white shadow-xs active:scale-95 cursor-pointer'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                    }`}
                    title="Send message"
                >
                    <Send size={15} />
                </button>
            </form>
        </div>
    );
};

export default GeneralChatInputBar;
