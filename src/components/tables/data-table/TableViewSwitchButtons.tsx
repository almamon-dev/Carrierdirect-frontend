import React from 'react';
import { List, LayoutGrid } from 'lucide-react';

interface TableViewSwitchButtonsProps {
  viewMode: 'table' | 'grid';
  onSwitchView: (mode: 'table' | 'grid') => void;
  hideViewToggle?: boolean;
}

export const TableViewSwitchButtons: React.FC<TableViewSwitchButtonsProps> = ({
  viewMode,
  onSwitchView,
  hideViewToggle,
}) => {
  if (hideViewToggle) return null;

  const isGrid = viewMode === 'grid';

  return (
    <>
      <div className="flex items-center border border-slate-200/80 dark:border-slate-700/60 rounded-[3px] overflow-hidden bg-slate-50/50 dark:bg-[#1e2329] shadow-none h-[32px]">
        <button
          onClick={() => onSwitchView('table')}
          className={`h-[30px] px-2.5 flex items-center justify-center transition-colors cursor-pointer ${
            !isGrid
              ? 'bg-white dark:bg-slate-800 text-[#202223] dark:text-slate-200 shadow-2xs font-bold'
              : 'text-[#8c9196] dark:text-slate-400 hover:bg-white/60 dark:hover:bg-slate-800/60 hover:text-[#202223] dark:hover:text-slate-200'
          }`}
          title="Table View"
        >
          <List size={14} />
        </button>
        <div className="w-[1px] h-[30px] bg-slate-200/80 dark:bg-slate-700/60" />
        <button
          onClick={() => onSwitchView('grid')}
          className={`h-[30px] px-2.5 flex items-center justify-center transition-colors cursor-pointer ${
            isGrid
              ? 'bg-white dark:bg-slate-800 text-[#202223] dark:text-slate-200 shadow-2xs font-bold'
              : 'text-[#8c9196] dark:text-slate-400 hover:bg-white/60 dark:hover:bg-slate-800/60 hover:text-[#202223] dark:hover:text-slate-200'
          }`}
          title="Grid View"
        >
          <LayoutGrid size={14} />
        </button>
      </div>
      <div className="w-[1px] h-4 bg-slate-200/60 dark:bg-slate-800 mx-0.5 hidden sm:block" />
    </>
  );
};
