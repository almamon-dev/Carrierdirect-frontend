import React, { useState, useRef, useEffect } from 'react';
import { 
    Plus, 
    ChevronDown, 
    FileText, 
    FileSpreadsheet, 
    Sparkles, 
    Download, 
    FileCheck, 
    Eye 
} from 'lucide-react';
import Button from '@/components/ui/button';
import { 
    downloadBlankCSVTemplate, 
    downloadSampleCSVWithValues, 
    downloadBlankPDFTemplate, 
    downloadSamplePDFWithValues 
} from '../utils/templateHelpers';

interface CreateRequestDropdownProps {
    onCreateNew: () => void;
    onUploadCsv?: () => void;
    onUploadPdfZip?: () => void;
    buttonText?: string;
    className?: string;
}

export const CreateRequestDropdown: React.FC<CreateRequestDropdownProps> = ({
    onCreateNew,
    onUploadCsv,
    onUploadPdfZip,
    buttonText = 'Create Request',
    className = '',
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsOpen(false);
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('keydown', handleKeyDown);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen]);

    return (
        <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
            <Button
                variant="primary"
                size="sm"
                className="h-8 sm:h-9 px-3 sm:px-3.5 bg-[#ff4a1f] hover:bg-[#e03e15] text-white font-bold text-xs shadow-2xs flex items-center gap-1.5 cursor-pointer rounded-[4px] shrink-0"
                onClick={() => setIsOpen(!isOpen)}
                aria-haspopup="true"
                aria-expanded={isOpen}
            >
                <Plus size={14} className="shrink-0" />
                <span className="whitespace-nowrap">{buttonText}</span>
                <ChevronDown size={13} className={`transition-transform duration-200 ml-0.5 shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
            </Button>

            {isOpen && (
                <div className="absolute right-0 mt-1.5 w-[310px] sm:w-[330px] bg-white dark:bg-[#1e2329] rounded-[4px] shadow-xl border border-slate-200 dark:border-slate-700 py-1 z-50 animate-in fade-in zoom-in-95 duration-100 font-sans text-left">
                    {/* Option 1: Single Request */}
                    <button
                        type="button"
                        className="w-full text-left px-3.5 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors cursor-pointer group flex items-start gap-3"
                        onClick={() => {
                            setIsOpen(false);
                            onCreateNew();
                        }}
                    >
                        <FileText size={17} strokeWidth={1.8} className="text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-100 shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                            <span className="font-bold text-[13.5px] text-slate-800 dark:text-slate-100 group-hover:text-slate-900 dark:group-hover:text-white block">
                                Single Request
                            </span>
                            <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                                Create a single quote request for carrier bidding.
                            </p>
                        </div>
                    </button>

                    {/* Option 2: Bulk Upload CSV */}
                    {onUploadCsv && (
                        <button
                            type="button"
                            className="w-full text-left px-3.5 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors cursor-pointer group flex items-start gap-3"
                            onClick={() => {
                                setIsOpen(false);
                                onUploadCsv();
                            }}
                        >
                            <FileSpreadsheet size={17} strokeWidth={1.8} className="text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-100 shrink-0 mt-0.5" />
                            <div className="flex-1 min-w-0">
                                <span className="font-bold text-[13.5px] text-slate-800 dark:text-slate-100 group-hover:text-slate-900 dark:group-hover:text-white block">
                                    Bulk CSV Upload
                                </span>
                                <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                                    Upload multiple shipping requests at once via CSV.
                                </p>
                            </div>
                        </button>
                    )}

                    {/* Option 3: AI Document / PDF Upload */}
                    {onUploadPdfZip && (
                        <button
                            type="button"
                            className="w-full text-left px-3.5 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors cursor-pointer group flex items-start gap-3"
                            onClick={() => {
                                setIsOpen(false);
                                onUploadPdfZip();
                            }}
                        >
                            <Sparkles size={17} strokeWidth={1.8} className="text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-100 shrink-0 mt-0.5" />
                            <div className="flex-1 min-w-0">
                                <span className="font-bold text-[13.5px] text-slate-800 dark:text-slate-100 group-hover:text-slate-900 dark:group-hover:text-white block">
                                    AI Document Upload
                                </span>
                                <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                                    Auto-extract shipment parameters from PDF documents.
                                </p>
                            </div>
                        </button>
                    )}

                    {/* Download Templates Section */}
                    <div className="my-1.5 border-t border-slate-100 dark:border-slate-800" />
                    <div className="px-3.5 pt-1 pb-1.5">
                        <div className="flex items-center justify-between text-[11.5px] font-medium text-slate-500 dark:text-slate-400 mb-1.5">
                            <span>Download Templates</span>
                            <Download size={12} className="text-slate-400" />
                        </div>

                        <div className="grid grid-cols-2 gap-1.5">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsOpen(false);
                                    downloadBlankCSVTemplate();
                                }}
                                className="px-2 py-1.5 rounded-[4px] border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 text-slate-700 dark:text-slate-300 text-[11px] font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                            >
                                <FileSpreadsheet size={13} className="text-slate-500 shrink-0" />
                                <span>Blank CSV</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    setIsOpen(false);
                                    downloadSampleCSVWithValues();
                                }}
                                className="px-2 py-1.5 rounded-[4px] border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 text-slate-700 dark:text-slate-300 text-[11px] font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                            >
                                <FileSpreadsheet size={13} className="text-slate-500 shrink-0" />
                                <span>Sample CSV</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    setIsOpen(false);
                                    downloadBlankPDFTemplate();
                                }}
                                className="px-2 py-1.5 rounded-[4px] border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 text-slate-700 dark:text-slate-300 text-[11px] font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                            >
                                <FileCheck size={13} className="text-slate-500 shrink-0" />
                                <span>Blank PDF</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    setIsOpen(false);
                                    downloadSamplePDFWithValues();
                                }}
                                className="px-2 py-1.5 rounded-[4px] border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 text-slate-700 dark:text-slate-300 text-[11px] font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                            >
                                <Eye size={13} className="text-slate-500 shrink-0" />
                                <span>Sample PDF</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreateRequestDropdown;

