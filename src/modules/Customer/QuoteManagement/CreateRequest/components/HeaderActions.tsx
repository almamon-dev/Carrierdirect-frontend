/**
 * Customer Quote Request Header Actions Component
 * Renders toolbar actions: Template dropdown, Refresh, Bulk Upload dropdown, and Create New Request.
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
    Plus, Download, ChevronDown, FileSpreadsheet, FileText, Sparkles, RefreshCw, Upload
} from 'lucide-react';
import Button from '@/components/ui/button';
import { downloadCSVTemplate, downloadPDFTemplate } from '../utils/templateHelpers';

interface HeaderActionsProps {
    isLoading: boolean;
    onRefresh: () => void;
    onUploadCsv: () => void;
    onUploadPdfZip: () => void;
    onCreateNew: () => void;
}

export const HeaderActions: React.FC<HeaderActionsProps> = ({
    isLoading,
    onRefresh,
    onUploadCsv,
    onUploadPdfZip,
    onCreateNew,
}) => {
    const [showTemplateDropdown, setShowTemplateDropdown] = useState(false);
    const [showBulkDropdown, setShowBulkDropdown] = useState(false);

    const templateDropdownRef = useRef<HTMLDivElement>(null);
    const bulkDropdownRef = useRef<HTMLDivElement>(null);

    // Handle outside clicks to close dropdowns
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (templateDropdownRef.current && !templateDropdownRef.current.contains(e.target as Node)) {
                setShowTemplateDropdown(false);
            }
            if (bulkDropdownRef.current && !bulkDropdownRef.current.contains(e.target as Node)) {
                setShowBulkDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="flex flex-wrap items-center gap-2">
            {/* Template Download Dropdown */}
            <div className="relative" ref={templateDropdownRef}>
                <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-9 px-3 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-[#1e2329] border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1.5 cursor-pointer"
                    onClick={() => {
                        setShowTemplateDropdown(!showTemplateDropdown);
                        setShowBulkDropdown(false);
                    }}
                >
                    <Download size={14} className="text-slate-500 dark:text-slate-400" />
                    <span>Download Template</span>
                    <ChevronDown size={13} className="text-slate-400 dark:text-slate-500 ml-0.5" />
                </Button>

                {showTemplateDropdown && (
                    <div className="absolute right-0 mt-1 w-56 bg-white dark:bg-[#1e2329] rounded-md shadow-xl border border-slate-200 dark:border-slate-700 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                        <div className="px-3 py-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
                            Select format
                        </div>
                        <button 
                            type="button"
                            className="w-full text-left px-3 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2.5 font-medium cursor-pointer"
                            onClick={() => {
                                setShowTemplateDropdown(false);
                                downloadCSVTemplate();
                            }}
                        >
                            <FileSpreadsheet size={15} className="text-emerald-600 dark:text-emerald-400" />
                            <div>
                                <div className="font-bold text-slate-900 dark:text-slate-100">CSV Template</div>
                                <div className="text-[11px] text-slate-500 dark:text-slate-400">Standard formatted spreadsheet template</div>
                            </div>
                        </button>
                        <button 
                            type="button"
                            className="w-full text-left px-3 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2.5 font-medium border-t border-slate-100 dark:border-slate-800 cursor-pointer"
                            onClick={() => {
                                setShowTemplateDropdown(false);
                                downloadPDFTemplate();
                            }}
                        >
                            <FileText size={15} className="text-red-500 dark:text-red-400" />
                            <div>
                                <div className="font-bold text-slate-900 dark:text-slate-100">PDF Template</div>
                                <div className="text-[11px] text-slate-500 dark:text-slate-400">Standard PDF request form</div>
                            </div>
                        </button>
                    </div>
                )}
            </div>

            {/* In-App Live Refresh Button */}
            <Button 
                variant="outline" 
                size="sm" 
                className="h-9 px-3 text-xs font-semibold border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1e2329] hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1.5 cursor-pointer"
                onClick={onRefresh}
                disabled={isLoading}
            >
                <RefreshCw size={13} className={isLoading ? "animate-spin text-[#ff4a1f]" : "text-slate-500"} />
                <span>{isLoading ? "Refreshing..." : "Refresh"}</span>
            </Button>

            {/* Bulk Upload Dropdown Button */}
            <div className="relative" ref={bulkDropdownRef}>
                <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-9 px-3 text-xs font-bold border-purple-300 dark:border-purple-800/80 text-purple-900 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 dark:hover:bg-purple-900/60 flex items-center gap-1.5 shadow-2xs cursor-pointer"
                    onClick={() => {
                        setShowBulkDropdown(!showBulkDropdown);
                        setShowTemplateDropdown(false);
                    }}
                >
                    <Upload size={14} className="text-purple-600 dark:text-purple-400" />
                    <span>Bulk Upload</span>
                    <ChevronDown size={13} className="text-purple-500 dark:text-purple-400 ml-0.5" />
                </Button>

                {showBulkDropdown && (
                    <div className="absolute right-0 mt-1 w-64 bg-white dark:bg-[#1e2329] rounded-md shadow-xl border border-slate-200 dark:border-slate-700 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                        <div className="px-3 py-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
                            Select bulk upload option
                        </div>

                        <button 
                            type="button"
                            className="w-full text-left px-3 py-2.5 text-xs text-slate-700 dark:text-slate-200 hover:bg-emerald-50/80 dark:hover:bg-emerald-950/40 flex items-center gap-2.5 font-medium cursor-pointer transition-colors"
                            onClick={() => {
                                setShowBulkDropdown(false);
                                onUploadCsv();
                            }}
                        >
                            <div className="w-8 h-8 rounded-md bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                                <FileSpreadsheet size={16} />
                            </div>
                            <div>
                                <div className="font-bold text-slate-900 dark:text-slate-100">Upload CSV</div>
                                <div className="text-[11px] text-slate-500 dark:text-slate-400">Import batch requests via .csv</div>
                            </div>
                        </button>

                        <button 
                            type="button"
                            className="w-full text-left px-3 py-2.5 text-xs text-slate-700 dark:text-slate-200 hover:bg-purple-50/80 dark:hover:bg-purple-950/40 flex items-center gap-2.5 font-medium border-t border-slate-100 dark:border-slate-800 cursor-pointer transition-colors"
                            onClick={() => {
                                setShowBulkDropdown(false);
                                onUploadPdfZip();
                            }}
                        >
                            <div className="w-8 h-8 rounded-md bg-purple-100 dark:bg-purple-900/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                                <Sparkles size={16} />
                            </div>
                            <div>
                                <div className="font-bold text-slate-900 dark:text-slate-100">Upload PDF / ZIP Bundle</div>
                                <div className="text-[11px] text-slate-500 dark:text-slate-400">AI PDF parser & optional ZIP</div>
                            </div>
                        </button>
                    </div>
                )}
            </div>

            {/* Create New Request */}
            <Button 
                variant="primary" 
                size="sm" 
                className="h-9 px-3.5 bg-[#ff4a1f] hover:bg-[#e03e15] text-white font-bold text-xs shadow-sm flex items-center gap-1.5 cursor-pointer"
                onClick={onCreateNew}
            >
                <Plus size={15} />
                <span>Create New Request</span>
            </Button>
        </div>
    );
};
