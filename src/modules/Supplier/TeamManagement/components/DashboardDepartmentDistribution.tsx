import React from 'react';
import { Users, Zap, CheckCircle } from 'lucide-react';
import Input from '@/components/ui/input';
import Button from '@/components/ui/button';

interface DashboardDepartmentDistributionProps {
    totalMembers: number;
    departmentDist: any[];
    quickEmail: string;
    setQuickEmail: (val: string) => void;
    quickInviteSent: boolean;
    handleQuickInvite: (e: React.FormEvent) => void;
}

export const DashboardDepartmentDistribution: React.FC<DashboardDepartmentDistributionProps> = ({
    totalMembers,
    departmentDist,
    quickEmail,
    setQuickEmail,
    quickInviteSent,
    handleQuickInvite,
}) => {
    return (
        <div className="bg-white dark:bg-[#181d24] p-3.5 rounded-lg border border-slate-200/80 dark:border-slate-800 shadow-2xs flex flex-col justify-between">
            <div>
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5 mb-2.5">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-orange-50 dark:bg-[#ff4a1f]/15 flex items-center justify-center text-[#ff4a1f]">
                            <Users size={13} />
                        </div>
                        <h3 className="text-xs font-medium text-slate-700 dark:text-slate-300">Department Distribution</h3>
                    </div>
                    <span className="text-[10.5px] font-normal text-slate-500 dark:text-slate-400">
                        {totalMembers} {totalMembers === 1 ? 'member' : 'members'}
                    </span>
                </div>

                <div className="space-y-2">
                    {departmentDist.map((dept, idx) => {
                        const Icon = dept.icon;
                        return (
                            <div key={idx}>
                                <div className="flex justify-between items-center text-[11px] mb-0.5">
                                    <span className="font-normal text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                                        <Icon size={12} className={dept.textCol} /> {dept.name}
                                    </span>
                                    <span className="font-normal text-slate-600 dark:text-slate-400 text-[11px]">
                                        {dept.count} <span className="text-slate-400 font-normal">({dept.percentage}%)</span>
                                    </span>
                                </div>
                                <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full ${dept.color} rounded-full transition-all duration-500`}
                                        style={{ width: `${dept.percentage}%` }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Quick Invite Box */}
            <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800">
                <form onSubmit={handleQuickInvite} className="bg-slate-50/70 dark:bg-slate-800/40 p-2.5 rounded border border-slate-200/70 dark:border-slate-700/60">
                    <label className="block text-[10.5px] font-normal text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1">
                        <Zap size={11} className="text-[#ff4a1f]" /> Quick Invite Staff Member
                    </label>
                    <div className="flex gap-1.5">
                        <Input
                            type="email"
                            placeholder="colleague@company.com"
                            className="h-7 text-xs bg-white dark:bg-[#12161c]"
                            value={quickEmail}
                            onChange={(e) => setQuickEmail(e.target.value)}
                            required
                        />
                        <Button type="submit" variant="primary" size="sm" className="h-7 px-2.5 text-xs shrink-0 cursor-pointer bg-[#ff4a1f] hover:bg-[#e03e15] text-white font-normal">
                            Send
                        </Button>
                    </div>
                    {quickInviteSent && (
                        <p className="text-[10px] text-emerald-600 font-normal mt-1 flex items-center gap-1">
                            <CheckCircle size={11} /> Invitation dispatched!
                        </p>
                    )}
                </form>
            </div>
        </div>
    );
};
