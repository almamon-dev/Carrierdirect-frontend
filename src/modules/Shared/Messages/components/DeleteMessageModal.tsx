import React, { useState, useEffect } from 'react';
import Modal from '@/components/modals/modal';
import { Loader2 } from 'lucide-react';

interface DeleteMessageModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (type: 'everyone' | 'for_me') => Promise<void> | void;
    isSent: boolean;
    isLoading?: boolean;
}

export const DeleteMessageModal: React.FC<DeleteMessageModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    isSent,
    isLoading = false,
}) => {
    const [deleteType, setDeleteType] = useState<'everyone' | 'for_me'>(isSent ? 'everyone' : 'for_me');

    useEffect(() => {
        if (isOpen) {
            setDeleteType(isSent ? 'everyone' : 'for_me');
        }
    }, [isOpen, isSent]);

    const handleConfirm = () => {
        onConfirm(deleteType);
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="md"
            title={isSent ? 'Who do you want to unsend this message for?' : 'Who do you want to remove this message for?'}
            showCloseButton={!isLoading}
            closeOnOutsideClick={!isLoading}
            className="dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-[5px]"
            footer={
                <>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isLoading}
                        className="px-4 py-2 rounded-[3px] font-semibold text-xs text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleConfirm}
                        disabled={isLoading}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-[3px] font-semibold text-xs text-white bg-red-600 hover:bg-red-700 transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
                    >
                        {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                        <span>{isLoading ? 'Removing...' : (deleteType === 'everyone' ? 'Unsend' : 'Remove')}</span>
                    </button>
                </>
            }
        >
            <div className="space-y-3 py-1">
                {isSent && (
                    /* Option 1: Unsend for everyone */
                    <div
                        onClick={() => !isLoading && setDeleteType('everyone')}
                        className={`flex items-start gap-3 p-3 rounded-lg border transition-all cursor-pointer select-none ${
                            deleteType === 'everyone'
                                ? 'border-red-500/60 bg-red-50/50 dark:bg-red-950/20 dark:border-red-500/40'
                                : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                        }`}
                    >
                        <div className="mt-0.5 shrink-0">
                            <div
                                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                                    deleteType === 'everyone'
                                        ? 'border-red-600 bg-red-600'
                                        : 'border-slate-400 dark:border-slate-600'
                                }`}
                            >
                                {deleteType === 'everyone' && (
                                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                                )}
                            </div>
                        </div>
                        <div className="flex-1">
                            <span className="block text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
                                Unsend for everyone
                            </span>
                            <span className="block text-[11.5px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                                This message will be unsent for everyone in the chat. Others may have already seen or forwarded it. Unsent messages can still be included in reports.
                            </span>
                        </div>
                    </div>
                )}

                {/* Option 2: Unsend for you */}
                <div
                    onClick={() => !isLoading && setDeleteType('for_me')}
                    className={`flex items-start gap-3 p-3 rounded-lg border transition-all cursor-pointer select-none ${
                        deleteType === 'for_me'
                            ? 'border-red-500/60 bg-red-50/50 dark:bg-red-950/20 dark:border-red-500/40'
                            : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                    }`}
                >
                    <div className="mt-0.5 shrink-0">
                        <div
                            className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                                deleteType === 'for_me'
                                    ? 'border-red-600 bg-red-600'
                                    : 'border-slate-400 dark:border-slate-600'
                            }`}
                        >
                            {deleteType === 'for_me' && (
                                <div className="w-1.5 h-1.5 rounded-full bg-white" />
                            )}
                        </div>
                    </div>
                    <div className="flex-1">
                        <span className="block text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
                            Unsend for you
                        </span>
                        <span className="block text-[11.5px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                            This message will be removed for you. Others in the chat will still be able to see it.
                        </span>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default DeleteMessageModal;
