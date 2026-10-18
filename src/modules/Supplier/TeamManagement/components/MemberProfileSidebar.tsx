import React from 'react';
import {
    Mail,
    Phone,
    Building,
    Shield,
    Clock,
    Trash2,
    MapPin,
    Ban,
    CheckCircle,
} from 'lucide-react';
import Badge from '@/components/ui/badge';
import { TeamMember } from '../types/team.types';

interface MemberProfileSidebarProps {
    member: TeamMember;
    isBlocked: boolean;
    onOpenBlockModal: () => void;
    onUnblock: () => void;
    onDelete: () => void;
}

export const MemberProfileSidebar: React.FC<MemberProfileSidebarProps> = ({
    member,
    isBlocked,
    onOpenBlockModal,
    onUnblock,
    onDelete,
}) => {
    return (
        <div className="w-full lg:w-[300px] xl:w-[320px] shrink-0 space-y-2.5 h-auto">
            <div className="bg-white dark:bg-[#12161c] rounded-lg border border-slate-200 dark:border-slate-800 p-3.5 space-y-3 shadow-none h-auto">
                {/* Avatar & Core Identity */}
                <div className="flex flex-col items-center text-center pb-2.5 border-b border-slate-100 dark:border-slate-800">
                    <div className="w-13 h-13 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-sm font-bold flex items-center justify-center mb-2 shadow-inner">
                        {member.avatar}
                    </div>
                    <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-tight">{member.name}</h2>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">{member.designation}</span>
                    <div className="flex items-center gap-1.5 mt-2">
                        <Badge
                            variant="secondary"
                            className={
                                isBlocked
                                    ? 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400 font-semibold text-[10.5px] px-1.5 py-0'
                                    : member.status === 'Active'
                                    ? 'bg-emerald-50 text-emerald-700 font-semibold text-[10.5px] px-1.5 py-0'
                                    : member.status === 'Pending'
                                    ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 font-semibold text-[10.5px] px-1.5 py-0'
                                    : member.status === 'On Leave'
                                    ? 'bg-blue-50 text-blue-700 font-semibold text-[10.5px] px-1.5 py-0'
                                    : 'bg-slate-100 text-slate-700 font-semibold text-[10.5px] px-1.5 py-0'
                            }
                        >
                            {isBlocked ? 'Blocked' : member.status}
                        </Badge>
                        <span className="text-[10.5px] font-bold px-1.5 py-0.5 rounded bg-orange-50 dark:bg-[#ff4a1f]/15 text-[#ff4a1f]">
                            {member.id}
                        </span>
                    </div>
                </div>

                {/* Contact Information List */}
                <div className="space-y-1.5 text-xs">
                    <div className="flex items-center justify-between py-1 border-b border-slate-100/80 dark:border-slate-800/80">
                        <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5 text-[11px]">
                            <Building size={12} className="text-slate-400" /> Department
                        </span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[155px] text-[11px]">{member.department}</span>
                    </div>

                    <div className="flex items-center justify-between py-1 border-b border-slate-100/80 dark:border-slate-800/80">
                        <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5 text-[11px]">
                            <Shield size={12} className="text-slate-400" /> System Role
                        </span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[155px] text-[11px]">{member.role}</span>
                    </div>

                    <div className="flex items-center justify-between py-1 border-b border-slate-100/80 dark:border-slate-800/80">
                        <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5 text-[11px]">
                            <Mail size={12} className="text-slate-400" /> Email
                        </span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[155px] text-[11px]">{member.email}</span>
                    </div>

                    <div className="flex items-center justify-between py-1 border-b border-slate-100/80 dark:border-slate-800/80">
                        <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5 text-[11px]">
                            <Phone size={12} className="text-slate-400" /> Phone
                        </span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200 text-[11px]">{member.phone}</span>
                    </div>

                    <div className="flex items-center justify-between py-1 border-b border-slate-100/80 dark:border-slate-800/80">
                        <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5 text-[11px]">
                            <MapPin size={12} className="text-slate-400" /> Location
                        </span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200 text-[11px]">{member.location}</span>
                    </div>

                    <div className="flex items-center justify-between py-0.5">
                        <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5 text-[11px]">
                            <Clock size={12} className="text-slate-400" /> Last Active
                        </span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200 text-[11px]">{member.lastLogin}</span>
                    </div>
                </div>

                {/* Action Buttons in Left Card */}
                <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-1.5 w-full">
                    {member.email && (
                        <a
                            href={`mailto:${member.email}`}
                            className="w-full h-8 px-3 text-xs font-semibold flex items-center justify-center gap-1.5 rounded-md bg-[#FF4A1F] text-white hover:bg-[#E03E15] active:scale-[0.99] transition-all shadow-xs cursor-pointer"
                        >
                            <Mail size={13} className="text-white" />
                            <span>Send Email</span>
                        </a>
                    )}
                    <div className="flex items-center gap-1.5 w-full">
                        {isBlocked ? (
                            <button
                                type="button"
                                onClick={onUnblock}
                                className="flex-1 h-8 px-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 rounded-md bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/60 hover:bg-emerald-100/80 dark:hover:bg-emerald-900/50 transition-colors shadow-2xs cursor-pointer"
                            >
                                <CheckCircle size={13} className="text-emerald-600 dark:text-emerald-400" />
                                <span>Unblock</span>
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={onOpenBlockModal}
                                className="flex-1 h-8 px-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 rounded-md bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/60 hover:bg-amber-100/80 dark:hover:bg-amber-900/50 transition-colors shadow-2xs cursor-pointer"
                            >
                                <Ban size={13} className="text-amber-600 dark:text-amber-400" />
                                <span>Block</span>
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={onDelete}
                            className="flex-1 h-8 px-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 rounded-md bg-red-50 text-red-800 dark:bg-red-950/40 dark:text-red-300 border border-red-200/80 dark:border-red-900/60 hover:bg-red-100/80 dark:hover:bg-red-900/50 transition-colors shadow-2xs cursor-pointer"
                        >
                            <Trash2 size={13} className="text-red-600 dark:text-red-400" />
                            <span>Delete</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
