import React from 'react';
import {
  CreditCard,
  ExternalLink,
  Loader2,
  Sparkles,
  RotateCcw,
  RefreshCw,
  Check,
  CheckCircle2,
} from 'lucide-react';
import Button from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface StripeConnectCardProps {
  loading: boolean;
  isVerified: boolean;
  isConnecting: boolean;
  isDevTesting: boolean;
  isRefreshing: boolean;
  accountId: string;
  handleStripeConnect: () => void;
  handleTestConnect: () => void;
  handleTestReset: () => void;
  fetchStatus: (isManualRefresh?: boolean) => void;
}

export function StripeConnectCard({
  loading,
  isVerified,
  isConnecting,
  isDevTesting,
  isRefreshing,
  accountId,
  handleStripeConnect,
  handleTestConnect,
  handleTestReset,
  fetchStatus,
}: StripeConnectCardProps) {
  return (
    <Card className="shadow-2xs border-slate-200 dark:border-slate-800 w-full rounded-[4px] overflow-hidden bg-white dark:bg-[#181a20]">
      <div className="p-3.5 sm:p-4 flex flex-col gap-3">
        {/* Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-[4px] bg-[#635BFF]/10 text-[#635BFF] flex items-center justify-center shrink-0">
              <CreditCard className="w-4.5 h-4.5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xs sm:text-[13px] font-bold text-slate-900 dark:text-slate-100">
                  Stripe Express Payouts
                </h3>
                {loading ? (
                  <span className="text-[10px] text-slate-400 font-medium bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-[3px]">
                    Checking...
                  </span>
                ) : isVerified ? (
                  <span className="inline-flex items-center gap-1 text-[10.5px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 px-2 py-0.5 rounded-full">
                    <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> Active & Connected
                  </span>
                ) : (
                  <span className="inline-flex items-center text-[10.5px] font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 px-2 py-0.5 rounded-[3px]">
                    Setup Required
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Automated direct carrier bank payouts clearance powered by Stripe.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center flex-wrap">
            {/* Test Connect Button */}
            <button
              type="button"
              onClick={handleTestConnect}
              disabled={isDevTesting || loading}
              className="h-7 px-2.5 bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 dark:hover:bg-purple-900/50 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 text-[11px] font-bold rounded-[3px] flex items-center gap-1 cursor-pointer transition-all disabled:opacity-50"
              title="Test Connect: Simulate connected Stripe account"
            >
              <Sparkles className="w-3 h-3 text-purple-600 dark:text-purple-400" />
              <span>{isDevTesting ? 'Connecting...' : 'Test Connect'}</span>
            </button>

            {/* Remove / Disconnect Button */}
            <button
              type="button"
              onClick={handleTestReset}
              disabled={isDevTesting || loading}
              title="Remove / Disconnect account for testing"
              className="h-7 px-2.5 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 rounded-[3px] text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors disabled:opacity-50"
            >
              <RotateCcw className="w-3 h-3 text-rose-600 dark:text-rose-400" />
              <span>Remove</span>
            </button>

            {/* Setup Stripe / Stripe Dashboard Button */}
            <Button
              type="button"
              size="sm"
              onClick={handleStripeConnect}
              disabled={isConnecting}
              className={`h-7 px-3 text-[11px] font-bold rounded-[3px] flex items-center gap-1 cursor-pointer shadow-2xs ${
                isVerified
                  ? 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
                  : 'bg-[#ff4a1f] hover:bg-[#e03e15] text-white'
              }`}
            >
              {isConnecting ? <Loader2 className="w-3 h-3 animate-spin" /> : <ExternalLink className="w-3 h-3" />}
              <span>{isVerified ? 'Stripe Dashboard' : 'Setup Stripe'}</span>
            </Button>

            {/* Refresh Button */}
            <button
              type="button"
              onClick={() => fetchStatus(true)}
              disabled={isRefreshing || loading}
              title="Refresh Status"
              className="h-7 w-7 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-500 rounded-[3px] flex items-center justify-center cursor-pointer transition-colors"
            >
              <RefreshCw size={12} className={isRefreshing ? "animate-spin text-[#ff4a1f]" : ""} />
            </button>
          </div>
        </div>

        {/* Connected Details Grid */}
        {isVerified && (
          <div className="pt-3 mt-1 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div className="p-2.5 bg-slate-50 dark:bg-[#14181f] rounded-[3px] border border-slate-200/80 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 font-medium block">Stripe Account ID</span>
              <span className="font-mono font-bold text-slate-800 dark:text-slate-200 text-[11px] block mt-0.5 truncate">
                {accountId}
              </span>
            </div>
            <div className="p-2.5 bg-slate-50 dark:bg-[#14181f] rounded-[3px] border border-slate-200/80 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 font-medium block">Payout Destination</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300 text-[11px] block mt-0.5">
                EUR (€) • SEPA Direct Bank
              </span>
            </div>
            <div className="p-2.5 bg-slate-50 dark:bg-[#14181f] rounded-[3px] border border-slate-200/80 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 font-medium block">Payouts Status</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400 text-[11px] flex items-center gap-1 mt-0.5">
                <CheckCircle2 size={12} /> Active & Enabled
              </span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
