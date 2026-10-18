import React from 'react';
import { Building2 } from 'lucide-react';
import { Column } from '@/components/tables/data-table';
import Badge from '@/components/ui/badge';
import { TeamMember } from '../types/team.types';

interface GetTeamMemberColumnsProps {
    onNavigateProfile: (member: TeamMember) => void;
}

export function getTeamMemberColumns({
    onNavigateProfile,
}: GetTeamMemberColumnsProps): Column<TeamMember>[] {
    return [
        {
            id: 'id',
            label: 'ID',
            className: 'w-[85px]',
            render: (row) => (
                <div className="flex items-center min-h-[26px]">
                    <span className="font-mono text-xs font-bold text-slate-500 dark:text-slate-400">
                        {row.id}
                    </span>
                </div>
            ),
        },
        {
            id: 'name',
            label: 'Name',
            className: 'w-[185px] min-w-[185px]',
            render: (row) => (
                <div className="flex items-center gap-2.5 whitespace-nowrap min-w-0 min-h-[26px]">
                    <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-center text-[10px] font-bold shrink-0 shadow-2xs">
                        {row.avatar}
                    </div>
                    <button
                        onClick={() => onNavigateProfile(row)}
                        className="font-medium text-slate-900 dark:text-slate-100 text-xs hover:text-[#ff4a1f] dark:hover:text-[#ff4a1f] transition-colors truncate max-w-[140px] text-left cursor-pointer"
                        title={row.name || (row.status === "Pending" || row.status === "Invited" ? "Pending Setup" : (row.email ? row.email.split("@")[0] : "—"))}
                    >
                        {row.name || (row.status === "Pending" || row.status === "Invited" ? "Pending Setup" : (row.email ? row.email.split("@")[0] : "—"))}
                    </button>
                </div>
            ),
        },
        {
            id: 'email',
            label: 'Email',
            className: 'min-w-0',
            render: (row) => (
                <div className="flex items-center min-w-0 min-h-[26px]" title={row.email}>
                    <span className="font-normal text-slate-700 dark:text-slate-300 text-xs truncate whitespace-nowrap">
                        {row.email}
                    </span>
                </div>
            ),
        },
        {
            id: 'phone',
            label: 'Phone',
            className: 'w-[125px]',
            render: (row) => (
                <div className="flex items-center min-h-[26px]">
                    <span className="whitespace-nowrap text-slate-600 dark:text-slate-400 text-xs font-mono">
                        {row.phone}
                    </span>
                </div>
            ),
        },
        {
            id: 'department',
            label: 'Department',
            className: 'w-[165px] min-w-[165px]',
            render: (row) => (
                <div className="flex items-center gap-1.5 min-h-[26px]">
                    <Building2 size={12} className="text-slate-400 shrink-0" />
                    <span className="whitespace-nowrap font-medium text-slate-700 dark:text-slate-300 text-xs truncate" title={row.department}>
                        {row.department}
                    </span>
                </div>
            ),
        },
        {
            id: 'role',
            label: 'Role',
            className: 'w-[120px] min-w-[120px]',
            render: (row) => (
                <div className="flex items-center min-h-[26px]">
                    <span className="whitespace-nowrap font-medium text-slate-800 dark:text-slate-200 text-xs">
                        {row.role}
                    </span>
                </div>
            ),
        },
        {
            id: 'status',
            label: 'Status',
            className: 'w-[95px] text-center',
            render: (row) => {
                const isBlocked = row.status === 'Blocked' || Boolean(row.isBlocked);
                const rawStatus = (row.status || 'Active').toLowerCase();
                return (
                    <div className="flex items-center justify-center min-h-[26px]">
                        <Badge
                            variant="secondary"
                            className={`whitespace-nowrap text-[10.5px] font-semibold border flex items-center gap-1 px-2 py-0.5 ${
                                isBlocked
                                    ? 'bg-red-50 text-red-800 border-red-200 dark:bg-red-950/40 dark:text-red-300'
                                    : rawStatus === 'active'
                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300'
                                    : rawStatus === 'pending' || rawStatus === 'invited'
                                    ? 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300'
                                    : 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300'
                            }`}
                        >
                            {rawStatus === 'active' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />}
                            {(rawStatus === 'pending' || rawStatus === 'invited') && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 animate-pulse" />}
                            {isBlocked && <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />}
                            {isBlocked ? 'Blocked' : row.status}
                        </Badge>
                    </div>
                );
            },
        },
        {
            id: 'lastLogin',
            label: 'Last Active',
            className: 'w-[95px] text-center',
            render: (row) => (
                <div className="flex items-center justify-center min-h-[26px]">
                    <span className="whitespace-nowrap text-slate-500 text-xs">{row.lastLogin}</span>
                </div>
            ),
        },
    ];
}
