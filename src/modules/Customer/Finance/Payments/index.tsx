import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    CreditCard, 
    RefreshCw, 
    CheckCircle2, 
    Wallet, 
    Receipt, 
    Download, 
    FileText,
    ExternalLink
} from 'lucide-react';
import Button from '@/components/ui/button';
import Badge from '@/components/ui/badge';
import DataTable from '@/components/tables/data-table';
import MetricCard from '@/components/cards/metric-card';
import EmptyState from '@/components/tables/empty-state';
import { encryptId } from '@/lib/encryption';
import { exportInvoicePdf } from '@/utils/exportInvoicePdf';

import { useCustomerPayments } from './hooks/useCustomerPayments';
import { useFilteredCustomerPayments } from './hooks/useFilteredCustomerPayments';
import { PaymentFilterTabs } from './components/PaymentFilterTabs';
import { TableFilterContent } from './components/TableFilterContent';
import { getPaymentColumns } from './components/columns';
import { PaymentRowActions } from './components/PaymentRowActions';
import { CustomerPaymentItem, PaymentFilterTab } from './types';

export default function CustomerPaymentsPage() {
    const navigate = useNavigate();
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
        if (!filteredPayments || filteredPayments.length === 0) return;
        const headers = ['Amount', 'Status', 'Payment Method', 'Description', 'Customer', 'Date'];
        const csvRows = [
            headers.join(','),
            ...filteredPayments.map((p: any) => [
                `"${p.amount || p.gross_amount_formatted || p.total_amount_formatted || ''}"`,
                `"${p.status || 'Succeeded'}"`,
                `"${p.payment_method_label || p.method || 'Card'}"`,
                `"${p.description || `CarrierDirect Escrow: Order #${p.order_number || p.id}`}"`,
                `"${p.customer_email || 'customer@carrierdirect.com'}"`,
                `"${p.created_at_time || p.date || p.paid_at || ''}"`,
            ].join(','))
        ];
        const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `CarrierDirect_Payments_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const columns = useMemo(() => getPaymentColumns(setSelectedPayment), [setSelectedPayment]);

    return (
        <div className="p-4 md:p-6 w-full mx-auto min-h-screen font-sans antialiased bg-[#f8fafc] dark:bg-[#12161c] space-y-3.5">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight mb-1">
                        Payment History
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        Review detailed transactions, download receipts, and manage freight settlements.
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
                        variant="outline"
                        size="sm"
                        onClick={() => navigate('/customer/finance/invoices')}
                        className="h-8 px-3 text-xs font-semibold flex items-center gap-1.5 cursor-pointer bg-white dark:bg-[#1e2329] text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 border-slate-300 dark:border-slate-700"
                    >
                        <FileText size={13} className="text-slate-500" />
                        <span>View Invoices</span>
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
                    title="Total Paid"
                    description="Total funds paid out across all shipments"
                    value={calculatedStats.totalSettledFormatted}
                    icon={CheckCircle2}
                    colorClass="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400"
                    badge={<Badge variant="secondary" className="bg-emerald-50 text-emerald-700 text-[10px] font-semibold border border-emerald-200">Paid</Badge>}
                    valueClassName="text-base sm:text-lg"
                    className="p-2.5 sm:p-3"
                    isLoading={isLoading}
                />
                <MetricCard
                    title="Pay Later Settlements"
                    description="Transactions deferred via Net-30 credit"
                    value={calculatedStats.payLaterTotalFormatted}
                    icon={Wallet}
                    colorClass="bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400"
                    badge={<Badge variant="secondary" className="bg-purple-50 text-purple-700 text-[10px] font-semibold border border-purple-200">Net-30</Badge>}
                    valueClassName="text-base sm:text-lg"
                    className="p-2.5 sm:p-3"
                    isLoading={isLoading}
                />
                <MetricCard
                    title="Total Transactions"
                    description="All booking payments and settlements history"
                    value={calculatedStats.totalTransactions}
                    icon={Receipt}
                    colorClass="bg-orange-50 dark:bg-[#ff4a1f]/15 text-[#ff4a1f]"
                    badge={<Badge variant="secondary" className="bg-slate-100 text-slate-700 text-[10px] font-semibold border border-slate-200">Total</Badge>}
                    valueClassName="text-base sm:text-lg"
                    className="p-2.5 sm:p-3"
                    isLoading={isLoading}
                />
            </div>

            {/* Main DataTable */}
            <DataTable
                data={filteredPayments}
                columns={columns}
                actions={(row: CustomerPaymentItem) => (
                    <PaymentRowActions
                        row={row}
                        onViewReceipt={setSelectedPayment}
                    />
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
                searchPlaceholder="Search by Transaction ID, Invoice No, or Carrier..."
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
                                ? "Your completed order payments and transaction receipts will be logged here."
                                : `No payment records matching '${activeTab.replace('_', ' ')}'.`
                        }
                    />
                }
            />

            {/* Transaction Details Modal */}
            {selectedPayment && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
                    <div className="bg-white dark:bg-[#1a1f26] border border-slate-200 dark:border-slate-700 rounded-lg max-w-md w-full overflow-hidden shadow-2xl space-y-4">
                        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-800/40">
                            <div className="flex items-center gap-2">
                                <Receipt size={16} className="text-[#ff4a1f]" />
                                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Transaction Details</h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setSelectedPayment(null)}
                                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded cursor-pointer"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="px-5 py-2 space-y-3 text-xs">
                            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded border border-slate-200/70 dark:border-slate-700/60 space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-slate-500 dark:text-slate-400">Transaction ID:</span>
                                    <span className="font-mono font-bold text-slate-900 dark:text-slate-100">{selectedPayment.transaction_id || `TXN-${selectedPayment.id}`}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500 dark:text-slate-400">Invoice Number:</span>
                                    <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedPayment.invoice_number || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500 dark:text-slate-400">Order Reference:</span>
                                    <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedPayment.order_number || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500 dark:text-slate-400">Carrier / Supplier:</span>
                                    <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedPayment.supplier_name || 'Carrier Direct'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500 dark:text-slate-400">Payment Method:</span>
                                    <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedPayment.method || 'Credit Card (Stripe)'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500 dark:text-slate-400">Payment Date:</span>
                                    <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedPayment.created_at_formatted || selectedPayment.date}</span>
                                </div>
                                <div className="flex justify-between border-t border-slate-200 dark:border-slate-700 pt-2">
                                    <span className="font-bold text-slate-700 dark:text-slate-300">Total Amount:</span>
                                    <span className="font-extrabold text-[#ff4a1f] text-sm">{selectedPayment.gross_amount_formatted || selectedPayment.total_amount_formatted || selectedPayment.amount}</span>
                                </div>
                            </div>
                        </div>

                        <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/40 flex items-center justify-end gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedPayment(null)}
                                className="h-8 text-xs font-semibold cursor-pointer"
                            >
                                Close
                            </Button>
                            <Button
                                variant="primary"
                                size="sm"
                                onClick={() => {
                                    exportInvoicePdf(selectedPayment);
                                }}
                                className="h-8 text-xs font-semibold bg-[#ff4a1f] hover:bg-[#e03d15] text-white cursor-pointer flex items-center gap-1.5 shadow-2xs"
                            >
                                <Download size={13} />
                                <span>Download Receipt</span>
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
