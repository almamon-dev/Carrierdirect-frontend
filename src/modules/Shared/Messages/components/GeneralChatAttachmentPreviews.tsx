import React from 'react';
import { Image as ImageIcon, Paperclip, X } from 'lucide-react';

interface GeneralChatAttachmentPreviewsProps {
    selectedFiles: File[];
    onRemoveFile: (index: number) => void;
}

export const GeneralChatAttachmentPreviews: React.FC<GeneralChatAttachmentPreviewsProps> = ({
    selectedFiles,
    onRemoveFile,
}) => {
    if (selectedFiles.length === 0) return null;

    return (
        <div className="mb-2 flex flex-wrap gap-2">
            {selectedFiles.map((file, idx) => (
                <div
                    key={idx}
                    className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg text-xs border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 shadow-2xs animate-in fade-in"
                >
                    {file.type.startsWith('image/') ? (
                        <ImageIcon size={13} className="text-[#FF4A1F]" />
                    ) : (
                        <Paperclip size={13} className="text-blue-500" />
                    )}
                    <span className="max-w-[150px] truncate font-medium">{file.name}</span>
                    <button
                        type="button"
                        onClick={() => onRemoveFile(idx)}
                        className="text-slate-400 hover:text-rose-500 ml-1 cursor-pointer"
                    >
                        <X size={13} />
                    </button>
                </div>
            ))}
        </div>
    );
};
