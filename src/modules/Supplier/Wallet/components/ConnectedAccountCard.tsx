import apiClient from '@/lib/axios';
import { AlertCircle, Check, Copy, Loader2 } from 'lucide-react';
import { useState } from 'react';

interface StripeAccountInfo {
    is_connected: boolean;
    status: string;
    account_id: string | null;
    raw_account_id?: string | null;
    account_type: string;
    country: string;
    country_code?: string;
    country_flag?: string;
    payout_schedule: string;
    default_currency: string;
    charges_enabled?: boolean;
    payouts_enabled?: boolean;
    onboarding_status?: string;
}

interface ConnectedAccountCardProps {
    account: StripeAccountInfo;
    onRefresh?: () => void;
}

export default function ConnectedAccountCard({ account, onRefresh }: ConnectedAccountCardProps) {
    const [copied, setCopied] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const [actionError, setActionError] = useState<string | null>(null);

    const handleCopy = () => {
        const textToCopy = account.raw_account_id || account.account_id;
        if (!textToCopy) return;
        navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleManageOrConnect = async () => {
        setIsConnecting(true);
        setActionError(null);
        try {
            const res = await apiClient.post('/supplier/wallet/stripe/link');
            const url = res.data?.data?.url || res.data?.url;
            if (url) {
                window.location.href = url;
            } else {
                throw new Error('No redirect URL received.');
            }
        } catch (err: any) {
            console.error('Failed to get Stripe link:', err);
            setActionError(err?.response?.data?.message || err?.message || 'Failed to connect to Stripe.');
        } finally {
            setIsConnecting(false);
        }
    };

    const isConnected = account?.is_connected;

    return (
        <div className="rounded-[4px] border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#12161c] p-3.5 sm:p-4 shadow-2xs flex flex-col justify-between h-full">
            <div>
                {/* Header */}
                <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                        <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
                            Connected Account (Stripe)
                        </h3>
                        {isConnected ? (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[4px] bg-[#ecfdf5] dark:bg-emerald-950/40 text-[#059669] dark:text-emerald-300 border border-[#a7f3d0] dark:border-emerald-800/60 text-[11px] font-semibold">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#059669] dark:bg-emerald-400"></span>
                                Connected
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[4px] bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-[11px] font-semibold">
                                Not Connected
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-[4px] bg-[#635BFF]/10 text-[#635BFF] font-black text-[11px] tracking-wider uppercase">
                        stripe
                    </div>
                </div>

                {actionError && (
                    <div className="mb-2.5 p-2 rounded-[4px] bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-red-600 text-xs flex items-center gap-1.5">
                        <AlertCircle size={14} className="shrink-0" />
                        <span>{actionError}</span>
                    </div>
                )}

                {isConnected ? (
                    /* Compact Key : Value Grid with aligned labels and colons */
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5 py-1 text-xs">
                        <div className="flex items-center text-xs">
                            <span className="w-[110px] shrink-0 text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap">
                                Account ID
                            </span>
                            <span className="mr-2 text-slate-400 font-normal">:</span>
                            <div className="flex items-center gap-1 font-mono font-semibold text-slate-800 dark:text-slate-200 min-w-0">
                                <span className="truncate">{account.account_id || '-'}</span>
                                <button
                                    type="button"
                                    onClick={handleCopy}
                                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors p-0.5 cursor-pointer shrink-0"
                                    title="Copy Account ID"
                                >
                                    {copied ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center text-xs">
                            <span className="w-[110px] shrink-0 text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap">
                                Country
                            </span>
                            <span className="mr-2 text-slate-400 font-normal">:</span>
                            <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                                <span>{account.country || '-'}</span>
                                {account.country_flag && <span>{account.country_flag}</span>}
                            </span>
                        </div>

                        <div className="flex items-center text-xs">
                            <span className="w-[110px] shrink-0 text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap">
                                Account Type
                            </span>
                            <span className="mr-2 text-slate-400 font-normal">:</span>
                            <span className="font-semibold text-slate-800 dark:text-slate-200">{account.account_type || '-'}</span>
                        </div>

                        <div className="flex items-center text-xs">
                            <span className="w-[110px] shrink-0 text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap">
                                Withdrawal Mode
                            </span>
                            <span className="mr-2 text-slate-400 font-normal">:</span>
                            <span className="font-semibold text-emerald-600 dark:text-emerald-400">Manual (On Demand)</span>
                        </div>
                    </div>
                ) : (
                    <div className="py-1">
                        <div className="p-2.5 rounded-[4px] bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/60 text-amber-800 dark:text-amber-300 text-xs">
                            <p className="font-semibold mb-0.5">Link Your Bank Account</p>
                            <p className="text-[11px] text-amber-700 dark:text-amber-400">
                                Connect Stripe to receive automated payouts for completed deliveries.
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Action Button */}
            <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-end">
                <button
                    type="button"
                    onClick={handleManageOrConnect}
                    disabled={isConnecting}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-[4px] border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1a202c] hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold transition-all shadow-2xs cursor-pointer disabled:opacity-50"
                >
                    {isConnecting ? (
                        <>
                            <Loader2 size={13} className="animate-spin text-[#ea580c]" />
                            <span>Connecting...</span>
                        </>
                    ) : isConnected ? (
                        <span>Manage Connected Account</span>
                    ) : (
                        <span className="text-[#ea580c]">Connect Stripe Account</span>
                    )}
                </button>
            </div>
        </div>
    );
}
