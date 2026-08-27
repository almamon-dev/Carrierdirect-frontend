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
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6d7175] dark:text-slate-400" size={14} />
            <input 
                type="text" 
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder} 
                className="w-full h-[32px] pl-9 pr-3 border border-slate-200/80 dark:border-slate-700/60 rounded-md text-[12px] font-medium bg-slate-50/50 dark:bg-[#1e2329] text-slate-900 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-[#ff4a1f] dark:focus:border-[#ff4a1f] focus:ring-0 transition-colors shadow-none"
            />
        </div>
    );
}
