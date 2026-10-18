import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Receipt } from 'lucide-react';
import DataTable from '@/components/tables/data-table';
import EmptyState from '@/components/tables/empty-state';
import RatingModal from '@/components/modals/rating-modal';
import apiClient from '@/lib/axios';
import { useExportModalStore } from '@/stores/useExportModalStore';

import { useCustomerBilling } from './hooks/useCustomerBilling';
import { useFilteredCustomerBilling } from './hooks/useFilteredCustomerBilling';
import { BillingFilterTabs } from './components/BillingFilterTabs';
import { TableFilterContent } from './components/TableFilterContent';
import { getBillingColumns } from './components/columns';
import { BillingRowActions } from './components/BillingRowActions';
import { BillingMetricsRow } from './components/BillingMetricsRow';
import { BillingHeader } from './components/BillingHeader';
import { CustomerBillingItem, BillingFilterTab } from './types';

export default function CustomerBillingPage() {
  const navigate = useNavigate();
  const {
    invoices,
    stats,
    calculatedStats,
    isLoading,
    isRefreshing,
    ratingTarget,
    setRatingTarget,
    fetchBillingData,
  } = useCustomerBilling();

  const [activeTab, setActiveTab] = useState<BillingFilterTab>('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleResetFilters = () => {
    setStatusFilter('all');
    setPaymentMethodFilter('all');
    setStartDate('');
    setEndDate('');
  };

  const filteredInvoices = useFilteredCustomerBilling({
    invoices,
    activeTab,
    statusFilter,
    paymentMethodFilter,
    startDate,
    endDate,
  });

  const handleViewInvoice = (inv: CustomerBillingItem) => {
    navigate('/customer/finance/invoices');
  };

  const handlePayInvoice = async (inv: CustomerBillingItem) => {
    try {
      const res = await apiClient.post(`/customer/invoices/${inv.id}/pay`);
      if (res.data?.data?.checkout_url) {
        window.location.href = res.data.data.checkout_url;
      } else {
        navigate('/customer/finance/pay-later');
      }
    } catch (err) {
      console.error('Failed to initiate payment:', err);
      navigate('/customer/finance/pay-later');
    }
  };

  const handleExportCSV = () => {
    useExportModalStore.getState().openExportModal({ reportName: 'Shipper Billing Statements' });
  };

  const columns = useMemo(() => getBillingColumns(handleViewInvoice), []);

  return (
    <div className="p-4 md:p-6 w-full mx-auto min-h-screen font-sans antialiased bg-[#f8fafc] dark:bg-[#12161c] space-y-3.5">
      <BillingHeader
        isRefreshing={isRefreshing}
        onRefresh={() => fetchBillingData(true)}
        onExportCSV={handleExportCSV}
      />

      <BillingMetricsRow
        calculatedStats={calculatedStats}
        isLoading={isLoading}
      />

      <DataTable
        data={filteredInvoices}
        columns={columns}
        actions={(row: CustomerBillingItem) => (
          <BillingRowActions
            row={row}
            onViewDetails={handleViewInvoice}
            onOpenRating={(target) => setRatingTarget(target)}
            onPayInvoice={handlePayInvoice}
          />
        )}
        actionsColumnClassName="w-[105px] min-w-[105px] text-right pr-3.5"
        headerTabs={
          <BillingFilterTabs
            invoices={invoices}
            stats={stats}
            activeTab={activeTab}
            onSelectTab={setActiveTab}
          />
        }
        filterContent={
          <TableFilterContent
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            paymentMethodFilter={paymentMethodFilter}
            setPaymentMethodFilter={setPaymentMethodFilter}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            onResetFilters={handleResetFilters}
          />
        }
        searchPlaceholder="Search invoices by ID, order, customer email, or amount..."
        compact={true}
        isLoading={isLoading || isRefreshing}
        onRowClick={(row) => handleViewInvoice(row)}
        tableClassName="w-full"
        emptyState={
          <EmptyState
            icon={Receipt}
            title="No Billing Records Found"
            description={
              activeTab === 'all'
                ? 'There are no billing records associated with your account yet.'
                : `No records matching '${activeTab}'.`
            }
          />
        }
      />

      {ratingTarget && (
        <RatingModal
          isOpen={Boolean(ratingTarget)}
          onClose={() => setRatingTarget(null)}
          orderId={String(ratingTarget.id)}
          targetName={ratingTarget.supplier}
          targetRole="Supplier"
          orderTitle={ratingTarget.route || 'Freight Dispatch Service'}
          onSubmit={async (data) => {
            try {
              await apiClient.post(`/customer/orders/${ratingTarget.id}/review`, data);
              fetchBillingData();
              setRatingTarget(null);
            } catch (err: any) {
              console.error(err);
              setRatingTarget(null);
            }
          }}
        />
      )}
    </div>
  );
}
