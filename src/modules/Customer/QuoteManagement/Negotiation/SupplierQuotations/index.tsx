import { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MessageSquare } from "lucide-react";
import DataTable from "@/components/tables/data-table";
import EmptyState from "@/components/tables/empty-state";
import { encryptId } from "@/lib/encryption";
import { useCustomerNegotiations } from "../hooks/useCustomerNegotiations";
import { CustomerNegotiationItem } from "../types";
import { getNegotiationColumns } from "../components/columns";
import { NegotiationRowActions } from "../components/NegotiationRowActions";
import { SupplierQuotationsHeader } from "./components/SupplierQuotationsHeader";
import { SupplierQuotationsMetrics } from "./components/SupplierQuotationsMetrics";

export default function SupplierQuotationsPage() {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const [isRefreshing, setIsRefreshing] = useState(false);
    const { negotiations = [], isLoading = false, fetchNegotiations } = useCustomerNegotiations() || {};

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
            <SupplierQuotationsHeader
                supplierName={supplierInfo.name}
                firstRawId={supplierInfo.firstRawId}
                isRefreshing={isRefreshing}
                onBack={() => navigate(supplierInfo.firstRawId ? `/customer/quotes/negotiation/conversation/${encryptId(supplierInfo.firstRawId)}` : "/customer/quotes/negotiation")}
                onOpenChat={() => supplierInfo.firstRawId && navigate(`/customer/quotes/negotiation/conversation/${encryptId(supplierInfo.firstRawId)}`)}
                onRefresh={handleRefresh}
            />

            <SupplierQuotationsMetrics
                supplierInfo={supplierInfo}
                isLoading={isLoading}
            />

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
