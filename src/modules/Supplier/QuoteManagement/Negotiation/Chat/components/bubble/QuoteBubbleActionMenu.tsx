import React from 'react';
import { Check, Copy, MoreVertical, Pin, Trash2 } from 'lucide-react';

interface QuoteBubbleActionMenuProps {
    isSentByMe: boolean;
    isMenuOpen: boolean;
    setIsMenuOpen: (val: boolean | ((prev: boolean) => boolean)) => void;
    menuRef: React.RefObject<HTMLDivElement | null>;
    handleCopyDetails: (e: React.MouseEvent) => void;
    copied: boolean;
    handleTogglePinMessage?: (id: number | string) => void;
    handleDeleteMessage?: (id: number | string) => void;
    msgId: number | string;
    isPinned?: boolean;
}

export const QuoteBubbleActionMenu: React.FC<QuoteBubbleActionMenuProps> = ({
    isSentByMe,
    isMenuOpen,
    setIsMenuOpen,
    menuRef,
    handleCopyDetails,
    copied,
    handleTogglePinMessage,
    handleDeleteMessage,
    msgId,
    isPinned,
}) => {
    return (
        <div
            className={`absolute top-1/2 -translate-y-1/2 ${
                isSentByMe ? 'right-full mr-2' : 'left-full ml-2'
            } transition-opacity duration-150 z-30 ${
                isMenuOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
            }`}
            ref={menuRef}
        >
            <button
                type="button"
                onClick={(e) => {
                    e.stopPropagation();
                    setIsMenuOpen(!isMenuOpen);
                }}
                className={`w-6 h-6 min-w-[24px] min-h-[24px] rounded-full flex items-center justify-center transition-colors cursor-pointer border shadow-2xs ${
                    isMenuOpen
                        ? 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-white border-slate-300 dark:border-slate-600'
                        : 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200/90 dark:border-slate-700'
                }`}
                title="More options"
                aria-label="More options"
            >
                <MoreVertical size={13} />
            </button>

            {isMenuOpen && (
                <div
                    className={`absolute ${
                        isSentByMe ? 'right-0' : 'left-0'
                    } bottom-full mb-1.5 w-40 bg-white dark:bg-[#1e293b] text-slate-800 dark:text-slate-100 rounded-lg p-1 shadow-xl border border-slate-200/90 dark:border-slate-700 min-w-[155px] z-50 animate-in zoom-in-95 fade-in-0 duration-150 text-[12px] font-medium font-sans`}
                >
                    <button
                        type="button"
                        onClick={handleCopyDetails}
                        className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer text-left"
                    >
                        {copied ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} className="text-slate-500 dark:text-slate-400" />}
                        <span>{copied ? 'Copied!' : 'Copy Details'}</span>
                    </button>

                    {handleTogglePinMessage && (
                        <button
                            type="button"
                            onClick={() => {
                                handleTogglePinMessage(msgId);
                                setIsMenuOpen(false);
                            }}
                            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer text-left"
                        >
                            <Pin
                                size={13}
                                className={isPinned ? 'text-amber-500 fill-amber-500' : 'text-slate-500 dark:text-slate-400'}
                            />
                            <span>{isPinned ? 'Unpin from Top' : 'Pin to Top'}</span>
                        </button>
                    )}

                    {handleDeleteMessage && (
                        <>
                            <div className="border-t border-slate-100 dark:border-slate-800 my-1" />
                            <button
                                type="button"
                                onClick={() => {
                                handleDeleteMessage(msgId);
                                setIsMenuOpen(false);
                            }}
                            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer text-left"
                        >
                            <Trash2 size={13} className="text-rose-500" />
                            <span>Delete</span>
                        </button>
                    </>
                )}
            </div>
        )}
    </div>
);
};
