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
import { SupplierBillingItem, BillingFilterTab } from './types';

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
        if (!filteredInvoices || filteredInvoices.length === 0) return;

        const headers = [
            'Invoice #',
            'Order #',
            'Customer',
            'Route',
            'Gross Amount (€)',
            'Net Payable (€)',
            'Status',
            'Payment Method',
            'Issue Date',
            'Due Date',
        ];

        const csvRows = filteredInvoices.map((inv) => {
            const rawAmt = Number(inv.net_amount ?? inv.supplier_amount ?? inv.total_amount ?? 0);
            const grossAmt = Number(inv.gross_amount ?? inv.total_amount ?? 0);
            return [
                inv.invoice_number || `INV-${inv.id}`,
                inv.order_number || inv.orderId || 'N/A',
                `"${inv.customer_name || inv.customer_company || 'Direct Customer'}"`,
                `"${(inv.pickup_name || 'Origin') + ' ➔ ' + (inv.delivery_name || 'Destination')}"`,
                grossAmt.toFixed(2),
                rawAmt.toFixed(2),
                inv.status || inv.raw_status || 'Paid',
                `"${inv.payment_method_label || inv.payment_method || 'Direct Payment'}"`,
                inv.issue_date || inv.created_at || '—',
                inv.due_date || '30 Days Net',
            ].join(',');
        });

        const csvContent = [headers.join(','), ...csvRows].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `Supplier_Freight_Billing_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
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
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
                <MetricCard
                    title="Total Revenue & Settled"
                    description={`${calculatedStats.paidCount} cleared freight invoices`}
                    value={calculatedStats.totalRevenueFormatted}
                    icon={CheckCircle2}
                    colorClass="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400"
                    badge={<Badge variant="secondary" className="bg-emerald-50 text-emerald-700 text-[10px] font-semibold border border-emerald-200">Cleared</Badge>}
                    valueClassName="text-base sm:text-lg"
                    className="p-2.5 sm:p-3"
                    isLoading={isLoading}
                />
                <MetricCard
                    title="In Escrow & Pending"
                    description={`${calculatedStats.dueCount} invoices in progress / due`}
                    value={calculatedStats.totalOutstandingFormatted}
                    icon={AlertCircle}
                    colorClass="bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400"
                    badge={<Badge variant="secondary" className="bg-amber-50 text-amber-700 text-[10px] font-semibold border border-amber-200">Escrow</Badge>}
                    valueClassName="text-base sm:text-lg"
                    className="p-2.5 sm:p-3"
                    isLoading={isLoading}
                />
                <MetricCard
                    title="Total Freight Invoices"
                    description="All shipping billing & settlement records"
                    value={calculatedStats.totalInvoices}
                    icon={Receipt}
                    colorClass="bg-orange-50 dark:bg-[#ff4a1f]/15 text-[#ff4a1f]"
                    badge={<Badge variant="secondary" className="bg-slate-100 text-slate-700 text-[10px] font-semibold border border-slate-200">Total</Badge>}
                    valueClassName="text-base sm:text-lg"
                    className="p-2.5 sm:p-3"
                    isLoading={isLoading}
                />
            </div>

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
