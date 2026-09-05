import React, { useRef, useEffect } from 'react';
import { Upload, ChevronDown, FileSpreadsheet, Sparkles } from 'lucide-react';
import Button from '@/components/ui/button';

interface BulkUploadDropdownProps {
    isOpen: boolean;
    setIsOpen: (val: boolean) => void;
    onCloseOther: () => void;
    onUploadCsv: () => void;
    onUploadPdfZip: () => void;
}

export const BulkUploadDropdown: React.FC<BulkUploadDropdownProps> = ({
    isOpen,
    setIsOpen,
    onCloseOther,
    onUploadCsv,
    onUploadPdfZip,
}) => {
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [setIsOpen]);

    return (
        <div className="relative" ref={dropdownRef}>
            <Button 
                variant="outline" 
                size="sm" 
                className="h-9 px-3 text-xs font-bold border-purple-300 dark:border-purple-800/80 text-purple-900 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 dark:hover:bg-purple-900/60 flex items-center gap-1.5 shadow-2xs cursor-pointer rounded-[3px]"
                onClick={() => {
                    setIsOpen(!isOpen);
                    onCloseOther();
                }}
            >
                <Upload size={14} className="text-purple-600 dark:text-purple-400" />
                <span>Bulk Upload</span>
                <ChevronDown size={13} className="text-purple-500 dark:text-purple-400 ml-0.5" />
            </Button>

            {isOpen && (
                <div className="absolute right-0 mt-1 w-56 bg-white dark:bg-[#1e2329] rounded-[3px] shadow-lg border border-slate-200 dark:border-slate-700 py-1 z-50 animate-in fade-in zoom-in-95 duration-100 font-sans">
                    <div className="px-2.5 py-1 text-[10.5px] font-medium text-slate-500 dark:text-slate-400">
                        Select bulk upload option
                    </div>

                    <button 
                        type="button"
                        className="w-full text-left px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-200 hover:bg-emerald-50/80 dark:hover:bg-emerald-950/40 flex items-center gap-2 cursor-pointer transition-colors group"
                        onClick={() => {
                            setIsOpen(false);
                            onUploadCsv();
                        }}
                    >
                        <div className="w-6 h-6 rounded-[3px] bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                            <FileSpreadsheet size={13} />
                        </div>
                        <div>
                            <div className="font-semibold text-xs text-slate-900 dark:text-slate-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-300">Upload CSV</div>
                            <div className="text-[10px] text-slate-400 dark:text-slate-500 leading-tight">Batch requests via .csv</div>
                        </div>
                    </button>

                    <button 
                        type="button"
                        className="w-full text-left px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-200 hover:bg-purple-50/80 dark:hover:bg-purple-950/40 flex items-center gap-2 border-t border-slate-100 dark:border-slate-800 cursor-pointer transition-colors group"
                        onClick={() => {
                            setIsOpen(false);
                            onUploadPdfZip();
                        }}
                    >
                        <div className="w-6 h-6 rounded-[3px] bg-purple-100 dark:bg-purple-900/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                            <Sparkles size={13} />
                        </div>
                        <div>
                            <div className="font-semibold text-xs text-slate-900 dark:text-slate-100 group-hover:text-purple-700 dark:group-hover:text-purple-300">Upload PDF / ZIP</div>
                            <div className="text-[10px] text-slate-400 dark:text-slate-500 leading-tight">AI PDF parser & optional ZIP</div>
                        </div>
                    </button>
                </div>
            )}
        </div>
    );
};
