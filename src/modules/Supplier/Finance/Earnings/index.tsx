import React, { useMemo } from "react";
import { RotateCcw, Download, Receipt } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/ui/button";
import DataTable from "@/components/tables/data-table";
import EmptyState from "@/components/tables/empty-state";

import { EarningItem } from "./types/earnings.types";
import { useSupplierEarningsData } from "./hooks/useSupplierEarningsData";
import { EarningsRowActions } from "./components/EarningsRowActions";
import { EarningsStatsGrid } from "./components/EarningsStatsGrid";
import { EarningsChartSection } from "./components/EarningsChartSection";
import { getEarningsColumns } from "./components/EarningsColumns";

export type { EarningItem } from "./types/earnings.types";

export default function Earnings() {
    const navigate = useNavigate();
    const {
        earningsList,
        stats,
        revenueTrend,
        selectedStatusFilter,
        setSelectedStatusFilter,
        isLoading,
        copiedId,
        filteredHistory,
        fetchEarningsData,
        handleCopy,
        handleDownloadReport,
    } = useSupplierEarningsData();

    const columns = useMemo(
        () => getEarningsColumns({ navigate, copiedId, onCopy: handleCopy }),
        [navigate, copiedId]
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
            <EarningsStatsGrid stats={stats} />

            {/* Chart & Table Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
                <EarningsChartSection revenueTrend={revenueTrend} stats={stats} />

                <div className="xl:col-span-2 p-0">
                    <DataTable
                        columns={columns}
                        data={filteredHistory}
                        actions={(row) => (
                            <EarningsRowActions
                                row={row}
                                onCopy={handleCopy}
                                onDownloadReport={handleDownloadReport}
                            />
                        )}
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
