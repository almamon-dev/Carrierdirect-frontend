import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Eye, MoreVertical, Copy, Check, Globe } from 'lucide-react';
import Button from '@/components/ui/button';
import { useToastStore } from '@/stores/useToastStore';

export interface ActivityLogItem {
    id: number | string;
    rawId: number | string;
    logCode: string;
    user: string;
    userRole: string;
    userEmail: string;
    avatar: string;
    action: string;
    rawAction: string;
    actionType: 'create' | 'update' | 'delete' | 'security' | 'status' | 'invite' | 'system';
    target: string;
    targetType: string;
    category: string;
    description: string;
    ipAddress: string;
    location: string;
    userAgent?: string;
    status: 'Success' | 'Warning' | 'Failed';
    time: string;
    timeAgo: string;
    rawDate: string;
}

interface ActivityLogActionsProps {
    row: ActivityLogItem;
    onViewDetails: (row: ActivityLogItem) => void;
}

export const ActivityLogActions: React.FC<ActivityLogActionsProps> = ({ row, onViewDetails }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
    const triggerRef = useRef<HTMLButtonElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const showToast = useToastStore((state) => state.showToast);

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

    const handleCopy = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        showToast(`Copied ${label} to clipboard`, 'success');
        setTimeout(() => {
            setCopied(false);
            handleClose();
        }, 1000);
    };

    useEffect(() => {
        if (!isOpen) return;

        const handleMouseDown = (e: MouseEvent) => {
            if (
                dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
                triggerRef.current && !triggerRef.current.contains(e.target as Node)
            ) {
                handleClose();
            }
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') handleClose();
        };

        const handleScroll = () => handleClose();

        document.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('keydown', handleKeyDown);
        window.addEventListener('scroll', handleScroll, true);

        return () => {
            document.removeEventListener('mousedown', handleMouseDown);
            document.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('scroll', handleScroll, true);
        };
    }, [isOpen]);

    return (
        <div className="relative flex items-center justify-end w-full">
            <Button
                ref={triggerRef}
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 rounded-[2px] text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer ml-auto flex items-center justify-center"
                onClick={handleToggle}
                title="Actions"
            >
                <MoreVertical size={15} />
            </Button>

            {isOpen && createPortal(
                <div
                    ref={dropdownRef}
                    className="fixed w-44 bg-white dark:bg-[#1e2329] rounded-lg shadow-xl border border-slate-200 dark:border-slate-700/80 py-1.5 z-[9999] animate-in fade-in zoom-in-95 duration-100 text-left font-sans"
                    style={{ top: dropdownPos.top, left: dropdownPos.left }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        type="button"
                        className="w-full text-left px-3.5 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 flex items-center gap-2.5 transition-colors font-medium cursor-pointer"
                        onClick={() => {
                            handleClose();
                            onViewDetails(row);
                        }}
                    >
                        <Eye size={14} className="text-[#ff4a1f] shrink-0" />
                        <span>View Log Details</span>
                    </button>

                    <button
                        type="button"
                        className="w-full text-left px-3.5 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 flex items-center gap-2.5 transition-colors font-medium cursor-pointer"
                        onClick={() => handleCopy(row.logCode, 'Log ID')}
                    >
                        {copied ? (
                            <Check size={14} className="text-emerald-500 shrink-0" />
                        ) : (
                            <Copy size={14} className="text-slate-400 dark:text-slate-400 shrink-0" />
                        )}
                        <span>Copy Log ID</span>
                    </button>

                    <button
                        type="button"
                        className="w-full text-left px-3.5 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 flex items-center gap-2.5 transition-colors font-medium cursor-pointer"
                        onClick={() => handleCopy(row.ipAddress, 'IP Address')}
                    >
                        <Globe size={14} className="text-slate-400 shrink-0" />
                        <span>Copy IP Address</span>
                    </button>
                </div>,
                document.body
            )}
        </div>
    );
};
