import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Trash2, AlertTriangle, X, ShieldAlert, AlertCircle } from 'lucide-react';
import Button from '@/components/ui/button';

export interface DeleteConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void> | void;
    title?: string;
    subtitle?: string;
    memberName?: string;
    memberEmail?: string;
    memberRole?: string;
    memberId?: string;
    avatar?: string;
    confirmText?: string;
    cancelText?: string;
    isPermanent?: boolean;
    warningMessage?: string;
}

export default function DeleteConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title = 'Delete Team Member',
    subtitle = 'Move to Trash Bin',
    memberName,
    memberEmail,
    memberRole,
    memberId,
    avatar,
    confirmText = 'Delete Member',
    cancelText = 'Cancel',
    isPermanent = false,
    warningMessage
}: DeleteConfirmationModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleConfirm = async () => {
        setIsSubmitting(true);
        try {
            await onConfirm();
            onClose();
        } catch (err) {
            console.error('Delete action failed:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const initials = avatar || (memberName 
        ? memberName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() 
        : 'TM');

    return createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-900/60 backdrop-blur-2xs p-4 animate-in fade-in duration-150 font-sans">
            <div 
                className="bg-white dark:bg-[#1e2329] w-full max-w-md rounded-[5px] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col animate-in zoom-in-95 duration-150"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Modal Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2.5 text-red-600 dark:text-red-400">
                        <div className="w-8 h-8 rounded-full bg-red-50 dark:bg-red-950/40 flex items-center justify-center shrink-0">
                            {isPermanent ? <ShieldAlert size={18} /> : <Trash2 size={18} />}
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-tight">
                                {title}
                            </h3>
                            <p className="text-[11px] text-slate-500">
                                {subtitle}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer rounded-full transition-colors"
                        aria-label="Close"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-5 space-y-4 text-xs">
                    {/* Item Information Card (if provided) */}
                    {(memberName || memberEmail) && (
                        <div className="p-3 rounded bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold flex items-center justify-center text-xs shrink-0">
                                {initials}
                            </div>
                            <div className="min-w-0 flex-1">
                                {memberName && (
                                    <h4 className="font-bold text-slate-900 dark:text-slate-100 truncate text-[12.5px]">
                                        {memberName}
                                    </h4>
                                )}
                                <p className="text-[11px] text-slate-500 truncate">
                                    {memberRole && <span>{memberRole} • </span>}
                                    {memberId && <span>{memberId} • </span>}
                                    {memberEmail && <span>{memberEmail}</span>}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Warning Notice Box */}
                    <div className="p-3 bg-red-50/80 dark:bg-red-950/30 rounded border border-red-200/80 dark:border-red-900/40 flex items-start gap-2.5">
                        <AlertTriangle size={16} className="text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                        <div className="text-[11.5px] text-red-700 dark:text-red-300 leading-relaxed">
                            {warningMessage || (isPermanent 
                                ? 'Are you sure you want to permanently delete this member? This action CANNOT be undone and will permanently remove all associated records.' 
                                : 'Are you sure you want to delete this team member? They will be moved to the Trash Bin and lose access to the portal. You can restore them anytime from the Trash Bin tab.')
                            }
                        </div>
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="px-5 py-3.5 bg-slate-50/60 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2.5">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="h-8 px-3.5 text-xs font-semibold rounded-[3px] cursor-pointer"
                    >
                        {cancelText}
                    </Button>
                    <Button
                        variant="primary"
                        size="sm"
                        onClick={handleConfirm}
                        disabled={isSubmitting}
                        className="h-8 px-3.5 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white flex items-center gap-1.5 cursor-pointer shadow-xs rounded-[3px]"
                    >
                        <Trash2 size={13} />
                        <span>{isSubmitting ? 'Deleting...' : confirmText}</span>
                    </Button>
                </div>
            </div>
        </div>,
        document.body
    );
}
