import React from 'react';
import { X } from 'lucide-react';

export interface ChipProps extends React.HTMLAttributes<HTMLDivElement> {
    label: string;
    onRemove?: () => void;
}

export default function Chip({ label, onRemove, className = '', ...props }: ChipProps) {
    return (
        <div 
            className={`inline-flex items-center gap-1.5 h-[24px] px-2.5 bg-[#f6f6f7] border border-[#d1d1d1] rounded-full text-[12px] text-[#202223] font-medium ${className}`}
            {...props}
        >
            <span>{label}</span>
            {onRemove && (
                <button 
                    onClick={(e) => { e.stopPropagation(); onRemove(); }}
                    className="w-[14px] h-[14px] rounded-full flex items-center justify-center hover:bg-[#e4e5e7] text-[#6d7175] transition-colors outline-none"
                >
                    <X size={10} strokeWidth={3} />
                </button>
            )}
        </div>
    );
}
