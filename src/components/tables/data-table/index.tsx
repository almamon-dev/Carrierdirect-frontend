import React, { useState, useRef, useEffect } from 'react';
import { 
    Search, SlidersHorizontal, RotateCcw, Trash2, X, LayoutGrid, List, MapPin
} from 'lucide-react';
import TablePagination from '@/components/tables/table-pagination';
import EmptyState from '@/components/tables/empty-state';
import TableSearch from '@/components/tables/table-search';
import TableFilter from '@/components/tables/table-filter';
import TableColumnToggle from '@/components/tables/table-column-toggle';
import TableToolbar from '@/components/tables/table-toolbar';
import Skeleton from '@/components/ui/skeleton';

export interface Column<T = any> {
    id: string;
    label: string;
    render?: (item: T) => React.ReactNode;
    skeleton?: () => React.ReactNode;
    className?: string;
    defaultHidden?: boolean;
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
}: DataTableProps<T>) {
    const effectiveSkeletonCount = skeletonCount ?? (data && data.length > 0 ? data.length : 3);
    const rowHeightClass = compact ? 'h-[44px]' : 'h-[50px]';
    const cellPaddingClass = compact ? 'px-2 py-2' : 'px-3.5 py-2.5';
    const [search, setSearch] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [selectedIds, setSelectedIds] = useState<(number | string)[]>([]);
    const [expandedRows, setExpandedRows] = useState<Set<number | string>>(new Set());
    const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
    
    // Initialize visible columns from localStorage if tableId is provided
    const [visibleColumns, setVisibleColumns] = useState<string[]>(() => {
        if (tableId) {
            const saved = localStorage.getItem(`table_cols_${tableId}`);
            if (saved) {
                try {
                    const parsed = JSON.parse(saved);
                    // Ensure saved columns actually exist in the current columns definition
                    const validCols = Array.isArray(parsed) ? parsed.filter((id: string) => columns.some(c => c.id === id)) : [];
                    // Also include any newly introduced columns that are not defaultHidden
                    const newCols = columns.filter(c => !c.defaultHidden && !validCols.includes(c.id)).map(c => c.id);
                    const merged = [...validCols, ...newCols];
                    if (merged.length > 0) return merged;
                } catch (e) {
                    console.error("Failed to parse saved column state", e);
                }
            }
        }
        return columns.filter(c => !c.defaultHidden).map(c => c.id);
    });

    // Save to localStorage whenever visibleColumns change
    useEffect(() => {
        if (tableId) {
            localStorage.setItem(`table_cols_${tableId}`, JSON.stringify(visibleColumns));
        }
    }, [visibleColumns, tableId]);

    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [gridLimit, setGridLimit] = useState(12);

    // Reset to page 1 when search changes
    useEffect(() => {
        setCurrentPage(1);
        setGridLimit(12);
    }, [search]);

    // Apply Search Filtering
    const filteredData = data.filter(item => {
        if (!search) return true;
        return Object.values(item).some(val => 
            String(val).toLowerCase().includes(search.toLowerCase())
        );
    });

    // Pagination Logic
    const totalItems = filteredData.length;
    const totalPages = Math.ceil(totalItems / perPage);
    const startIndex = (currentPage - 1) * perPage;
    const paginatedData = filteredData.slice(startIndex, startIndex + perPage);

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

    return (
        <div className="bg-white dark:bg-[#12161c] rounded-md border border-[#ebebeb] dark:border-slate-800 shadow-none">
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
                                    <div className="flex items-center border border-slate-200/80 dark:border-slate-700/60 rounded-md overflow-hidden bg-slate-50/50 dark:bg-[#1e2329] shadow-none">
                                        <button 
                                            onClick={() => setViewMode('table')}
                                            className={`h-[28px] px-2 flex items-center justify-center transition-colors ${viewMode === 'table' ? 'bg-white dark:bg-slate-800 text-[#202223] dark:text-slate-200' : 'text-[#8c9196] dark:text-slate-400 hover:bg-white/60 dark:hover:bg-slate-800/60 hover:text-[#202223] dark:hover:text-slate-200'}`}
                                            title="Table View"
                                        >
                                            <List size={14} />
                                        </button>
                                        <div className="w-[1px] h-[28px] bg-slate-200/80 dark:bg-slate-700/60"></div>
                                        <button 
                                            onClick={() => setViewMode('grid')}
                                            className={`h-[28px] px-2 flex items-center justify-center transition-colors ${viewMode === 'grid' ? 'bg-white dark:bg-slate-800 text-[#202223] dark:text-slate-200' : 'text-[#8c9196] dark:text-slate-400 hover:bg-white/60 dark:hover:bg-slate-800/60 hover:text-[#202223] dark:hover:text-slate-200'}`}
                                            title="Grid View"
                                        >
                                            <LayoutGrid size={14} />
                                        </button>
                                    </div>
                                    <div className="w-[1px] h-4 bg-slate-200/60 dark:bg-slate-800 mx-1"></div>
                                </>
                            )}

                            <TableColumnToggle 
                                columns={columns}
                                visibleColumns={visibleColumns}
                                onToggleColumn={toggleColumn}
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

                {/* Data View */}
                {viewMode === 'grid' ? (
                    <div className="bg-[#f8fafc] dark:bg-[#151921] border-b border-slate-200 dark:border-slate-800">
                        <div className="p-4 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                            {isLoading ? (
                                Array.from({ length: effectiveSkeletonCount }).map((_, i) => (
                                    <div key={i} className="bg-white dark:bg-[#1e2329] rounded-md border border-slate-200 dark:border-slate-800 p-4 shadow-none space-y-3">
                                        <div className="flex justify-between items-center pb-2.5 border-b border-slate-100 dark:border-slate-800">
                                            <Skeleton className="h-5 w-28 rounded-[2px]" />
                                            <Skeleton className="h-7 w-20 rounded-[2px]" />
                                        </div>
                                        <div className="space-y-2 pt-1">
                                            <Skeleton className="h-4 w-3/4 rounded-[2px]" />
                                            <Skeleton className="h-4 w-1/2 rounded-[2px]" />
                                            <Skeleton className="h-4 w-2/3 rounded-[2px]" />
                                        </div>
                                    </div>
                                ))
                            ) : filteredData.length === 0 ? (
                                <div className="col-span-full">
                                    {emptyState ?? <EmptyState />}
                                </div>
                            ) : (
                                filteredData.slice(0, gridLimit).map(item => {
                                const id = keyExtractor(item);
                                const isSelected = selectedIds.includes(id);
                                return (
                                    <div 
                                        key={id}
                                        className="bg-white dark:bg-[#1e2329] rounded-md border border-slate-200 dark:border-slate-800 p-4 shadow-2xs transition-all flex flex-col hover:shadow-xs hover:border-slate-300 dark:hover:border-slate-700"
                                    >
                                        {actions && (
                                            <div className="flex justify-end items-center mb-3 pb-2.5 border-b border-slate-100 dark:border-slate-800">
                                                <div className="flex items-center justify-end">
                                                    {actions(item)}
                                                </div>
                                            </div>
                                        )}
                                        <div className="flex-1">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                                                {columns.map(col => visibleColumns.includes(col.id) && (
                                                    <div key={col.id} className="grid grid-cols-[95px_8px_1fr] items-start">
                                                        <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{col.label}</span>
                                                        <span className="text-[11px] font-semibold text-slate-300 dark:text-slate-600">:</span>
                                                        <div className="text-[12px] text-slate-800 dark:text-slate-200 font-medium break-words">
                                                            {col.render ? col.render(item) : item[col.id]}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                        </div>
                        {filteredData.length > gridLimit && (
                            <div className="py-5 px-4 flex justify-center border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#12161c]">
                                <button 
                                    onClick={() => setGridLimit(prev => prev + 12)}
                                    className="px-5 py-2 bg-white dark:bg-[#1e2329] border border-slate-300 dark:border-slate-700 shadow-2xs rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-[#FF4A1F] hover:text-[#FF4A1F] transition-all text-[12px] font-bold text-slate-700 dark:text-slate-200 flex items-center justify-center cursor-pointer"
                                >
                                    Show More Requests
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="overflow-x-auto custom-scrollbar">
                        <table className={`w-full text-left border-collapse ${tableLayout === 'fixed' ? 'table-fixed' : ''} ${tableClassName || ''}`}>
                        <thead>
                            <tr className="bg-slate-50/90 dark:bg-[#181d24] border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
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
                                {columns.map(col => visibleColumns.includes(col.id) && (
                                    <th key={col.id} className={`${compact ? 'px-2 py-2' : 'px-3.5 py-3'} ${col.className || ''}`}>{col.label}</th>
                                ))}
                                {actions && <th className={`${compact ? 'px-2 py-2' : 'px-3.5 py-3'} text-right pr-3.5 sm:pr-4 ${actionsColumnClassName || 'w-[65px]'}`}>Actions</th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                            {isLoading ? (
                                Array.from({ length: effectiveSkeletonCount }).map((_, i) => (
                                    <tr key={i} className={`transition-colors border-b border-slate-100/70 dark:border-slate-800/40 ${rowHeightClass}`}>
                                        <td className={`${cellPaddingClass} w-[36px]`}>
                                            <Skeleton className="h-[15px] w-[15px] mx-auto rounded-[3px]" />
                                        </td>
                                        {columns.map(col => {
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
                                                        <div className="flex items-center h-5">
                                                            <Skeleton className="h-4 w-14 rounded-[2px] !bg-orange-100/70 dark:!bg-orange-950/40" />
                                                        </div>
                                                    </td>
                                                );
                                            }
                                            if (colId === 'customer' || colLabel.includes('customer') || colLabel.includes('user') || colLabel.includes('supplier')) {
                                                return (
                                                    <td key={col.id} className={`${cellPaddingClass} ${col.className || ''}`}>
                                                        <div className="flex items-center gap-2 h-5">
                                                            <Skeleton className="w-5 h-5 rounded-full shrink-0" />
                                                            <Skeleton className="h-3.5 w-24 rounded-[2px]" />
                                                        </div>
                                                    </td>
                                                );
                                            }
                                            if (colId === 'pickup' || (colLabel.includes('pickup') && colLabel.includes('address'))) {
                                                return (
                                                    <td key={col.id} className={`${cellPaddingClass} ${col.className || ''}`}>
                                                        <div className="flex items-center gap-1.5 min-w-0 pr-1 h-5">
                                                            <MapPin size={13} className="text-emerald-500 shrink-0 opacity-60" />
                                                            <Skeleton className="h-3.5 w-32 max-w-full rounded-[2px]" />
                                                        </div>
                                                    </td>
                                                );
                                            }
                                            if (colId === 'delivery' || (colLabel.includes('delivery') && colLabel.includes('address'))) {
                                                return (
                                                    <td key={col.id} className={`${cellPaddingClass} ${col.className || ''}`}>
                                                        <div className="flex items-center gap-1.5 min-w-0 pr-1 h-5">
                                                            <MapPin size={13} className="text-red-500 shrink-0 opacity-60" />
                                                            <Skeleton className="h-3.5 w-32 max-w-full rounded-[2px]" />
                                                        </div>
                                                    </td>
                                                );
                                            }
                                            if (colLabel.includes('address') || colLabel.includes('route')) {
                                                return (
                                                    <td key={col.id} className={`${cellPaddingClass} ${col.className || ''}`}>
                                                        <div className="flex items-center gap-1.5 min-w-0 h-5">
                                                            <MapPin size={13} className="text-slate-400 shrink-0 opacity-60" />
                                                            <Skeleton className="h-3.5 w-32 max-w-full rounded-[2px]" />
                                                        </div>
                                                    </td>
                                                );
                                            }
                                            if (colId.includes('quote') || colLabel.includes('quote')) {
                                                return (
                                                    <td key={col.id} className={`${cellPaddingClass} ${col.className || ''}`}>
                                                        <div className="flex justify-center items-center h-5">
                                                            <Skeleton className="h-4 w-14 rounded-[2px] !bg-orange-100/70 dark:!bg-orange-950/40" />
                                                        </div>
                                                    </td>
                                                );
                                            }
                                            if (colId === 'priority' || colLabel.includes('priority')) {
                                                return (
                                                    <td key={col.id} className={`${cellPaddingClass} ${col.className || ''}`}>
                                                        <div className="flex justify-center items-center h-5">
                                                            <Skeleton className="h-5 w-14 rounded-[2px] !bg-amber-100/70 dark:!bg-amber-950/50" />
                                                        </div>
                                                    </td>
                                                );
                                            }
                                            if (colId === 'status' || colLabel.includes('status')) {
                                                return (
                                                    <td key={col.id} className={`${cellPaddingClass} ${col.className || ''}`}>
                                                        <div className="flex justify-center items-center h-5">
                                                            <Skeleton className="h-5 w-20 rounded-[2px] !bg-emerald-100/70 dark:!bg-emerald-950/50" />
                                                        </div>
                                                    </td>
                                                );
                                            }
                                            if (colId === 'distance' || colLabel.includes('distance')) {
                                                return (
                                                    <td key={col.id} className={`${cellPaddingClass} ${col.className || ''}`}>
                                                        <div className="flex justify-center items-center h-5">
                                                            <Skeleton className="h-3.5 w-14 rounded-[2px]" />
                                                        </div>
                                                    </td>
                                                );
                                            }
                                            if (colId === 'budget' || colId === 'amount' || colLabel.includes('budget') || colLabel.includes('price')) {
                                                return (
                                                    <td key={col.id} className={`${cellPaddingClass} ${col.className || ''}`}>
                                                        <div className="flex items-center h-5">
                                                            <Skeleton className="h-4 w-16 rounded-[2px]" />
                                                        </div>
                                                    </td>
                                                );
                                            }
                                            if (colId === 'date' || colId === 'requestdate' || colLabel.includes('date')) {
                                                return (
                                                    <td key={col.id} className={`${cellPaddingClass} ${col.className || ''}`}>
                                                        <div className="flex justify-center items-center h-5">
                                                            <Skeleton className="h-3.5 w-20 rounded-[2px]" />
                                                        </div>
                                                    </td>
                                                );
                                            }

                                            return (
                                                <td key={col.id} className={`${cellPaddingClass} ${col.className || ''}`}>
                                                    <div className="flex items-center h-5">
                                                        <Skeleton className="h-3.5 w-20 rounded-[2px]" />
                                                    </div>
                                                </td>
                                            );
                                        })}
                                        {actions && (
                                            <td className={`${cellPaddingClass} text-right pr-3.5 sm:pr-4 w-[65px] min-w-[65px] max-w-[65px]`}>
                                                <div className="flex items-center justify-end w-full h-7">
                                                    <Skeleton className="h-7 w-7 rounded-[2px] ml-auto" />
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                ))
                            ) : paginatedData.length === 0 ? (
                                <tr>
                                    <td colSpan={columns.length + (actions ? 2 : 1)} className="p-0">
                                        {emptyState ?? <EmptyState />}
                                    </td>
                                </tr>
                            ) : (
                                paginatedData.map(item => {
                                    const id = keyExtractor(item);
                                    const isSelected = selectedIds.includes(id);
                                    return (
                                        <React.Fragment key={id}>
                                            <tr 
                                                onClick={() => expandableContent && toggleExpand(id)}
                                                className={`transition-colors group ${rowHeightClass} ${isSelected ? 'bg-orange-50/40 dark:bg-[#ff4a1f]/10' : 'hover:bg-slate-50/70 dark:hover:bg-slate-800/50'} ${expandableContent ? 'cursor-pointer' : ''}`}
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
                                            {columns.map(col => visibleColumns.includes(col.id) && (
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
                )}
                
                {/* Pagination */}
                {viewMode === 'table' && !hidePagination && (
                    <TablePagination 
                        total={totalItems}
                        fromIdx={totalItems > 0 ? startIndex + 1 : 0}
                        toIdx={Math.min(startIndex + perPage, totalItems)}
                        perPage={perPage}
                        onPerPageChange={(val) => {
                            setPerPage(Number(val));
                            setCurrentPage(1);
                        }}
                        onPrevPage={() => setCurrentPage(p => Math.max(1, p - 1))}
                        onNextPage={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        hasPrev={currentPage > 1}
                        hasNext={currentPage < totalPages}
                    />
                )}
            </div>
        </div>
    );
}
