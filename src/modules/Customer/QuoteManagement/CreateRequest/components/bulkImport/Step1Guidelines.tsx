import React from 'react';
import { FileSpreadsheet, Eye, FileCheck, BookOpen } from 'lucide-react';
import { 
    downloadBlankCSVTemplate, 
    downloadSampleCSVWithValues, 
    downloadBlankPDFTemplate, 
    downloadSamplePDFWithValues 
} from '../../templates';

interface Step1GuidelinesProps {
    isCsvMode: boolean;
    onOpenAllowedValuesGuide: () => void;
}

export const Step1Guidelines: React.FC<Step1GuidelinesProps> = ({
    isCsvMode,
    onOpenAllowedValuesGuide,
}) => {
    return (
        <div className="space-y-4 py-1 font-sans">
            {/* Header Title */}
            <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
                    <BookOpen size={18} className="text-[#ff4a1f]" />
                    <span>{isCsvMode ? 'Spreadsheet Batch Import Guidelines' : 'Logistics Document Import Guidelines'}</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Follow the 3 preparation steps below to get your template and format your shipment requests.
                </p>
            </div>

            {/* 3-Point Connected Step List (Pure Text Links) */}
            <div className="space-y-5 relative pl-1 py-1">
                {/* Point 1: Blank Template */}
                <div className="flex items-start gap-3.5 relative">
                    <div className="absolute left-[13.5px] top-7 bottom-[-22px] w-[1px] bg-slate-200 dark:bg-slate-700" />
                    <div className="w-7 h-7 rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-900 dark:text-slate-100 shrink-0 z-10 shadow-2xs">
                        1
                    </div>
                    <div className="space-y-1 flex-1">
                        <div>
                            <button
                                type="button"
                                onClick={isCsvMode ? downloadBlankCSVTemplate : downloadBlankPDFTemplate}
                                className="text-sm font-semibold text-slate-900 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline inline-flex items-center gap-1.5 cursor-pointer transition-colors text-left"
                            >
                                {isCsvMode ? (
                                    <FileSpreadsheet size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                                ) : (
                                    <FileCheck size={16} className="text-blue-600 dark:text-blue-400 shrink-0" />
                                )}
                                <span>{isCsvMode ? 'Download Blank CSV Template' : 'Download Blank PDF Form Sheet'}</span>
                                <span className="text-slate-400 font-bold text-xs">↓</span>
                            </button>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                            Clean template with all standard column headers. Ready for you to enter or copy-paste single or multiple shipping orders.
                        </p>
                    </div>
                </div>

                {/* Point 2: Sample with Values */}
                <div className="flex items-start gap-3.5 relative">
                    <div className="absolute left-[13.5px] top-7 bottom-[-22px] w-[1px] bg-slate-200 dark:bg-slate-700" />
                    <div className="w-7 h-7 rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-900 dark:text-slate-100 shrink-0 z-10 shadow-2xs">
                        2
                    </div>
                    <div className="space-y-1 flex-1">
                        <div>
                            <button
                                type="button"
                                onClick={isCsvMode ? downloadSampleCSVWithValues : downloadSamplePDFWithValues}
                                className="text-sm font-semibold text-amber-700 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 hover:underline inline-flex items-center gap-1.5 cursor-pointer transition-colors text-left"
                            >
                                <Eye size={16} className="text-amber-600 dark:text-amber-400 shrink-0" />
                                <span>{isCsvMode ? 'Check Sample CSV (With Example Values)' : 'Preview Sample PDF (With Example Values)'}</span>
                                <span className="text-amber-600 dark:text-amber-400 text-xs">↗</span>
                            </button>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                            Demonstration file showing exact formats for pickup/delivery addresses, cargo dimensions, vehicle types, and pricing.
                        </p>
                    </div>
                </div>

                {/* Point 3: Allowed Values Guide */}
                <div className="flex items-start gap-3.5 relative">
                    <div className="w-7 h-7 rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-900 dark:text-slate-100 shrink-0 z-10 shadow-2xs">
                        3
                    </div>
                    <div className="space-y-1 flex-1">
                        <div>
                            <button
                                type="button"
                                onClick={onOpenAllowedValuesGuide}
                                className="text-sm font-semibold text-slate-800 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline inline-flex items-center gap-1.5 cursor-pointer transition-colors text-left"
                            >
                                <BookOpen size={16} className="text-slate-500 dark:text-slate-400 shrink-0" />
                                <span>Allowed Values & Formatting Reference Guide</span>
                                <span className="text-slate-400 text-xs">↗</span>
                            </button>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                            Check valid system dropdown options (Vehicle types, load types, shipment priorities) and date format requirements (<code className="bg-slate-100 dark:bg-slate-700 px-1 py-0.5 rounded text-[10.5px]">YYYY-MM-DD</code>).
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
