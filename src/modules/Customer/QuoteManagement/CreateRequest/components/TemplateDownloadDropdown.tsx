import React, { useRef, useEffect } from 'react';
import { Download, ChevronDown, FileSpreadsheet, FileCheck, Eye } from 'lucide-react';
import Button from '@/components/ui/button';
import { 
    downloadBlankCSVTemplate,
    downloadSampleCSVWithValues,
    downloadBlankPDFTemplate,
    downloadSamplePDFWithValues 
} from '../utils/templateHelpers';

interface TemplateDownloadDropdownProps {
    isOpen: boolean;
    setIsOpen: (val: boolean) => void;
    onCloseOther: () => void;
}

export const TemplateDownloadDropdown: React.FC<TemplateDownloadDropdownProps> = ({
    isOpen,
    setIsOpen,
    onCloseOther,
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
                className="h-9 px-3 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-[#1e2329] border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1.5 cursor-pointer shadow-2xs rounded-[3px]"
                onClick={() => {
                    setIsOpen(!isOpen);
                    onCloseOther();
                }}
            >
                <Download size={14} className="text-slate-500 dark:text-slate-400" />
                <span>Download Template</span>
                <ChevronDown size={13} className="text-slate-400 dark:text-slate-500 ml-0.5" />
            </Button>

            {isOpen && (
                <div className="absolute right-0 mt-1 w-56 bg-white dark:bg-[#1e2329] rounded-[3px] shadow-lg border border-slate-200 dark:border-slate-700 py-1 z-50 animate-in fade-in zoom-in-95 duration-100 font-sans">
                    <div className="px-2.5 pt-1 pb-0.5 text-[10.5px] font-semibold text-slate-500 dark:text-slate-400">
                        Blank Templates (Data Entry)
                    </div>
                    
                    <button 
                        type="button"
                        className="w-full text-left px-2.5 py-1.5 text-xs hover:bg-emerald-50/60 dark:hover:bg-emerald-950/30 flex items-center gap-2 cursor-pointer transition-colors group"
                        onClick={() => { setIsOpen(false); downloadBlankCSVTemplate(); }}
                    >
                        <div className="w-6 h-6 rounded-[3px] bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                            <FileSpreadsheet size={13} />
                        </div>
                        <div>
                            <div className="font-semibold text-xs text-slate-900 dark:text-slate-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-300">
                                Blank CSV Template
                            </div>
                            <div className="text-[10px] text-slate-400 dark:text-slate-500 leading-tight">
                                Empty headers, ready to fill
                            </div>
                        </div>
                    </button>

                    <button 
                        type="button"
                        className="w-full text-left px-2.5 py-1.5 text-xs hover:bg-blue-50/60 dark:hover:bg-blue-950/30 flex items-center gap-2 cursor-pointer transition-colors group"
                        onClick={() => { setIsOpen(false); downloadBlankPDFTemplate(); }}
                    >
                        <div className="w-6 h-6 rounded-[3px] bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                            <FileCheck size={13} />
                        </div>
                        <div>
                            <div className="font-semibold text-xs text-slate-900 dark:text-slate-100 group-hover:text-blue-700 dark:group-hover:text-blue-300">
                                Blank PDF Form Sheet
                            </div>
                            <div className="text-[10px] text-slate-400 dark:text-slate-500 leading-tight">
                                Printable blank request form
                            </div>
                        </div>
                    </button>

                    <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

                    <div className="px-2.5 pt-0.5 pb-0.5 text-[10.5px] font-semibold text-slate-500 dark:text-slate-400">
                        Sample & Guides (With Values)
                    </div>

                    <button 
                        type="button"
                        className="w-full text-left px-2.5 py-1.5 text-xs hover:bg-amber-50/60 dark:hover:bg-amber-950/30 flex items-center gap-2 cursor-pointer transition-colors group"
                        onClick={() => { setIsOpen(false); downloadSampleCSVWithValues(); }}
                    >
                        <div className="w-6 h-6 rounded-[3px] bg-amber-100 dark:bg-amber-900/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                            <FileSpreadsheet size={13} />
                        </div>
                        <div>
                            <div className="font-semibold text-xs text-slate-900 dark:text-slate-100 group-hover:text-amber-700 dark:group-hover:text-amber-300">
                                Sample CSV (Values)
                            </div>
                            <div className="text-[10px] text-slate-400 dark:text-slate-500 leading-tight">
                                Demo rows with exact formats
                            </div>
                        </div>
                    </button>

                    <button 
                        type="button"
                        className="w-full text-left px-2.5 py-1.5 text-xs hover:bg-red-50/60 dark:hover:bg-red-950/30 flex items-center gap-2 cursor-pointer transition-colors group"
                        onClick={() => { setIsOpen(false); downloadSamplePDFWithValues(); }}
                    >
                        <div className="w-6 h-6 rounded-[3px] bg-red-100 dark:bg-red-900/60 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
                            <Eye size={13} />
                        </div>
                        <div>
                            <div className="font-semibold text-xs text-slate-900 dark:text-slate-100 group-hover:text-red-700 dark:group-hover:text-red-300">
                                Sample PDF (Values)
                            </div>
                            <div className="text-[10px] text-slate-400 dark:text-slate-500 leading-tight">
                                Full layout preview with data
                            </div>
                        </div>
                    </button>
                </div>
            )}
        </div>
    );
};
