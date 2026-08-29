import React from 'react';
import { X, File as FileIcon } from 'lucide-react';
import Modal from '@/components/modals/modal';

interface AttachmentsListProps {
    selectedFiles: File[];
    onRemoveFile: (index: number) => void;
    previewModalFile: File | null;
    setPreviewModalFile: (file: File | null) => void;
    showAllFilesModal: boolean;
    setShowAllFilesModal: (show: boolean) => void;
}

export function AttachmentsList({
    selectedFiles,
    onRemoveFile,
    previewModalFile,
    setPreviewModalFile,
    showAllFilesModal,
    setShowAllFilesModal
}: AttachmentsListProps) {
    if (selectedFiles.length === 0) return null;

    return (
        <>
            <div className="flex items-center gap-2 px-3 pt-2 pb-1 overflow-x-auto border-t border-slate-100 dark:border-slate-800">
                {selectedFiles.map((file, idx) => (
                    <div
                        key={idx}
                        className="relative group shrink-0 flex items-center gap-2 p-1.5 pr-2 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700"
                    >
                        {file.type.startsWith('image/') ? (
                            <div className="w-8 h-8 rounded bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700 flex items-center justify-center overflow-hidden shrink-0">
                                <img
                                    src={URL.createObjectURL(file)}
                                    alt={file.name}
                                    className="w-full h-full object-contain p-0.5 cursor-pointer"
                                    onClick={() => setPreviewModalFile(file)}
                                />
                            </div>
                        ) : (
                            <div className="w-8 h-8 rounded bg-slate-200/80 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0">
                                <FileIcon size={16} />
                            </div>
                        )}
                        <div className="text-left max-w-[100px]">
                            <p className="text-[11px] font-semibold text-slate-800 dark:text-slate-200 truncate">{file.name}</p>
                            <p className="text-[9px] text-slate-400">{(file.size / 1024).toFixed(0)} KB</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => onRemoveFile(idx)}
                            className="p-1 text-slate-400 hover:text-red-500 rounded-full hover:bg-white dark:hover:bg-slate-700 transition-colors"
                        >
                            <X size={12} />
                        </button>
                    </div>
                ))}
            </div>

            {previewModalFile && (
                <Modal isOpen={Boolean(previewModalFile)} onClose={() => setPreviewModalFile(null)} size="lg">
                    <div className="p-2 flex flex-col items-center">
                        <img
                            src={URL.createObjectURL(previewModalFile)}
                            alt="preview"
                            className="max-h-[70vh] rounded-lg object-contain"
                        />
                        <p className="mt-2 text-xs font-semibold text-slate-600 dark:text-slate-400">{previewModalFile.name}</p>
                    </div>
                </Modal>
            )}
        </>
    );
}
