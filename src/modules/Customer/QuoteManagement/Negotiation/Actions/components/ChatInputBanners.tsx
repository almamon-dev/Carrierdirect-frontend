import React from 'react';
import { AlertCircle, Pencil, X } from 'lucide-react';

interface ChatInputBannersProps {
    fileErrorMessage: string | null;
    setFileErrorMessage: (msg: string | null) => void;
    isEditing: boolean;
    onCancelEdit?: () => void;
}

export const ChatInputBanners: React.FC<ChatInputBannersProps> = ({
    fileErrorMessage,
    setFileErrorMessage,
    isEditing,
    onCancelEdit,
}) => {
    return (
        <>
            {fileErrorMessage && (
                <div className="flex items-center justify-between px-4 py-2 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-xs font-semibold border-b border-rose-200/80 dark:border-rose-900/40 animate-in fade-in duration-150">
                    <span className="flex items-center gap-1.5">
                        <AlertCircle size={14} className="text-rose-600 shrink-0" />
                        <span>{fileErrorMessage}</span>
                    </span>
                    <button type="button" onClick={() => setFileErrorMessage(null)} className="hover:opacity-75 p-1 cursor-pointer">
                        <X size={13} />
                    </button>
                </div>
            )}

            {isEditing && (
                <div className="flex items-center justify-between px-4 py-1.5 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 text-xs font-semibold border-b border-amber-200/60 dark:border-amber-900/40 animate-in fade-in duration-150">
                    <span className="flex items-center gap-1.5">
                        <Pencil size={13} className="text-amber-600" /> Editing Message
                    </span>
                    <button type="button" onClick={onCancelEdit} className="hover:underline flex items-center gap-0.5 text-[11px] cursor-pointer">
                        <X size={12} /> Cancel
                    </button>
                </div>
            )}
        </>
    );
};
