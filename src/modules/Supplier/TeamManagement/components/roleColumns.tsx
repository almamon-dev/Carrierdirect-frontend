import { Column } from '@/components/tables/data-table';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Shield, Users, CheckCircle2 } from 'lucide-react';
import { RoleItem } from './RoleRowActions';

interface RoleColumnsProps {
    onSelectRole: (role: RoleItem) => void;
}

export const getRoleColumns = ({ onSelectRole }: RoleColumnsProps): Column<RoleItem>[] => [
    { 
        id: 'name', 
        label: 'Role Name', 
        className: 'w-[180px] min-w-[180px]',
        sortable: true,
        render: (row) => (
            <div 
                onClick={() => onSelectRole(row)}
                className="flex items-center gap-2 cursor-pointer group min-h-[26px]"
            >
                <Shield size={14} className="text-[#ff4a1f] shrink-0" />
                <span className="font-semibold text-slate-900 dark:text-slate-100 text-xs truncate group-hover:text-[#ff4a1f] transition-colors">
                    {row.name}
                </span>
            </div>
        ),
    },
    { 
        id: 'description', 
        label: 'Role Description', 
        className: 'min-w-[240px]',
        render: (row) => (
            <div className="flex items-center min-h-[26px] truncate" title={row.description}>
                <span className="text-xs text-slate-600 dark:text-slate-400 truncate">
                    {row.description}
                </span>
            </div>
        ),
    },
    { 
        id: 'count', 
        label: 'Assigned Members', 
        className: 'w-[140px] min-w-[140px]',
        sortable: true,
        render: (row) => (
            <div className="flex items-center min-h-[26px]">
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700 dark:text-slate-300">
                    <Users size={12} className="text-slate-400" />
                    <span>{row.count} {row.count === 1 ? 'member' : 'members'}</span>
                </span>
            </div>
        ),
    },
    { 
        id: 'permissions', 
        label: 'Access Matrix', 
        className: 'w-[140px] min-w-[140px]',
        render: (row) => {
            const count = Array.isArray(row.permissions) ? row.permissions.length : 0;
            return (
                <div className="flex items-center min-h-[26px]">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-200/60 dark:border-emerald-800/60">
                        <CheckCircle2 size={11} className="text-emerald-600" />
                        <span>{row.name.toLowerCase() === 'admin' ? 'Full access' : `${count || 'Configured'} modules`}</span>
                    </span>
                </div>
            );
        },
    },
    { 
        id: 'type', 
        label: 'Role Type', 
        className: 'w-[120px] min-w-[120px]',
        render: (row) => (
            <div className="flex items-center min-h-[26px]">
                <StatusBadge 
                    status={row.name.toLowerCase() === 'admin' ? 'Super admin' : 'Staff role'}
                    category={row.name.toLowerCase() === 'admin' ? 'action_required' : 'neutral'}
                />
            </div>
        ),
    },
];
