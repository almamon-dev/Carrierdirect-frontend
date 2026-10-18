import React from 'react';
import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Tooltip as RechartsTooltip,
} from 'recharts';

interface ChartDataItem {
    id: string | number;
    name: string;
    shortName: string;
    value: number;
    color: string;
    area?: any;
}

interface CoverageDonutChartProps {
    chartData: ChartDataItem[];
    hoveredAreaId?: string | number | null;
    overallPercentage: number;
    activeCount: number;
    totalCount: number;
    onHoverArea?: (areaId: string | number | null) => void;
}

export function CoverageDonutChart({
    chartData,
    hoveredAreaId,
    overallPercentage,
    activeCount,
    totalCount,
    onHoverArea,
}: CoverageDonutChartProps) {
    return (
        <div className="relative w-full h-[220px] rounded-[4px] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#12161c] p-2 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <RechartsTooltip
                        content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                                const data = payload[0].payload;
                                return (
                                    <div className="bg-slate-900/95 text-white px-2.5 py-1.5 rounded-[4px] shadow-lg border border-slate-700 text-xs font-sans">
                                        <div className="font-bold flex items-center gap-1.5">
                                            <span
                                                className="w-2 h-2 rounded-full"
                                                style={{ backgroundColor: data.color }}
                                            />
                                            <span>{data.name}</span>
                                        </div>
                                        <div className="text-[11px] text-slate-300 mt-0.5 flex items-center gap-1">
                                            <span>Coverage:</span>
                                            <span className="text-[#ff4a1f] font-bold font-mono">
                                                {data.value}%
                                            </span>
                                        </div>
                                    </div>
                                );
                            }
                            return null;
                        }}
                    />
                    <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={82}
                        paddingAngle={3}
                        dataKey="value"
                        stroke="transparent"
                        onMouseEnter={(entry: any) => {
                            if (onHoverArea && entry?.id) onHoverArea(entry.id);
                        }}
                        onMouseLeave={() => {
                            if (onHoverArea) onHoverArea(null);
                        }}
                    >
                        {chartData.map((entry) => {
                            const isHovered = String(entry.id) === String(hoveredAreaId);
                            return (
                                <Cell
                                    key={entry.id}
                                    fill={entry.color}
                                    opacity={isHovered ? 1 : 0.9}
                                    stroke={isHovered ? '#0f172a' : 'transparent'}
                                    strokeWidth={isHovered ? 2 : 0}
                                    className="cursor-pointer transition-all duration-150"
                                />
                            );
                        })}
                    </Pie>
                </PieChart>
            </ResponsiveContainer>

            {/* Donut Center Display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                <span className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight leading-none font-mono">
                    {overallPercentage}%
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-1">
                    Coverage
                </span>
                <span className="text-[9.5px] font-medium text-emerald-600 dark:text-emerald-400">
                    {activeCount}/{totalCount} Active
                </span>
            </div>
        </div>
    );
}
