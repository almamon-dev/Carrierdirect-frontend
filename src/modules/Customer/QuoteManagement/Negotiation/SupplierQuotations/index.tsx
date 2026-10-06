import React, { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    MessageSquare,
    RefreshCw,
    BadgeCheck,
    FileText,
    CheckCircle2,
    Clock,
    Activity,
    Radio
} from "lucide-react";
import DataTable from "@/components/tables/data-table";
import EmptyState from "@/components/tables/empty-state";
import Button from "@/components/ui/button";
import MetricCard from "@/components/cards/metric-card";
import { encryptId } from "@/lib/encryption";
import { useCustomerNegotiations } from "../hooks/useCustomerNegotiations";
import { CustomerNegotiationItem } from "../types";
import { getNegotiationColumns } from "../components/columns";
import { NegotiationRowActions } from "../components/NegotiationRowActions";

export default function SupplierQuotationsPage() {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const [isRefreshing, setIsRefreshing] = useState(false);
    const { negotiations = [], isLoading = false, fetchNegotiations } = useCustomerNegotiations() || {};

    // Filter negotiations matching this supplier slug or ID
    const supplierQuotes = useMemo(() => {
        if (!slug || !negotiations.length) return [];
        const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9]/g, "");

        return negotiations.filter(n => {
            const nameSlug = (n.supplier || n.customer || "").toLowerCase().replace(/[^a-z0-9]/g, "");
            const senderIdStr = String((n as any).raw?.sender_id || (n as any).raw?.user_id || (n as any).raw?.supplier_id || "");
            return nameSlug === cleanSlug || nameSlug.includes(cleanSlug) || cleanSlug.includes(nameSlug) || senderIdStr === slug;
        });
    }, [negotiations, slug]);

    const supplierInfo = useMemo(() => {
        const first = supplierQuotes[0] || negotiations.find(n => {
            const nameSlug = (n.supplier || n.customer || "").toLowerCase().replace(/[^a-z0-9]/g, "");
            return nameSlug.includes((slug || "").toLowerCase().replace(/[^a-z0-9]/g, ""));
        });

        const isOnline = Boolean(first?.isOnline);

        return {
            name: first?.supplier || first?.customer || (slug ? slug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase()) : "Carrier Partner"),
            avatar: first?.supplierAvatar || first?.customerAvatar || "",
            isOnline: isOnline,
            lastSeenHuman: first?.lastSeenHuman || (isOnline ? "Active Now" : "Offline"),
            totalQuotes: supplierQuotes.length,
            acceptedQuotes: supplierQuotes.filter(q => q.status === "Accepted").length,
            pendingQuotes: supplierQuotes.filter(q => q.status === "Pending" || q.status === "Counter Received").length,
            firstRawId: first?.rawId,
        };
    }, [supplierQuotes, negotiations, slug]);

    const handleQuoteAction = (row: CustomerNegotiationItem) => {
        navigate(`/customer/quotes/negotiation/conversation/${encryptId(row?.rawId || row?.id || "")}`);
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
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1 border-b border-slate-200/60 dark:border-slate-800">
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full hover:bg-slate-200/70 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors -ml-1 cursor-pointer shrink-0"
                        onClick={() => navigate(supplierInfo.firstRawId ? `/customer/quotes/negotiation/conversation/${encryptId(supplierInfo.firstRawId)}` : "/customer/quotes/negotiation")}
                        title="Back to Negotiation Chat"
                    >
                        <ArrowLeft size={18} />
                    </Button>
                    <div>
                        <div className="flex items-center gap-1.5">
                            <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight leading-none">
                                {supplierInfo.name}
                            </h1>
                            <BadgeCheck size={16} className="text-[#FF4A1F] shrink-0" />
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
                            All quotations and price counter offers submitted by this carrier partner.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                    {supplierInfo.firstRawId && (
                        <button
                            type="button"
                            onClick={() => navigate(`/customer/quotes/negotiation/conversation/${encryptId(supplierInfo.firstRawId)}`)}
                            className="h-8.5 px-3.5 bg-[#FF4A1F] hover:bg-[#e03f19] text-white text-xs font-semibold rounded-[4px] flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                        >
                            <MessageSquare size={13.5} />
                            <span>Open Active Chat</span>
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={handleRefresh}
                        disabled={isRefreshing}
                        className="h-8.5 px-3 bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-[4px] flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer shrink-0 disabled:opacity-60"
                    >
                        <RefreshCw size={13} className={isRefreshing ? "animate-spin text-[#ff4a1f]" : "text-slate-500"} />
                        <span>{isRefreshing ? "Refreshing..." : "Refresh"}</span>
                    </button>
                </div>
            </div>

            {/* Summary Metrics Cards with Descriptions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <MetricCard
                    title="Total Quotations"
                    value={supplierInfo.totalQuotes}
                    description="All submitted quotes & offers"
                    icon={FileText}
                    colorClass="bg-orange-50 dark:bg-orange-950/40 text-[#FF4A1F]"
                    isLoading={isLoading}
                />
                <MetricCard
                    title="Accepted Quotes"
                    value={supplierInfo.acceptedQuotes}
                    description="Confirmed & booked agreements"
                    icon={CheckCircle2}
                    colorClass="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600"
                    isLoading={isLoading}
                />
                <MetricCard
                    title="Pending / Counter"
                    value={supplierInfo.pendingQuotes}
                    description="Quotes awaiting decision or counter"
                    icon={Clock}
                    colorClass="bg-amber-50 dark:bg-amber-950/40 text-amber-600"
                    isLoading={isLoading}
                />
                <MetricCard
                    title="Partner Status"
                    value={supplierInfo.lastSeenHuman}
                    description={supplierInfo.isOnline ? "Carrier is currently online & responsive" : "Carrier is currently offline"}
                    icon={supplierInfo.isOnline ? Radio : Activity}
                    colorClass={
                        supplierInfo.isOnline
                            ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                    }
                    valueClassName={
                        supplierInfo.isOnline
                            ? "text-[16px] sm:text-[18px] font-bold text-emerald-600 dark:text-emerald-400"
                            : "text-[16px] sm:text-[18px] font-bold text-slate-500 dark:text-slate-400"
                    }
                    badge={
                        <span className="flex items-center gap-1 text-[11px] font-medium">
                            <span
                                className={`w-2 h-2 rounded-full ${
                                    supplierInfo.isOnline ? "bg-emerald-500 animate-pulse" : "bg-slate-400 dark:bg-slate-600"
                                }`}
                            />
                            <span className={supplierInfo.isOnline ? "text-emerald-600 font-semibold" : "text-slate-400"}>
                                {supplierInfo.isOnline ? "Online" : "Offline"}
                            </span>
                        </span>
                    }
                    isLoading={isLoading}
                />
            </div>

            {/* Quotations Data Table */}
            <DataTable
                data={supplierQuotes || []}
                columns={columns}
                actions={(row) => <NegotiationRowActions row={row} onQuoteAction={handleQuoteAction} />}
                keyExtractor={(item) => item?.id || Math.random().toString()}
                searchPlaceholder="Search quotations for this supplier..."
                compact={true}
                hideViewToggle={false}
                isLoading={isLoading || isRefreshing}
                onRowClick={(row) => handleQuoteAction(row)}
                tableLayout="fixed"
                tableClassName="min-w-[1180px]"
                actionsColumnClassName="w-[130px] min-w-[130px]"
                emptyState={
                    <EmptyState
                        icon={MessageSquare}
                        title="No Quotations Found"
                        description={`There are no active quotations from ${supplierInfo.name}.`}
                    />
                }
            />
        </div>
    );
}
