import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    RefreshCw, Download, FileText, CheckCircle2, AlertCircle,
    Receipt, Wallet, Euro, ArrowUpRight
} from 'lucide-react';
import Button from '@/components/ui/button';
import Badge from '@/components/ui/badge';
import DataTable from '@/components/tables/data-table';
import EmptyState from '@/components/tables/empty-state';
import MetricCard from '@/components/cards/metric-card';

import { useSupplierBilling } from './hooks/useSupplierBilling';
import { useFilteredSupplierBilling } from './hooks/useFilteredSupplierBilling';
import { getBillingColumns } from './components/columns';
import { BillingRowActions } from './components/BillingRowActions';
import { BillingFilterTabs } from './components/BillingFilterTabs';
import { TableFilterContent } from './components/TableFilterContent';
import { BillingMetricCards } from './components/BillingMetricCards';
import { SupplierBillingItem, BillingFilterTab } from './types';
import { useExportModalStore } from '@/stores/useExportModalStore';


export default function SupplierBilling() {
    const navigate = useNavigate();

    // Data Hooks
    const {
        invoices,
        stats,
        calculatedStats,
        isLoading,
        isRefreshing,
        fetchBillingData,
    } = useSupplierBilling();

    // Local Filter States
    const [activeTab, setActiveTab] = useState<BillingFilterTab>('all');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [paymentMethodFilter, setPaymentMethodFilter] = useState<string>('all');
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');

    // Filter Logic Hook
    const filteredInvoices = useFilteredSupplierBilling({
        invoices,
        activeTab,
        statusFilter,
        paymentMethodFilter,
        startDate,
        endDate,
    });

    const handleResetFilters = () => {
        setActiveTab('all');
        setStatusFilter('all');
        setPaymentMethodFilter('all');
        setStartDate('');
        setEndDate('');
    };

    const handleViewInvoice = (row: SupplierBillingItem) => {
        navigate(`/supplier/finance/invoices`);
    };

    // CSV Export Handler
    const handleExportCSV = () => {
        useExportModalStore.getState().openExportModal({ reportName: 'Freight Billing Statements' });
    };


    // Columns
    const columns = useMemo(() => getBillingColumns(handleViewInvoice), []);

    return (
        <div className="p-3 sm:p-4 md:p-6 w-full mx-auto space-y-4 sm:space-y-5 min-h-screen font-sans antialiased bg-[#f8fafc] dark:bg-[#12161c]">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                        Freight Invoices & Billing
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                        Manage freight transport invoices, customer settlements, receipts, and revenue records.
                    </p>
                </div>

                <div className="flex items-center gap-2 shrink-0 flex-wrap">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fetchBillingData(true)}
                        disabled={isRefreshing || isLoading}
                        className="h-8 px-2.5 sm:px-3 text-xs font-semibold flex items-center gap-1.5 cursor-pointer bg-white dark:bg-[#1e2329] border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
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
                        variant="outline"
                        size="sm"
                        onClick={() => navigate('/supplier/finance/invoices')}
                        className="h-8 px-3 text-xs font-semibold flex items-center gap-1.5 cursor-pointer bg-white dark:bg-[#1e2329] text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 border-slate-300 dark:border-slate-700"
                    >
                        <FileText size={13} className="text-slate-500" />
                        <span>All Invoices</span>
                    </Button>

                    <Button
                        variant="primary"
                        size="sm"
                        onClick={() => navigate('/supplier/finance/earnings')}
                        className="h-8 px-3.5 bg-[#ff4a1f] hover:bg-[#e03e15] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                        <Wallet size={14} />
                        <span>Earnings Ledger</span>
                    </Button>
                </div>
            </div>

            {/* Metrics Row */}
            <BillingMetricCards calculatedStats={calculatedStats} isLoading={isLoading} />

            {/* Invoices Table */}
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        <Receipt size={16} className="text-[#ff4a1f]" /> Recent Freight Invoices
                    </h2>
                </div>

                <DataTable
                    data={filteredInvoices}
                    columns={columns}
                    actions={(row: SupplierBillingItem) => (
                        <BillingRowActions
                            row={row}
                            onViewDetails={handleViewInvoice}
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
                    searchPlaceholder="Search invoices by ID, order, customer name, or amount..."
                    compact={true}
                    isLoading={isLoading || isRefreshing}
                    onRowClick={(row) => handleViewInvoice(row)}
                    tableClassName="w-full"
                    emptyState={
                        <EmptyState
                            icon={Receipt}
                            title="No Freight Invoices Found"
                            description={
                                activeTab === 'all'
                                    ? "There are no shipping invoices or billing records associated with your account yet."
                                    : `No invoices matching '${activeTab}'.`
                            }
                        />
                    }
                />
            </div>
        </div>
    );
}
