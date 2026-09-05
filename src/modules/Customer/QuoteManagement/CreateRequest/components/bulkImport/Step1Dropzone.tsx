import React from 'react';
import { CheckCircle2, Upload } from 'lucide-react';

interface Step1DropzoneProps {
    isCsvMode: boolean;
    processingFileName: string;
    localFileSize: string;
    isDraggingMain: boolean;
    isProcessingFile: boolean;
    setIsDraggingMain: (val: boolean) => void;
    onFileSelect: (file: File) => void;
    onClearFile: () => void;
    internalFileInputRef: React.RefObject<HTMLInputElement | null>;
    pdfInputRef: React.RefObject<HTMLInputElement | null>;
}

export const Step1Dropzone: React.FC<Step1DropzoneProps> = ({
    isCsvMode,
    processingFileName,
    localFileSize,
    isDraggingMain,
    isProcessingFile,
    setIsDraggingMain,
    onFileSelect,
    onClearFile,
    internalFileInputRef,
    pdfInputRef,
}) => {
    return (
        <div className="md:col-span-6">
            <div
                onDragOver={(e) => { e.preventDefault(); setIsDraggingMain(true); }}
                onDragLeave={() => setIsDraggingMain(false)}
                onDrop={(e) => {
                    e.preventDefault();
                    setIsDraggingMain(false);
                    if (e.dataTransfer.files?.[0]) onFileSelect(e.dataTransfer.files[0]);
                }}
                className={`w-full min-h-[160px] border border-dashed rounded-lg p-5 flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
                    isDraggingMain
                        ? 'border-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/20'
                        : 'border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:border-slate-400'
                }`}
                onClick={() => (internalFileInputRef.current || pdfInputRef.current)?.click()}
            >
                {processingFileName ? (
                    <div className="space-y-1.5 p-1 text-center">
                        <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto border border-emerald-200 dark:border-emerald-800 shrink-0">
                            <CheckCircle2 size={16} />
                        </div>
                        <p className="font-semibold text-slate-900 dark:text-slate-100 text-xs truncate max-w-[220px] mx-auto">
                            {processingFileName}
                        </p>
                        {localFileSize && (
                            <p className="text-slate-400 text-[10.5px] font-mono">{localFileSize}</p>
                        )}
                        <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); onClearFile(); }}
                            className="text-[11px] text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 underline pt-1 cursor-pointer block mx-auto"
                        >
                            Replace file
                        </button>
                    </div>
                ) : (
                    <div className="space-y-1.5">
                        <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center mx-auto border border-slate-200 dark:border-slate-700">
                            <Upload size={15} />
                        </div>
                        <p className="font-medium text-slate-900 dark:text-slate-100 text-xs">
                            {isCsvMode ? 'Drop CSV or XLSX file here' : 'Drop PDF or Image here'}
                        </p>
                        <p className="text-slate-400 dark:text-slate-500 text-[11px]">or click to browse from device</p>
                    </div>
                )}

                {isProcessingFile && (
                    <div className="mt-2 text-[11px] text-indigo-600 dark:text-indigo-400 font-medium animate-pulse">
                        Reading file data...
                    </div>
                )}
            </div>
        </div>
    );
};
