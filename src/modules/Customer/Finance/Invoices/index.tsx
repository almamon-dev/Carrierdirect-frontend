import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Receipt } from 'lucide-react';
import DataTable from '@/components/tables/data-table';
import EmptyState from '@/components/tables/empty-state';
import RatingModal from '@/components/modals/rating-modal';
import apiClient from '@/lib/axios';
import { exportInvoicePdf } from '@/utils/exportInvoicePdf';
import { useExportModalStore } from '@/stores/useExportModalStore';

import { useCustomerInvoices } from './hooks/useCustomerInvoices';
import { useFilteredCustomerInvoices } from './hooks/useFilteredCustomerInvoices';
import { InvoiceFilterTabs } from './components/InvoiceFilterTabs';
import { TableFilterContent } from './components/TableFilterContent';
import { getInvoiceColumns } from './components/columns';
import { InvoiceRowActions } from './components/InvoiceRowActions';
import { InvoiceMetricsRow } from './components/InvoiceMetricsRow';
import { InvoiceHeader } from './components/InvoiceHeader';
import { CustomerInvoiceItem, InvoiceFilterTab } from './types';
import InvoiceView from './View';

export default function InvoicesPage() {
  const navigate = useNavigate();
  const {
    invoices,
    stats,
    calculatedStats,
    isLoading,
    isRefreshing,
    ratingTarget,
    setRatingTarget,
    fetchInvoices,
  } = useCustomerInvoices();

  const [activeTab, setActiveTab] = useState<InvoiceFilterTab>('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<CustomerInvoiceItem | null>(null);

  const handleResetFilters = () => {
    setStatusFilter('all');
    setPaymentMethodFilter('all');
    setStartDate('');
    setEndDate('');
  };

  const filteredInvoices = useFilteredCustomerInvoices({
    invoices,
    activeTab,
    statusFilter,
    paymentMethodFilter,
    startDate,
    endDate,
  });

  const handleViewInvoice = (inv: CustomerInvoiceItem) => {
    setSelectedInvoice(inv);
  };

  const handlePayInvoice = async (inv: CustomerInvoiceItem) => {
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
    useExportModalStore.getState().openExportModal({ reportName: 'Shipper Invoices' });
  };

  const columns = useMemo(() => getInvoiceColumns(handleViewInvoice), []);

  if (selectedInvoice) {
    return (
      <div className="p-4 md:p-6 w-full mx-auto min-h-screen bg-[#f8fafc] dark:bg-[#12161c] font-sans antialiased">
        <InvoiceView
          invoice={selectedInvoice}
          onBack={() => setSelectedInvoice(null)}
          onDownload={(inv) => exportInvoicePdf(inv || selectedInvoice)}
        />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 w-full mx-auto min-h-screen font-sans antialiased bg-[#f8fafc] dark:bg-[#12161c] space-y-3.5">
      <InvoiceHeader
        isRefreshing={isRefreshing}
        onRefresh={() => fetchInvoices(true)}
        onExportCSV={handleExportCSV}
      />

      <InvoiceMetricsRow
        calculatedStats={calculatedStats}
        isLoading={isLoading}
      />

      <DataTable
        data={filteredInvoices}
        columns={columns}
        actions={(row: CustomerInvoiceItem) => (
          <InvoiceRowActions
            row={row}
            onViewDetails={handleViewInvoice}
            onOpenRating={(target) => setRatingTarget(target)}
            onPayInvoice={handlePayInvoice}
          />
        )}
        actionsColumnClassName="w-[105px] min-w-[105px] text-right pr-3.5"
        headerTabs={
          <InvoiceFilterTabs
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
            title="No Invoices Found"
            description={
              activeTab === 'all'
                ? 'There are no billing invoices associated with your account yet.'
                : `No invoices matching '${activeTab}'.`
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
              fetchInvoices();
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
