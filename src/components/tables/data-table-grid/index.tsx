import React from 'react';
import { Column } from '../data-table';
import Skeleton from '@/components/ui/skeleton';
import EmptyState from '../empty-state';

export interface DataTableGridProps<T = any> {
    data: T[];
    columns: Column<T>[];
    visibleColumns: string[];
    selectedIds: (number | string)[];
    toggleSelect: (id: number | string) => void;
    keyExtractor: (item: T) => number | string;
    actions?: (item: T) => React.ReactNode;
    onDeleteSelected?: (selectedIds: number[]) => void;
    onRowClick?: (item: T) => void;
    isLoading?: boolean;
    skeletonCount?: number;
    emptyState?: React.ReactNode;
    renderCard?: (item: T, isSelected: boolean, toggleSelect: (id: number | string) => void) => React.ReactNode;
    compact?: boolean;
}

export function DataTableGrid<T extends Record<string, any>>({
    data,
    columns,
    visibleColumns,
    selectedIds,
    toggleSelect,
    keyExtractor,
    actions,
    onDeleteSelected,
    onRowClick,
    isLoading = false,
    skeletonCount = 6,
    emptyState,
    renderCard,
    compact = true,
}: DataTableGridProps<T>) {
    if (isLoading) {
        return (
            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ${compact ? 'gap-3 md:gap-3.5 pt-3' : 'gap-4 md:gap-4.5 pt-4'}`}>
                {Array.from({ length: skeletonCount }).map((_, i) => (
                    <div
                        key={i}
                        className={`bg-white dark:bg-[#1e2329] rounded-[3px] border border-slate-200/90 dark:border-slate-800 shadow-none ${
                            compact ? 'p-3 space-y-2' : 'p-4 space-y-3'
                        }`}
                    >
                        <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800/60">
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-3.5 w-3.5 rounded-[2px]" />
                                <Skeleton className="h-3.5 w-16 rounded-[2px]" />
                            </div>
                            <Skeleton className="h-5 w-5 rounded-[2px]" />
                        </div>
                        <div className={compact ? 'space-y-1.5 pt-0.5' : 'space-y-2 pt-0.5'}>
                            {Array.from({ length: 7 }).map((_, r) => (
                                <div key={r} className="grid grid-cols-[115px_10px_1fr] items-center gap-1">
                                    <Skeleton className="h-3 w-20 rounded-[2px]" />
                                    <span className="text-slate-300 dark:text-slate-600 text-center font-bold text-[10px] select-none">:</span>
                                    <Skeleton className="h-3 w-full max-w-[140px] rounded-[2px]" />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className="bg-white dark:bg-[#12161c] rounded-[3px] border border-[#ebebeb] dark:border-slate-800 p-8 text-center my-4">
                {emptyState ?? <EmptyState />}
            </div>
        );
    }

    // Find primary ID column if present to feature in the card header
    const primaryIdCol = columns.find(
        (c) => (c.id === 'id' || c.id === 'requestId' || c.id === 'code') && visibleColumns.includes(c.id)
    );

    return (
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ${compact ? 'gap-3 md:gap-3.5 pt-3' : 'gap-4 md:gap-4.5 pt-4'}`}>
            {data.map((item) => {
                const id = keyExtractor(item);
                const isSelected = selectedIds.includes(id);

                if (renderCard) {
                    return (
                        <React.Fragment key={id}>
                            {renderCard(item, isSelected, toggleSelect)}
                        </React.Fragment>
                    );
                }

                return (
                    <div
                        key={id}
                        onClick={(e) => {
                            if ((e.target as HTMLElement).closest('button, a, input, select, [role="button"], [data-no-click]')) {
                                return;
                            }
                            if (onRowClick) {
                                onRowClick(item);
                            }
                        }}
                        className={`bg-white dark:bg-[#1e2329] rounded-[3px] border border-slate-200/90 dark:border-slate-800 shadow-none flex flex-col justify-between ${
                            compact ? 'p-3' : 'p-4'
                        } ${onRowClick ? 'cursor-pointer' : ''}`}
                    >
                        {/* Card Top: Checkbox, Primary ID & Actions */}
                        {(actions || onDeleteSelected || primaryIdCol) && (
                            <div
                                className={`flex justify-between items-center border-b border-slate-100 dark:border-slate-800/60 ${
                                    compact ? 'mb-2 pb-1.5' : 'mb-3 pb-2.5'
                                }`}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="flex items-center gap-2 min-w-0">
                                    {onDeleteSelected && (
                                        <input
                                            type="checkbox"
                                            checked={isSelected}
                                            onChange={() => toggleSelect(id)}
                                            className="table-checkbox shrink-0 scale-95"
                                        />
                                    )}
                                    {primaryIdCol && (
                                        <div className="min-w-0 truncate">
                                            {primaryIdCol.render ? primaryIdCol.render(item) : (
                                                <span className="font-bold text-[#ff4a1f] text-[11.5px] leading-none">
                                                    {item[primaryIdCol.id]}
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>
                                {actions && (
                                    <div className="flex items-center justify-end shrink-0 pl-2 scale-95">
                                        {actions(item)}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Card Details: Compact, perfectly aligned Key : Value rows with automatic line breaking */}
                        <div className={`flex-1 ${compact ? 'space-y-1.5 py-0' : 'space-y-2.5 py-0.5'}`}>
                            {columns.map((col) => {
                                if (
                                    !visibleColumns.includes(col.id) ||
                                    col.id === 'actions' ||
                                    !col.label ||
                                    (primaryIdCol && col.id === primaryIdCol.id)
                                ) {
                                    return null;
                                }

                                return (
                                    <div
                                        key={col.id}
                                        className={`grid grid-cols-[115px_10px_1fr] items-start min-w-0 ${
                                            compact ? 'text-[11.5px] leading-snug py-0' : 'text-[12px] leading-relaxed py-0.5'
                                        }`}
                                    >
                                        <span
                                            className="text-slate-500 dark:text-slate-400 font-medium text-left pt-0.5 break-words whitespace-normal leading-tight pr-1"
                                            title={col.label}
                                        >
                                            {col.label}
                                        </span>
                                        <span className="text-slate-400 dark:text-slate-500 font-bold text-center select-none shrink-0 pt-0.5 text-[11px]">
                                            :
                                        </span>
                                        <div className="font-semibold text-slate-800 dark:text-slate-100 min-w-0 flex-1 text-left pl-1">
                                            {col.render ? col.render(item) : (item[col.id] !== undefined && item[col.id] !== null ? String(item[col.id]) : '-')}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default DataTableGrid;
