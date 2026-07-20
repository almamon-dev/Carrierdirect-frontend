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
    description = "Try changing your search query or filters to find what you're looking for.", 
    icon: Icon = Search,
    actionLabel,
    onAction,
    className = ""
}: EmptyStateProps) {
    return (
        <div className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}>
            <div className="w-14 h-14 bg-[#f6f6f7] rounded-full flex items-center justify-center mb-4 shadow-[inset_0_1px_3px_rgba(0,0,0,0.05)] border border-[#ebebeb]">
                <Icon className="text-[#8c9196]" size={24} strokeWidth={1.5} />
            </div>
            <h3 className="text-[15px] font-bold text-[#202223] mb-1.5">{title}</h3>
            <p className="text-[13px] text-[#6d7175] max-w-[320px] mx-auto leading-relaxed mb-5">
                {description}
            </p>
            {actionLabel && onAction && (
                <button 
                    onClick={onAction}
                    className="h-[32px] px-4 bg-[#008060] text-white rounded-[3px] text-[12px] font-bold hover:bg-[#006e52] transition-colors shadow-[0_1px_0_rgba(0,0,0,0.05)] flex items-center gap-1.5"
                >
                    <Plus size={14} />
                    {actionLabel}
                </button>
            )}
        </div>
    );
}
