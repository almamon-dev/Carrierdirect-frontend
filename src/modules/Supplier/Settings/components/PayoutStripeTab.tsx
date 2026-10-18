import React from 'react';
import { ShieldCheck, AlertCircle } from 'lucide-react';
import { StripeConnectCard } from './StripeConnectCard';
import { usePayoutStripeState } from '../hooks/usePayoutStripeState';

export default function PayoutStripeTab() {
  const {
    loading,
    isRefreshing,
    isConnecting,
    isDevTesting,
    notification,
    setNotification,
    isVerified,
    accountId,
    fetchStatus,
    handleStripeConnect,
    handleTestConnect,
    handleTestReset,
  } = usePayoutStripeState();

  return (
    <div id="supplier-payouts-container" className="space-y-3 font-sans antialiased w-full">
      {/* Notification Banner */}
      {notification && (
        <div
          className={`p-2.5 rounded-[4px] border flex items-center justify-between text-xs animate-in fade-in duration-200 ${
            notification.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/40 dark:border-emerald-900/50 dark:text-emerald-300'
              : 'bg-rose-50 border-rose-200 text-rose-800 dark:bg-rose-950/40 dark:border-rose-900/50 dark:text-rose-300'
          }`}
        >
          <div className="flex items-center gap-2 flex-wrap">
            {notification.type === 'success' ? (
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
            )}
            <span className="font-medium">{notification.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setNotification(null)}
            className="text-xs font-bold px-1.5 hover:opacity-70 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Stripe Connect Card */}
      <StripeConnectCard
        loading={loading}
        isVerified={isVerified}
        isConnecting={isConnecting}
        isDevTesting={isDevTesting}
        isRefreshing={isRefreshing}
        accountId={accountId}
        handleStripeConnect={handleStripeConnect}
        handleTestConnect={handleTestConnect}
        handleTestReset={handleTestReset}
        fetchStatus={fetchStatus}
      />
    </div>
  );
}
