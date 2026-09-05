import React from 'react';
import { Eye, FileCheck, FileSpreadsheet } from 'lucide-react';
import {
    downloadBlankCSVTemplate,
    downloadBlankPDFTemplate,
    downloadSampleCSVWithValues,
    downloadSamplePDFWithValues
} from '../../templates';

interface Step1GuideColumnProps {
    isCsvMode: boolean;
    onOpenAllowedValuesGuide: () => void;
}

const WIZARD_GUIDE_STEPS = [
    { num: 1, text: 'Download the standard blank template or check the sample with values' },
    { num: 2, text: 'Fill in pickup, delivery, cargo & pricing details' },
    { num: 3, text: 'Drop your file on the right to import requests' },
];

export const Step1GuideColumn: React.FC<Step1GuideColumnProps> = ({
    isCsvMode,
    onOpenAllowedValuesGuide,
}) => {
    return (
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

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80">
                <div className="flex flex-wrap items-center gap-x-3.5 gap-y-2 text-[13px]">
                    <button
                        type="button"
                        onClick={isCsvMode ? downloadBlankCSVTemplate : downloadBlankPDFTemplate}
                        className="font-semibold text-slate-800 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline inline-flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                        {isCsvMode ? (
                            <FileSpreadsheet size={15} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                        ) : (
                            <FileCheck size={15} className="text-blue-600 dark:text-blue-400 shrink-0" />
                        )}
                        <span>{isCsvMode ? 'Download Blank CSV' : 'Download Blank PDF'}</span>
                        <span className="text-xs text-slate-400">↓</span>
                    </button>

                    <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">•</span>

                    <button
                        type="button"
                        onClick={isCsvMode ? downloadSampleCSVWithValues : downloadSamplePDFWithValues}
                        className="font-semibold text-amber-700 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 hover:underline inline-flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                        <Eye size={15} className="text-amber-600 dark:text-amber-400 shrink-0" />
                        <span>Sample (With Values)</span>
                        <span className="text-xs">↗</span>
                    </button>

                    <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">•</span>

                    <button
                        type="button"
                        onClick={onOpenAllowedValuesGuide}
                        className="font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:underline inline-flex items-center gap-1 cursor-pointer transition-colors"
                    >
                        <span>Values guide</span>
                        <span className="text-xs">↗</span>
                    </button>
                </div>
            </div>
        </div>
    );
};
