import React from 'react';
import { DataTableGridProps } from '@/components/tables/data-table-grid';

export interface Column<T = any> {
  id: string;
  label: string;
  render?: (item: T, index?: number) => React.ReactNode;
  skeleton?: () => React.ReactNode;
  className?: string;
  defaultHidden?: boolean;
  sortable?: boolean;
}

export interface DataTableProps<T = any> {
  data: T[];
  columns: Column<T>[];
  searchPlaceholder?: string;
  onDeleteSelected?: (selectedIds: (number | string)[]) => void;
  keyExtractor?: (item: T) => number | string;
  actions?: (item: T) => React.ReactNode;
  filterContent?: React.ReactNode;
  headerTabs?: React.ReactNode;
  compact?: boolean;
  tableId?: string;
  expandableContent?: (item: T) => React.ReactNode;
  hideViewToggle?: boolean;
  hidePagination?: boolean;
  hideToolbar?: boolean;
  isLoading?: boolean;
  skeletonCount?: number;
  emptyState?: React.ReactNode;
  tableClassName?: string;
  tableLayout?: 'auto' | 'fixed';
  disableHorizontalScroll?: boolean;
  actionsColumnClassName?: string;
  onRowClick?: (item: T) => void;
  syncUrlParams?: boolean;
  renderGridCard?: (item: T, isSelected: boolean, toggleSelect: (id: number | string) => void) => React.ReactNode;
  renderGridView?: (props: DataTableGridProps<T>) => React.ReactNode;
  wrapCells?: boolean;
  defaultWrapCells?: boolean;
  onWrapCellsChange?: (wrap: boolean) => void;
  hideCheckbox?: boolean;
  selectable?: boolean;
  hideFilter?: boolean;
  banner?: React.ReactNode;
}
