import { formatStandardAddress } from '@/utils/addressFormatter';
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  CheckCircle2,
  AlertCircle,
  Receipt,
  Download,
  RefreshCw,
  ExternalLink,
  Clock,
  ArrowRight,
} from 'lucide-react';
import DataTable, { Column } from '@/components/tables/data-table';
import MetricCard from '@/components/cards/metric-card';
import { StatusBadge } from '@/components/common/StatusBadge';
import { useCustomerInvoices } from '@/modules/Customer/Finance/Invoices/hooks/useCustomerInvoices';
import { CustomerInvoiceItem } from '@/modules/Customer/Finance/Invoices/types';
import { exportInvoicePdf } from '@/utils/exportInvoicePdf';
import { useToastStore } from '@/stores/useToastStore';
import { formatDisplayDate } from '@/lib/utils';
import { renderInvoiceStatusBadge } from '@/enums/FinanceStatus';

export default function InvoicesSubTab() {
  const showToast = useToastStore((state) => state.showToast);
  const { invoices, calculatedStats, isLoading, isRefreshing, fetchInvoices } = useCustomerInvoices();

  const [filterTab, setFilterTab] = useState<'all' | 'paid' | 'due' | 'overdue' | 'pay_later'>('all');
  const [downloadingId, setDownloadingId] = useState<string | number | null>(null);

  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      const rawStatus = String(inv.raw_status || inv.status || '').toLowerCase().trim();
      const isPaid = rawStatus === 'paid' || rawStatus === 'settled' || rawStatus === 'succeeded';
      const isOverdue = rawStatus === 'overdue';
      const isDue = !isPaid && !isOverdue;
      const isPayLater = Boolean(inv.is_pay_later);

      if (filterTab === 'paid') return isPaid;
      if (filterTab === 'due') return isDue;
      if (filterTab === 'overdue') return isOverdue;
      if (filterTab === 'pay_later') return isPayLater;

      return true;
    });
  }, [invoices, filterTab]);

  const handleDownload = async (inv: CustomerInvoiceItem) => {
    setDownloadingId(inv.id);
    try {
      const ok = await exportInvoicePdf(inv);
      if (!ok) {
        showToast('Invoice download preview opened.', 'info');
      } else {
        showToast(`Invoice ${inv.invoice_number || inv.id} downloaded successfully.`, 'success');
      }
    } catch {
      showToast('Failed to download invoice PDF.', 'error');
    } finally {
      setDownloadingId(null);
    }
  };

  const columns: Column<CustomerInvoiceItem>[] = useMemo(
    () => [
      {
        id: 'amount',
        label: 'Amount',
        sortable: true,
        className: 'w-[125px] whitespace-nowrap',
        render: (row) => {
          const rawAmt = Number(row.gross_amount ?? row.total_amount ?? row.amount_raw ?? row.amount ?? 0);
          const cur = (row.currency || 'EUR').toUpperCase();
          return (
            <div className="flex items-center min-h-[20px]">
              <span className="font-bold text-xs text-slate-900 dark:text-slate-100 whitespace-nowrap">
                €{rawAmt.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{' '}
                <span className="text-[10px] font-normal text-slate-400">{cur}</span>
              </span>
            </div>
          );
        },
      },
      {
        id: 'status',
        label: 'Status',
        sortable: true,
        className: 'w-[120px] whitespace-nowrap',
        render: (row) => renderInvoiceStatusBadge(row.raw_status || row.status || 'pending', row.is_pay_later),
      },
      {
        id: 'invoice_number',
        label: 'Invoice #',
        sortable: true,
        className: 'w-[130px] whitespace-nowrap',
        render: (row) => {
          const invNum = row.invoice_number || (row.id ? `INV-${String(row.id).padStart(4, '0')}` : 'INV-0001');
          return (
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-[3px] bg-orange-50 dark:bg-orange-950/60 text-[#ff4a1f] flex items-center justify-center shrink-0 border border-orange-100 dark:border-orange-900/40">
                <FileText size={11} />
              </div>
              <button
                type="button"
                onClick={() => handleDownload(row)}
                className="font-medium text-xs text-slate-800 dark:text-slate-200 hover:text-[#ff4a1f] hover:underline cursor-pointer text-left whitespace-nowrap"
              >
                {invNum}
              </button>
            </div>
          );
        },
      },
      {
        id: 'order',
        label: 'Order Reference',
        sortable: true,
        className: 'min-w-[130px] whitespace-nowrap',
        render: (row) => {
          const ref = row.order_number || row.order_id ? `ORD-${row.order_number || row.order_id}` : row.description || 'Freight Order';
          return (
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
              {ref}
            </span>
          );
        },
      },
      {
        id: 'carrier',
        label: 'Carrier / Supplier',
        sortable: true,
        className: 'min-w-[140px] whitespace-nowrap',
        render: (row) => {
          const carrier = row.supplier_name || row.carrier || (typeof row.supplier === 'string' ? row.supplier : row.supplier?.company_name || row.supplier?.name) || 'Carrier Direct';
          return (
            <span className="text-xs text-slate-700 dark:text-slate-300 truncate" title={carrier}>
              {carrier}
            </span>
          );
        },
      },
      {
        id: 'route',
        label: 'Route',
        sortable: true,
        className: 'min-w-[170px] max-w-[260px]',
        render: (row) => {
          const pickup = row.pickup_address || row.pickup || row.from || 'Pickup';
          const delivery = row.delivery_address || row.delivery || row.to || 'Delivery';
          return (
            <div className="flex flex-col text-[11px] leading-tight py-0 min-w-0">
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
        id: 'issue_date',
        label: 'Issued Date',
        sortable: true,
        className: 'w-[110px] whitespace-nowrap',
        render: (row) => (
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {formatDisplayDate(row.issue_date || row.created_at || row.date)}
          </span>
        ),
      },
      {
        id: 'due_date',
        label: 'Due Date',
        sortable: true,
        className: 'w-[110px] whitespace-nowrap',
        render: (row) => (
          <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
            {formatDisplayDate(row.due_date || (row as any).payment_due_date || '2026-11-10')}
          </span>
        ),
      },
    ],
    []
  );

  return (
    <div className="space-y-4 font-sans pt-0.5">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div>
          <h2 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
            <FileText size={15} className="text-[#ff4a1f]" />
            Freight Invoices & Billing
          </h2>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            View lifetime freight bills, due dates, payment terms, and downloadable PDF receipts.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => fetchInvoices(true)}
            disabled={isRefreshing}
            className="h-[32px] px-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-[4px] inline-flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
            title="Refresh Invoices"
          >
            <RefreshCw size={12} className={isRefreshing ? 'animate-spin text-[#ff4a1f]' : ''} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <Link
            to="/customer/finance/invoices"
            className="h-[32px] px-3 bg-[#ff4a1f] hover:bg-[#e03d15] text-white text-xs font-semibold rounded-[4px] inline-flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
          >
            <span>Invoices Hub</span>
            <ExternalLink size={12} />
          </Link>
        </div>
      </div>

      {/* 1. Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <MetricCard
          title="Total Spent & Paid"
          description={`${calculatedStats.paidCount} fully settled invoices`}
          value={calculatedStats.totalSpentFormatted}
          icon={CheckCircle2}
          colorClass="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400"
          badge={<StatusBadge status="Paid" />}
          valueClassName="text-sm sm:text-base font-bold"
          className="p-3 rounded-[4px]"
          isLoading={isLoading}
        />

        <MetricCard
          title="Outstanding & Due"
          description={`${calculatedStats.dueCount} due${
            calculatedStats.overdueCount > 0 ? `, ${calculatedStats.overdueCount} overdue` : ' awaiting payment'
          }`}
          value={calculatedStats.totalOutstandingFormatted}
          icon={AlertCircle}
          colorClass="bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400"
          badge={<StatusBadge status="Due" />}
          valueClassName="text-sm sm:text-base font-bold"
          className="p-3 rounded-[4px]"
          isLoading={isLoading}
        />

        <MetricCard
          title="Total Invoices"
          description="All generated billing documents"
          value={calculatedStats.totalInvoices}
          icon={Receipt}
          colorClass="bg-orange-50 dark:bg-[#ff4a1f]/15 text-[#ff4a1f]"
          badge={<StatusBadge status="Total" />}
          valueClassName="text-sm sm:text-base font-bold"
          className="p-3 rounded-[4px]"
          isLoading={isLoading}
        />
      </div>

      {/* 2. Standard DataTable Component */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[4px] shadow-2xs overflow-hidden">
        <DataTable
          columns={columns}
          data={filteredInvoices}
          isLoading={isLoading}
          compact={true}
          searchPlaceholder="Search invoices by ID, order, carrier, route..."
          hideViewToggle={true}
          keyExtractor={(item) => String(item.id)}
          headerTabs={
            <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar mb-[-1px]">
              {[
                { id: 'all', label: 'All Invoices', count: invoices.length },
                { id: 'paid', label: 'Paid', count: calculatedStats.paidCount },
                { id: 'due', label: 'Due', count: calculatedStats.dueCount },
                { id: 'overdue', label: 'Overdue', count: calculatedStats.overdueCount },
                {
                  id: 'pay_later',
                  label: 'Corporate Net-30',
                  count: invoices.filter((i) => i.is_pay_later).length,
                },
              ].map((tab) => {
                const isSelected = filterTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setFilterTab(tab.id as any)}
                    className={`flex items-center gap-1.5 pb-2.5 border-b-2 text-xs transition-colors whitespace-nowrap cursor-pointer px-1 ${
                      isSelected
                        ? 'border-[#ff4a1f] text-[#ff4a1f] dark:border-[#ff4a1f] dark:text-[#ff4a1f] font-bold'
                        : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 font-medium'
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span
                      className={`text-[11px] font-semibold px-1.5 py-0.2 rounded-full transition-colors ${
                        isSelected
                          ? 'bg-orange-50 dark:bg-orange-950/40 text-[#ff4a1f]'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>
          }
          actions={(row) => (
            <div className="flex items-center justify-end gap-1.5 pr-2">
              <button
                type="button"
                onClick={() => handleDownload(row)}
                disabled={downloadingId === row.id}
                className="h-7 px-2 text-xs font-medium border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-[4px] inline-flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
                title="Download Invoice PDF"
              >
                <Download size={11} className={downloadingId === row.id ? 'animate-spin' : 'text-slate-400'} />
                <span>PDF</span>
              </button>
            </div>
          )}
          actionsColumnClassName="w-[75px] text-right pr-2"
        />
      </div>
    </div>
  );
}
