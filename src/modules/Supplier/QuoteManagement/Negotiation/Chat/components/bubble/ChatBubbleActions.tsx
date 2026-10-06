import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical, Copy, Pin, Trash2, Check, Edit2 } from 'lucide-react';
import { ChatMessage } from '../../types';

interface ChatBubbleActionsProps {
    msg: ChatMessage;
    isSent: boolean;
    onTogglePin: () => void;
    onDelete: () => void;
    onStartEdit?: () => void;
}

export const ChatBubbleActions: React.FC<ChatBubbleActionsProps> = ({
    msg,
    isSent,
    onTogglePin,
    onDelete,
    onStartEdit,
}) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        if (isMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMenuOpen]);

    const handleCopy = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (msg.text) {
            navigator.clipboard.writeText(msg.text);
            setCopied(true);
            setTimeout(() => {
                setCopied(false);
                setIsMenuOpen(false);
            }, 1200);
        }
    };

    return (
        <div
            className={`self-center shrink-0 flex items-center relative transition-opacity duration-150 ${
                isMenuOpen ? 'opacity-100 z-50' : 'opacity-0 group-hover:opacity-100 z-30'
            }`}
            ref={menuRef}
        >
            {/* Circular Three-Dot Button */}
            <button
                type="button"
                onClick={(e) => {
                    e.stopPropagation();
                    setIsMenuOpen(!isMenuOpen);
                }}
                className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors cursor-pointer border shadow-2xs ${
                    isMenuOpen
                        ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-slate-300 dark:border-slate-600'
                        : 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200/90 dark:border-slate-700'
                }`}
                title="More options"
                aria-label="More options"
            >
                <MoreVertical size={14} />
            </button>

            {/* Popover Dropdown Menu */}
            {isMenuOpen && (
                <div
                    className={`absolute ${
                        isSent ? 'right-0' : 'left-0'
                    } bottom-full mb-1.5 w-38 bg-white dark:bg-[#1e293b] text-slate-800 dark:text-slate-100 rounded-xl p-1 shadow-xl border border-slate-200/90 dark:border-slate-700 min-w-[145px] z-50 animate-in zoom-in-95 fade-in-0 duration-150 text-[12px] font-medium font-sans`}
                    onClick={(e) => e.stopPropagation()}
                >
                    {Boolean(msg.text) && (
                        <button
                            type="button"
                            onClick={handleCopy}
                            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer text-left"
                        >
                            {copied ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} className="text-slate-500 dark:text-slate-400" />}
                            <span>{copied ? 'Copied!' : 'Copy Text'}</span>
                        </button>
                    )}

                    <button
                        type="button"
                        onClick={() => {
                            onTogglePin();
                            setIsMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer text-left"
                    >
                        <Pin size={13} className={msg.isPinned ? 'text-amber-500 fill-amber-500' : 'text-slate-500 dark:text-slate-400'} />
                        <span>{msg.isPinned ? 'Unpin' : 'Pin'}</span>
                    </button>

                    {isSent && onStartEdit && (
                        <button
                            type="button"
                            onClick={() => {
                                onStartEdit();
                                setIsMenuOpen(false);
                            }}
                            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-blue-600 dark:text-blue-400 transition-colors cursor-pointer text-left"
                        >
                            <Edit2 size={13} />
                            <span>Edit</span>
                        </button>
                    )}

                    <div className="border-t border-slate-100 dark:border-slate-800 my-1" />

                    <button
                        type="button"
                        onClick={() => {
                            onDelete();
                            setIsMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer text-left"
                    >
                        <Trash2 size={13} />
                        <span>Delete</span>
                    </button>
                </div>
            )}
        </div>
    );
};
