import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
    Search, SlidersHorizontal, RotateCcw, Trash2, X, LayoutGrid, List, MapPin,
    ChevronsUpDown, ChevronUp, ChevronDown, ArrowUpDown
} from 'lucide-react';
import TablePagination from '@/components/tables/table-pagination';
import EmptyState from '@/components/tables/empty-state';
import TableSearch from '@/components/tables/table-search';
import TableFilter from '@/components/tables/table-filter';
import TableColumnToggle from '@/components/tables/table-column-toggle';
import TableSortDropdown from '@/components/tables/table-sort-dropdown';
import TableToolbar from '@/components/tables/table-toolbar';
import DataTableGrid from '@/components/tables/data-table-grid';
import Skeleton from '@/components/ui/skeleton';

export interface Column<T = any> {
    id: string;
    label: string;
    render?: (item: T) => React.ReactNode;
    skeleton?: () => React.ReactNode;
    className?: string;
    defaultHidden?: boolean;
    sortable?: boolean; // Enable sort by clicking header
}

export interface DataTableProps<T = any> {
    data: T[];
    columns: Column<T>[];
    searchPlaceholder?: string;
    onDeleteSelected?: (selectedIds: number[]) => void;
    keyExtractor?: (item: T) => number | string;
    actions?: (item: T) => React.ReactNode;
    filterContent?: React.ReactNode;
    headerTabs?: React.ReactNode;
    compact?: boolean;
    tableId?: string; // Optional ID to persist column state in localStorage
    expandableContent?: (item: T) => React.ReactNode;
    hideViewToggle?: boolean;
    hidePagination?: boolean;
    hideToolbar?: boolean;
    isLoading?: boolean;
    skeletonCount?: number;
    emptyState?: React.ReactNode;
    tableClassName?: string;
    tableLayout?: 'auto' | 'fixed';
    actionsColumnClassName?: string;
    onRowClick?: (item: T) => void;
    syncUrlParams?: boolean;
    renderGridCard?: (item: T, isSelected: boolean, toggleSelect: (id: number | string) => void) => React.ReactNode;
    renderGridView?: (props: import('@/components/tables/data-table-grid').DataTableGridProps<T>) => React.ReactNode;
}

export default function DataTable<T extends Record<string, any>>({ 
    data, 
    columns, 
    searchPlaceholder = "Search...", 
    onDeleteSelected, 
    keyExtractor = (item: any) => item.id, 
    actions, 
    filterContent, 
    headerTabs, 
    compact = false, 
    tableId, 
    expandableContent, 
    hideViewToggle = false, 
    hidePagination = false, 
    hideToolbar = false, 
    isLoading = false, 
    skeletonCount,
    emptyState, 
    tableClassName, 
    tableLayout = 'auto', 
    actionsColumnClassName,
    onRowClick,
    syncUrlParams = true,
    renderGridCard,
    renderGridView,
}: DataTableProps<T>) {
    const [searchParams, setSearchParams] = useSearchParams();

    // Initialize viewMode from URL param or default to 'table'
    const [viewMode, setViewMode] = useState<'table' | 'grid'>(() => {
        const urlView = searchParams.get('view');
        return (urlView === 'grid' || urlView === 'table') ? urlView : 'table';
    });

    // Initialize pagination from URL params
    const [currentPage, setCurrentPage] = useState<number>(() => {
        const urlPage = parseInt(searchParams.get('page') || '1', 10);
        return !isNaN(urlPage) && urlPage > 0 ? urlPage : 1;
    });

    const [perPage, setPerPage] = useState<number>(() => {
        const urlPerPage = parseInt(searchParams.get('per_page') || '', 10);
        if (!isNaN(urlPerPage) && urlPerPage > 0) return urlPerPage;
        const urlView = searchParams.get('view');
        return urlView === 'grid' ? 12 : 10;
    });

    const handleSwitchView = (mode: 'table' | 'grid') => {
        if (mode === viewMode) return;
        setViewMode(mode);
        if (mode === 'grid' && perPage === 10) {
            setPerPage(12);
        } else if (mode === 'table' && perPage === 12) {
            setPerPage(10);
        }
        setCurrentPage(1);
    };

    const rowHeightClass = compact ? 'min-h-[44px]' : 'min-h-[50px]';
    const cellPaddingClass = compact ? 'px-2.5 py-2.5' : 'px-3.5 py-3';
    const [search, setSearch] = useState('');
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [selectedIds, setSelectedIds] = useState<(number | string)[]>([]);
    const [expandedRows, setExpandedRows] = useState<Set<number | string>>(new Set());
    const [gridLimit, setGridLimit] = useState(12);

    // Sort state
    const [sortKey, setSortKey] = useState<string | null>(null);
    const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

    const handleSort = (colId: string) => {
        if (sortKey === colId) {
            setSortDir(d => d === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(colId);
            setSortDir('asc');
        }
        setCurrentPage(1);
    };

    // Sync state changes to URL search params without page flicker
    const isFirstMount = useRef(true);
    useEffect(() => {
        if (isFirstMount.current) {
            isFirstMount.current = false;
            return;
        }
        if (!syncUrlParams) return;

        setSearchParams(prev => {
            const next = new URLSearchParams(prev);
            
            // View mode
            if (viewMode === 'grid') {
                next.set('view', 'grid');
            } else if (viewMode === 'table') {
                next.set('view', 'table');
            }

            // Page
            if (currentPage > 1) {
                next.set('page', String(currentPage));
            } else {
                next.delete('page');
            }

            // Per page
            const defaultPerPage = viewMode === 'grid' ? 12 : 10;
            if (perPage !== defaultPerPage) {
                next.set('per_page', String(perPage));
            } else {
                next.delete('per_page');
            }

            // Only update if search params actually changed
            if (next.toString() !== prev.toString()) {
                return next;
            }
            return prev;
        }, { replace: true });
    }, [viewMode, currentPage, perPage, syncUrlParams, setSearchParams]);

    // Listen to external URL search param changes (e.g. browser back/forward buttons)
    useEffect(() => {
        if (!syncUrlParams) return;
        const v = searchParams.get('view');
        if (v === 'grid' || v === 'table') {
            setViewMode(v);
        }
        const p = parseInt(searchParams.get('page') || '1', 10);
        if (!isNaN(p) && p > 0) {
            setCurrentPage(p);
        } else {
            setCurrentPage(1);
        }
        const ppParam = searchParams.get('per_page');
        if (ppParam) {
            const pp = parseInt(ppParam, 10);
            if (!isNaN(pp) && pp > 0) {
                setPerPage(pp);
            }
        }
    }, [searchParams, syncUrlParams]);

    // Reset to page 1 ONLY when search query string actually changes
    const prevSearchRef = useRef(search);
    useEffect(() => {
        if (prevSearchRef.current !== search) {
            prevSearchRef.current = search;
            setCurrentPage(1);
            setGridLimit(12);
        }
    }, [search]);

    // Initialize visible columns directly from columns definitions (no localStorage)
    const [visibleColumns, setVisibleColumns] = useState<string[]>(() => {
        return columns.filter(c => !c.defaultHidden).map(c => c.id);
    });

    // Update visible columns if columns change
    useEffect(() => {
        setVisibleColumns(prev => {
            const currentExisting = prev.filter(id => columns.some(c => c.id === id));
            const newCols = columns.filter(c => !c.defaultHidden && !currentExisting.includes(c.id)).map(c => c.id);
            return [...currentExisting, ...newCols];
        });
    }, [columns]);

    // Column Order State (supports in-memory Drag and Drop reordering)
    const [orderedColumnIds, setOrderedColumnIds] = useState<string[]>(() => {
        return columns.map(c => c.id);
    });

    // Synchronize column order if columns prop changes
    useEffect(() => {
        setOrderedColumnIds(prev => {
            const valid = prev.filter(id => columns.some(c => c.id === id));
            if (valid.length === columns.length) {
                return valid;
            }
            return columns.map(c => c.id);
        });
    }, [columns]);

    // Derived ordered columns list
    const currentColumns = React.useMemo(() => {
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


    // Apply Search Filtering
    const filteredData = data.filter(item => {
        if (!search) return true;
        return Object.values(item).some(val => 
            String(val).toLowerCase().includes(search.toLowerCase())
        );
    });

    // Apply Sorting
    const sortedData = React.useMemo(() => {
        if (!sortKey) return filteredData;
        return [...filteredData].sort((a, b) => {
            const av = a[sortKey];
            const bv = b[sortKey];
            if (av === null || av === undefined) return 1;
            if (bv === null || bv === undefined) return -1;

            if (typeof av === 'number' && typeof bv === 'number') {
                return sortDir === 'asc' ? av - bv : bv - av;
            }

            const strA = String(av).trim();
            const strB = String(bv).trim();

            if (/^[$€£¥]?\s*[\d,]+(\.\d+)?$/.test(strA) && /^[$€£¥]?\s*[\d,]+(\.\d+)?$/.test(strB)) {
                const numA = parseFloat(strA.replace(/[^0-9.-]/g, ''));
                const numB = parseFloat(strB.replace(/[^0-9.-]/g, ''));
                if (!isNaN(numA) && !isNaN(numB)) {
                    return sortDir === 'asc' ? numA - numB : numB - numA;
                }
            }

            const comp = strA.localeCompare(strB, undefined, { numeric: true, sensitivity: 'base' });
            return sortDir === 'asc' ? comp : -comp;
        });
    }, [filteredData, sortKey, sortDir]);

    // Pagination Logic
    const isGridMode = viewMode === 'grid';
    const activePerPage = isGridMode ? (perPage === 10 ? 12 : perPage) : perPage;
    const totalItems = sortedData.length;
    const totalPages = Math.ceil(totalItems / activePerPage);
    const validCurrentPage = totalPages > 0 ? Math.min(Math.max(1, currentPage), totalPages) : 1;
    const startIndex = (validCurrentPage - 1) * activePerPage;
    const paginatedData = sortedData.slice(startIndex, startIndex + activePerPage);

    // Dynamic skeleton count:
    // 1. If explicit skeletonCount is provided, use it.
    // 2. If there is live data on the current page, match that exact live count (paginatedData.length).
    // 3. If initial loading (no live data loaded yet), show a clean minimal 3-4 rows (or skeletonCount).
    const effectiveSkeletonCount = skeletonCount ?? (paginatedData.length > 0 ? paginatedData.length : 4);

    const toggleColumn = (id: string) => {
        setVisibleColumns(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === paginatedData.length && paginatedData.length > 0) {
            setSelectedIds([]);
        } else {
            setSelectedIds(paginatedData.map(item => keyExtractor(item)));
        }
    };

    const handleSelectAll = () => {
        setSelectedIds(filteredData.map(item => keyExtractor(item)));
    };

    const toggleSelect = (id: number | string) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const toggleExpand = (id: number | string) => {
        setExpandedRows(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    if (viewMode === 'grid') {
        return (
            <div className="space-y-4">
                {/* Control Toolbar Card (Single-Row Unified Header) */}
                <div className="bg-white dark:bg-[#12161c] rounded-[3px] border border-[#ebebeb] dark:border-slate-800 shadow-none animate-in fade-in duration-200">
                    <div className="relative z-30">
                        {/* Bulk Action Overlay when items are selected */}
                        {selectedIds.length > 0 && (
                            <div className="absolute inset-0 bg-slate-100/95 dark:bg-[#1e2329]/95 backdrop-blur-xs z-20 flex items-center justify-between px-4 animate-in fade-in duration-200">
                                <div className="flex items-center gap-1.5 text-[13px]">
                                    <span className="text-slate-800 dark:text-slate-200">
                                        All <strong>{selectedIds.length}</strong> items on this page are selected.
                                    </span>
                                    {totalItems > selectedIds.length && (
                                        <button 
                                            onClick={handleSelectAll}
                                            className="text-[#FF4A1F] font-bold hover:text-[#E03E15] underline decoration-[#FF4A1F]/40 hover:decoration-[#FF4A1F] underline-offset-2 transition-colors ml-1 cursor-pointer"
                                        >
                                            Select all {totalItems} items
                                        </button>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    {onDeleteSelected && (
                                        <button 
                                            onClick={() => onDeleteSelected(selectedIds as number[])}
                                            className="h-[28px] px-3 bg-white dark:bg-[#12161c] border border-red-200 dark:border-red-900/60 text-red-600 dark:text-red-400 rounded-md text-[12px] font-bold hover:bg-red-50 dark:hover:bg-red-950/40 transition-all flex items-center gap-1.5 shadow-none cursor-pointer outline-none"
                                        >
                                            <Trash2 size={13} />
                                            Delete
                                        </button>
                                    )}
                                    <button 
                                        onClick={() => setSelectedIds([])} 
                                        className="h-7 w-7 flex items-center justify-center bg-white dark:bg-[#12161c] border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-100 transition-all cursor-pointer outline-none shadow-none group" 
                                        title="Clear selection"
                                    >
                                        <X size={14} className="group-hover:scale-110 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Single Row: Left (Tabs or Count) + Right (Controls) */}
                        <div className={`px-3.5 py-2 flex flex-col md:flex-row md:items-center justify-between gap-3 ${selectedIds.length > 0 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                            {/* Left: Filter Tabs or Items Info */}
                            <div className="flex-1 min-w-0 overflow-x-auto hide-scrollbar">
                                {headerTabs ? (
                                    <div className="pt-0.5">
                                        {headerTabs}
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                        <span>{totalItems} total items</span>
                                    </div>
                                )}
                            </div>

                            {/* Right: Controls on the same line */}
                            <div className="flex items-center gap-1.5 shrink-0 justify-end flex-wrap sm:flex-nowrap">
                                {/* Expandable Search Icon / Input */}
                                {isSearchOpen ? (
                                    <div className="relative flex items-center animate-in fade-in zoom-in-95 duration-150">
                                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={13} />
                                        <input 
                                            type="text" 
                                            autoFocus
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Escape') {
                                                    if (!search) setIsSearchOpen(false);
                                                }
                                            }}
                                            placeholder={searchPlaceholder} 
                                            className="h-[32px] w-[200px] sm:w-[240px] pl-8 pr-7 border border-[#ff4a1f]/80 dark:border-[#ff4a1f]/80 rounded-[3px] text-[12px] font-medium bg-slate-50/50 dark:bg-[#1e2329] text-slate-900 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none shadow-none"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setSearch('');
                                                setIsSearchOpen(false);
                                            }}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                                            title="Close search"
                                        >
                                            <X size={13} />
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => setIsSearchOpen(true)}
                                        className={`h-[32px] w-[32px] flex items-center justify-center rounded-[3px] border border-slate-200/80 dark:border-slate-700/60 bg-slate-50/50 dark:bg-[#1e2329] text-slate-600 dark:text-slate-300 hover:border-[#ff4a1f]/50 hover:text-[#ff4a1f] hover:bg-orange-50/40 dark:hover:bg-slate-800 transition-all cursor-pointer ${search ? 'border-[#ff4a1f] text-[#ff4a1f]' : ''}`}
                                        title="Search"
                                    >
                                        <Search size={14} className={search ? 'text-[#ff4a1f]' : 'text-slate-500 dark:text-slate-400'} />
                                    </button>
                                )}

                                {/* Sort Selector */}
                                <TableSortDropdown
                                    columns={columns}
                                    sortKey={sortKey}
                                    sortDir={sortDir}
                                    onSortChange={(key) => {
                                        setSortKey(key);
                                        setCurrentPage(1);
                                    }}
                                    onSortDirChange={(dir) => {
                                        setSortDir(dir);
                                        setCurrentPage(1);
                                    }}
                                />

                                <TableFilter 
                                    onFilterClick={() => setShowFilters(!showFilters)} 
                                    onResetClick={() => {
                                        setSearch('');
                                        setShowFilters(false);
                                    }}
                                    isFilterOpen={showFilters}
                                    isFiltered={Boolean(search)}
                                />
                                
                                <div className="w-[1px] h-4 bg-slate-200/60 dark:bg-slate-800 mx-0.5 hidden sm:block"></div>

                                {!hideViewToggle && (
                                    <>
                                        <div className="flex items-center border border-slate-200/80 dark:border-slate-700/60 rounded-[3px] overflow-hidden bg-slate-50/50 dark:bg-[#1e2329] shadow-none h-[32px]">
                                            <button 
                                                onClick={() => handleSwitchView('table')}
                                                className="h-[30px] px-2.5 flex items-center justify-center transition-colors text-[#8c9196] dark:text-slate-400 hover:bg-white/60 dark:hover:bg-slate-800/60 hover:text-[#202223] dark:hover:text-slate-200 cursor-pointer"
                                                title="Table View"
                                            >
                                                <List size={14} />
                                            </button>
                                            <div className="w-[1px] h-[30px] bg-slate-200/80 dark:bg-slate-700/60"></div>
                                            <button 
                                                onClick={() => handleSwitchView('grid')}
                                                className="h-[30px] px-2.5 flex items-center justify-center transition-colors bg-white dark:bg-slate-800 text-[#202223] dark:text-slate-200 shadow-2xs cursor-pointer"
                                                title="Grid View"
                                            >
                                                <LayoutGrid size={14} />
                                            </button>
                                        </div>
                                        <div className="w-[1px] h-4 bg-slate-200/60 dark:bg-slate-800 mx-0.5 hidden sm:block"></div>
                                    </>
                                )}

                                <TableColumnToggle 
                                    columns={currentColumns}
                                    visibleColumns={visibleColumns}
                                    onToggleColumn={toggleColumn}
                                    onReorderColumns={(newOrder) => setOrderedColumnIds(newOrder)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Filter Content Area */}
                    {showFilters && filterContent && (
                        <div className="p-4 border-t border-[#ebebeb] dark:border-slate-800 bg-[#fcfcfc] dark:bg-[#181d24] animate-in slide-in-from-top-2 duration-200">
                            {filterContent}
                        </div>
                    )}
                </div>

                {/* Dedicated Separate Grid View Component */}
                {renderGridView ? (
                    renderGridView({
                        data: paginatedData,
                        columns: currentColumns,
                        visibleColumns,
                        selectedIds,
                        toggleSelect,
                        keyExtractor,
                        actions,
                        onDeleteSelected,
                        onRowClick,
                        isLoading,
                        skeletonCount: effectiveSkeletonCount,
                        emptyState,
                        renderCard: renderGridCard,
                    })
                ) : (
                    <DataTableGrid
                        data={paginatedData}
                        columns={currentColumns}
                        visibleColumns={visibleColumns}
                        selectedIds={selectedIds}
                        toggleSelect={toggleSelect}
                        keyExtractor={keyExtractor}
                        actions={actions}
                        onDeleteSelected={onDeleteSelected}
                        onRowClick={onRowClick}
                        isLoading={isLoading}
                        skeletonCount={effectiveSkeletonCount}
                        emptyState={emptyState}
                        renderCard={renderGridCard}
                        compact={compact}
                    />
                )}

                {/* Standalone Grid Pagination */}
                {!hidePagination && (
                    <TablePagination 
                        total={totalItems}
                        fromIdx={totalItems > 0 ? startIndex + 1 : 0}
                        toIdx={Math.min(startIndex + activePerPage, totalItems)}
                        perPage={activePerPage}
                        currentPage={validCurrentPage}
                        totalPages={totalPages}
                        onPageChange={(p) => setCurrentPage(p)}
                        onPerPageChange={(val) => {
                            setPerPage(Number(val));
                            setCurrentPage(1);
                        }}
                        onPrevPage={() => setCurrentPage(p => Math.max(1, p - 1))}
                        onNextPage={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        hasPrev={validCurrentPage > 1}
                        hasNext={validCurrentPage < totalPages}
                        variant="grid"
                        perPageOptions={[12, 24, 36, 48, 96]}
                        itemLabel="cards"
                        perPageLabel="Cards per page:"
                    />
                )}
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-[#12161c] rounded-[3px] border border-[#ebebeb] dark:border-slate-800 shadow-none">
            <div className="animate-in fade-in duration-300">
                {/* Header Tabs (Inside container) */}
                {headerTabs && (
                    <div className="px-4 pt-3 border-b border-[#ebebeb] dark:border-slate-800">
                        {headerTabs}
                    </div>
                )}
                
                {/* Toolbar (Polaris Style) */}
                {!hideToolbar && (
                    <TableToolbar 
                        selectedCount={selectedIds.length}
                        totalCount={totalItems}
                        onClearSelection={() => setSelectedIds([])}
                        onDeleteSelected={onDeleteSelected ? () => onDeleteSelected(selectedIds as number[]) : undefined}
                        onSelectAll={handleSelectAll}
                    >
                        <TableSearch 
                            value={search} 
                            onChange={setSearch} 
                            placeholder={searchPlaceholder} 
                        />
                        <div className="flex items-center gap-1.5">
                            <TableFilter 
                                onFilterClick={() => setShowFilters(!showFilters)} 
                                onResetClick={() => {
                                    setSearch('');
                                    setShowFilters(false);
                                }}
                                isFilterOpen={showFilters}
                                isFiltered={Boolean(search)}
                            />
                            
                            <div className="w-[1px] h-4 bg-slate-200/60 dark:bg-slate-800 mx-1"></div>

                            {!hideViewToggle && (
                                <>
                                    <div className="flex items-center border border-slate-200/80 dark:border-slate-700/60 rounded-[3px] overflow-hidden bg-slate-50/50 dark:bg-[#1e2329] shadow-none h-[32px]">
                                        <button 
                                            onClick={() => handleSwitchView('table')}
                                            className="h-[30px] px-2.5 flex items-center justify-center transition-colors bg-white dark:bg-slate-800 text-[#202223] dark:text-slate-200 shadow-2xs cursor-pointer"
                                            title="Table View"
                                        >
                                            <List size={14} />
                                        </button>
                                        <div className="w-[1px] h-[30px] bg-slate-200/80 dark:bg-slate-700/60"></div>
                                        <button 
                                            onClick={() => handleSwitchView('grid')}
                                            className="h-[30px] px-2.5 flex items-center justify-center transition-colors text-[#8c9196] dark:text-slate-400 hover:bg-white/60 dark:hover:bg-slate-800/60 hover:text-[#202223] dark:hover:text-slate-200 cursor-pointer"
                                            title="Grid View"
                                        >
                                            <LayoutGrid size={14} />
                                        </button>
                                    </div>
                                    <div className="w-[1px] h-4 bg-slate-200/60 dark:bg-slate-800 mx-1"></div>
                                </>
                            )}

                            <TableColumnToggle 
                                columns={currentColumns}
                                visibleColumns={visibleColumns}
                                onToggleColumn={toggleColumn}
                                onReorderColumns={(newOrder) => setOrderedColumnIds(newOrder)}
                            />
                        </div>
                    </TableToolbar>
                )}

                {/* Filter Content Area */}
                {showFilters && filterContent && (
                    <div className="p-4 border-b border-[#ebebeb] dark:border-slate-800 bg-[#fcfcfc] dark:bg-[#181d24] animate-in slide-in-from-top-2 duration-200">
                        {filterContent}
                    </div>
                )}

                <div className="overflow-x-auto custom-scrollbar">
                    <table className={`w-full text-left border-collapse ${tableLayout === 'fixed' ? 'table-fixed' : ''} ${tableClassName || ''}`}>
                        <thead>
                            <tr className="bg-slate-50/90 dark:bg-[#181d24] border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap">
                                <th className={`${compact ? 'px-2 py-2' : 'px-3.5 py-3'} w-[36px]`}>
                                    <div className="flex items-center justify-center">
                                        <input 
                                            type="checkbox" 
                                            checked={selectedIds.length === paginatedData.length && paginatedData.length > 0}
                                            onChange={toggleSelectAll}
                                            className="table-checkbox" 
                                        />
                                    </div>
                                </th>
                                {currentColumns.map(col => visibleColumns.includes(col.id) && (
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
                                        className={`${compact ? 'px-2 py-2' : 'px-3.5 py-3'} ${col.className || ''} ${col.sortable ? 'cursor-pointer select-none hover:text-slate-700 dark:hover:text-slate-200 transition-colors' : ''} whitespace-nowrap cursor-grab active:cursor-grabbing`}
                                        onClick={() => col.sortable && handleSort(col.id)}
                                        title="Drag to reorder column"
                                    >
                                        {col.sortable ? (
                                            <div className={`inline-flex items-center gap-0.5 whitespace-nowrap ${col.className?.includes('text-center') ? 'justify-center w-full' : ''}`}>
                                                <span className="whitespace-nowrap">{col.label}</span>
                                                <span className="shrink-0 opacity-70">
                                                    {sortKey === col.id ? (
                                                        sortDir === 'asc'
                                                            ? <ChevronUp size={11} className="text-[#ff4a1f]" />
                                                            : <ChevronDown size={11} className="text-[#ff4a1f]" />
                                                    ) : (
                                                        <ChevronsUpDown size={11} className="text-slate-400 dark:text-slate-500" />
                                                    )}
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="whitespace-nowrap">{col.label}</span>
                                        )}
                                    </th>
                                ))}
                                {actions && (
                                    <th className={`${compact ? 'px-2 py-2' : 'px-3.5 py-3'} text-right pr-3.5 sm:pr-4 whitespace-nowrap ${actionsColumnClassName || 'w-[65px] min-w-[65px] max-w-[65px]'}`}>
                                        Actions
                                    </th>
                                )}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                            {isLoading ? (
                                (paginatedData.length > 0 ? paginatedData : Array.from({ length: effectiveSkeletonCount })).map((item: any, i: number) => {
                                    const rowKey = item && keyExtractor && item.id !== undefined ? (keyExtractor(item) || i) : i;
                                    return (
                                        <tr key={rowKey} className={`transition-colors border-b border-slate-100/70 dark:border-slate-800/40 ${rowHeightClass}`}>
                                            <td className={`${cellPaddingClass} w-[36px]`}>
                                                <Skeleton className="h-[15px] w-[15px] mx-auto rounded-[3px]" />
                                            </td>
                                        {currentColumns.map(col => {
                                            if (!visibleColumns.includes(col.id)) return null;

                                            if (col.skeleton) {
                                                return (
                                                    <td key={col.id} className={`${cellPaddingClass} ${col.className || ''}`}>
                                                        {col.skeleton()}
                                                    </td>
                                                );
                                            }

                                            const colId = col.id.toLowerCase();
                                            const colLabel = col.label.toLowerCase();

                                            if (colId === 'id' || colLabel === 'id') {
                                                return (
                                                    <td key={col.id} className={`${cellPaddingClass} ${col.className || ''}`}>
                                                        <div className="flex items-center min-h-[26px]">
                                                            <Skeleton className="h-4 w-14 rounded-[3px] !bg-orange-100/70 dark:!bg-orange-950/40" />
                                                        </div>
                                                    </td>
                                                );
                                            }
                                            if (colId === 'customer' || colLabel.includes('customer') || colLabel.includes('user') || colLabel.includes('supplier')) {
                                                return (
                                                    <td key={col.id} className={`${cellPaddingClass} ${col.className || ''}`}>
                                                        <div className="flex items-center gap-2 min-h-[26px]">
                                                            <Skeleton className="w-5 h-5 rounded-full shrink-0" />
                                                            <Skeleton className="h-3.5 w-24 rounded-[3px]" />
                                                        </div>
                                                    </td>
                                                );
                                            }
                                            if (colId === 'pickup' || (colLabel.includes('pickup') && colLabel.includes('address'))) {
                                                return (
                                                    <td key={col.id} className={`${cellPaddingClass} ${col.className || ''}`}>
                                                        <div className="flex items-center min-w-0 pr-1 min-h-[26px]">
                                                            <Skeleton className="h-3.5 w-28 max-w-full rounded-[3px]" />
                                                        </div>
                                                    </td>
                                                );
                                            }
                                            if (colId === 'delivery' || (colLabel.includes('delivery') && colLabel.includes('address'))) {
                                                return (
                                                    <td key={col.id} className={`${cellPaddingClass} ${col.className || ''}`}>
                                                        <div className="flex items-center min-w-0 pr-1 min-h-[26px]">
                                                            <Skeleton className="h-3.5 w-28 max-w-full rounded-[3px]" />
                                                        </div>
                                                    </td>
                                                );
                                            }
                                            if (colLabel.includes('address') || colLabel.includes('route')) {
                                                return (
                                                    <td key={col.id} className={`${cellPaddingClass} ${col.className || ''}`}>
                                                        <div className="flex items-center min-w-0 min-h-[26px]">
                                                            <Skeleton className="h-3.5 w-28 max-w-full rounded-[3px]" />
                                                        </div>
                                                    </td>
                                                );
                                            }
                                            if (colId === 'vehicle' || colId === 'vehicletype' || colLabel.includes('vehicle')) {
                                                return (
                                                    <td key={col.id} className={`${cellPaddingClass} ${col.className || ''}`}>
                                                        <div className="flex items-center min-h-[26px]">
                                                            <Skeleton className="h-3.5 w-24 rounded-[3px]" />
                                                        </div>
                                                    </td>
                                                );
                                            }
                                            if (colId === 'transit' || colId === 'transittime' || colLabel.includes('transit')) {
                                                return (
                                                    <td key={col.id} className={`${cellPaddingClass} ${col.className || ''}`}>
                                                        <div className="flex justify-center items-center min-h-[26px]">
                                                            <Skeleton className="h-3.5 w-12 rounded-[3px]" />
                                                        </div>
                                                    </td>
                                                );
                                            }
                                            if (colId.includes('quote') || colLabel.includes('quote') || colId === 'requestid' || colLabel.includes('request id')) {
                                                return (
                                                    <td key={col.id} className={`${cellPaddingClass} ${col.className || ''}`}>
                                                        <div className="flex items-center min-h-[26px]">
                                                            <Skeleton className="h-4 w-16 rounded-[3px]" />
                                                        </div>
                                                    </td>
                                                );
                                            }
                                            if (colId === 'priority' || colLabel.includes('priority')) {
                                                return (
                                                    <td key={col.id} className={`${cellPaddingClass} ${col.className || ''}`}>
                                                        <div className="flex justify-center items-center min-h-[26px]">
                                                            <Skeleton className="h-5 w-14 rounded-[3px] !bg-amber-100/70 dark:!bg-amber-950/50" />
                                                        </div>
                                                    </td>
                                                );
                                            }
                                            if (colId === 'status' || colLabel.includes('status')) {
                                                return (
                                                    <td key={col.id} className={`${cellPaddingClass} ${col.className || ''}`}>
                                                        <div className="flex justify-center items-center min-h-[26px]">
                                                            <Skeleton className="h-5 w-20 rounded-[3px] !bg-emerald-100/70 dark:!bg-emerald-950/50" />
                                                        </div>
                                                    </td>
                                                );
                                            }
                                            if (colId === 'distance' || colLabel.includes('distance')) {
                                                return (
                                                    <td key={col.id} className={`${cellPaddingClass} ${col.className || ''}`}>
                                                        <div className="flex justify-center items-center min-h-[26px]">
                                                            <Skeleton className="h-3.5 w-14 rounded-[3px]" />
                                                        </div>
                                                    </td>
                                                );
                                            }
                                            if (colId === 'budget' || colId === 'amount' || colLabel.includes('budget') || colLabel.includes('price') || colLabel.includes('amount')) {
                                                const isCentered = col.className?.includes('text-center');
                                                const isRight = col.className?.includes('text-right');
                                                return (
                                                    <td key={col.id} className={`${cellPaddingClass} ${col.className || ''}`}>
                                                        <div className={`flex ${isCentered ? 'justify-center' : isRight ? 'justify-end' : 'items-center'} items-center min-h-[26px]`}>
                                                            <Skeleton className="h-4 w-18 rounded-[3px] !bg-emerald-100/70 dark:!bg-emerald-950/40" />
                                                        </div>
                                                    </td>
                                                );
                                            }
                                            if (colId === 'date' || colId === 'requestdate' || colLabel.includes('date')) {
                                                return (
                                                    <td key={col.id} className={`${cellPaddingClass} ${col.className || ''}`}>
                                                        <div className="flex justify-center items-center min-h-[26px]">
                                                            <Skeleton className="h-3.5 w-20 rounded-[3px]" />
                                                        </div>
                                                    </td>
                                                );
                                            }

                                            const isCentered = col.className?.includes('text-center');
                                            const isRight = col.className?.includes('text-right');

                                            return (
                                                <td key={col.id} className={`${cellPaddingClass} ${col.className || ''}`}>
                                                    <div className={`flex ${isCentered ? 'justify-center' : isRight ? 'justify-end' : 'items-center'} items-center min-h-[26px]`}>
                                                        <Skeleton className="h-3.5 w-20 rounded-[3px]" />
                                                    </div>
                                                </td>
                                            );
                                        })}
                                        {actions && (
                                            <td className={`${cellPaddingClass} whitespace-nowrap text-right pr-3.5 sm:pr-4 ${actionsColumnClassName || 'w-[65px] min-w-[65px] max-w-[65px]'}`}>
                                                <div className="flex items-center justify-end gap-1.5 w-full min-h-[26px]">
                                                    {actionsColumnClassName?.includes('180') ? (
                                                        <>
                                                            <Skeleton className="h-7 w-14 rounded-[5px]" />
                                                            <Skeleton className="h-7 w-16 rounded-[5px]" />
                                                            <Skeleton className="h-7 w-7 rounded-[5px]" />
                                                        </>
                                                    ) : actionsColumnClassName?.includes('130') || actionsColumnClassName?.includes('125') || actionsColumnClassName?.includes('115') || actionsColumnClassName?.includes('120') || actionsColumnClassName?.includes('100') ? (
                                                        <>
                                                            <Skeleton className="h-7 w-18 rounded-[5px]" />
                                                            <Skeleton className="h-7 w-7 rounded-[5px]" />
                                                        </>
                                                    ) : (
                                                        <Skeleton className="h-7 w-7 rounded-[5px]" />
                                                    )}
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                );
                            })
                            ) : paginatedData.length === 0 ? (
                                <tr>
                                    <td colSpan={currentColumns.length + (actions ? 2 : 1)} className="p-0">
                                        <div className="p-8 text-center bg-white dark:bg-[#12161c]">
                                            {emptyState ?? <EmptyState />}
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                paginatedData.map(item => {
                                    const id = keyExtractor(item);
                                    const isSelected = selectedIds.includes(id);
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
                                                className={`transition-colors group ${rowHeightClass} ${isSelected ? 'bg-orange-50/40 dark:bg-[#ff4a1f]/10' : 'hover:bg-slate-50/70 dark:hover:bg-slate-800/50'} ${expandableContent || onRowClick ? 'cursor-pointer' : ''}`}
                                            >
                                            <td className={`${cellPaddingClass} w-[36px] min-w-[36px] max-w-[36px] whitespace-nowrap`}>
                                                <div className="flex items-center justify-center">
                                                    <input 
                                                        type="checkbox" 
                                                        checked={isSelected}
                                                        onChange={() => toggleSelect(id)}
                                                        className="table-checkbox" 
                                                    />
                                                </div>
                                            </td>
                                            {currentColumns.map(col => visibleColumns.includes(col.id) && (
                                                <td key={col.id} className={`${cellPaddingClass} ${col.className?.includes('whitespace-normal') ? 'whitespace-normal break-words' : 'whitespace-nowrap'} text-[13px] text-slate-800 dark:text-slate-200 ${col.className || ''}`}>
                                                    {col.render ? col.render(item) : item[col.id]}
                                                </td>
                                            ))}
                                            {actions && (
                                                <td className={`${cellPaddingClass} whitespace-nowrap text-right pr-3.5 sm:pr-4 ${actionsColumnClassName || 'w-[65px] min-w-[65px] max-w-[65px]'}`}>
                                                    <div className="flex items-center justify-end w-full h-7">
                                                        {actions(item)}
                                                    </div>
                                                </td>
                                            )}
                                            </tr>
                                            {expandableContent && expandedRows.has(id) && (
                                                <tr className="bg-slate-50/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800">
                                                    <td colSpan={columns.length + (actions ? 2 : 1)} className="p-0 border-l-4 border-l-[#FF4A1F]">
                                                        <div className="animate-in slide-in-from-top-1 fade-in duration-200">
                                                            {expandableContent(item)}
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
                
                {/* Pagination for Table View */}
                {!hidePagination && (
                    <TablePagination 
                        total={totalItems}
                        fromIdx={totalItems > 0 ? startIndex + 1 : 0}
                        toIdx={Math.min(startIndex + activePerPage, totalItems)}
                        perPage={activePerPage}
                        currentPage={validCurrentPage}
                        totalPages={totalPages}
                        onPageChange={(p) => setCurrentPage(p)}
                        onPerPageChange={(val) => {
                            setPerPage(Number(val));
                            setCurrentPage(1);
                        }}
                        onPrevPage={() => setCurrentPage(p => Math.max(1, p - 1))}
                        onNextPage={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        hasPrev={validCurrentPage > 1}
                        hasNext={validCurrentPage < totalPages}
                        variant="table"
                    />
                )}
            </div>
        </div>
    );
}
