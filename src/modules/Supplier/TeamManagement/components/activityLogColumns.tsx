import { Column } from '@/components/tables/data-table';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Layers, Clock } from 'lucide-react';
import { ActivityLogItem } from './ActivityLogActions';

interface ActivityLogColumnsProps {
    onSelectLog: (log: ActivityLogItem) => void;
}

export const getActivityLogColumns = ({ onSelectLog }: ActivityLogColumnsProps): Column<ActivityLogItem>[] => [
    { 
        id: 'logCode', 
        label: 'Log ID', 
        className: 'w-[90px] min-w-[90px]',
        sortable: true,
        render: (row) => (
            <div className="flex items-center min-h-[26px]">
                <span className="font-mono text-xs font-bold text-slate-500 dark:text-slate-400">
                    {row.logCode}
                </span>
            </div>
        ),
    },
    { 
        id: 'user', 
        label: 'Staff Member', 
        className: 'w-[185px] min-w-[185px]',
        sortable: true,
        render: (row) => (
            <div className="flex items-center gap-2.5 whitespace-nowrap min-w-0 min-h-[26px]">
                <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-center text-[10px] font-bold shrink-0 shadow-2xs">
                    {row.avatar}
                </div>
                <button
                    onClick={() => onSelectLog(row)}
                    className="font-medium text-slate-900 dark:text-slate-100 text-xs hover:text-[#ff4a1f] dark:hover:text-[#ff4a1f] transition-colors truncate max-w-[135px] text-left cursor-pointer"
                    title={`${row.user} (${row.userRole})`}
                >
                    {row.user}
                </button>
            </div>
        ),
    },
    { 
        id: 'action', 
        label: 'Action Performed', 
        className: 'min-w-[210px]',
        sortable: true,
        render: (row) => (
            <div className="flex items-center min-h-[26px] min-w-0" title={row.action}>
                <span className="font-medium text-xs text-slate-800 dark:text-slate-200 truncate">
                    {row.action}
                </span>
            </div>
        ),
    },
    { 
        id: 'target', 
        label: 'Target / Resource', 
        className: 'w-[160px] min-w-[160px]',
        sortable: true,
        render: (row) => (
            <div className="flex items-center gap-1.5 min-h-[26px] min-w-0" title={row.target}>
                <Layers size={12} className="text-slate-400 shrink-0" />
                <span className="text-xs text-slate-700 dark:text-slate-300 truncate font-normal">
                    {row.target}
                </span>
            </div>
        ),
    },
    { 
        id: 'category', 
        label: 'Module', 
        className: 'w-[110px] min-w-[110px]',
        sortable: true,
        render: (row) => (
            <div className="flex items-center min-h-[26px]">
                <span className="text-xs text-slate-600 dark:text-slate-400 font-normal">
                    {row.category}
                </span>
            </div>
        ),
    },
    { 
        id: 'ipAddress', 
        label: 'IP Address', 
        className: 'w-[125px] min-w-[125px]',
        sortable: true,
        render: (row) => (
            <div className="flex items-center min-h-[26px]">
                <span className="font-mono text-xs text-slate-500 dark:text-slate-400">
                    {row.ipAddress}
                </span>
            </div>
        ),
    },
    { 
        id: 'status', 
        label: 'Outcome', 
        className: 'w-[95px] min-w-[95px] text-center',
        sortable: true,
        render: (row) => (
            <div className="flex items-center justify-center min-h-[26px]">
                <StatusBadge status={row.status} />
            </div>
        ),
    },
    { 
        id: 'time', 
        label: 'Timestamp', 
        className: 'w-[145px] min-w-[145px]',
        sortable: true,
        render: (row) => (
            <div className="flex items-center gap-1.5 min-h-[26px] text-xs text-slate-500 dark:text-slate-400 font-normal">
                <Clock size={12} className="text-slate-400 shrink-0" />
                <span>{row.time}</span>
            </div>
        ),
    },
];
