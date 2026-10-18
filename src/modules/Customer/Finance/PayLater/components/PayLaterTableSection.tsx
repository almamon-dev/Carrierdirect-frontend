import React from 'react';
import { Wallet } from 'lucide-react';
import DataTable from '@/components/tables/data-table';
import EmptyState from '@/components/tables/empty-state';
import { PayLaterFilterTabs } from './PayLaterFilterTabs';
import { PayLaterRowActions } from './PayLaterRowActions';
import { TableFilterContent } from './TableFilterContent';
import { CustomerPayLaterItem, PayLaterFilterTab, PayLaterStats } from '../types';

interface PayLaterTableSectionProps {
  filteredInvoices: CustomerPayLaterItem[];
  columns: any[];
  invoices: CustomerPayLaterItem[];
  stats?: {
    total_invoices?: number;
    invoices_paid?: number;
    invoices_due?: number;
    invoices_overdue?: number;
  } | null | any;
  activeTab: PayLaterFilterTab;
  setActiveTab: (tab: PayLaterFilterTab) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  startDate: string;
  setStartDate: (date: string) => void;
  endDate: string;
  setEndDate: (date: string) => void;
  handleResetFilters: () => void;
  handleViewInvoice: (inv: CustomerPayLaterItem) => void;
  handleOpenPayModal: (inv: CustomerPayLaterItem) => void;
  isLoading: boolean;
  isRefreshing: boolean;
}

export const PayLaterTableSection: React.FC<PayLaterTableSectionProps> = ({
  filteredInvoices,
  columns,
  invoices,
  stats,
  activeTab,
  setActiveTab,
  statusFilter,
  setStatusFilter,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  handleResetFilters,
  handleViewInvoice,
  handleOpenPayModal,
  isLoading,
  isRefreshing,
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Wallet size={16} className="text-[#ff4a1f]" /> Pay Later Orders & Settlements
        </h2>
      </div>

      <DataTable
        data={filteredInvoices}
        columns={columns}
        actions={(row: CustomerPayLaterItem) => (
          <PayLaterRowActions
            row={row}
            onViewDetails={handleViewInvoice}
            onPayInvoice={handleOpenPayModal}
          />
        )}
        actionsColumnClassName="w-[105px] min-w-[105px] text-right pr-3.5"
        headerTabs={
          <PayLaterFilterTabs
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
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            onResetFilters={handleResetFilters}
          />
        }
        searchPlaceholder="Search settlements by ID, order, customer email, or amount..."
        compact={true}
        isLoading={isLoading || isRefreshing}
        onRowClick={(row) => handleViewInvoice(row)}
        tableClassName="w-full"
        emptyState={
          <EmptyState
            icon={Wallet}
            title="No Pay Later Records Found"
            description={
              activeTab === 'all'
                ? 'There are no deferred freight invoices or Pay Later settlements on your account.'
                : `No settlements matching '${activeTab}'.`
            }
          />
        }
      />
    </div>
  );
};

export default PayLaterTableSection;
