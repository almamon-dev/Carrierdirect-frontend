import React, { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Clock, Wallet, TrendingUp } from 'lucide-react';
import apiClient from '@/lib/axios';
import { useExportModalStore } from '@/stores/useExportModalStore';
import { SubscriptionLockModal } from '@/components/modals';
import { useSubscriptionQuota } from '@/hooks/useSubscriptionQuota';

import { getPayLaterColumns } from './components/columns';
import { useCustomerPayLater } from './hooks/useCustomerPayLater';
import { useFilteredCustomerPayLater } from './hooks/useFilteredCustomerPayLater';
import { CustomerPayLaterItem, PayLaterFilterTab } from './types';
import PayLaterHeader from './components/PayLaterHeader';
import PayLaterUpgradeBanner from './components/PayLaterUpgradeBanner';
import PayLaterMetricsRow from './components/PayLaterMetricsRow';
import PayLaterTableSection from './components/PayLaterTableSection';
import PayLaterIncreaseModal from './components/PayLaterIncreaseModal';
import PayLaterCreditRequestsTable from './components/PayLaterCreditRequestsTable';
import PayLaterSettleModal from './components/PayLaterSettleModal';

export default function CustomerPayLaterPage() {
  const navigate = useNavigate();
  const {
    canUsePayLater,
    checkPayLaterOrLock,
    isLockModalOpen: isSubLockModalOpen,
    setIsLockModalOpen: setIsSubLockModalOpen,
    modalTitle,
    modalDescription,
    modalFeatureName,
    modalRequiredPlan,
    modalBenefits,
    handleUpgradeRedirect,
  } = useSubscriptionQuota();

  const {
    invoices,
    creditRequests,
    stats,
    calculatedStats,
    isLoading,
    isRefreshing,
    fetchPayLaterData,
  } = useCustomerPayLater();

  const [activeTab, setActiveTab] = useState<PayLaterFilterTab>('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [searchParams] = useSearchParams();
  const initialView = searchParams.get('tab') === 'requests' || searchParams.get('view') === 'requests' ? 'requests' : 'invoices';
  const [viewSection, setViewSection] = useState<'invoices' | 'requests'>(initialView);

  const pendingRequest = useMemo(() => {
    return creditRequests.find((r) => r.status === 'under_review' || r.status === 'pending');
  }, [creditRequests]);

  const [isIncreaseModalOpen, setIsIncreaseModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<CustomerPayLaterItem | null>(null);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);

  const handleResetFilters = () => {
    setStatusFilter('all');
    setStartDate('');
    setEndDate('');
  };

  const filteredInvoices = useFilteredCustomerPayLater({
    invoices,
    activeTab,
    statusFilter,
    startDate,
    endDate,
  });

  const handleViewInvoice = (inv: CustomerPayLaterItem) => {
    navigate('/customer/finance/invoices');
  };

  const handleOpenPayModal = (inv: CustomerPayLaterItem) => {
    setSelectedInvoice(inv);
    setIsPayModalOpen(true);
  };

  const confirmInvoicePayment = async () => {
    if (!selectedInvoice) return;
    if (!checkPayLaterOrLock()) return;
    setIsSubmitting(true);
    try {
      await apiClient.post(`/customer/invoices/${selectedInvoice.id}/pay-later`);
      setIsPayModalOpen(false);
      setSelectedInvoice(null);
      fetchPayLaterData();
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleIncreaseSubmit = async (target: string, amount: string, reason: string) => {
    if (!checkPayLaterOrLock()) return;
    if (!amount || parseFloat(amount) <= 0) return;

    setIsSubmitting(true);
    try {
      let limitTypeKey = 'monthly';
      if (target === 'Monthly Limit') limitTypeKey = 'monthly';
      else if (target === 'Weekly Limit') limitTypeKey = 'weekly';
      else if (target === 'Daily Limit') limitTypeKey = 'daily';

      await apiClient.post('/customer/pay-later/request', {
        requested_limit: parseFloat(amount),
        limit_type: limitTypeKey,
        reason,
      });

      setIsIncreaseModalOpen(false);
      fetchPayLaterData();
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExportCSV = () => {
    useExportModalStore.getState().openExportModal({ reportName: 'Pay Later Credit Facilities' });
  };

  const columns = useMemo(() => getPayLaterColumns(handleViewInvoice), []);

  return (
    <div className="p-4 md:p-6 w-full mx-auto min-h-screen font-sans antialiased bg-[#f8fafc] dark:bg-[#12161c] space-y-3.5">
      <PayLaterHeader
        payLaterDays={calculatedStats.payLaterDays}
        isRefreshing={isRefreshing}
        canUsePayLater={canUsePayLater}
        onRefresh={() => fetchPayLaterData(true)}
        onExportCSV={handleExportCSV}
        onRequestIncrease={() => checkPayLaterOrLock(() => setIsIncreaseModalOpen(true))}
      />

      {!canUsePayLater && <PayLaterUpgradeBanner onUpgrade={() => checkPayLaterOrLock()} />}

      <PayLaterMetricsRow calculatedStats={calculatedStats} isLoading={isLoading} />

      {pendingRequest && (
        <div className="p-3.5 bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/90 dark:border-amber-800/60 rounded-[4px] text-xs flex items-center justify-between gap-3 font-sans shadow-2xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0 border border-amber-200 dark:border-amber-800/50">
              <Clock size={16} />
            </div>
            <div>
              <span className="font-bold text-amber-900 dark:text-amber-200 text-xs flex items-center gap-1.5">
                Credit Limit Request Under Review ({pendingRequest.request_number})
              </span>
              <p className="text-[11px] text-amber-700 dark:text-amber-400 mt-0.5">
                Your application for €{Number(pendingRequest.requested_amount).toLocaleString()} ({pendingRequest.limit_type || 'credit line'}) has been received and is being evaluated by underwriting.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setViewSection('requests')}
            className="text-[11px] font-bold px-2.5 py-1 bg-amber-100 hover:bg-amber-200/80 dark:bg-amber-900/80 dark:hover:bg-amber-900 text-amber-800 dark:text-amber-200 rounded cursor-pointer transition-colors shrink-0"
          >
            View Request
          </button>
        </div>
      )}

      {/* View Switcher: Orders & Settlements vs Credit Limit Requests (Toggle Switch style matching Subscription) */}
      <div className="flex items-center justify-between pb-3 pt-1 border-b border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center gap-3 shrink-0 bg-slate-50/80 dark:bg-slate-850/80 p-1.5 px-3.5 rounded-full border border-slate-200/80 dark:border-slate-800 shadow-2xs">
          <button
            type="button"
            onClick={() => setViewSection('invoices')}
            className={`text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
              viewSection === 'invoices'
                ? 'text-slate-900 dark:text-slate-100'
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
            }`}
          >
            <Wallet size={14} className={viewSection === 'invoices' ? 'text-[#ff4a1f]' : 'text-slate-400'} />
            <span>Orders & Invoices</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
              viewSection === 'invoices'
                ? 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
            }`}>
              {invoices.length}
            </span>
          </button>

          <button
            type="button"
            role="switch"
            aria-checked={viewSection === 'requests'}
            onClick={() => setViewSection(viewSection === 'invoices' ? 'requests' : 'invoices')}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
              viewSection === 'requests' ? 'bg-[#ff4a1f]' : 'bg-slate-300 dark:bg-slate-700'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                viewSection === 'requests' ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>

          <button
            type="button"
            onClick={() => setViewSection('requests')}
            className={`text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
              viewSection === 'requests'
                ? 'text-slate-900 dark:text-slate-100'
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
            }`}
          >
            <TrendingUp size={14} className={viewSection === 'requests' ? 'text-[#ff4a1f]' : 'text-slate-400'} />
            <span>Credit Limit Requests</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full font-extrabold bg-orange-100 dark:bg-orange-950/80 text-[#ff4a1f] dark:text-orange-400 border border-orange-200/80 dark:border-orange-900/60 shadow-2xs">
              {creditRequests.length}
            </span>
          </button>
        </div>
      </div>

      {/* Active Section Content */}
      {viewSection === 'invoices' ? (
        <PayLaterTableSection
          filteredInvoices={filteredInvoices}
          columns={columns}
          invoices={invoices}
          stats={stats}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          handleResetFilters={handleResetFilters}
          handleViewInvoice={handleViewInvoice}
          handleOpenPayModal={handleOpenPayModal}
          isLoading={isLoading}
          isRefreshing={isRefreshing}
        />
      ) : (
        <PayLaterCreditRequestsTable
          creditRequests={creditRequests}
          isLoading={isLoading || isRefreshing}
          onRequestIncrease={() => checkPayLaterOrLock(() => setIsIncreaseModalOpen(true))}
        />
      )}

      <PayLaterIncreaseModal
        isOpen={isIncreaseModalOpen}
        onClose={() => setIsIncreaseModalOpen(false)}
        calculatedStats={calculatedStats}
        onSubmit={handleIncreaseSubmit}
        isSubmitting={isSubmitting}
      />

      <PayLaterSettleModal
        isOpen={isPayModalOpen}
        onClose={() => setIsPayModalOpen(false)}
        selectedInvoice={selectedInvoice}
        payLaterDays={calculatedStats.payLaterDays}
        isSubmitting={isSubmitting}
        onConfirm={confirmInvoicePayment}
      />

      <SubscriptionLockModal
        isOpen={isSubLockModalOpen}
        onClose={() => setIsSubLockModalOpen(false)}
        onUpgrade={handleUpgradeRedirect}
        userType="customer"
        title={modalTitle}
        description={modalDescription}
        featureName={modalFeatureName}
        requiredPlan={modalRequiredPlan}
        benefits={modalBenefits}
      />
    </div>
  );
}
