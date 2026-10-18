import React from 'react';
import BaseDataTable from '@/components/tables/data-table';
import EmptyState from '@/components/tables/empty-state';
import { PackageSearch } from 'lucide-react';
import { ModularDataTableProps } from './DataTable.types';

export function DataTable<T extends Record<string, any>>({
    emptyTitle = 'No Orders Found',
    emptyDescription = 'There are no records matching your current filter criteria.',
    emptyActionLabel,
    onEmptyAction,
    emptyState,
    containerClassName = '',
    compact = true,
    ...props
}: ModularDataTableProps<T>) {
    const defaultEmptyState = emptyState || (
        <EmptyState
            icon={PackageSearch}
            title={emptyTitle}
            description={emptyDescription}
            actionLabel={emptyActionLabel}
            onAction={onEmptyAction}
        />
    );

    return (
        <div className={`w-full overflow-hidden ${containerClassName}`}>
            <BaseDataTable
                {...props}
                compact={compact}
                emptyState={defaultEmptyState}
            />
        </div>
    );
}

export default DataTable;
