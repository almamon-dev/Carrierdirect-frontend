import React from 'react';
import { Eye, Edit, Trash2 } from 'lucide-react';

export interface TableActionsProps<T = any> {
    item: T;
    onView?: (item: T) => void;
    onEdit?: (item: T) => void;
    onDelete?: (item: T) => void;
    className?: string;
}

export default function TableActions<T = any>({ 
    item, 
    onView, 
    onEdit, 
    onDelete, 
    className = "" 
}: TableActionsProps<T>) {
    return (
        <div className={`flex items-center justify-end gap-1.5 ${className}`}>
            {onView && (
                <button 
                    onClick={() => onView(item)}
                    className="w-[26px] h-[26px] flex items-center justify-center rounded-[3px] bg-[#008060] text-white hover:bg-[#006e52] transition-colors shadow-sm outline-none" 
                    title="View details"
                >
                    <Eye size={14} strokeWidth={2.5} />
                </button>
            )}
            
            {onEdit && (
                <button 
                    onClick={() => onEdit(item)}
                    className="w-[26px] h-[26px] flex items-center justify-center rounded-[3px] bg-[#2962ff] text-white hover:bg-[#1e4bd8] transition-colors shadow-sm outline-none" 
                    title="Edit record"
                >
                    <Edit size={14} strokeWidth={2.5} />
                </button>
            )}
            
            {onDelete && (
                <button 
                    onClick={() => onDelete(item)}
                    className="w-[26px] h-[26px] flex items-center justify-center rounded-[3px] bg-[#ff4d4f] text-white hover:bg-[#d9363e] transition-colors shadow-sm outline-none" 
                    title="Delete record"
                >
                    <Trash2 size={14} strokeWidth={2.5} />
                </button>
            )}
        </div>
    );
}
