import React from 'react';
import { Download } from 'lucide-react';

export interface TableExportProps {
    onExport?: () => void;
    className?: string;
}

export default function TableExport({ onExport, className = "" }: TableExportProps) {
    return (
        <button 
            onClick={onExport}
            className={`h-[32px] px-3 bg-white border border-[#d1d1d1] text-[#202223] rounded-[3px] text-[12px] font-bold hover:bg-[#f6f6f7] transition-all flex items-center gap-1.5 shadow-sm outline-none ${className}`}
            title="Export data"
        >
            <Download size={14} />
            Export
        </button>
    );
}
