import React, { useState, useEffect, useMemo } from "react";
import {
    Clock,
    Receipt,
    Copy,
    Check,
    ShieldCheck,
    ChevronRight,
    CheckCircle2,
    AlertCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import DataTable, { Column } from "@/components/tables/data-table";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import EmptyState from "@/components/tables/empty-state";
import apiClient from "@/lib/axios";
import { formatDisplayDate } from "@/lib/utils";
import InvoiceView from "../Invoices/View";
import { exportInvoicePdf, openInvoicePreview } from "@/utils/exportInvoicePdf";
import RatingModal from "@/components/modals/rating-modal";
import InvoiceRowActions from "../Invoices/components/InvoiceRowActions";

export default function Billing() {
    const navigate = useNavigate();
    const [invoices, setInvoices] = useState<any[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [subscription, setSubscription] = useState<any>(null);
    const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);
    const [statusFilter, setStatusFilter] = useState<"All" | "Paid" | "Due" | "Overdue">("All");
    const [ratingTarget, setRatingTarget] = useState<{ id: string; supplier: string } | null>(null);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const fetchBillingData = async () => {
        setIsLoading(true);
        try {
            const [invoiceRes, subRes] = await Promise.allSettled([
                apiClient.get("/customer/invoices"),
                apiClient.get("/subscription/status"),
            ]);

            if (invoiceRes.status === "fulfilled" && invoiceRes.value) {
                const resData = invoiceRes.value.data || invoiceRes.value;
                const list = resData?.data?.items || resData?.items || (Array.isArray(resData?.data) ? resData?.data : null) || resData?.invoices?.data || resData?.invoices || (Array.isArray(resData) ? resData : []);
                setInvoices(Array.isArray(list) ? list : []);
                setStats(resData?.data?.stats || resData?.stats || resData?.meta?.stats || null);
            } else {
                setInvoices([]);
            }

            if (subRes.status === "fulfilled" && subRes.value) {
                const subData = subRes.value.data || subRes.value;
                setSubscription(subData?.data || subData || null);
            }
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
            const rawAmount = typeof inv.total_amount === 'number'
                ? inv.total_amount
                : typeof inv.amount === 'number'
                    ? inv.amount
                    : parseFloat(String(inv.total_amount || inv.amount || '0').replace(/[^0-9.-]+/g, '')) || 0;

            const st = (inv.raw_status || inv.status || '').toLowerCase().trim();
            if (st === 'paid' || st === 'settled') {
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
        <div className="p-3 sm:p-4 md:p-6 w-full mx-auto min-h-screen space-y-4 font-sans text-slate-800 dark:text-slate-200 antialiased">
            {/* Header section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight mb-1">Billing & Invoicing Overview</h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        Manage your subscription, invoices, outstanding balances, and payment preferences.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        onClick={() => navigate("/customer/finance/invoices")}
                        className="h-8 text-xs font-bold bg-white dark:bg-[#1e2329] text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700 cursor-pointer flex items-center gap-1.5"
                    >
                        <span>All Invoices</span>
                        <ChevronRight size={13} />
                    </Button>
                    <Button
                        variant="primary"
                        onClick={() => navigate("/customer/subscription")}
                        className="h-8 text-xs font-bold bg-[#ff4a1f] hover:bg-[#e03e15] text-white cursor-pointer"
                    >
                        Subscription Plans
                    </Button>
                </div>
            </div>

            {/* Content grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

                {/* Active Subscription Summary */}
                <div className="xl:col-span-2 bg-white dark:bg-[#1a1f26] p-4 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                    <div>
                        <div className="flex justify-between items-start mb-3 border-b border-slate-100 dark:border-slate-800/60 pb-2.5">
                            <div>
                                <span className="text-[10px] font-extrabold tracking-wider text-[#ff4a1f]">Current Active Plan</span>
                                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                                    {subscription?.plan_name || subscription?.name || "Shipper Basic"}
                                </h2>
                            </div>
                            <Badge variant={subscription?.status === "active" ? "success" : "warning"} className="px-2.5 py-0.5 text-xs font-bold">
                                {subscription?.status ? ucfirst(subscription.status) : "Active"}
                            </Badge>
                        </div>

                        <p className="text-xs text-slate-600 dark:text-slate-400 mb-4">
                            Full access to spot quote requests, cargo tracking, supplier negotiations, and digital invoices.
                        </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800/60 flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                            <Clock size={14} className="text-slate-400" />
                            <span>Billing Cycle: Monthly</span>
                        </div>
                        <Button
                            variant="primary"
                            onClick={() => navigate("/customer/subscription")}
                            className="h-8 text-xs font-bold bg-[#ff4a1f] hover:bg-[#e03e15] text-white cursor-pointer"
                        >
                            Upgrade / Change Plan
                        </Button>
                    </div>
                </div>

                {/* Outstanding & Stats Card */}
                <div className="bg-white dark:bg-[#1a1f26] p-4 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60 pb-2 mb-3">
                        <h2 className="text-[13px] font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                            <Receipt size={14} className="text-[#ff4a1f]" /> Billing & Invoice Summary
                        </h2>
                        <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                            {calculatedStats.totalInvoices} {calculatedStats.totalInvoices === 1 ? 'Invoice' : 'Invoices'}
                        </span>
                    </div>

                    <div className="space-y-2.5">
                        <div className="flex justify-between items-center p-2 rounded-md bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-800/30">
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                                    <CheckCircle2 size={13} />
                                </div>
                                <div>
                                    <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400 block leading-tight">Total Paid</span>
                                    <span className="text-[10px] text-slate-400 dark:text-slate-500">{calculatedStats.paidCount} paid invoices</span>
                                </div>
                            </div>
                            <span className="font-bold text-slate-900 dark:text-slate-100 text-xs">
                                {calculatedStats.totalSpentFormatted}
                            </span>
                        </div>

                        <div className="flex justify-between items-center p-2 rounded-md bg-rose-50/60 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-800/30">
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                                    <AlertCircle size={13} />
                                </div>
                                <div>
                                    <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400 block leading-tight">Outstanding Due</span>
                                    <span className="text-[10px] text-slate-400 dark:text-slate-500">{calculatedStats.dueCount} pending invoices</span>
                                </div>
                            </div>
                            <span className={`font-bold text-xs ${calculatedStats.hasOutstanding ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-slate-100'}`}>
                                {calculatedStats.totalOutstandingFormatted}
                            </span>
                        </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/60 text-center">
                        <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium flex items-center justify-center gap-1.5">
                            <ShieldCheck size={13} className="text-emerald-500" />
                            All payments secured with 256-bit SSL encryption
                        </p>
                    </div>
                </div>
            </div>

            {/* Invoices History Table with Negotiation-style columns & design */}
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        <Receipt size={16} className="text-[#ff4a1f]" /> Recent Billing History
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
                            title="No Billing History Found"
                            description="There are no billing transactions or invoices associated with your account yet."
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

function ucfirst(str: string) {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
}
