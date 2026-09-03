import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface ImportModalFooterProps {
    processingStep: 1 | 2 | 3 | 4;
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
        <div className="px-5 py-3 bg-slate-50/50 dark:bg-slate-900/30 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between font-sans">
            <div>
                {processingStep > 1 ? (
                    <button
                        type="button"
                        className="h-8 px-3 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 inline-flex items-center gap-1 transition-colors cursor-pointer"
                        onClick={onBack}
                    >
                        <ArrowLeft size={13} />
                        <span>Back</span>
                    </button>
                ) : (
                    <span />
                )}
            </div>

            <div className="flex items-center gap-2">
                <button
                    type="button"
                    className="h-8 px-3.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors cursor-pointer"
                    onClick={onCancel}
                >
                    Cancel
                </button>

                {processingStep < 4 ? (
                    <button
                        type="button"
                        className="h-8 px-4 text-xs font-semibold text-white bg-slate-900 dark:bg-slate-100 dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200 rounded-md inline-flex items-center justify-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                        onClick={onNext}
                    >
                        <span>Continue</span>
                        <ArrowRight size={13} />
                    </button>
                ) : (
                    <>
                        <button
                            type="button"
                            className="h-8 px-3 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors cursor-pointer"
                            onClick={onOpenInForm}
                        >
                            Edit in Form
                        </button>
                        <button
                            type="button"
                            className="h-8 px-4 text-xs font-semibold text-white bg-slate-900 dark:bg-slate-100 dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200 rounded-md inline-flex items-center justify-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                            onClick={onConfirmImport}
                        >
                            <span>Confirm & Create</span>
                            <ArrowRight size={13} />
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};
