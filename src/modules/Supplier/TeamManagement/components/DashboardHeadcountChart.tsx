import React from 'react';
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import Select from '@/components/ui/select';
import { TrendingUp } from 'lucide-react';

interface DashboardHeadcountChartProps {
    timeFilter: string;
    setTimeFilter: (val: string) => void;
    displayedGrowthData: any[];
}

export const DashboardHeadcountChart: React.FC<DashboardHeadcountChartProps> = ({
    timeFilter,
    setTimeFilter,
    displayedGrowthData,
}) => {
    return (
        <div className="lg:col-span-2 bg-white dark:bg-[#181d24] p-3.5 rounded-lg border border-slate-200/80 dark:border-slate-800 shadow-2xs flex flex-col justify-between">
            <div>
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5 mb-2.5">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-orange-50 dark:bg-[#ff4a1f]/15 flex items-center justify-center text-[#ff4a1f]">
                            <TrendingUp size={13} />
                        </div>
                        <div>
                            <h3 className="text-xs font-medium text-slate-700 dark:text-slate-300 leading-none">Headcount Growth Trend</h3>
                            <p className="text-[10.5px] text-slate-500 leading-none mt-0.5">Monthly staff additions vs active rate</p>
                        </div>
                    </div>
                    <Select
                        size="sm"
                        className="w-[115px]"
                        triggerClassName="h-7 text-xs py-0 pr-6 pl-2.5 text-slate-700 dark:text-slate-300 font-normal border-slate-200 dark:border-slate-700/80 bg-slate-50/60 dark:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-600 rounded"
                        value={timeFilter}
                        onChange={(e: any) => {
                            const val = e?.target?.value !== undefined ? e.target.value : (e?.value !== undefined ? e.value : e);
                            setTimeFilter(val);
                        }}
                        showSearch={false}
                        options={[
                            { id: 'this_month', name: 'This Month' },
                            { id: 'last_month', name: 'Last Month' },
                            { id: 'this_year', name: 'This Year' },
                        ]}
                    />
                </div>

                <div className="flex items-center gap-4 mb-2 text-xs">
                    <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#FF4A1F]" />
                        <span className="font-normal text-[11px] text-slate-600 dark:text-slate-400">Total Members</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                        <span className="font-normal text-[11px] text-slate-600 dark:text-slate-400">Active Staff</span>
                    </div>
                </div>
            </div>

            <div className="h-[150px] w-full mt-1">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={displayedGrowthData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorMembers" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#FF4A1F" stopOpacity={0.25} />
                                <stop offset="95%" stopColor="#FF4A1F" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10B981" stopOpacity={0.2} />
                                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} dy={5} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                        <Tooltip
                            contentStyle={{ borderRadius: '6px', border: 'none', backgroundColor: '#181d24', color: '#f8fafc', fontSize: '11px', padding: '6px 10px' }}
                        />
                        <Area type="monotone" dataKey="members" stroke="#FF4A1F" strokeWidth={2} dot={{ r: 3, fill: '#FF4A1F' }} fill="url(#colorMembers)" />
                        <Area type="monotone" dataKey="active" stroke="#10B981" strokeWidth={1.5} dot={{ r: 2.5, fill: '#10B981' }} fill="url(#colorActive)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
