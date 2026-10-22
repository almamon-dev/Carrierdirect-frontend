import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Wallet,
  CheckCircle2,
  Receipt,
  RefreshCw,
  ExternalLink,
  CreditCard,
  Clock,
  Landmark,
  Download,
} from 'lucide-react';
import DataTable, { Column } from '@/components/tables/data-table';
import MetricCard from '@/components/cards/metric-card';
import { StatusBadge } from '@/components/common/StatusBadge';
import Badge from '@/components/ui/badge';
import { useCustomerPayments } from '@/modules/Customer/Finance/Payments/hooks/useCustomerPayments';
import { CustomerPaymentItem } from '@/modules/Customer/Finance/Payments/types';
import { formatDisplayDate } from '@/lib/utils';
import { useToastStore } from '@/stores/useToastStore';

interface BalanceSubTabProps {
  availableBalance?: number;
  approvedLimit?: number;
  currentlyUsed?: number;
}

export default function BalanceSubTab({
  availableBalance = 0,
  approvedLimit = 0,
  currentlyUsed = 0,
}: BalanceSubTabProps) {
  const showToast = useToastStore((state) => state.showToast);
  const { payments, calculatedStats, isLoading, isRefreshing, fetchPayments } = useCustomerPayments();

  const [filterTab, setFilterTab] = useState<'all' | 'succeeded' | 'pending' | 'pay_later'>('all');

  const filteredPayments = useMemo(() => {
    return payments.filter((p) => {
      const st = String(p.raw_status || p.status || '').toLowerCase().trim();
      const isSucceeded = st === 'succeeded' || st === 'paid' || st === 'completed';
      const isPending = st === 'pending' || st === 'processing' || st === 'held';
      const isPayLater = Boolean(
        p.is_pay_later ||
        String(p.payment_method || p.method || '').toLowerCase().includes('later') ||
        String(p.payment_type || '').toLowerCase().includes('later')
      );

      if (filterTab === 'succeeded') return isSucceeded;
      if (filterTab === 'pending') return isPending;
      if (filterTab === 'pay_later') return isPayLater;

      return true;
    });
  }, [payments, filterTab]);

  const renderStatusBadge = (p: CustomerPaymentItem) => {
    const st = String(p.raw_status || p.status || '').toLowerCase().trim();
    if (st === 'succeeded' || st === 'paid' || st === 'completed') {
      return <StatusBadge status="Completed" category="success" />;
    }
    if (st === 'failed' || st === 'rejected') {
      return <StatusBadge status="Failed" category="failed" />;
    }
    return <StatusBadge status="Processing" category="in_progress" />;
  };

  const renderMethodBadge = (p: CustomerPaymentItem) => {
    const isPayLater = Boolean(
      p.is_pay_later ||
      String(p.payment_method || p.method || '').toLowerCase().includes('later')
    );

    if (isPayLater) {
      return (
        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[2px] text-[11px] font-semibold bg-orange-50 text-[#ff4a1f] border border-orange-200/80 dark:bg-orange-950/40 dark:border-orange-900/60">
          <Landmark size={11} /> Net-30 Pay Later
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[2px] text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700">
        <CreditCard size={11} />
        {p.card_brand ? `${p.card_brand} •••• ${p.card_last4 || '4242'}` : 'Credit Card (Stripe)'}
      </span>
    );
  };

  const handleExportStatement = () => {
    showToast('Balance statement exported successfully.', 'success');
  };

  const columns: Column<CustomerPaymentItem>[] = useMemo(
    () => [
      {
        id: 'amount',
        label: 'Amount',
        sortable: true,
        className: 'w-[125px] whitespace-nowrap',
        render: (row) => {
          const rawAmt = Number(row.amount_raw ?? row.amount ?? row.total_amount ?? 0);
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
        className: 'w-[110px] whitespace-nowrap',
        render: (row) => renderStatusBadge(row),
      },
      {
        id: 'reference',
        label: 'Transaction ID',
        sortable: true,
        className: 'w-[130px] whitespace-nowrap',
        render: (row) => {
          const ref = row.transaction_id || (row.id ? `TXN-${String(row.id).padStart(4, '0')}` : 'TXN-0001');
          return (
            <span className="font-mono text-xs font-semibold text-slate-800 dark:text-slate-200">
              {ref}
            </span>
          );
        },
      },
      {
        id: 'method',
        label: 'Payment Method',
        sortable: true,
        className: 'min-w-[150px] whitespace-nowrap',
        render: (row) => renderMethodBadge(row),
      },
      {
        id: 'description',
        label: 'Description / Purpose',
        sortable: true,
        className: 'min-w-[200px]',
        render: (row) => {
          const desc = row.description || row.invoice_number ? `Freight Settlement: ${row.invoice_number || 'INV'}` : 'Freight Logistics Checkout';
          return (
            <span className="text-xs text-slate-700 dark:text-slate-300 truncate" title={desc}>
              {desc}
            </span>
          );
        },
      },
      {
        id: 'date',
        label: 'Date & Time',
        sortable: true,
        className: 'w-[130px] whitespace-nowrap',
        render: (row) => (
          <div className="flex flex-col text-[11px] leading-tight">
            <span className="text-slate-700 dark:text-slate-300 font-medium">
              {formatDisplayDate(row.created_at || row.date)}
            </span>
            <span className="text-slate-400 text-[10px]">UTC</span>
          </div>
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
            <Wallet size={15} className="text-[#ff4a1f]" />
            Balance & Transaction History
          </h2>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time ledger statements, deposit logs, and freight checkout charges.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => fetchPayments(true)}
            disabled={isRefreshing}
            className="h-[32px] px-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-[4px] inline-flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
            title="Refresh Ledger"
          >
            <RefreshCw size={12} className={isRefreshing ? 'animate-spin text-[#ff4a1f]' : ''} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <Link
            to="/customer/finance/payments"
            className="h-[32px] px-3 bg-[#ff4a1f] hover:bg-[#e03d15] text-white text-xs font-semibold rounded-[4px] inline-flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
          >
            <span>Payments Hub</span>
            <ExternalLink size={12} />
          </Link>
        </div>
      </div>

      {/* 1. Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <MetricCard
          title="Corporate Revolving Limit"
          description="Approved Net-30 deferred facility"
          value={`€ ${approvedLimit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon={Landmark}
          colorClass="bg-orange-50 dark:bg-orange-950/40 text-[#ff4a1f]"
          badge={
            <Badge
              variant="secondary"
              className="bg-orange-50 text-[#ff4a1f] text-[10px] font-semibold border border-orange-200"
            >
              Facility
            </Badge>
          }
          valueClassName="text-sm sm:text-base font-bold"
          className="p-3 rounded-[4px]"
          isLoading={isLoading}
        />

        <MetricCard
          title="Available Balance"
          description={`Used: € ${currentlyUsed.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          value={`€ ${availableBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon={CheckCircle2}
          colorClass="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400"
          badge={
            <Badge
              variant="secondary"
              className="bg-emerald-50 text-emerald-700 text-[10px] font-semibold border border-emerald-200"
            >
              Available
            </Badge>
          }
          valueClassName="text-sm sm:text-base font-bold"
          className="p-3 rounded-[4px]"
          isLoading={isLoading}
        />

        <MetricCard
          title="Total Settlements"
          description="Lifetime checkout and bill payments"
          value={calculatedStats.totalSettledFormatted || '€ 0.00'}
          icon={Receipt}
          colorClass="bg-blue-50 dark:bg-blue-950/40 text-blue-600"
          badge={
            <Badge
              variant="secondary"
              className="bg-slate-100 text-slate-700 text-[10px] font-semibold border border-slate-200"
            >
              Settled
            </Badge>
          }
          valueClassName="text-sm sm:text-base font-bold"
          className="p-3 rounded-[4px]"
          isLoading={isLoading}
        />
      </div>

      {/* 2. Standard DataTable Component */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[4px] shadow-2xs overflow-hidden">
        <DataTable
          columns={columns}
          data={filteredPayments}
          isLoading={isLoading}
          compact={true}
          searchPlaceholder="Search by transaction ID, method, description..."
          hideViewToggle={true}
          keyExtractor={(item) => String(item.id)}
          headerTabs={
            <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar mb-[-1px]">
              {[
                { id: 'all', label: 'All Transactions', count: payments.length },
                { id: 'succeeded', label: 'Completed', count: calculatedStats.succeededCount },
                { id: 'pending', label: 'Pending', count: calculatedStats.pendingCount },
                { id: 'pay_later', label: 'Net-30', count: calculatedStats.payLaterCount },
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
                onClick={handleExportStatement}
                className="h-7 px-2 text-xs font-medium border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-[4px] inline-flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
                title="Export Receipt / Statement"
              >
                <Download size={11} className="text-slate-400" />
                <span>Export</span>
              </button>
            </div>
          )}
          actionsColumnClassName="w-[85px] text-right pr-2"
        />
      </div>
    </div>
  );
}
