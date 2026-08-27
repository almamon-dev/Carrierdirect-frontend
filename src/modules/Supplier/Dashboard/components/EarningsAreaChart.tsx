import React from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { TrendingUp } from 'lucide-react';
import Select from '@/components/ui/select';
import { TimeFilter } from '../types/dashboard.types';

interface EarningsAreaChartProps {
    filter: TimeFilter;
    onFilterChange: (val: TimeFilter) => void;
    totalEarnings: string;
    chartData: Array<{ name: string; earnings: number }>;
    isLoading?: boolean;
}

export const EarningsAreaChart: React.FC<EarningsAreaChartProps> = ({
    filter,
    onFilterChange,
    totalEarnings,
    chartData,
    isLoading = false,
}) => {
    return (
        <div className="bg-white dark:bg-[#1e2329] p-4 rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4 -mx-4 px-4">
                <div className="flex items-center gap-2">
                    <TrendingUp size={16} className="text-brand" />
                    <h3 className="text-[13px] font-bold text-slate-800 dark:text-slate-200">Earnings Overview</h3>
                </div>
                <Select
                    className="w-38"
                    value={filter}
                    onChange={(val) => onFilterChange(val as TimeFilter)}
                    showSearch={false}
                    options={[
                        { id: '30_days', name: 'Last 30 Days' },
                        { id: '3_months', name: 'Last 3 Months' },
                        { id: 'this_year', name: 'This Year' },
                    ]}
                />
            </div>

            <div className="flex items-baseline gap-3 mb-4">
                {isLoading ? (
                    <div className="h-7 w-28 bg-slate-200 dark:bg-slate-700/60 rounded animate-pulse" />
                ) : (
                    <>
                        <span className="text-2xl font-bold text-slate-900 dark:text-slate-200">{totalEarnings}</span>
                        <span className="text-sm font-bold text-emerald-500">+12.5% <span className="text-slate-400 dark:text-slate-500 font-medium">vs previous 30 days</span></span>
                    </>
                )}
            </div>

            <div className="h-[220px] w-full">
                {isLoading ? (
                    <div className="w-full h-full flex flex-col justify-end gap-2 p-2 bg-slate-50/50 dark:bg-slate-800/20 rounded-lg animate-pulse">
                        <div className="w-full h-36 bg-slate-200/70 dark:bg-slate-700/30 rounded-md" />
                        <div className="flex justify-between w-full px-1">
                            {[1, 2, 3, 4, 5, 6, 7].map((k) => (
                                <div key={k} className="h-2 w-7 bg-slate-200/80 dark:bg-slate-700/40 rounded" />
                            ))}
                        </div>
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#FF4A1F" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="#FF4A1F" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.3} />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} dy={10} minTickGap={30} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} dx={-10} tickFormatter={(val) => `€${val / 1000}k`} />
                            <Tooltip
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px -2px rgba(0,0,0,0.3)', backgroundColor: '#1e2329', color: '#f8fafc' }}
                                formatter={(value) => [`€${value}`, 'Earnings']}
                            />
                            <Area type="monotone" dataKey="earnings" stroke="#FF4A1F" strokeWidth={2} dot={{ r: 3, fill: '#FF4A1F', stroke: '#ffffff', strokeWidth: 2 }} activeDot={{ r: 5 }} fillOpacity={1} fill="url(#colorEarnings)" />
                        </AreaChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
};
