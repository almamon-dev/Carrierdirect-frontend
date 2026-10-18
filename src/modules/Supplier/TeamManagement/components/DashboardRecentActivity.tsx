import React from 'react';
import { UserPlus, Mail, Clock, Activity } from 'lucide-react';

interface DashboardRecentActivityProps {
    recentInvitations: any[];
    recentLogs: any[];
}

export const DashboardRecentActivity: React.FC<DashboardRecentActivityProps> = ({
    recentInvitations,
    recentLogs,
}) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {/* Recent Invitations */}
            <div className="bg-white dark:bg-[#181d24] p-3.5 rounded-lg border border-slate-200/80 dark:border-slate-800 shadow-2xs flex flex-col">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2 mb-2.5">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-orange-50 dark:bg-[#ff4a1f]/15 flex items-center justify-center text-[#ff4a1f]">
                            <UserPlus size={13} />
                        </div>
                        <h3 className="text-xs font-medium text-slate-700 dark:text-slate-300">Recent Invitations Sent</h3>
                    </div>
                </div>

                <div className="space-y-1.5">
                    {recentInvitations.length === 0 ? (
                        <p className="text-[11px] text-slate-400 py-3 text-center">No pending invitations</p>
                    ) : (
                        recentInvitations.map((inv, idx) => (
                            <div key={idx} className="flex justify-between items-center p-2 rounded border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30">
                                <div className="flex items-center gap-2.5 min-w-0 pr-2">
                                    <div className="w-6 h-6 rounded bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                                        <Mail size={12} />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-normal text-slate-800 dark:text-slate-200 text-xs truncate">{inv.email}</p>
                                        <p className="text-[10.5px] text-slate-500 truncate">{inv.role?.name || inv.role || 'Staff'} • Sent recently</p>
                                    </div>
                                </div>
                                <span className="text-[10.5px] font-normal text-amber-600 dark:text-amber-400 shrink-0">
                                    {inv.status || 'Pending'}
                                </span>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Audit Activity */}
            <div className="bg-white dark:bg-[#181d24] p-3.5 rounded-lg border border-slate-200/80 dark:border-slate-800 shadow-2xs flex flex-col">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2 mb-2.5">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-orange-50 dark:bg-[#ff4a1f]/15 flex items-center justify-center text-[#ff4a1f]">
                            <Clock size={13} />
                        </div>
                        <h3 className="text-xs font-medium text-slate-700 dark:text-slate-300">Audit Stream & Live Log</h3>
                    </div>
                </div>

                <div className="space-y-1.5">
                    {recentLogs.length === 0 ? (
                        <p className="text-[11px] text-slate-400 py-3 text-center">No recent activity logged</p>
                    ) : (
                        recentLogs.map((log, idx) => (
                            <div key={idx} className="flex justify-between items-center p-2 rounded border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30">
                                <div className="flex items-center gap-2.5 min-w-0">
                                    <div className="w-6 h-6 rounded bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                                        <Activity size={12} />
                                    </div>
                                    <p className="text-xs text-slate-600 dark:text-slate-400 min-w-0 truncate">
                                        <span className="text-slate-800 dark:text-slate-200 font-normal">{log.user?.name || log.actor || 'User'}</span> {log.action || 'performed action'}
                                    </p>
                                </div>
                                <span className="text-[10px] font-normal text-slate-400 shrink-0 ml-2">Just now</span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};
