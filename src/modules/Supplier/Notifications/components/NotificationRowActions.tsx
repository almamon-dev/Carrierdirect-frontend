/**
 * NotificationRowActions Component
 * Three-dot menu button with portal dropdown for notification actions:
 * - Open / View Details
 * - Mark as Read
 * - Copy Message
 * - Delete Notification
 */

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { MoreVertical, ExternalLink, Check, Trash2, Copy, Eye } from 'lucide-react';
import Button from '@/components/ui/button';
import { HeaderNotification, normalizeNotifLink } from '@/hooks/useHeaderNotifications';

interface NotificationRowActionsProps {
    row: HeaderNotification;
    onMarkAsRead: (id: string | number) => void;
    onDelete: (id: string | number) => void;
}

export const NotificationRowActions: React.FC<NotificationRowActionsProps> = ({
    row,
    onMarkAsRead,
    onDelete,
}) => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });

    const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        if (isOpen) {
            setIsOpen(false);
        } else {
            const rect = e.currentTarget.getBoundingClientRect();
            setDropdownPos({
                top: rect.bottom + 4,
                left: Math.max(10, rect.right - 180),
            });
            setIsOpen(true);
        }
    };

    const handleClose = () => setIsOpen(false);

    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                handleClose();
            }
        };

        const handleScroll = () => {
            handleClose();
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('scroll', handleScroll, true);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('scroll', handleScroll, true);
        };
    }, [isOpen]);

    const handleCopy = () => {
        navigator.clipboard.writeText(`${row.title}: ${row.desc}`);
        handleClose();
    };

    return (
        <div className="relative flex items-center justify-end w-full" onClick={(e) => e.stopPropagation()}>
            {/* Three Dot Trigger Button */}
            <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 rounded-[3px] text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer ml-auto flex items-center justify-center"
                onClick={handleToggle}
                title="More actions"
            >
                <MoreVertical size={15} />
            </Button>

            {/* Dropdown Menu via Portal */}
            {isOpen && createPortal(
                <>
                    {/* Transparent Click-Outside Backdrop */}
                    <div
                        className="fixed inset-0 z-[9998] cursor-default bg-transparent"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleClose();
                        }}
                    />

                    <div
                        className="fixed w-44 bg-white dark:bg-[#1e2329] rounded-[3px] shadow-xl border border-slate-200 dark:border-slate-700/80 py-1.5 z-[9999] animate-in fade-in zoom-in-95 duration-100 text-left font-sans"
                        style={{ top: dropdownPos.top, left: dropdownPos.left }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Open Destination Link */}
                        {row.link && (
                            <button
                                type="button"
                                className="w-full text-left px-3 py-1.5 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 flex items-center gap-2 transition-colors font-medium cursor-pointer"
                                onClick={() => {
                                    handleClose();
                                    if (row.unread) onMarkAsRead(row.id);
                                    navigate(normalizeNotifLink(row.link));
                                }}
                            >
                                <ExternalLink size={13} className="text-slate-400 shrink-0" />
                                <span>Open Link</span>
                            </button>
                        )}

                        {/* Mark as Read */}
                        {row.unread && (
                            <button
                                type="button"
                                className="w-full text-left px-3 py-1.5 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 flex items-center gap-2 transition-colors font-medium cursor-pointer"
                                onClick={() => {
                                    handleClose();
                                    onMarkAsRead(row.id);
                                }}
                            >
                                <Check size={13} className="text-emerald-500 shrink-0" />
                                <span>Mark as Read</span>
                            </button>
                        )}

                        {/* Copy Content */}
                        <button
                            type="button"
                            className="w-full text-left px-3 py-1.5 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 flex items-center gap-2 transition-colors font-medium cursor-pointer"
                            onClick={handleCopy}
                        >
                            <Copy size={13} className="text-slate-400 shrink-0" />
                            <span>Copy Text</span>
                        </button>

                        <div className="border-t border-slate-100 dark:border-slate-800 my-1" />

                        {/* Delete Action */}
                        <button
                            type="button"
                            className="w-full text-left px-3 py-1.5 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-2 transition-colors font-semibold cursor-pointer"
                            onClick={() => {
                                handleClose();
                                onDelete(row.id);
                            }}
                        >
                            <Trash2 size={13} className="shrink-0" />
                            <span>Delete</span>
                        </button>
                    </div>
                </>,
                document.body
            )}
        </div>
    );
};
