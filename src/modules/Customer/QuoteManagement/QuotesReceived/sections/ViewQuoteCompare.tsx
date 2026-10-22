import React, { useState, useMemo } from "react";
import { Layers, Trophy, Tag, Zap, Star, CheckCircle, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DataTable, { Column } from "@/components/tables/data-table";
import EmptyState from "@/components/tables/empty-state";
import TabHeader from "@/components/ui/tab-header";
import {
    QuotesReceivedQuoteIdCell,
    QuotesReceivedRequestIdCell,
    QuotesReceivedSupplierCell,
    QuotesReceivedAddressCell,
    QuotesReceivedVehicleCell,
    QuotesReceivedDateCell,
} from "../components/QuotesReceivedCells";
import { QuoteData } from "../types/quoteViewDetailTypes";

interface ViewQuoteCompareProps {
    currentQuote: QuoteData;
    siblingQuotes: QuoteData[];
    onSelectQuote: (quote: QuoteData, targetTab?: string) => void;
    onAcceptQuote: (quote: QuoteData) => void;
}

export const ViewQuoteCompare: React.FC<ViewQuoteCompareProps> = ({
    currentQuote,
    siblingQuotes,
    onSelectQuote,
}) => {
    const navigate = useNavigate();
    const [activeFilter, setActiveFilter] = useState<"all" | "cheapest" | "fastest" | "rating">("all");

    // Parse transit string like "24h", "2 days", etc. into numeric hours
    const getTransitHours = (item: any): number => {
        const str = String(item.transit || item.estimated_time || item.transit_time || item.deliveryDate || "");
        const match = str.match(/(\d+)/);
        if (!match) return 999;
        const val = parseInt(match[1], 10);
        if (str.toLowerCase().includes("day")) return val * 24;
        return val;
    };

    // Format sibling quotes into exact columns format matching WonQuotes/QuotesReceived table
    const formattedQuotes = useMemo(() => {
        const list = (siblingQuotes && siblingQuotes.length > 0 ? siblingQuotes : [currentQuote]) as any[];

        return list.map((sq: any) => {
            const rawId = sq.rawId || sq.id;
            const quoteText = sq.quote_id || sq.quoteId || (rawId ? (String(rawId).startsWith("QT-") ? rawId : "QT-" + String(rawId).padStart(4, "0")) : "QT-0000");
            const reqIdVal = sq.quote_request_id || sq.quote_request?.id || currentQuote?.quote_request_id || (currentQuote?.quote_request as any)?.id;
            const reqIdText = reqIdVal ? (String(reqIdVal).startsWith("REQ-") ? reqIdVal : "REQ-" + String(reqIdVal).padStart(4, "0")) : "REQ-0000";
            const statusStr = String(sq.status_raw || sq.status || (sq.id === currentQuote.id ? (currentQuote.status_raw || currentQuote.status) : "Confirmed")).toLowerCase();

            let deliveryStatus = "Confirmed";
            if (statusStr === "completed") deliveryStatus = "Completed";
            else if (statusStr.includes("pod")) deliveryStatus = "POD Pending";
            else if (statusStr === "delivered") deliveryStatus = "Delivered";
            else if (statusStr === "in_transit" || statusStr === "picked_up") deliveryStatus = "In Transit";
            else if (statusStr.includes("driver")) deliveryStatus = "Driver Assigned";
            else deliveryStatus = "Confirmed";

            const origin = sq.pickup_address || sq.pickup_city || sq.origin || (sq.quote_request as any)?.pickup_city || (currentQuote?.quote_request as any)?.pickup_city || "Gazipur, Dhaka";
            const destination = sq.delivery_address || sq.delivery_city || sq.destination || (sq.quote_request as any)?.delivery_city || (currentQuote?.quote_request as any)?.delivery_city || "Chittagong Port";
            const routeText = origin && destination ? origin + " → " + destination : (origin || destination || "Plot 42, Gazipur Industrial Area, Dhaka");

            const rawAmt = sq.amount_raw || parseFloat(String(sq.amount || 0).replace(/[^0-9.]/g, "")) || 0;
            const ratingNum = Number(sq.rating ?? sq.supplier?.rating ?? 5.0);
            const transitText = sq.transit || sq.deliveryDate || sq.estimated_delivery || sq.estimated_time || sq.transit_time || "48h";

            return {
                ...sq,
                rawId,
                quoteId: quoteText,
                requestId: reqIdText,
                quote_id: quoteText,
                request_id: reqIdText,
                quote_request_id: reqIdVal,
                pickup: origin,
                delivery: destination,
                route: routeText,
                vehicle: sq.vehicle || sq.vehicle_type || (sq.quote_request as any)?.vehicle_type || "Covered Van (14ft)",
                vehicleType: sq.vehicle || sq.vehicle_type || (sq.quote_request as any)?.vehicle_type || "Covered Van (14ft)",
                amount: sq.amount || (rawAmt ? "€" + rawAmt.toLocaleString() + " EUR" : "€120,000.00 EUR"),
                deliveryStatus: deliveryStatus as any,
                status: deliveryStatus,
                date: sq.created_at || sq.date || "06 Oct 2026",
                transit: transitText,
                numericAmount: rawAmt,
                numericRating: ratingNum,
            };
        });
    }, [siblingQuotes, currentQuote]);

    // Find highlights (minimum price, highest rating)
    const minPrice = useMemo(() => {
        const valid = formattedQuotes.map(q => q.numericAmount).filter(a => a > 0);
        return valid.length > 0 ? Math.min(...valid) : 0;
    }, [formattedQuotes]);

    const maxRating = useMemo(() => {
        const valid = formattedQuotes.map(q => q.numericRating).filter(r => r > 0);
        return valid.length > 0 ? Math.max(...valid) : 5.0;
    }, [formattedQuotes]);

    // Apply Filter & Sorting
    const sortedQuotes = useMemo(() => {
        let list = [...formattedQuotes];

        if (activeFilter === "cheapest") {
            list.sort((a, b) => (a.numericAmount || 99999999) - (b.numericAmount || 99999999));
        } else if (activeFilter === "fastest") {
            list.sort((a, b) => getTransitHours(a) - getTransitHours(b));
        } else if (activeFilter === "rating") {
            list = list.filter(q => q.numericRating >= 4.0 || list.length <= 1);
            list.sort((a, b) => (b.numericRating || 0) - (a.numericRating || 0));
        }

        return list;
    }, [formattedQuotes, activeFilter]);

    // Enhanced columns with Best Price and Top Rated badges
    const columns: Column<any>[] = useMemo(() => [
        {
            id: "quoteId",
            label: "Quote ID",
            sortable: true,
            className: "w-[95px] min-w-[90px]",
            render: (row) => <QuotesReceivedQuoteIdCell row={row} onNavigate={(path) => onSelectQuote(row, "pricing")} />,
        },
        {
            id: "requestId",
            label: "Requested ID",
            sortable: true,
            className: "w-[95px] min-w-[90px]",
            render: (row) => <QuotesReceivedRequestIdCell row={row} onNavigate={navigate} />,
        },
        {
            id: "supplier",
            label: "Supplier",
            sortable: true,
            className: "w-[150px] min-w-[140px]",
            render: (row) => {
                const isTopRated = row.numericRating === maxRating && maxRating >= 4.5 && formattedQuotes.length > 1;
                return (
                    <div className="flex flex-col">
                        <QuotesReceivedSupplierCell row={row} />
                        {isTopRated && (
                            <span className="inline-flex items-center gap-0.5 text-[9.5px] font-bold text-amber-700 bg-amber-50 border border-amber-200/80 px-1 py-0.2 rounded w-fit mt-0.5">
                                ⭐ Top Rated ({row.numericRating})
                            </span>
                        )}
                    </div>
                );
            },
        },
        {
            id: "route",
            label: "Route / Location",
            sortable: false,
            className: "w-[180px] min-w-[170px]",
            render: (row) => {
                const addr = row.pickup || row.delivery || row.route || (row.origin && row.destination ? row.origin + " → " + row.destination : "—");
                return <QuotesReceivedAddressCell address={addr} />;
            },
        },
        {
            id: "vehicle",
            label: "Vehicle",
            sortable: true,
            className: "w-[110px] min-w-[100px]",
            render: (row) => {
                const veh = row.vehicle || row.vehicleType || row.vehicle_type || "Covered Van (20ft)";
                return <QuotesReceivedVehicleCell vehicle={veh} />;
            },
        },
        {
            id: "amount",
            label: "Quote Amount",
            sortable: true,
            className: "w-[130px] min-w-[120px]",
            render: (row) => {
                const isBestPrice = row.numericAmount === minPrice && minPrice > 0 && formattedQuotes.length > 1;
                return (
                    <div className="flex flex-col">
                        <span className="font-extrabold text-slate-900 dark:text-slate-100 text-[12.5px]">
                            {row.amount}
                        </span>
                        {isBestPrice && (
                            <span className="inline-flex items-center gap-0.5 text-[9.5px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1 py-0.2 rounded w-fit mt-0.5">
                                🏷️ Lowest Price
                            </span>
                        )}
                    </div>
                );
            },
        },
        {
            id: "deliveryStatus",
            label: "Status",
            sortable: true,
            className: "w-[115px] min-w-[110px]",
            render: (row) => {
                const isCurrent = row.id === currentQuote.id;
                return (
                    <div className="flex items-center gap-1.5">
                        <span className={"inline-flex items-center px-2 py-0.5 text-[11px] font-bold rounded-[3px] border " + (
                            isCurrent
                                ? "bg-blue-50 text-blue-700 border-blue-200"
                                : "bg-slate-100 text-slate-700 border-slate-200"
                        )}>
                            {isCurrent ? "Selected Quote" : "Available"}
                        </span>
                    </div>
                );
            },
        },
        {
            id: "date",
            label: "Date",
            sortable: true,
            className: "w-[100px] min-w-[90px]",
            render: (row) => <QuotesReceivedDateCell row={row} />,
        },
    ], [currentQuote, formattedQuotes, minPrice, maxRating, navigate, onSelectQuote]);

    return (
        <div className="space-y-3.5 animate-in fade-in duration-300">
            {/* Header Tab Title & Quick Sort Filters */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-1 border-b border-slate-100 dark:border-slate-800">
                <TabHeader
                    title={"Suppliers Quoted (" + formattedQuotes.length + ")"}
                    icon={Layers}
                />

                {/* Filter & Sorting Pills: Cheapest Price, Earliest, Rating-wise */}
                <div className="flex items-center gap-1.5 flex-wrap">
                    <button
                        type="button"
                        onClick={() => setActiveFilter("all")}
                        className={"px-2.5 py-1 rounded-[4px] text-xs font-bold transition-all cursor-pointer " + (
                            activeFilter === "all"
                                ? "bg-slate-900 text-white shadow-2xs"
                                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                        )}
                    >
                        All Quotes ({formattedQuotes.length})
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveFilter("cheapest")}
                        className={"px-2.5 py-1 rounded-[4px] text-xs font-bold transition-all cursor-pointer flex items-center gap-1 " + (
                            activeFilter === "cheapest"
                                ? "bg-emerald-600 text-white shadow-2xs"
                                : "bg-white border border-slate-200 text-emerald-700 hover:bg-emerald-50"
                        )}
                        title="Sort by lowest quote amount"
                    >
                        <Tag size={12} />
                        <span>Cheapest Price</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveFilter("fastest")}
                        className={"px-2.5 py-1 rounded-[4px] text-xs font-bold transition-all cursor-pointer flex items-center gap-1 " + (
                            activeFilter === "fastest"
                                ? "bg-blue-600 text-white shadow-2xs"
                                : "bg-white border border-slate-200 text-blue-700 hover:bg-blue-50"
                        )}
                        title="Sort by earliest delivery & fastest transit time"
                    >
                        <Zap size={12} />
                        <span>Earliest / Fastest</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveFilter("rating")}
                        className={"px-2.5 py-1 rounded-[4px] text-xs font-bold transition-all cursor-pointer flex items-center gap-1 " + (
                            activeFilter === "rating"
                                ? "bg-amber-600 text-white shadow-2xs"
                                : "bg-white border border-slate-200 text-amber-700 hover:bg-amber-50"
                        )}
                        title="Sort by highest rated suppliers"
                    >
                        <Star size={12} />
                        <span>Top Rated</span>
                    </button>
                </div>
            </div>

            {/* Comparison Overview Helper Alert */}
            {formattedQuotes.length > 1 && (
                <div className="bg-orange-50/70 border border-orange-200/80 rounded-[4px] px-3 py-2 flex items-center justify-between text-xs text-orange-950">
                    <div className="flex items-center gap-2">
                        <CheckCircle size={15} className="text-[#ff4a1f] shrink-0" />
                        <span>
                            <strong>{formattedQuotes.length} suppliers</strong> submitted competitive quotes for this shipment request. Compare rates, ratings, and delivery times below.
                        </span>
                    </div>
                    {minPrice > 0 && (
                        <span className="font-bold text-emerald-700 shrink-0 ml-2">
                            Lowest: €{minPrice.toLocaleString()}
                        </span>
                    )}
                </div>
            )}

            {/* Standard DataTable matching Won Quotes & Quotes Received */}
            <DataTable
                data={sortedQuotes}
                columns={columns}
                actions={(row) => (
                    <div className="flex items-center justify-end gap-1.5">
                        <button
                            type="button"
                            onClick={() => onSelectQuote(row as any, "pricing")}
                            className="px-2.5 py-1 rounded-[3px] bg-[#ff4a1f] hover:bg-[#e03e15] text-white text-xs font-bold flex items-center gap-1 transition-all shadow-2xs cursor-pointer"
                        >
                            <span>Inspect & Accept</span>
                            <ArrowRight size={11} />
                        </button>
                    </div>
                )}
                actionsColumnClassName="w-[160px] min-w-[155px] text-right"
                searchPlaceholder="Search carrier quotes by ID, supplier, route..."
                compact={true}
                tableLayout="fixed"
                tableClassName="min-w-[1050px]"
                onRowClick={(row) => onSelectQuote(row, "pricing")}
                emptyState={
                    <EmptyState
                        icon={Trophy}
                        title="No Carrier Quotes Found"
                        description="No carrier quotes match the selected filter criteria."
                    />
                }
            />
        </div>
    );
};
