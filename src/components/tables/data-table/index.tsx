import React, { useState, useRef, useEffect } from 'react';
import { 
    Search, SlidersHorizontal, RotateCcw, Trash2, X, LayoutGrid, List
} from 'lucide-react';
import TablePagination from '@/components/tables/table-pagination';
import EmptyState from '@/components/tables/empty-state';
import TableSearch from '@/components/tables/table-search';
import TableFilter from '@/components/tables/table-filter';
import TableColumnToggle from '@/components/tables/table-column-toggle';
import TableToolbar from '@/components/tables/table-toolbar';

export interface Column<T = any> {
    id: string;
    label: string;
    render?: (item: T) => React.ReactNode;
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
    hidePagination = false
}: DataTableProps<T>) {
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
                    const validCols = parsed.filter((id: string) => columns.some(c => c.id === id));
                    if (validCols.length > 0) return validCols;
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
        <div className="bg-white rounded-[4px] border border-[#ebebeb] shadow-[0_1px_3px_0_rgba(0,0,0,0.1)]">
            <div className="animate-in fade-in duration-300">
                {/* Header Tabs (Inside container) */}
                {headerTabs && (
                    <div className="px-4 pt-3 border-b border-[#ebebeb]">
                        {headerTabs}
                    </div>
                )}
                
                {/* Toolbar (Polaris Style) */}
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
                            onResetClick={() => {}} 
                        />
                        
                        <div className="w-[1px] h-4 bg-[#ebebeb] mx-1"></div>

                        {!hideViewToggle && (
                            <>
                                <div className="flex items-center border border-[#d1d1d1] rounded-[3px] overflow-hidden bg-white shadow-sm">
                                    <button 
                                        onClick={() => setViewMode('table')}
                                        className={`h-[28px] px-2 flex items-center justify-center transition-colors ${viewMode === 'table' ? 'bg-[#f4f6f8] text-[#202223] shadow-inner' : 'text-[#8c9196] hover:bg-[#fafbfc] hover:text-[#202223]'}`}
                                        title="Table View"
                                    >
                                        <List size={14} />
                                    </button>
                                    <div className="w-[1px] h-[28px] bg-[#d1d1d1]"></div>
                                    <button 
                                        onClick={() => setViewMode('grid')}
                                        className={`h-[28px] px-2 flex items-center justify-center transition-colors ${viewMode === 'grid' ? 'bg-[#f4f6f8] text-[#202223] shadow-inner' : 'text-[#8c9196] hover:bg-[#fafbfc] hover:text-[#202223]'}`}
                                        title="Grid View"
                                    >
                                        <LayoutGrid size={14} />
                                    </button>
                                </div>
                                <div className="w-[1px] h-4 bg-[#ebebeb] mx-1"></div>
                            </>
                        )}

                        <TableColumnToggle 
                            columns={columns}
                            visibleColumns={visibleColumns}
                            onToggleColumn={toggleColumn}
                        />
                    </div>
                </TableToolbar>

                {/* Filter Content Area */}
                {showFilters && filterContent && (
                    <div className="p-4 border-b border-[#ebebeb] bg-[#fcfcfc] animate-in slide-in-from-top-2 duration-200">
                        {filterContent}
                    </div>
                )}

                {/* Data View */}
                {viewMode === 'grid' ? (
                    <div className="bg-[#f4f6f8] border-b border-[#ebebeb]">
                        <div className="p-4 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                            {filteredData.length === 0 ? (
                                <div className="col-span-full">
                                    <EmptyState />
                                </div>
                            ) : (
                                filteredData.slice(0, gridLimit).map(item => {
                                const id = keyExtractor(item);
                                const isSelected = selectedIds.includes(id);
                                return (
                                    <div 
                                        key={id}
                                        className={`bg-white rounded-[4px] border p-3 shadow-sm transition-all flex flex-col ${isSelected ? 'border-[#008060] ring-1 ring-[#008060]' : 'border-[#d1d1d1]'}`}
                                    >
                                        <div className="flex justify-end items-start mb-2 pb-2 border-b border-[#ebebeb]">
                                            {actions && (
                                                <div className="flex items-center justify-end">
                                                    {actions(item)}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5">
                                                {columns.map(col => visibleColumns.includes(col.id) && (
                                                    <div key={col.id} className="grid grid-cols-[90px_8px_1fr] items-start">
                                                        <span className="text-[11px] font-semibold text-[#8c9196]">{col.label}</span>
                                                        <span className="text-[11px] font-semibold text-[#8c9196]">:</span>
                                                        <div className="text-[12px] text-[#202223] font-medium break-words">
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
                            <div className="py-6 px-4 flex justify-center border-t border-[#ebebeb] bg-[#fcfcfc]">
                                <button 
                                    onClick={() => setGridLimit(prev => prev + 12)}
                                    className="px-6 py-2 bg-white border border-[#d1d1d1] shadow-sm rounded-[3px] hover:bg-[#f6f6f7] hover:border-[#a1a1a1] transition-all text-[13px] font-bold text-[#202223] flex items-center justify-center"
                                >
                                    Show More Requests
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#f9fafb] border-b border-[#ebebeb] text-[12px] font-semibold text-[#6d7175]">
                                <th className={`${compact ? 'px-2 py-1.5' : 'px-3 py-2'} w-[40px]`}>
                                    <div className="flex items-center justify-center">
                                        <input 
                                        type="checkbox" 
                                        checked={selectedIds.length === paginatedData.length && paginatedData.length > 0}
                                        onChange={toggleSelectAll}
                                        className="w-4 h-4 text-[#008060] border-[#d1d1d1] rounded-[2px] focus:ring-[#008060] cursor-pointer" />
                                                </div>
                                </th>
                                {columns.map(col => visibleColumns.includes(col.id) && (
                                    <th key={col.id} className={`${compact ? 'px-2 py-1.5' : 'px-3 py-2'} ${col.className || ''}`}>{col.label}</th>
                                ))}
                                {actions && <th className={`${compact ? 'px-2 py-1.5' : 'px-3 py-2'} text-right`}>Actions</th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#ebebeb]">
                            {paginatedData.length === 0 ? (
                                <tr>
                                    <td colSpan={columns.length + (actions ? 2 : 1)} className="p-0">
                                        <EmptyState />
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
                                                className={`transition-colors group ${isSelected ? 'bg-[#f4f6f8]' : 'hover:bg-[#f9fafb]'} ${expandableContent ? 'cursor-pointer' : ''}`}
                                            >
                                            <td className={`${compact ? 'px-2 py-1.5' : 'px-3 py-2.5'} whitespace-nowrap`}>
                                                <div className="flex items-center justify-center">
                                                    <input 
                                                    type="checkbox" 
                                                    checked={isSelected}
                                                    onChange={() => toggleSelect(id)}
                                                    className="w-4 h-4 text-[#008060] border-[#d1d1d1] rounded-[2px] focus:ring-[#008060] cursor-pointer" />
                                                </div>
                                            </td>
                                            {columns.map(col => visibleColumns.includes(col.id) && (
                                                <td key={col.id} className={`${compact ? 'px-2 py-1.5' : 'px-3 py-2.5'} whitespace-nowrap text-[13px] text-[#202223] ${col.className || ''}`}>
                                                    {col.render ? col.render(item) : item[col.id]}
                                                </td>
                                            ))}
                                            {actions && (
                                                <td className={`${compact ? 'px-2 py-1.5' : 'px-3 py-2.5'} whitespace-nowrap text-right`}>
                                                    <div className="flex justify-end">
                                                        {actions(item)}
                                                    </div>
                                                </td>
                                            )}
                                                                                    </tr>
                                            {expandableContent && expandedRows.has(id) && (
                                                <tr className="bg-[#fafbfc] border-b border-[#ebebeb] shadow-inner">
                                                    <td colSpan={columns.length + (actions ? 2 : 1)} className="p-0 border-l-4 border-l-indigo-500">
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
