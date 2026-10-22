import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MessageSquare, RefreshCw } from "lucide-react";
import DataTable from "@/components/tables/data-table";
import EmptyState from "@/components/tables/empty-state";
import Button from "@/components/ui/button";
import { encryptId } from "@/lib/encryption";
import { getNegotiationColumns } from "./components/columns";
import { NegotiationFilterTabs } from "./components/NegotiationFilterTabs";
import { NegotiationRowActions } from "./components/NegotiationRowActions";
import { TableFilterContent } from "./components/TableFilterContent";
import { useSupplierNegotiations } from "./hooks/useSupplierNegotiations";
import { useNegotiationFilter } from "./hooks/useNegotiationFilter";
import { NegotiationItem } from "./types";

export { type NegotiationItem, type NegotiationTab } from "./types";

export default function SupplierNegotiation() {
    const navigate = useNavigate();
    const [isRefreshing, setIsRefreshing] = useState(false);
    const { negotiations = [], isLoading = false, fetchNegotiations } = useSupplierNegotiations() || {};

    const {
        activeTab,
        setActiveTab,
        statusFilter,
        setStatusFilter,
        startDate,
        setStartDate,
        endDate,
        setEndDate,
        handleResetFilters,
        filteredData
    } = useNegotiationFilter(negotiations);

    const handleQuoteAction = (row: NegotiationItem) => {
        const encId = encryptId(row?.rawId || row?.id || "");
        const sKey = row?.sessionKey || `ses-${row?.rawId || row?.id || ""}`;
        navigate(`/supplier/quotes/negotiation/conversation/${encId}/${sKey}`);
    };

    const handleRefresh = async () => {
        setIsRefreshing(true);
        try {
            if (fetchNegotiations) await fetchNegotiations(true);
        } finally {
            setTimeout(() => setIsRefreshing(false), 300);
        }
    };

    const columns = useMemo(() => getNegotiationColumns(navigate), [navigate]);

    return (
        <div className="p-3 sm:p-4 md:p-6 w-full mx-auto space-y-4 sm:space-y-5 min-h-screen font-sans antialiased bg-[#f8fafc] dark:bg-[#12161c]">
            <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                    <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight mb-1">
                        Negotiations
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        Live commercial negotiation, counter-offers, and freight rates with shippers.
                    </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
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
            </div>

            <DataTable
                data={filteredData || []}
                columns={columns}
                tableLayout="auto"
                tableClassName="w-full"
                actions={(row) => <NegotiationRowActions row={row} onAction={handleQuoteAction} onRefresh={handleRefresh} />}
                onRowClick={(row) => handleQuoteAction(row)}
                headerTabs={
                    <NegotiationFilterTabs
                        negotiations={negotiations}
                        activeTab={activeTab}
                        onSelectTab={setActiveTab}
                    />
                }
                filterContent={
                    <TableFilterContent
                        statusFilter={statusFilter}
                        setStatusFilter={setStatusFilter}
                        startDate={startDate}
                        setStartDate={setStartDate}
                        endDate={endDate}
                        setEndDate={setEndDate}
                        onResetFilters={handleResetFilters}
                    />
                }
                keyExtractor={(item) => item?.id || Math.random().toString()}
                searchPlaceholder="Search negotiations by ID, quote, shipper, route..."
                compact={true}
                hideViewToggle={false}
                isLoading={isLoading || isRefreshing}
                actionsColumnClassName="w-[130px] min-w-[130px]"
                emptyState={
                    <EmptyState
                        icon={MessageSquare}
                        title={
                            startDate || endDate ? "No Negotiations Found in Selected Date Range" :
                                activeTab === "your_turn" ? "No Negotiations Waiting for Your Response" :
                                    activeTab === "customers_turn" ? "No Negotiations Waiting for Customer" :
                                        activeTab === "agreed" ? "No Agreed Offers Found" :
                                            "No Negotiations Available"
                        }
                        description={
                            startDate || endDate
                                ? `No negotiation threads matched the date range ${startDate || "the start"} to ${endDate || "the end"}.`
                                : `There are no negotiations matching the "${String(activeTab).replace("_", " ").toUpperCase()}" tab criteria.`
                        }
                    />
                }
            />
        </div>
    );
}
