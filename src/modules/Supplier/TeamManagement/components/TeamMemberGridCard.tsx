import React from 'react';
import { Building2, Shield, Mail, Phone, Calendar, Clock } from 'lucide-react';
import Badge from '@/components/ui/badge';
import { TeamMember } from '../types/team.types';
import { TeamMemberRowActions } from './TeamMemberRowActions';

interface TeamMemberGridCardProps {
    member: TeamMember;
    onNavigateProfile: (member: TeamMember) => void;
    onDelete: (member: TeamMember) => void;
    onBlock: (member: TeamMember) => void;
    onUnblock: (member: TeamMember) => void;
    onResendInvite: (member: TeamMember) => void;
}

export const TeamMemberGridCard: React.FC<TeamMemberGridCardProps> = ({
    member,
    onNavigateProfile,
    onDelete,
    onBlock,
    onUnblock,
    onResendInvite,
}) => {
    return (
        <div className="bg-white dark:bg-[#181d24] rounded-md border border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 p-3.5 flex flex-col justify-between transition-all shadow-2xs group">
            <div>
                <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-slate-100 dark:border-slate-800/80">
                    <div className="flex items-center gap-2 min-w-0 pr-2">
                        <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center text-xs font-bold shrink-0">
                            {member.avatar}
                        </div>
                        <div className="min-w-0">
                            <span className="font-mono text-[10.5px] font-bold text-slate-400 dark:text-slate-500 block leading-tight">
                                {member.id}
                            </span>
                            <button
                                onClick={() => onNavigateProfile(member)}
                                className="text-xs font-semibold text-slate-900 dark:text-slate-100 hover:text-[#ff4a1f] dark:hover:text-[#ff4a1f] transition-colors truncate leading-tight mt-0.5 text-left cursor-pointer"
                                title={member.name || (member.status === "Pending" || member.status === "Invited" ? "Pending Setup" : (member.email ? member.email.split("@")[0] : "—"))}
                            >
                                {member.name || (member.status === "Pending" || member.status === "Invited" ? "Pending Setup" : (member.email ? member.email.split("@")[0] : "—"))}
                            </button>
                        </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                        <Badge
                            variant="secondary"
                            className={`whitespace-nowrap text-[10px] font-semibold border flex items-center gap-1 px-1.5 py-0.5 ${
                                member.isBlocked
                                    ? 'bg-red-50 text-red-800 border-red-200 dark:bg-red-950/40 dark:text-red-300'
                                    : (member.status || '').toLowerCase() === 'active'
                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300'
                                    : 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300'
                            }`}
                        >
                            {(member.status || '').toLowerCase() === 'active' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />}
                            {member.isBlocked && <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />}
                            {member.isBlocked ? 'Blocked' : member.status}
                        </Badge>
                        <TeamMemberRowActions
                            row={member}
                            onViewProfile={onNavigateProfile}
                            onDelete={onDelete}
                            onBlock={onBlock}
                            onUnblock={onUnblock}
                            onResendInvite={onResendInvite}
                        />
                    </div>
                </div>

                <div className="space-y-1.5 py-1 text-xs">
                    <div className="flex justify-between items-center text-[11.5px]">
                        <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                            <Shield size={12} className="text-slate-400" /> Role:
                        </span>
                        <span className="font-medium text-slate-800 dark:text-slate-200 truncate">{member.role}</span>
                    </div>
                    <div className="flex justify-between items-center text-[11.5px]">
                        <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                            <Building2 size={12} className="text-slate-400" /> Department:
                        </span>
                        <span className="font-medium text-slate-700 dark:text-slate-300 truncate">{member.department}</span>
                    </div>
                    <div className="flex justify-between items-center text-[11.5px]">
                        <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                            <Mail size={12} className="text-slate-400" /> Email:
                        </span>
                        <span className="font-normal text-slate-600 dark:text-slate-400 truncate" title={member.email}>{member.email}</span>
                    </div>
                    <div className="flex justify-between items-center text-[11.5px]">
                        <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                            <Phone size={12} className="text-slate-400" /> Phone:
                        </span>
                        <span className="font-mono text-slate-600 dark:text-slate-400 truncate">{member.phone}</span>
                    </div>
                </div>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[10.5px] text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1">
                    <Calendar size={11} /> Joined: {member.joinDate}
                </span>
                <span className="flex items-center gap-1">
                    <Clock size={11} /> Active: {member.lastLogin}
                </span>
            </div>
        </div>
    );
};
