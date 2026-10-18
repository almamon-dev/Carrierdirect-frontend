import React from 'react';
import {
    Copy,
    Check,
    ExternalLink,
    Loader2,
    Unlink,
    Building2,
} from 'lucide-react';

interface StripeSpecsCardProps {
    account: any;
    isLoading: boolean;
    isConnecting: boolean;
    isDisconnecting: boolean;
    copied: boolean;
    handleCopy: () => void;
    handleManageOrConnect: () => void;
    handleDisconnect: () => void;
}

export function StripeSpecsCard({
    account,
    isLoading,
    isConnecting,
    isDisconnecting,
    copied,
    handleCopy,
    handleManageOrConnect,
    handleDisconnect,
}: StripeSpecsCardProps) {
    const isConnected = account?.is_connected;

    return (
        <div className="lg:col-span-7 rounded-[4px] border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#12161c] p-3.5 sm:p-4 shadow-2xs flex flex-col justify-between">
            <div>
                {/* Stripe Top Brand Bar */}
                <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2.5">
                        <span className="font-extrabold text-xl tracking-tight text-[#635BFF]">
                            stripe
                        </span>
                        {isConnected ? (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[4px] text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                Connected
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[4px] text-[11px] font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                                Not Connected
                            </span>
                        )}
                    </div>
                </div>

                {/* Account Specs Details - Aligned Key : Value */}
                {isLoading ? (
                    <div className="py-8 flex justify-center">
                        <Loader2 size={22} className="animate-spin text-[#ea580c]" />
                    </div>
                ) : isConnected ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5 py-2 text-xs">
                        <div className="flex items-center text-xs">
                            <span className="w-[115px] shrink-0 text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap">
                                Account Status
                            </span>
                            <span className="mr-2 text-slate-400 font-normal">:</span>
                            <span className="inline-flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                {account?.status || 'Active'}
                            </span>
                        </div>

                        <div className="flex items-center text-xs">
                            <span className="w-[115px] shrink-0 text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap">
                                Account ID
                            </span>
                            <span className="mr-2 text-slate-400 font-normal">:</span>
                            <div className="flex items-center gap-1 font-mono font-semibold text-slate-800 dark:text-slate-200 min-w-0">
                                <span className="truncate">{account?.account_id || '-'}</span>
                                {account?.account_id && (
                                    <button
                                        type="button"
                                        onClick={handleCopy}
                                        className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition p-0.5 cursor-pointer shrink-0"
                                        title="Copy Account ID"
                                    >
                                        {copied ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center text-xs">
                            <span className="w-[115px] shrink-0 text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap">
                                Account Type
                            </span>
                            <span className="mr-2 text-slate-400 font-normal">:</span>
                            <span className="font-semibold text-slate-800 dark:text-slate-200">
                                {account?.account_type || '-'}
                            </span>
                        </div>

                        <div className="flex items-center text-xs">
                            <span className="w-[115px] shrink-0 text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap">
                                Country
                            </span>
                            <span className="mr-2 text-slate-400 font-normal">:</span>
                            <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                                {account?.country_flag && <span>{account?.country_flag}</span>}
                                <span>{account?.country || '-'}</span>
                            </span>
                        </div>

                        <div className="flex items-center text-xs">
                            <span className="w-[115px] shrink-0 text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap">
                                Withdrawal Mode
                            </span>
                            <span className="mr-2 text-slate-400 font-normal">:</span>
                            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                                Manual (On Demand)
                            </span>
                        </div>

                        <div className="flex items-center text-xs">
                            <span className="w-[115px] shrink-0 text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap">
                                Default Currency
                            </span>
                            <span className="mr-2 text-slate-400 font-normal">:</span>
                            <span className="font-semibold text-slate-800 dark:text-slate-200">
                                {account?.default_currency || '-'}
                            </span>
                        </div>
                    </div>
                ) : (
                    <div className="py-6 text-center space-y-2">
                        <div className="w-10 h-10 rounded-full bg-orange-50 dark:bg-orange-950/40 text-[#ea580c] flex items-center justify-center mx-auto">
                            <Building2 size={20} />
                        </div>
                        <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                            No Stripe Account Connected
                        </h3>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                            Connect your Stripe Express account now to easily withdraw earnings directly to your bank account.
                        </p>
                    </div>
                )}
            </div>

            {/* Action Buttons */}
            <div className="pt-2.5 mt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                {isConnected && (
                    <button
                        type="button"
                        onClick={handleDisconnect}
                        disabled={isDisconnecting}
                        className="py-1.5 px-3 rounded-[4px] bg-red-50/70 hover:bg-red-100/70 dark:bg-red-950/20 dark:hover:bg-red-950/40 text-rose-600 dark:text-rose-400 border border-red-200 dark:border-red-900/40 text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                        {isDisconnecting ? (
                            <>
                                <Loader2 size={13} className="animate-spin" />
                                <span>Disconnecting...</span>
                            </>
                        ) : (
                            <>
                                <Unlink size={13} />
                                <span>Disconnect Account</span>
                            </>
                        )}
                    </button>
                )}
                <button
                    type="button"
                    onClick={handleManageOrConnect}
                    disabled={isConnecting}
                    className="py-1.5 px-3 rounded-[4px] border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1a202c] hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold transition shadow-2xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                    {isConnecting ? (
                        <>
                            <Loader2 size={13} className="animate-spin text-[#ea580c]" />
                            <span>Connecting to Stripe...</span>
                        </>
                    ) : isConnected ? (
                        <>
                            <span>Manage in Stripe</span>
                            <ExternalLink size={13} className="text-slate-400" />
                        </>
                    ) : (
                        <>
                            <span className="text-[#ea580c] font-bold">Connect with Stripe</span>
                            <ExternalLink size={13} className="text-[#ea580c]" />
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
