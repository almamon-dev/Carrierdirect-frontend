import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DataTableProps } from './dataTableTypes';
import { sortTableData, getSavedWrapCells, saveWrapCells } from './dataTableUtils';
import { useDataTableUrlSync } from './useDataTableUrlSync';
import { useDataTableColumns } from './useDataTableColumns';

export function useDataTableState<T extends Record<string, any>>({
  data,
  columns,
  keyExtractor = (item: any) => item.id,
  tableId,
  syncUrlParams = true,
  wrapCells: controlledWrapCells,
  defaultWrapCells = false,
  onWrapCellsChange,
  skeletonCount,
}: DataTableProps<T>) {
  const [initialParams] = useSearchParams();

  const [internalWrapCells, setInternalWrapCells] = useState<boolean>(() =>
    getSavedWrapCells(tableId, defaultWrapCells)
  );

  const isWrapCells = controlledWrapCells !== undefined ? controlledWrapCells : internalWrapCells;

  const handleToggleWrapCells = useCallback((val: boolean) => {
    setInternalWrapCells(val);
    saveWrapCells(val, tableId);
    if (onWrapCellsChange) onWrapCellsChange(val);
  }, [tableId, onWrapCellsChange]);

  const [viewMode, setViewMode] = useState<'table' | 'grid'>(() => {
    const urlView = initialParams.get('view');
    return urlView === 'grid' || urlView === 'table' ? urlView : 'table';
  });

  const [currentPage, setCurrentPage] = useState<number>(() => {
    const urlPage = parseInt(initialParams.get('page') || '1', 10);
    return !isNaN(urlPage) && urlPage > 0 ? urlPage : 1;
  });

  const [perPage, setPerPage] = useState<number>(() => {
    const urlPerPage = parseInt(initialParams.get('per_page') || '', 10);
    if (!isNaN(urlPerPage) && urlPerPage > 0) return urlPerPage;
    return initialParams.get('view') === 'grid' ? 12 : 10;
  });

  useDataTableUrlSync({
    syncUrlParams,
    viewMode,
    setViewMode,
    currentPage,
    setCurrentPage,
    perPage,
    setPerPage,
  });

  const handleSwitchView = useCallback((mode: 'table' | 'grid') => {
    if (mode === viewMode) return;
    setViewMode(mode);
    if (mode === 'grid' && perPage === 10) setPerPage(12);
    else if (mode === 'table' && perPage === 12) setPerPage(10);
    setCurrentPage(1);
  }, [viewMode, perPage]);

  const [search, setSearch] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedIds, setSelectedIds] = useState<(number | string)[]>([]);
  const [expandedRows, setExpandedRows] = useState<Set<number | string>>(new Set());
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  // Keep only selected IDs that still exist in the current dataset
  useEffect(() => {
    setSelectedIds(prev => {
      if (!prev || prev.length === 0) return prev;
      const validIds = new Set(data.map(item => String(keyExtractor(item))));
      const next = prev.filter(id => validIds.has(String(id)));
      return next.length === prev.length ? prev : next;
    });
  }, [data, keyExtractor]);

  // Reset selected IDs only when search query actually changes (not on initial mount or re-render)
  const isSearchMountedRef = useRef(false);
  useEffect(() => {
    if (!isSearchMountedRef.current) {
      isSearchMountedRef.current = true;
      return;
    }
    setSelectedIds([]);
  }, [search]);

  const handleSort = useCallback((colId: string) => {
    setSortKey(k => {
      if (k === colId) {
        setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
        return colId;
      }
      setSortDir('asc');
      return colId;
    });
    setCurrentPage(1);
  }, []);

  const prevSearchRef = useRef(search);
  useEffect(() => {
    if (prevSearchRef.current !== search) {
      prevSearchRef.current = search;
      setCurrentPage(1);
    }
  }, [search]);

  const {
    visibleColumns,
    orderedColumnIds,
    setOrderedColumnIds,
    currentColumns,
    toggleColumn,
    handleResetColumns,
  } = useDataTableColumns(columns);

  const filteredData = useMemo(() => {
    if (!search) return data;
    const q = search.toLowerCase();
    return data.filter(item => Object.values(item).some(val => String(val).toLowerCase().includes(q)));
  }, [data, search]);

  const sortedData = useMemo(() => sortTableData(filteredData, sortKey, sortDir), [filteredData, sortKey, sortDir]);

  const isGridMode = viewMode === 'grid';
  const activePerPage = isGridMode ? (perPage === 10 ? 12 : perPage) : perPage;
  const totalItems = sortedData.length;
  const totalPages = Math.ceil(totalItems / activePerPage);
  const validCurrentPage = totalPages > 0 ? Math.min(Math.max(1, currentPage), totalPages) : 1;
  const startIndex = (validCurrentPage - 1) * activePerPage;
  const paginatedData = sortedData.slice(startIndex, startIndex + activePerPage);
  const effectiveSkeletonCount = skeletonCount ?? (paginatedData.length > 0 ? paginatedData.length : 4);

  const isIdSelected = useCallback((id: number | string) => selectedIds.some(sId => String(sId) === String(id)), [selectedIds]);
  const isAllPageSelected = paginatedData.length > 0 && paginatedData.every(item => isIdSelected(keyExtractor(item)));
  const isSomePageSelected = paginatedData.length > 0 && paginatedData.some(item => isIdSelected(keyExtractor(item))) && !isAllPageSelected;

  const toggleSelectAll = useCallback(() => {
    if (isAllPageSelected) {
      const pageIds = new Set(paginatedData.map(item => String(keyExtractor(item))));
      setSelectedIds(prev => prev.filter(id => !pageIds.has(String(id))));
    } else {
      const pageIds = paginatedData.map(item => keyExtractor(item));
      setSelectedIds(prev => {
        const currentSet = new Set(prev.map(id => String(id)));
        return [...prev, ...pageIds.filter(id => !currentSet.has(String(id)))];
      });
    }
  }, [isAllPageSelected, paginatedData, keyExtractor]);

  const handleSelectAll = useCallback(() => {
    setSelectedIds(filteredData.map(item => keyExtractor(item)));
  }, [filteredData, keyExtractor]);

  const toggleSelect = useCallback((id: number | string) => {
    setSelectedIds(prev => (prev.some(sId => String(sId) === String(id)) ? prev.filter(sId => String(sId) !== String(id)) : [...prev, id]));
  }, []);

  const toggleExpand = useCallback((id: number | string) => {
    setExpandedRows(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  return {
    isWrapCells, handleToggleWrapCells, viewMode, handleSwitchView, currentPage, setCurrentPage,
    perPage, setPerPage, search, setSearch, isSearchOpen, setIsSearchOpen, showFilters, setShowFilters,
    selectedIds, setSelectedIds, expandedRows, sortKey, setSortKey, sortDir, setSortDir, handleSort,
    visibleColumns, orderedColumnIds, setOrderedColumnIds, currentColumns, filteredData, sortedData,
    isGridMode, activePerPage, totalItems, totalPages, validCurrentPage, startIndex, paginatedData,
    effectiveSkeletonCount, toggleColumn, handleResetColumns, isIdSelected, isAllPageSelected,
    isSomePageSelected, toggleSelectAll, handleSelectAll, toggleSelect, toggleExpand,
  };
}
