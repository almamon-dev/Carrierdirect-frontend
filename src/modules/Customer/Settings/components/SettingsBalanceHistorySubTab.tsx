import React, { useState, useMemo } from "react";
import {
  Coins,
  TrendingUp,
  Clock,
  ArrowDownRight,
  ArrowUpRight,
  CheckCircle2,
  Gift,
  FileText,
  CreditCard,
  Download,
} from "lucide-react";
import DataTable, { Column } from "@/components/tables/data-table";
import { formatDisplayDate } from "@/lib/utils";
import { useToastStore } from "@/stores/useToastStore";

interface BalanceTransaction {
  id: string;
  reference_id: string;
  description: string;
  category: "grant" | "usage" | "settlement" | "adjustment";
  category_label: string;
  date: string;
  time: string;
  amount: number;
  is_positive: boolean;
  ending_balance: number;
  status: "completed" | "pending" | "processed";
}

const SAMPLE_TRANSACTIONS: BalanceTransaction[] = [
  {
    id: "tx-1",
    reference_id: "TXN-2026-9042",
    description: "Daily Free Promotional Credit Claim",
    category: "grant",
    category_label: "Promotional Grant",
    date: "2026-10-16",
    time: "14:15 UTC",
    amount: 10.0,
    is_positive: true,
    ending_balance: 40010.0,
    status: "completed",
  },
  {
    id: "tx-2",
    reference_id: "TXN-2026-8910",
    description: "Deferred Freight Settlement - INV-2026-0042",
    category: "settlement",
    category_label: "Pay Later Settlement",
    date: "2026-10-10",
    time: "09:30 UTC",
    amount: 1450.0,
    is_positive: false,
    ending_balance: 40000.0,
    status: "completed",
  },
  {
    id: "tx-3",
    reference_id: "TXN-2026-8422",
    description: "Monthly Freight Usage Allocation - October",
    category: "usage",
    category_label: "Spending Limit Allocation",
    date: "2026-10-01",
    time: "00:00 UTC",
    amount: 100.0,
    is_positive: true,
    ending_balance: 41450.0,
    status: "processed",
  },
  {
    id: "tx-4",
    reference_id: "TXN-2026-7901",
    description: "Corporate Net-30 Facility Approved Limit",
    category: "adjustment",
    category_label: "Facility Grant",
    date: "2026-09-15",
    time: "11:20 UTC",
    amount: 40000.0,
    is_positive: true,
    ending_balance: 40000.0,
    status: "completed",
  },
  {
    id: "tx-5",
    reference_id: "TXN-2026-7450",
    description: "Deferred Freight Settlement - INV-2026-0015",
    category: "settlement",
    category_label: "Pay Later Settlement",
    date: "2026-09-15",
    time: "10:15 UTC",
    amount: 3400.0,
    is_positive: false,
    ending_balance: 0.0,
    status: "completed",
  },
];

export default function SettingsBalanceHistorySubTab() {
  const showToast = useToastStore((state) => state.showToast);
  const [activeFilter, setActiveFilter] = useState<"all" | "grant" | "settlement" | "usage">("all");

  const formatEuro = (amount: number) => {
    return `€ ${amount.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const filteredTransactions = useMemo(() => {
    return SAMPLE_TRANSACTIONS.filter((tx) => {
      if (activeFilter === "all") return true;
      return tx.category === activeFilter;
    });
  }, [activeFilter]);

  const handleExport = () => {
    showToast("Balance statement exported successfully.", "success");
  };

  const columns: Column<BalanceTransaction>[] = useMemo(
    () => [
      {
        id: "reference_id",
        label: "Reference ID",
        sortable: true,
        className: "w-[130px] whitespace-nowrap",
        render: (row) => (
          <span className="font-mono text-xs font-semibold text-slate-800 dark:text-slate-200">
            {row.reference_id}
          </span>
        ),
      },
      {
        id: "description",
        label: "Description / Event",
        sortable: true,
        className: "min-w-[200px]",
        render: (row) => (
          <div className="flex items-center gap-2">
            <div
              className={`w-6 h-6 rounded-[4px] flex items-center justify-center shrink-0 ${
                row.is_positive
                  ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400"
                  : "bg-orange-50 dark:bg-orange-950/40 text-[#ff4a1f]"
              }`}
            >
              {row.category === "grant" ? (
                <Gift size={13} />
              ) : row.is_positive ? (
                <ArrowDownRight size={13} />
              ) : (
                <ArrowUpRight size={13} />
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-medium text-slate-900 dark:text-slate-100 truncate">
                {row.description}
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500">
                {row.category_label}
              </span>
            </div>
          </div>
        ),
      },
      {
        id: "date",
        label: "Date & Time",
        sortable: true,
        className: "w-[130px] whitespace-nowrap",
        render: (row) => (
          <div className="flex flex-col text-[11px] leading-tight">
            <span className="text-slate-700 dark:text-slate-300 font-medium">
              {formatDisplayDate(row.date)}
            </span>
            <span className="text-slate-400 text-[10px]">{row.time}</span>
          </div>
        ),
      },
      {
        id: "amount",
        label: "Change Amount",
        sortable: true,
        className: "w-[130px] whitespace-nowrap",
        render: (row) => (
          <span
            className={`font-bold text-xs ${
              row.is_positive
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-slate-800 dark:text-slate-200"
            }`}
          >
            {row.is_positive ? "+" : "-"}
            {formatEuro(row.amount)}
          </span>
        ),
      },
      {
        id: "ending_balance",
        label: "Ending Balance",
        sortable: true,
        className: "w-[130px] whitespace-nowrap",
        render: (row) => (
          <span className="font-semibold text-xs text-slate-700 dark:text-slate-300">
            {formatEuro(row.ending_balance)}
          </span>
        ),
      },
      {
        id: "status",
        label: "Status",
        sortable: true,
        className: "w-[100px] whitespace-nowrap",
        render: (row) => (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 rounded-[4px] text-[10.5px] font-semibold">
            <CheckCircle2 size={10} /> Completed
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
            <span className="text-[11px] font-medium">Revolving Limit</span>
            <CreditCard size={14} />
          </div>
          <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
            € 40,000.00
          </div>
          <p className="text-[10px] text-slate-400 truncate">Approved Corporate Net-30</p>
        </div>

        <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[4px] shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-emerald-500">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Available Balance</span>
            <Coins size={14} />
          </div>
          <div className="text-sm sm:text-base font-bold text-emerald-600 dark:text-emerald-400">
            € 40,000.00
          </div>
          <p className="text-[10px] text-slate-400 truncate">Ready for freight orders</p>
        </div>

        <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[4px] shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-[#ff4a1f]">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Promotional Credit</span>
            <Gift size={14} />
          </div>
          <div className="text-sm sm:text-base font-bold text-[#ff4a1f]">
            € 10.00
          </div>
          <p className="text-[10px] text-slate-400 truncate">Available bonus balance</p>
        </div>

        <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[4px] shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-medium">Monthly Usage</span>
            <TrendingUp size={14} />
          </div>
          <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
            € 0.25 <span className="text-[10px] font-normal text-slate-400">/ €100</span>
          </div>
          <p className="text-[10px] text-slate-400 truncate">Current billing cycle</p>
        </div>
      </div>

      {/* Filter Tabs Header */}
      <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 overflow-x-auto no-scrollbar mb-[-1px]">
        {[
          { id: "all", label: "All Transactions" },
          { id: "grant", label: "Promotional Grants" },
          { id: "settlement", label: "Pay Later Settlements" },
          { id: "usage", label: "Spending Allocations" },
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
          data={filteredTransactions}
          isLoading={false}
          compact={true}
          searchPlaceholder="Search ledger by transaction ID, event, description..."
          hideViewToggle={true}
          keyExtractor={(item) => item.id}
          actions={() => (
            <button
              type="button"
              onClick={handleExport}
              className="h-7 px-2.5 text-xs font-medium border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-[4px] inline-flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
              title="Download Statement"
            >
              <Download size={12} className="text-slate-400" />
              <span>Export</span>
            </button>
          )}
          actionsColumnClassName="w-[85px] text-right pr-3"
        />
      </div>
    </div>
  );
}
