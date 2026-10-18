import React, { useState, useMemo } from 'react';
import Select from '@/components/ui/select';
import { BarChart2, TrendingUp } from 'lucide-react';
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';

export interface SupplierDashboardChartsRowProps {
    totalEarnings?: string | number;
    financeSummary?: any;
    quoteRequests?: any[];
    activeOrders?: any[];
    earningsFilter?: string;
    onEarningsFilterChange?: (val: any) => void;
    quoteOverviewFilter?: string;
    onQuoteOverviewFilterChange?: (val: any) => void;
    isLoading?: boolean;
}

const FILTER_OPTIONS = [
    { id: 'this_year', name: 'This Year' },
    { id: '6_months', name: 'Last 6 Months' },
    { id: '3_months', name: 'Last 3 Months' },
    { id: '30_days', name: 'Last 30 Days' },
];

const parseItemDate = (item: any): Date | null => {
    if (!item) return null;
    const raw =
        item.created_at ||
        item.order_date ||
        item.requested_at ||
        item.issue_date ||
        item.date ||
        item.updated_at;
    if (!raw) return null;
    const d = new Date(raw);
    return isNaN(d.getTime()) ? null : d;
};

export const SupplierDashboardChartsRow: React.FC<SupplierDashboardChartsRowProps> = ({
    totalEarnings = 0,
    financeSummary,
    quoteRequests = [],
    activeOrders = [],
    earningsFilter,
    onEarningsFilterChange,
    quoteOverviewFilter,
    onQuoteOverviewFilterChange,
    isLoading = false,
}) => {
    const [earningsPeriod, setEarningsPeriod] = useState<string>(earningsFilter || 'this_year');
    const [overviewPeriod, setOverviewPeriod] = useState<string>(quoteOverviewFilter || 'this_year');
    const [trendPeriod, setTrendPeriod] = useState<string>('this_year');

    // Parse raw total earnings number
    const numericTotalEarnings = useMemo(() => {
        if (typeof totalEarnings === 'number') return totalEarnings;
        if (typeof totalEarnings === 'string') {
            const cleaned = totalEarnings.replace(/[^0-9.-]+/g, '');
            return Number(cleaned) || 0;
        }
        return 0;
    }, [totalEarnings]);

    // Generate month buckets
    const getMonthsForPeriod = (period: string) => {
        const allMonths = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
        ];
        const now = new Date();
        const currentYear = now.getFullYear();

        if (period === '6_months') {
            const list = [];
            for (let i = 5; i >= 0; i--) {
                const d = new Date(currentYear, now.getMonth() - i, 1);
                list.push({
                    name: allMonths[d.getMonth()],
                    monthIdx: d.getMonth(),
                    year: d.getFullYear(),
                });
            }
            return list;
        }

        if (period === '3_months') {
            const list = [];
            for (let i = 2; i >= 0; i--) {
                const d = new Date(currentYear, now.getMonth() - i, 1);
                list.push({
                    name: allMonths[d.getMonth()],
                    monthIdx: d.getMonth(),
                    year: d.getFullYear(),
                });
            }
            return list;
        }

        return allMonths.map((name, idx) => ({
            name,
            monthIdx: idx,
            year: currentYear,
        }));
    };

    const axisStyle = {
        fill: '#94a3b8',
        fontSize: 10,
    };

    const tooltipStyle = {
        borderRadius: '4px',
        border: '1px solid #e2e8f0',
        fontSize: '12px',
        backgroundColor: '#ffffff',
        color: '#334155',
        boxShadow: '0 4px 12px -2px rgba(0,0,0,0.08)',
    };

    // 1. Earnings Overview (Bar Chart) - Real dynamic supplier earnings
    const earningsBarData = useMemo(() => {
        const months = getMonthsForPeriod(earningsPeriod);
        const now = new Date();
        const currentYear = now.getFullYear();

        return months.map((m) => {
            // Check financeSummary revenue_trend if available
            const trendItem = (financeSummary?.revenue_trend || []).find((t: any) => {
                const d = parseItemDate(t);
                if (d) return d.getMonth() === m.monthIdx && d.getFullYear() === m.year;
                const name = String(t.month || t.name || '').toLowerCase();
                return name.includes(m.name.toLowerCase());
            });

            let monthlyEarning = trendItem ? Number(trendItem.earnings || trendItem.amount || trendItem.total || 0) : 0;

            // Otherwise sum completed/delivered orders in this month
            if (monthlyEarning === 0) {
                monthlyEarning = (activeOrders || [])
                    .filter((o: any) => {
                        const d = parseItemDate(o);
                        if (!d) return false;
                        const st = (o.status || o.status_raw || '').toLowerCase();
                        const isFinished = ['completed', 'delivered', 'confirmed', 'paid'].includes(st) || !st;
                        return isFinished && d.getMonth() === m.monthIdx && d.getFullYear() === m.year;
                    })
                    .reduce((sum: number, curr: any) => sum + (Number(curr.total_amount) || Number(curr.amount) || Number(curr.price) || 0), 0);
            }

            // Attribute known total earnings to current month if all individual months were 0
            if (monthlyEarning === 0 && numericTotalEarnings > 0 && m.monthIdx === now.getMonth() && m.year === currentYear) {
                monthlyEarning = numericTotalEarnings;
            }

            return {
                name: m.name,
                earnings: monthlyEarning,
            };
        });
    }, [numericTotalEarnings, financeSummary, activeOrders, earningsPeriod]);

    // 2. Order & Quote Overview (Grouped Bar Chart)
    const orderQuoteBarData = useMemo(() => {
        const months = getMonthsForPeriod(overviewPeriod);
        const now = new Date();
        const currentYear = now.getFullYear();

        return months.map((m) => {
            let reqCount = (quoteRequests || []).filter((q: any) => {
                const d = parseItemDate(q);
                if (!d) return false;
                return d.getMonth() === m.monthIdx && d.getFullYear() === m.year;
            }).length;

            let ordCount = (activeOrders || []).filter((o: any) => {
                const d = parseItemDate(o);
                if (!d) return false;
                return d.getMonth() === m.monthIdx && d.getFullYear() === m.year;
            }).length;

            if (m.monthIdx === now.getMonth() && m.year === currentYear) {
                const undatedReqs = (quoteRequests || []).filter((q: any) => !parseItemDate(q)).length;
                const undatedOrds = (activeOrders || []).filter((o: any) => !parseItemDate(o)).length;
                reqCount += undatedReqs;
                ordCount += undatedOrds;
            }

            return {
                name: m.name,
                requests: reqCount,
                orders: ordCount,
            };
        });
    }, [quoteRequests, activeOrders, overviewPeriod]);

    // 3. Shipment / Order Trend (Line Chart)
    const orderTrendData = useMemo(() => {
        const months = getMonthsForPeriod(trendPeriod);
        const now = new Date();
        const currentYear = now.getFullYear();

        return months.map((m) => {
            let count = (activeOrders || []).filter((o: any) => {
                const d = parseItemDate(o);
                if (!d) return false;
                return d.getMonth() === m.monthIdx && d.getFullYear() === m.year;
            }).length;

            if (m.monthIdx === now.getMonth() && m.year === currentYear) {
                const undatedOrds = (activeOrders || []).filter((o: any) => !parseItemDate(o)).length;
                count += undatedOrds;
            }

            return {
                name: m.name,
                orders: count,
            };
        });
    }, [activeOrders, trendPeriod]);

    // Dynamic Y-axis domains
    const maxEarnings = useMemo(() => {
        const m = Math.max(...earningsBarData.map((d) => d.earnings), numericTotalEarnings, 0);
        return Math.max(500, Math.ceil((m * 1.15) / 250) * 250);
    }, [earningsBarData, numericTotalEarnings]);

    const maxReqOrd = useMemo(() => {
        const m = Math.max(
            ...orderQuoteBarData.map((d) => Math.max(d.requests, d.orders)),
            quoteRequests.length,
            activeOrders.length,
            0
        );
        return Math.max(5, Math.ceil((m * 1.25) / 5) * 5);
    }, [orderQuoteBarData, quoteRequests.length, activeOrders.length]);

    const maxTrend = useMemo(() => {
        const m = Math.max(...orderTrendData.map((d) => d.orders), activeOrders.length, 0);
        return Math.max(5, Math.ceil((m * 1.25) / 5) * 5);
    }, [orderTrendData, activeOrders.length]);

    const isFullYear1 = earningsBarData.length > 6;
    const isFullYear2 = orderQuoteBarData.length > 6;

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-2.5 sm:gap-3 mb-2 sm:mb-2.5">
                {[1, 2, 3].map((k) => (
                    <div
                        key={k}
                        className="bg-white dark:bg-[#1e2329] p-3.5 rounded-[4px] border border-slate-200 dark:border-slate-800 h-[260px] animate-pulse flex flex-col justify-between"
                    >
                        <div className="h-5 w-32 bg-slate-200 dark:bg-slate-700 rounded-[3px]" />
                        <div className="h-[180px] w-full bg-slate-100 dark:bg-slate-800/60 rounded-[3px]" />
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2.5 sm:gap-3 mb-2 sm:mb-2.5">
            {/* 1. Earnings Overview */}
            <div className="min-w-0 bg-white dark:bg-[#1e2329] p-3.5 sm:p-4 rounded-[4px] border border-slate-200/90 dark:border-slate-800 shadow-2xs overflow-hidden flex flex-col justify-between">
                <div>
                    <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-slate-100 dark:border-slate-800 mb-2.5">
                        <div className="flex items-start gap-2.5 min-w-0">
                            <div className="w-7 h-7 rounded-[4px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center shrink-0 mt-0.5">
                                <BarChart2 size={15} strokeWidth={2} />
                            </div>
                            <div className="min-w-0">
                                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-tight">
                                    Earnings Overview
                                </h3>
                                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 truncate">
                                    Your revenue and earnings over time.
                                </p>
                            </div>
                        </div>

                        <Select
                            className="w-32 sm:w-36 text-xs"
                            triggerClassName="h-7 text-xs rounded-[4px] bg-white dark:bg-[#18202a] border-slate-200 dark:border-slate-700 font-medium"
                            value={earningsPeriod}
                            onChange={(val) => {
                                const v = typeof val === 'object' && val !== null ? (val as any).target?.value ?? (val as any).value : val;
                                setEarningsPeriod(v);
                                onEarningsFilterChange?.(v);
                            }}
                            showSearch={false}
                            options={FILTER_OPTIONS}
                        />
                    </div>
                </div>

                <div className="h-[200px] w-full pt-1">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={earningsBarData}
                            margin={{ top: 12, right: 10, left: -15, bottom: 0 }}
                        >
                            <CartesianGrid
                                strokeDasharray="3 3"
                                vertical={false}
                                stroke="#e2e8f0"
                                opacity={0.7}
                            />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={axisStyle}
                                dy={8}
                                interval={0}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={axisStyle}
                                dx={-4}
                                domain={[0, maxEarnings]}
                                tickFormatter={(val) => `€${Number(val).toLocaleString()}`}
                            />
                            <Tooltip
                                contentStyle={tooltipStyle}
                                formatter={(val: any) => [`€${Number(val).toLocaleString()}`, 'Earnings']}
                            />
                            <Bar
                                dataKey="earnings"
                                name="Earnings"
                                fill="#3f3f46"
                                radius={[2, 2, 0, 0]}
                                barSize={isFullYear1 ? 22 : 36}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* 2. Order & Quote Overview */}
            <div className="min-w-0 bg-white dark:bg-[#1e2329] p-3.5 sm:p-4 rounded-[4px] border border-slate-200/90 dark:border-slate-800 shadow-2xs overflow-hidden flex flex-col justify-between">
                <div>
                    <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-slate-100 dark:border-slate-800 mb-2">
                        <div className="flex items-start gap-2.5 min-w-0">
                            <div className="w-7 h-7 rounded-[4px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center shrink-0 mt-0.5">
                                <BarChart2 size={15} strokeWidth={2} />
                            </div>
                            <div className="min-w-0">
                                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-tight">
                                    Order &amp; Quote Overview
                                </h3>
                                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 truncate">
                                    Available requests and active orders.
                                </p>
                            </div>
                        </div>

                        <Select
                            className="w-32 sm:w-36 text-xs"
                            triggerClassName="h-7 text-xs rounded-[4px] bg-white dark:bg-[#18202a] border-slate-200 dark:border-slate-700 font-medium"
                            value={overviewPeriod}
                            onChange={(val) => {
                                const v = typeof val === 'object' && val !== null ? (val as any).target?.value ?? (val as any).value : val;
                                setOverviewPeriod(v);
                                onQuoteOverviewFilterChange?.(v);
                            }}
                            showSearch={false}
                            options={FILTER_OPTIONS}
                        />
                    </div>

                    {/* Legend */}
                    <div className="flex items-center justify-end gap-3 px-1 mb-1">
                        <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-600 dark:text-slate-300">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#3f3f46]" />
                            <span>Requests</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-600 dark:text-slate-300">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#a1a1aa]" />
                            <span>Orders</span>
                        </div>
                    </div>
                </div>

                <div className="h-[185px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={orderQuoteBarData}
                            margin={{ top: 5, right: 10, left: -25, bottom: 0 }}
                            barGap={2}
                            barCategoryGap={isFullYear2 ? '8%' : '18%'}
                        >
                            <CartesianGrid
                                strokeDasharray="3 3"
                                vertical={false}
                                stroke="#e2e8f0"
                                opacity={0.7}
                            />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={axisStyle}
                                dy={8}
                                interval={0}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={axisStyle}
                                dx={-4}
                                domain={[0, maxReqOrd]}
                                allowDecimals={false}
                            />
                            <Tooltip contentStyle={tooltipStyle} />
                            <Bar
                                dataKey="requests"
                                name="Requests"
                                fill="#3f3f46"
                                radius={[2, 2, 0, 0]}
                                barSize={isFullYear2 ? 14 : 24}
                            />
                            <Bar
                                dataKey="orders"
                                name="Orders"
                                fill="#a1a1aa"
                                radius={[2, 2, 0, 0]}
                                barSize={isFullYear2 ? 14 : 24}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* 3. Order Delivery Trend */}
            <div className="min-w-0 bg-white dark:bg-[#1e2329] p-3.5 sm:p-4 rounded-[4px] border border-slate-200/90 dark:border-slate-800 shadow-2xs overflow-hidden flex flex-col justify-between">
                <div>
                    <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-slate-100 dark:border-slate-800 mb-2.5">
                        <div className="flex items-start gap-2.5 min-w-0">
                            <div className="w-7 h-7 rounded-[4px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center shrink-0 mt-0.5">
                                <TrendingUp size={15} strokeWidth={2} />
                            </div>
                            <div className="min-w-0">
                                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-tight">
                                    Delivery Trend
                                </h3>
                                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 truncate">
                                    Number of orders processed over time.
                                </p>
                            </div>
                        </div>

                        <Select
                            className="w-32 sm:w-36 text-xs"
                            triggerClassName="h-7 text-xs rounded-[4px] bg-white dark:bg-[#18202a] border-slate-200 dark:border-slate-700 font-medium"
                            value={trendPeriod}
                            onChange={(val) => {
                                const v = typeof val === 'object' && val !== null ? (val as any).target?.value ?? (val as any).value : val;
                                setTrendPeriod(v);
                            }}
                            showSearch={false}
                            options={FILTER_OPTIONS}
                        />
                    </div>
                </div>

                <div className="h-[200px] w-full pt-1">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={orderTrendData}
                            margin={{ top: 12, right: 15, left: -25, bottom: 0 }}
                        >
                            <CartesianGrid
                                strokeDasharray="3 3"
                                vertical={false}
                                stroke="#e2e8f0"
                                opacity={0.7}
                            />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={axisStyle}
                                dy={8}
                                interval={0}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={axisStyle}
                                dx={-4}
                                domain={[0, maxTrend]}
                                allowDecimals={false}
                            />
                            <Tooltip
                                contentStyle={tooltipStyle}
                                formatter={(val: any) => [Number(val).toLocaleString(), 'Orders']}
                            />
                            <Line
                                type="linear"
                                dataKey="orders"
                                name="Orders"
                                stroke="#3f3f46"
                                strokeWidth={2}
                                dot={{
                                    r: 3,
                                    fill: '#3f3f46',
                                    strokeWidth: 0,
                                }}
                                activeDot={{ r: 4.5 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default SupplierDashboardChartsRow;
