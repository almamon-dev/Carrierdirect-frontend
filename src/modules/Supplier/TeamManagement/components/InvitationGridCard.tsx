import React from 'react';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Mail, Shield, Building2, Calendar, Clock } from 'lucide-react';
import { InvitationItem } from '../types/team.types';
import { InvitationRowActions } from './InvitationRowActions';

interface InvitationGridCardProps {
    inv: InvitationItem;
    onResend: (row: InvitationItem) => void;
    onRevoke: (row: InvitationItem) => void;
}

export const InvitationGridCard: React.FC<InvitationGridCardProps> = ({ inv, onResend, onRevoke }) => (
    <div
        key={inv.id}
        className="bg-white dark:bg-[#181d24] rounded-md border border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 p-3.5 flex flex-col justify-between transition-all shadow-2xs group"
    >
        <div>
            <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center gap-2 min-w-0 pr-2">
                    <div className="w-7 h-7 rounded bg-orange-50 dark:bg-[#ff4a1f]/15 flex items-center justify-center text-[#ff4a1f] shrink-0">
                        <Mail size={14} />
                    </div>
                    <div className="min-w-0">
                        <span className="font-mono text-[10.5px] font-bold text-slate-400 dark:text-slate-500 block leading-tight">
                            {inv.id}
                        </span>
                        <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate leading-tight mt-0.5" title={inv.email}>
                            {inv.email}
                        </h4>
                    </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                    <StatusBadge status={inv.status} />
                    <InvitationRowActions
                        row={inv}
                        onResend={onResend}
                        onRevoke={onRevoke}
                    />
                </div>
            </div>

            <div className="space-y-1.5 py-1 text-xs">
                <div className="flex justify-between items-center text-[11.5px]">
                    <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <Shield size={12} className="text-slate-400" /> Role:
                    </span>
                    <span className="font-medium text-slate-800 dark:text-slate-200 truncate">{inv.role}</span>
                </div>
                <div className="flex justify-between items-center text-[11.5px]">
                    <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <Building2 size={12} className="text-slate-400" /> Department:
                    </span>
                    <span className="font-medium text-slate-700 dark:text-slate-300 truncate">{inv.department}</span>
                </div>
            </div>
        </div>

        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[10.5px] text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1">
                <Calendar size={11} /> Sent: {inv.dateSent}
            </span>
            <span className="flex items-center gap-1">
                <Clock size={11} /> Expires: {inv.expires}
            </span>
        </div>
    </div>
);
