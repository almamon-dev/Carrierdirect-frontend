import React, { useState, useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { 
    Euro, ShieldCheck, AlertCircle, TrendingUp, Clock, 
    Sparkles, RotateCcw, Building2, CreditCard, RefreshCw, Loader2, ExternalLink 
} from 'lucide-react';
import Badge from '@/components/ui/badge';
import DataTable, { Column } from '@/components/tables/data-table';
import Select from '@/components/ui/select';
import Skeleton from '@/components/ui/skeleton';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { apiClient } from '@/lib/axios';

export interface WithdrawalItem {
    id: string;
    date: string;
    reference: string;
    amount: string;
    fee: string;
    netAmount: string;
    method: string;
    status: 'Completed' | 'Processing' | 'Failed';
}

type StripeRedirectTarget = 'banner' | 'card_stat' | 'card_account' | null;

export default function Withdrawal() {
    const location = useLocation();
    const [searchParams] = useSearchParams();

    // Data States
    const [loading, setLoading] = useState(true);
    const [redirectingTarget, setRedirectingTarget] = useState<StripeRedirectTarget>(null);
    const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
    const [stats, setStats] = useState({
        totalEarnings: 0,
        escrowBalance: 0,
        availableBalance: 0,
        totalWithdrawn: 0,
        isStripeConnected: false,
    });
    const [stripeAccountData, setStripeAccountData] = useState<any>(null);
    const [withdrawals, setWithdrawals] = useState<WithdrawalItem[]>([]);

    // Dev Test States
    const [isDevTesting, setIsDevTesting] = useState(false);
    const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string; link?: string } | null>(null);

    const stripeNotice = location.state?.stripeNotice;

    // Handle return from Stripe Hosted Onboarding
    useEffect(() => {
        const stripeStatus = searchParams.get('stripe_status');
        if (stripeStatus === 'success') {
            setNotification({ type: 'success', message: '🎉 Stripe Connected Account onboarded and verified successfully!' });
        } else if (stripeStatus === 'pending') {
            setNotification({ type: 'success', message: 'Stripe onboarding submitted. Verification is being processed by Stripe.' });
        } else if (stripeStatus === 'error') {
            setNotification({ type: 'error', message: 'Stripe onboarding was not completed or encountered an issue. Please try again.' });
        }
    }, [searchParams]);

    // Fetch live dashboard finance data & Stripe status
    const fetchFinanceData = async () => {
        setLoading(true);
        try {
            const [dashRes, stripeRes] = await Promise.allSettled([
                apiClient.get('/supplier/finance/dashboard'),
                apiClient.get('/supplier/stripe/status'),
            ]);

            if (dashRes.status === 'fulfilled') {
                const rawVal: any = dashRes.value;
                const data = rawVal?.data?.data || rawVal?.data || rawVal || {};
                const s = data.stats || {};
                
                setStats({
                    totalEarnings: Number(s.total_earnings || 0),
                    escrowBalance: Number(s.escrow_balance || 0),
                    availableBalance: Number(s.available_balance || 0),
                    totalWithdrawn: Number(s.total_withdrawn || 0),
                    isStripeConnected: Boolean(s.is_stripe_connected),
                });

                if (Array.isArray(data.withdraw_requests)) {
                    const mapped: WithdrawalItem[] = data.withdraw_requests.map((w: any) => {
                        const amountNum = parseFloat(w.amount || 0);
                        const statusMap: Record<string, 'Completed' | 'Processing' | 'Failed'> = {
                            completed: 'Completed',
                            pending: 'Processing',
                            rejected: 'Failed',
                        };

                        return {
                            id: `WD-${String(w.id).padStart(5, '0')}`,
                            date: w.created_at ? new Date(w.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recently',
                            reference: w.payment_method || 'Automatic Payout',
                            amount: `€${amountNum.toFixed(2)}`,
                            fee: '5.0%',
                            netAmount: `€${amountNum.toFixed(2)}`,
                            method: w.payment_details ? `Stripe (${w.payment_details.substring(0, 18)})` : 'Stripe Payout',
                            status: statusMap[w.status] || 'Processing',
                        };
                    });
                    setWithdrawals(mapped);
                }
            }

            if (stripeRes.status === 'fulfilled') {
                const rawStripe: any = stripeRes.value;
                const stripeData = rawStripe?.data?.data || rawStripe?.data || rawStripe || {};
                setStripeAccountData(stripeData);
                if ((stripeData.onboarding_status === 'completed' && stripeData.charges_enabled && stripeData.payouts_enabled) || stripeData.is_connected) {
                    setStats(prev => ({ ...prev, isStripeConnected: true }));
                }
            }
        } catch (err) {
            console.error('Error fetching supplier finance data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFinanceData();
    }, []);

    // DIRECT STRIPE HOSTED ONBOARDING LINK (NATIVE REDIRECT & NEW TAB LAUNCHER)
    const handleRedirectToStripeOnboarding = async (target: StripeRedirectTarget, isDashboard = false) => {
        setRedirectingTarget(target);
        setNotification(null);

        try {
            const res: any = await apiClient.post('/supplier/stripe/connect', { dashboard: isDashboard });
            
            // apiClient unwraps JSON response directly
            const url = res?.url || res?.data?.url || res?.data?.data?.url;

            if (url) {
                // 1. Open Stripe Hosted Page in New Tab
                const link = document.createElement('a');
                link.href = url;
                link.target = '_blank';
                link.rel = 'noopener noreferrer';
                document.body.appendChild(link);
                link.click();
                link.remove();

                // 2. Banner with clickable link in case popup was blocked by browser
                setNotification({
                    type: 'success',
                    message: 'Stripe Onboarding opened. If not redirected automatically, click here:',
                    link: url,
                });
            } else {
                setNotification({ 
                    type: 'error', 
                    message: res?.message || res?.data?.message || 'Failed to generate Stripe onboarding link.' 
                });
            }
        } catch (err: any) {
            setNotification({ 
                type: 'error', 
                message: err?.data?.message || err?.response?.data?.message || err?.message || 'Failed to connect to Stripe API.' 
            });
        } finally {
            setRedirectingTarget(null);
        }
    };

    // 1-Click Instant Test Connect (For Developer Local Testing)
    const handleTestConnect = async () => {
        setIsDevTesting(true);
        setNotification(null);
        try {
            await apiClient.post('/supplier/stripe/test-connect');
            setNotification({ type: 'success', message: '⚡ Test Stripe Account connected and stored in database!' });
            fetchFinanceData();
        } catch (err: any) {
            setNotification({ type: 'error', message: err?.data?.message || err?.message || 'Failed test connect.' });
        } finally {
            setIsDevTesting(false);
        }
    };

    // Reset Test Account (For Developer Local Testing)
    const handleTestReset = async () => {
        setIsDevTesting(true);
        setNotification(null);
        try {
            await apiClient.post('/supplier/stripe/test-reset');
            setNotification({ type: 'success', message: 'Stripe account reset for testing.' });
            fetchFinanceData();
        } catch (err: any) {
            setNotification({ type: 'error', message: err?.data?.message || err?.message || 'Failed test reset.' });
        } finally {
            setIsDevTesting(false);
        }
    };

    // Filter History
    const filteredHistory = withdrawals.filter(item => {
        if (selectedStatusFilter === 'all') return true;
        return item.status.toLowerCase() === selectedStatusFilter.toLowerCase();
    });

    const columns: Column<WithdrawalItem>[] = [
        { id: 'id', label: 'Transaction ID', render: (row) => <span className="font-bold text-slate-900">{row.id}</span> },
        { id: 'date', label: 'Date', render: (row) => <span className="text-xs text-slate-500">{row.date}</span> },
        { id: 'reference', label: 'Reference', render: (row) => <span className="text-xs text-slate-500">{row.reference}</span> },
        { id: 'method', label: 'Destination', render: (row) => <span className="font-semibold text-slate-800">{row.method}</span> },
        { id: 'amount', label: 'Gross Amount', render: (row) => <span className="font-semibold text-slate-800">{row.amount}</span> },
        { id: 'fee', label: 'Fees', render: (row) => <span className="font-semibold text-red-600">-{row.fee}</span> },
        { id: 'netAmount', label: 'Net Amount', render: (row) => <span className="font-bold text-emerald-600">{row.netAmount}</span> },
        {
            id: 'status',
            label: 'Status',
            render: (row) => (
                <Badge variant="secondary" className={
                    row.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 font-semibold' :
                        row.status === 'Processing' ? 'bg-amber-50 text-amber-700 font-semibold' :
                            'bg-red-50 text-red-700 font-semibold'
                }>
                    {row.status}
                </Badge>
            )
        },
    ];

    const filterContent = (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-2">
            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-600">Payout Status</label>
                <Select value={selectedStatusFilter} onChange={(opt) => setSelectedStatusFilter(typeof opt === 'object' ? opt.id : opt)} showSearch={false}>
                    <option value="all">All Payouts</option>
                    <option value="completed">Completed</option>
                    <option value="processing">Processing</option>
                    <option value="failed">Failed</option>
                </Select>
            </div>
        </div>
    );

    const isStripeConnected = Boolean(stats.isStripeConnected || (stripeAccountData?.onboarding_status === 'completed' && stripeAccountData?.payouts_enabled));

    return (
        <div className="p-4 md:p-6 w-full mx-auto space-y-5 min-h-screen font-sans antialiased bg-[#f8fafc] dark:bg-[#12161c]">
            
            {/* Header matching Active Jobs & Earnings Dashboard */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 tracking-tight mb-1">Withdrawals & Settlements</h1>
                    <p className="text-xs text-slate-500 font-medium">Automatic bank payouts powered by Stripe Connect and settlement ledger history.</p>
                </div>

                <div className="flex items-center gap-2">
                    {/* 1-Click Dev Test Button */}
                    <button
                        onClick={handleTestConnect}
                        disabled={isDevTesting || loading}
                        className="h-9 px-3 bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700 text-xs font-bold rounded-md flex items-center gap-1.5 cursor-pointer shadow-2xs transition-all disabled:opacity-50"
                    >
                        <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                        <span>{isDevTesting ? 'Connecting...' : '⚡ 1-Click Test Connect'}</span>
                    </button>

                    {isStripeConnected && !loading && (
                        <button
                            onClick={handleTestReset}
                            disabled={isDevTesting}
                            title="Reset for Testing"
                            className="h-9 px-2.5 bg-white border border-slate-200 text-slate-600 hover:text-rose-600 rounded-md text-xs font-semibold flex items-center gap-1 cursor-pointer"
                        >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Reset</span>
                        </button>
                    )}

                    <button
                        onClick={fetchFinanceData}
                        title="Refresh"
                        className="h-9 px-3 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-md text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                        <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                        <span>Refresh</span>
                    </button>
                </div>
            </div>

            {/* Notification Banner */}
            {notification && (
                <div className={`p-3 rounded-lg border flex items-center justify-between text-xs animate-in fade-in duration-200 ${
                    notification.type === 'success'
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                        : 'bg-rose-50 border-rose-200 text-rose-800'
                }`}>
                    <div className="flex items-center gap-2 flex-wrap">
                        {notification.type === 'success' ? <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" /> : <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />}
                        <span>{notification.message}</span>
                        {notification.link && (
                            <a
                                href={notification.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-bold underline text-[#635bff] flex items-center gap-1 hover:text-[#5046e5]"
                            >
                                Open Stripe Setup Page <ExternalLink size={12} />
                            </a>
                        )}
                    </div>
                    <button onClick={() => setNotification(null)} className="text-xs font-bold px-2 cursor-pointer">✕</button>
                </div>
            )}

            {/* High-Impact Action Required Banner when Stripe is not connected */}
            {!loading && !isStripeConnected && (
                <div className="bg-gradient-to-r from-red-500 via-rose-500 to-[#ff4a1f] text-white p-4 rounded-md shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fade-in border border-red-400/60">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0 border border-white/30 shadow-2xs">
                            <AlertCircle className="w-5 h-5 text-white animate-pulse" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="text-sm font-bold text-white tracking-tight">Action Required: Complete Payout Onboarding</h3>
                                <span className="px-2 py-0.5 bg-white text-red-600 text-[10px] font-bold rounded-full shadow-2xs uppercase tracking-wider">
                                    Action Required
                                </span>
                            </div>
                            <p className="text-xs text-white/90 font-normal mt-0.5">
                                {stripeNotice || `Connect your Stripe account to enable automatic payouts, withdraw available balance (€${stats.availableBalance.toFixed(2)}), and receive earnings directly to your bank.`}
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={() => handleRedirectToStripeOnboarding('banner', false)}
                        disabled={redirectingTarget !== null}
                        className="h-9 px-4 bg-white text-red-600 hover:bg-slate-50 font-bold text-xs rounded-lg shadow-sm transition-all cursor-pointer flex items-center gap-1.5 shrink-0 hover:scale-105 disabled:opacity-75"
                    >
                        {redirectingTarget === 'banner' ? <Loader2 className="w-3.5 h-3.5 animate-spin text-red-600" /> : <ExternalLink className="w-3.5 h-3.5" />}
                        <span>{redirectingTarget === 'banner' ? 'Opening Stripe...' : 'Setup Stripe Account'}</span>
                    </button>
                </div>
            )}

            {/* Top Stats Strip matching Earnings */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-white p-3.5 rounded-md border border-slate-200 shadow-2xs space-y-3">
                            <div className="flex justify-between items-center">
                                <Skeleton className="w-8 h-8 rounded-lg" />
                                <Skeleton className="w-12 h-4 rounded" />
                            </div>
                            <div className="space-y-1.5 pt-1">
                                <Skeleton className="w-24 h-6 rounded" />
                                <Skeleton className="w-20 h-3 rounded" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                    {/* Available Balance */}
                    <div className="bg-white p-3.5 rounded-md border border-slate-200 shadow-2xs flex flex-col justify-between">
                        <div className="flex justify-between items-start mb-2">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-orange-50 text-[#ff4a1f]">
                                <Euro size={16} strokeWidth={2.5} />
                            </div>
                            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Auto Transfer</span>
                        </div>
                        <div className="mt-auto">
                            <h3 className="text-base font-bold text-slate-900 mb-0.5">€{stats.availableBalance.toFixed(2)}</h3>
                            <p className="text-xs font-medium text-slate-500">Available Balance</p>
                        </div>
                    </div>

                    {/* In-Transit Escrow */}
                    <div className="bg-white p-3.5 rounded-md border border-slate-200 shadow-2xs flex flex-col justify-between">
                        <div className="flex justify-between items-start mb-2">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-amber-50 text-amber-600">
                                <Clock size={16} strokeWidth={2.5} />
                            </div>
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-slate-900 mb-0.5">€{stats.escrowBalance.toFixed(2)}</h3>
                            <p className="text-xs font-medium text-slate-500">Pending Clearance</p>
                        </div>
                    </div>

                    {/* Total Lifetime Withdrawn */}
                    <div className="bg-white p-3.5 rounded-md border border-slate-200 shadow-2xs flex flex-col justify-between">
                        <div className="flex justify-between items-start mb-2">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-purple-50 text-purple-600">
                                <TrendingUp size={16} strokeWidth={2.5} />
                            </div>
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-slate-900 mb-0.5">€{stats.totalWithdrawn.toFixed(2)}</h3>
                            <p className="text-xs font-medium text-slate-500">Lifetime Settled</p>
                        </div>
                    </div>

                    {/* Stripe Connected Account */}
                    <div className={`p-3.5 rounded-md border transition-all flex flex-col justify-between ${
                        !isStripeConnected
                            ? 'bg-red-50/30 border-red-300 ring-2 ring-red-500/20 shadow-xs'
                            : 'bg-white border-slate-200 shadow-2xs'
                    }`}>
                        <div className="flex justify-between items-start mb-2">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                isStripeConnected ? 'bg-[#635BFF]/10 text-[#635BFF]' : 'bg-red-100 text-red-600'
                            }`}>
                                {isStripeConnected ? <ShieldCheck size={16} strokeWidth={2.5} /> : <AlertCircle size={16} strokeWidth={2.5} />}
                            </div>
                            {isStripeConnected ? (
                                <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 font-semibold text-[10px]">
                                    Connected
                                </Badge>
                            ) : (
                                <span className="px-2 py-0.5 bg-red-600 text-white text-[10px] font-bold rounded-full shadow-2xs animate-pulse">
                                    Action Required
                                </span>
                            )}
                        </div>
                        <div className="flex items-end justify-between mt-auto">
                            <div>
                                <h3 className="text-base font-bold text-slate-900 mb-0.5">Stripe Connect</h3>
                                <p className="text-xs font-medium text-slate-500">
                                    {isStripeConnected ? (stripeAccountData?.stripe_account?.stripe_account_id ? 'Bank Linked' : 'Connected') : 'Setup required'}
                                </p>
                            </div>
                            <button
                                className="text-xs text-[#635BFF] hover:underline font-bold transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50"
                                onClick={() => handleRedirectToStripeOnboarding('card_stat', isStripeConnected)}
                                disabled={redirectingTarget !== null}
                            >
                                {redirectingTarget === 'card_stat' ? (
                                    <span className="flex items-center gap-1">
                                        <Loader2 className="w-3 h-3 animate-spin text-[#635bff]" /> Opening...
                                    </span>
                                ) : isStripeConnected ? 'Manage' : 'Setup'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Grid Layout matching Earnings (1/3 Left Auto-Height Card + 2/3 Right DataTable) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
                
                {/* Left Card (1 col): Auto-Height Payout Account Details */}
                <Card className="lg:col-span-1 h-auto self-start border-slate-200 shadow-2xs rounded-md overflow-hidden bg-white">
                    <CardHeader className="py-2.5 px-3.5 bg-slate-50/50 border-b border-slate-100 flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-xs font-bold text-slate-900">Settlement Payout Account</CardTitle>
                            <p className="text-[10.5px] text-slate-500 font-normal mt-0.5">Automated bank transfer destination</p>
                        </div>
                        {loading ? (
                            <Skeleton className="w-12 h-4 rounded" />
                        ) : isStripeConnected ? (
                            <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 font-semibold text-[10px]">Active</Badge>
                        ) : (
                            <Badge variant="secondary" className="bg-amber-50 text-amber-700 font-semibold text-[10px]">Setup Required</Badge>
                        )}
                    </CardHeader>

                    <div className="p-3.5 space-y-3 h-auto">
                        {loading ? (
                            <div className="space-y-2">
                                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center gap-2">
                                    <Skeleton className="w-7 h-7 rounded-lg" />
                                    <div className="space-y-1 flex-1">
                                        <Skeleton className="w-24 h-3.5 rounded" />
                                        <Skeleton className="w-16 h-2.5 rounded" />
                                    </div>
                                </div>
                                <Skeleton className="w-full h-7 rounded" />
                            </div>
                        ) : isStripeConnected ? (
                            <div className="space-y-2.5">
                                {/* Compact Bank Box */}
                                <div className="p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-200/80">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-8 h-8 rounded-lg bg-[#635bff]/10 text-[#635bff] flex items-center justify-center font-bold shrink-0">
                                            <Building2 className="w-4 h-4" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center justify-between">
                                                <span className="font-bold text-slate-900 text-xs truncate">
                                                    Stripe Connected Bank
                                                </span>
                                                <span className="text-[9.5px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded shrink-0">Verified</span>
                                            </div>
                                            <span className="text-[11px] text-slate-500 font-mono block">
                                                {stripeAccountData?.account_id ? `${stripeAccountData.account_id.substring(0, 16)}...` : 'Linked & Ready'} (EUR)
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Compact Info Row */}
                                <div className="flex items-center justify-between px-1 text-[11px] text-slate-500">
                                    <span>Payout Schedule</span>
                                    <span className="font-semibold text-slate-700">Weekly Auto-Transfer</span>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-2 space-y-1">
                                <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                                    <CreditCard className="w-4 h-4" />
                                </div>
                                <p className="text-xs text-slate-600">Connect your bank account via Stripe.</p>
                            </div>
                        )}

                        <div className="pt-1">
                            {loading ? (
                                <Skeleton className="w-full h-7 rounded" />
                            ) : isStripeConnected ? (
                                <button
                                    onClick={() => handleRedirectToStripeOnboarding('card_account', true)}
                                    disabled={redirectingTarget !== null}
                                    className="w-full h-7 px-2.5 text-xs font-semibold text-[#635bff] bg-[#635bff]/5 hover:bg-[#635bff]/10 border border-[#635bff]/20 rounded transition-colors cursor-pointer flex items-center justify-center gap-1 disabled:opacity-50"
                                >
                                    {redirectingTarget === 'card_account' ? <Loader2 className="w-3.5 h-3.5 animate-spin text-[#635bff]" /> : <ExternalLink size={12} />}
                                    <span>{redirectingTarget === 'card_account' ? 'Opening Stripe...' : 'Manage Stripe Account'}</span>
                                </button>
                            ) : (
                                <button
                                    onClick={() => handleRedirectToStripeOnboarding('card_account', false)}
                                    disabled={redirectingTarget !== null}
                                    className="w-full h-7 px-2.5 text-xs font-bold text-white bg-[#ff4a1f] hover:bg-[#e03e15] rounded transition-colors cursor-pointer flex items-center justify-center gap-1 shadow-2xs disabled:opacity-50"
                                >
                                    {redirectingTarget === 'card_account' ? <Loader2 className="w-3.5 h-3.5 animate-spin text-red-600" /> : <ExternalLink size={12} />}
                                    <span>{redirectingTarget === 'card_account' ? 'Opening Stripe...' : 'Complete Setup in Stripe'}</span>
                                </button>
                            )}
                        </div>
                    </div>
                </Card>

                {/* Right Table (2 cols): Withdrawal History Table */}
                <div className="lg:col-span-2 p-0">
                    <DataTable
                        columns={columns}
                        data={filteredHistory}
                        compact={true}
                        searchPlaceholder="Search payouts by transaction ID, method..."
                        hideViewToggle={true}
                        filterContent={filterContent}
                        isLoading={loading}
                        keyExtractor={(item) => item.id}
                    />
                </div>

            </div>
        </div>
    );
}
