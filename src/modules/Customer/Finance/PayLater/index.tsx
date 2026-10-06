import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { 
    Wallet, 
    RefreshCw, 
    CheckCircle2, 
    AlertCircle, 
    Download, 
    CreditCard, 
    FileText,
    TrendingUp,
    ShieldCheck,
    Clock,
    X,
    Check,
    Loader2
} from 'lucide-react';
import Button from '@/components/ui/button';
import Badge from '@/components/ui/badge';
import DataTable from '@/components/tables/data-table';
import MetricCard from '@/components/cards/metric-card';
import EmptyState from '@/components/tables/empty-state';
import apiClient from '@/lib/axios';


import { useCustomerPayLater } from './hooks/useCustomerPayLater';
import { useFilteredCustomerPayLater } from './hooks/useFilteredCustomerPayLater';
import { PayLaterFilterTabs } from './components/PayLaterFilterTabs';
import { TableFilterContent } from './components/TableFilterContent';
import { getPayLaterColumns } from './components/columns';
import { PayLaterRowActions } from './components/PayLaterRowActions';
import { CustomerPayLaterItem, PayLaterFilterTab } from './types';

export default function CustomerPayLaterPage() {
    const navigate = useNavigate();
    const {
        invoices,
        stats,
        calculatedStats,
        userProfile,
        isLoading,
        isRefreshing,
        fetchPayLaterData,
    } = useCustomerPayLater();

    const [activeTab, setActiveTab] = useState<PayLaterFilterTab>('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    // Modal States
    const [isIncreaseModalOpen, setIsIncreaseModalOpen] = useState(false);
    const [increaseTarget, setIncreaseTarget] = useState<'Total Limit' | 'Monthly Limit' | 'Weekly Limit' | 'Daily Limit'>('Total Limit');
    const [newRequestedLimit, setNewRequestedLimit] = useState('');
    const [increaseReason, setIncreaseReason] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Pay Modal
    const [selectedInvoice, setSelectedInvoice] = useState<CustomerPayLaterItem | null>(null);
    const [isPayModalOpen, setIsPayModalOpen] = useState(false);

    const handleResetFilters = () => {
        setStatusFilter('all');
        setStartDate('');
        setEndDate('');
    };

    const filteredInvoices = useFilteredCustomerPayLater({
        invoices,
        activeTab,
        statusFilter,
        startDate,
        endDate,
    });

    const handleViewInvoice = (inv: CustomerPayLaterItem) => {
        navigate('/customer/finance/invoices');
    };

    const handleOpenPayModal = (inv: CustomerPayLaterItem) => {
        setSelectedInvoice(inv);
        setIsPayModalOpen(true);
    };

    const confirmInvoicePayment = async () => {
        if (!selectedInvoice) return;
        setIsSubmitting(true);
        try {
            await apiClient.post(`/customer/invoices/${selectedInvoice.id}/pay-later`);
            // notifySuccess('Invoice successfully settled using Pay Later facility.');
            setIsPayModalOpen(false);
            setSelectedInvoice(null);
            fetchPayLaterData();
        } catch (err: any) {
            console.error(err);
            // notifyError(err?.response?.data?.message || err?.message || 'Failed to settle invoice with Pay Later.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSubmitIncrease = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newRequestedLimit || parseFloat(newRequestedLimit) <= 0) {
            // notifyError('Please enter a valid requested limit amount.');
            return;
        }

        setIsSubmitting(true);
        try {
            let limitTypeKey = 'max';
            if (increaseTarget === 'Monthly Limit') limitTypeKey = 'monthly';
            else if (increaseTarget === 'Weekly Limit') limitTypeKey = 'weekly';
            else if (increaseTarget === 'Daily Limit') limitTypeKey = 'daily';

            await apiClient.post('/customer/pay-later/request', {
                requested_limit: parseFloat(newRequestedLimit),
                limit_type: limitTypeKey,
                reason: increaseReason,
            });

            // notifySuccess('Credit limit request submitted successfully. Awaiting review.');
            setIsIncreaseModalOpen(false);
            setNewRequestedLimit('');
            setIncreaseReason('');
            fetchPayLaterData();
        } catch (err: any) {
            console.error(err);
            // notifyError(err?.response?.data?.message || err?.message || 'Failed to submit credit request.');
        } finally {
            setIsSubmitting(false);
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
                `"${inv.payment_method_label || 'Net-30 Pay Later'}"`,
                `"${inv.description || `CarrierDirect Escrow: Order #${inv.order_number || inv.id}`}"`,
                `"${inv.customer_email || 'customer@carrierdirect.com'}"`,
                `"${inv.created_at_time || inv.date || inv.issue_date || ''}"`,
            ].join(','))
        ];
        const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `CarrierDirect_PayLater_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const columns = useMemo(() => getPayLaterColumns(handleViewInvoice), []);

    return (
        <div className="p-4 md:p-6 w-full mx-auto min-h-screen font-sans antialiased bg-[#f8fafc] dark:bg-[#12161c] space-y-3.5">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight mb-1">
                        Corporate Pay Later Facility
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        Flexible Net-{calculatedStats.payLaterDays} corporate credit for freight orders, consolidated monthly billing, and auto-settlements.
                    </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fetchPayLaterData(true)}
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
                        onClick={() => setIsIncreaseModalOpen(true)}
                        className="h-8 px-3.5 bg-[#ff4a1f] hover:bg-[#e03e15] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                        <TrendingUp size={14} />
                        <span>Request Limit Increase</span>
                    </Button>
                </div>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
                <MetricCard
                    title="Total Credit Limit"
                    description={`Max facility limit (€${calculatedStats.monthlyLimit.toLocaleString()} monthly cap)`}
                    value={`€${calculatedStats.totalCreditLimit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                    icon={ShieldCheck}
                    colorClass="bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400"
                    badge={<Badge variant="secondary" className="bg-indigo-50 text-indigo-700 text-[10px] font-semibold border border-indigo-200">Facility</Badge>}
                    valueClassName="text-base sm:text-lg"
                    className="p-2.5 sm:p-3"
                    isLoading={isLoading}
                />
                <MetricCard
                    title="Available Credit"
                    description="Ready to use for booking new cargo dispatch"
                    value={`€${calculatedStats.availableCredit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                    icon={CheckCircle2}
                    colorClass="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400"
                    badge={<Badge variant="secondary" className="bg-emerald-50 text-emerald-700 text-[10px] font-semibold border border-emerald-200">Available</Badge>}
                    valueClassName="text-base sm:text-lg"
                    className="p-2.5 sm:p-3"
                    isLoading={isLoading}
                />
                <MetricCard
                    title="Outstanding Balance"
                    description={`${calculatedStats.dueCount} invoices currently in payment cycle`}
                    value={calculatedStats.totalOutstandingFormatted}
                    icon={AlertCircle}
                    colorClass="bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400"
                    badge={<Badge variant="secondary" className="bg-rose-50 text-rose-700 text-[10px] font-semibold border border-rose-200">Due</Badge>}
                    valueClassName="text-base sm:text-lg"
                    className="p-2.5 sm:p-3"
                    isLoading={isLoading}
                />
                <MetricCard
                    title="Payment Cycle Terms"
                    description={`Consolidated Net-${calculatedStats.payLaterDays} settlement cycle`}
                    value={`Net-${calculatedStats.payLaterDays} Days`}
                    icon={Clock}
                    colorClass="bg-orange-50 dark:bg-[#ff4a1f]/15 text-[#ff4a1f]"
                    badge={<Badge variant="secondary" className="bg-slate-100 text-slate-700 text-[10px] font-semibold border border-slate-200">Term</Badge>}
                    valueClassName="text-base sm:text-lg"
                    className="p-2.5 sm:p-3"
                    isLoading={isLoading}
                />
            </div>

            {/* Pay Later Settlements History Table */}
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
                                    ? "There are no deferred freight invoices or Pay Later settlements on your account."
                                    : `No settlements matching '${activeTab}'.`
                            }
                        />
                    }
                />
            </div>

            {/* Modal: Request Limit Increase */}
            {isIncreaseModalOpen && createPortal(
                <div className="fixed inset-0 z-[99999] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150 font-sans">
                    <form
                        onSubmit={handleSubmitIncrease}
                        className="bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-lg max-w-md w-full overflow-hidden shadow-2xl space-y-4"
                    >
                        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-900/50">
                            <div>
                                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                                    <TrendingUp size={16} className="text-[#ff4a1f]" /> Request Credit Limit Increase
                                </h3>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                    Select which limit you want to increase.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsIncreaseModalOpen(false)}
                                className="text-slate-400 hover:text-slate-600 rounded p-1 cursor-pointer"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        <div className="px-5 py-2 space-y-3 text-xs">
                            <div className="grid grid-cols-2 gap-2">
                                {(['Total Limit', 'Monthly Limit', 'Weekly Limit', 'Daily Limit'] as const).map((target) => (
                                    <button
                                        key={target}
                                        type="button"
                                        onClick={() => setIncreaseTarget(target)}
                                        className={`p-2.5 rounded border text-left cursor-pointer transition-all ${
                                            increaseTarget === target
                                                ? 'border-[#ff4a1f] bg-orange-50/60 dark:bg-[#ff4a1f]/15 text-[#ff4a1f] font-bold'
                                                : 'border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30 text-slate-700 dark:text-slate-300'
                                        }`}
                                    >
                                        <div className="text-[10.5px] uppercase font-bold text-slate-400">{target}</div>
                                        <div className="text-sm font-extrabold mt-0.5">
                                            € {target === 'Total Limit' ? calculatedStats.totalCreditLimit.toLocaleString() : target === 'Monthly Limit' ? calculatedStats.monthlyLimit.toLocaleString() : target === 'Weekly Limit' ? calculatedStats.weeklyLimit.toLocaleString() : calculatedStats.dailyLimit.toLocaleString()}
                                        </div>
                                    </button>
                                ))}
                            </div>

                            <div>
                                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1 text-[11px]">
                                    Requested Amount (€ EUR)
                                </label>
                                <input
                                    type="number"
                                    min="100"
                                    step="100"
                                    disabled={isSubmitting}
                                    placeholder="e.g. 25000"
                                    value={newRequestedLimit}
                                    onChange={(e) => setNewRequestedLimit(e.target.value)}
                                    required
                                    className="w-full px-2.5 py-1.5 border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-[#12161c] text-slate-900 dark:text-slate-100 text-xs font-semibold focus:outline-none focus:border-[#ff4a1f]"
                                />
                            </div>

                            <div>
                                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1 text-[11px]">
                                    Reason for Limit Increase
                                </label>
                                <textarea
                                    rows={2}
                                    disabled={isSubmitting}
                                    placeholder={`Provide details for ${increaseTarget.toLowerCase()} expansion...`}
                                    value={increaseReason}
                                    onChange={(e) => setIncreaseReason(e.target.value)}
                                    required
                                    className="w-full p-2.5 border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-[#12161c] text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:border-[#ff4a1f]"
                                />
                            </div>
                        </div>

                        <div className="px-5 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/60 flex items-center justify-end gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                type="button"
                                disabled={isSubmitting}
                                onClick={() => setIsIncreaseModalOpen(false)}
                                className="h-8 px-4 text-xs font-semibold cursor-pointer"
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="primary"
                                size="sm"
                                type="submit"
                                disabled={isSubmitting}
                                className="h-8 px-4 text-xs font-semibold bg-[#ff4a1f] hover:bg-[#e03d15] text-white cursor-pointer flex items-center gap-1.5 shadow-xs"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 size={13} className="animate-spin" />
                                        <span>Submitting...</span>
                                    </>
                                ) : (
                                    <>
                                        <Check size={13} />
                                        <span>Submit Request</span>
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </div>,
                document.body
            )}

            {/* Modal: Settle Invoice with Pay Later */}
            {isPayModalOpen && selectedInvoice && createPortal(
                <div className="fixed inset-0 z-[99999] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150 font-sans">
                    <div className="bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-lg max-w-sm w-full overflow-hidden shadow-2xl space-y-3">
                        <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-900/50">
                            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                                <CreditCard size={14} className="text-[#ff4a1f]" /> Settle Invoice {selectedInvoice.invoice_number || selectedInvoice.id}
                            </h3>
                            <button
                                type="button"
                                onClick={() => setIsPayModalOpen(false)}
                                disabled={isSubmitting}
                                className="text-slate-400 hover:text-slate-600 rounded p-1 cursor-pointer disabled:opacity-50"
                            >
                                <X size={14} />
                            </button>
                        </div>

                        <div className="p-4 space-y-2.5 text-xs">
                            <div className="flex justify-between items-center p-2.5 rounded bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700">
                                <div>
                                    <span className="text-slate-400 block text-[10px]">Amount Due</span>
                                    <span className="text-base font-bold text-slate-900 dark:text-slate-100">{selectedInvoice.gross_amount_formatted || selectedInvoice.total_amount_formatted || selectedInvoice.amount}</span>
                                </div>
                                <div className="text-right">
                                    <span className="text-slate-400 block text-[10px]">Order Ref</span>
                                    <span className="font-semibold text-slate-700 dark:text-slate-300 text-xs">{selectedInvoice.order_number || selectedInvoice.orderId || 'N/A'}</span>
                                </div>
                            </div>

                            <div className="border border-slate-200 dark:border-slate-700 rounded p-2.5 space-y-1.5 bg-white dark:bg-[#12161c]">
                                <span className="font-semibold text-slate-800 dark:text-slate-200 block text-[11px]">Payment Facility</span>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 text-xs">
                                        <ShieldCheck size={14} className="text-emerald-600" />
                                        <span>Corporate Pay Later ({calculatedStats.payLaterDays}-Day Credit)</span>
                                    </div>
                                    <span className="text-emerald-600 dark:text-emerald-400 font-bold text-[11px]">Auto Settle</span>
                                </div>
                            </div>
                        </div>

                        <div className="px-5 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/60 flex items-center justify-end gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={isSubmitting}
                                onClick={() => setIsPayModalOpen(false)}
                                className="h-8 px-4 text-xs font-semibold cursor-pointer"
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="primary"
                                size="sm"
                                onClick={confirmInvoicePayment}
                                disabled={isSubmitting}
                                className="h-8 px-4 text-xs font-semibold bg-[#ff4a1f] hover:bg-[#e03d15] text-white cursor-pointer flex items-center gap-1.5 shadow-xs"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 size={13} className="animate-spin" />
                                        <span>Settling...</span>
                                    </>
                                ) : (
                                    <>
                                        <Check size={13} />
                                        <span>Confirm & Settle</span>
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}
