import RatingModal from "@/components/modals/rating-modal";
import DataTable, { Column } from "@/components/tables/data-table";
import EmptyState from "@/components/tables/empty-state";
import MetricCard from "@/components/cards/metric-card";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import apiClient from "@/lib/axios";
import { formatDisplayDate } from "@/lib/utils";
import { openInvoicePreview } from "@/utils/exportInvoicePdf";
import {
    AlertCircle,
    Check,
    CheckCircle2,
    Copy,
    FileText,
    Receipt,
    RefreshCw,
    Wallet
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import InvoiceRowActions from "../Invoices/components/InvoiceRowActions";
import InvoiceView from "../Invoices/View";

export default function Billing() {
    const navigate = useNavigate();
    const [invoices, setInvoices] = useState<any[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);
    const [statusFilter, setStatusFilter] = useState<"All" | "Paid" | "Due" | "Overdue">("All");
    const [ratingTarget, setRatingTarget] = useState<{ id: string; supplier: string } | null>(null);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const fetchBillingData = async () => {
        setIsLoading(true);
        try {
            const invoiceRes = await apiClient.get("/customer/invoices");
            const resData = invoiceRes?.data || invoiceRes;
            const list = resData?.data?.items || resData?.items || (Array.isArray(resData?.data) ? resData?.data : null) || resData?.invoices?.data || resData?.invoices || (Array.isArray(resData) ? resData : []);
            setInvoices(Array.isArray(list) ? list : []);
            setStats(resData?.data?.stats || resData?.stats || resData?.meta?.stats || null);
        } catch (error) {
            console.error("Failed to load billing data:", error);
            setInvoices([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBillingData();
    }, []);

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(text);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleDownload = async (row: any) => {
        openInvoicePreview(row);
    };

    if (selectedInvoice) {
        return <InvoiceView invoice={selectedInvoice} onBack={() => setSelectedInvoice(null)} />;
    }

    const calculatedStats = useMemo(() => {
        let totalSpent = 0;
        let totalOutstanding = 0;
        let paidCount = 0;
        let dueCount = 0;

        invoices.forEach(inv => {
            const rawAmount = typeof inv.total_amount === "number"
                ? inv.total_amount
                : typeof inv.amount === "number"
                    ? inv.amount
                    : parseFloat(String(inv.total_amount || inv.amount || "0").replace(/[^0-9.-]+/g, "")) || 0;

            const st = (inv.raw_status || inv.status || "").toLowerCase().trim();
            if (st === "paid" || st === "settled") {
                totalSpent += rawAmount;
                paidCount += 1;
            } else {
                totalOutstanding += rawAmount;
                dueCount += 1;
            }
        });

        return {
            totalSpentFormatted: `€ ${totalSpent.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            totalOutstandingFormatted: `€ ${totalOutstanding.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            totalInvoices: invoices.length,
            paidCount,
            dueCount,
            hasOutstanding: totalOutstanding > 0,
        };
    }, [invoices]);

    const filteredInvoices = invoices.filter(invoice => {
        if (statusFilter === "All") return true;
        const st = (invoice.raw_status || invoice.status || "").toLowerCase();
        if (statusFilter === "Paid") return st === "paid";
        if (statusFilter === "Due") return st === "due" || st === "pending";
        if (statusFilter === "Overdue") return st === "overdue";
        return true;
    });

    const columns: Column<any>[] = [
        {
            id: "id",
            label: "Invoice No.",
            sortable: true,
            className: "w-[95px] whitespace-nowrap",
            render: (row) => {
                const invNumber = row.invoice_number || (row.id ? `INV-${String(row.id).padStart(4, "0")}` : "INV-0001");
                const isCopied = copiedId === invNumber;
                return (
                    <div className="flex items-center gap-1.5 group min-h-[22px]">
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedInvoice(row);
                            }}
                            className="font-bold text-[#ff4a1f] hover:underline cursor-pointer text-left text-xs whitespace-nowrap"
                        >
                            {invNumber}
                        </button>
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleCopy(invNumber);
                            }}
                            className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
                            title="Copy Invoice Number"
                        >
                            {isCopied ? <Check size={11} className="text-emerald-600" /> : <Copy size={11} />}
                        </button>
                    </div>
                );
            }
        },
        {
            id: "order",
            label: "Order Ref",
            sortable: true,
            className: "w-[90px] whitespace-nowrap",
            render: (row) => {
                const ordNumber = row.order_number || (row.order_id ? `ORD-${String(row.order_id).padStart(4, "0")}` : "N/A");
                return (
                    <div className="flex items-center min-h-[22px]">
                        {row.order_id ? (
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/customer/orders/${row.order_id}`);
                                }}
                                className="font-semibold text-slate-700 dark:text-slate-300 hover:text-[#ff4a1f] hover:underline cursor-pointer text-xs whitespace-nowrap"
                            >
                                {ordNumber}
                            </button>
                        ) : (
                            <span className="text-slate-500 dark:text-slate-400 text-xs">{ordNumber}</span>
                        )}
                    </div>
                );
            }
        },
        {
            id: "customer",
            label: "Supplier",
            sortable: true,
            className: "whitespace-nowrap",
            render: (row) => {
                const supplierName = row.supplier_name || row.carrier || "Carrier Direct";
                const initial = supplierName.charAt(0).toUpperCase();
                return (
                    <div className="flex items-center gap-1.5 whitespace-nowrap min-w-0 min-h-[22px]">
                        <div className="w-4.5 h-4.5 min-w-[18px] min-h-[18px] aspect-square rounded-full bg-orange-100 dark:bg-[#ff4a1f]/20 border border-orange-200/60 dark:border-orange-500/20 text-[#ff4a1f] flex items-center justify-center text-[9.5px] font-bold shrink-0">
                            <span>{initial}</span>
                        </div>
                        <span className="font-semibold text-slate-900 dark:text-slate-100 text-xs whitespace-nowrap" title={supplierName}>
                            {supplierName}
                        </span>
                    </div>
                );
            }
        },
        {
            id: "route",
            label: "Pickup & Delivery",
            className: "min-w-[160px]",
            render: (row) => {
                const pickup = row.pickup_address || row.pickup || row.pickup_city || row.from || "Pickup Location";
                const delivery = row.delivery_address || row.delivery || row.delivery_city || row.to || "Delivery Location";
                return (
                    <div className="flex flex-col justify-center gap-0.5 py-0.5 min-w-0">
                        <div className="flex items-center gap-1.5 min-w-0" title={`Pickup: ${pickup}`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                            <span className="font-medium text-slate-800 dark:text-slate-200 text-xs truncate">
                                {pickup}
                            </span>
                        </div>
                        <div className="flex items-center gap-1.5 min-w-0" title={`Delivery: ${delivery}`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-[#ff4a1f] shrink-0" />
                            <span className="text-slate-500 dark:text-slate-400 text-xs truncate">
                                {delivery}
                            </span>
                        </div>
                    </div>
                );
            }
        },
        {
            id: "date",
            label: "Issue Date",
            sortable: true,
            className: "w-[95px] text-center whitespace-nowrap",
            render: (row) => (
                <div className="flex items-center justify-center min-h-[22px]">
                    <span className="text-slate-500 dark:text-slate-400 whitespace-nowrap text-xs font-medium">
                        {formatDisplayDate(row.issue_date || row.issueDate || row.created_at || row.date)}
                    </span>
                </div>
            )
        },
        {
            id: "dueDate",
            label: "Due Date",
            sortable: true,
            className: "w-[95px] text-center whitespace-nowrap",
            render: (row) => {
                const rawSt = (row.raw_status || row.status || "").toLowerCase();
                const isDue = rawSt === "due" || rawSt === "overdue" || rawSt === "pending";
                return (
                    <div className="flex items-center justify-center min-h-[22px]">
                        <span className={`whitespace-nowrap text-xs font-medium ${rawSt === "overdue" ? "text-rose-600 dark:text-rose-400 font-bold" : isDue ? "text-amber-700 dark:text-amber-400 font-semibold" : "text-slate-600 dark:text-slate-400"
                            }`}>
                            {formatDisplayDate(row.due_date || row.dueDate, "30 Days")}
                        </span>
                    </div>
                );
            }
        },
        {
            id: "amount",
            label: "Amount",
            sortable: true,
            className: "w-[110px] text-right whitespace-nowrap",
            render: (row) => (
                <div className="flex items-center justify-end min-h-[22px]">
                    <span className="font-bold text-slate-900 dark:text-slate-100 whitespace-nowrap text-xs">
                        {row.amount || row.total_amount_formatted || (row.total_amount ? `€ ${(row.total_amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}` : "€ 0.00")}
                    </span>
                </div>
            )
        },
        {
            id: "status",
            label: "Status",
            sortable: true,
            className: "w-[90px] text-center whitespace-nowrap",
            render: (row) => {
                const st = (row.raw_status || row.status || "").toLowerCase();
                return (
                    <div className="flex items-center justify-center min-h-[22px]">
                        {st === "paid" ? (
                            <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60 text-[9.5px] px-1.5 py-0.25 font-semibold whitespace-nowrap">
                                Paid
                            </Badge>
                        ) : st === "due" || st === "pending" ? (
                            <Badge className="bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60 text-[9.5px] px-1.5 py-0.25 font-semibold whitespace-nowrap">
                                Due
                            </Badge>
                        ) : st === "overdue" ? (
                            <Badge className="bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/60 text-[9.5px] px-1.5 py-0.25 font-bold whitespace-nowrap">
                                Overdue
                            </Badge>
                        ) : (
                            <Badge variant="default" className="text-[9.5px] px-1.5 py-0.25 font-semibold whitespace-nowrap">
                                {row.status || "Pending"}
                            </Badge>
                        )}
                    </div>
                );
            }
        }
    ];

    const actions = (row: any) => (
        <InvoiceRowActions
            row={row}
            onView={(r) => setSelectedInvoice(r)}
            onDownload={(r) => handleDownload(r)}
            onRate={(target) => setRatingTarget(target)}
        />
    );

    const filterContent = (
        <div className="flex flex-wrap items-center gap-3 py-1">
            <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Filter By Status</label>
                <div className="flex items-center gap-1.5">
                    {(["All", "Paid", "Due", "Overdue"] as const).map((tab) => {
                        const count = tab === "All" ? invoices.length : invoices.filter(i => {
                            const st = (i.raw_status || i.status || "").toLowerCase();
                            if (tab === "Paid") return st === "paid";
                            if (tab === "Due") return st === "due" || st === "pending";
                            if (tab === "Overdue") return st === "overdue";
                            return true;
                        }).length;
                        const isActive = statusFilter === tab;
                        return (
                            <button
                                key={tab}
                                type="button"
                                onClick={() => setStatusFilter(tab)}
                                className={`px-2.5 py-1 rounded-md text-[11px] font-bold cursor-pointer transition-all ${isActive
                                    ? "bg-[#ff4a1f] text-white shadow-2xs"
                                    : "bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                                    }`}
                            >
                                {tab} ({count})
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );

    return (
        <div className="p-3.5 md:p-5 w-full mx-auto min-h-screen space-y-3.5 font-sans bg-[#f8fafc] dark:bg-[#12161c] text-slate-800 dark:text-slate-200 antialiased">
            {/* Header section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight mb-1">Billing Overview</h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        Overview of your freight orders, cargo billing, payments, and outstanding invoices.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fetchBillingData()}
                        disabled={isLoading}
                        className="h-8 px-3 text-xs font-semibold flex items-center gap-1.5 cursor-pointer bg-white dark:bg-[#1e2329] border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                        <RefreshCw size={13} className={isLoading ? "animate-spin text-[#ff4a1f]" : "text-slate-500"} />
                        <span>Refresh</span>
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate("/customer/finance/invoices")}
                        className="h-8 text-xs font-semibold bg-white dark:bg-[#1e2329] text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 border-slate-300 dark:border-slate-700 cursor-pointer flex items-center gap-1.5"
                    >
                        <FileText size={13} />
                        <span>All Invoices</span>
                    </Button>
                    <Button
                        variant="primary"
                        size="sm"
                        onClick={() => navigate("/customer/finance/pay-later")}
                        className="h-8 px-3.5 bg-[#ff4a1f] hover:bg-[#e03e15] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                        <Wallet size={13} />
                        <span>Pay Later Facility</span>
                    </Button>
                </div>
            </div>

            {/* Summary Stat Cards using standard MetricCard component */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
                <MetricCard
                    title="Total Spent & Paid"
                    description={`${calculatedStats.paidCount} fully paid invoices`}
                    value={calculatedStats.totalSpentFormatted}
                    icon={CheckCircle2}
                    colorClass="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400"
                    badge={<Badge variant="secondary" className="bg-emerald-50 text-emerald-700 text-[10px] font-semibold border border-emerald-200">Paid</Badge>}
                    valueClassName="text-base sm:text-lg"
                    className="p-2.5 sm:p-3"
                    isLoading={isLoading}
                />
                <MetricCard
                    title="Outstanding & Due"
                    description={`${calculatedStats.dueCount} due awaiting payment`}
                    value={calculatedStats.totalOutstandingFormatted}
                    icon={AlertCircle}
                    colorClass="bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400"
                    badge={<Badge variant="secondary" className="bg-rose-50 text-rose-700 text-[10px] font-semibold border border-rose-200">Due</Badge>}
                    valueClassName="text-base sm:text-lg"
                    className="p-2.5 sm:p-3"
                    isLoading={isLoading}
                />
                <MetricCard
                    title="Total Invoices"
                    description="All freight billing & invoice records"
                    value={calculatedStats.totalInvoices}
                    icon={Receipt}
                    colorClass="bg-orange-50 dark:bg-[#ff4a1f]/15 text-[#ff4a1f]"
                    badge={<Badge variant="secondary" className="bg-slate-100 text-slate-700 text-[10px] font-semibold border border-slate-200">Total</Badge>}
                    valueClassName="text-base sm:text-lg"
                    className="p-2.5 sm:p-3"
                    isLoading={isLoading}
                />
            </div>

            {/* Invoices History Table */}
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        <Receipt size={16} className="text-[#ff4a1f]" /> Recent Freight Invoices
                    </h2>
                </div>

                <DataTable
                    data={filteredInvoices}
                    columns={columns}
                    actions={actions}
                    actionsColumnClassName="w-[50px] min-w-[45px] text-right pr-2"
                    filterContent={filterContent}
                    searchPlaceholder="Search invoices by ID, order, address, or carrier..."
                    compact={true}
                    isLoading={isLoading}
                    emptyState={
                        <EmptyState
                            icon={Receipt}
                            title="No Freight Invoices Found"
                            description="There are no shipping invoices or billing records associated with your account yet."
                        />
                    }
                />
            </div>

            {/* Rating Modal */}
            {ratingTarget && (
                <RatingModal
                    isOpen={Boolean(ratingTarget)}
                    onClose={() => setRatingTarget(null)}
                    orderId={ratingTarget.id}
                    targetName={ratingTarget.supplier}
                    targetRole="Supplier"
                    orderTitle="Logistics Freight Cargo Service"
                    onSubmit={async (data) => {
                        try {
                            await apiClient.post(`/customer/orders/${ratingTarget.id}/rate`, data);
                            fetchBillingData();
                        } catch (err: any) {
                            console.error(err);
                        }
                    }}
                />
            )}
        </div>
    );
}
