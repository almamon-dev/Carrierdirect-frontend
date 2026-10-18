import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Receipt, 
  Download, 
  RefreshCw,
  CreditCard
} from 'lucide-react';
import DataTable from '@/components/tables/data-table';
import Button from '@/components/ui/button';
import EmptyState from '@/components/tables/empty-state';
import InvoiceView from './View';
import { InvoiceRowActions } from './components/InvoiceRowActions';
import { InvoiceFilterTabs } from './components/InvoiceFilterTabs';
import { InvoiceFilterContent } from './components/InvoiceFilterContent';
import { getInvoiceColumns } from './components/columns';
import { useExportModalStore } from '@/stores/useExportModalStore';
import { useSupplierInvoicesState } from './hooks/useSupplierInvoicesState';

export default function SupplierInvoices() {
  const navigate = useNavigate();
  const {
    invoices,
    selectedInvoice,
    setSelectedInvoice,
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
    filteredInvoices,
    fetchInvoices,
    handleDownload,
    handleResetFilters,
  } = useSupplierInvoicesState();

  const handleExportCSV = () => {
    useExportModalStore.getState().openExportModal({ reportName: 'Carrier Invoices & Settlements' });
  };

  const columns = useMemo(() => getInvoiceColumns((inv) => setSelectedInvoice(inv)), [setSelectedInvoice]);

  if (selectedInvoice) {
    return (
      <InvoiceView
        invoice={selectedInvoice}
        onBack={() => setSelectedInvoice(null)}
        onDownload={handleDownload}
      />
    );
  }

  return (
    <div className="p-4 md:p-6 w-full mx-auto min-h-screen font-sans antialiased bg-[#f8fafc] dark:bg-[#12161c] space-y-3.5">
      {/* Header with Title, Refresh, Export, and Action buttons */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight mb-1">
            Supplier Invoices & Settlements
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Track customer invoice settlements, escrow clearing status, and official PDF documents.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchInvoices(true)}
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
            onClick={() => navigate('/supplier/finance/payments')}
            className="h-8 px-3.5 bg-[#ff4a1f] hover:bg-[#e03e15] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <CreditCard size={14} />
            <span>View Payments</span>
          </Button>
        </div>
      </div>

      {/* Main DataTable Grid */}
      <DataTable
        data={filteredInvoices}
        columns={columns}
        actions={(row: any) => (
          <InvoiceRowActions
            row={row}
            onView={(r) => setSelectedInvoice(r)}
            onDownload={(r) => handleDownload(r)}
          />
        )}
        actionsColumnClassName="w-[50px] min-w-[45px] text-right pr-2"
        headerTabs={
          <InvoiceFilterTabs
            invoices={invoices}
            activeTab={activeTab}
            onSelectTab={setActiveTab}
          />
        }
        filterContent={
          <InvoiceFilterContent
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
        searchPlaceholder="Search by invoice ID, order #, client, or route..."
        compact={true}
        isLoading={isLoading || isRefreshing}
        onRowClick={(row) => setSelectedInvoice(row)}
        tableClassName="w-full"
        emptyState={
          <EmptyState
            icon={Receipt}
            title="No Invoices Found"
            description={
              activeTab === 'all'
                ? 'There are no generated invoices for your account yet.'
                : `No invoices match the '${activeTab.replace('_', ' ')}' filter.`
            }
            actionLabel="View Payments Ledger"
            onAction={() => navigate('/supplier/finance/payments')}
          />
        }
      />
    </div>
  );
}
