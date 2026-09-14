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
        <div className={`flex flex-col items-center justify-center py-8 sm:py-12 px-3 sm:px-4 text-center w-full max-w-full font-sans ${className}`}>
            <div className="w-12 h-12 sm:w-15 sm:h-15 bg-gradient-to-b from-orange-50 to-amber-50 dark:from-slate-800 dark:to-slate-900 rounded-full flex items-center justify-center mb-3 sm:mb-4 border border-orange-100 dark:border-slate-700 shadow-2xs transition-transform hover:scale-105 shrink-0">
                <Icon className="text-[#FF4A1F]" size={22} strokeWidth={1.75} />
            </div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 mb-1 tracking-tight px-2">{title}</h3>
            <p className="text-xs sm:text-[13px] text-slate-500 dark:text-slate-400 max-w-[300px] sm:max-w-[380px] mx-auto leading-relaxed mb-4 sm:mb-5 font-normal px-2">
                {description}
            </p>
            {actionLabel && onAction && (
                <button
                    type="button"
                    onClick={onAction}
                    className="h-8 sm:h-9 px-3.5 sm:px-4 bg-[#FF4A1F] text-white rounded-[3px] text-xs sm:text-[13px] font-semibold hover:bg-[#e03e15] transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer active:scale-95"
                >
                    <Plus size={14} />
                    <span>{actionLabel}</span>
                </button>
            )}
        </div>
    );
}
