import { useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

interface UseDataTableUrlSyncProps {
  syncUrlParams: boolean;
  viewMode: 'table' | 'grid';
  setViewMode: (mode: 'table' | 'grid') => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  perPage: number;
  setPerPage: (perPage: number) => void;
}

export function useDataTableUrlSync({
  syncUrlParams,
  viewMode,
  setViewMode,
  currentPage,
  setCurrentPage,
  perPage,
  setPerPage,
}: UseDataTableUrlSyncProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const isFirstMount = useRef(true);

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    if (!syncUrlParams) return;

    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      if (viewMode === 'grid') next.set('view', 'grid');
      else if (viewMode === 'table') next.set('view', 'table');

      if (currentPage > 1) next.set('page', String(currentPage));
      else next.delete('page');

      const defaultPerPage = viewMode === 'grid' ? 12 : 10;
      if (perPage !== defaultPerPage) next.set('per_page', String(perPage));
      else next.delete('per_page');

      return next.toString() !== prev.toString() ? next : prev;
    }, { replace: true });
  }, [viewMode, currentPage, perPage, syncUrlParams, setSearchParams]);

  useEffect(() => {
    if (!syncUrlParams) return;
    const v = searchParams.get('view');
    if (v === 'grid' || v === 'table') setViewMode(v);
    const p = parseInt(searchParams.get('page') || '1', 10);
    setCurrentPage(!isNaN(p) && p > 0 ? p : 1);
    const pp = parseInt(searchParams.get('per_page') || '', 10);
    if (!isNaN(pp) && pp > 0) setPerPage(pp);
  }, [searchParams, syncUrlParams, setViewMode, setCurrentPage, setPerPage]);

  return { searchParams, setSearchParams };
}
