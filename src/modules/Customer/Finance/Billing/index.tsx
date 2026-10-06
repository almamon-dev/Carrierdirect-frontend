import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Receipt, 
    RefreshCw, 
    CheckCircle2, 
    AlertCircle, 
    Download, 
    CreditCard, 
    Wallet,
    FileText
} from 'lucide-react';
import Button from '@/components/ui/button';
import Badge from '@/components/ui/badge';
import DataTable from '@/components/tables/data-table';
import MetricCard from '@/components/cards/metric-card';
import EmptyState from '@/components/tables/empty-state';
import RatingModal from '@/components/modals/rating-modal';
import apiClient from '@/lib/axios';
import { encryptId } from '@/lib/encryption';
import { exportInvoicePdf } from '@/utils/exportInvoicePdf';

import { useCustomerBilling } from './hooks/useCustomerBilling';
import { useFilteredCustomerBilling } from './hooks/useFilteredCustomerBilling';
import { BillingFilterTabs } from './components/BillingFilterTabs';
import { TableFilterContent } from './components/TableFilterContent';
import { getBillingColumns } from './components/columns';
import { BillingRowActions } from './components/BillingRowActions';
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
        if (!filteredInvoices || filteredInvoices.length === 0) return;
        const headers = ['Amount', 'Status', 'Payment Method', 'Description', 'Customer', 'Date'];
        const csvRows = [
            headers.join(','),
            ...filteredInvoices.map((inv: any) => [
                `"${inv.amount || inv.gross_amount_formatted || inv.total_amount_formatted || ''}"`,
                `"${inv.status || 'Paid'}"`,
                `"${inv.payment_method_label || inv.payment_terms || 'Card'}"`,
                `"${inv.description || `CarrierDirect Escrow: Order #${inv.order_number || inv.id}`}"`,
                `"${inv.customer_email || 'customer@carrierdirect.com'}"`,
                `"${inv.created_at_time || inv.date || inv.issue_date || ''}"`,
            ].join(','))
        ];
        const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `CarrierDirect_Billing_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const columns = useMemo(() => getBillingColumns(handleViewInvoice), []);

    return (
        <div className="p-4 md:p-6 w-full mx-auto min-h-screen font-sans antialiased bg-[#f8fafc] dark:bg-[#12161c] space-y-3.5">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight mb-1">
                        Billing Overview
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        Overview of your freight orders, cargo billing, payments, and outstanding invoices.
                    </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fetchBillingData(true)}
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
                        variant="outline"
                        size="sm"
                        onClick={() => navigate('/customer/finance/invoices')}
                        className="h-8 px-3 text-xs font-semibold flex items-center gap-1.5 cursor-pointer bg-white dark:bg-[#1e2329] text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 border-slate-300 dark:border-slate-700"
                    >
                        <FileText size={13} className="text-slate-500" />
                        <span>All Invoices</span>
                    </Button>

                    <Button
                        variant="primary"
                        size="sm"
                        onClick={() => navigate('/customer/finance/pay-later')}
                        className="h-8 px-3.5 bg-[#ff4a1f] hover:bg-[#e03e15] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                        <Wallet size={14} />
                        <span>Pay Later Facility</span>
                    </Button>
                </div>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
                <MetricCard
                    title="Total Spent & Paid"
                    description={`${calculatedStats.paidCount} fully paid invoices`}
                    value={calculatedStats.totalSpentFormatted}
                    icon={CheckCircle2}
                    colorClass="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400"
                    badge={<Badge variant="secondary" className="bg-emerald-50 text-emerald-700 text-[10px] font-semibold border border-emerald-200">Paid</Badge>}
                    valueClassName="text-base sm:text-lg"
                    className="p-2.5 sm:p-3"
                    isLoading={isLoading}
                />
                <MetricCard
                    title="Outstanding & Due"
                    description={`${calculatedStats.dueCount} due awaiting payment`}
                    value={calculatedStats.totalOutstandingFormatted}
                    icon={AlertCircle}
                    colorClass="bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400"
                    badge={<Badge variant="secondary" className="bg-rose-50 text-rose-700 text-[10px] font-semibold border border-rose-200">Due</Badge>}
                    valueClassName="text-base sm:text-lg"
                    className="p-2.5 sm:p-3"
                    isLoading={isLoading}
                />
                <MetricCard
                    title="Total Invoices"
                    description="All freight billing & invoice records"
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

            {/* Rating Modal */}
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
