import React from 'react';
import { Column, DataTableProps } from './dataTableTypes';
import { DataTableGridToolbar } from './DataTableGridToolbar';
import DataTableGrid from '@/components/tables/data-table-grid';
import TablePagination from '@/components/tables/table-pagination';

interface DataTableGridSectionProps<T extends Record<string, any>> {
  props: DataTableProps<T>;
  state: any;
}

export function DataTableGridSection<T extends Record<string, any>>({
  props,
  state,
}: DataTableGridSectionProps<T>) {
  const {
    headerTabs,
    searchPlaceholder = 'Search...',
    onDeleteSelected,
    hideFilter,
    filterContent,
    hideViewToggle,
    renderGridView,
    renderGridCard,
    keyExtractor = (item: any) => item.id,
    actions,
    onRowClick,
    isLoading,
    emptyState,
    compact,
    hidePagination,
  } = props;

  return (
    <div className="space-y-4">
      <DataTableGridToolbar
        selectedIds={state.selectedIds}
        totalItems={state.totalItems}
        handleSelectAll={state.handleSelectAll}
        onDeleteSelected={onDeleteSelected}
        setSelectedIds={state.setSelectedIds}
        headerTabs={headerTabs}
        isSearchOpen={state.isSearchOpen}
        setIsSearchOpen={state.setIsSearchOpen}
        search={state.search}
        setSearch={state.setSearch}
        searchPlaceholder={searchPlaceholder}
        columns={props.columns}
        sortKey={state.sortKey}
        sortDir={state.sortDir}
        setSortKey={state.setSortKey}
        setSortDir={state.setSortDir}
        setCurrentPage={state.setCurrentPage}
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

      {props.banner && (
        <div className="w-full">
          {props.banner}
        </div>
      )}

      {renderGridView ? (
        renderGridView({
          data: state.paginatedData,
          allData: state.sortedData,
          columns: state.currentColumns,
          visibleColumns: state.visibleColumns,
          selectedIds: state.selectedIds,
          toggleSelect: state.toggleSelect,
          keyExtractor,
          actions,
          onDeleteSelected,
          onRowClick,
          isLoading,
          skeletonCount: state.effectiveSkeletonCount,
          emptyState,
          renderCard: renderGridCard,
        })
      ) : (
        <DataTableGrid
          data={state.paginatedData}
          columns={state.currentColumns}
          visibleColumns={state.visibleColumns}
          selectedIds={state.selectedIds}
          toggleSelect={state.toggleSelect}
          keyExtractor={keyExtractor}
          actions={actions}
          onDeleteSelected={onDeleteSelected}
          onRowClick={onRowClick}
          isLoading={isLoading}
          skeletonCount={state.effectiveSkeletonCount}
          emptyState={emptyState}
          renderCard={renderGridCard}
          compact={compact}
        />
      )}

      {!hidePagination && !(state.isGridMode && renderGridView) && (
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
          variant="grid"
          perPageOptions={[12, 24, 36, 48, 96]}
          itemLabel="cards"
          perPageLabel="Cards per page:"
        />
      )}
    </div>
  );
}
