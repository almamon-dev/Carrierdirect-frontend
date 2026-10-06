import React, { useState, useRef, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { MoreVertical, Edit2, Trash2, Power, CheckCircle2 } from 'lucide-react';
import Button from '@/components/ui/button';
import { ServiceAreaItem } from '../index';

interface ServiceAreaRowActionsProps {
    row: ServiceAreaItem;
    onEdit: (item: ServiceAreaItem) => void;
    onToggleStatus: (id: string) => void;
    onDelete: (id: string) => void;
}

export const ServiceAreaRowActions: React.FC<ServiceAreaRowActionsProps> = ({
    row,
    onEdit,
    onToggleStatus,
    onDelete,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
    const triggerRef = useRef<HTMLButtonElement>(null);

    const handleClose = useCallback(() => setIsOpen(false), []);

    const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        if (isOpen) {
            setIsOpen(false);
        } else {
            const rect = e.currentTarget.getBoundingClientRect();
            const menuWidth = 190;
            const menuHeight = 150;
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            const left = Math.max(8, Math.min(rect.right - menuWidth, viewportWidth - menuWidth - 8));
            const spaceBelow = viewportHeight - rect.bottom;
            const top = spaceBelow < menuHeight && rect.top > menuHeight
                ? rect.top - menuHeight - 4
                : rect.bottom + 4;

            setDropdownPos({
                top: Math.max(8, top),
                left: Math.max(8, left)
            });
            setIsOpen(true);
        }
    };

    useEffect(() => {
        if (!isOpen) return;
        const handleKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose(); };
        const handleScroll = () => handleClose();
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('scroll', handleScroll, true);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('scroll', handleScroll, true);
        };
    }, [isOpen, handleClose]);

    return (
        <div className="relative flex items-center justify-end w-full min-h-[24px]">
            <Button
                ref={triggerRef}
                variant="ghost"
                size="sm"
                className="h-[26px] w-[26px] p-0 rounded-[3px] text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer flex items-center justify-center shrink-0"
                onClick={handleToggle}
                title="Actions"
            >
                <MoreVertical size={14} />
            </Button>

            {isOpen && createPortal(
                <>
                    <div
                        className="fixed inset-0 z-[9998] cursor-default bg-transparent"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleClose();
                        }}
                    />
                    <div
                        className="fixed w-48 bg-white dark:bg-[#1e2329] rounded-[4px] shadow-xl border border-slate-200 dark:border-slate-700/80 py-1 z-[9999] animate-in fade-in zoom-in-95 duration-100 text-left font-sans"
                        style={{ top: dropdownPos.top, left: dropdownPos.left }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-800">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Service Area</p>
                            <p className="font-bold text-slate-800 dark:text-slate-200 truncate text-xs flex items-center gap-1.5 mt-0.5">
                                <span>{row.flag}</span>
                                <span>{row.country}</span>
                            </p>
                        </div>

                        <button
                            type="button"
                            className="w-full text-left px-3 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 flex items-center gap-2.5 transition-colors font-medium cursor-pointer"
                            onClick={() => {
                                handleClose();
                                onEdit(row);
                            }}
                        >
                            <Edit2 size={13} className="text-slate-400 shrink-0" />
                            <span>Edit Details</span>
                        </button>

                        <button
                            type="button"
                            className="w-full text-left px-3 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 flex items-center gap-2.5 transition-colors font-medium cursor-pointer"
                            onClick={() => {
                                handleClose();
                                onToggleStatus(row.id);
                            }}
                        >
                            {row.isActive ? (
                                <>
                                    <Power size={13} className="text-amber-500 shrink-0" />
                                    <span>Deactivate Area</span>
                                </>
                            ) : (
                                <>
                                    <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                                    <span>Activate Area</span>
                                </>
                            )}
                        </button>

                        <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />

                        <button
                            type="button"
                            className="w-full text-left px-3 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2.5 transition-colors font-medium cursor-pointer"
                            onClick={() => {
                                handleClose();
                                onDelete(row.id);
                            }}
                        >
                            <Trash2 size={13} className="text-rose-500 shrink-0" />
                            <span>Delete Area</span>
                        </button>
                    </div>
                </>,
                document.body
            )}
        </div>
    );
};

export default ServiceAreaRowActions;
