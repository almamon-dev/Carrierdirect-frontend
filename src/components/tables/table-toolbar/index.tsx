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
                <div className="absolute inset-0 bg-blue-50/80 backdrop-blur-sm z-20 flex items-center justify-center px-3 border-b border-blue-100 animate-in fade-in duration-200">
                    <div className="flex items-center gap-1.5 text-[13px]">
                        <span className="text-blue-800">All <strong>{selectedCount}</strong> items on this page are selected.</span>
                        {totalCount > selectedCount && onSelectAll && (
                            <button 
                                onClick={onSelectAll}
                                className="text-blue-600 font-bold hover:text-blue-800 underline decoration-blue-300 hover:decoration-blue-600 underline-offset-2 transition-colors ml-1"
                            >
                                Select all {totalCount} items
                            </button>
                        )}
                    </div>
                    <div className="absolute right-3 flex items-center gap-2">
                        {onDeleteSelected && (
                            <button 
                                onClick={onDeleteSelected}
                                className="h-[28px] px-3 bg-white border border-[#d1d1d1] text-[#d82c0d] rounded-[3px] text-[12px] font-bold hover:bg-[#fff5f5] hover:border-[#d82c0d] transition-all flex items-center gap-1.5 shadow-sm cursor-pointer outline-none"
                            >
                                <Trash2 size={13} />
                                Delete
                            </button>
                        )}
                        {onClearSelection && (
                            <button 
                                onClick={onClearSelection} 
                                className="h-[28px] w-[28px] flex items-center justify-center bg-white border border-[#d1d1d1] text-[#6d7175] rounded-[3px] hover:bg-[#f6f6f7] transition-all cursor-pointer outline-none shadow-sm" 
                                title="Clear selection"
                            >
                                <X size={14} />
                            </button>
                        )}
                    </div>
                </div>
            )}

            <div className={`p-3 border-b border-[#ebebeb] flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-opacity ${selectedCount > 0 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                {children}
            </div>
        </div>
    );
}
