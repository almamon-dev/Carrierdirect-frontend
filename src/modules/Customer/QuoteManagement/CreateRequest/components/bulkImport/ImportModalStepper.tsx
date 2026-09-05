import React from 'react';
import { Check } from 'lucide-react';

interface ImportModalStepperProps {
    processingStep: 1 | 2 | 3 | 4 | 5;
    isCsvMode: boolean;
    onStepChange: (step: 1 | 2 | 3 | 4 | 5) => void;
}

export const ImportModalStepper: React.FC<ImportModalStepperProps> = ({
    processingStep,
    isCsvMode,
    onStepChange,
}) => {
    const steps = [
        { num: 1, label: 'Guidelines' },
        { num: 2, label: isCsvMode ? 'Upload CSV' : 'Upload PDF' },
        { num: 3, label: 'Upload ZIP' },
        { num: 4, label: 'Preview' },
        { num: 5, label: isCsvMode ? 'Confirmation' : 'AI Process' },
    ];

    return (
        <div className="px-5 py-2.5 bg-slate-50/70 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between font-sans overflow-x-auto">
            {steps.map((st, idx, arr) => {
                const isActive = processingStep === st.num;
                const isPassed = processingStep > st.num;
                const isLast = idx === arr.length - 1;

                return (
                    <div key={st.num} className="flex items-center gap-2 flex-1 last:flex-none">
                        <button
                            type="button"
                            onClick={() => onStepChange(st.num as any)}
                            className="flex items-center gap-2 cursor-pointer group text-left"
                        >
                            <div
                                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10.5px] font-semibold shrink-0 transition-all ${
                                    isActive
                                        ? 'bg-[#FF4A1F] text-white shadow-xs'
                                        : isPassed
                                            ? 'bg-[#FF4A1F]/90 text-white'
                                            : 'border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:border-slate-400'
                                }`}
                            >
                                {isPassed ? <Check size={11} className="stroke-[2.5]" /> : st.num}
                            </div>
                            <span
                                className={`text-xs whitespace-nowrap ${
                                    isActive
                                        ? 'text-[#FF4A1F] dark:text-[#FF4A1F] font-bold'
                                        : isPassed
                                            ? 'text-slate-800 dark:text-slate-200 font-medium'
                                            : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200'
                                }`}
                            >
                                {st.label}
                            </span>
                        </button>
                        {!isLast && (
                            <div
                                className={`flex-1 h-[1px] mx-2.5 min-w-[12px] ${
                                    isPassed ? 'bg-[#FF4A1F]' : 'bg-slate-200 dark:bg-slate-800'
                                }`}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
};
