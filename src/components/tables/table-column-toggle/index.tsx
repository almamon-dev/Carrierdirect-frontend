import React, { useState, useRef, useEffect } from 'react';
import { Settings2, Eye, EyeOff, GripVertical } from 'lucide-react';

export interface Column {
    id: string;
    label: string;
}

export interface TableColumnToggleProps {
    columns: Column[];
    visibleColumns: string[];
    onToggleColumn: (id: string) => void;
    onReorderColumns?: (newColumnsOrder: string[]) => void;
    className?: string;
}

export default function TableColumnToggle({ 
    columns, 
    visibleColumns, 
    onToggleColumn, 
    onReorderColumns,
    className = "" 
}: TableColumnToggleProps) {
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [draggedId, setDraggedId] = useState<string | null>(null);
    const [dragOverId, setDragOverId] = useState<string | null>(null);
    const draggedIdRef = useRef<string | null>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleDragStart = (e: React.DragEvent, id: string) => {
        setDraggedId(id);
        draggedIdRef.current = id;
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', id);
    };

    const handleDragEnter = (e: React.DragEvent, id: string) => {
        e.preventDefault();
        if (draggedIdRef.current && draggedIdRef.current !== id) {
            setDragOverId(id);
        }
    };

    const handleDragOver = (e: React.DragEvent, id: string) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        if (dragOverId !== id && draggedIdRef.current !== id) {
            setDragOverId(id);
        }
    };

    const handleDrop = (e: React.DragEvent, targetId: string) => {
        e.preventDefault();
        e.stopPropagation();
        const sourceId = draggedIdRef.current || draggedId || e.dataTransfer.getData('text/plain');
        if (!sourceId || sourceId === targetId) {
            setDraggedId(null);
            setDragOverId(null);
            draggedIdRef.current = null;
            return;
        }

        const currentOrder = columns.map(c => c.id);
        const fromIndex = currentOrder.indexOf(sourceId);
        const toIndex = currentOrder.indexOf(targetId);

        if (fromIndex !== -1 && toIndex !== -1) {
            const newOrder = [...currentOrder];
            const [removed] = newOrder.splice(fromIndex, 1);
            newOrder.splice(toIndex, 0, removed);
            if (onReorderColumns) {
                onReorderColumns(newOrder);
            }
        }

        setDraggedId(null);
        setDragOverId(null);
        draggedIdRef.current = null;
    };

    const handleDragEnd = () => {
        setDraggedId(null);
        setDragOverId(null);
        draggedIdRef.current = null;
    };

    return (
        <div className={`relative ${className}`} ref={wrapperRef}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`h-[32px] w-[32px] flex items-center justify-center rounded-[3px] border transition-all outline-none shadow-none cursor-pointer ${
                    isOpen 
                        ? 'bg-orange-50 dark:bg-[#ff4a1f]/15 border-orange-200 dark:border-orange-500/40 text-[#FF4A1F]' 
                        : 'bg-slate-50/50 dark:bg-[#1e2329] border-slate-200/80 dark:border-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-slate-100/60 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-800 dark:hover:text-slate-100'
                }`}
                title="Manage & Reorder Columns"
            >
                <Settings2 size={14} className={isOpen ? 'text-[#FF4A1F]' : 'text-slate-500 dark:text-slate-400'} />
            </button>
            
            {isOpen && (
                <div className="absolute right-0 mt-1.5 w-[240px] bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-700 rounded-[3px] shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                    <div className="p-3">
                        <div className="flex items-center justify-between mb-2 px-1 border-b border-slate-100 dark:border-slate-800 pb-1.5">
                            <div className="flex items-center gap-1.5">
                                <h3 className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Visible Columns</h3>
                            </div>
                            <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">{visibleColumns.length}/{columns.length}</span>
                        </div>

                        <div className="space-y-0.5 max-h-[290px] overflow-y-auto hide-scrollbar">
                            {columns.map((col) => {
                                const isVisible = visibleColumns.includes(col.id);
                                const isBeingDragged = draggedId === col.id;
                                const isOver = dragOverId === col.id && draggedId !== col.id;

                                return (
                                    <div 
                                        key={col.id} 
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, col.id)}
                                        onDragEnter={(e) => handleDragEnter(e, col.id)}
                                        onDragOver={(e) => handleDragOver(e, col.id)}
                                        onDrop={(e) => handleDrop(e, col.id)}
                                        onDragEnd={handleDragEnd}
                                        className={`flex items-center justify-between p-1.5 rounded-[3px] group transition-all select-none cursor-grab active:cursor-grabbing ${
                                            isBeingDragged 
                                                ? 'opacity-30 bg-orange-50/50 dark:bg-slate-800 border border-dashed border-[#ff4a1f]' 
                                                : isOver 
                                                    ? 'border-t-2 border-[#FF4A1F] bg-orange-50/40 dark:bg-[#ff4a1f]/10' 
                                                    : isVisible 
                                                        ? 'hover:bg-slate-100/70 dark:hover:bg-slate-800/70' 
                                                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/40 opacity-55'
                                        }`}
                                    >
                                        <div className="flex items-center gap-1.5 min-w-0 flex-1 pointer-events-none">
                                            <GripVertical size={13} className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 shrink-0 opacity-60 group-hover:opacity-100 transition-opacity" />
                                            <span className={`text-[12px] truncate flex-1 ${isVisible ? 'text-slate-800 dark:text-slate-200 font-semibold' : 'text-slate-400 dark:text-slate-500 font-medium'}`}>
                                                {col.label}
                                            </span>
                                        </div>

                                        {/* Visibility Toggle Button */}
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onToggleColumn(col.id);
                                            }}
                                            className="flex items-center justify-center p-1 rounded hover:bg-slate-200/60 dark:hover:bg-slate-700/60 transition-colors shrink-0 cursor-pointer ml-1.5"
                                            title={isVisible ? 'Hide Column' : 'Show Column'}
                                        >
                                            {isVisible ? (
                                                <Eye size={13} className="text-[#FF4A1F]" />
                                            ) : (
                                                <EyeOff size={13} className="text-slate-400 dark:text-slate-500" />
                                            )}
                                        </button>
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


