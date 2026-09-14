import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Euro, CreditCard, HandCoins, Receipt, ArrowUpRight, TrendingUp, ShieldCheck } from 'lucide-react';
import apiClient from '@/lib/axios';
import Button from '@/components/ui/button';

export default function FinanceDashboard() {
    const [financeData, setFinanceData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchFinance = async () => {
            try {
                const res = await apiClient.get('/supplier/finance/earnings');
                setFinanceData(res.data?.data || res.data || null);
            } catch (err) {
                console.error('Failed to load finance data:', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchFinance();
    }, []);

    const totalBalance = financeData?.available_balance ?? financeData?.total_balance ?? 0;
    const totalEarnings = financeData?.total_earnings ?? financeData?.lifetime_earnings ?? 0;
    const pendingWithdrawal = financeData?.pending_withdrawals ?? financeData?.pending_payouts ?? 0;

    return (
        <div className="space-y-6 pb-12">
            {/* Header */}
            <div
    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-[#12161c] p-6 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center font-bold text-xl shrink-0">
                        <Euro size={26} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-xl font-bold text-slate-900 dark:text-white">Finance & Settlement Portal</h1>
                            <span className="px-2 py-0.5 text-[11px] font-semibold bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 rounded-full">Audit Ready</span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Monitor financial payouts, billing receipts, and ledger statements.</p>
                    </div>
                </div>
                <div className="flex items-center gap-2.5 shrink-0">
                    <Link to="/supplier/finance/withdrawal">
                        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs flex items-center gap-1.5 shadow-xs">
                            <CreditCard size={15} />
                            <span>Request Withdrawal</span>
                        </Button>
                    </Link>
                    <Link to="/supplier/finance/payments">
                        <Button variant="outline" size="sm" className="text-xs flex items-center gap-1.5">
                            <Receipt size={14} />
                            <span>Invoices & Receipts</span>
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div
    className="bg-white dark:bg-[#12161c] p-5 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Available Payout Balance</p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">€{Number(totalBalance).toLocaleString()}</p>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center">
                        <HandCoins size={20} />
                    </div>
                </div>

                <div
    className="bg-white dark:bg-[#12161c] p-5 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Net Earnings</p>
                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">€{Number(totalEarnings).toLocaleString()}</p>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center">
                        <TrendingUp size={20} />
                    </div>
                </div>

                <div
    className="bg-white dark:bg-[#12161c] p-5 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Pending Withdrawals</p>
                        <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">€{Number(pendingWithdrawal).toLocaleString()}</p>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center">
                        <CreditCard size={20} />
                    </div>
                </div>
            </div>

            {/* Navigation Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
    className="bg-white dark:bg-[#12161c] p-6 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4">
                    <div>
                        <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                            <CreditCard size={17} className="text-emerald-600" />
                            <span>Bank Payouts & Stripe Connect</span>
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                            Review and initiate bank transfer disbursements for fulfilled freight shipment jobs.
                        </p>
                    </div>
                    <Link to="/supplier/finance/withdrawal">
                        <Button size="sm" className="w-full bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-700 text-xs">
                            <span>Open Withdrawal Terminal</span>
                        </Button>
                    </Link>
                </div>

                <div
    className="bg-white dark:bg-[#12161c] p-6 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4">
                    <div>
                        <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                            <Receipt size={17} className="text-blue-600" />
                            <span>Billing History & Customer Invoices</span>
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                            Download tax receipts, CMR freight insurance statements, and invoices.
                        </p>
                    </div>
                    <Link to="/supplier/finance/payments">
                        <Button size="sm" variant="outline" className="w-full text-xs">
                            <span>View All Receipts & Ledger</span>
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
