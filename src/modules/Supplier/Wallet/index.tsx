import React, { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    AlertCircle,
    ArrowUpRight,
    ChevronRight,
    Receipt,
    RefreshCw,
} from 'lucide-react';
import DataTable from '@/components/tables/data-table';
import EmptyState from '@/components/tables/empty-state';
import Button from '@/components/ui/button';
import PageHeader from '@/components/common/page-header';
import ConnectedAccountCard from './components/ConnectedAccountCard';
import WalletStatCards from './components/WalletStatCards';
import { WithdrawalGuidelinesCard } from './components/WithdrawalGuidelinesCard';
import { getTransactionColumns } from './components/transactionColumns';
import { TransactionHeaderTabs, TransactionFilterBar } from './components/TransactionFilters';
import { useSupplierWalletState } from './hooks/useSupplierWalletState';

export { type TransactionRow as WalletTransactionItem } from './types/transaction.types';

export default function SupplierWallet() {
    const navigate = useNavigate();
    const {
        data,
        isLoading,
        isRefreshing,
        error,
        activeTab,
        setActiveTab,
        typeFilter,
        setTypeFilter,
        statusFilter,
        setStatusFilter,
        startDate,
        setStartDate,
        endDate,
        setEndDate,
        copiedRef,
        availableBalanceNum,
        connectedAccount,
        tabs,
        filteredTransactions,
        handleCopy,
        handleResetFilters,
        fetchWalletData,
    } = useSupplierWalletState();

    const columns = useMemo(() => getTransactionColumns({ copiedRef, handleCopy }), [copiedRef, handleCopy]);

    return (
        <div className="p-3 sm:p-4 md:p-6 w-full mx-auto space-y-4 sm:space-y-5 min-h-screen font-sans antialiased bg-[#f8fafc] dark:bg-[#12161c]">
            {/* Page Header */}
            <PageHeader
                title="Supplier Wallet"
                description="Manage your earnings, view transactions and connected account details."
                className="mb-0"
                actions={
                    <div className="flex items-center gap-2 shrink-0">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => fetchWalletData(true)}
                            disabled={isRefreshing}
                            className="h-8 px-3 text-xs font-semibold flex items-center gap-1.5 cursor-pointer bg-white dark:bg-[#1e2329] border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-[4px]"
                        >
                            <RefreshCw size={12} className={isRefreshing ? 'animate-spin text-[#ff4a1f]' : 'text-slate-400'} />
                            <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
                        </Button>
                        <Button
                            size="sm"
                            onClick={() => navigate('/supplier/wallet/withdraw')}
                            className="h-8 px-3 rounded-[4px] text-xs font-bold text-white bg-[#ea580c] hover:bg-[#c2410c] transition shadow-2xs flex items-center gap-1.5 cursor-pointer"
                        >
                            <ArrowUpRight size={13} />
                            <span>Withdraw Funds</span>
                        </Button>
                        <Link
                            to="/supplier/wallet/connected-account"
                            className="inline-flex items-center gap-1.5 h-8 px-3 rounded-[4px] text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition shadow-2xs"
                        >
                            <span>Stripe Account</span>
                            <ChevronRight size={14} />
                        </Link>
                    </div>
                }
            />

            {error && (
                <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-red-600 text-sm flex items-center gap-3">
                    <AlertCircle size={18} className="shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            {/* Standard Project MetricCards */}
            <WalletStatCards stats={data?.stats} isLoading={isLoading} />

            {/* Middle Section: Connected Account (left) + Guidelines (right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 sm:gap-4 md:gap-5">
                <div className="lg:col-span-7 flex flex-col">
                    <ConnectedAccountCard account={connectedAccount} onRefresh={() => fetchWalletData(true)} />
                </div>
                <WithdrawalGuidelinesCard availableBalanceNum={availableBalanceNum} />
            </div>

            {/* Recent Transactions Section */}
            <div className="space-y-3 pt-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
                            <span>Recent Transactions</span>
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                            Latest payouts, earnings, and platform commission settlements.
                        </p>
                    </div>
                    <Link
                        to="/supplier/wallet/transactions"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition shadow-2xs shrink-0 self-start sm:self-auto cursor-pointer"
                    >
                        <span>View All Transactions</span>
                    </Link>
                </div>

                <DataTable
                    columns={columns}
                    data={filteredTransactions.slice(0, 5)}
                    compact={true}
                    hideCheckbox={true}
                    hideViewToggle={true}
                    hidePagination={true}
                    syncUrlParams={false}
                    searchPlaceholder="Search recent transactions by reference, type, description..."
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
                            fromDate={startDate}
                            setFromDate={setStartDate}
                            toDate={endDate}
                            setToDate={setEndDate}
                            onReset={handleResetFilters}
                        />
                    }
                    emptyState={
                        <EmptyState
                            icon={Receipt}
                            title={
                                startDate || endDate ? 'No Transactions in Selected Date Range' :
                                    activeTab !== 'all' ? `No ${tabs.find((t) => t.id === activeTab)?.label || ''} Transactions Found` :
                                        'No Transactions Recorded'
                            }
                            description={
                                startDate || endDate
                                    ? `No transactions recorded between ${startDate || 'the start'} and ${endDate || 'the end'}.`
                                    : 'Completed order earnings and automatic payouts will appear here.'
                            }
                        />
                    }
                />
            </div>
        </div>
    );
}
