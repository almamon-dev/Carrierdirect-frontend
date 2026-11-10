import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { MoreVertical, Edit2, Trash2, CheckCircle2, XCircle } from 'lucide-react';
import Button from '@/components/ui/button';
import { SubcontractorDriver } from '../types';

interface SubcontractorDriverRowActionsProps {
    driver: SubcontractorDriver;
    onEdit: (driver: SubcontractorDriver) => void;
    onDelete: (driver: SubcontractorDriver) => void;
    onToggleStatus?: (driver: SubcontractorDriver) => void;
}

export const SubcontractorDriverRowActions: React.FC<SubcontractorDriverRowActionsProps> = ({
    driver,
    onEdit,
    onDelete,
    onToggleStatus,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
    const triggerRef = useRef<HTMLButtonElement>(null);

    const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        if (isOpen) {
            setIsOpen(false);
        } else {
            const rect = e.currentTarget.getBoundingClientRect();
            setDropdownPos({
                top: rect.bottom + 4,
                left: Math.max(10, rect.right - 170),
            });
            setIsOpen(true);
        }
    };

    const handleClose = () => setIsOpen(false);

    useEffect(() => {
        if (!isOpen) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') handleClose();
        };
        const handleScroll = () => handleClose();
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('scroll', handleScroll, true);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('scroll', handleScroll, true);
        };
    }, [isOpen]);

    const isActive = driver.status === 'active';

    return (
        <div className="relative flex items-center justify-end w-full">
            <Button
                ref={triggerRef}
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 rounded-[4px] text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer ml-auto flex items-center justify-center"
                onClick={handleToggle}
                title="Options"
            >
                <MoreVertical size={14} />
            </Button>

            {isOpen &&
                createPortal(
                    <>
                        <div
                            className="fixed inset-0 z-[9998] cursor-default bg-transparent"
                            onClick={handleClose}
                        />
                        <div
                            className="fixed w-44 bg-white dark:bg-[#1e2329] rounded-[4px] shadow-xl border border-slate-200 dark:border-slate-700/80 py-1 z-[9999] animate-in fade-in zoom-in-95 duration-100 text-left font-sans text-xs"
                            style={{ top: dropdownPos.top, left: dropdownPos.left }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                type="button"
                                className="w-full text-left px-3 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 font-medium cursor-pointer"
                                onClick={() => {
                                    handleClose();
                                    onEdit(driver);
                                }}
                            >
                                <Edit2 size={13} className="text-slate-500" />
                                <span>Edit Driver</span>
                            </button>

                            {onToggleStatus && (
                                <button
                                    type="button"
                                    className={`w-full text-left px-3 py-2 flex items-center gap-2 font-medium cursor-pointer ${
                                        isActive
                                            ? 'text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30'
                                            : 'text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30'
                                    }`}
                                    onClick={() => {
                                        handleClose();
                                        onToggleStatus(driver);
                                    }}
                                >
                                    {isActive ? (
                                        <>
                                            <XCircle size={13} className="text-amber-500" />
                                            <span>Mark as Inactive</span>
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle2 size={13} className="text-emerald-600" />
                                            <span>Mark as Active</span>
                                        </>
                                    )}
                                </button>
                            )}

                            <div className="border-t border-slate-100 dark:border-slate-800 my-1" />

                            <button
                                type="button"
                                className="w-full text-left px-3 py-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2 font-medium cursor-pointer"
                                onClick={() => {
                                    handleClose();
                                    onDelete(driver);
                                }}
                            >
                                <Trash2 size={13} />
                                <span>Delete Driver</span>
                            </button>
                        </div>
                    </>,
                    document.body
                )}
        </div>
    );
};

export default SubcontractorDriverRowActions;
