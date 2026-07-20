import React, { useState, useRef, useEffect } from 'react';
import { Settings2, Eye, EyeOff } from 'lucide-react';

export interface Column {
    id: string;
    label: string;
}

export interface TableColumnToggleProps {
    columns: Column[];
    visibleColumns: string[];
    onToggleColumn: (id: string) => void;
    className?: string;
}

export default function TableColumnToggle({ 
    columns, 
    visibleColumns, 
    onToggleColumn, 
    className = "" 
}: TableColumnToggleProps) {
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className={`relative ${className}`} ref={wrapperRef}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`h-[32px] w-[32px] flex items-center justify-center rounded-[3px] border transition-all outline-none shadow-sm ${
                    isOpen 
                        ? 'bg-[#f1f1f1] ring-1 ring-[#008060] border-[#008060] text-[#202223]' 
                        : 'bg-white border-[#d1d1d1] text-[#6d7175] hover:bg-[#f6f6f7]'
                }`}
                title="Manage Columns"
            >
                <Settings2 size={14} />
            </button>
            
            {isOpen && (
                <div className="absolute right-0 mt-1 w-[240px] bg-white border border-[#ebebeb] rounded-[4px] shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                    <div className="p-3">
                        <h3 className="text-[11px] font-bold text-[#6d7175] mb-2 px-1 uppercase">Visible Columns</h3>
                        <div className="space-y-0.5 max-h-[300px] overflow-y-auto custom-scrollbar">
                            {columns.map(col => {
                                const isVisible = visibleColumns.includes(col.id);
                                return (
                                    <div 
                                        key={col.id} 
                                        onClick={() => onToggleColumn(col.id)} 
                                        className="flex items-center justify-between p-1.5 hover:bg-[#f6f6f7] rounded-[4px] group cursor-pointer transition-colors"
                                    >
                                        <span className={`text-[12px] truncate ${isVisible ? 'text-[#202223] font-semibold' : 'text-[#bababa]'}`}>
                                            {col.label}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            {isVisible ? <Eye size={14} className="text-[#008060]" /> : <EyeOff size={14} className="text-[#bababa]" />}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
