import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const GRAPH_DATA = [
    { name: 'Jul 1', jobs: 2 },
    { name: 'Jul 5', jobs: 5 },
    { name: 'Jul 10', jobs: 3 },
    { name: 'Jul 15', jobs: 8 },
    { name: 'Jul 20', jobs: 6 },
    { name: 'Jul 25', jobs: 4 },
    { name: 'Jul 30', jobs: 7 },
];

export const CalendarVolumeChart: React.FC = () => {
    return (
        <Card className="lg:col-span-1 flex flex-col shadow-sm border-slate-200">
            <CardHeader className="border-b border-slate-100 py-2.5 px-3">
                <CardTitle className="text-[13px] flex items-center gap-2">
                    <TrendingUp size={14} className="text-brand" />
                    Booking Volume
                </CardTitle>
            </CardHeader>
            <CardContent className="p-3 flex-1 flex flex-col">
                <p className="text-[10px] text-slate-500 mb-3 leading-tight">
                    Visualizes assigned jobs this month. Peaks indicate near full capacity.
                </p>

                <div className="bg-brand-light/50 border border-indigo-100 rounded-md p-2 mb-3 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-indigo-900">Peak Volume Date</span>
                    <span className="text-[11px] font-bold text-indigo-700">July 15th (8 Jobs)</span>
                </div>

                <div className="flex-1 min-h-[140px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={GRAPH_DATA} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorJobs" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#FF4A1F" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="#FF4A1F" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '6px', fontSize: '11px', color: '#fff' }}
                                itemStyle={{ color: '#fff' }}
                            />
                            <Area type="monotone" dataKey="jobs" stroke="#FF4A1F" strokeWidth={2} fillOpacity={1} fill="url(#colorJobs)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
};
