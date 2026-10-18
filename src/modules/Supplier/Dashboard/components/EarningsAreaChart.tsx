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
    const formatYAxisTick = (val: number) => {
        if (val === 0) return '€0';
        if (val >= 1000000) return `€${(val / 1000000).toFixed(val % 1000000 === 0 ? 0 : 1)}M`;
        if (val >= 1000) return `€${(val / 1000).toFixed(val % 1000 === 0 ? 0 : 1)}k`;
        return `€${val}`;
    };

    return (
        <div
            className="bg-white dark:bg-[#1e2329] p-2.5 sm:p-3 rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-1.5 mb-1.5 -mx-2.5 px-2.5">
                <div className="flex items-center gap-1.5">
                    <TrendingUp size={14} className="text-brand" />
                    <h3 className="text-xs sm:text-[12.5px] font-bold text-slate-800 dark:text-slate-200">Earnings Overview</h3>
                </div>
                <Select
                    className="w-32 sm:w-36"
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

            <div className="flex items-baseline gap-2 mb-1">
                {isLoading ? (
                    <div className="h-5 w-20 bg-slate-200 dark:bg-slate-700/60 rounded animate-pulse" />
                ) : (
                    <>
                        <span className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-200">{totalEarnings}</span>
                        <span className="text-[11px] font-bold text-emerald-500">+12.5% <span className="text-slate-400 dark:text-slate-500 font-medium text-[10px]">vs previous 30 days</span></span>
                    </>
                )}
            </div>

            <div className="h-[115px] sm:h-[125px] w-full">
                {isLoading ? (
                    <div
                        className="w-full h-full flex flex-col justify-end gap-1.5 p-1.5 bg-slate-50/50 dark:bg-slate-800/20 rounded-lg animate-pulse">
                        <div className="w-full h-24 bg-slate-200/70 dark:bg-slate-700/30 rounded-md" />
                        <div className="flex justify-between w-full px-1">
                            {[1, 2, 3, 4, 5, 6, 7].map((k) => (
                                <div key={k} className="h-2 w-7 bg-slate-200/80 dark:bg-slate-700/40 rounded" />
                            ))}
                        </div>
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 6, right: 10, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#FF4A1F" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="#FF4A1F" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.3} />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} dy={6} minTickGap={25} />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                width={38}
                                tick={{ fill: '#94a3b8', fontSize: 10 }}
                                tickFormatter={formatYAxisTick}
                                domain={[0, (dataMax: number) => (dataMax > 0 ? Math.ceil(dataMax * 1.1) : 100)]}
                                allowDecimals={false}
                            />
                            <Tooltip
                                contentStyle={{ borderRadius: '6px', border: 'none', boxShadow: '0 4px 12px -2px rgba(0,0,0,0.3)', backgroundColor: '#1e2329', color: '#f8fafc', fontSize: '11px', padding: '4px 8px' }}
                                formatter={(value) => [`€${value}`, 'Earnings']}
                            />
                            <Area type="monotone" dataKey="earnings" stroke="#FF4A1F" strokeWidth={2} dot={{ r: 2.5, fill: '#FF4A1F', stroke: '#ffffff', strokeWidth: 1.5 }} activeDot={{ r: 4 }} fillOpacity={1} fill="url(#colorEarnings)" />
                        </AreaChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
};
