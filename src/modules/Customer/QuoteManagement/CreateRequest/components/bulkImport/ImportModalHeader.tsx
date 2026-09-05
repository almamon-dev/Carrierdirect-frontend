import React from 'react';
import { X } from 'lucide-react';

interface ImportModalHeaderProps {
    isCsvMode: boolean;
    processingStep: 1 | 2 | 3 | 4 | 5;
    setImportType?: (type: 'csv' | 'pdf') => void;
    onClose?: () => void;
}

export const ImportModalHeader: React.FC<ImportModalHeaderProps> = ({
    isCsvMode,
    processingStep,
    setImportType,
    onClose,
}) => {
    return (
        <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between bg-white dark:bg-slate-900 font-sans">
            <div className="flex items-center gap-2">
                <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100 tracking-tight">
                    {isCsvMode ? 'Spreadsheet Import' : 'Document Import'}
                </h3>
                <span className="text-[10.5px] font-mono text-slate-400 dark:text-slate-500">
                    {isCsvMode ? 'CSV · XLSX' : 'PDF · Images'}
                </span>
            </div>

            <div className="flex items-center gap-2.5">
                {processingStep <= 2 && setImportType && (
                    <div className="flex items-center bg-slate-100/80 dark:bg-slate-800/80 p-0.5 rounded-md text-[11px] font-medium border border-slate-200/60 dark:border-slate-700/60">
                        <button
                            type="button"
                            onClick={() => setImportType('csv')}
                            className={`px-2.5 py-0.5 rounded transition-all cursor-pointer ${
                                isCsvMode
                                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-2xs font-semibold'
                                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                            }`}
                        >
                            CSV
                        </button>
                        <button
                            type="button"
                            onClick={() => setImportType('pdf')}
                            className={`px-2.5 py-0.5 rounded transition-all cursor-pointer ${
                                !isCsvMode
                                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-2xs font-semibold'
                                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                            }`}
                        >
                            PDF
                        </button>
                    </div>
                )}

                {onClose && (
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 w-7 h-7 rounded-md flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        aria-label="Close"
                    >
                        <X size={15} />
                    </button>
                )}
            </div>
        </div>
    );
};
