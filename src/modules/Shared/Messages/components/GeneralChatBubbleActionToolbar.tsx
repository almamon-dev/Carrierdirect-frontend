import React from 'react';
import { CornerUpLeft, Edit2, MoreVertical, Pin, Trash2 } from 'lucide-react';

interface GeneralChatBubbleActionToolbarProps {
    isSent: boolean;
    isMenuOpen: boolean;
    setIsMenuOpen: (val: boolean) => void;
    menuPlacement: 'top' | 'bottom';
    menuRef: React.RefObject<HTMLDivElement | null>;
    hasText: boolean;
    isPinned: boolean;
    onDelete?: () => void;
    onStartEdit?: () => void;
    onTogglePin: () => void;
    onReply?: () => void;
}

export const GeneralChatBubbleActionToolbar: React.FC<GeneralChatBubbleActionToolbarProps> = ({
    isSent,
    isMenuOpen,
    setIsMenuOpen,
    menuPlacement,
    menuRef,
    hasText,
    isPinned,
    onDelete,
    onStartEdit,
    onTogglePin,
    onReply,
}) => {
    const renderDropdownMenu = () => (
        <div
            className={`absolute left-1/2 -translate-x-1/2 bg-white dark:bg-[#1e293b] text-slate-800 dark:text-slate-100 rounded-2xl p-1.5 shadow-xl border border-slate-200/90 dark:border-slate-700 min-w-[155px] z-50 animate-in zoom-in-95 fade-in-0 duration-150 ${
                menuPlacement === 'top' ? 'bottom-full mb-2.5' : 'top-full mt-2.5'
            }`}
            onClick={(e) => e.stopPropagation()}
        >
            {/* Pointer Arrow */}
            {menuPlacement === 'top' ? (
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-[6px] border-x-transparent border-t-[6px] border-t-white dark:border-t-[#1e293b]" />
            ) : (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-[6px] border-x-transparent border-b-[6px] border-b-white dark:border-b-[#1e293b]" />
            )}

            {/* Delete Option */}
            {onDelete && (
                <button
                    type="button"
                    onClick={onDelete}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer text-left text-[13px] font-medium"
                >
                    <span>Delete</span>
                    <Trash2 size={14} className="text-red-500 shrink-0" />
                </button>
            )}

            {/* Edit Option (if sent & has text) */}
            {isSent && onStartEdit && hasText && (
                <button
                    type="button"
                    onClick={onStartEdit}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer text-left text-[13px] font-medium"
                >
                    <span>Edit</span>
                    <Edit2 size={14} className="text-slate-500 dark:text-slate-400 shrink-0" />
                </button>
            )}

            {/* Pin Option */}
            <button
                type="button"
                onClick={onTogglePin}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer text-left text-[13px] font-medium"
            >
                <span>{isPinned ? 'Unpin' : 'Pin'}</span>
                <Pin size={14} className={`shrink-0 ${isPinned ? 'text-amber-500 fill-amber-500' : 'text-slate-500 dark:text-slate-400'}`} />
            </button>
        </div>
    );

    return (
        <div
            className={`self-center shrink-0 flex items-center gap-1 transition-opacity duration-150 ${
                isMenuOpen ? 'opacity-100 z-50' : 'opacity-0 group-hover:opacity-100 z-20'
            }`}
        >
            {isSent ? (
                <>
                    {/* More options button */}
                    <div className="relative" ref={menuRef}>
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsMenuOpen(!isMenuOpen);
                            }}
                            className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                                isMenuOpen
                                    ? 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white shadow-xs'
                                    : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'
                            }`}
                            title="More options"
                        >
                            <MoreVertical size={14} />
                        </button>
                        {isMenuOpen && renderDropdownMenu()}
                    </div>

                    {/* Reply button */}
                    {onReply && (
                        <button
                            type="button"
                            onClick={onReply}
                            className="w-7 h-7 rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                            title="Reply"
                        >
                            <CornerUpLeft size={14} />
                        </button>
                    )}
                </>
            ) : (
                <>
                    {/* Reply button */}
                    {onReply && (
                        <button
                            type="button"
                            onClick={onReply}
                            className="w-7 h-7 rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                            title="Reply"
                        >
                            <CornerUpLeft size={14} />
                        </button>
                    )}

                    {/* More options button */}
                    <div className="relative" ref={menuRef}>
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsMenuOpen(!isMenuOpen);
                            }}
                            className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                                isMenuOpen
                                    ? 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white shadow-xs'
                                    : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'
                            }`}
                            title="More options"
                        >
                            <MoreVertical size={14} />
                        </button>
                        {isMenuOpen && renderDropdownMenu()}
                    </div>
                </>
            )}
        </div>
    );
};
