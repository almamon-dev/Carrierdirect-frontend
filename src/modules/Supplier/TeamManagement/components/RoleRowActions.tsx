import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Edit, MoreVertical, Copy, Check, Trash2 } from 'lucide-react';
import Button from '@/components/ui/button';

export interface RoleItem {
    id: number | string;
    rawId?: number | string;
    name: string;
    description: string;
    count: number;
    permissions: any[];
    isSystemDefault: boolean;
}

interface RoleRowActionsProps {
    row: RoleItem;
    onEdit: (row: RoleItem) => void;
    onDelete: (row: RoleItem) => void;
}

export const RoleRowActions: React.FC<RoleRowActionsProps> = ({ row, onEdit, onDelete }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
    const triggerRef = useRef<HTMLButtonElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

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

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
            handleClose();
        }, 1200);
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
                    className="fixed w-44 bg-white dark:bg-[#1e2329] rounded-lg shadow-xl border border-slate-200 dark:border-slate-700/80 py-1.5 z-[9999] animate-in fade-in zoom-in-95 duration-100 text-left"
                    style={{ top: dropdownPos.top, left: dropdownPos.left }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        type="button"
                        className="w-full text-left px-3.5 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 flex items-center gap-2.5 transition-colors font-medium cursor-pointer"
                        onClick={() => {
                            handleClose();
                            onEdit(row);
                        }}
                    >
                        <Edit size={14} className="text-[#ff4a1f] shrink-0" />
                        <span>Edit Permissions</span>
                    </button>

                    <button
                        type="button"
                        className="w-full text-left px-3.5 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 flex items-center gap-2.5 transition-colors font-medium cursor-pointer"
                        onClick={() => handleCopy(row.name)}
                    >
                        {copied ? (
                            <Check size={14} className="text-emerald-500 shrink-0" />
                        ) : (
                            <Copy size={14} className="text-slate-400 dark:text-slate-400 shrink-0" />
                        )}
                        <span>{copied ? 'Copied Name!' : 'Copy Role Name'}</span>
                    </button>

                    {!row.isSystemDefault ? (
                        <>
                            <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />
                            <button
                                type="button"
                                className="w-full text-left px-3.5 py-2 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-2.5 transition-colors font-medium cursor-pointer"
                                onClick={() => {
                                    handleClose();
                                    onDelete(row);
                                }}
                            >
                                <Trash2 size={14} className="text-red-500 shrink-0" />
                                <span>Delete Role</span>
                            </button>
                        </>
                    ) : (
                        <>
                            <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />
                            <div className="px-3.5 py-1 text-[10.5px] text-slate-400 dark:text-slate-500 italic">
                                System Default Role
                            </div>
                        </>
                    )}
                </div>,
                document.body
            )}
        </div>
    );
};
