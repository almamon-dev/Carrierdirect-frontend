import React from 'react';
import { createPortal } from 'react-dom';
import { Eye, MessageSquare, CheckCircle, Loader2, XCircle } from 'lucide-react';

interface QuoteReceivedActionsMenuProps {
    isOpen: boolean;
    dropdownPos: { top: number; left: number };
    dropdownRef: React.RefObject<HTMLDivElement | null>;
    isPending: boolean;
    isNegotiating: boolean;
    isAccepting?: boolean;
    onClose: () => void;
    onViewDetails: () => void;
    onOpenChat: () => void;
    onAccept: () => void;
    onReject: () => void;
}

export const QuoteReceivedActionsMenu: React.FC<QuoteReceivedActionsMenuProps> = ({
    isOpen,
    dropdownPos,
    dropdownRef,
    isPending,
    isNegotiating,
    isAccepting,
    onClose,
    onViewDetails,
    onOpenChat,
    onAccept,
    onReject,
}) => {
    if (!isOpen) return null;

    return createPortal(
        <div
            ref={dropdownRef}
            className="fixed w-44 bg-white dark:bg-[#1e2329] rounded-[5px] shadow-xl border border-slate-200 dark:border-slate-700/80 py-1.5 z-[9999] animate-in fade-in zoom-in-95 duration-100 text-left font-sans"
            style={{ top: dropdownPos.top, left: dropdownPos.left }}
            onClick={(e) => e.stopPropagation()}
        >
            <button
                type="button"
                className="w-full text-left px-3.5 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 flex items-center gap-2.5 transition-colors font-medium cursor-pointer"
                onClick={() => {
                    onClose();
                    onViewDetails();
                }}
            >
                <Eye size={14} className="text-slate-400 shrink-0" />
                <span>View Details</span>
            </button>

            <button
                type="button"
                className="w-full text-left px-3.5 py-2 text-xs text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 flex items-center gap-2.5 transition-colors font-medium cursor-pointer"
                onClick={() => {
                    onClose();
                    onOpenChat();
                }}
            >
                <MessageSquare size={14} className="text-indigo-500 shrink-0" />
                <span>Chat / Negotiate</span>
            </button>

            {(isPending || isNegotiating) && (
                <button
                    type="button"
                    disabled={isAccepting}
                    className="w-full text-left px-3.5 py-2 text-xs text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 flex items-center gap-2.5 transition-colors font-bold cursor-pointer disabled:opacity-50"
                    onClick={() => {
                        onClose();
                        onAccept();
                    }}
                >
                    {isAccepting ? (
                        <Loader2 size={14} className="animate-spin text-emerald-600 shrink-0" />
                    ) : (
                        <CheckCircle size={14} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                    )}
                    <span>Accept Offer</span>
                </button>
            )}

            {(isPending || isNegotiating) && (
                <button
                    type="button"
                    className="w-full text-left px-3.5 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2.5 transition-colors font-medium cursor-pointer border-t border-slate-100 dark:border-slate-800/80 mt-1 pt-1.5"
                    onClick={() => {
                        onClose();
                        onReject();
                    }}
                >
                    <XCircle size={14} className="text-rose-500 shrink-0" />
                    <span>Decline Offer</span>
                </button>
            )}
        </div>,
        document.body
    );
};
