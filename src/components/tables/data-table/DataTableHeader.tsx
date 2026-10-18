import React, { useRef, useEffect } from 'react';
import { ChevronsUpDown, ChevronUp, ChevronDown } from 'lucide-react';
import { Column } from './dataTableTypes';

interface DataTableHeaderProps<T = any> {
  showCheckbox: boolean;
  compact: boolean;
  isAllPageSelected: boolean;
  isSomePageSelected?: boolean;
  toggleSelectAll: () => void;
  currentColumns: Column<T>[];
  visibleColumns: string[];
  setOrderedColumnIds: React.Dispatch<React.SetStateAction<string[]>>;
  sortKey: string | null;
  sortDir: 'asc' | 'desc';
  handleSort: (id: string) => void;
  actions?: (item: T) => React.ReactNode;
  actionsColumnClassName?: string;
}

export function DataTableHeader<T = any>({
  showCheckbox,
  compact,
  isAllPageSelected,
  isSomePageSelected = false,
  toggleSelectAll,
  currentColumns,
  visibleColumns,
  setOrderedColumnIds,
  sortKey,
  sortDir,
  handleSort,
  actions,
  actionsColumnClassName,
}: DataTableHeaderProps<T>) {
  const checkboxRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = Boolean(isSomePageSelected);
    }
  }, [isSomePageSelected, isAllPageSelected]);

  return (
    <thead>
      <tr className="bg-slate-50/80 dark:bg-[#151921] border-b border-slate-200/90 dark:border-slate-800 text-[11.5px] font-semibold text-slate-500 dark:text-slate-400 whitespace-nowrap select-none">
        {showCheckbox && (
          <th className={`${compact ? 'px-2 py-2' : 'px-3.5 py-3'} w-[36px]`}>
            <div className="flex items-center justify-center">
              <input
                ref={checkboxRef}
                type="checkbox"
                checked={isAllPageSelected}
                onChange={toggleSelectAll}
                className="table-checkbox cursor-pointer"
                title={isAllPageSelected ? "Deselect all on this page" : "Select all on this page"}
                aria-label="Select all on this page"
              />
            </div>
          </th>
        )}
        {currentColumns.map(col => {
          if (!visibleColumns.includes(col.id)) return null;
          const isCentered = col.className?.includes('text-center') || col.className?.includes('justify-center');
          const isRight = col.className?.includes('text-right') || col.className?.includes('justify-end');

          return (
            <th
              key={col.id}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData('text/plain', col.id);
              }}
              onDragOver={(e) => {
                e.preventDefault();
              }}
              onDrop={(e) => {
                e.preventDefault();
                const draggedId = e.dataTransfer.getData('text/plain');
                if (draggedId && draggedId !== col.id) {
                  const order = currentColumns.map(c => c.id);
                  const fromIndex = order.indexOf(draggedId);
                  const toIndex = order.indexOf(col.id);
                  if (fromIndex !== -1 && toIndex !== -1) {
                    const newOrder = [...order];
                    const [removed] = newOrder.splice(fromIndex, 1);
                    newOrder.splice(toIndex, 0, removed);
                    setOrderedColumnIds(newOrder);
                  }
                }
              }}
              className={`${compact ? 'px-2 py-1.5' : 'px-3.5 py-3'} font-semibold text-slate-600 dark:text-slate-300 text-xs ${col.className || ''} ${col.sortable !== false ? 'cursor-pointer hover:text-slate-900 dark:hover:text-white' : ''}`}
              onClick={() => col.sortable !== false && handleSort(col.id)}
            >
              <div className={`flex items-center gap-1 ${isCentered ? 'justify-center' : isRight ? 'justify-end' : 'justify-start'}`}>
                <span>{col.label}</span>
                {col.sortable !== false && sortKey === col.id ? (
                  sortDir === 'asc' ? <ChevronUp size={12} className="text-[#ff4a1f]" /> : <ChevronDown size={12} className="text-[#ff4a1f]" />
                ) : col.sortable !== false ? (
                  <ChevronsUpDown size={12} className="text-slate-400 opacity-50" />
                ) : null}
              </div>
            </th>
          );
        })}
        {actions && (
          <th className={`${compact ? 'px-2 py-1.5' : 'px-3.5 py-3'} text-right pr-3.5 sm:pr-4 text-xs font-semibold text-slate-600 dark:text-slate-300 ${actionsColumnClassName || 'w-[76px] min-w-[70px]'}`}>
            Actions
          </th>
        )}
      </tr>
    </thead>
  );
}
