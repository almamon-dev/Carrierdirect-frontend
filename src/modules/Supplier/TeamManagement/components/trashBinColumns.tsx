import React from 'react';
import { Column } from '@/components/tables/data-table';
import { TrashedMember } from './TrashBinRowActions';

export function getTrashBinColumns(): Column<TrashedMember>[] {
    return [
        {
            id: 'employee_id',
            label: 'ID',
            className: 'w-[85px]',
            render: (row) => (
                <span className="font-mono text-xs font-bold text-slate-500 dark:text-slate-400">
                    {row.employee_id}
                </span>
            ),
        },
        {
            id: 'name',
            label: 'Name',
            className: 'w-[180px]',
            render: (row) => (
                <div className="flex items-center gap-2 whitespace-nowrap min-w-0">
                    <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center text-[9.5px] font-bold shrink-0">
                        {(row.name || 'SM').slice(0, 2).toUpperCase()}
                    </div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs truncate max-w-[120px]" title={row.name}>
                        {row.name}
                    </span>
                </div>
            ),
        },
        {
            id: 'email',
            label: 'Email Address',
            render: (row) => (
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate" title={row.email}>
                    {row.email}
                </span>
            ),
        },
        {
            id: 'role_name',
            label: 'Role',
            className: 'w-[130px]',
            render: (row) => (
                <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                    {row.role_name || '-'}
                </span>
            ),
        },
        {
            id: 'deleted_at',
            label: 'Deleted Date',
            className: 'w-[160px]',
            render: (row) => (
                <div className="flex flex-col text-[11.5px] text-slate-500">
                    <span>{row.deleted_at}</span>
                    <span className="text-[10px] text-slate-400">{row.deleted_at_human}</span>
                </div>
            ),
        },
    ];
}
