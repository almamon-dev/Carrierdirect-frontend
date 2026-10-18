import { Loader2 } from "lucide-react";
import React from "react";

interface ComplianceModalFooterProps {
    step: 1 | 2 | 3;
    canDismiss?: boolean;
    isSubmitting: boolean;
    isCurrentStepValid: boolean;
    onBack: () => void;
    onClose: () => void;
    onNext: () => void;
}

export const ComplianceModalFooter: React.FC<ComplianceModalFooterProps> = ({
    step,
    canDismiss = true,
    isSubmitting,
    isCurrentStepValid,
    onBack,
    onClose,
    onNext,
}) => {
    return (
        <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-[#181a20] shrink-0 flex items-center justify-end gap-2.5 sm:gap-3">
            {step > 1 && (
                <button
                    type="button"
                    onClick={onBack}
                    className="px-5 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-[4px] border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                >
                    Back
                </button>
            )}

            {canDismiss && (
                <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-[4px] border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                >
                    Cancel
                </button>
            )}

            <button
                type="button"
                disabled={!isCurrentStepValid || isSubmitting}
                onClick={onNext}
                className={`px-6 py-2.5 rounded-[4px] text-xs font-semibold transition-all flex items-center gap-1.5 shadow-xs ${
                    isCurrentStepValid && !isSubmitting
                        ? "bg-[#FF4A1F] hover:bg-[#E03E15] text-white cursor-pointer active:scale-[0.99]"
                        : "bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed opacity-60"
                }`}
            >
                {isSubmitting ? (
                    <>
                        <Loader2 size={13} className="animate-spin" />
                        <span>Submitting...</span>
                    </>
                ) : (
                    <span>
                        {step < 3 ? "Next" : "Submit for Verification"}
                    </span>
                )}
            </button>
        </div>
    );
};
