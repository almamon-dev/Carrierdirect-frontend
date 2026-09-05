import React from 'react';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';

interface ImportModalFooterProps {
    processingStep: 1 | 2 | 3 | 4 | 5;
    hasFile?: boolean;
    extractedData?: any;
    isUploading?: boolean;
    isPersisting?: boolean;
    isCsvMode?: boolean;
    isProcessing?: boolean;
    onBack: () => void;
    onCancel: () => void;
    onNext: () => void;
    onOpenInForm: () => void;
    onConfirmImport: () => void;
}

export const ImportModalFooter: React.FC<ImportModalFooterProps> = ({
    processingStep,
    isCsvMode = false,
    isProcessing = false,
    onBack,
    onCancel,
    onNext,
    onOpenInForm,
    onConfirmImport,
}) => {
    if (isProcessing) {
        return null;
    }

    return (
        <div className="px-5 py-3 bg-slate-50/70 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between font-sans">
            <div>
                {processingStep > 1 ? (
                    <button
                        type="button"
                        className="h-9 min-w-[80px] px-3.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 rounded-[5px] inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                        onClick={onBack}
                    >
                        <ArrowLeft size={14} />
                        <span>Back</span>
                    </button>
                ) : (
                    <div />
                )}
            </div>

            <div className="flex items-center gap-2.5">
                <button
                    type="button"
                    className="h-9 min-w-[85px] px-4 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-100 rounded-[5px] inline-flex items-center justify-center transition-all cursor-pointer shadow-2xs"
                    onClick={onCancel}
                >
                    Cancel
                </button>

                {processingStep < 5 ? (
                    <button
                        type="button"
                        className="h-9 min-w-[130px] px-5 text-xs font-semibold text-white bg-[#FF4A1F] hover:bg-[#e03e15] rounded-[5px] inline-flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer"
                        onClick={onNext}
                    >
                        <span>{processingStep === 1 ? 'Continue to Upload' : 'Continue'}</span>
                        <ArrowRight size={14} />
                    </button>
                ) : (
                    <>
                        <button
                            type="button"
                            className="h-9 min-w-[100px] px-4 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-[5px] inline-flex items-center justify-center transition-all cursor-pointer shadow-2xs"
                            onClick={onOpenInForm}
                        >
                            Edit in Form
                        </button>
                        <button
                            type="button"
                            className="h-9 min-w-[140px] px-5 text-xs font-semibold text-white bg-[#FF4A1F] hover:bg-[#e03e15] rounded-[5px] inline-flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer"
                            onClick={onConfirmImport}
                        >
                            <Check size={14} />
                            <span>Confirm & Create</span>
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};
