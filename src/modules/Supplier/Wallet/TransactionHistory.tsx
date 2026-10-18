import React, { useMemo } from 'react';
import PageHeader from '@/components/common/page-header';
import DataTable from '@/components/tables/data-table';
import EmptyState from '@/components/tables/empty-state';
import Button from '@/components/ui/button';
import { AlertCircle, Receipt, RefreshCw } from 'lucide-react';
import { useTransactionHistoryState } from './hooks/useTransactionHistoryState';
import { getTransactionColumns } from './components/transactionColumns';
import { TransactionHeaderTabs, TransactionFilterBar } from './components/TransactionFilters';

export { type TransactionRow } from './types/transaction.types';

export default function TransactionHistory() {
    const {
        isLoading,
        isRefreshing,
        error,
        activeTab,
        setActiveTab,
        typeFilter,
        setTypeFilter,
        statusFilter,
        setStatusFilter,
        fromDate,
        setFromDate,
        toDate,
        setToDate,
        copiedRef,
        tabs,
        filteredTransactions,
        handleRefresh,
        handleResetFilters,
        handleCopy,
    } = useTransactionHistoryState();

    const columns = useMemo(() => getTransactionColumns({ copiedRef, handleCopy }), [copiedRef, handleCopy]);

    return (
        <div className="p-3 sm:p-4 md:p-6 w-full mx-auto space-y-4 sm:space-y-5 min-h-screen font-sans antialiased bg-[#f8fafc] dark:bg-[#12161c]">
            {/* Page Header */}
            <PageHeader
                title="Transaction History"
                description="Complete ledger of customer payments, Stripe payouts, platform fees, and refunds."
                className="mb-0"
                actions={
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRefresh}
                        disabled={isRefreshing}
                        className="h-8 px-2.5 sm:px-3 text-xs font-semibold flex items-center gap-1.5 cursor-pointer bg-white dark:bg-[#1e2329] border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-[4px]"
                    >
                        <RefreshCw size={12} className={isRefreshing ? 'animate-spin text-[#ff4a1f]' : 'text-slate-500'} />
                        <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
                    </Button>
                }
            />

            {error && (
                <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-red-600 text-sm flex items-center gap-3">
                    <AlertCircle size={18} className="shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            {/* Standard Project DataTable Component */}
            <DataTable
                columns={columns}
                data={filteredTransactions}
                compact={true}
                hideCheckbox={true}
                hideViewToggle={true}
                searchPlaceholder="Search transactions by reference, type, description..."
                isLoading={isLoading || isRefreshing}
                keyExtractor={(item) => item.id}
                headerTabs={
                    <TransactionHeaderTabs
                        tabs={tabs}
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                    />
                }
                filterContent={
                    <TransactionFilterBar
                        typeFilter={typeFilter}
                        setTypeFilter={setTypeFilter}
                        statusFilter={statusFilter}
                        setStatusFilter={setStatusFilter}
                        fromDate={fromDate}
                        setFromDate={setFromDate}
                        toDate={toDate}
                        setToDate={setToDate}
                        onReset={handleResetFilters}
                    />
                }
                emptyState={
                    <EmptyState
                        icon={Receipt}
                        title={
                            fromDate || toDate ? 'No Transactions in Selected Date Range' :
                                activeTab !== 'all' ? `No ${tabs.find((t) => t.id === activeTab)?.label || ''} Found` :
                                    'No Transactions Found'
                        }
                        description="Try adjusting your filter options or tab selection."
                    />
                }
            />
        </div>
    );
}
