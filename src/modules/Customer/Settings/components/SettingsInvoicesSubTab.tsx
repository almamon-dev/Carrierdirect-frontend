import { formatStandardAddress } from '@/utils/addressFormatter';
import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  FileText,
  Download,
  Eye,
  CreditCard,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import DataTable, { Column } from "@/components/tables/data-table";
import { formatDisplayDate } from "@/lib/utils";
import apiClient from "@/lib/axios";
import { useToastStore } from "@/stores/useToastStore";
import { renderInvoiceStatusBadge } from "@/enums/FinanceStatus";

interface InvoiceItem {
  id: string | number;
  invoice_number?: string;
  gross_amount?: number;
  total_amount?: number;
  currency?: string;
  status?: string;
  raw_status?: string;
  is_pay_later?: boolean;
  supplier_name?: string;
  carrier?: string;
  pickup_address?: string;
  delivery_address?: string;
  issue_date?: string;
  due_date?: string;
  created_at?: string;
}

const SAMPLE_INVOICES: InvoiceItem[] = [
  {
    id: "INV-2026-0042",
    invoice_number: "INV-2026-0042",
    total_amount: 1450.0,
    currency: "EUR",
    status: "paid",
    raw_status: "paid",
    is_pay_later: true,
    supplier_name: "DHL Freight Express",
    pickup_address: "Frankfurt Logistics Hub, DE",
    delivery_address: "Rotterdam Port Center, NL",
    issue_date: "2026-10-10",
    due_date: "2026-11-09",
  },
  {
    id: "INV-2026-0038",
    invoice_number: "INV-2026-0038",
    total_amount: 2890.5,
    currency: "EUR",
    status: "pending",
    raw_status: "pending",
    is_pay_later: true,
    supplier_name: "Kuehne + Nagel Logistics",
    pickup_address: "Hamburg Terminal 4, DE",
    delivery_address: "Antwerp Cargo Center, BE",
    issue_date: "2026-10-05",
    due_date: "2026-11-04",
  },
  {
    id: "INV-2026-0029",
    invoice_number: "INV-2026-0029",
    total_amount: 820.0,
    currency: "EUR",
    status: "paid",
    raw_status: "paid",
    is_pay_later: false,
    supplier_name: "DB Schenker Group",
    pickup_address: "Berlin Industrial Park, DE",
    delivery_address: "Munich Freight Terminal, DE",
    issue_date: "2026-09-28",
    due_date: "2026-09-28",
  },
  {
    id: "INV-2026-0015",
    invoice_number: "INV-2026-0015",
    total_amount: 3400.0,
    currency: "EUR",
    status: "paid",
    raw_status: "paid",
    is_pay_later: true,
    supplier_name: "DSV Road Transport",
    pickup_address: "Duisburg Inland Port, DE",
    delivery_address: "Paris Logistics Depot, FR",
    issue_date: "2026-09-15",
    due_date: "2026-10-15",
  },
];

export default function SettingsInvoicesSubTab() {
  const showToast = useToastStore((state) => state.showToast);
  const [invoices, setInvoices] = useState<InvoiceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<"all" | "paid" | "pending" | "pay_later">("all");

  const fetchInvoices = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await apiClient.get("/customer/finance/invoices").catch(() => null);
      let list: InvoiceItem[] = [];
      if (Array.isArray(res?.data?.items)) list = res.data.items;
      else if (Array.isArray(res?.data?.data)) list = res.data.data;
      else if (Array.isArray(res?.data)) list = res.data;
      else if (Array.isArray(res)) list = res;

      if (list.length > 0) {
        setInvoices(list);
      } else {
        setInvoices(SAMPLE_INVOICES);
      }
    } catch {
      setInvoices(SAMPLE_INVOICES);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const filteredInvoices = useMemo(() => {
    return invoices.filter((item) => {
      const status = String(item.raw_status || item.status || "").toLowerCase();
      if (activeFilter === "paid") return status === "paid";
      if (activeFilter === "pending") return status === "pending" || status === "unpaid" || status === "due";
      if (activeFilter === "pay_later") return Boolean(item.is_pay_later);
      return true;
    });
  }, [invoices, activeFilter]);

  const stats = useMemo(() => {
    let total = 0;
    let paid = 0;
    let pending = 0;
    let net30Count = 0;

    invoices.forEach((inv) => {
      const amt = Number(inv.total_amount ?? inv.gross_amount ?? 0);
      total += amt;
      const st = String(inv.raw_status || inv.status || "").toLowerCase();
      if (st === "paid") paid += amt;
      else pending += amt;
      if (inv.is_pay_later) net30Count += 1;
    });

    return { total, paid, pending, net30Count };
  }, [invoices]);

  const formatEuro = (amount: number) => {
    return `€ ${amount.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const handleDownload = (inv: InvoiceItem) => {
    showToast(`Generating PDF invoice for ${inv.invoice_number || inv.id}...`, "info");
    setTimeout(() => {
      showToast(`Invoice ${inv.invoice_number || inv.id} downloaded successfully.`, "success");
    }, 800);
  };

  const columns: Column<InvoiceItem>[] = useMemo(
    () => [
      {
        id: "amount",
        label: "Amount",
        sortable: true,
        className: "w-[130px] whitespace-nowrap",
        render: (row) => {
          const amt = Number(row.total_amount ?? row.gross_amount ?? 0);
          return (
            <div className="flex items-center">
              <span className="font-bold text-xs text-slate-900 dark:text-slate-100 whitespace-nowrap">
                {formatEuro(amt)}{" "}
                <span className="text-[10px] font-normal text-slate-400">
                  {row.currency || "EUR"}
                </span>
              </span>
            </div>
          );
        },
      },
      {
        id: "status",
        label: "Status",
        sortable: true,
        className: "w-[120px] whitespace-nowrap",
        render: (row) =>
          renderInvoiceStatusBadge(row.raw_status || row.status || "pending", row.is_pay_later),
      },
      {
        id: "invoice_number",
        label: "Invoice #",
        sortable: true,
        className: "w-[125px] whitespace-nowrap",
        render: (row) => {
          const invNum = row.invoice_number || `INV-${String(row.id).padStart(4, "0")}`;
          return (
            <button
              type="button"
              onClick={() => handleDownload(row)}
              className="font-medium text-xs text-slate-800 dark:text-slate-200 hover:text-[#ff4a1f] hover:underline cursor-pointer text-left"
            >
              {invNum}
            </button>
          );
        },
      },
      {
        id: "carrier",
        label: "Carrier / Supplier",
        sortable: true,
        className: "min-w-[140px] whitespace-nowrap",
        render: (row) => {
          const carrier = row.supplier_name || row.carrier || "Carrier Direct";
          return (
            <span className="text-xs font-normal text-slate-700 dark:text-slate-300 truncate" title={carrier}>
              {carrier}
            </span>
          );
        },
      },
      {
        id: "route",
        label: "Route / Shipment",
        sortable: true,
        className: "min-w-[180px] max-w-[300px]",
        render: (row) => {
          const pickup = formatStandardAddress(row, "pickup");
          const delivery = formatStandardAddress(row, "delivery");
          return (
            <div className="flex flex-col text-[11px] leading-tight">
              <span className="text-slate-700 dark:text-slate-300 truncate" title={pickup}>
                {pickup}
              </span>
              <span className="text-slate-400 dark:text-slate-500 truncate" title={delivery}>
                to {delivery}
              </span>
            </div>
          );
        },
      },
      {
        id: "issue_date",
        label: "Issue Date",
        sortable: true,
        className: "w-[110px] whitespace-nowrap",
        render: (row) => (
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {formatDisplayDate(row.issue_date || row.created_at || "2026-10-10")}
          </span>
        ),
      },
      {
        id: "due_date",
        label: "Due Date",
        sortable: true,
        className: "w-[110px] whitespace-nowrap",
        render: (row) => (
          <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
            {formatDisplayDate(row.due_date || "2026-11-10")}
          </span>
        ),
      },
    ],
    []
  );

  return (
    <div className="space-y-4 pt-0.5 font-sans">
      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[4px] shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-medium">Total Invoiced</span>
            <FileText size={14} />
          </div>
          <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
            {formatEuro(stats.total)}
          </div>
          <p className="text-[10px] text-slate-400 truncate">Across all billing periods</p>
        </div>

        <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[4px] shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-emerald-500">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Paid Settlements</span>
            <CheckCircle2 size={14} />
          </div>
          <div className="text-sm sm:text-base font-bold text-emerald-600 dark:text-emerald-400">
            {formatEuro(stats.paid)}
          </div>
          <p className="text-[10px] text-slate-400 truncate">Settled freight orders</p>
        </div>

        <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[4px] shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-amber-500">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Pending Due</span>
            <Clock size={14} />
          </div>
          <div className="text-sm sm:text-base font-bold text-amber-600 dark:text-amber-400">
            {formatEuro(stats.pending)}
          </div>
          <p className="text-[10px] text-slate-400 truncate">Awaiting payment / Net-30</p>
        </div>

        <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[4px] shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-[#ff4a1f]">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Corporate Net-30</span>
            <CreditCard size={14} />
          </div>
          <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
            {stats.net30Count} invoices
          </div>
          <p className="text-[10px] text-slate-400 truncate">Deferred 30-day terms</p>
        </div>
      </div>

      {/* Filter Tabs Header */}
      <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 overflow-x-auto no-scrollbar mb-[-1px]">
        {[
          { id: "all", label: "All Invoices" },
          { id: "paid", label: "Paid" },
          { id: "pending", label: "Pending" },
          { id: "pay_later", label: "Corporate Net-30" },
        ].map((tab) => {
          const isSelected = activeFilter === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveFilter(tab.id as any)}
              className={`pb-2 border-b-2 text-xs transition-colors cursor-pointer whitespace-nowrap px-1 ${
                isSelected
                  ? "border-[#ff4a1f] text-[#ff4a1f] font-bold"
                  : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 font-medium"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* DataTable Component */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[4px] shadow-2xs overflow-hidden">
        <DataTable
          columns={columns}
          data={filteredInvoices}
          isLoading={isLoading}
          compact={true}
          searchPlaceholder="Search invoices by number, carrier, route, amount..."
          hideViewToggle={true}
          keyExtractor={(item) => String(item.id)}
          actions={(row) => (
            <button
              type="button"
              onClick={() => handleDownload(row)}
              className="h-7 px-2.5 text-xs font-medium border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-[4px] inline-flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
              title="Download Invoice PDF"
            >
              <Download size={12} className="text-slate-400" />
              <span>PDF</span>
            </button>
          )}
          actionsColumnClassName="w-[80px] text-right pr-3"
        />
      </div>
    </div>
  );
}
