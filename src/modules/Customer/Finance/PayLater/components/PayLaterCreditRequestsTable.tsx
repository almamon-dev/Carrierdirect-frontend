import React, { useMemo, useState } from 'react';
import {
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Calendar,
  Plus,
} from 'lucide-react';
import DataTable, { Column } from '@/components/tables/data-table';
import EmptyState from '@/components/tables/empty-state';
import Button from '@/components/ui/button';
import { StatusBadge } from '@/components/common/StatusBadge';

export interface CreditRequestItem {
  id: number;
  request_number: string;
  limit_type?: string;
  requested_amount: number | string;
  current_amount?: number | string;
  status: 'pending' | 'under_review' | 'approved' | 'rejected' | 'suspended';
  notes?: string;
  reviewer_notes?: string;
  reviewed_at?: string;
  created_at: string;
  updated_at?: string;
}

interface PayLaterCreditRequestsTableProps {
  creditRequests: CreditRequestItem[];
  isLoading: boolean;
  onRequestIncrease: () => void;
}

export const PayLaterCreditRequestsTable: React.FC<PayLaterCreditRequestsTableProps> = ({
  creditRequests,
  isLoading,
  onRequestIncrease,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  const formatDate = (dateString?: string) => {
    if (!dateString) return '—';
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  const renderStatusBadge = (status: string) => {
    const s = String(status || '').toLowerCase().trim();
    if (s === 'approved') {
      return <StatusBadge status="Approved" category="success" />;
    }
    if (s === 'under_review' || s === 'pending') {
      return <StatusBadge status="Under Review" category="pending" />;
    }
    if (s === 'rejected') {
      return <StatusBadge status="Rejected" category="failed" />;
    }
    if (s === 'suspended') {
      return <StatusBadge status="Suspended" category="failed" />;
    }
    return <StatusBadge status={status} />;
  };

  const renderLimitType = (type?: string) => {
    switch (type) {
      case 'monthly':
        return 'Monthly Limit';
      case 'weekly':
        return 'Weekly Limit';
      case 'daily':
        return 'Daily Limit';
      default:
        return 'Total Facility Limit';
    }
  };

  const counts = useMemo(() => {
    let pending = 0;
    let approved = 0;
    let rejected = 0;
    creditRequests.forEach((req) => {
      const st = String(req.status || '').toLowerCase();
      if (st === 'approved') approved++;
      else if (st === 'rejected' || st === 'suspended') rejected++;
      else pending++;
    });
    return {
      all: creditRequests.length,
      pending,
      approved,
      rejected,
    };
  }, [creditRequests]);

  const filteredRequests = useMemo(() => {
    if (activeTab === 'all') return creditRequests;
    if (activeTab === 'pending') {
      return creditRequests.filter((r) => r.status === 'pending' || r.status === 'under_review');
    }
    if (activeTab === 'approved') {
      return creditRequests.filter((r) => r.status === 'approved');
    }
    if (activeTab === 'rejected') {
      return creditRequests.filter((r) => r.status === 'rejected' || r.status === 'suspended');
    }
    return creditRequests;
  }, [creditRequests, activeTab]);

  const tabs = [
    { id: 'all', label: 'All Requests', count: counts.all },
    { id: 'pending', label: 'Pending / Review', count: counts.pending },
    { id: 'approved', label: 'Approved', count: counts.approved },
    { id: 'rejected', label: 'Rejected', count: counts.rejected },
  ];

  const headerTabs = (
    <div className="flex items-center gap-1.5 sm:gap-2.5 overflow-x-auto hide-scrollbar mb-[-1px]">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-1.5 pb-2.5 border-b-2 text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              isActive
                ? 'border-[#ff4a1f] text-[#ff4a1f] font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                isActive
                  ? 'bg-orange-100 dark:bg-orange-950/70 text-[#ff4a1f] dark:text-orange-400'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              {tab.count}
            </span>
          </button>
        );
      })}
    </div>
  );

  const columns: Column<CreditRequestItem>[] = useMemo(
    () => [
      {
        id: 'request_number',
        label: 'Request #',
        sortable: true,
        className: 'w-[160px]',
        render: (req) => (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-orange-50 dark:bg-orange-950/60 text-[#ff4a1f] flex items-center justify-center shrink-0 border border-orange-200/60 dark:border-orange-800/50">
              <FileText size={12} />
            </div>
            <span className="font-bold text-slate-900 dark:text-slate-100 text-xs">
              {req.request_number}
            </span>
          </div>
        ),
      },
      {
        id: 'limit_type',
        label: 'Limit Type',
        sortable: true,
        className: 'w-[140px]',
        render: (req) => (
          <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700">
            {renderLimitType(req.limit_type)}
          </span>
        ),
      },
      {
        id: 'requested_amount',
        label: 'Requested Amount',
        sortable: true,
        className: 'w-[150px]',
        render: (req) => (
          <span className="font-black text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
            €
            {Number(req.requested_amount).toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        ),
      },
      {
        id: 'status',
        label: 'Status',
        sortable: true,
        className: 'w-[130px]',
        render: (req) => renderStatusBadge(req.status),
      },
      {
        id: 'notes',
        label: 'Reviewer Notes',
        className: 'min-w-[200px]',
        render: (req) => (
          <span
            className="text-[11px] text-slate-600 dark:text-slate-400 block max-w-xs truncate"
            title={req.reviewer_notes || req.notes || '—'}
          >
            {req.reviewer_notes || req.notes || '—'}
          </span>
        ),
      },
      {
        id: 'created_at',
        label: 'Submitted Date',
        sortable: true,
        className: 'w-[140px]',
        render: (req) => (
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
            <Calendar size={12} className="text-slate-400 shrink-0" />
            <span>{formatDate(req.created_at)}</span>
          </div>
        ),
      },
      {
        id: 'reviewed_at',
        label: 'Reviewed Date',
        sortable: true,
        className: 'w-[140px]',
        render: (req) => (
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            {req.reviewed_at ? (
              formatDate(req.reviewed_at)
            ) : (
              <span className="text-amber-600 dark:text-amber-400 font-semibold">
                Awaiting Review
              </span>
            )}
          </div>
        ),
      },
    ],
    []
  );

  return (
    <div className="space-y-2 font-sans">
      <div className="flex items-center justify-between pb-1">
        <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <TrendingUp size={16} className="text-[#ff4a1f]" /> Credit Facility Expansion Requests
        </h2>
        <Button
          variant="primary"
          size="sm"
          onClick={onRequestIncrease}
          className="h-8 px-3.5 text-xs font-bold bg-[#ff4a1f] hover:bg-[#e03d15] text-white shadow-2xs inline-flex items-center gap-1.5 cursor-pointer"
        >
          <Plus size={13} />
          <span>Request Credit Line</span>
        </Button>
      </div>

      <DataTable
        data={filteredRequests}
        columns={columns}
        keyExtractor={(item) => item.id}
        searchPlaceholder="Search requests by number, notes, or limit type..."
        headerTabs={headerTabs}
        compact={true}
        isLoading={isLoading}
        hideCheckbox={true}
        selectable={false}
        tableClassName="w-full"
        emptyState={
          <EmptyState
            icon={TrendingUp}
            title="No Credit Limit Requests Found"
            description={
              activeTab === 'all'
                ? 'You have not submitted any credit facility applications or limit expansion requests yet.'
                : `No credit requests matching '${activeTab}'.`
            }
            actionLabel="Request Credit Line"
            onAction={onRequestIncrease}
          />
        }
      />
    </div>
  );
};

export default PayLaterCreditRequestsTable;

