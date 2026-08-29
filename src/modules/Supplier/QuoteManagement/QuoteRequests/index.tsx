/**
 * Supplier Quote Management - QuoteRequests Main Page
 * Displays available carrier quotes requests with interactive header tabs
 * (All, Today, Upcoming, Urgent, Expired), multi-facet dropdown filtering,
 * and Custom Date Range / Specific Date filtering.
 */

import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Inbox, RefreshCw } from "lucide-react";
import DataTable from "@/components/tables/data-table";
import Button from "@/components/ui/button";
import EmptyState from "@/components/tables/empty-state";
import { QuoteRequest } from "../data/quoteRequestsData";
import { useSupplierQuoteRequests } from "./hooks/useSupplierQuoteRequests";
import { getSupplierColumns } from "./components/columns";
import { SupplierRowActions } from "./components/SupplierRowActions";
import { TableFilterContent } from "./components/TableFilterContent";
import { 
    QuoteRequestsFilterTabs, 
    RequestFilterTab, 
    isRequestToday, 
    isRequestUpcoming, 
    isRequestUrgent, 
    isRequestExpired 
} from "./components/QuoteRequestsFilterTabs";
import { encryptId } from "@/lib/encryption";

export default function QuoteRequests() {
    const navigate = useNavigate();
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Tab filter state
    const [activeTab, setActiveTab] = useState<RequestFilterTab>("all");

    // Dropdown filters state
    const [priorityFilter, setPriorityFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [vehicleFilter, setVehicleFilter] = useState("all");

    // Custom Date filter state
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");

    // Data fetching and caching hook
    const { requests, stats, isLoading, fetchRequests } = useSupplierQuoteRequests();

    const handleQuoteAction = (row: QuoteRequest) => {
        const rawId = String(row.rawId || row.slug || row.id).replace('REQ-', '').trim();
        const encId = encryptId(rawId);
        try {
            sessionStorage.setItem('carrierdirect_last_quote_session_id', rawId);
        } catch {}
        navigate(`/supplier/quotes/requests/${encId}`);
    };

    const handleRefresh = async () => {
        setIsRefreshing(true);
        try {
            await fetchRequests();
        } finally {
            setTimeout(() => setIsRefreshing(false), 300);
        }
    };

    const handleResetFilters = () => {
        setPriorityFilter("all");
        setStatusFilter("all");
        setVehicleFilter("all");
        setStartDate("");
        setEndDate("");
        setActiveTab("all");
    };

    // Filter requests by activeTab + dropdown filters + custom date range
    const filteredRequests = useMemo(() => {
        return requests.filter((item) => {
            if (!item) return false;

            // 1. Tab filter
            if (activeTab === "today" && !isRequestToday(item)) return false;
            if (activeTab === "upcoming" && !isRequestUpcoming(item)) return false;
            if (activeTab === "urgent" && !isRequestUrgent(item)) return false;
            if (activeTab === "expired" && !isRequestExpired(item)) return false;

            // 2. Priority filter
            if (priorityFilter !== "all") {
                const normPriority = (item.priority || "").toLowerCase();
                if (!normPriority.includes(priorityFilter.toLowerCase())) return false;
            }

            // 3. Status filter
            if (statusFilter !== "all") {
                const normStatus = (item.status || "").toLowerCase();
                if (!normStatus.includes(statusFilter.toLowerCase())) return false;
            }

            // 4. Vehicle filter
            if (vehicleFilter !== "all") {
                const normVehicle = (item.vehicleType || "").toLowerCase().replace(/[\s_-]+/g, "");
                const targetVehicle = vehicleFilter.toLowerCase().replace(/[\s_-]+/g, "");
                if (!normVehicle.includes(targetVehicle)) return false;
            }

            // 5. Custom Date Filter (startDate and/or endDate)
            if (startDate || endDate) {
                const dateVal = item.pickupDate || item.requestDate;
                if (dateVal) {
                    try {
                        const itemTime = new Date(dateVal).getTime();
                        if (!isNaN(itemTime)) {
                            if (startDate) {
                                const start = new Date(startDate);
                                start.setHours(0, 0, 0, 0);
                                if (itemTime < start.getTime()) return false;
                            }
                            if (endDate) {
                                const end = new Date(endDate);
                                end.setHours(23, 59, 59, 999);
                                if (itemTime > end.getTime()) return false;
                            }
                        }
                    } catch {}
                }
            }

            return true;
        });
    }, [requests, activeTab, priorityFilter, statusFilter, vehicleFilter, startDate, endDate]);

    const columns = useMemo(() => getSupplierColumns(navigate), [navigate]);

    return (
        <div className="p-4 md:p-6 w-full mx-auto space-y-5 min-h-screen font-sans antialiased bg-[#f8fafc] dark:bg-[#12161c]">
            {/* Header Title & Refresh Button */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight mb-1">
                        Quote Requests
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        Manage and respond to customer transportation requests.
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

            {/* Main Data Table */}
            <DataTable
                data={filteredRequests}
                columns={columns}
                actions={(row) => <SupplierRowActions row={row} onQuoteAction={handleQuoteAction} />}
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
                searchPlaceholder="Search by ID, customer, pickup/delivery..."
                compact={true}
                hideViewToggle={false}
                isLoading={isLoading || isRefreshing}
                tableLayout="fixed"
                tableClassName="min-w-[1050px]"
                emptyState={
                    <EmptyState
                        icon={Inbox}
                        title={
                            startDate || endDate ? "No Requests Found in Selected Date Range" :
                            activeTab === "today" ? "No Requests Scheduled Today" :
                            activeTab === "upcoming" ? "No Upcoming Requests" :
                            activeTab === "urgent" ? "No Urgent Requests Found" :
                            activeTab === "expired" ? "No Expired Requests Found" :
                            "No Quote Requests Available"
                        }
                        description={
                            startDate || endDate
                                ? `No quote requests were found between ${startDate || 'the start'} and ${endDate || 'the end'}. Try changing the date range.`
                                : activeTab === "all" 
                                    ? "There are currently no active quote requests waiting for carrier bids. New requests will appear here automatically."
                                    : `There are no quote requests matching the "${activeTab.toUpperCase()}" filter criteria.`
                        }
                    />
                }
            />
        </div>
    );
}
