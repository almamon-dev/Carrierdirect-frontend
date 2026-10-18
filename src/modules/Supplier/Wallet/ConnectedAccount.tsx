import React from 'react';
import {
    CheckCircle2,
    AlertCircle,
    RefreshCw,
} from 'lucide-react';
import PageHeader from '@/components/common/page-header';
import Button from '@/components/ui/button';
import { useConnectedAccountState } from './hooks/useConnectedAccountState';
import { StripeSpecsCard } from './components/StripeSpecsCard';
import { HowItWorksCard } from './components/HowItWorksCard';

export default function ConnectedAccount() {
    const {
        account,
        isLoading,
        isConnecting,
        isDisconnecting,
        copied,
        actionMessage,
        fetchAccountDetails,
        handleCopy,
        handleManageOrConnect,
        handleDisconnect,
    } = useConnectedAccountState();

    return (
        <div className="p-3 sm:p-4 md:p-6 w-full mx-auto space-y-4 sm:space-y-5 min-h-screen font-sans antialiased bg-[#f8fafc] dark:bg-[#12161c]">
            {/* Page Header */}
            <PageHeader
                title="Connected Account"
                description="Connect your Stripe account to withdraw earnings directly to your bank."
                className="mb-0"
                actions={
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={fetchAccountDetails}
                        disabled={isLoading}
                        className="h-8 px-2.5 sm:px-3 text-xs font-semibold flex items-center gap-1.5 cursor-pointer bg-white dark:bg-[#1e2329] border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-[4px]"
                    >
                        <RefreshCw size={12} className={isLoading ? 'animate-spin text-[#ea580c]' : 'text-slate-500'} />
                        <span>Refresh</span>
                    </Button>
                }
            />

            {actionMessage && (
                <div
                    className={`p-2.5 rounded-[4px] text-xs flex items-center gap-2.5 border ${
                        actionMessage.type === 'success'
                            ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
                            : 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900 text-red-600 dark:text-red-300'
                    }`}
                >
                    {actionMessage.type === 'success' ? (
                        <CheckCircle2 size={15} className="shrink-0" />
                    ) : (
                        <AlertCircle size={15} className="shrink-0" />
                    )}
                    <span>{actionMessage.text}</span>
                </div>
            )}

            {/* Main 2-column Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 sm:gap-4 md:gap-5">
                <StripeSpecsCard
                    account={account}
                    isLoading={isLoading}
                    isConnecting={isConnecting}
                    isDisconnecting={isDisconnecting}
                    copied={copied}
                    handleCopy={handleCopy}
                    handleManageOrConnect={handleManageOrConnect}
                    handleDisconnect={handleDisconnect}
                />
                <HowItWorksCard />
            </div>
        </div>
    );
}
