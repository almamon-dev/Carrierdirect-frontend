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
                className={`h-[32px] w-[32px] flex items-center justify-center rounded-md border transition-all outline-none shadow-2xs cursor-pointer ${
                    isOpen 
                        ? 'bg-orange-50 border-orange-300 ring-1 ring-orange-300 text-[#FF4A1F]' 
                        : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-50 hover:border-slate-400 hover:text-slate-800'
                }`}
                title="Manage Visible Columns"
            >
                <Settings2 size={14} className={isOpen ? 'text-[#FF4A1F]' : 'text-slate-500'} />
            </button>
            
            {isOpen && (
                <div className="absolute right-0 mt-1.5 w-[240px] bg-white border border-slate-200 rounded-md shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                    <div className="p-3">
                        <div className="flex items-center justify-between mb-2 px-1 border-b border-slate-100 pb-1.5">
                            <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Visible Columns</h3>
                            <span className="text-[10px] font-semibold text-slate-400">{visibleColumns.length}/{columns.length}</span>
                        </div>

                        <div className="space-y-0.5 max-h-[280px] overflow-y-auto custom-scrollbar">
                            {columns.map(col => {
                                const isVisible = visibleColumns.includes(col.id);
                                return (
                                    <div 
                                        key={col.id} 
                                        onClick={() => onToggleColumn(col.id)} 
                                        className={`flex items-center justify-between p-2 rounded-md group cursor-pointer transition-colors ${
                                            isVisible ? 'hover:bg-orange-50/60' : 'hover:bg-slate-50 opacity-60'
                                        }`}
                                    >
                                        <span className={`text-[12px] truncate ${isVisible ? 'text-slate-800 font-bold' : 'text-slate-400 font-medium'}`}>
                                            {col.label}
                                        </span>
                                        <div className="flex items-center gap-2 shrink-0 ml-2">
                                            {isVisible ? (
                                                <Eye size={14} className="text-[#FF4A1F]" />
                                            ) : (
                                                <EyeOff size={14} className="text-slate-400" />
                                            )}
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
