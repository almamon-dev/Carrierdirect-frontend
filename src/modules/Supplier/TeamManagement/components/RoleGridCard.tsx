import React from 'react';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Shield, Users, CheckCircle2 } from 'lucide-react';
import { RoleItem, RoleRowActions } from './RoleRowActions';

interface RoleGridCardProps {
    role: RoleItem;
    onEdit: (role: RoleItem) => void;
    onDelete: (role: RoleItem) => void;
}

export const RoleGridCard: React.FC<RoleGridCardProps> = ({ role, onEdit, onDelete }) => {
    const isSuper = role.name.toLowerCase() === 'admin' || role.name.toLowerCase() === 'super admin';
    const count = Array.isArray(role.permissions) ? role.permissions.length : 0;

    return (
        <div
            key={role.id}
            className="bg-white dark:bg-[#181d24] rounded-md border border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 p-3.5 flex flex-col justify-between transition-all shadow-2xs group"
        >
            <div>
                <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-slate-100 dark:border-slate-800/80">
                    <div className="flex items-center gap-2 min-w-0 pr-2">
                        <div className="w-7 h-7 rounded bg-orange-50 dark:bg-[#ff4a1f]/15 flex items-center justify-center text-[#ff4a1f] shrink-0">
                            <Shield size={14} />
                        </div>
                        <div className="min-w-0">
                            <h4 
                                onClick={() => onEdit(role)}
                                className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate cursor-pointer group-hover:text-[#ff4a1f] transition-colors"
                            >
                                {role.name}
                            </h4>
                            <span className="text-[10px] text-slate-400 dark:text-slate-500">
                                {isSuper ? 'Super Admin' : 'Staff Role'}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                        <StatusBadge 
                            status={isSuper ? 'Default' : 'Custom'}
                            category={isSuper ? 'action_required' : 'neutral'}
                        />
                        <RoleRowActions
                            row={role}
                            onEdit={onEdit}
                            onDelete={onDelete}
                        />
                    </div>
                </div>

                <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2 min-h-[32px] mb-3 leading-relaxed">
                    {role.description}
                </p>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 text-[11px]">
                    <Users size={12} className="text-slate-400" />
                    <span>{role.count} {role.count === 1 ? 'member' : 'members'}</span>
                </div>
                <span className="inline-flex items-center gap-1 text-[10.5px] font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.2 rounded border border-emerald-200/60 dark:border-emerald-800/60">
                    <CheckCircle2 size={11} className="text-emerald-600" />
                    <span>{isSuper ? 'Full access' : `${count || 'Configured'} modules`}</span>
                </span>
            </div>
        </div>
    );
};
