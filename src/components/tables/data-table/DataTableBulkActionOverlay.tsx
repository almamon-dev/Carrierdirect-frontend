import React from 'react';
import { Trash2, X } from 'lucide-react';

interface DataTableBulkActionOverlayProps {
  selectedCount: number;
  totalItems: number;
  onSelectAll: () => void;
  onDeleteSelected?: () => void;
  onClearSelection: () => void;
}

export const DataTableBulkActionOverlay: React.FC<DataTableBulkActionOverlayProps> = ({
  selectedCount,
  totalItems,
  onSelectAll,
  onDeleteSelected,
  onClearSelection,
}) => {
  if (selectedCount <= 0) return null;

  return (
    <div className="absolute inset-0 bg-slate-100/95 dark:bg-[#1e2329]/95 backdrop-blur-xs z-20 flex items-center justify-between px-4 animate-in fade-in duration-200">
      <div className="flex items-center gap-1.5 text-[13px]">
        <span className="text-slate-800 dark:text-slate-200">
          <strong>{selectedCount}</strong> {selectedCount === 1 ? 'item' : 'items'} selected.
        </span>
        {totalItems > selectedCount && (
          <button
            onClick={onSelectAll}
            className="text-[#FF4A1F] font-bold hover:text-[#E03E15] underline decoration-[#FF4A1F]/40 hover:decoration-[#FF4A1F] underline-offset-2 transition-colors ml-1 cursor-pointer"
          >
            Select all {totalItems} items
          </button>
        )}
      </div>
      <div className="flex items-center gap-2">
        {onDeleteSelected && (
          <button
            onClick={onDeleteSelected}
            className="h-[28px] px-3 bg-white dark:bg-[#12161c] border border-red-200 dark:border-red-900/60 text-red-600 dark:text-red-400 rounded-md text-[12px] font-bold hover:bg-red-50 dark:hover:bg-red-950/40 transition-all flex items-center gap-1.5 shadow-none cursor-pointer outline-none"
          >
            <Trash2 size={13} />
            Delete
          </button>
        )}
        <button
          onClick={onClearSelection}
          className="h-7 w-7 flex items-center justify-center bg-white dark:bg-[#12161c] border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-100 transition-all cursor-pointer outline-none shadow-none group"
          title="Clear selection"
        >
          <X size={14} className="group-hover:scale-110 transition-transform" />
        </button>
      </div>
    </div>
  );
};
