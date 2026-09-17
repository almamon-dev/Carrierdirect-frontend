import PaymentRowActions from './components/PaymentRowActions';
import React, { useState, useEffect, useMemo } from 'react';
import {
  MapPin,
  CreditCard,
  Download,
  ExternalLink,
  Clock,
  Building2,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  TrendingUp,
  Wallet,
  Receipt,
  Eye,
  FileText,
  Copy,
  Check
} from 'lucide-react';
import DataTable, { Column } from '@/components/tables/data-table';
import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';
import EmptyState from '@/components/tables/empty-state';
import MetricCard from '@/components/cards/metric-card';
import apiClient from '@/lib/axios';
import { formatDisplayDate } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

export default function Payments() {
  const navigate = useNavigate();
  const [payments, setPayments] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [statusFilter, setStatusFilter] = useState<'All' | 'Completed' | 'Pending' | 'Pay Later'>('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<any | null>(null);

  const fetchPayments = async () => {
    setIsLoading(true);
    try {
      let res = await apiClient.get('/customer/payments').catch(() => null);
      let resData = res?.data || res;
      let list = resData?.data?.items || resData?.items || (Array.isArray(resData?.data) ? resData?.data : null) || (Array.isArray(resData) ? resData : []);

      if (resData?.data?.stats || resData?.stats) {
        setStats(resData?.data?.stats || resData?.stats);
      }

      if (!Array.isArray(list) || list.length === 0) {
        res = await apiClient.get('/customer/invoices?status=paid').catch(() => null);
        resData = res?.data || res;
        list = resData?.data?.items || resData?.items || (Array.isArray(resData?.data) ? resData?.data : null) || resData?.invoices?.data || resData?.invoices || (Array.isArray(resData) ? resData : []);
      }
      setPayments(Array.isArray(list) ? list : []);
    } catch (error) {
      console.error('Failed to fetch payment history:', error);
      setPayments([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownload = async (row: any) => {
    const invoiceId = row.invoice_id || row.id;
    if (!invoiceId) {
      alert('No invoice associated with this transaction.');
      return;
    }
    try {
      const response = await fetch(`${apiClient['baseURL']}/customer/invoices/${invoiceId}/download`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Accept': 'application/pdf',
        }
      });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Receipt-${row.transaction_id || row.invoice_number || row.id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      alert('Failed to download payment receipt.');
    }
  };

  const calculatedStats = useMemo(() => {
    let settledSum = 0;
    let payLaterSum = 0;
    const totalCount = payments.length;

    payments.forEach((p) => {
      const num = Number((p.total_amount ?? (typeof p.amount === "number" ? p.amount : String(p.amount || "").replace(/[^0-9.-]+/g, ""))) || 0);
      const st = String(p.status || p.raw_status || "").toLowerCase().trim();
      const method = String(p.payment_method || p.method || "").toLowerCase().trim();

      const isCompleted = st === "succeeded" || st === "paid" || st === "completed" || st === "success";
      const isPayLater = method.includes("pay_later") || method.includes("pay later") || (p.metadata && p.metadata.payment_option === "pay_later") || st === "pending" || st === "due";

      if (isCompleted) {
        settledSum += num;
      }
      if (isPayLater) {
        payLaterSum += num;
      }
    });

    return {
      totalSettledFormatted: stats?.total_settled || stats?.total_paid_formatted || stats?.total_paid || ("€ " + settledSum.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })),
      payLaterTotalFormatted: stats?.pay_later_total_formatted || stats?.pay_later_total || stats?.total_pending || ("€ " + payLaterSum.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })),
      totalTransactions: stats?.total_transactions ?? totalCount,
    };
  }, [payments, stats]);

  const filteredPayments = payments.filter((item) => {
    if (statusFilter === 'All') return true;
    const st = (item.status || item.raw_status || '').toLowerCase();
    const method = (item.payment_method || item.method || '').toLowerCase();

    if (statusFilter === 'Completed') return st === 'succeeded' || st === 'paid' || st === 'completed' || st === 'success';
    if (statusFilter === 'Pending') return st === 'pending' || st === 'processing' || st === 'due';
    if (statusFilter === 'Pay Later') return method.includes('pay_later') || method.includes('pay later');
    return true;
  });

  const columns: Column<any>[] = [
    {
      id: "transaction_id",
      label: "Transaction Ref",
      sortable: true,
      className: "w-[115px] whitespace-nowrap",
      render: (row) => {
        const txId = row.transaction_id || `TXN-${String(row.id).padStart(4, "0")}`;
        const isCopied = copiedId === txId;
        return (
          <div className="flex items-center gap-1.5 group min-h-[22px]">
            <button
              type="button"
              onClick={() => setSelectedPayment(row)}
              className="font-bold text-[#ff4a1f] hover:underline cursor-pointer font-mono text-xs whitespace-nowrap"
            >
              {txId}
            </button>
            <button
              type="button"
              onClick={() => handleCopy(txId)}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
              title="Copy Reference"
            >
              {isCopied ? <Check size={11} className="text-emerald-600" /> : <Copy size={11} />}
            </button>
          </div>
        );
      }
    },
    {
      id: "invoice_number",
      label: "Invoice No.",
      sortable: true,
      className: "w-[95px] whitespace-nowrap",
      render: (row) => (
        <div className="flex items-center min-h-[22px]">
          <span className="font-semibold text-slate-700 dark:text-slate-300 text-xs whitespace-nowrap">
            {row.invoice_number || (row.invoice_id ? `INV-${String(row.invoice_id).padStart(4, "0")}` : "N/A")}
          </span>
        </div>
      )
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
                onClick={() => navigate(`/customer/orders/${row.order_id}`)}
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
      className: "min-w-[140px]",
      render: (row) => {
        const pickup = row.pickup_address || row.pickup || row.pickup_city || row.from || "Pickup Location";
        const delivery = row.delivery_address || row.delivery || row.delivery_city || row.to || "Delivery Location";
        return (
          <div className="flex flex-col justify-center leading-tight py-0 min-w-0">
            <div className="flex items-center gap-1.5 min-w-0" title={`Pickup: ${pickup}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
              <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs truncate">
                {pickup}
              </span>
            </div>
            <div className="flex items-center gap-1.5 min-w-0" title={`Delivery: ${delivery}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff4a1f] shrink-0" />
              <span className="text-slate-500 dark:text-slate-400 text-[10.5px] truncate">
                {delivery}
              </span>
            </div>
          </div>
        );
      }
    },
    {
      id: "date",
      label: "Payment Date",
      sortable: true,
      className: "w-[95px] text-center whitespace-nowrap",
      render: (row) => (
        <div className="flex flex-col items-center justify-center min-h-[22px] leading-tight">
          <span className="text-slate-800 dark:text-slate-200 font-medium text-xs whitespace-nowrap">
            {formatDisplayDate(row.paid_at || row.created_at || row.date)}
          </span>
          <span className="text-[9.5px] text-slate-400 dark:text-slate-500 whitespace-nowrap">
            {row.created_at_formatted ? row.created_at_formatted.split(",")[1] || "" : ""}
          </span>
        </div>
      )
    },
    {
      id: "method",
      label: "Method",
      sortable: true,
      className: "w-[80px] text-center whitespace-nowrap",
      render: (row) => {
        const method = (row.payment_method || row.method || "Direct").toLowerCase();
        const isPayLater = method.includes("pay_later") || method.includes("pay later");
        return (
          <div className="flex items-center justify-center min-h-[22px]">
            <Badge variant="secondary" className={`text-[9.5px] px-1.5 py-0.25 font-semibold whitespace-nowrap border ${isPayLater
                ? "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800/60"
                : "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700"
              }`}>
              {isPayLater ? "Pay Later" : row.method || "Direct"}
            </Badge>
          </div>
        );
      }
    },
    {
      id: "amount",
      label: "Amount",
      sortable: true,
      className: "w-[100px] text-right whitespace-nowrap",
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
      className: "w-[85px] text-center whitespace-nowrap",
      render: (row) => {
        const st = (row.status || row.raw_status || "").toLowerCase();
        const isSuccess = st === "succeeded" || st === "paid" || st === "completed" || st === "success";
        const isPending = st === "pending" || st === "processing" || st === "due";
        return (
          <div className="flex items-center justify-center min-h-[22px]">
            {isSuccess ? (
              <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60 text-[9.5px] px-1.5 py-0.25 font-semibold whitespace-nowrap">
                Completed
              </Badge>
            ) : isPending ? (
              <Badge className="bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60 text-[9.5px] px-1.5 py-0.25 font-semibold whitespace-nowrap">
                Pending
              </Badge>
            ) : (
              <Badge className="bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/60 text-[9.5px] px-1.5 py-0.25 font-bold whitespace-nowrap">
                {row.status || "Failed"}
              </Badge>
            )}
          </div>
        );
      }
    }
  ];

  const actions = (row: any) => (
    <PaymentRowActions
      row={row}
      onViewDetails={(r) => setSelectedPayment(r)}
      onDownload={(r) => handleDownload(r)}
    />
  );

  const renderHeaderTabs = () => {
    const tabs: { id: 'All' | 'Completed' | 'Pending' | 'Pay Later'; label: string; count: number }[] = [
      { id: 'All', label: 'All Payments', count: payments.length },
      {
        id: 'Completed', label: 'Completed', count: payments.filter(p => {
          const st = (p.status || p.raw_status || '').toLowerCase();
          return st === 'succeeded' || st === 'paid' || st === 'completed' || st === 'success';
        }).length
      },
      {
        id: 'Pending', label: 'Pending', count: payments.filter(p => {
          const st = (p.status || p.raw_status || '').toLowerCase();
          return st === 'pending' || st === 'processing' || st === 'due';
        }).length
      },
      {
        id: 'Pay Later', label: 'Pay Later', count: payments.filter(p => {
          const method = (p.payment_method || p.method || '').toLowerCase();
          return method.includes('pay_later') || method.includes('pay later');
        }).length
      },
    ];

    return (
      <div className="flex items-center gap-1.5 sm:gap-2.5 overflow-x-auto hide-scrollbar mb-[-1px]">
        {tabs.map((tab) => {
          const isActive = statusFilter === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStatusFilter(tab.id)}
              className={`flex items-center gap-1.5 pb-2.5 border-b-2 transition-colors whitespace-nowrap cursor-pointer px-1 ${isActive
                  ? 'border-[#ff4a1f] text-[#ff4a1f] dark:border-[#ff4a1f] dark:text-[#ff4a1f]'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
            >
              <span className={`text-[13px] ${isActive ? 'font-bold' : 'font-medium'}`}>
                {tab.label}
              </span>
              <span
                className={`text-[11px] font-medium px-1.5 py-0.25 rounded-full transition-colors ${isActive
                    ? 'bg-orange-50 dark:bg-[#ff4a1f]/20 text-[#ff4a1f] dark:text-orange-400'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                  }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>
    );
  };

  const filterContent = (
    <div className="flex flex-wrap items-center gap-3 py-1">
      <div className="flex flex-col gap-1">
        <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Payment Status</label>
        <div className="flex items-center gap-1.5">
          {(['All', 'Completed', 'Pending', 'Pay Later'] as const).map((tab) => {
            const count = tab === 'All' ? payments.length : payments.filter(p => {
              const st = (p.status || p.raw_status || '').toLowerCase();
              const method = (p.payment_method || p.method || '').toLowerCase();
              if (tab === 'Completed') return st === 'succeeded' || st === 'paid' || st === 'completed' || st === 'success';
              if (tab === 'Pending') return st === 'pending' || st === 'processing' || st === 'due';
              if (tab === 'Pay Later') return method.includes('pay_later') || method.includes('pay later');
              return true;
            }).length;
            const isActive = statusFilter === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setStatusFilter(tab)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold cursor-pointer transition-all ${isActive
                  ? 'bg-[#ff4a1f] text-white shadow-2xs'
                  : 'bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
              >
                {tab} ({count})
              </button>
            );
          })}
        </div>
      </div>
      {statusFilter !== 'All' && (
        <button
          type="button"
          onClick={() => setStatusFilter('All')}
          className="text-xs text-[#ff4a1f] hover:underline font-medium self-end mb-1 cursor-pointer"
        >
          Reset
        </button>
      )}
    </div>
  );

  return (
    <div className="p-3.5 md:p-5 w-full mx-auto min-h-screen space-y-3.5 font-sans bg-[#f8fafc] dark:bg-[#12161c] text-slate-800 dark:text-slate-200 antialiased">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight mb-1">Payment History</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Review detailed transactions, download receipts, and manage freight settlements.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => navigate('/customer/finance/invoices')}
            className="h-8 text-xs font-semibold bg-white dark:bg-[#1e2329] text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 border-slate-300 dark:border-slate-700 cursor-pointer"
          >
            View Invoices
          </Button>
          <Button
            variant="primary"
            onClick={() => navigate('/customer/finance/pay-later')}
            className="h-8 text-xs font-semibold bg-[#ff4a1f] hover:bg-[#e03e15] text-white cursor-pointer shadow-2xs"
          >
            Pay Later Facility
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
        <MetricCard
          title="Total Paid"
          description="Total funds paid out across all shipments"
          value={calculatedStats.totalSettledFormatted}
          icon={CheckCircle2}
          colorClass="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400"
          badge={<Badge variant="secondary" className="bg-emerald-50 text-emerald-700 text-[10px] font-semibold border border-emerald-200">Paid</Badge>}
          valueClassName="text-base sm:text-lg"
          className="p-2.5 sm:p-3"
          isLoading={isLoading}
        />
        <MetricCard
          title="Pay Later Settlements"
          description="Transactions deferred via Net-30 credit"
          value={calculatedStats.payLaterTotalFormatted}
          icon={Wallet}
          colorClass="bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400"
          badge={<Badge variant="secondary" className="bg-purple-50 text-purple-700 text-[10px] font-semibold border border-purple-200">Net-30</Badge>}
          valueClassName="text-base sm:text-lg"
          className="p-2.5 sm:p-3"
          isLoading={isLoading}
        />
        <MetricCard
          title="Total Transactions"
          description="All booking payments and settlements history"
          value={calculatedStats.totalTransactions}
          icon={Receipt}
          colorClass="bg-orange-50 dark:bg-[#ff4a1f]/15 text-[#ff4a1f]"
          badge={<Badge variant="secondary" className="bg-slate-100 text-slate-700 text-[10px] font-semibold border border-slate-200">Total</Badge>}
          valueClassName="text-base sm:text-lg"
          className="p-2.5 sm:p-3"
          isLoading={isLoading}
        />
      </div>

      {/* Main Table */}
      <DataTable
        data={filteredPayments}
        columns={columns}
        actions={actions}
        actionsColumnClassName="w-[50px] min-w-[45px] text-right pr-2"
        headerTabs={renderHeaderTabs()}
        filterContent={filterContent}
        searchPlaceholder="Search by Transaction ID, Invoice No, or Carrier..."
        compact={true}
        isLoading={isLoading}
        emptyState={
          <EmptyState
            icon={CreditCard}
            title="No Payment Records Found"
            description="Your completed order payments and transaction receipts will be logged here."
          />
        }
      />

      {/* Detail Modal */}
      {selectedPayment && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white border border-slate-200 rounded-lg max-w-md w-full overflow-hidden shadow-2xl space-y-4">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-2">
                <Receipt size={16} className="text-[#ff4a1f]" />
                <h3 className="text-sm font-bold text-slate-900">Transaction Details</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPayment(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="px-5 py-2 space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded border border-slate-200/70 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Transaction ID:</span>
                  <span className="font-mono font-bold text-slate-900">{selectedPayment.transaction_id || `TXN-${selectedPayment.id}`}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Invoice Number:</span>
                  <span className="font-semibold text-slate-800">{selectedPayment.invoice_number || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Order Reference:</span>
                  <span className="font-semibold text-slate-800">{selectedPayment.order_number || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Carrier / Supplier:</span>
                  <span className="font-semibold text-slate-800">{selectedPayment.supplier_name || 'Carrier Direct'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Route:</span>
                  <span className="font-semibold text-slate-800">{selectedPayment.route || 'Direct Route'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Payment Method:</span>
                  <span className="font-semibold text-slate-800">{selectedPayment.method || 'Online'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Payment Date:</span>
                  <span className="font-semibold text-slate-800">{selectedPayment.created_at_formatted || selectedPayment.date}</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-2">
                  <span className="font-bold text-slate-700">Total Amount:</span>
                  <span className="font-extrabold text-[#ff4a1f] text-sm">{selectedPayment.amount || `€ ${selectedPayment.total_amount}`}</span>
                </div>
              </div>
            </div>

            <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/80 flex items-center justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedPayment(null)}
                className="h-8 text-xs font-semibold cursor-pointer"
              >
                Close
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleDownload(selectedPayment)}
                className="h-8 text-xs font-semibold bg-[#ff4a1f] hover:bg-[#e03d15] text-white cursor-pointer flex items-center gap-1.5"
              >
                <Download size={13} /> Download Receipt
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
