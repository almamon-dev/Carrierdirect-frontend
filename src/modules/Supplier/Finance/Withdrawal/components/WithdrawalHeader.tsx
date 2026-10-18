import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, RotateCcw, ArrowUpRight, RefreshCw, ShieldCheck, AlertCircle, ExternalLink, Loader2 } from 'lucide-react';
import Button from '@/components/ui/button';
import { StripeRedirectTarget } from '../types/withdrawal.types';

interface WithdrawalHeaderProps {
    availableBalance: number;
    isStripeConnected: boolean;
    loading: boolean;
    isRefreshing: boolean;
    isDevTesting: boolean;
    redirectingTarget: StripeRedirectTarget;
    notification: { type: 'success' | 'error'; message: string; link?: string } | null;
    stripeNotice?: string;
    onTestConnect: () => void;
    onTestReset: () => void;
    onRefresh: () => void;
    onRedirectStripe: (target: StripeRedirectTarget, isDashboard: boolean) => void;
    onCloseNotification: () => void;
}

export function WithdrawalHeader({
    availableBalance,
    isStripeConnected,
    loading,
    isRefreshing,
    isDevTesting,
    redirectingTarget,
    notification,
    stripeNotice,
    onTestConnect,
    onTestReset,
    onRefresh,
    onRedirectStripe,
    onCloseNotification,
}: WithdrawalHeaderProps) {
    const navigate = useNavigate();

    return (
        <div className="space-y-4 sm:space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="min-w-0">
                    <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight mb-1">
                        Withdrawals & Settlements
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        Manual bank and Stripe withdrawals, available balance payouts, and settlement ledger history.
                    </p>
                </div>

                <div className="flex items-center gap-2 shrink-0 flex-wrap">
                    {!isStripeConnected && !loading && (
                        <button
                            onClick={onTestConnect}
                            disabled={isDevTesting || loading}
                            className="h-8 px-2.5 sm:px-3 bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 dark:hover:bg-purple-900/50 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 text-xs font-bold rounded-md flex items-center gap-1.5 cursor-pointer shadow-2xs transition-all disabled:opacity-50"
                        >
                            <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                            <span>{isDevTesting ? 'Connecting...' : '⚡ 1-Click Test Connect'}</span>
                        </button>
                    )}

                    {isStripeConnected && !loading && (
                        <button
                            onClick={onTestReset}
                            disabled={isDevTesting}
                            title="Reset for Testing"
                            className="h-8 px-2.5 bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-rose-600 rounded-md text-xs font-semibold flex items-center gap-1 cursor-pointer"
                        >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Reset</span>
                        </button>
                    )}

                    <Button
                        size="sm"
                        onClick={() => navigate('/supplier/wallet/withdraw')}
                        disabled={availableBalance < 50}
                        title={availableBalance < 50 ? 'Minimum €50.00 available balance required to withdraw' : 'Request manual withdrawal'}
                        className="h-8 px-3 rounded-md text-xs font-bold text-white bg-[#ea580c] hover:bg-[#c2410c] flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-2xs"
                    >
                        <ArrowUpRight size={13} />
                        <span>Withdraw Funds</span>
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onRefresh}
                        disabled={isRefreshing || loading}
                        className="h-8 px-2.5 sm:px-3 text-xs font-semibold flex items-center gap-1.5 cursor-pointer bg-white dark:bg-[#1e2329] border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                        <RefreshCw size={13} className={isRefreshing ? "animate-spin text-[#ff4a1f]" : "text-slate-500"} />
                        <span>{isRefreshing ? "Refreshing..." : "Refresh"}</span>
                    </Button>
                </div>
            </div>

            {notification && (
                <div className={`p-3 rounded-[4px] border flex items-center justify-between text-xs animate-in fade-in duration-200 ${
                    notification.type === 'success'
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/40 dark:border-emerald-900/50 dark:text-emerald-300'
                        : 'bg-rose-50 border-rose-200 text-rose-800 dark:bg-rose-950/40 dark:border-rose-900/50 dark:text-rose-300'
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
                    <button onClick={onCloseNotification} className="text-xs font-bold px-2 cursor-pointer">✕</button>
                </div>
            )}

            {!loading && !isStripeConnected && (
                <div className="bg-amber-50/70 dark:bg-amber-950/20 border border-slate-200 dark:border-slate-800 p-3 sm:p-3.5 rounded-[4px] shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fade-in">
                    <div className="flex items-start sm:items-center gap-3">
                        <div className="w-8 h-8 rounded-[4px] bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-400 flex items-center justify-center shrink-0">
                            <AlertCircle className="w-4 h-4" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                                    Action Required: Complete Payout Onboarding
                                </h3>
                                <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 text-[10px] font-bold rounded-[3px] tracking-wider">
                                    Required
                                </span>
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-400 font-normal mt-0.5">
                                {stripeNotice || `Connect your Stripe account to enable automatic payouts, withdraw available balance (€${availableBalance.toFixed(2)}), and receive earnings directly to your bank.`}
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => onRedirectStripe('banner', false)}
                        disabled={redirectingTarget !== null}
                        className="text-xs font-semibold text-[#ff4a1f] hover:text-[#e03e15] hover:underline transition-all cursor-pointer flex items-center gap-1.5 shrink-0 self-end sm:self-center disabled:opacity-60 bg-transparent border-0 p-0"
                    >
                        {redirectingTarget === 'banner' ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-[#ff4a1f]" />
                        ) : (
                            <ExternalLink className="w-3.5 h-3.5 text-[#ff4a1f]" />
                        )}
                        <span>{redirectingTarget === 'banner' ? 'Opening Stripe...' : 'Setup Stripe Account'}</span>
                    </button>
                </div>
            )}
        </div>
    );
}
