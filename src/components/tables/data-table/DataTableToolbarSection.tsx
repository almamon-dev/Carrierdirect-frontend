import React from 'react';
import TableToolbar from '@/components/tables/table-toolbar';
import TableSearch from '@/components/tables/table-search';
import TableFilter from '@/components/tables/table-filter';
import TableColumnToggle from '@/components/tables/table-column-toggle';
import { TableViewSwitchButtons } from './TableViewSwitchButtons';
import { Column } from './dataTableTypes';

interface DataTableToolbarSectionProps<T = any> {
  headerTabs?: React.ReactNode;
  hideToolbar?: boolean;
  selectedCount: number;
  totalCount: number;
  onClearSelection: () => void;
  onDeleteSelected?: () => void;
  onSelectAll: () => void;
  search: string;
  setSearch: (val: string) => void;
  searchPlaceholder: string;
  hideFilter?: boolean;
  showFilters: boolean;
  setShowFilters: (val: boolean | ((prev: boolean) => boolean)) => void;
  hideViewToggle?: boolean;
  handleSwitchView: (mode: 'table' | 'grid') => void;
  currentColumns: Column<T>[];
  visibleColumns: string[];
  toggleColumn: (id: string) => void;
  handleResetColumns: () => void;
  isWrapCells: boolean;
  handleToggleWrapCells: (val: boolean) => void;
  filterContent?: React.ReactNode;
  banner?: React.ReactNode;
}

export function DataTableToolbarSection<T = any>({
  headerTabs,
  banner,
  hideToolbar,
  selectedCount,
  totalCount,
  onClearSelection,
  onDeleteSelected,
  onSelectAll,
  search,
  setSearch,
  searchPlaceholder,
  hideFilter,
  showFilters,
  setShowFilters,
  hideViewToggle,
  handleSwitchView,
  currentColumns,
  visibleColumns,
  toggleColumn,
  handleResetColumns,
  isWrapCells,
  handleToggleWrapCells,
  filterContent,
}: DataTableToolbarSectionProps<T>) {
  return (
    <>
      {headerTabs && (
        <div className="px-3.5 pt-2 border-b border-[#ebebeb] dark:border-slate-800">
          {headerTabs}
        </div>
      )}

      {banner && (
        <div className="px-3.5 pt-3">
          {banner}
        </div>
      )}

      {!hideToolbar && (
        <TableToolbar
          selectedCount={selectedCount}
          totalCount={totalCount}
          onClearSelection={onClearSelection}
          onDeleteSelected={onDeleteSelected}
          onSelectAll={onSelectAll}
        >
          <TableSearch
            value={search}
            onChange={setSearch}
            placeholder={searchPlaceholder}
          />
          <div className="flex items-center gap-1.5">
            {!hideFilter && (
              <>
                <TableFilter
                  onFilterClick={() => setShowFilters(!showFilters)}
                  onResetClick={() => {
                    setSearch('');
                    setShowFilters(false);
                  }}
                  isFilterOpen={showFilters}
                  isFiltered={Boolean(search)}
                />
                {!hideViewToggle && <div className="w-[1px] h-4 bg-slate-200/60 dark:bg-slate-800 mx-1" />}
              </>
            )}

            <TableViewSwitchButtons
              viewMode="table"
              onSwitchView={handleSwitchView}
              hideViewToggle={hideViewToggle}
            />

            <TableColumnToggle
              columns={currentColumns}
              visibleColumns={visibleColumns}
              onToggleColumn={toggleColumn}
              onResetColumns={handleResetColumns}
              wrapCells={isWrapCells}
              onToggleWrapCells={handleToggleWrapCells}
            />
          </div>
        </TableToolbar>
      )}

      {showFilters && filterContent && (
        <div className="p-4 border-b border-[#ebebeb] dark:border-slate-800 bg-[#fcfcfc] dark:bg-[#181d24] animate-in slide-in-from-top-2 duration-200">
          {filterContent}
        </div>
      )}
    </>
  );
}
