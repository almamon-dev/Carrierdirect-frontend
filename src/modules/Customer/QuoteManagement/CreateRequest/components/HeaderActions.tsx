/**
 * Customer Quote Request Header Actions Component
 * Renders toolbar actions: Template dropdown, Refresh, CSV Upload, AI Wizard trigger, and Create New Request.
 */

import React, { useState } from 'react';
import { 
    Plus, Download, ChevronDown, FileSpreadsheet, FileText, Sparkles, RefreshCw 
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

    return (
        <div className="flex flex-wrap items-center gap-2">
            {/* Template Download Dropdown */}
            <div className="relative">
                <Button 
                    variant="outline" 
                    size="sm"
                    className="h-9 px-3 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-[#1e2329] border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1.5 cursor-pointer"
                    onClick={(e) => {
                        e.stopPropagation();
                        setShowTemplateDropdown(!showTemplateDropdown);
                    }}
                >
                    <Download size={14} className="text-slate-500 dark:text-slate-400" />
                    <span>Download Template</span>
                    <ChevronDown size={13} className="text-slate-400 dark:text-slate-500 ml-0.5" />
                </Button>

                {showTemplateDropdown && (
                    <div className="absolute right-0 mt-1 w-52 bg-white dark:bg-[#1e2329] rounded-md shadow-lg border border-slate-200 dark:border-slate-700 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                        <div className="px-3 py-1 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                            Select Format
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
                                <div className="text-[11px] text-slate-500 dark:text-slate-400">Formatted spreadsheet table</div>
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

            {/* Upload CSV */}
            <Button 
                variant="outline" 
                size="sm" 
                className="h-9 px-3 text-xs font-semibold border-emerald-300 dark:border-emerald-800/80 text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 flex items-center gap-1.5 shadow-2xs cursor-pointer"
                onClick={onUploadCsv}
            >
                <FileSpreadsheet size={14} className="text-emerald-600 dark:text-emerald-400" />
                <span>Upload CSV</span>
            </Button>

            {/* Upload PDF/ZIP Bundle */}
            <Button 
                variant="outline" 
                size="sm" 
                className="h-9 px-3 text-xs font-bold border-purple-300 dark:border-purple-800/80 text-purple-900 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 dark:hover:bg-purple-900/60 flex items-center gap-1.5 shadow-2xs cursor-pointer"
                onClick={onUploadPdfZip}
            >
                <Sparkles size={14} className="text-purple-600 dark:text-purple-400 animate-pulse" />
                <span>Upload PDF / ZIP Bundle</span>
            </Button>

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
