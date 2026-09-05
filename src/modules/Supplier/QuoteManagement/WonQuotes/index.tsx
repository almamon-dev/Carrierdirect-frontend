import DataTable from "@/components/tables/data-table";
import EmptyState from "@/components/tables/empty-state";
import Button from "@/components/ui/button";
import { RefreshCw, Trophy } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getWonQuoteColumns } from "./components/columns";
import { FilterTabs } from "./components/FilterTabs";
import { TableFilterContent } from "./components/TableFilterContent";
import { WonRowActions } from "./components/WonRowActions";
import { useSupplierWonQuotes } from "./hooks/useSupplierWonQuotes";
import { useWonQuotesFilter } from "./hooks/useWonQuotesFilter";

export default function WonQuotes() {
    const navigate = useNavigate();
    const [isRefreshing, setIsRefreshing] = useState(false);

    const {
        quotes,
        activeTab,
        setActiveTab,
        isLoading,
        fetchWonQuotes,
    } = useSupplierWonQuotes();

    const {
        priorityFilter, setPriorityFilter,
        statusFilter, setStatusFilter,
        vehicleFilter, setVehicleFilter,
        startDate, setStartDate,
        endDate, setEndDate,
        handleResetFilters,
        filteredQuotes,
    } = useWonQuotesFilter(quotes, activeTab);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        try {
            await fetchWonQuotes();
        } finally {
            setTimeout(() => setIsRefreshing(false), 300);
        }
    };

    const columns = useMemo(() => getWonQuoteColumns(navigate), [navigate]);

    return (
        <div className="p-4 md:p-6 w-full mx-auto space-y-5 min-h-screen font-sans antialiased bg-[#f8fafc] dark:bg-[#12161c]">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight mb-1">
                        Won Quotes
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        View and manage transportation quote bids that have been accepted by shippers.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRefresh}
                        disabled={isRefreshing}
                        className="h-8 px-3 text-xs font-semibold flex items-center gap-1.5 cursor-pointer bg-white dark:bg-[#1e2329] border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                        <RefreshCw size={13} className={isRefreshing ? "animate-spin text-[#ff4a1f]" : "text-slate-500"} />
                        <span>{isRefreshing ? "Refreshing..." : "Refresh"}</span>
                    </Button>
                </div>
            </div>

            <DataTable
                data={filteredQuotes}
                columns={columns}
                actions={(row) => <WonRowActions row={row} />}
                headerTabs={
                    <FilterTabs
                        quotes={quotes}
                        activeTab={activeTab}
                        onSelectTab={setActiveTab}
                    />
                }
                filterContent={
                    <TableFilterContent
                        priorityFilter={priorityFilter}
                        setPriorityFilter={setPriorityFilter}
                        statusFilter={statusFilter}
                        setStatusFilter={setStatusFilter}
                        vehicleFilter={vehicleFilter}
                        setVehicleFilter={setVehicleFilter}
                        startDate={startDate}
                        setStartDate={setStartDate}
                        endDate={endDate}
                        setEndDate={setEndDate}
                        onResetFilters={handleResetFilters}
                    />
                }
                keyExtractor={(item) => item.id}
                searchPlaceholder="Search won quotes by ID, shipper, pickup, delivery..."
                compact={true}
                hideViewToggle={false}
                isLoading={quotes.length > 0 && (isLoading || isRefreshing)}
                onRowClick={(row) => navigate(`/supplier/quotes/requests/${row.slug}`)}
                tableLayout="fixed"
                tableClassName="min-w-[1050px]"
                emptyState={
                    <EmptyState
                        icon={Trophy}
                        title="No Won Quotes Found"
                        description={activeTab === "All"
                            ? "You have not won any quote requests yet. Keep submitting competitive bids to win freight loads."
                            : `No won quotes currently match the '${activeTab}' filter.`
                        }
                    />
                }
            />
        </div>
    );
}
