import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RefreshCw, Inbox } from "lucide-react";
import DataTable from "@/components/tables/data-table";
import EmptyState from "@/components/tables/empty-state";
import Button from "@/components/ui/button";
import { encryptId } from "@/lib/encryption";
import { QuoteRequest } from "../data/quoteRequestsData";
import { getSupplierColumns } from "./components/columns";
import { QuoteRequestsFilterTabs } from "./components/QuoteRequestsFilterTabs";
import { SupplierRowActions } from "./components/SupplierRowActions";
import { TableFilterContent } from "./components/TableFilterContent";
import { useSupplierQuoteRequests } from "./hooks/useSupplierQuoteRequests";
import { useQuoteRequestsFilter } from "./hooks/useQuoteRequestsFilter";

export default function QuoteRequests() {
    const navigate = useNavigate();
    const [isRefreshing, setIsRefreshing] = useState(false);
    const { requests, stats, isLoading, fetchRequests } = useSupplierQuoteRequests();

    const {
        activeTab,
        setActiveTab,
        locationFilter,
        setLocationFilter,
        startDate,
        setStartDate,
        endDate,
        setEndDate,
        handleResetFilters,
        filteredRequests
    } = useQuoteRequestsFilter(requests);

    const handleQuoteAction = (row: QuoteRequest) => {
        const rawId = String(row.rawId || row.slug || row.id).replace("REQ-", "").trim();
        navigate(`/supplier/quotes/requests/${encryptId(rawId)}`);
    };

    const handleRefresh = async () => {
        setIsRefreshing(true);
        try {
            await fetchRequests();
        } finally {
            setTimeout(() => setIsRefreshing(false), 300);
        }
    };

    const columns = useMemo(() => getSupplierColumns(navigate), [navigate]);

    return (
        <div className="p-4 md:p-6 w-full mx-auto space-y-5 min-h-screen font-sans bg-[#f8fafc] dark:bg-[#12161c]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight mb-1">
                        Available Requests
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        Shipment requests eligible for competitive carrier bidding.
                    </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRefresh}
                        disabled={isRefreshing}
                        className="h-8 px-2.5 sm:px-3 text-xs font-semibold flex items-center gap-1.5 cursor-pointer bg-white dark:bg-[#1e2329] border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                        <RefreshCw size={13} className={isRefreshing ? "animate-spin text-[#ff4a1f]" : "text-slate-500"} />
                        <span>{isRefreshing ? "Refreshing..." : "Refresh"}</span>
                    </Button>
                </div>
            </div>

            <DataTable
                data={filteredRequests}
                columns={columns}
                tableLayout="auto"
                tableClassName="w-full"
                actions={(row) => <SupplierRowActions row={row} onQuoteAction={handleQuoteAction} />}
                actionsColumnClassName="w-[76px] min-w-[70px] text-right pr-3.5 sm:pr-4"
                onRowClick={(row) => handleQuoteAction(row)}
                headerTabs={
                    <QuoteRequestsFilterTabs
                        requests={requests}
                        activeTab={activeTab}
                        onSelectTab={setActiveTab}
                        stats={stats}
                    />
                }
                filterContent={
                    <TableFilterContent
                        locationFilter={locationFilter}
                        setLocationFilter={setLocationFilter}
                        startDate={startDate}
                        setStartDate={setStartDate}
                        endDate={endDate}
                        setEndDate={setEndDate}
                        onResetFilters={handleResetFilters}
                    />
                }
                keyExtractor={(item) => item.id}
                searchPlaceholder="Search by ID, customer, pickup/delivery..."
                compact={true}
                hideViewToggle={false}
                isLoading={isLoading || isRefreshing}
                emptyState={
                    <EmptyState
                        icon={Inbox}
                        title={
                            startDate || endDate ? "No Requests Found in Selected Date Range" :
                                activeTab === "new" ? "No New Unquoted Requests Found" :
                                    activeTab === "quoted" ? "No Quoted Requests Found" :
                                        "No Quote Requests Available"
                        }
                        description={
                            startDate || endDate
                                ? `No quote requests were found between ${startDate || "the start"} and ${endDate || "the end"}. Try changing the date range.`
                                : `There are no quote requests matching the "${String(activeTab).toUpperCase()}" tab criteria.`
                        }
                    />
                }
            />
        </div>
    );
}
