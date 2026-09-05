import React from 'react';
import { Paperclip, Image as ImageIcon, Smile } from 'lucide-react';

const EMOJIS = ['😀', '😂', '🥰', '😎', '🤔', '👍', '🙏', '🔥', '✨', '💯', '🎉', '💡', '✅', '❌', '🚚', '📦'];

interface ChatInputMediaActionsProps {
    imageInputRef: React.RefObject<HTMLInputElement | null>;
    fileInputRef: React.RefObject<HTMLInputElement | null>;
    emojiPickerRef: React.RefObject<HTMLDivElement | null>;
    showEmojiPicker: boolean;
    setShowEmojiPicker: React.Dispatch<React.SetStateAction<boolean>>;
    onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onAddEmoji: (emoji: string) => void;
}

export const ChatInputMediaActions: React.FC<ChatInputMediaActionsProps> = ({
    imageInputRef,
    fileInputRef,
    emojiPickerRef,
    showEmojiPicker,
    setShowEmojiPicker,
    onFileSelect,
    onAddEmoji,
}) => {
    return (
        <div className="flex items-center gap-0.5 text-slate-400 dark:text-slate-500 shrink-0 pb-0.5">
            <input type="file" ref={imageInputRef} onChange={onFileSelect} accept="image/*" multiple className="hidden" />
            <button
                type="button"
                onClick={() => imageInputRef.current?.click()}
                className="h-8 w-8 sm:h-9 sm:w-9 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
                title="Attach Photo"
            >
                <ImageIcon size={18} />
            </button>

            <input type="file" ref={fileInputRef} onChange={onFileSelect} multiple className="hidden" />
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
                                onClick={() => onAddEmoji(e)}
                                className="text-xl p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer text-center"
                            >
                                {e}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
