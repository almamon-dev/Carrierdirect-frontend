import { Column } from '@/components/tables/data-table';
import Badge from '@/components/ui/badge';
import { Mail, Building2, Calendar, Clock } from 'lucide-react';
import { InvitationItem } from '../types/team.types';

export const getInvitationColumns = (): Column<InvitationItem>[] => [
    { 
        id: 'id', 
        label: 'ID', 
        className: 'w-[85px] min-w-[85px]',
        sortable: true,
        render: (row) => (
            <div className="flex items-center min-h-[26px]">
                <span className="font-mono text-xs font-bold text-slate-500 dark:text-slate-400">
                    {row.id}
                </span>
            </div>
        ),
    },
    { 
        id: 'email', 
        label: 'Recipient Email', 
        className: 'min-w-[220px]',
        sortable: true,
        render: (row) => (
            <div className="flex items-center gap-2 min-h-[26px] truncate">
                <div className="w-5 h-5 rounded-full bg-orange-50 dark:bg-[#ff4a1f]/15 text-[#ff4a1f] flex items-center justify-center text-[9.5px] font-bold shrink-0">
                    <Mail size={11} />
                </div>
                <span className="font-semibold text-xs text-slate-900 dark:text-slate-100 truncate" title={row.email}>
                    {row.email}
                </span>
            </div>
        ),
    },
    { 
        id: 'department', 
        label: 'Department', 
        className: 'w-[170px] min-w-[170px]',
        sortable: true,
        render: (row) => (
            <div className="flex items-center gap-1.5 min-h-[26px] truncate">
                <Building2 size={12} className="text-slate-400 shrink-0" />
                <span className="text-xs text-slate-700 dark:text-slate-300 truncate font-medium">
                    {row.department}
                </span>
            </div>
        ),
    },
    { 
        id: 'role', 
        label: 'Assigned Role', 
        className: 'w-[140px] min-w-[140px]',
        sortable: true,
        render: (row) => (
            <div className="flex items-center min-h-[26px]">
                <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
                    {row.role}
                </span>
            </div>
        ),
    },
    { 
        id: 'dateSent', 
        label: 'Date Sent', 
        className: 'w-[125px] min-w-[125px]',
        sortable: true,
        render: (row) => (
            <div className="flex items-center gap-1.5 min-h-[26px] text-xs text-slate-500 dark:text-slate-400 font-normal">
                <Calendar size={12} className="text-slate-400 shrink-0" />
                <span>{row.dateSent}</span>
            </div>
        ),
    },
    { 
        id: 'expires', 
        label: 'Expires On', 
        className: 'w-[130px] min-w-[130px]',
        sortable: true,
        render: (row) => (
            <div className="flex items-center gap-1.5 min-h-[26px] text-xs text-slate-500 dark:text-slate-400 font-normal">
                <Clock size={12} className="text-slate-400 shrink-0" />
                <span>{row.expires}</span>
            </div>
        ),
    },
    { 
        id: 'status', 
        label: 'Status', 
        className: 'w-[100px] min-w-[100px]',
        sortable: true,
        render: (row) => (
            <div className="flex items-center min-h-[26px]">
                <Badge variant="secondary" className={
                    row.status === 'Pending' ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 font-semibold text-[10.5px] border border-amber-200/60 dark:border-amber-800/60' :
                    row.status === 'Accepted' ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-semibold text-[10.5px] border border-emerald-200/60 dark:border-emerald-800/60' :
                    'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 font-semibold text-[10.5px] border border-red-200/60 dark:border-red-800/60'
                }>
                    {row.status}
                </Badge>
            </div>
        ),
    },
];
