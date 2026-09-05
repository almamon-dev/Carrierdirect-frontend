import React from 'react';
import { Upload, CheckCircle2, FileSpreadsheet, FileText, ArrowLeft, RefreshCw } from 'lucide-react';

interface Step2FileUploadProps {
    isCsvMode: boolean;
    processingFileName: string;
    localFileSize: string;
    isDraggingMain: boolean;
    isProcessingFile: boolean;
    setIsDraggingMain: (val: boolean) => void;
    onFileSelect: (file: File) => void;
    onClearFile: () => void;
    onBackToGuidelines: () => void;
    internalFileInputRef: React.RefObject<HTMLInputElement | null>;
    pdfInputRef: React.RefObject<HTMLInputElement | null>;
}

export const Step2FileUpload: React.FC<Step2FileUploadProps> = ({
    isCsvMode,
    processingFileName,
    localFileSize,
    isDraggingMain,
    isProcessingFile,
    setIsDraggingMain,
    onFileSelect,
    onClearFile,
    onBackToGuidelines,
    internalFileInputRef,
    pdfInputRef,
}) => {
    return (
        <div className="space-y-4 py-1 font-sans">
            {/* Header info */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                        {isCsvMode ? 'Upload Quote Requests Spreadsheet' : 'Upload Logistics Document'}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Select or drop your prepared {isCsvMode ? 'CSV / XLSX' : 'PDF / Document'} file here to parse.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={onBackToGuidelines}
                    className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                    <ArrowLeft size={12} />
                    <span>View Guidelines</span>
                </button>
            </div>

            {/* Full-width clean Dropzone */}
            <div
                onDragOver={(e) => { e.preventDefault(); setIsDraggingMain(true); }}
                onDragLeave={() => setIsDraggingMain(false)}
                onDrop={(e) => {
                    e.preventDefault();
                    setIsDraggingMain(false);
                    if (e.dataTransfer.files?.[0]) onFileSelect(e.dataTransfer.files[0]);
                }}
                className={`w-full min-h-[200px] border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
                    isDraggingMain
                        ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30 shadow-inner'
                        : 'border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:border-slate-400'
                }`}
                onClick={() => (internalFileInputRef.current || pdfInputRef.current)?.click()}
            >
                {processingFileName ? (
                    <div className="space-y-2 text-center max-w-sm">
                        <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto border border-emerald-200 dark:border-emerald-800 shadow-2xs">
                            <CheckCircle2 size={24} />
                        </div>
                        <div>
                            <p className="font-bold text-slate-900 dark:text-slate-100 text-sm truncate max-w-[280px] mx-auto">
                                {processingFileName}
                            </p>
                            {localFileSize && (
                                <p className="text-slate-400 text-xs font-mono mt-0.5">{localFileSize}</p>
                            )}
                        </div>
                        
                        <div className="pt-2 flex items-center justify-center gap-2">
                            <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); onClearFile(); }}
                                className="px-3 py-1 text-xs font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md transition-colors cursor-pointer inline-flex items-center gap-1.5 shadow-2xs"
                            >
                                <RefreshCw size={12} />
                                <span>Replace File</span>
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-3 max-w-sm">
                        <div className="w-12 h-12 rounded-full bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center mx-auto border border-slate-200 dark:border-slate-700 shadow-2xs">
                            {isCsvMode ? <FileSpreadsheet size={22} className="text-emerald-600 dark:text-emerald-400" /> : <FileText size={22} className="text-red-500 dark:text-red-400" />}
                        </div>
                        <div>
                            <p className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                                {isCsvMode ? 'Drop CSV or XLSX file here' : 'Drop PDF or Image here'}
                            </p>
                            <p className="text-slate-400 dark:text-slate-500 text-xs mt-0.5">
                                Drag & drop or click anywhere to browse from your device
                            </p>
                        </div>
                        <div className="pt-1">
                            <span className="inline-block px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-md text-xs font-medium border border-slate-200 dark:border-slate-700">
                                Browse File
                            </span>
                        </div>
                    </div>
                )}

                {isProcessingFile && (
                    <div className="mt-3 text-xs text-indigo-600 dark:text-indigo-400 font-semibold animate-pulse flex items-center gap-1.5">
                        <RefreshCw size={13} className="animate-spin" />
                        <span>Parsing and extracting requests from file...</span>
                    </div>
                )}
            </div>
        </div>
    );
};
