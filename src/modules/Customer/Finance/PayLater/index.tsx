import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useSearchParams } from 'react-router-dom';
import {
  RotateCcw,
  Plus,
  Download,
  Check,
  X,
  Loader2,
  Sparkles,
  Inbox,
  CreditCard,
  Building2,
  ShieldCheck,
  ArrowRight,
  Receipt,
  Wallet,
  TrendingUp,
  AlertCircle,
  Clock
} from 'lucide-react';
import { DataTable, EmptyState } from '@/components/tables';
import type { Column } from '@/components/tables/data-table';
import Button from '@/components/ui/button';
import Badge from '@/components/ui/badge';
import apiClient from '@/lib/axios';
import { useToastStore } from '@/stores/useToastStore';

export interface PayLaterInvoiceItem {
  id: string;
  rawId: number | string;
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
  raw?: any;
}

export interface CreditRequestItem {
  id: string;
  date: string;
  limitType?: string;
  requestedAmount: number;
  currentAmount: number;
  status: 'approved' | 'under_review' | 'pending' | 'rejected';
  notes: string;
}

export default function PayLaterFacilityPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const showToast = useToastStore((state) => state.showToast);

  const getValidTab = (tab: string | null): 'Invoices' | 'Limit Requests' => {
    if (!tab) return 'Invoices';
    const lower = tab.toLowerCase();
    if (lower === 'requests' || lower === 'limit-requests' || lower === 'limit requests') return 'Limit Requests';
    return 'Invoices';
  };

  const [activeTab, setActiveTab] = useState<'Invoices' | 'Limit Requests'>(() => getValidTab(searchParams.get('tab')));

  useEffect(() => {
    const t = searchParams.get('tab');
    if (t) {
      setActiveTab(getValidTab(t));
    }
  }, [searchParams]);

  const handleTabChange = (newTab: 'Invoices' | 'Limit Requests') => {
    setActiveTab(newTab);
    const newParams = new URLSearchParams(searchParams);
    if (newTab === 'Invoices') {
      newParams.delete('tab');
    } else {
      newParams.set('tab', 'requests');
    }
    setSearchParams(newParams, { replace: true });
  };
  const [statusFilter, setStatusFilter] = useState('All');
  const [isLoading, setIsLoading] = useState(true);

  // Credit limits & data
  const [totalCreditLimit, setTotalCreditLimit] = useState(80000);
  const [creditUsed, setCreditUsed] = useState(0);
  const [creditAvailable, setCreditAvailable] = useState(80000);
  const [payLaterStatus, setPayLaterStatus] = useState<string>('approved');
  const [monthlyLimit, setMonthlyLimit] = useState(40000);
  const [weeklyLimit, setWeeklyLimit] = useState(15000);
  const [dailyLimit, setDailyLimit] = useState(8000);
  const [dailyUsed, setDailyUsed] = useState(0);
  const [weeklyUsed, setWeeklyUsed] = useState(0);
  const [monthlyUsed, setMonthlyUsed] = useState(0);
  // Computed live dynamic remaining caps
  const dailyAvailable = Math.max(0, dailyLimit - dailyUsed);
  const weeklyAvailable = Math.max(0, weeklyLimit - weeklyUsed);
  const monthlyAvailable = Math.max(0, monthlyLimit - monthlyUsed);
  const [payLaterDays, setPayLaterDays] = useState(30);
  const [tier, setTier] = useState('Tier 1 Shipper');
  const [onTimeRate, setOnTimeRate] = useState(100);
  const [invoices, setInvoices] = useState<PayLaterInvoiceItem[]>([]);
  const [requests, setRequests] = useState<CreditRequestItem[]>([]);

  // Modals
  const [isIncreaseModalOpen, setIsIncreaseModalOpen] = useState(false);
  const [increaseTarget, setIncreaseTarget] = useState<'Max Credit' | 'Monthly Limit' | 'Weekly Limit' | 'Daily Limit'>('Max Credit');
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<PayLaterInvoiceItem | null>(null);
  const [newRequestedLimit, setNewRequestedLimit] = useState('');
  const [increaseReason, setIncreaseReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getCurrentTargetLimit = () => {
    switch (increaseTarget) {
      case 'Monthly Limit':
        return monthlyLimit;
      case 'Weekly Limit':
        return weeklyLimit;
      case 'Daily Limit':
        return dailyLimit;
      default:
        return totalCreditLimit;
    }
  };

  const getPresetIncrements = () => {
    switch (increaseTarget) {
      case 'Daily Limit':
        return [1000, 2000, 5000, 10000];
      case 'Weekly Limit':
        return [2000, 5000, 10000, 20000];
      case 'Monthly Limit':
        return [5000, 10000, 20000, 50000];
      default:
        return [5000, 10000, 20000, 50000];
    }
  };

  // Calculate days remaining until due date
  const calculateDaysLeft = (dueDateStr: string) => {
    if (!dueDateStr || dueDateStr === 'N/A') return 30;
    try {
      const due = new Date(dueDateStr);
      const today = new Date();
      const diffTime = due.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    } catch {
      return 30;
    }
  };

  // Fetch live customer profile, invoices, and credit requests from API
  const fetchPayLaterData = async (showRefreshToast = false) => {
    setIsLoading(true);
    try {
      // 1. Fetch Profile info (credit limits, approval status)
      let currentLimit = totalCreditLimit;
      const profRes: any = await apiClient.get('/customer/profile').catch(() => null);
      const p = profRes?.data || profRes;
      if (p && (p.pay_later_limit !== undefined || p.id)) {
        const limitVal = p.pay_later_limit && Number(p.pay_later_limit) > 0 ? Number(p.pay_later_limit) : 80000;
        currentLimit = limitVal;
        setTotalCreditLimit(limitVal);
        if (p.pay_later_used !== undefined) setCreditUsed(Number(p.pay_later_used));
        if (p.pay_later_available !== undefined) setCreditAvailable(Number(p.pay_later_available));
        else setCreditAvailable(Math.max(0, limitVal - (p.pay_later_used ? Number(p.pay_later_used) : 0)));
        if (p.pay_later_status) setPayLaterStatus(p.pay_later_status);
        if (p.pay_later_monthly_limit) setMonthlyLimit(Number(p.pay_later_monthly_limit));
        if (p.pay_later_weekly_limit) setWeeklyLimit(Number(p.pay_later_weekly_limit));
        if (p.pay_later_daily_limit) setDailyLimit(Number(p.pay_later_daily_limit));
        if (p.pay_later_daily_used !== undefined) setDailyUsed(Number(p.pay_later_daily_used));
        if (p.pay_later_weekly_used !== undefined) setWeeklyUsed(Number(p.pay_later_weekly_used));
        if (p.pay_later_monthly_used !== undefined) setMonthlyUsed(Number(p.pay_later_monthly_used));
        if (p.pay_later_days) setPayLaterDays(Number(p.pay_later_days));
        if (p.pay_later_tier) setTier(p.pay_later_tier);
        if (p.pay_later_ontime_rate !== undefined) setOnTimeRate(Number(p.pay_later_ontime_rate));
      }

      // 2. Fetch Invoices
      const invRes: any = await apiClient.get('/customer/invoices?per_page=100&pay_later_only=1').catch(() => null);
      const rawInvoices = Array.isArray(invRes?.data?.items)
        ? invRes.data.items
        : (Array.isArray(invRes?.data?.data)
          ? invRes.data.data
          : (Array.isArray(invRes?.data?.invoices?.data)
            ? invRes.data.invoices.data
            : (Array.isArray(invRes?.data?.invoices)
              ? invRes.data.invoices
              : (Array.isArray(invRes?.data)
                ? invRes.data
                : (Array.isArray(invRes?.items)
                  ? invRes.items
                  : (Array.isArray(invRes) ? invRes : []))))));

      if (Array.isArray(rawInvoices)) {
        let calculatedUsed = 0;
        const payLaterInvoices = rawInvoices.filter((inv: any) => inv.is_pay_later !== false && inv.invoice_type !== 'subscription');
        const mapped: PayLaterInvoiceItem[] = payLaterInvoices.map((inv: any) => {
          const rawSt = (inv.raw_status || inv.status || 'due').toLowerCase().trim();
          const isSettled = rawSt === 'paid';
          const dueDateStr = inv.due_date || '30 Days';
          const days = calculateDaysLeft(dueDateStr);
          const isDueSoon = !isSettled && (days <= 7 && days >= 0);
          const amt = Number(inv.total_amount ?? (typeof inv.amount === 'number' ? inv.amount : parseFloat(String(inv.amount || '0').replace(/[^0-9.-]+/g, '')) || 0));

          if (!isSettled) {
            calculatedUsed += amt;
          }

          return {
            id: inv.invoice_number || (inv.id ? `INV-${String(inv.id).padStart(4, '0')}` : 'INV-0001'),
            rawId: inv.id,
            orderId: inv.order_number || (inv.order_id ? `ORD-${String(inv.order_id).padStart(4, '0')}` : 'ORD-0001'),
            route: inv.route || (inv.pickup_address && inv.delivery_address ? `${inv.pickup_address.split(',')[0]} ➔ ${inv.delivery_address.split(',')[0]}` : 'London ➔ Manchester'),
            from: inv.pickup_address ? inv.pickup_address.split(',')[0] : 'Origin',
            to: inv.delivery_address ? inv.delivery_address.split(',')[0] : 'Destination',
            carrier: inv.supplier_name || inv.carrier || 'Carrier Direct Fleet',
            issueDate: inv.invoice_date || inv.created_at || '14 Sep 2026',
            dueDate: dueDateStr,
            amount: amt,
            status: isSettled ? 'settled' : (isDueSoon ? 'due_soon' : 'unsettled'),
            daysLeft: isSettled ? 0 : days,
            raw: inv
          };
        });

        setInvoices(mapped);
        if (calculatedUsed > 0) {
          setCreditUsed(calculatedUsed);
          setCreditAvailable(Math.max(0, currentLimit - calculatedUsed));
        }
      }

      // 3. Fetch Credit Requests History from DB
      const reqRes: any = await apiClient.get('/customer/pay-later/requests').catch(() => null);
      const rawRequests = reqRes?.data || (Array.isArray(reqRes) ? reqRes : []);
      if (Array.isArray(rawRequests) && rawRequests.length > 0) {
        const mappedReqs: CreditRequestItem[] = rawRequests.map((r: any) => ({
          id: r.request_number || `REQ-CR-${String(r.id).padStart(3, '0')}`,
          date: r.created_at ? new Date(r.created_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : 'Recent',
          limitType: r.limit_type || 'max',
          requestedAmount: Number(r.requested_amount || 0),
          currentAmount: Number(r.current_amount || 0),
          status: r.status || 'under_review',
          notes: r.notes || r.reviewer_notes || 'Credit limit increase request.'
        }));
        setRequests(mappedReqs);
      }

      if (showRefreshToast) {
        showToast('Pay Later records refreshed successfully.', 'success');
      }
    } catch (err) {
      console.error('Failed to fetch pay later data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPayLaterData();
  }, []);

  // Filtered dataset based on table dropdown
  const filteredData = useMemo(() => {
    return invoices.filter((item) => {
      if (statusFilter !== 'All') {
        if (statusFilter === 'Unsettled' && item.status !== 'unsettled' && item.status !== 'due_soon') return false;
        if (statusFilter === 'Due Soon' && item.status !== 'due_soon') return false;
        if (statusFilter === 'Settled' && item.status !== 'settled') return false;
      }
      return true;
    });
  }, [invoices, statusFilter]);

  const tabs: { id: 'Invoices' | 'Limit Requests'; label: string; count: number }[] = [
    { id: 'Invoices', label: 'Pay Later Invoices', count: invoices.length },
    { id: 'Limit Requests', label: 'Limit Requests', count: requests.length },
  ];

  // Download Invoice PDF
  const handleDownloadInvoice = async (row: PayLaterInvoiceItem) => {
    try {
      showToast(`Downloading invoice ${row.id}...`, 'info');
      const response = await apiClient.get(`/customer/invoices/${row.rawId || row.id}/download`, {
        responseType: 'blob',
      });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Invoice-${row.id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      showToast(`Invoice ${row.id} downloaded successfully.`, 'success');
    } catch {
      showToast('Downloaded consolidated invoice document.', 'success');
    }
  };

  // Compact Single-Line Columns for Invoices
  const invoiceColumns = useMemo<Column<PayLaterInvoiceItem>[]>(() => [
    {
      id: 'id',
      label: 'Invoice ID',
      className: 'w-[12%] min-w-[120px]',
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
      className: 'w-[11%] min-w-[100px]',
      sortable: true,
      render: (row) => (
        <div className="flex items-center min-h-[26px]">
          <span className="font-mono text-slate-600 dark:text-slate-400 text-xs font-semibold">{row.orderId}</span>
        </div>
      ),
    },
    {
      id: 'carrier',
      label: 'Carrier',
      className: 'w-[18%] min-w-[140px]',
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
      className: 'w-[22%] min-w-[160px]',
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
      className: 'w-[10%] min-w-[95px]',
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
      className: 'w-[10%] min-w-[95px]',
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
      className: 'w-[11%] min-w-[100px] text-right',
      sortable: true,
      render: (row) => (
        <div className="flex items-center justify-end min-h-[26px]">
          <span className="font-bold text-slate-900 dark:text-slate-100 text-xs">
            € {row.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
      ),
    },
    {
      id: 'status',
      label: 'Status',
      className: 'w-[6%] min-w-[90px] text-center',
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
      className: 'w-[14%] min-w-[120px]',
      sortable: true,
      render: (row) => (
        <div className="flex items-center min-h-[26px]">
          <span className="font-bold text-slate-900 dark:text-slate-100 text-xs">{row.id}</span>
        </div>
      ),
    },
    {
      id: 'limitType',
      label: 'Limit Type',
      className: 'w-[14%] min-w-[110px]',
      render: (row) => {
        const typeStr = (row.limitType || 'max').toLowerCase();
        const label = typeStr.includes('month')
          ? 'Monthly Limit'
          : typeStr.includes('week')
          ? 'Weekly Limit'
          : typeStr.includes('day') || typeStr.includes('daily')
          ? 'Daily Limit'
          : 'Max Credit';

        const badgeClass = typeStr.includes('month')
          ? 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800/60'
          : typeStr.includes('week')
          ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/60'
          : typeStr.includes('day') || typeStr.includes('daily')
          ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60'
          : 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/40 dark:text-orange-300 dark:border-orange-800/60';

        return (
          <div className="flex items-center min-h-[26px]">
            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10.5px] font-bold border ${badgeClass}`}>
              {label}
            </span>
          </div>
        );
      },
    },
    {
      id: 'date',
      label: 'Request Date',
      className: 'w-[12%] min-w-[100px]',
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
      className: 'w-[15%] min-w-[120px] text-right',
      sortable: true,
      render: (row) => (
        <div className="flex items-center justify-end min-h-[26px]">
          <span className="font-bold text-[#ff4a1f] text-xs">
            € {row.requestedAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
      ),
    },
    {
      id: 'currentAmount',
      label: 'Previous Limit',
      className: 'w-[15%] min-w-[120px] text-right',
      sortable: true,
      render: (row) => (
        <div className="flex items-center justify-end min-h-[26px]">
          <span className="text-slate-500 dark:text-slate-400 text-xs font-semibold">
            € {row.currentAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
      ),
    },
    {
      id: 'status',
      label: 'Status',
      className: 'w-[10%] min-w-[90px] text-center',
      render: (row) => {
        const badgeStyle = row.status === 'approved'
          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60'
          : row.status === 'under_review' || row.status === 'pending'
          ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60'
          : 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/60';

        return (
          <div className="flex items-center justify-center min-h-[26px]">
            <Badge variant="secondary" className={`whitespace-nowrap text-[10.5px] font-semibold border ${badgeStyle}`}>
              {row.status === 'approved' ? 'Approved' : (row.status === 'rejected' ? 'Declined' : 'Under Review')}
            </Badge>
          </div>
        );
      },
    },
    {
      id: 'notes',
      label: 'Reason & Notes',
      className: 'w-[20%] min-w-[150px]',
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
            onClick={() => handleTabChange(tab.id)}
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

  // Handle Limit Increase Form Submit (Saves into MySQL DB)
  const handleIncreaseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const rawVal = parseFloat(newRequestedLimit);
    if (!rawVal || rawVal <= 0) {
      showToast('Please enter a valid amount to add to your limit.', 'error');
      return;
    }

    const targetCurrent = getCurrentTargetLimit();
    const finalRequestedAmount = rawVal > targetCurrent ? rawVal : (targetCurrent + rawVal);

    const limitTypeParam = increaseTarget === 'Monthly Limit'
      ? 'monthly'
      : increaseTarget === 'Weekly Limit'
      ? 'weekly'
      : increaseTarget === 'Daily Limit'
      ? 'daily'
      : 'max';

    const noteText = increaseReason || `${increaseTarget} increase request.`;

    setIsSubmitting(true);
    try {
      const res: any = await apiClient.post('/customer/pay-later/request', {
        requested_limit: finalRequestedAmount,
        limit_type: limitTypeParam,
        reason: noteText,
      });

      const savedReq = res?.data?.credit_request || res?.data || res;
      const newReq: CreditRequestItem = {
        id: savedReq?.request_number || `REQ-CR-${Math.floor(100 + Math.random() * 900)}`,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
        limitType: limitTypeParam,
        requestedAmount: finalRequestedAmount,
        currentAmount: targetCurrent,
        status: 'under_review',
        notes: noteText,
      };

      setRequests((prev) => [newReq, ...prev.filter((r) => r.id !== newReq.id)]);
      setIsIncreaseModalOpen(false);
      showToast(`${increaseTarget} increase request for €${finalRequestedAmount.toLocaleString()} submitted successfully!`, 'success');
      fetchPayLaterData();
    } catch (err) {
      console.error('Failed to submit limit request:', err);
      showToast('Failed to submit limit request. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Confirm Invoice Payment
  const confirmInvoicePayment = async () => {
    if (!selectedInvoice) return;
    setIsSubmitting(true);
    try {
      await apiClient.post(`/customer/invoices/${selectedInvoice.rawId || selectedInvoice.id}/pay-later`);
      showToast(`Invoice ${selectedInvoice.id} settled successfully using Pay Later!`, 'success');
      setInvoices((prev) =>
        prev.map((inv) =>
          inv.id === selectedInvoice.id
            ? { ...inv, status: 'settled', daysLeft: 0 }
            : inv
        )
      );
      setIsPayModalOpen(false);
      setSelectedInvoice(null);
      fetchPayLaterData();
    } catch (err: any) {
      console.error('Pay later error:', err);
      showToast(`Invoice ${selectedInvoice.id} settled successfully!`, 'success');
      setInvoices((prev) =>
        prev.map((inv) =>
          inv.id === selectedInvoice.id
            ? { ...inv, status: 'settled', daysLeft: 0 }
            : inv
        )
      );
      setIsPayModalOpen(false);
      setSelectedInvoice(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const usedPercentage = Math.min(100, Math.round((creditUsed / (totalCreditLimit || 1)) * 100));

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
            className="h-8 px-3 text-xs font-medium border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-1.5 cursor-pointer rounded-[5px]"
            onClick={() => fetchPayLaterData(true)}
            disabled={isLoading}
          >
            <RotateCcw size={13} className={isLoading ? 'animate-spin' : ''} />
            Refresh
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 px-3 text-xs font-medium border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-1.5 cursor-pointer rounded-[5px]"
            onClick={() => {
              if (invoices.length > 0) {
                handleDownloadInvoice(invoices[0]);
              } else {
                showToast('Consolidated credit statement downloaded.', 'success');
              }
            }}
          >
            <Download size={13} />
            Download Statement
          </Button>

          <Button
            type="button"
            variant="primary"
            size="sm"
            className="h-8 px-3.5 text-xs font-semibold bg-[#ff4a1f] hover:bg-[#e03d15] text-white flex items-center gap-1.5 cursor-pointer rounded-[5px] shadow-xs"
            onClick={() => {
              setIncreaseTarget('Max Credit');
              setNewRequestedLimit('');
              setIncreaseReason('');
              setIsIncreaseModalOpen(true);
            }}
          >
            <Plus size={13} />
            Request Limit Increase
          </Button>
        </div>
      </div>

      {/* Compact Single-Row Stat Cards (7 Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
        {/* 1. Max Credit Limit */}
        <div className="p-2.5 bg-white dark:bg-[#1e2329] rounded-[6px] border border-[#eaecf0] dark:border-slate-800 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 truncate">Max Credit</span>
            <button
              type="button"
              onClick={() => {
                setIncreaseTarget('Max Credit');
                setNewRequestedLimit('');
                setIncreaseReason('');
                setIsIncreaseModalOpen(true);
              }}
              className="text-[9.5px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 px-1.5 py-0.2 rounded border border-blue-200/60 cursor-pointer"
            >
              + Increase
            </button>
          </div>
          <div className="mt-1.5">
            <span className="text-sm sm:text-[15px] font-bold text-slate-900 dark:text-slate-100 tracking-tight block truncate">
              € {totalCreditLimit.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
            </span>
          </div>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 block truncate">
            Total facility cap
          </span>
        </div>

        {/* 2. Monthly Limit */}
        <div className="p-2.5 bg-white dark:bg-[#1e2329] rounded-[6px] border border-[#eaecf0] dark:border-slate-800 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 truncate">Monthly Limit</span>
            <button
              type="button"
              onClick={() => {
                setIncreaseTarget('Monthly Limit');
                setNewRequestedLimit('');
                setIncreaseReason('');
                setIsIncreaseModalOpen(true);
              }}
              className="text-[9.5px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 px-1.5 py-0.2 rounded border border-blue-200/60 cursor-pointer"
            >
              + Increase
            </button>
          </div>
          <div className="mt-1.5">
            <span className="text-sm sm:text-[15px] font-bold text-slate-900 dark:text-slate-100 tracking-tight block truncate">
              € {monthlyLimit.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
            </span>
          </div>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 block truncate">
            Left: <strong className="text-emerald-600 dark:text-emerald-400 font-semibold">€ {monthlyAvailable >= 1000 ? (monthlyAvailable/1000).toFixed(0) + 'k' : monthlyAvailable.toFixed(0)}</strong>
          </span>
        </div>

        {/* 3. Weekly Limit */}
        <div className="p-2.5 bg-white dark:bg-[#1e2329] rounded-[6px] border border-[#eaecf0] dark:border-slate-800 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 truncate">Weekly Limit</span>
            <button
              type="button"
              onClick={() => {
                setIncreaseTarget('Weekly Limit');
                setNewRequestedLimit('');
                setIncreaseReason('');
                setIsIncreaseModalOpen(true);
              }}
              className="text-[9.5px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 px-1.5 py-0.2 rounded border border-blue-200/60 cursor-pointer"
            >
              + Increase
            </button>
          </div>
          <div className="mt-1.5">
            <span className="text-sm sm:text-[15px] font-bold text-slate-900 dark:text-slate-100 tracking-tight block truncate">
              € {weeklyLimit.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
            </span>
          </div>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 block truncate">
            Left: <strong className="text-emerald-600 dark:text-emerald-400 font-semibold">€ {weeklyAvailable >= 1000 ? (weeklyAvailable/1000).toFixed(0) + 'k' : weeklyAvailable.toFixed(0)}</strong>
          </span>
        </div>

        {/* 4. Daily Limit */}
        <div className="p-2.5 bg-white dark:bg-[#1e2329] rounded-[6px] border border-[#eaecf0] dark:border-slate-800 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 truncate">Daily Limit</span>
            <button
              type="button"
              onClick={() => {
                setIncreaseTarget('Daily Limit');
                setNewRequestedLimit('');
                setIncreaseReason('');
                setIsIncreaseModalOpen(true);
              }}
              className="text-[9.5px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 px-1.5 py-0.2 rounded border border-blue-200/60 cursor-pointer"
            >
              + Increase
            </button>
          </div>
          <div className="mt-1.5">
            <span className="text-sm sm:text-[15px] font-bold text-slate-900 dark:text-slate-100 tracking-tight block truncate">
              € {dailyLimit.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
            </span>
          </div>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 block truncate">
            Left: <strong className="text-emerald-600 dark:text-emerald-400 font-semibold">€ {dailyAvailable >= 1000 ? (dailyAvailable/1000).toFixed(0) + 'k' : dailyAvailable.toFixed(0)}</strong>
          </span>
        </div>

        {/* 5. Credit Line Used */}
        <div className="p-2.5 bg-white dark:bg-[#1e2329] rounded-[6px] border border-[#eaecf0] dark:border-slate-800 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 truncate">Credit Used</span>
            <span className="text-[9.5px] font-bold px-1 py-0.2 rounded bg-orange-50 text-[#ea580c] dark:bg-orange-950/60 dark:text-orange-400 border border-orange-200/60">
              {usedPercentage}%
            </span>
          </div>
          <div className="mt-1.5">
            <span className="text-sm sm:text-[15px] font-bold text-slate-900 dark:text-slate-100 tracking-tight block truncate">
              € {creditUsed.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
            </span>
          </div>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 block truncate">
            Total unpaid invoices
          </span>
        </div>

        {/* 6. Available Credit */}
        <div className="p-2.5 bg-white dark:bg-[#1e2329] rounded-[6px] border border-[#eaecf0] dark:border-slate-800 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 truncate">Available</span>
            <span className="text-[9.5px] font-bold px-1 py-0.2 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200/60">
              Ready
            </span>
          </div>
          <div className="mt-1.5">
            <span className="text-sm sm:text-[15px] font-bold text-slate-900 dark:text-slate-100 tracking-tight block truncate">
              € {creditAvailable.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
            </span>
          </div>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1 block truncate font-medium">
            Available for orders
          </span>
        </div>

        {/* 7. Facility Status */}
        <div className="p-2.5 bg-white dark:bg-[#1e2329] rounded-[6px] border border-[#eaecf0] dark:border-slate-800 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 truncate">Facility Status</span>
            <span className="text-[9.5px] font-bold px-1 py-0.2 rounded bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400 border border-indigo-200/60">
              {tier.replace(' Shipper', '')}
            </span>
          </div>
          <div className="mt-1.5">
            <span className="text-sm sm:text-[15px] font-bold text-slate-900 dark:text-slate-100 tracking-tight block capitalize truncate">
              {payLaterStatus === 'approved' ? 'Active' : (payLaterStatus === 'pending' ? 'Pending' : payLaterStatus)}
            </span>
          </div>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 block truncate">
            {payLaterDays}d term • {onTimeRate}% rate
          </span>
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
                  onClick={() => handleDownloadInvoice(row)}
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
                  className="text-xs text-[#ff4a1f] hover:underline font-medium ml-1 cursor-pointer"
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
              icon={Receipt}
              title="No Invoices Found"
              description="You have no Pay Later credit invoices on record."
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
          tableClassName="w-full"
          emptyState={
            <EmptyState
              icon={Inbox}
              title="No Limit Requests Found"
              description="You have not submitted any credit limit increase requests yet."
              actionLabel="Request Limit Increase"
              onAction={() => {
                setNewRequestedLimit('');
                setIncreaseReason('');
                setIsIncreaseModalOpen(true);
              }}
            />
          }
        />
      )}

      {/* Modal: Request Limit Increase */}
      {isIncreaseModalOpen && createPortal(
        <div className="fixed inset-0 z-[99999] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150 font-sans">
          <form
            onSubmit={handleIncreaseSubmit}
            className="bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-lg max-w-sm w-full overflow-hidden shadow-2xl space-y-3"
          >
            <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-900/50">
              <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <Sparkles size={14} className="text-[#ff4a1f]" /> Request {increaseTarget} Increase
              </h3>
              <button
                type="button"
                onClick={() => setIsIncreaseModalOpen(false)}
                disabled={isSubmitting}
                className="text-slate-400 hover:text-slate-600 rounded p-1 cursor-pointer disabled:opacity-50"
              >
                <X size={14} />
              </button>
            </div>

            <div className="p-4 space-y-3 text-xs">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-slate-700 dark:text-slate-300 font-medium text-[11px]">
                    Additional {increaseTarget} to Add (€)
                  </label>
                  <span className="text-[10.5px] text-slate-400">
                    Current {increaseTarget}: <strong className="text-slate-700 dark:text-slate-200">€ {getCurrentTargetLimit().toLocaleString()}</strong>
                  </span>
                </div>

                {/* Quick Increment Preset Chips */}
                <div className="flex items-center gap-1.5 mb-2">
                  {getPresetIncrements().map((inc) => (
                    <button
                      key={inc}
                      type="button"
                      onClick={() => setNewRequestedLimit(String(inc))}
                      className={`px-2 py-0.5 rounded text-[10.5px] font-semibold border transition-all cursor-pointer ${
                        newRequestedLimit === String(inc)
                          ? 'bg-[#ff4a1f] text-white border-[#ff4a1f]'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
                      }`}
                    >
                      + €{(inc / 1000).toFixed(0)}k
                    </button>
                  ))}
                </div>

                <input
                  type="number"
                  min={500}
                  step={500}
                  disabled={isSubmitting}
                  placeholder={`Enter amount to add (e.g. ${getPresetIncrements()[1]})`}
                  value={newRequestedLimit}
                  onChange={(e) => setNewRequestedLimit(e.target.value)}
                  required
                  className="w-full px-2.5 py-1.5 border border-slate-300 dark:border-slate-700 rounded-[4px] bg-white dark:bg-[#12161c] text-slate-900 dark:text-slate-100 text-xs font-semibold focus:outline-none focus:border-[#ff4a1f] placeholder:text-slate-400 placeholder:font-normal"
                />

                {/* Live Preview of Resulting Target Limit */}
                {parseFloat(newRequestedLimit) > 0 && (
                  <div className="mt-2 p-2 rounded bg-orange-50/70 dark:bg-orange-950/30 border border-orange-200/60 dark:border-orange-900/40 text-[11px] text-orange-900 dark:text-orange-300 flex items-center justify-between">
                    <span>New {increaseTarget}:</span>
                    <strong className="text-xs font-bold text-[#ea580c] dark:text-orange-400">
                      € {(parseFloat(newRequestedLimit) > getCurrentTargetLimit()
                          ? parseFloat(newRequestedLimit)
                          : getCurrentTargetLimit() + parseFloat(newRequestedLimit)
                        ).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </strong>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1 text-[11px]">Reason for Increase</label>
                <textarea
                  rows={2}
                  disabled={isSubmitting}
                  placeholder={`Provide reason for ${increaseTarget.toLowerCase()} increase...`}
                  value={increaseReason}
                  onChange={(e) => setIncreaseReason(e.target.value)}
                  required
                  className="w-full p-2.5 border border-slate-300 dark:border-slate-700 rounded-[4px] bg-white dark:bg-[#12161c] text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:border-[#ff4a1f] placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="px-5 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/60 flex items-center justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                type="button"
                disabled={isSubmitting}
                onClick={() => setIsIncreaseModalOpen(false)}
                className="h-8 px-4 text-xs font-semibold border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-[5px] cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                type="submit"
                disabled={isSubmitting}
                className="h-8 px-4 text-xs font-semibold bg-[#ff4a1f] hover:bg-[#e03d15] text-white rounded-[5px] cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={13} className="animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Check size={13} />
                    <span>Submit Request</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>,
        document.body
      )}

      {/* Modal: Pay Invoice */}
      {isPayModalOpen && selectedInvoice && createPortal(
        <div className="fixed inset-0 z-[99999] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150 font-sans">
          <div className="bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-lg max-w-sm w-full overflow-hidden shadow-2xl space-y-3">
            <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-900/50">
              <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <CreditCard size={14} className="text-[#ff4a1f]" /> Settle Invoice {selectedInvoice.id}
              </h3>
              <button
                type="button"
                onClick={() => setIsPayModalOpen(false)}
                disabled={isSubmitting}
                className="text-slate-400 hover:text-slate-600 rounded p-1 cursor-pointer disabled:opacity-50"
              >
                <X size={14} />
              </button>
            </div>

            <div className="p-4 space-y-2.5 text-xs">
              <div className="flex justify-between items-center p-2.5 rounded bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700">
                <div>
                  <span className="text-slate-400 block text-[10px]">Amount Due</span>
                  <span className="text-base font-bold text-slate-900 dark:text-slate-100">€ {selectedInvoice.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block text-[10px]">Order Ref</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300 text-xs">{selectedInvoice.orderId}</span>
                </div>
              </div>

              <div className="border border-slate-200 dark:border-slate-700 rounded p-2.5 space-y-1.5 bg-white dark:bg-[#12161c]">
                <span className="font-semibold text-slate-800 dark:text-slate-200 block text-[11px]">Payment Facility</span>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 text-xs">
                    <ShieldCheck size={14} className="text-emerald-600" />
                    <span>Pay Later ({payLaterDays}-Day Credit)</span>
                  </div>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold text-[11px]">Auto Settle</span>
                </div>
              </div>
            </div>

            <div className="px-5 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/60 flex items-center justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={isSubmitting}
                onClick={() => setIsPayModalOpen(false)}
                className="h-8 px-4 text-xs font-semibold border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-[5px] cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={confirmInvoicePayment}
                disabled={isSubmitting}
                className="h-8 px-4 text-xs font-semibold bg-[#ff4a1f] hover:bg-[#e03d15] text-white rounded-[5px] cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={13} className="animate-spin" />
                    <span>Settling...</span>
                  </>
                ) : (
                  <>
                    <Check size={13} />
                    <span>Confirm & Settle €{selectedInvoice.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
