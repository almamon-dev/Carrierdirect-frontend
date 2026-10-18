import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Receipt, 
  Download, 
  RefreshCw,
  FileText
} from 'lucide-react';
import DataTable from '@/components/tables/data-table';
import Button from '@/components/ui/button';
import EmptyState from '@/components/tables/empty-state';
import { PaymentRowActions } from './components/PaymentRowActions';
import { PaymentFilterTabs } from './components/PaymentFilterTabs';
import { PaymentFilterContent } from './components/PaymentFilterContent';
import { getPaymentColumns } from './components/columns';
import { PaymentDetailsModal } from './components/PaymentDetailsModal';
import { useExportModalStore } from '@/stores/useExportModalStore';
import { useSupplierPaymentsState } from './hooks/useSupplierPaymentsState';

export default function SupplierPayments() {
  const navigate = useNavigate();
  const {
    payments,
    selectedPayment,
    setSelectedPayment,
    isLoading,
    isRefreshing,
    activeTab,
    setActiveTab,
    stageFilter,
    setStageFilter,
    methodFilter,
    setMethodFilter,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    filteredPayments,
    fetchPayments,
    handleDownload,
    handleResetFilters,
  } = useSupplierPaymentsState();

  const handleExportCSV = () => {
    useExportModalStore.getState().openExportModal({ reportName: 'Carrier Payment Ledger' });
  };

  const columns = useMemo(() => getPaymentColumns((pay) => setSelectedPayment(pay)), [setSelectedPayment]);

  return (
    <div className="p-4 md:p-6 w-full mx-auto min-h-screen font-sans antialiased bg-[#f8fafc] dark:bg-[#12161c] space-y-3.5">
      {/* Header with Title, Refresh, Export, and Action buttons */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight mb-1">
            Supplier Payments & Settlements
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Track job earnings, customer payment terms (Pay Later / Immediate), escrow countdowns, and cleared payouts.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchPayments(true)}
            disabled={isRefreshing}
            className="h-8 px-3 text-xs font-semibold flex items-center gap-1.5 cursor-pointer bg-white dark:bg-[#1e2329] border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            <RefreshCw size={13} className={isRefreshing ? 'animate-spin text-[#ff4a1f]' : 'text-slate-500'} />
            <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            className="h-8 px-3 text-xs font-semibold flex items-center gap-1.5 cursor-pointer bg-white dark:bg-[#1e2329] border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            <Download size={13} className="text-slate-500" />
            <span>Export CSV</span>
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/supplier/finance/invoices')}
            className="h-8 px-3.5 bg-[#ff4a1f] hover:bg-[#e03e15] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <FileText size={14} />
            <span>View Invoices</span>
          </Button>
        </div>
      </div>

      {/* Main DataTable Grid */}
      <DataTable
        data={filteredPayments}
        columns={columns}
        actions={(row: any) => (
          <PaymentRowActions
            row={row}
            onViewDetails={(r) => setSelectedPayment(r)}
            onDownload={(r) => handleDownload(r)}
          />
        )}
        actionsColumnClassName="w-[50px] min-w-[45px] text-right pr-2"
        headerTabs={
          <PaymentFilterTabs
            payments={payments}
            activeTab={activeTab}
            onSelectTab={setActiveTab}
          />
        }
        filterContent={
          <PaymentFilterContent
            stageFilter={stageFilter}
            setStageFilter={setStageFilter}
            methodFilter={methodFilter}
            setMethodFilter={setMethodFilter}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            onResetFilters={handleResetFilters}
          />
        }
        searchPlaceholder="Search payments by invoice ID, order #, customer, or route..."
        compact={true}
        isLoading={isLoading || isRefreshing}
        onRowClick={(row) => setSelectedPayment(row)}
        tableClassName="w-full"
        emptyState={
          <EmptyState
            icon={Receipt}
            title="No Payment Records Found"
            description={
              activeTab === 'all'
                ? 'All your customer payments, Pay Later terms, and escrow clearances will be listed here.'
                : `No payments match the '${activeTab.replace('_', ' ')}' filter.`
            }
            actionLabel="View Invoices"
            onAction={() => navigate('/supplier/finance/invoices')}
          />
        }
      />

      {/* Detailed Payment Modal */}
      {selectedPayment && (
        <PaymentDetailsModal
          payment={selectedPayment}
          onClose={() => setSelectedPayment(null)}
          onDownload={handleDownload}
        />
      )}
    </div>
  );
}
