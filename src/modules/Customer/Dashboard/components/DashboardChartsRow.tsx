import React, { useState, useMemo } from "react";
import Select from "@/components/ui/select";
import { BarChart2, TrendingUp } from "lucide-react";
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
} from "recharts";

export interface DashboardChartsRowProps {
  totalSpending: number;
  spendFilter?: "30_days" | "3_months" | "this_year" | "6_months" | string;
  onSpendFilterChange?: (val: any) => void;
  spendChartData?: any[];
  overviewFilter?: "30_days" | "3_months" | "this_year" | "6_months" | string;
  onOverviewFilterChange?: (val: any) => void;
  orderQuoteChartData?: any[];
  quoteRequestsCount?: number;
  totalQuotesReceived?: number;
  ordersCount?: number;
  orders?: any[];
  quoteRequests?: any[];
  invoices?: any[];
}

const FILTER_OPTIONS = [
  { id: "this_year", name: "This Year" },
  { id: "6_months", name: "Last 6 Months" },
  { id: "3_months", name: "Last 3 Months" },
  { id: "30_days", name: "Last 30 Days" },
];

// Helper to safely parse dates from various API response shapes
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

export const DashboardChartsRow: React.FC<DashboardChartsRowProps> = ({
  totalSpending = 0,
  spendFilter,
  onSpendFilterChange,
  overviewFilter,
  onOverviewFilterChange,
  quoteRequestsCount = 0,
  ordersCount = 0,
  orders = [],
  quoteRequests = [],
  invoices = [],
}) => {
  // Default to "this_year" so all 12 months (Jan to Dec) are shown by default
  const [spendingPeriod, setSpendingPeriod] = useState<string>(spendFilter || "this_year");
  const [overviewPeriod, setOverviewPeriod] = useState<string>(overviewFilter || "this_year");
  const [trendPeriod, setTrendPeriod] = useState<string>("this_year");

  // Helper to generate months based on period filter (defaults to full 12 months: Jan to Dec)
  const getMonthsForPeriod = (period: string) => {
    const allMonths = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];
    const now = new Date();
    const currentYear = now.getFullYear();

    if (period === "6_months") {
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

    if (period === "3_months") {
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

    // Default: This Year (Full 12 Months: Jan to Dec)
    return allMonths.map((name, idx) => ({
      name,
      monthIdx: idx,
      year: currentYear,
    }));
  };

  // Common styling tokens
  const axisStyle = {
    fill: "#94a3b8",
    fontSize: 10,
  };

  const tooltipStyle = {
    borderRadius: "4px",
    border: "1px solid #e2e8f0",
    fontSize: "12px",
    backgroundColor: "#ffffff",
    color: "#334155",
    boxShadow: "0 4px 12px -2px rgba(0,0,0,0.08)",
  };

  // 1. Spending Overview (Bar Chart) - 100% Dynamic from real invoices & orders
  const spendingBarData = useMemo(() => {
    const months = getMonthsForPeriod(spendingPeriod);
    const now = new Date();
    const currentYear = now.getFullYear();

    return months.map((m) => {
      // Sum real invoices matching this month
      const invoiceSpend = (invoices || [])
        .filter((inv: any) => {
          const d = parseItemDate(inv);
          if (!d) return false;
          return d.getMonth() === m.monthIdx && d.getFullYear() === m.year;
        })
        .reduce((sum: number, curr: any) => {
          const st = (curr.status || "").toLowerCase();
          const amt = Number(curr.amount) || Number(curr.total) || 0;
          return st === "paid" || st === "completed" || !st ? sum + amt : sum;
        }, 0);

      // Sum real orders matching this month (fallback/supplement)
      const orderSpend = (orders || [])
        .filter((o: any) => {
          const d = parseItemDate(o);
          if (!d) return false;
          const st = (o.status || o.status_raw || "").toLowerCase();
          const isValidStatus =
            ["completed", "delivered", "confirmed", "booked", "in_progress", "assigned"].includes(st) || !st;
          return isValidStatus && d.getMonth() === m.monthIdx && d.getFullYear() === m.year;
        })
        .reduce((sum: number, curr: any) => sum + (Number(curr.total_amount) || Number(curr.amount) || 0), 0);

      let spendVal = invoiceSpend > 0 ? invoiceSpend : orderSpend;

      // If customer has totalSpending recorded in stats but individual historical records lack dates:
      // attribute known total spending to the current active month so total matches top metric card
      if (spendVal === 0 && totalSpending > 0 && m.monthIdx === now.getMonth() && m.year === currentYear) {
        spendVal = totalSpending;
      }

      return {
        name: m.name,
        spend: spendVal,
      };
    });
  }, [totalSpending, invoices, orders, spendingPeriod]);

  // 2. Request & Order Overview (Grouped Bar Chart) - 100% Dynamic from real quoteRequests & orders
  const requestOrderBarData = useMemo(() => {
    const months = getMonthsForPeriod(overviewPeriod);
    const now = new Date();
    const currentYear = now.getFullYear();

    return months.map((m) => {
      let reqCount = (quoteRequests || []).filter((q: any) => {
        const d = parseItemDate(q);
        if (!d) return false;
        return d.getMonth() === m.monthIdx && d.getFullYear() === m.year;
      }).length;

      let ordCount = (orders || []).filter((o: any) => {
        const d = parseItemDate(o);
        if (!d) return false;
        return d.getMonth() === m.monthIdx && d.getFullYear() === m.year;
      }).length;

      // Include items without parseable timestamp in current month so total always matches top cards
      if (m.monthIdx === now.getMonth() && m.year === currentYear) {
        const undatedReqs = (quoteRequests || []).filter((q: any) => !parseItemDate(q)).length;
        const undatedOrds = (orders || []).filter((o: any) => !parseItemDate(o)).length;
        reqCount += undatedReqs;
        ordCount += undatedOrds;
      }

      return {
        name: m.name,
        requests: reqCount,
        orders: ordCount,
      };
    });
  }, [quoteRequests, orders, overviewPeriod]);

  // 3. Shipment Trend (Line Chart) - 100% Dynamic from real orders
  const shipmentTrendData = useMemo(() => {
    const months = getMonthsForPeriod(trendPeriod);
    const now = new Date();
    const currentYear = now.getFullYear();

    return months.map((m) => {
      let count = (orders || []).filter((o: any) => {
        const d = parseItemDate(o);
        if (!d) return false;
        return d.getMonth() === m.monthIdx && d.getFullYear() === m.year;
      }).length;

      if (m.monthIdx === now.getMonth() && m.year === currentYear) {
        const undatedOrds = (orders || []).filter((o: any) => !parseItemDate(o)).length;
        count += undatedOrds;
      }

      return {
        name: m.name,
        shipments: count,
      };
    });
  }, [orders, trendPeriod]);

  // Dynamic Y-axis domains matching actual data
  const maxSpend = useMemo(() => {
    const m = Math.max(...spendingBarData.map((d) => d.spend), totalSpending, 0);
    return Math.max(500, Math.ceil((m * 1.15) / 250) * 250);
  }, [spendingBarData, totalSpending]);

  const maxReqOrd = useMemo(() => {
    const m = Math.max(
      ...requestOrderBarData.map((d) => Math.max(d.requests, d.orders)),
      quoteRequestsCount,
      ordersCount,
      0
    );
    return Math.max(5, Math.ceil((m * 1.25) / 5) * 5);
  }, [requestOrderBarData, quoteRequestsCount, ordersCount]);

  const maxShipment = useMemo(() => {
    const m = Math.max(...shipmentTrendData.map((d) => d.shipments), ordersCount, 0);
    return Math.max(5, Math.ceil((m * 1.25) / 5) * 5);
  }, [shipmentTrendData, ordersCount]);

  const isFullYear1 = spendingBarData.length > 6;
  const isFullYear2 = requestOrderBarData.length > 6;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* 1. Spending Overview */}
      <div className="min-w-0 bg-white dark:bg-[#1e2329] p-4 rounded-[6px] border border-slate-200/90 dark:border-slate-800 shadow-2xs overflow-hidden flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
            <div className="flex items-start gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-[4px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center shrink-0 mt-0.5">
                <BarChart2 size={15} strokeWidth={2} />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-tight">
                  Spending Overview
                </h3>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 truncate">
                  Your shipping spending over time.
                </p>
              </div>
            </div>

            <Select
              className="w-36 sm:w-40 text-xs"
              triggerClassName="h-7 text-xs rounded-[4px] bg-white dark:bg-[#18202a] border-slate-200 dark:border-slate-700 font-medium"
              value={spendingPeriod}
              onChange={(val) => {
                const v = typeof val === "object" && val !== null ? (val as any).target?.value ?? (val as any).value : val;
                setSpendingPeriod(v);
                onSpendFilterChange?.(v);
              }}
              showSearch={false}
              options={FILTER_OPTIONS}
            />
          </div>
        </div>

        <div className="h-[220px] w-full pt-1">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={spendingBarData}
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
                domain={[0, maxSpend]}
                tickFormatter={(val) => `€${Number(val).toLocaleString()}`}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(val: any) => [`€${Number(val).toLocaleString()}`, "Spending"]}
              />
              <Bar
                dataKey="spend"
                name="Spending"
                fill="#3f3f46"
                radius={[2, 2, 0, 0]}
                barSize={isFullYear1 ? 22 : 36}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Request & Order Overview */}
      <div className="min-w-0 bg-white dark:bg-[#1e2329] p-4 rounded-[6px] border border-slate-200/90 dark:border-slate-800 shadow-2xs overflow-hidden flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800 mb-2">
            <div className="flex items-start gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-[4px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center shrink-0 mt-0.5">
                <BarChart2 size={15} strokeWidth={2} />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-tight">
                  Request &amp; Order Overview
                </h3>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 truncate">
                  Requests and booked orders over time.
                </p>
              </div>
            </div>

            <Select
              className="w-36 sm:w-40 text-xs"
              triggerClassName="h-7 text-xs rounded-[4px] bg-white dark:bg-[#18202a] border-slate-200 dark:border-slate-700 font-medium"
              value={overviewPeriod}
              onChange={(val) => {
                const v = typeof val === "object" && val !== null ? (val as any).target?.value ?? (val as any).value : val;
                setOverviewPeriod(v);
                onOverviewFilterChange?.(v);
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

        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={requestOrderBarData}
              margin={{ top: 5, right: 10, left: -25, bottom: 0 }}
              barGap={2}
              barCategoryGap={isFullYear2 ? "8%" : "18%"}
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

      {/* 3. Shipment Trend */}
      <div className="min-w-0 bg-white dark:bg-[#1e2329] p-4 rounded-[6px] border border-slate-200/90 dark:border-slate-800 shadow-2xs overflow-hidden flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
            <div className="flex items-start gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-[4px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center shrink-0 mt-0.5">
                <TrendingUp size={15} strokeWidth={2} />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-tight">
                  Shipment Trend
                </h3>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 truncate">
                  Number of shipments over time.
                </p>
              </div>
            </div>

            <Select
              className="w-36 sm:w-40 text-xs"
              triggerClassName="h-7 text-xs rounded-[4px] bg-white dark:bg-[#18202a] border-slate-200 dark:border-slate-700 font-medium"
              value={trendPeriod}
              onChange={(val) => {
                const v = typeof val === "object" && val !== null ? (val as any).target?.value ?? (val as any).value : val;
                setTrendPeriod(v);
              }}
              showSearch={false}
              options={FILTER_OPTIONS}
            />
          </div>
        </div>

        <div className="h-[220px] w-full pt-1">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={shipmentTrendData}
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
                domain={[0, maxShipment]}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(val: any) => [Number(val).toLocaleString(), "Shipments"]}
              />
              <Line
                type="linear"
                dataKey="shipments"
                name="Shipments"
                stroke="#3f3f46"
                strokeWidth={2}
                dot={{
                  r: 3,
                  fill: "#3f3f46",
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

export default DashboardChartsRow;
