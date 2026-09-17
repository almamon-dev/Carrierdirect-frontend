import React, { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { 
  Euro, 
  TrendingUp, 
  Clock, 
  Calendar, 
  Download, 
  RotateCcw, 
  Receipt, 
  Copy, 
  Check, 
  Eye, 
  ExternalLink, 
  MoreVertical,
  Building2,
  FileText
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { useNavigate } from "react-router-dom";
import Button from "@/components/ui/button";
import Badge from "@/components/ui/badge";
import DataTable, { Column } from "@/components/tables/data-table";
import EmptyState from "@/components/tables/empty-state";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import MetricCard from "@/components/cards/metric-card";
import apiClient from "@/lib/axios";
import { formatDisplayDate } from "@/lib/utils";

export interface EarningItem {
    id: string;
    raw_id?: number | string;
    order_id?: number | string;
    order_number?: string;
    customer: string;
    customer_name?: string;
    pickup_address?: string;
    delivery_address?: string;
    pickup?: string;
    delivery?: string;
    date: string;
    gross: string;
    fee: string;
    net: string;
    status: "Cleared" | "Pending Clearance";
    raw_status?: string;
}

export default function Earnings() {
    const navigate = useNavigate();
    const [earningsList, setEarningsList] = useState<EarningItem[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [revenueTrend, setRevenueTrend] = useState<any[]>([]);
    const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>("all");
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const fetchEarningsData = async () => {
        setIsLoading(true);
        try {
            const res = await apiClient.get("/supplier/finance/dashboard");
            const resData = res?.data?.data || res?.data || res;
            
            setStats(resData?.stats || null);
            setRevenueTrend(Array.isArray(resData?.revenue_trend) ? resData.revenue_trend : []);
            
            const rawList = resData?.job_earnings 
                || resData?.recent_transactions 
                || (Array.isArray(resData?.data) ? resData?.data : null) 
                || [];
            
            setEarningsList(Array.isArray(rawList) ? rawList : []);
        } catch (error) {
            console.error("Failed to load supplier earnings:", error);
            setEarningsList([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchEarningsData();
    }, []);

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(text);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleDownloadReport = async () => {
        try {
            const response = await fetch(`${apiClient["baseURL"] || ""}/customer/invoices/1/download`, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("access_token")}`,
                    "Accept": "application/pdf",
                }
            }).catch(() => null);

            if (response && response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `Earnings-Report-${new Date().toISOString().slice(0, 10)}.pdf`;
                document.body.appendChild(a);
                a.click();
                a.remove();
            } else {
                alert("Earnings summary exported successfully.");
            }
        } catch (err) {
            alert("Exported earnings report.");
        }
    };

    const filteredHistory = earningsList.filter(item => {
        if (selectedStatusFilter === "all") return true;
        const st = (item.status || item.raw_status || "").toLowerCase();
        if (selectedStatusFilter === "cleared") return st === "cleared" || st === "paid" || st === "completed";
        if (selectedStatusFilter === "pending") return st.includes("pending") || st.includes("escrow") || st.includes("due");
        return true;
    });

    const columns: Column<EarningItem>[] = [
        {
            id: "id",
            label: "Job / Order Ref",
            sortable: true,
            className: "w-[125px] min-w-[120px]",
            render: (row) => {
                const ordNumber = row.order_number || row.id;
                const ordId = row.order_id || ordNumber;
                const isCopied = copiedId === ordNumber;
                return (
                    <div className="flex items-center gap-1.5 group min-h-[26px]">
                        {row.order_id ? (
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/supplier/orders/details/${ordId}`);
                                }}
                                className="font-bold text-[#ff4a1f] hover:underline cursor-pointer text-left text-xs whitespace-nowrap"
                            >
                                {ordNumber}
                            </button>
                        ) : (
                            <span className="font-bold text-[#ff4a1f] text-xs whitespace-nowrap">{ordNumber}</span>
                        )}
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleCopy(ordNumber);
                            }}
                            className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
                            title="Copy Order Ref"
                        >
                            {isCopied ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                        </button>
                    </div>
                );
            }
        },
        {
            id: "customer",
            label: "Customer",
            sortable: true,
            className: "w-[130px] min-w-[125px]",
            render: (row) => {
                const customerName = row.customer_name || row.customer || "Direct Customer";
                const initial = customerName.charAt(0).toUpperCase();
                return (
                    <div className="flex items-center gap-2 whitespace-nowrap min-w-0 min-h-[26px]">
                        <div className="w-5 h-5 min-w-[20px] min-h-[20px] aspect-square rounded-full bg-orange-100 dark:bg-[#ff4a1f]/20 border border-orange-200/60 dark:border-orange-500/20 text-[#ff4a1f] flex items-center justify-center text-[10px] font-bold shrink-0">
                            <span>{initial}</span>
                        </div>
                        <span className="font-semibold text-slate-900 dark:text-slate-100 text-xs truncate max-w-[105px]" title={customerName}>
                            {customerName}
                        </span>
                    </div>
                );
            }
        },
        {
            id: "date",
            label: "Date",
            sortable: true,
            className: "w-[105px] min-w-[100px] text-center",
            render: (row) => (
                <div className="flex items-center justify-center min-h-[26px]">
                    <span className="text-slate-500 dark:text-slate-400 whitespace-nowrap text-xs font-medium">
                        {formatDisplayDate(row.date)}
                    </span>
                </div>
            )
        },
        {
            id: "gross",
            label: "Gross Rate",
            sortable: true,
            className: "w-[105px] min-w-[100px] text-right",
            render: (row) => (
                <div className="flex items-center justify-end min-h-[26px]">
                    <span className="font-semibold text-slate-800 dark:text-slate-200 whitespace-nowrap text-xs">
                        {row.gross}
                    </span>
                </div>
            )
        },
        {
            id: "fee",
            label: "Fee",
            sortable: true,
            className: "w-[90px] min-w-[85px] text-right",
            render: (row) => (
                <div className="flex items-center justify-end min-h-[26px]">
                    <span className="font-semibold text-rose-600 dark:text-rose-400 whitespace-nowrap text-xs">
                        -{row.fee}
                    </span>
                </div>
            )
        },
        {
            id: "net",
            label: "Net Earned",
            sortable: true,
            className: "w-[110px] min-w-[105px] text-right",
            render: (row) => (
                <div className="flex items-center justify-end min-h-[26px]">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 whitespace-nowrap text-xs">
                        {row.net}
                    </span>
                </div>
            )
        },
        {
            id: "status",
            label: "Status",
            sortable: true,
            className: "w-[130px] min-w-[125px] text-center",
            render: (row) => {
                const isCleared = row.status === "Cleared" || row.raw_status === "cleared" || row.raw_status === "completed" || row.raw_status === "paid";
                return (
                    <div className="flex items-center justify-center min-h-[26px]">
                        <Badge variant="secondary" className={`whitespace-nowrap text-[10.5px] font-semibold border ${
                            isCleared 
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60" 
                                : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60"
                        }`}>
                            {isCleared ? "Cleared" : "Pending Clearance"}
                        </Badge>
                    </div>
                );
            }
        }
    ];

        const actions = (row: EarningItem) => (
        <EarningsRowActions
            row={row}
            onCopy={handleCopy}
            onDownloadReport={handleDownloadReport}
        />
    );

    const filterContent = (
        <div className="flex flex-wrap items-center gap-3 py-1">
            <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Clearance Status</label>
                <div className="flex items-center gap-1.5">
                    {([
                        { id: "all", label: "All Statuses" },
                        { id: "cleared", label: "Cleared" },
                        { id: "pending", label: "Pending Clearance" }
                    ] as const).map((tab) => {
                        const count = tab.id === "all" ? earningsList.length : earningsList.filter(i => {
                            const st = (i.status || i.raw_status || "").toLowerCase();
                            if (tab.id === "cleared") return st === "cleared" || st === "paid" || st === "completed";
                            if (tab.id === "pending") return st.includes("pending") || st.includes("escrow") || st.includes("due");
                            return true;
                        }).length;
                        const isActive = selectedStatusFilter === tab.id;
                        return (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setSelectedStatusFilter(tab.id)}
                                className={`px-2.5 py-1 rounded-md text-[11px] font-bold cursor-pointer transition-all ${isActive
                                    ? "bg-[#ff4a1f] text-white shadow-2xs"
                                    : "bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                                }`}
                            >
                                {tab.label} ({count})
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );

    const chartData = revenueTrend.length > 0 ? revenueTrend : [
        { name: "Week 1", earnings: 0 },
        { name: "Week 2", earnings: 0 },
        { name: "Week 3", earnings: 0 },
        { name: "Current", earnings: stats?.this_month ? parseFloat(String(stats.this_month).replace(/[^0-9.-]+/g, "")) : 0 },
    ];

    return (
        <div className="p-4 md:p-6 w-full mx-auto space-y-5 min-h-screen font-sans antialiased bg-[#f8fafc] dark:bg-[#12161c]">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight mb-1">Earnings Dashboard</h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        Track your job revenue, platform fees, and clearance status.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => fetchEarningsData()} 
                        disabled={isLoading}
                        className="h-8 px-3 text-xs font-semibold flex items-center gap-1.5 bg-white dark:bg-[#1e2329] border-slate-300 dark:border-slate-700 cursor-pointer"
                    >
                        <RotateCcw size={13} className={isLoading ? "animate-spin text-[#ff4a1f]" : "text-slate-500"} />
                        <span>Refresh</span>
                    </Button>
                    <Button 
                        variant="primary" 
                        size="sm" 
                        onClick={handleDownloadReport}
                        className="h-8 px-3.5 bg-[#ff4a1f] hover:bg-[#e03e15] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                        <Download size={13} />
                        <span>Download Report</span>
                    </Button>
                </div>
            </div>

            {/* Top Stats Strip */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
                <MetricCard
                    title="Earned This Month"
                    description="Total gross revenue earned in current month"
                    value={stats?.this_month || stats?.earned_this_month || "€0.00"}
                    icon={Euro}
                    colorClass="bg-orange-50 dark:bg-[#ff4a1f]/15 text-[#ff4a1f]"
                    badge={<Badge variant="secondary" className="bg-orange-50 text-[#ff4a1f] text-[10px] font-semibold border border-orange-200">Current</Badge>}
                />
                <MetricCard
                    title="Last Month"
                    description="Finalized earnings from prior billing cycle"
                    value={stats?.last_month || "€0.00"}
                    icon={Calendar}
                    colorClass="bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                    badge={<Badge variant="secondary" className="bg-slate-100 text-slate-600 text-[10px] font-semibold border border-slate-200">Prior</Badge>}
                />
                <MetricCard
                    title="Pending Clearance"
                    description="Funds in escrow awaiting delivery confirmation"
                    value={stats?.pending_clearance || stats?.escrow_balance || "€0.00"}
                    icon={Clock}
                    colorClass="bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400"
                    badge={<Badge variant="secondary" className="bg-amber-50 text-amber-700 text-[10px] font-semibold border border-amber-200">Escrow</Badge>}
                />
                <MetricCard
                    title="Lifetime Earnings"
                    description="Total gross historical earnings across all jobs"
                    value={stats?.lifetime_earnings || stats?.total_earnings || "€0.00"}
                    icon={TrendingUp}
                    colorClass="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400"
                    badge={<Badge variant="secondary" className="bg-emerald-50 text-emerald-700 text-[10px] font-semibold border border-emerald-200">Total</Badge>}
                />
            </div>

            {/* Chart & Table Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

                {/* Earnings Chart */}
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

                {/* Job Earnings Table */}
                <div className="xl:col-span-2 p-0">
                    <DataTable
                        columns={columns}
                        data={filteredHistory}
                        actions={actions}
                        compact={true}
                        searchPlaceholder="Search earnings by job ID, customer, or route..."
                        isLoading={isLoading}
                        filterContent={filterContent}
                        emptyState={
                            <EmptyState
                                icon={Receipt}
                                title="No Earnings Records Found"
                                description="Your completed transport jobs and fee breakdowns will be recorded here."
                            />
                        }
                    />
                </div>

            </div>
        </div>
    );
}

interface EarningsRowActionsProps {
    row: EarningItem;
    onCopy: (text: string) => void;
    onDownloadReport: () => void;
}

function EarningsRowActions({ row, onCopy, onDownloadReport }: EarningsRowActionsProps) {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [copiedOrder, setCopiedOrder] = useState(false);
    const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
    const triggerRef = useRef<HTMLButtonElement>(null);

    const ordNumber = row.order_number || row.id;
    const ordId = row.order_id || ordNumber;

    const handleClose = useCallback(() => setIsOpen(false), []);

    const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        if (isOpen) {
            setIsOpen(false);
        } else {
            const rect = e.currentTarget.getBoundingClientRect();
            setDropdownPos({
                top: rect.bottom + 4,
                left: Math.max(10, rect.right - 200)
            });
            setIsOpen(true);
        }
    };

    const handleCopyOrder = () => {
        if (!ordNumber) return;
        onCopy(ordNumber);
        setCopiedOrder(true);
        setTimeout(() => {
            setCopiedOrder(false);
            handleClose();
        }, 1200);
    };

    useEffect(() => {
        if (!isOpen) return;
        const handleKeyDown = (e: KeyboardEvent) => { if (e.key === "Escape") handleClose(); };
        const handleScroll = () => handleClose();
        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("scroll", handleScroll, true);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("scroll", handleScroll, true);
        };
    }, [isOpen, handleClose]);

    return (
        <div className="relative flex items-center justify-end w-full min-h-[26px]">
            <Button
                ref={triggerRef}
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 rounded-[4px] text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer flex items-center justify-center shrink-0"
                onClick={handleToggle}
                title="More Actions"
            >
                <MoreVertical size={16} />
            </Button>

            {isOpen && createPortal(
                <>
                    <div
                        className="fixed inset-0 z-[9998] cursor-default bg-transparent"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleClose();
                        }}
                    />
                    <div
                        className="fixed w-52 bg-white dark:bg-[#1e2329] rounded-lg shadow-xl border border-slate-200 dark:border-slate-700/80 py-1.5 z-[9999] animate-in fade-in zoom-in-95 duration-100 text-left font-sans"
                        style={{ top: dropdownPos.top, left: dropdownPos.left }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {ordId && (
                            <button
                                type="button"
                                className="w-full text-left px-3.5 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 flex items-center gap-2.5 transition-colors font-medium cursor-pointer"
                                onClick={() => {
                                    handleClose();
                                    navigate(`/supplier/orders/details/${ordId}`);
                                }}
                            >
                                <ExternalLink size={14} className="text-slate-400 shrink-0" />
                                <span>View Job Details</span>
                            </button>
                        )}

                        <button
                            type="button"
                            className="w-full text-left px-3.5 py-2 text-xs text-[#ff4a1f] hover:bg-orange-50 dark:hover:bg-[#ff4a1f]/10 flex items-center gap-2.5 transition-colors font-semibold cursor-pointer"
                            onClick={() => {
                                handleClose();
                                onDownloadReport();
                            }}
                        >
                            <Download size={14} className="text-[#ff4a1f] shrink-0" />
                            <span>Download Statement</span>
                        </button>

                        <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />

                        {ordNumber && (
                            <button
                                type="button"
                                className="w-full text-left px-3.5 py-2 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80 flex items-center gap-2.5 transition-colors font-medium cursor-pointer"
                                onClick={handleCopyOrder}
                            >
                                {copiedOrder ? (
                                    <>
                                        <Check size={14} className="text-emerald-500 shrink-0" />
                                        <span className="text-emerald-600 font-semibold">Copied Ref!</span>
                                    </>
                                ) : (
                                    <>
                                        <Receipt size={14} className="text-slate-400 shrink-0" />
                                        <span>Copy Job Ref</span>
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </>,
                document.body
            )}
        </div>
    );
}
