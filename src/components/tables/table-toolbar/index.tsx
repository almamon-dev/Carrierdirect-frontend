import React, { ReactNode } from 'react';
import { Trash2, X } from 'lucide-react';

export interface TableToolbarProps {
    selectedCount?: number;
    totalCount?: number;
    onClearSelection?: () => void;
    onDeleteSelected?: () => void;
    onSelectAll?: () => void;
    children?: ReactNode;
    className?: string;
}

export default function TableToolbar({ 
    selectedCount = 0,
    totalCount = 0,
    onClearSelection,
    onDeleteSelected,
    onSelectAll,
    children,
    className = "" 
}: TableToolbarProps) {
    return (
        <div className={`relative z-30 ${className}`}>
            {/* Bulk Action Bar Overlay */}
            {selectedCount > 0 && (
                <div className="absolute inset-0 bg-slate-100/95 dark:bg-[#1e2329]/95 backdrop-blur-xs z-20 flex items-center justify-center px-4 border-b border-slate-200 dark:border-slate-800 animate-in fade-in duration-200">
                    <div className="flex items-center gap-1.5 text-[13px]">
                        <span className="text-slate-800 dark:text-slate-200">
                            All <strong>{selectedCount}</strong> items on this page are selected.
                        </span>
                        {totalCount > selectedCount && onSelectAll && (
                            <button 
                                onClick={onSelectAll}
                                className="text-[#FF4A1F] font-bold hover:text-[#E03E15] underline decoration-[#FF4A1F]/40 hover:decoration-[#FF4A1F] underline-offset-2 transition-colors ml-1 cursor-pointer"
                            >
                                Select all {totalCount} items
                            </button>
                        )}
                    </div>
                    <div className="absolute right-3 flex items-center gap-2">
                        {onDeleteSelected && (
                            <button 
                                onClick={onDeleteSelected}
                                className="h-[28px] px-3 bg-white dark:bg-[#12161c] border border-slate-300 dark:border-slate-700 text-red-600 dark:text-red-400 rounded-md text-[12px] font-bold hover:bg-red-50 dark:hover:bg-red-950/40 hover:border-red-300 dark:hover:border-red-800 transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer outline-none"
                            >
                                <Trash2 size={13} />
                                Delete
                            </button>
                        )}
                        {onClearSelection && (
                            <button 
                                onClick={onClearSelection} 
                                className="h-7 w-7 flex items-center justify-center bg-white dark:bg-[#12161c] border border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400 rounded-full hover:bg-slate-200/80 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-100 transition-all cursor-pointer outline-none shadow-2xs group" 
                                title="Clear selection"
                            >
                                <X size={14} className="group-hover:scale-110 transition-transform" />
                            </button>
                        )}
                    </div>
                </div>
            )}

            <div className={`p-3 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-opacity ${selectedCount > 0 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                {children}
            </div>
        </div>
    );
}
