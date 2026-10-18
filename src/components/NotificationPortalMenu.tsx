import React from 'react';
import { createPortal } from 'react-dom';
import { Check, Clock, ExternalLink, Copy, Trash2 } from 'lucide-react';
import { HeaderNotification } from '@/hooks/useHeaderNotifications';

interface NotificationPortalMenuProps {
    activeNotif: HeaderNotification;
    menuPos: { top: number; left: number };
    onClose: () => void;
    onMarkAsRead: (id: string | number) => void;
    onMarkAsUnread: (id: string | number) => void;
    onViewDetails: (notif: HeaderNotification) => void;
    onDelete: (id: string | number) => void;
}

export const NotificationPortalMenu: React.FC<NotificationPortalMenuProps> = ({
    activeNotif,
    menuPos,
    onClose,
    onMarkAsRead,
    onMarkAsUnread,
    onViewDetails,
    onDelete,
}) => {
    return createPortal(
        <div data-notif-portal="true">
            <div
                className="fixed inset-0 z-[9998] cursor-default bg-transparent"
                onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                }}
            />
            <div
                className="fixed w-[140px] bg-white dark:bg-[#1e2329] rounded-[4px] shadow-lg border border-slate-200/90 dark:border-slate-700/80 py-1 z-[9999] animate-in fade-in zoom-in-95 duration-100 text-left font-sans text-xs"
                style={{ top: menuPos.top, left: menuPos.left }}
                onClick={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
            >
                {activeNotif.unread ? (
                    <button
                        type="button"
                        className="w-full text-left px-2.5 py-1.5 text-[11px] text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 transition-colors font-medium cursor-pointer"
                        onClick={(e) => {
                            e.stopPropagation();
                            onMarkAsRead(activeNotif.id);
                            onClose();
                        }}
                    >
                        <Check size={12.5} className="text-emerald-500 shrink-0" />
                        <span>Mark as read</span>
                    </button>
                ) : (
                    <button
                        type="button"
                        className="w-full text-left px-2.5 py-1.5 text-[11px] text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 transition-colors font-medium cursor-pointer"
                        onClick={(e) => {
                            e.stopPropagation();
                            onMarkAsUnread(activeNotif.id);
                            onClose();
                        }}
                    >
                        <Clock size={12.5} className="text-[#ff4a1f] shrink-0" />
                        <span>Mark as unread</span>
                    </button>
                )}

                <button
                    type="button"
                    className="w-full text-left px-2.5 py-1.5 text-[11px] text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 transition-colors font-medium cursor-pointer"
                    onClick={(e) => {
                        e.stopPropagation();
                        onClose();
                        onViewDetails(activeNotif);
                    }}
                >
                    <ExternalLink size={12.5} className="text-slate-400 shrink-0" />
                    <span>View Details</span>
                </button>

                <button
                    type="button"
                    className="w-full text-left px-2.5 py-1.5 text-[11px] text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 transition-colors font-medium cursor-pointer"
                    onClick={(e) => {
                        e.stopPropagation();
                        navigator.clipboard.writeText(`${activeNotif.title}: ${activeNotif.desc}`);
                        onClose();
                    }}
                >
                    <Copy size={12.5} className="text-slate-400 shrink-0" />
                    <span>Copy Text</span>
                </button>

                <div className="border-t border-slate-100 dark:border-slate-800 my-0.5" />

                <button
                    type="button"
                    className="w-full text-left px-2.5 py-1.5 text-[11px] text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-2 transition-colors font-semibold cursor-pointer"
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(activeNotif.id);
                        onClose();
                    }}
                >
                    <Trash2 size={12.5} className="shrink-0" />
                    <span>Delete</span>
                </button>
            </div>
        </div>,
        document.body
    );
};
