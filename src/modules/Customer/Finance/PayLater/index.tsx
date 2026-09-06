import React, { useState, useMemo, useEffect } from 'react';
import {
  RotateCcw,
  Plus,
  Download,
  Check,
  X,
  Loader2,
  Sparkles,
  Inbox
} from 'lucide-react';
import { DataTable, EmptyState } from '@/components/tables';
import type { Column } from '@/components/tables/data-table';
import Button from '@/components/ui/button';
import Badge from '@/components/ui/badge';
import apiClient from '@/lib/axios';
import { useToastStore } from '@/stores/useToastStore';

export interface PayLaterInvoiceItem {
  id: string;
  orderId: string;
  route: string;
  from: string;
  to: string;
  carrier: string;
  issueDate: string;
  dueDate: string;
  amount: number;
  status: 'unsettled' | 'due_soon' | 'settled';
  daysLeft: number;
}

export interface CreditRequestItem {
  id: string;
  date: string;
  requestedAmount: number;
  currentAmount: number;
  status: 'approved' | 'under_review' | 'pending';
  notes: string;
}

const INITIAL_INVOICES: PayLaterInvoiceItem[] = [
  {
    id: 'INV-2026-0891',
    orderId: 'ORD-5591',
    route: 'Dhaka (EPZ) ➔ Chittagong (Port)',
    from: 'Dhaka (EPZ)',
    to: 'Chittagong (Port)',
    carrier: 'Global Transport Express',
    issueDate: 'Oct 02, 2026',
    dueDate: 'Nov 01, 2026',
    amount: 1445,
    status: 'unsettled',
    daysLeft: 26
  },
  {
    id: 'INV-2026-0845',
    orderId: 'ORD-5540',
    route: 'Gazipur ➔ Benapole Land Port',
    from: 'Gazipur',
    to: 'Benapole Land Port',
    carrier: 'Apex Logistics Ltd',
    issueDate: 'Sep 24, 2026',
    dueDate: 'Oct 24, 2026',
    amount: 2850,
    status: 'due_soon',
    daysLeft: 5
  },
  {
    id: 'INV-2026-0790',
    orderId: 'ORD-5488',
    route: 'Narayanganj ➔ Mongla Port',
    from: 'Narayanganj',
    to: 'Mongla Port',
    carrier: 'Prime Freight Carriers',
    issueDate: 'Sep 18, 2026',
    dueDate: 'Oct 18, 2026',
    amount: 3200,
    status: 'due_soon',
    daysLeft: 3
  },
  {
    id: 'INV-2026-0712',
    orderId: 'ORD-5390',
    route: 'Dhaka ➔ Sylhet Industrial Area',
    from: 'Dhaka',
    to: 'Sylhet Industrial Area',
    carrier: 'Eastern Star Transport',
    issueDate: 'Sep 05, 2026',
    dueDate: 'Oct 05, 2026',
    amount: 1950,
    status: 'settled',
    daysLeft: 0
  },
  {
    id: 'INV-2026-0680',
    orderId: 'ORD-5280',
    route: 'Chittagong ➔ Dhaka Airport',
    from: 'Chittagong',
    to: 'Dhaka Airport',
    carrier: 'Speedy Cargo Network',
    issueDate: 'Aug 28, 2026',
    dueDate: 'Sep 27, 2026',
    amount: 4100,
    status: 'settled',
    daysLeft: 0
  }
];

const INITIAL_REQUESTS: CreditRequestItem[] = [
  {
    id: 'REQ-CR-104',
    date: 'Sep 15, 2026',
    requestedAmount: 50000,
    currentAmount: 30000,
    status: 'approved',
    notes: 'Approved based on consistent 6-month on-time settlement record.'
  },
  {
    id: 'REQ-CR-092',
    date: 'Jul 10, 2026',
    requestedAmount: 30000,
    currentAmount: 15000,
    status: 'approved',
    notes: 'Approved for Q3 cargo expansion.'
  }
];

export default function PayLaterFacilityPage() {
  const showToast = useToastStore((state) => state.showToast);

  const [activeTab, setActiveTab] = useState<'All' | 'Unsettled' | 'Due Soon' | 'Settled' | 'Limit Requests'>('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isLoading, setIsLoading] = useState(false);

  // Credit limits & data
  const [totalCreditLimit, setTotalCreditLimit] = useState(50000);
  const [invoices, setInvoices] = useState<PayLaterInvoiceItem[]>(INITIAL_INVOICES);
  const [requests, setRequests] = useState<CreditRequestItem[]>(INITIAL_REQUESTS);

  // Modals
  const [isIncreaseModalOpen, setIsIncreaseModalOpen] = useState(false);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<PayLaterInvoiceItem | null>(null);
  const [newRequestedLimit, setNewRequestedLimit] = useState('75000');
  const [increaseReason, setIncreaseReason] = useState('Seasonal freight volume increase & multi-hub distribution');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch live customer profile credit limit
  const fetchCreditData = async (showRefreshToast = false) => {
    setIsLoading(true);
    try {
      const profRes = await apiClient.get('/customer/profile');
      if (profRes.data?.data) {
        const p = profRes.data.data;
        if (p.pay_later_limit && Number(p.pay_later_limit) > 0) {
          setTotalCreditLimit(Number(p.pay_later_limit));
        }
      }
      if (showRefreshToast) {
        showToast('Pay Later records refreshed successfully.', 'success');
      }
    } catch {
      // Graceful fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCreditData();
  }, []);

  // Filtered dataset
  const filteredData = useMemo(() => {
    return invoices.filter((item) => {
      if (activeTab === 'Unsettled' && item.status !== 'unsettled' && item.status !== 'due_soon') return false;
      if (activeTab === 'Due Soon' && item.status !== 'due_soon') return false;
      if (activeTab === 'Settled' && item.status !== 'settled') return false;

      if (statusFilter !== 'All') {
        if (statusFilter === 'Unsettled' && item.status !== 'unsettled') return false;
        if (statusFilter === 'Due Soon' && item.status !== 'due_soon') return false;
        if (statusFilter === 'Settled' && item.status !== 'settled') return false;
      }

      return true;
    });
  }, [invoices, activeTab, statusFilter]);

  // Tab counts
  const tabCounts = useMemo(() => ({
    all: invoices.length,
    unsettled: invoices.filter((i) => i.status === 'unsettled' || i.status === 'due_soon').length,
    dueSoon: invoices.filter((i) => i.status === 'due_soon').length,
    settled: invoices.filter((i) => i.status === 'settled').length,
    requests: requests.length,
  }), [invoices, requests]);

  const tabs: { id: 'All' | 'Unsettled' | 'Due Soon' | 'Settled' | 'Limit Requests'; label: string; count: number }[] = [
    { id: 'All', label: 'All Invoices', count: tabCounts.all },
    { id: 'Unsettled', label: 'Unsettled', count: tabCounts.unsettled },
    { id: 'Due Soon', label: 'Due Soon', count: tabCounts.dueSoon },
    { id: 'Settled', label: 'Settled', count: tabCounts.settled },
    { id: 'Limit Requests', label: 'Limit Requests', count: tabCounts.requests },
  ];

  // Compact Single-Line Columns for Invoices
  const invoiceColumns = useMemo<Column<PayLaterInvoiceItem>[]>(() => [
    {
      id: 'id',
      label: 'Invoice ID',
      className: 'w-[120px] min-w-[120px]',
      sortable: true,
      render: (row) => (
        <div className="flex items-center min-h-[26px]">
          <span className="font-bold text-slate-900 dark:text-slate-100 text-xs">{row.id}</span>
        </div>
      ),
    },
    {
      id: 'orderId',
      label: 'Order Ref',
      className: 'w-[95px] min-w-[95px]',
      sortable: true,
      render: (row) => (
        <div className="flex items-center min-h-[26px]">
          <span className="font-mono text-slate-500 dark:text-slate-400 text-xs">{row.orderId}</span>
        </div>
      ),
    },
    {
      id: 'carrier',
      label: 'Carrier',
      className: 'min-w-[130px] max-w-[170px]',
      sortable: true,
      render: (row) => (
        <div className="flex items-center min-h-[26px] truncate" title={row.carrier}>
          <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs truncate">{row.carrier}</span>
        </div>
      ),
    },
    {
      id: 'route',
      label: 'Freight Route',
      className: 'min-w-[160px] max-w-[220px]',
      sortable: true,
      render: (row) => (
        <div className="flex items-center min-h-[26px] truncate" title={row.route}>
          <span className="font-medium text-slate-700 dark:text-slate-300 text-xs truncate">{row.route}</span>
        </div>
      ),
    },
    {
      id: 'issueDate',
      label: 'Issue Date',
      className: 'w-[100px] min-w-[100px]',
      sortable: true,
      render: (row) => (
        <div className="flex items-center min-h-[26px]">
          <span className="text-slate-600 dark:text-slate-400 text-xs">{row.issueDate}</span>
        </div>
      ),
    },
    {
      id: 'dueDate',
      label: 'Due Date',
      className: 'w-[105px] min-w-[105px]',
      sortable: true,
      render: (row) => (
        <div className="flex items-center min-h-[26px]">
          <span className={`text-xs font-medium ${row.status === 'due_soon' ? 'text-rose-600 font-bold' : 'text-slate-800 dark:text-slate-200'}`}>
            {row.dueDate}
          </span>
        </div>
      ),
    },
    {
      id: 'amount',
      label: 'Amount',
      className: 'w-[100px] min-w-[100px] text-right',
      sortable: true,
      render: (row) => (
        <div className="flex items-center justify-end min-h-[26px]">
          <span className="font-bold text-slate-900 dark:text-slate-100 text-xs">
            € {row.amount.toLocaleString()}
          </span>
        </div>
      ),
    },
    {
      id: 'status',
      label: 'Status',
      className: 'w-[95px] min-w-[95px] text-center',
      render: (row) => {
        const badgeStyle = row.status === 'settled'
          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60'
          : row.status === 'due_soon'
          ? 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/60'
          : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60';

        return (
          <div className="flex items-center justify-center min-h-[26px]">
            <Badge variant="secondary" className={`whitespace-nowrap text-[10.5px] font-semibold border ${badgeStyle}`}>
              {row.status === 'settled' ? 'Settled' : row.status === 'due_soon' ? 'Due Soon' : 'Unsettled'}
            </Badge>
          </div>
        );
      },
    },
  ], []);

  // Compact Single-Line Columns for Limit Requests
  const requestColumns = useMemo<Column<CreditRequestItem>[]>(() => [
    {
      id: 'id',
      label: 'Request ID',
      className: 'w-[120px] min-w-[120px]',
      sortable: true,
      render: (row) => (
        <div className="flex items-center min-h-[26px]">
          <span className="font-bold text-slate-900 dark:text-slate-100 text-xs">{row.id}</span>
        </div>
      ),
    },
    {
      id: 'date',
      label: 'Date',
      className: 'w-[105px] min-w-[105px]',
      sortable: true,
      render: (row) => (
        <div className="flex items-center min-h-[26px]">
          <span className="text-slate-600 dark:text-slate-400 text-xs">{row.date}</span>
        </div>
      ),
    },
    {
      id: 'requestedAmount',
      label: 'Requested Limit',
      className: 'w-[120px] min-w-[120px] text-right',
      sortable: true,
      render: (row) => (
        <div className="flex items-center justify-end min-h-[26px]">
          <span className="font-bold text-slate-900 dark:text-slate-100 text-xs">
            € {row.requestedAmount.toLocaleString()}
          </span>
        </div>
      ),
    },
    {
      id: 'currentAmount',
      label: 'Previous Limit',
      className: 'w-[110px] min-w-[110px] text-right',
      sortable: true,
      render: (row) => (
        <div className="flex items-center justify-end min-h-[26px]">
          <span className="text-slate-500 dark:text-slate-400 text-xs">
            € {row.currentAmount.toLocaleString()}
          </span>
        </div>
      ),
    },
    {
      id: 'status',
      label: 'Status',
      className: 'w-[100px] min-w-[100px] text-center',
      render: (row) => {
        const badgeStyle = row.status === 'approved'
          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60'
          : row.status === 'under_review'
          ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60'
          : 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';

        return (
          <div className="flex items-center justify-center min-h-[26px]">
            <Badge variant="secondary" className={`whitespace-nowrap text-[10.5px] font-semibold border ${badgeStyle}`}>
              {row.status === 'approved' ? 'Approved' : 'Under Review'}
            </Badge>
          </div>
        );
      },
    },
    {
      id: 'notes',
      label: 'Reviewer Notes',
      className: 'min-w-[180px]',
      render: (row) => (
        <div className="flex items-center min-h-[26px] truncate" title={row.notes}>
          <span className="text-slate-600 dark:text-slate-400 text-xs truncate">{row.notes}</span>
        </div>
      ),
    },
  ], []);

  // Shared Header Tabs Bar
  const renderHeaderTabs = () => (
    <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar mb-[-1px]">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 pb-2.5 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              isActive
                ? 'border-[#ff4a1f] text-[#ff4a1f] dark:border-[#ff4a1f] dark:text-[#ff4a1f]'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <span className={`text-[13px] ${isActive ? 'font-bold' : 'font-medium'}`}>
              {tab.label}
            </span>
            <span
              className={`text-[11px] font-medium px-2 py-0.2 rounded-full ${
                isActive
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

  // Handle Limit Increase Form Submit
  const handleIncreaseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(newRequestedLimit);
    if (!amount || amount <= totalCreditLimit) {
      showToast(`Requested limit must be higher than current limit (€${totalCreditLimit.toLocaleString()})`, 'error');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const newReq: CreditRequestItem = {
        id: `REQ-CR-${Math.floor(100 + Math.random() * 900)}`,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
        requestedAmount: amount,
        currentAmount: totalCreditLimit,
        status: 'under_review',
        notes: increaseReason,
      };
      setRequests([newReq, ...requests]);
      setIsSubmitting(false);
      setIsIncreaseModalOpen(false);
      showToast('Credit limit increase request submitted successfully.', 'success');
    }, 500);
  };

  // Confirm Invoice Payment
  const confirmInvoicePayment = () => {
    if (!selectedInvoice) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setInvoices((prev) =>
        prev.map((inv) =>
          inv.id === selectedInvoice.id
            ? { ...inv, status: 'settled', daysLeft: 0 }
            : inv
        )
      );
      setIsSubmitting(false);
      setIsPayModalOpen(false);
      showToast(`Invoice ${selectedInvoice.id} settled successfully!`, 'success');
      setSelectedInvoice(null);
    }, 500);
  };

  return (
    <div className="p-3.5 md:p-5 w-full mx-auto space-y-4 font-sans bg-[#f8fafc] dark:bg-[#12161c] min-h-screen">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
        <div>
          <h1 className="text-base md:text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight leading-none">
            Pay Later & Credit Facility
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-none">
            Manage, track, and settle post-delivery 30-day credit invoices and financing lines.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-7 text-xs border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1.5 cursor-pointer font-medium"
            onClick={() => fetchCreditData(true)}
            disabled={isLoading}
          >
            <RotateCcw size={13} className={isLoading ? 'animate-spin' : ''} />
            Refresh
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-7 text-xs border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1.5 cursor-pointer font-medium"
            onClick={() => showToast('Consolidated credit statement downloaded.', 'success')}
          >
            <Download size={13} />
            Download Statement
          </Button>

          <Button
            type="button"
            variant="primary"
            size="sm"
            className="h-7 text-xs bg-[#ff4a1f] hover:bg-[#e03d15] text-white flex items-center gap-1.5 cursor-pointer font-semibold shadow-2xs"
            onClick={() => setIsIncreaseModalOpen(true)}
          >
            <Plus size={13} />
            Request Limit Increase
          </Button>
        </div>
      </div>

      {/* Main DataTable - Compact Layout */}
      {activeTab !== 'Limit Requests' ? (
        <DataTable
          data={filteredData}
          columns={invoiceColumns}
          actions={(row) => (
            <div className="flex items-center justify-end min-h-[26px]">
              {row.status !== 'settled' ? (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    setSelectedInvoice(row);
                    setIsPayModalOpen(true);
                  }}
                  className="h-6 px-2.5 text-[11px] font-bold bg-[#ff4a1f] hover:bg-[#e03d15] text-white rounded-[3px] cursor-pointer whitespace-nowrap shadow-2xs"
                >
                  Pay Now
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => showToast(`Invoice ${row.id} PDF receipt downloaded.`, 'success')}
                  className="h-6 px-2 text-[11px] font-medium text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1e2329] hover:bg-slate-50 dark:hover:bg-slate-800 rounded-[3px] cursor-pointer whitespace-nowrap flex items-center gap-1"
                >
                  <Download size={11} />
                  <span>Receipt</span>
                </Button>
              )}
            </div>
          )}
          actionsColumnClassName="w-[100px] min-w-[100px] text-right pr-2"
          headerTabs={renderHeaderTabs()}
          filterContent={
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-medium text-slate-500">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="text-xs border border-slate-200 dark:border-slate-700 rounded px-2 py-0.5 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
                >
                  <option value="All">All Statuses</option>
                  <option value="Unsettled">Unsettled</option>
                  <option value="Due Soon">Due Soon</option>
                  <option value="Settled">Settled</option>
                </select>
              </div>

              {statusFilter !== 'All' && (
                <button
                  type="button"
                  onClick={() => setStatusFilter('All')}
                  className="text-xs text-[#ff4a1f] hover:underline font-medium ml-1"
                >
                  Reset
                </button>
              )}
            </div>
          }
          searchPlaceholder="Search invoices by ID, order reference, carrier, route..."
          compact={true}
          isLoading={isLoading}
          tableClassName="w-full min-w-[920px]"
          emptyState={
            <EmptyState
              icon={Inbox}
              title="No Invoices Found"
              description={activeTab === 'All' ? 'You have no credit invoices on record.' : `No credit invoices match '${activeTab}'.`}
              actionLabel="Download Statement"
              onAction={() => showToast('Consolidated credit statement downloaded.', 'success')}
            />
          }
        />
      ) : (
        /* Tab: Limit Requests History rendered in EXACT SAME DataTable */
        <DataTable
          data={requests}
          columns={requestColumns}
          headerTabs={renderHeaderTabs()}
          searchPlaceholder="Search limit requests by ID, amount, status..."
          compact={true}
          isLoading={isLoading}
          tableClassName="w-full min-w-[850px]"
          emptyState={
            <EmptyState
              icon={Inbox}
              title="No Limit Requests Found"
              description="You have not submitted any credit limit increase requests yet."
              actionLabel="Request Limit Increase"
              onAction={() => setIsIncreaseModalOpen(true)}
            />
          }
        />
      )}

      {/* Modal: Request Limit Increase */}
      {isIncreaseModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150 font-sans">
          <form
            onSubmit={handleIncreaseSubmit}
            className="bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-lg max-w-sm w-full overflow-hidden shadow-2xl space-y-3"
          >
            <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-900/50">
              <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <Sparkles size={14} className="text-[#ff4a1f]" /> Request Credit Line Increase
              </h3>
              <button type="button" onClick={() => setIsIncreaseModalOpen(false)} className="text-slate-400 hover:text-slate-600 rounded p-1 cursor-pointer">
                <X size={14} />
              </button>
            </div>

            <div className="p-4 space-y-2.5 text-xs">
              <div className="bg-orange-50/70 dark:bg-orange-950/30 p-2 rounded border border-orange-200 dark:border-orange-900/60 text-orange-800 dark:text-orange-300 text-[11px]">
                Current Limit: <strong>€ {totalCreditLimit.toLocaleString()}</strong>. Approved within 24h.
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1 text-[11px]">New Requested Limit (€)</label>
                <input
                  type="number"
                  min={totalCreditLimit + 5000}
                  step={5000}
                  value={newRequestedLimit}
                  onChange={(e) => setNewRequestedLimit(e.target.value)}
                  required
                  className="w-full px-2.5 py-1 border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-[#12161c] text-slate-900 dark:text-slate-100 text-xs font-bold focus:outline-none focus:border-[#ff4a1f]"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1 text-[11px]">Reason for Increase</label>
                <textarea
                  rows={2}
                  value={increaseReason}
                  onChange={(e) => setIncreaseReason(e.target.value)}
                  required
                  className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-[#12161c] text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:border-[#ff4a1f]"
                />
              </div>
            </div>

            <div className="px-4 py-2.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50 flex justify-end gap-1.5">
              <Button variant="outline" size="sm" type="button" onClick={() => setIsIncreaseModalOpen(false)} className="h-6.5 text-[11px]">
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                type="submit"
                disabled={isSubmitting}
                className="h-6.5 text-[11px] bg-[#ff4a1f] hover:bg-[#e03d15] text-white font-bold"
              >
                {isSubmitting ? <Loader2 size={12} className="animate-spin mr-1" /> : <Check size={12} className="mr-1" />}
                Submit Request
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Modal: Pay Invoice */}
      {isPayModalOpen && selectedInvoice && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150 font-sans">
          <div className="bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-lg max-w-sm w-full overflow-hidden shadow-2xl space-y-3">
            <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-900/50">
              <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                Settle Invoice {selectedInvoice.id}
              </h3>
              <button onClick={() => setIsPayModalOpen(false)} className="text-slate-400 hover:text-slate-600 rounded p-1 cursor-pointer">
                <X size={14} />
              </button>
            </div>

            <div className="p-4 space-y-2.5 text-xs">
              <div className="flex justify-between items-center p-2.5 rounded bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700">
                <div>
                  <span className="text-slate-400 block text-[10px]">Amount Due</span>
                  <span className="text-base font-bold text-slate-900 dark:text-slate-100">€ {selectedInvoice.amount.toLocaleString()}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block text-[10px]">Order Ref</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300 text-xs">{selectedInvoice.orderId}</span>
                </div>
              </div>

              <div className="border border-slate-200 dark:border-slate-700 rounded p-2 space-y-1">
                <span className="font-semibold text-slate-800 dark:text-slate-200 block text-[10.5px]">Payment Method</span>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-400 text-xs">Corporate Visa (•••• 4242)</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-[10.5px]">Direct Settle</span>
                </div>
              </div>
            </div>

            <div className="px-4 py-2.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50 flex justify-end gap-1.5">
              <Button variant="outline" size="sm" onClick={() => setIsPayModalOpen(false)} className="h-6.5 text-[11px]">
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={confirmInvoicePayment}
                disabled={isSubmitting}
                className="h-6.5 text-[11px] bg-[#ff4a1f] hover:bg-[#e03d15] text-white font-bold"
              >
                {isSubmitting ? <Loader2 size={12} className="animate-spin mr-1" /> : <Check size={12} className="mr-1" />}
                Confirm & Settle €{selectedInvoice.amount.toLocaleString()}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
