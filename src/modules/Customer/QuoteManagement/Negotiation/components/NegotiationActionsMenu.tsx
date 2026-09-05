import React from 'react';
import { createPortal } from 'react-dom';
import { Eye, MessageSquare, Copy, Check } from 'lucide-react';

interface NegotiationActionsMenuProps {
    isOpen: boolean;
    dropdownPos: { top: number; left: number };
    copied: boolean;
    onClose: () => void;
    onViewDetails: () => void;
    onOpenChat: () => void;
    onCopyId: () => void;
}

export const NegotiationActionsMenu: React.FC<NegotiationActionsMenuProps> = ({
    isOpen,
    dropdownPos,
    copied,
    onClose,
    onViewDetails,
    onOpenChat,
    onCopyId,
}) => {
    if (!isOpen) return null;

    return createPortal(
        <>
            <div
                className="fixed inset-0 z-[9998] cursor-default bg-transparent"
                onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                }}
            />
            <div
                className="fixed w-48 bg-white dark:bg-[#1e2329] rounded-lg shadow-xl border border-slate-200 dark:border-slate-700/80 py-1.5 z-[9999] animate-in fade-in zoom-in-95 duration-100 text-left"
                style={{ top: dropdownPos.top, left: dropdownPos.left }}
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    type="button"
                    className="w-full text-left px-3.5 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 flex items-center gap-2.5 transition-colors font-medium cursor-pointer"
                    onClick={onViewDetails}
                >
                    <Eye size={14} className="text-slate-400 dark:text-slate-400 shrink-0" />
                    <span>View Details</span>
                </button>

                <button
                    type="button"
                    className="w-full text-left px-3.5 py-2 text-xs text-[#ff4a1f] hover:bg-orange-50 dark:hover:bg-[#ff4a1f]/10 flex items-center gap-2.5 transition-colors font-bold cursor-pointer"
                    onClick={onOpenChat}
                >
                    <MessageSquare size={14} className="text-[#ff4a1f] shrink-0" />
                    <span>Open Chat Channel</span>
                </button>

                <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />

                <button
                    type="button"
                    className="w-full text-left px-3.5 py-2 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80 flex items-center gap-2.5 transition-colors font-medium cursor-pointer"
                    onClick={onCopyId}
                >
                    {copied ? (
                        <>
                            <Check size={14} className="text-emerald-500 shrink-0" />
                            <span className="text-emerald-600 font-semibold">Copied!</span>
                        </>
                    ) : (
                        <>
                            <Copy size={14} className="text-slate-400 shrink-0" />
                            <span>Copy ID</span>
                        </>
                    )}
                </button>
            </div>
        </>,
        document.body
    );
};
