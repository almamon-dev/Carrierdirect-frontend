import React from "react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import Badge from "@/components/ui/badge";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

interface EarningsChartSectionProps {
    revenueTrend: any[];
    stats: any;
}

export function EarningsChartSection({ revenueTrend, stats }: EarningsChartSectionProps) {
    const chartData = revenueTrend.length > 0 ? revenueTrend : [
        { name: "Week 1", earnings: 0 },
        { name: "Week 2", earnings: 0 },
        { name: "Week 3", earnings: 0 },
        { name: "Current", earnings: stats?.this_month ? parseFloat(String(stats.this_month).replace(/[^0-9.-]+/g, "")) : 0 },
    ];

    return (
        <Card className="xl:col-span-1 flex flex-col min-h-[300px] border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1a1f26] shadow-2xs rounded-md overflow-hidden">
            <CardHeader className="py-3 px-4 bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 flex flex-row items-center justify-between">
                <CardTitle className="text-xs font-bold text-slate-900 dark:text-slate-100">Revenue Trend</CardTitle>
                <Badge variant="secondary" className="bg-orange-50 text-[#ff4a1f] font-semibold text-[10px]">Live</Badge>
            </CardHeader>
            <div className="p-4 flex-1 flex flex-col justify-between">
                <div className="flex-1 w-full h-[220px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#ff4a1f" stopOpacity={0.25} />
                                    <stop offset="95%" stopColor="#ff4a1f" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: "#64748b", fontSize: 10 }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: "#64748b", fontSize: 10 }}
                                tickFormatter={(value) => `€${value >= 1000 ? (value / 1000) + "k" : value}`}
                            />
                            <Tooltip
                                contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "12px", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                                formatter={(value: number) => [`€${value.toLocaleString()}`, "Earnings"]}
                            />
                            <Area
                                type="monotone"
                                dataKey="earnings"
                                stroke="#ff4a1f"
                                strokeWidth={2}
                                fillOpacity={1}
                                fill="url(#colorEarnings)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </Card>
    );
}
