import React, { useState, useMemo } from 'react';
import { CreditCard } from 'lucide-react';
import DataTable from '@/components/tables/data-table';
import EmptyState from '@/components/tables/empty-state';
import { useExportModalStore } from '@/stores/useExportModalStore';

import { useCustomerPayments } from './hooks/useCustomerPayments';
import { useFilteredCustomerPayments } from './hooks/useFilteredCustomerPayments';
import { PaymentFilterTabs } from './components/PaymentFilterTabs';
import { TableFilterContent } from './components/TableFilterContent';
import { getPaymentColumns } from './components/columns';
import { PaymentRowActions } from './components/PaymentRowActions';
import { PaymentMetricsRow } from './components/PaymentMetricsRow';
import { PaymentHeader } from './components/PaymentHeader';
import { CustomerPaymentItem, PaymentFilterTab } from './types';

export default function CustomerPaymentsPage() {
  const {
    payments,
    stats,
    calculatedStats,
    isLoading,
    isRefreshing,
    selectedPayment,
    setSelectedPayment,
    fetchPayments,
  } = useCustomerPayments();

  const [activeTab, setActiveTab] = useState<PaymentFilterTab>('all');
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

  const filteredPayments = useFilteredCustomerPayments({
    payments,
    activeTab,
    statusFilter,
    paymentMethodFilter,
    startDate,
    endDate,
  });

  const handleExportCSV = () => {
    useExportModalStore.getState().openExportModal({ reportName: 'Shipper Payment History' });
  };

  const columns = useMemo(() => getPaymentColumns(setSelectedPayment), [setSelectedPayment]);

  return (
    <div className="p-4 md:p-6 w-full mx-auto min-h-screen font-sans antialiased bg-[#f8fafc] dark:bg-[#12161c] space-y-3.5">
      <PaymentHeader
        isRefreshing={isRefreshing}
        onRefresh={() => fetchPayments(true)}
        onExportCSV={handleExportCSV}
      />

      <PaymentMetricsRow
        calculatedStats={calculatedStats}
        isLoading={isLoading}
      />

      <DataTable
        data={filteredPayments}
        columns={columns}
        actions={(row: CustomerPaymentItem) => (
          <PaymentRowActions row={row} onViewReceipt={setSelectedPayment} />
        )}
        actionsColumnClassName="w-[105px] min-w-[105px] text-right pr-3.5"
        headerTabs={
          <PaymentFilterTabs
            payments={payments}
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
        searchPlaceholder="Search payments by ID, order, method, or amount..."
        compact={true}
        isLoading={isLoading || isRefreshing}
        onRowClick={(row) => setSelectedPayment(row)}
        tableClassName="w-full"
        emptyState={
          <EmptyState
            icon={CreditCard}
            title="No Payment Records Found"
            description={
              activeTab === 'all'
                ? 'There are no payment transactions associated with your account yet.'
                : `No payments matching '${activeTab}'.`
            }
          />
        }
      />
    </div>
  );
}
