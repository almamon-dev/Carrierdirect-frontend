import React from 'react';
import { Search, LucideIcon, Plus } from 'lucide-react';

export interface EmptyStateProps {
    title?: string;
    description?: string;
    icon?: LucideIcon;
    actionLabel?: string;
    onAction?: () => void;
    className?: string;
}

export default function EmptyState({ 
    title = "No records found", 
    description = "There are no entries available right now. Check back later or adjust your search filters.", 
    icon: Icon = Search,
    actionLabel,
    onAction,
    className = ""
}: EmptyStateProps) {
    return (
        <div className={`flex flex-col items-center justify-center py-14 px-4 text-center ${className}`}>
            <div className="w-16 h-16 bg-gradient-to-b from-orange-50 to-amber-50 dark:from-slate-800 dark:to-slate-900 rounded-full flex items-center justify-center mb-4 border border-orange-100 dark:border-slate-700 shadow-sm transition-transform hover:scale-105">
                <Icon className="text-[#FF4A1F]" size={28} strokeWidth={1.75} />
            </div>
            <h3 className="text-[16px] font-bold text-slate-900 dark:text-slate-100 mb-1 tracking-tight">{title}</h3>
            <p className="text-[13px] text-slate-500 dark:text-slate-400 max-w-[360px] mx-auto leading-relaxed mb-5 font-normal">
                {description}
            </p>
            {actionLabel && onAction && (
                <button 
                    type="button"
                    onClick={onAction}
                    className="h-9 px-4 bg-[#FF4A1F] text-white rounded-lg text-[13px] font-semibold hover:bg-[#e03e15] transition-all shadow-sm flex items-center gap-2 cursor-pointer active:scale-95"
                >
                    <Plus size={15} />
                    {actionLabel}
                </button>
            )}
        </div>
    );
}
