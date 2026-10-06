import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Receipt, 
  Download, 
  RefreshCw,
  FileText
} from "lucide-react";
import DataTable from "@/components/tables/data-table";
import Button from "@/components/ui/button";
import EmptyState from "@/components/tables/empty-state";
import apiClient from "@/lib/axios";
import { PaymentRowActions } from "./components/PaymentRowActions";
import { PaymentFilterTabs, PaymentFilterTab } from "./components/PaymentFilterTabs";
import { PaymentFilterContent } from "./components/PaymentFilterContent";
import { getPaymentColumns } from "./components/columns";
import { PaymentDetailsModal } from "./components/PaymentDetailsModal";

export default function SupplierPayments() {
  const navigate = useNavigate();
  const [payments, setPayments] = useState<any[]>([]);
  const [selectedPayment, setSelectedPayment] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Tab & Custom Filters
  const [activeTab, setActiveTab] = useState<PaymentFilterTab>("all");
  const [stageFilter, setStageFilter] = useState("all");
  const [methodFilter, setMethodFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleResetFilters = () => {
    setStageFilter("all");
    setMethodFilter("all");
    setStartDate("");
    setEndDate("");
  };

  const fetchPayments = async (isManualRefresh = false) => {
    if (isManualRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    try {
      const res = await apiClient.get("/supplier/finance/payments").catch(() => apiClient.get("/supplier/payments"));
      const resData = res?.data || res;
      const list = resData?.data?.history 
        || resData?.data?.items 
        || resData?.data?.data 
        || resData?.history 
        || resData?.items 
        || (Array.isArray(resData?.data) ? resData?.data : null) 
        || (Array.isArray(resData) ? resData : []);
      
      setPayments(Array.isArray(list) ? list : []);
    } catch (error) {
      console.error("Failed to fetch supplier payments:", error);
      setPayments([]);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleDownload = async (row: any) => {
    const invId = row.raw_id || row.id;
    if (!invId) {
      alert("No invoice ID associated with this payout.");
      return;
    }
    try {
      const response = await fetch(`${apiClient["baseURL"] || ""}/supplier/finance/invoices/${invId}/download`, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("access_token")}`,
          "Accept": "application/pdf",
        }
      });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Invoice-Receipt-${row.invoice_number || row.id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      console.error("Failed to download payment receipt:", err);
      alert("Failed to download payment receipt.");
    }
  };

  const handleExportCSV = () => {
    if (!filteredPayments || filteredPayments.length === 0) return;
    const headers = ["Invoice #", "Order Ref", "Customer", "Route", "Date", "Net Earnings", "Gross Amount", "Payment Terms", "Settlement Stage"];
    const csvRows = [
      headers.join(","),
      ...filteredPayments.map((p) => [
        `"${p.invoice_number || p.id || ""}"`,
        `"${p.order_number || p.order_id || ""}"`,
        `"${p.customer_company || p.customer_name || ""}"`,
        `"${p.route || ""}"`,
        `"${p.date || p.issue_date || p.created_at || ""}"`,
        `"${p.supplier_amount_formatted || p.net_amount_formatted || p.amount || ""}"`,
        `"${p.gross_amount_formatted || p.total_amount_formatted || ""}"`,
        `"${p.is_pay_later ? "Pay Later" : "Immediate"}"`,
        `"${p.payment_stage_label || p.status || ""}"`,
      ].join(","))
    ];
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Supplier_Payments_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredPayments = useMemo(() => {
    return payments.filter((item) => {
      const stage = String(item.payment_stage || "").toLowerCase().trim();
      const st = String(item.raw_status || item.status || "").toLowerCase().trim();
      const isPayLater = item.is_pay_later || stage === "pay_later" || st.includes("pay later") || (item.payment_method || "").toLowerCase().includes("pay_later");
      const method = String(item.payment_method || "").toLowerCase().trim();

      // Header Tab filter
      if (activeTab === "cleared") {
        if (!item.is_cleared && stage !== "cleared" && st !== "paid" && st !== "cleared" && st !== "released") return false;
      } else if (activeTab === "escrow") {
        if (!item.is_in_escrow && stage !== "escrow" && stage !== "in_escrow") return false;
      } else if (activeTab === "pay_later") {
        if (!isPayLater) return false;
      } else if (activeTab === "pending") {
        if (item.is_cleared || (stage !== "unpaid" && st !== "pending" && st !== "due")) return false;
      }

      // Dropdown Stage filter
      if (stageFilter !== "all") {
        if (stageFilter === "cleared" && !item.is_cleared && stage !== "cleared" && st !== "cleared") return false;
        if (stageFilter === "escrow" && !item.is_in_escrow && stage !== "in_escrow") return false;
        if (stageFilter === "pay_later" && !isPayLater) return false;
        if (stageFilter === "pending" && (item.is_cleared || (stage !== "unpaid" && st !== "pending"))) return false;
      }

      // Dropdown Method filter
      if (methodFilter !== "all") {
        if (methodFilter === "card" && !method.includes("card") && !method.includes("stripe")) return false;
        if (methodFilter === "pay_later" && !isPayLater) return false;
        if (methodFilter === "bank_transfer" && !method.includes("bank") && !method.includes("wire")) return false;
      }

      // Date Range filters
      if (startDate) {
        const itemDate = item.date || item.created_at || item.issue_date;
        if (itemDate && new Date(itemDate) < new Date(startDate)) return false;
      }
      if (endDate) {
        const itemDate = item.date || item.created_at || item.issue_date;
        if (itemDate && new Date(itemDate) > new Date(endDate)) return false;
      }

      return true;
    });
  }, [payments, activeTab, stageFilter, methodFilter, startDate, endDate]);

  const columns = useMemo(() => getPaymentColumns((pay) => setSelectedPayment(pay)), []);

  return (
    <div className="p-4 md:p-6 w-full mx-auto min-h-screen font-sans antialiased bg-[#f8fafc] dark:bg-[#12161c] space-y-3.5">
      {/* Header with Title, Refresh, Export, and Action buttons */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight mb-1">
            Supplier Payments & Settlements
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Track job earnings, customer payment terms (Pay Later / Immediate), escrow countdowns, and cleared payouts.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchPayments(true)}
            disabled={isRefreshing}
            className="h-8 px-3 text-xs font-semibold flex items-center gap-1.5 cursor-pointer bg-white dark:bg-[#1e2329] border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            <RefreshCw size={13} className={isRefreshing ? "animate-spin text-[#ff4a1f]" : "text-slate-500"} />
            <span>{isRefreshing ? "Refreshing..." : "Refresh"}</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            className="h-8 px-3 text-xs font-semibold flex items-center gap-1.5 cursor-pointer bg-white dark:bg-[#1e2329] border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            <Download size={13} className="text-slate-500" />
            <span>Export CSV</span>
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate("/supplier/finance/invoices")}
            className="h-8 px-3.5 bg-[#ff4a1f] hover:bg-[#e03e15] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <FileText size={14} />
            <span>View Invoices</span>
          </Button>
        </div>
      </div>

      {/* Main DataTable Grid */}
      <DataTable
        data={filteredPayments}
        columns={columns}
        actions={(row: any) => (
          <PaymentRowActions
            row={row}
            onViewDetails={(r) => setSelectedPayment(r)}
            onDownload={(r) => handleDownload(r)}
          />
        )}
        actionsColumnClassName="w-[50px] min-w-[45px] text-right pr-2"
        headerTabs={
          <PaymentFilterTabs
            payments={payments}
            activeTab={activeTab}
            onSelectTab={setActiveTab}
          />
        }
        filterContent={
          <PaymentFilterContent
            stageFilter={stageFilter}
            setStageFilter={setStageFilter}
            methodFilter={methodFilter}
            setMethodFilter={setMethodFilter}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            onResetFilters={handleResetFilters}
          />
        }
        searchPlaceholder="Search payments by invoice ID, order #, customer, or route..."
        compact={true}
        isLoading={isLoading || isRefreshing}
        onRowClick={(row) => setSelectedPayment(row)}
        tableClassName="w-full"
        emptyState={
          <EmptyState
            icon={Receipt}
            title="No Payment Records Found"
            description={
              activeTab === "all"
                ? "All your customer payments, Pay Later terms, and escrow clearances will be listed here."
                : `No payments match the '${activeTab.replace("_", " ")}' filter.`
            }
            actionLabel="View Invoices"
            onAction={() => navigate("/supplier/finance/invoices")}
          />
        }
      />

      {/* Detailed Payment Modal */}
      {selectedPayment && (
        <PaymentDetailsModal
          payment={selectedPayment}
          onClose={() => setSelectedPayment(null)}
          onDownload={handleDownload}
        />
      )}
    </div>
  );
}
