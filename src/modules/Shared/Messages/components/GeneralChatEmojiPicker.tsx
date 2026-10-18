import React, { useRef, useEffect } from 'react';
import { Smile } from 'lucide-react';

const EMOJIS = ['👍', '❤️', '😂', '😮', '😢', '😡', '🙏', '🔥', '🎉', '👏', '🤝', '💯'];

interface GeneralChatEmojiPickerProps {
    showEmojiPicker: boolean;
    setShowEmojiPicker: (val: boolean) => void;
    onSelectEmoji: (emoji: string) => void;
}

export const GeneralChatEmojiPicker: React.FC<GeneralChatEmojiPickerProps> = ({
    showEmojiPicker,
    setShowEmojiPicker,
    onSelectEmoji,
}) => {
    const emojiPickerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!showEmojiPicker) return;
        const handleClickOutside = (e: MouseEvent) => {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(e.target as Node)) {
                setShowEmojiPicker(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showEmojiPicker, setShowEmojiPicker]);

    return (
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
                    {EMOJIS.map((e) => (
                        <button
                            key={e}
                            type="button"
                            onClick={() => {
                                onSelectEmoji(e);
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
    );
};
