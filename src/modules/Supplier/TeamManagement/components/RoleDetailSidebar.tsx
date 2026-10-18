import React from 'react';
import { Shield, Users, Loader2 } from 'lucide-react';
import Input from '@/components/ui/input';

interface RoleDetailSidebarProps {
    roleName: string;
    setRoleName: (name: string) => void;
    description: string;
    setDescription: (desc: string) => void;
    assignedUsers: any[];
    isLoadingUsers: boolean;
}

export const RoleDetailSidebar: React.FC<RoleDetailSidebarProps> = ({
    roleName,
    setRoleName,
    description,
    setDescription,
    assignedUsers,
    isLoadingUsers,
}) => {
    return (
        <div className="w-full lg:w-[320px] xl:w-[340px] shrink-0 space-y-3.5 h-auto">
            {/* Role Details Form Card */}
            <div className="bg-slate-50/70 dark:bg-[#181d24] rounded-lg border border-slate-200/80 dark:border-slate-800 p-3.5 space-y-3">
                <div className="flex items-center gap-1.5 pb-2 border-b border-slate-200/70 dark:border-slate-800">
                    <Shield size={14} className="text-[#ff4a1f]" />
                    <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        Role Information
                    </h3>
                </div>

                <div className="space-y-2.5">
                    <div>
                        <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            Role Name *
                        </label>
                        <Input
                            value={roleName}
                            onChange={(e) => setRoleName(e.target.value)}
                            placeholder="e.g. Operations Specialist"
                            className="h-8 text-xs bg-white dark:bg-[#12161c]"
                        />
                    </div>

                    <div>
                        <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            Description
                        </label>
                        <textarea
                            className="w-full text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#12161c] dark:text-slate-200 rounded-md p-2 focus:outline-none focus:border-[#ff4a1f] min-h-[60px] resize-none"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe access privileges for this role..."
                        />
                    </div>
                </div>
            </div>

            {/* Assigned Members Card */}
            <div className="bg-slate-50/70 dark:bg-[#181d24] rounded-lg border border-slate-200/80 dark:border-slate-800 p-3.5 space-y-2.5">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200/70 dark:border-slate-800">
                    <div className="flex items-center gap-1.5">
                        <Users size={14} className="text-[#ff4a1f]" />
                        <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                            Assigned Staff Members
                        </h3>
                    </div>
                    <span className="text-[10px] font-bold bg-white dark:bg-[#12161c] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 px-1.5 py-0.2 rounded">
                        {assignedUsers.length}
                    </span>
                </div>

                {isLoadingUsers ? (
                    <div className="py-4 flex items-center justify-center text-slate-400 text-xs gap-1.5">
                        <Loader2 size={13} className="animate-spin text-[#ff4a1f]" /> Loading members...
                    </div>
                ) : assignedUsers.length === 0 ? (
                    <p className="text-[11px] text-slate-400 py-2 text-center">
                        No staff members currently assigned to this role.
                    </p>
                ) : (
                    <div className="space-y-1.5 max-h-[180px] overflow-y-auto">
                        {assignedUsers.map((user, idx) => (
                            <div key={user.id || idx} className="flex items-center gap-2.5 p-2 rounded bg-white dark:bg-[#12161c] border border-slate-200/60 dark:border-slate-800">
                                <div className="w-7 h-7 rounded-full bg-orange-50 dark:bg-orange-950/40 text-[#ff4a1f] flex items-center justify-center font-bold text-[11px] shrink-0">
                                    {(user.name || user.email || 'U').charAt(0).toUpperCase()}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-[11.5px] font-bold text-slate-900 dark:text-slate-100 truncate leading-none">
                                        {user.name || '-'}
                                    </p>
                                    <p className="text-[10.5px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                                        {user.email}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
