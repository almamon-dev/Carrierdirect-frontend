import React from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { Activity } from 'lucide-react';
import Select from '@/components/ui/select';
import { TimeFilter } from '../types/dashboard.types';

interface OrderQuoteLineChartProps {
    filter: TimeFilter;
    onFilterChange: (val: TimeFilter) => void;
    chartData: Array<{ name: string; requests: number; submitted: number; won: number }>;
    isLoading?: boolean;
}

export const OrderQuoteLineChart: React.FC<OrderQuoteLineChartProps> = ({
    filter,
    onFilterChange,
    chartData,
    isLoading = false,
}) => {
    return (
        <div className="bg-white dark:bg-[#1e2329] p-4 rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4 -mx-4 px-4">
                <div className="flex items-center gap-2">
                    <Activity size={16} className="text-brand" />
                    <h3 className="text-[13px] font-bold text-slate-800 dark:text-slate-200">Order & Quote Overview</h3>
                </div>
                <Select
                    className="w-42"
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

            <div className="flex items-center gap-4 mb-4 flex-wrap">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300">
                    <span className="w-2.5 h-2.5 rounded-md bg-brand"></span> Quote Requests
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300">
                    <span className="w-2.5 h-2.5 rounded-md bg-emerald-500"></span> Quotes Submitted
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300">
                    <span className="w-2.5 h-2.5 rounded-md bg-purple-500"></span> Orders Won
                </div>
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
                        <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.3} />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                            <Tooltip
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px -2px rgba(0,0,0,0.3)', backgroundColor: '#1e2329', color: '#f8fafc' }}
                            />
                            <Line type="monotone" dataKey="requests" stroke="#FF4A1F" strokeWidth={2.5} dot={{ r: 3, strokeWidth: 1.5 }} activeDot={{ r: 5 }} name="Requests" />
                            <Line type="monotone" dataKey="submitted" stroke="#10b981" strokeWidth={2.5} dot={{ r: 3, strokeWidth: 1.5 }} activeDot={{ r: 5 }} name="Submitted" />
                            <Line type="monotone" dataKey="won" stroke="#a855f7" strokeWidth={2.5} dot={{ r: 3, strokeWidth: 1.5 }} activeDot={{ r: 5 }} name="Won" />
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
};
