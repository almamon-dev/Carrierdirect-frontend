import { useState, useEffect, useCallback, useMemo } from 'react';
import { Column } from './dataTableTypes';

export function useDataTableColumns<T = any>(columns: Column<T>[]) {
  const [visibleColumns, setVisibleColumns] = useState<string[]>(() =>
    columns.filter(c => !c.defaultHidden).map(c => c.id)
  );

  useEffect(() => {
    setVisibleColumns(prev => {
      const currentExisting = prev.filter(id => columns.some(c => c.id === id));
      const newCols = columns.filter(c => !c.defaultHidden && !currentExisting.includes(c.id)).map(c => c.id);
      return [...currentExisting, ...newCols];
    });
  }, [columns]);

  const [orderedColumnIds, setOrderedColumnIds] = useState<string[]>(() => columns.map(c => c.id));

  useEffect(() => {
    setOrderedColumnIds(prev => {
      const valid = prev.filter(id => columns.some(c => c.id === id));
      return valid.length === columns.length ? valid : columns.map(c => c.id);
    });
  }, [columns]);

  const currentColumns = useMemo(() => {
    const colMap = new Map(columns.map(c => [c.id, c]));
    const ordered: Column<T>[] = [];
    orderedColumnIds.forEach(id => {
      const col = colMap.get(id);
      if (col) ordered.push(col);
    });
    columns.forEach(col => {
      if (!orderedColumnIds.includes(col.id)) ordered.push(col);
    });
    return ordered;
  }, [columns, orderedColumnIds]);

  const toggleColumn = useCallback((id: string) => {
    setVisibleColumns(prev =>
      prev.includes(id) ? (prev.length <= 1 ? prev : prev.filter(c => c !== id)) : [...prev, id]
    );
  }, []);

  const handleResetColumns = useCallback(() => {
    setVisibleColumns(columns.filter(c => !c.defaultHidden).map(c => c.id));
    setOrderedColumnIds(columns.map(c => c.id));
  }, [columns]);

  return {
    visibleColumns,
    setVisibleColumns,
    orderedColumnIds,
    setOrderedColumnIds,
    currentColumns,
    toggleColumn,
    handleResetColumns,
  };
}
