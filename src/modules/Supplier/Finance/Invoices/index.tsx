import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Receipt, 
  Download, 
  RefreshCw,
  CreditCard
} from "lucide-react";
import DataTable from "@/components/tables/data-table";
import Button from "@/components/ui/button";
import EmptyState from "@/components/tables/empty-state";
import apiClient from "@/lib/axios";
import InvoiceView from "./View";
import { InvoiceRowActions } from "./components/InvoiceRowActions";
import { InvoiceFilterTabs, InvoiceFilterTab } from "./components/InvoiceFilterTabs";
import { InvoiceFilterContent } from "./components/InvoiceFilterContent";
import { getInvoiceColumns } from "./components/columns";

export default function SupplierInvoices() {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState<any[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Tab & Custom Filters
  const [activeTab, setActiveTab] = useState<InvoiceFilterTab>("all");
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

  const fetchInvoices = async (isManualRefresh = false) => {
    if (isManualRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    try {
      const res = await apiClient.get("/supplier/finance/invoices").catch(() => apiClient.get("/supplier/invoices"));
      const resData = res?.data || res;
      const list = resData?.data?.items 
        || resData?.data?.data 
        || resData?.items 
        || (Array.isArray(resData?.data) ? resData?.data : null) 
        || (Array.isArray(resData) ? resData : []);
      
      setInvoices(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error("Failed to fetch supplier invoices:", err);
      setInvoices([]);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleDownload = async (invoice: any) => {
    try {
      const id = invoice.id || invoice.raw_id;
      const response = await apiClient.get(`/supplier/invoices/${id}/download`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data || response]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Invoice-${invoice.invoice_number || id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Failed to download invoice PDF:", err);
      alert("Could not download invoice PDF.");
    }
  };

  const handleExportCSV = () => {
    if (!filteredInvoices || filteredInvoices.length === 0) return;
    const headers = ["Invoice #", "Order ID", "Customer", "Route", "Issue Date", "Due Date", "Net Payout", "Gross Amount", "Payment Stage"];
    const csvRows = [
      headers.join(","),
      ...filteredInvoices.map((i) => [
        `"${i.invoice_number || i.id || ""}"`,
        `"${i.order_number || i.order_id || ""}"`,
        `"${i.customer_company || i.customer_name || ""}"`,
        `"${i.route || ""}"`,
        `"${i.issue_date || i.date || ""}"`,
        `"${i.due_date || i.dueDate || ""}"`,
        `"${i.supplier_amount_formatted || i.net_amount_formatted || i.net_amount || ""}"`,
        `"${i.gross_amount_formatted || i.total_amount_formatted || ""}"`,
        `"${i.payment_stage_label || i.status || ""}"`,
      ].join(","))
    ];
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Supplier_Invoices_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      const stage = String(inv.payment_stage || "").toLowerCase().trim();
      const st = String(inv.raw_status || inv.status || "").toLowerCase().trim();
      const method = String(inv.payment_method || "").toLowerCase().trim();

      // Header Tab filter
      if (activeTab === "cleared") {
        if (stage !== "cleared" && st !== "cleared") return false;
      } else if (activeTab === "in_escrow") {
        if (stage !== "in_escrow" && st !== "in escrow" && !(st === "paid" && stage !== "cleared")) return false;
      } else if (activeTab === "due") {
        if (stage !== "pay_later" && stage !== "unpaid" && st !== "due" && st !== "pending" && st !== "overdue") return false;
      }

      // Dropdown Stage filter
      if (stageFilter !== "all") {
        if (stageFilter === "cleared" && stage !== "cleared" && st !== "cleared") return false;
        if (stageFilter === "in_escrow" && stage !== "in_escrow" && st !== "in escrow") return false;
        if (stageFilter === "due" && stage !== "pay_later" && stage !== "unpaid" && st !== "due" && st !== "pending") return false;
      }

      // Dropdown Method filter
      if (methodFilter !== "all") {
        if (methodFilter === "card" && !method.includes("card") && !method.includes("stripe")) return false;
        if (methodFilter === "pay_later" && !method.includes("pay_later") && !inv.is_pay_later && stage !== "pay_later") return false;
        if (methodFilter === "bank_transfer" && !method.includes("bank") && !method.includes("wire")) return false;
      }

      // Date Range filters
      if (startDate) {
        const invDate = inv.created_at || inv.date || inv.issue_date;
        if (invDate && new Date(invDate) < new Date(startDate)) return false;
      }
      if (endDate) {
        const invDate = inv.created_at || inv.date || inv.issue_date;
        if (invDate && new Date(invDate) > new Date(endDate)) return false;
      }

      return true;
    });
  }, [invoices, activeTab, stageFilter, methodFilter, startDate, endDate]);

  const columns = useMemo(() => getInvoiceColumns((inv) => setSelectedInvoice(inv)), []);

  if (selectedInvoice) {
    return (
      <InvoiceView
        invoice={selectedInvoice}
        onBack={() => setSelectedInvoice(null)}
        onDownload={handleDownload}
      />
    );
  }

  return (
    <div className="p-4 md:p-6 w-full mx-auto min-h-screen font-sans antialiased bg-[#f8fafc] dark:bg-[#12161c] space-y-3.5">
      {/* Header with Title, Refresh, Export, and Action buttons */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight mb-1">
            Supplier Invoices & Settlements
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Track customer invoice settlements, escrow clearing status, and official PDF documents.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchInvoices(true)}
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
            onClick={() => navigate("/supplier/finance/payments")}
            className="h-8 px-3.5 bg-[#ff4a1f] hover:bg-[#e03e15] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <CreditCard size={14} />
            <span>View Payments</span>
          </Button>
        </div>
      </div>

      {/* Main DataTable Grid */}
      <DataTable
        data={filteredInvoices}
        columns={columns}
        actions={(row: any) => (
          <InvoiceRowActions
            row={row}
            onView={(r) => setSelectedInvoice(r)}
            onDownload={(r) => handleDownload(r)}
          />
        )}
        actionsColumnClassName="w-[50px] min-w-[45px] text-right pr-2"
        headerTabs={
          <InvoiceFilterTabs
            invoices={invoices}
            activeTab={activeTab}
            onSelectTab={setActiveTab}
          />
        }
        filterContent={
          <InvoiceFilterContent
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
        searchPlaceholder="Search by invoice ID, order #, client, or route..."
        compact={true}
        isLoading={isLoading || isRefreshing}
        onRowClick={(row) => setSelectedInvoice(row)}
        tableClassName="w-full"
        emptyState={
          <EmptyState
            icon={Receipt}
            title="No Invoices Found"
            description={
              activeTab === "all"
                ? "There are no generated invoices for your account yet."
                : `No invoices match the '${activeTab.replace("_", " ")}' filter.`
            }
            actionLabel="View Payments Ledger"
            onAction={() => navigate("/supplier/finance/payments")}
          />
        }
      />
    </div>
  );
}
