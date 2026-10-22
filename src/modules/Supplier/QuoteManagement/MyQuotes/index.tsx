import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, RefreshCw } from "lucide-react";
import DataTable from "@/components/tables/data-table";
import EmptyState from "@/components/tables/empty-state";
import Button from "@/components/ui/button";
import { encryptId } from "@/lib/encryption";
import { useSupplierMyQuotes } from "./hooks/useSupplierMyQuotes";
import { useMyQuoteFilter, MyQuoteFilterTab } from "./hooks/useMyQuoteFilter";
import { getMyQuoteColumns } from "./components/myQuoteColumns";
import { MyQuoteRowActions } from "./components/MyQuoteRowActions";
import { MyQuotesTableFilterContent } from "./components/MyQuotesTableFilterContent";

export type { MyQuoteFilterTab };

export default function MyQuotes() {
    const navigate = useNavigate();
    const { quotes = [], isLoading, isRefreshing, fetchMyQuotes } = useSupplierMyQuotes();
    const {
        activeTab,
        setActiveTab,
        statusFilter,
        setStatusFilter,
        requestIdFilter,
        setRequestIdFilter,
        handleResetFilters,
        tabs,
        filteredData
    } = useMyQuoteFilter(quotes);

    const handleRefresh = async () => {
        await fetchMyQuotes(true);
    };

    const columns = useMemo(
        () => getMyQuoteColumns({ onNavigate: (path, state) => navigate(path, { state }) }),
        [navigate]
    );

    return (
        <div className="p-3 sm:p-4 md:p-6 w-full mx-auto space-y-4 sm:space-y-5 min-h-screen font-sans antialiased bg-[#f8fafc] dark:bg-[#12161c]">
            <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                    <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight mb-1">
                        My Quotes
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        Monitor all active quotes and pricing bids submitted to shippers.
                    </p>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    className="h-8 px-2.5 sm:px-3 text-xs font-semibold flex items-center gap-1.5 cursor-pointer bg-white dark:bg-[#1e2329] border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 shrink-0"
                >
                    <RefreshCw size={13} className={isRefreshing ? "animate-spin text-[#ff4a1f]" : "text-slate-500"} />
                    <span>{isRefreshing ? "Refreshing..." : "Refresh"}</span>
                </Button>
            </div>

            <DataTable
                data={filteredData}
                columns={columns}
                tableLayout="auto"
                tableClassName="w-full"
                actions={(row) => <MyQuoteRowActions row={row} onRefresh={handleRefresh} />}
                actionsColumnClassName="w-[76px] min-w-[70px] text-right pr-3.5 sm:pr-4"
                headerTabs={
                    <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto hide-scrollbar mb-[-1px]">
                        {tabs.map((tab) => {
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 pb-3 border-b-2 transition-colors whitespace-nowrap cursor-pointer px-1 ${
                                        isActive
                                            ? "border-[#ff4a1f] text-[#ff4a1f] dark:border-[#ff4a1f] dark:text-[#ff4a1f]"
                                            : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                                    }`}
                                >
                                    <span className={`text-[14px] ${isActive ? "font-bold text-[#ff4a1f]" : "font-medium"}`}>
                                        {tab.label}
                                    </span>
                                    <span
                                        className={`text-[12px] font-semibold px-2 py-0.5 rounded-full transition-colors ${
                                            isActive
                                                ? "bg-orange-50 dark:bg-[#ff4a1f]/20 text-[#ff4a1f] dark:text-orange-400"
                                                : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                                        }`}
                                    >
                                        {tab.count}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                }
                filterContent={
                    <MyQuotesTableFilterContent
                        statusFilter={statusFilter}
                        setStatusFilter={setStatusFilter}
                        requestIdFilter={requestIdFilter}
                        setRequestIdFilter={setRequestIdFilter}
                        onResetFilters={handleResetFilters}
                    />
                }
                keyExtractor={(item) => String(item.rawId || item.id)}
                searchPlaceholder="Search by ID, customer, route..."
                compact={true}
                isLoading={isLoading || isRefreshing}
                onRowClick={(row) => {
                    const rawId = String(row.rawId || row.slug || row.id).replace("REQ-", "").trim();
                    navigate(`/supplier/quotes/my-quotes/${encryptId(rawId)}`, { state: { from: "my-quotes" } });
                }}
                emptyState={
                    <EmptyState
                        icon={FileText}
                        title="No Quotes Found"
                        description={
                            requestIdFilter
                                ? `No submitted quotes match request ID "${requestIdFilter}".`
                                : `No submitted quotes match the "${activeTab.toUpperCase()}" filter.`
                        }
                    />
                }
            />
        </div>
    );
}
