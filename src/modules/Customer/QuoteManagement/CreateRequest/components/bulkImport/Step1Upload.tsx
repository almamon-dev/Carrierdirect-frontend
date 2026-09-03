import React from 'react';
import { Upload, CheckCircle2 } from 'lucide-react';
import { downloadPDFTemplate, downloadCSVTemplate } from '../../templates';

interface Step1UploadProps {
    isCsvMode: boolean;
    processingFileName: string;
    localFileSize: string;
    isDraggingMain: boolean;
    isProcessingFile: boolean;
    setIsDraggingMain: (val: boolean) => void;
    onFileSelect: (file: File) => void;
    onClearFile: () => void;
    onOpenAllowedValuesGuide: () => void;
    internalFileInputRef: React.RefObject<HTMLInputElement | null>;
    pdfInputRef: React.RefObject<HTMLInputElement | null>;
}

const WIZARD_GUIDE_STEPS = [
    { num: 1, text: 'Download the standard CSV or PDF template' },
    { num: 2, text: 'Fill in pickup, delivery, cargo & pricing details' },
    { num: 3, text: 'Drop your file on the right to import requests' },
];

export const Step1Upload: React.FC<Step1UploadProps> = ({
    isCsvMode,
    processingFileName,
    localFileSize,
    isDraggingMain,
    isProcessingFile,
    setIsDraggingMain,
    onFileSelect,
    onClearFile,
    onOpenAllowedValuesGuide,
    internalFileInputRef,
    pdfInputRef,
}) => {
    return (
        <div className="space-y-4 py-1 font-sans">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                {/* Left Column: Simple Step Instructions */}
                <div className="md:col-span-6 space-y-4">
                    <div>
                        <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
                            {isCsvMode ? 'Upload Quote Requests Spreadsheet' : 'Upload Logistics Document'}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            Import single or multiple freight quote requests directly into your dispatch pipeline.
                        </p>
                    </div>

                    <div className="space-y-4 relative pl-0.5">
                        {WIZARD_GUIDE_STEPS.map((st, idx, arr) => (
                            <div key={st.num} className="flex items-start gap-3 relative">
                                {idx < arr.length - 1 && (
                                    <div className="absolute left-[11.5px] top-6 bottom-[-16px] w-[1px] bg-slate-200 dark:bg-slate-700" />
                                )}
                                <div className="w-6 h-6 rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-center text-xs font-semibold text-slate-800 dark:text-slate-200 shrink-0 z-10 shadow-2xs">
                                    {st.num}
                                </div>
                                <div className="text-xs pt-0.5">
                                    <p className="text-slate-800 dark:text-slate-200 font-medium leading-relaxed">{st.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Template and guide links */}
                    <div className="pt-2 flex items-center gap-3 text-xs">
                        <button
                            type="button"
                            onClick={isCsvMode ? downloadCSVTemplate : downloadPDFTemplate}
                            className="font-medium text-slate-900 dark:text-slate-100 hover:underline inline-flex items-center gap-1 cursor-pointer"
                        >
                            <span>{isCsvMode ? 'Download template' : 'Sample PDF template'}</span>
                            <span className="text-[10px]">↗</span>
                        </button>
                        <span className="text-slate-300 dark:text-slate-700">•</span>
                        <button
                            type="button"
                            onClick={onOpenAllowedValuesGuide}
                            className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 underline cursor-pointer"
                        >
                            Values guide ↗
                        </button>
                    </div>
                </div>

                {/* Right Column: Minimal Dropzone */}
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
            </div>
        </div>
    );
};
