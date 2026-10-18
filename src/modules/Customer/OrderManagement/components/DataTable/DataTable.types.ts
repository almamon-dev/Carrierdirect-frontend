import React from 'react';
import { Column, DataTableProps } from '@/components/tables/data-table';

export type { Column, DataTableProps };

export interface OrderColumn<T = any> extends Column<T> {
    id: string;
    label: string;
    render?: (item: T) => React.ReactNode;
    skeleton?: () => React.ReactNode;
    className?: string;
    defaultHidden?: boolean;
    sortable?: boolean;
}

export interface ModularDataTableProps<T extends Record<string, any>> extends DataTableProps<T> {
    containerClassName?: string;
    emptyTitle?: string;
    emptyDescription?: string;
    emptyActionLabel?: string;
    onEmptyAction?: () => void;
}
