import React from 'react';
import { Search } from 'lucide-react';

export interface TableSearchProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

export default function TableSearch({ 
    value, 
    onChange, 
    placeholder = "Search...", 
    className = "" 
}: TableSearchProps) {
    return (
        <div className={`relative w-[320px] ${className}`}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6d7175]" size={14} />
            <input 
                type="text" 
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder} 
                className="w-full h-[32px] pl-9 pr-3 border border-[#d1d1d1] rounded-[3px] text-[12px] font-medium placeholder:text-[#6d7175] focus:outline-none focus:border-[#008060] focus:ring-1 focus:ring-[#008060] transition-colors shadow-none"
            />
        </div>
    );
}
