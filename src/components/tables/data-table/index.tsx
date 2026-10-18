import React from 'react';
import { Column, DataTableProps } from './dataTableTypes';
import { useDataTableState } from './useDataTableState';
import { DataTableGridSection } from './DataTableGridSection';
import { DataTableToolbarSection } from './DataTableToolbarSection';
import { DataTableHeader } from './DataTableHeader';
import { DataTableSkeletonBody } from './DataTableSkeletonBody';
import { DataTableDataBody } from './DataTableDataBody';
import EmptyState from '@/components/tables/empty-state';
import TablePagination from '@/components/tables/table-pagination';

export type { Column, DataTableProps };

export default function DataTable<T extends Record<string, any>>(props: DataTableProps<T>) {
  const {
    columns,
    searchPlaceholder = 'Search...',
    onDeleteSelected,
    keyExtractor = (item: any) => item.id,
    actions,
    filterContent,
    headerTabs,
    compact = false,
    expandableContent,
    hideViewToggle = false,
    hidePagination = false,
    hideToolbar = false,
    isLoading = false,
    emptyState,
    tableClassName,
    tableLayout = 'auto',
    disableHorizontalScroll = false,
    actionsColumnClassName,
    onRowClick,
    hideCheckbox = false,
    selectable = true,
    hideFilter = false,
    banner,
  } = props;

  const showCheckbox = selectable && !hideCheckbox;
  const rowHeightClass = compact ? 'min-h-[38px]' : 'min-h-[50px]';
  const cellPaddingClass = compact ? 'px-2 py-1.5' : 'px-3.5 py-3';

  const state = useDataTableState(props);

  if (state.viewMode === 'grid') {
    return <DataTableGridSection props={props} state={state} />;
  }

  return (
    <div className="bg-white dark:bg-[#12161c] rounded-[3px] border border-slate-200 dark:border-slate-800 shadow-none">
      <div className="animate-in fade-in duration-300">
        <DataTableToolbarSection
          headerTabs={headerTabs}
          banner={banner}
          hideToolbar={hideToolbar}
          selectedCount={state.selectedIds.length}
          totalCount={state.totalItems}
          onClearSelection={() => state.setSelectedIds([])}
          onDeleteSelected={onDeleteSelected ? () => onDeleteSelected(state.selectedIds) : undefined}
          onSelectAll={state.handleSelectAll}
          search={state.search}
          setSearch={state.setSearch}
          searchPlaceholder={searchPlaceholder}
          hideFilter={hideFilter}
          showFilters={state.showFilters}
          setShowFilters={state.setShowFilters}
          hideViewToggle={hideViewToggle}
          handleSwitchView={state.handleSwitchView}
          currentColumns={state.currentColumns}
          visibleColumns={state.visibleColumns}
          toggleColumn={state.toggleColumn}
          handleResetColumns={state.handleResetColumns}
          isWrapCells={state.isWrapCells}
          handleToggleWrapCells={state.handleToggleWrapCells}
          filterContent={filterContent}
        />

        {state.paginatedData.length === 0 && !isLoading ? (
          <div className="bg-white dark:bg-[#12161c]">
            {emptyState ?? <EmptyState />}
          </div>
        ) : (
          <div className={disableHorizontalScroll ? 'overflow-hidden' : 'overflow-x-auto custom-scrollbar'}>
            <table
              className={`w-full text-left border-collapse ${tableLayout === 'fixed' ? 'table-fixed' : ''} ${
                state.isWrapCells ? 'table-wrap-cells' : ''
              } ${tableClassName || ''}`}
            >
              <DataTableHeader
                showCheckbox={showCheckbox}
                compact={compact}
                isAllPageSelected={state.isAllPageSelected}
                isSomePageSelected={state.isSomePageSelected}
                toggleSelectAll={state.toggleSelectAll}
                currentColumns={state.currentColumns}
                visibleColumns={state.visibleColumns}
                setOrderedColumnIds={state.setOrderedColumnIds}
                sortKey={state.sortKey}
                sortDir={state.sortDir}
                handleSort={state.handleSort}
                actions={actions}
                actionsColumnClassName={actionsColumnClassName}
              />
              <tbody className="divide-y divide-slate-200/90 dark:divide-slate-800 bg-white dark:bg-[#12161c]">
                {isLoading ? (
                  <DataTableSkeletonBody
                    effectiveSkeletonCount={state.effectiveSkeletonCount}
                    rowHeightClass={rowHeightClass}
                    cellPaddingClass={cellPaddingClass}
                    showCheckbox={showCheckbox}
                    currentColumns={state.currentColumns}
                    visibleColumns={state.visibleColumns}
                    actions={actions}
                    actionsColumnClassName={actionsColumnClassName}
                  />
                ) : (
                  <DataTableDataBody
                    paginatedData={state.paginatedData}
                    keyExtractor={keyExtractor}
                    isIdSelected={state.isIdSelected}
                    toggleSelect={state.toggleSelect}
                    expandableContent={expandableContent}
                    toggleExpand={state.toggleExpand}
                    onRowClick={onRowClick}
                    rowHeightClass={rowHeightClass}
                    showCheckbox={showCheckbox}
                    cellPaddingClass={cellPaddingClass}
                    currentColumns={state.currentColumns}
                    visibleColumns={state.visibleColumns}
                    isWrapCells={state.isWrapCells}
                    actions={actions}
                    actionsColumnClassName={actionsColumnClassName}
                    expandedRows={state.expandedRows}
                    columnsCount={columns.length}
                  />
                )}
              </tbody>
            </table>
          </div>
        )}

        {!hidePagination && (
          <TablePagination
            total={state.totalItems}
            fromIdx={state.totalItems > 0 ? state.startIndex + 1 : 0}
            toIdx={Math.min(state.startIndex + state.activePerPage, state.totalItems)}
            perPage={state.activePerPage}
            currentPage={state.validCurrentPage}
            totalPages={state.totalPages}
            onPageChange={(p) => state.setCurrentPage(p)}
            onPerPageChange={(val) => {
              state.setPerPage(Number(val));
              state.setCurrentPage(1);
            }}
            onPrevPage={() => state.setCurrentPage((p: number) => Math.max(1, p - 1))}
            onNextPage={() => state.setCurrentPage((p: number) => Math.min(state.totalPages, p + 1))}
            hasPrev={state.validCurrentPage > 1}
            hasNext={state.validCurrentPage < state.totalPages}
            variant="table"
          />
        )}
      </div>
    </div>
  );
}
