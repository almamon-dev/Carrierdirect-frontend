import React from 'react';
import { Column } from './dataTableTypes';

interface DataTableDataBodyProps<T = any> {
  paginatedData: T[];
  keyExtractor: (item: T) => number | string;
  isIdSelected: (id: number | string) => boolean;
  toggleSelect: (id: number | string) => void;
  expandableContent?: (item: T) => React.ReactNode;
  toggleExpand: (id: number | string) => void;
  onRowClick?: (item: T) => void;
  rowHeightClass: string;
  showCheckbox: boolean;
  cellPaddingClass: string;
  currentColumns: Column<T>[];
  visibleColumns: string[];
  isWrapCells: boolean;
  actions?: (item: T) => React.ReactNode;
  actionsColumnClassName?: string;
  expandedRows: Set<number | string>;
  columnsCount: number;
}

export function DataTableDataBody<T = any>({
  paginatedData,
  keyExtractor,
  isIdSelected,
  toggleSelect,
  expandableContent,
  toggleExpand,
  onRowClick,
  rowHeightClass,
  showCheckbox,
  cellPaddingClass,
  currentColumns,
  visibleColumns,
  isWrapCells,
  actions,
  actionsColumnClassName,
  expandedRows,
  columnsCount,
}: DataTableDataBodyProps<T>) {
  return (
    <>
      {paginatedData.map((item, index) => {
        const id = keyExtractor(item);
        const isSelected = isIdSelected(id);
        return (
          <React.Fragment key={id}>
            <tr
              onClick={(e) => {
                if ((e.target as HTMLElement).closest('button, a, input, select, [role="button"], [data-no-click]')) {
                  return;
                }
                if (expandableContent) {
                  toggleExpand(id);
                } else if (onRowClick) {
                  onRowClick(item);
                }
              }}
              className={`transition-colors group ${rowHeightClass} ${
                isSelected ? 'bg-orange-50/40 dark:bg-[#ff4a1f]/10' : 'hover:bg-slate-50/70 dark:hover:bg-slate-800/50'
              } ${expandableContent || onRowClick ? 'cursor-pointer' : ''}`}
            >
              {showCheckbox && (
                <td className={`${cellPaddingClass} w-[36px] min-w-[36px] max-w-[36px] whitespace-nowrap`}>
                  <div className="flex items-center justify-center">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => { e.stopPropagation(); toggleSelect(id); }}
                      onClick={(e) => e.stopPropagation()}
                      className="table-checkbox"
                    />
                  </div>
                </td>
              )}
              {currentColumns.map(col => {
                if (!visibleColumns.includes(col.id)) return null;
                const isNoWrapCol =
                  col.className?.includes('whitespace-nowrap') ||
                  col.id === 'status' ||
                  col.id === 'deliveryStatus' ||
                  col.id === 'priority' ||
                  col.id === 'date' ||
                  col.id === 'quotesReceived';
                const cellWrapClass =
                  isWrapCells && !isNoWrapCol
                    ? 'whitespace-normal break-words align-top'
                    : col.className?.includes('whitespace-normal')
                    ? 'whitespace-normal break-words'
                    : 'whitespace-nowrap';

                return (
                  <td
                    key={col.id}
                    className={`${cellPaddingClass} ${cellWrapClass} text-[13px] font-medium text-slate-800 dark:text-slate-200 ${col.className || ''}`}
                  >
                    {col.render ? col.render(item, index) : item[col.id]}
                  </td>
                );
              })}
              {actions && (
                <td className={`${cellPaddingClass} whitespace-nowrap text-right pr-3.5 sm:pr-4 ${actionsColumnClassName || 'w-[76px] min-w-[70px]'}`}>
                  <div className="flex items-center justify-end w-full h-7">
                    {actions(item)}
                  </div>
                </td>
              )}
            </tr>
            {expandableContent && expandedRows.has(id) && (
              <tr className="bg-slate-50/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800">
                <td
                  colSpan={columnsCount + (actions ? 1 : 0) + (showCheckbox ? 1 : 0)}
                  className="p-0 border-l-4 border-l-[#FF4A1F]"
                >
                  <div className="animate-in slide-in-from-top-1 fade-in duration-200">
                    {expandableContent(item)}
                  </div>
                </td>
              </tr>
            )}
          </React.Fragment>
        );
      })}
    </>
  );
}
