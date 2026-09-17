import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Clock, 
  Building, 
  CheckCircle2, 
  ShieldCheck, 
  AlertCircle, 
  ExternalLink, 
  Loader2, 
  Sparkles, 
  RotateCcw, 
  RefreshCw,
  Check
} from 'lucide-react';
import Button from '@/components/ui/button';
import Select from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { apiClient } from '@/lib/axios';
import { TOKEN_CONFIG } from '@/config/auth';
import { useToastStore } from '@/stores/useToastStore';

export default function PayoutStripeTab() {
  const [stripeStatus, setStripeStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDevTesting, setIsDevTesting] = useState(false);
  const [payoutSchedule, setPayoutSchedule] = useState('weekly');
  const [paymentTerms, setPaymentTerms] = useState('net15');
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string; link?: string } | null>(null);

  const fetchStatus = async (isManualRefresh = false) => {
    if (isManualRefresh) setIsRefreshing(true);
    try {
      const res: any = await apiClient.get('/supplier/stripe/status');
      const data = res?.data?.data || res?.data || res || {};
      setStripeStatus(data);

      try {
        const rawUser = localStorage.getItem(TOKEN_CONFIG.userKey);
        if (rawUser) {
          const u = JSON.parse(rawUser);
          const isConn = Boolean(
            (data.onboarding_status === 'completed' && (data.payouts_enabled || data.charges_enabled)) ||
            data.is_connected ||
            data.is_stripe_connected ||
            data.account_id ||
            data.stripe_account?.stripe_account_id
          );
          u.is_stripe_connected = isConn;
          if (data.account_id || data.stripe_account?.stripe_account_id) {
            u.stripe_account_id = data.account_id || data.stripe_account?.stripe_account_id;
          }
          localStorage.setItem(TOKEN_CONFIG.userKey, JSON.stringify(u));
        }
      } catch (err) {}
    } catch (e) {
      console.error('Error fetching stripe status', e);
    } finally {
      setLoading(false);
      if (isManualRefresh) {
        setTimeout(() => setIsRefreshing(false), 300);
      }
    }
  };

  useEffect(() => {
    fetchStatus();

    try {
      const rawUser = localStorage.getItem(TOKEN_CONFIG.userKey);
      if (rawUser) {
        const u = JSON.parse(rawUser);
        if (u.payout_schedule) setPayoutSchedule(u.payout_schedule);
        if (u.payment_terms) setPaymentTerms(u.payment_terms);
      }
    } catch (err) {
      console.error('Error loading stored payout settings', err);
    }
  }, []);

  const paymentTermsOptions = [
    { id: 'instant', name: 'Instant Clearance (Upon Delivery Proof)' },
    { id: 'net15', name: 'Net 15 Days (Standard)' },
    { id: 'net30', name: 'Net 30 Days (Corporate)' },
  ];

  const isVerified = Boolean(
    (stripeStatus?.onboarding_status === 'completed' && (stripeStatus?.payouts_enabled || stripeStatus?.charges_enabled)) || 
    stripeStatus?.is_connected ||
    stripeStatus?.is_stripe_connected ||
    stripeStatus?.account_id ||
    stripeStatus?.stripe_account?.stripe_account_id
  );

  const accountId = stripeStatus?.account_id || stripeStatus?.stripe_account?.stripe_account_id || 'acct_connected';

  const handleStripeConnect = async () => {
    setIsConnecting(true);
    setNotification(null);
    try {
      const res: any = await apiClient.post('/supplier/stripe/connect', { dashboard: isVerified });
      const url = res?.data?.data?.url || res?.data?.url || res?.url;

      if (url) {
        const link = document.createElement('a');
        link.href = url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        document.body.appendChild(link);
        link.click();
        link.remove();

        setNotification({
          type: 'success',
          message: isVerified ? 'Opening Stripe Express Dashboard...' : 'Stripe onboarding opened in a new tab.',
          link: url,
        });
        useToastStore.getState().showToast(isVerified ? 'Opening Stripe Dashboard...' : 'Stripe setup link generated', 'success');
      } else {
        useToastStore.getState().showToast('Failed to generate Stripe link', 'error');
      }
    } catch (err: any) {
      console.error('Stripe connect error:', err);
      const msg = err.data?.message || err.response?.data?.message || err.message || 'Failed to connect to Stripe.';
      setNotification({ type: 'error', message: msg });
      useToastStore.getState().showToast(msg, 'error');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleTestConnect = async () => {
    setIsDevTesting(true);
    setNotification(null);
    try {
      await apiClient.post('/supplier/stripe/test-connect');
      setNotification({ type: 'success', message: 'Test Stripe Account connected successfully.' });
      useToastStore.getState().showToast('Test Stripe Account connected successfully!', 'success');
      await fetchStatus();
    } catch (err: any) {
      const msg = err?.data?.message || err?.message || 'Failed test connect.';
      setNotification({ type: 'error', message: msg });
      useToastStore.getState().showToast(msg, 'error');
    } finally {
      setIsDevTesting(false);
    }
  };

  const handleTestReset = async () => {
    setIsDevTesting(true);
    setNotification(null);
    try {
      await apiClient.post('/supplier/stripe/test-reset');
      setNotification({ type: 'success', message: 'Stripe account reset for testing.' });
      useToastStore.getState().showToast('Stripe account reset successfully.', 'success');
      try {
        const rawUser = localStorage.getItem(TOKEN_CONFIG.userKey);
        if (rawUser) {
          const u = JSON.parse(rawUser);
          u.is_stripe_connected = false;
          delete u.stripe_account_id;
          localStorage.setItem(TOKEN_CONFIG.userKey, JSON.stringify(u));
        }
      } catch {}
      await fetchStatus();
    } catch (err: any) {
      const msg = err?.data?.message || err?.message || 'Failed test reset.';
      setNotification({ type: 'error', message: msg });
      useToastStore.getState().showToast(msg, 'error');
    } finally {
      setIsDevTesting(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload = {
        payout_schedule: payoutSchedule,
        payment_terms: paymentTerms,
      };

      const rawUser = localStorage.getItem(TOKEN_CONFIG.userKey);
      if (rawUser) {
        const u = JSON.parse(rawUser);
        localStorage.setItem(TOKEN_CONFIG.userKey, JSON.stringify({ ...u, ...payload }));
      }

      setIsSaved(true);
      useToastStore.getState().showToast('Payout preferences saved successfully.', 'success');
      setTimeout(() => setIsSaved(false), 3000);
    } catch (err) {
      console.error('Error saving payout settings', err);
      useToastStore.getState().showToast('Failed to save payout settings', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form id="supplier-payouts-form" onSubmit={handleSave} className="space-y-3 font-sans antialiased w-full">
      
      {/* Notification Banner */}
      {notification && (
        <div className={`p-2.5 rounded-[4px] border flex items-center justify-between text-xs animate-in fade-in duration-200 ${
          notification.type === 'success'
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/40 dark:border-emerald-900/50 dark:text-emerald-300'
            : 'bg-rose-50 border-rose-200 text-rose-800 dark:bg-rose-950/40 dark:border-rose-900/50 dark:text-rose-300'
        }`}>
          <div className="flex items-center gap-2 flex-wrap">
            {notification.type === 'success' ? <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" /> : <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />}
            <span className="font-medium">{notification.message}</span>
          </div>
          <button type="button" onClick={() => setNotification(null)} className="text-xs font-bold px-1.5 hover:opacity-70 cursor-pointer">✕</button>
        </div>
      )}

      {/* Stripe Connect Card */}
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
                    <span className="text-[10px] text-slate-400 font-medium bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-[3px]">Checking...</span>
                  ) : isVerified ? (
                    <span className="inline-flex items-center gap-1 text-[10.5px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 px-2 py-0.5 rounded-[3px]">
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
            <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
              {!isVerified && !loading && (
                <>
                  <button
                    type="button"
                    onClick={handleTestConnect}
                    disabled={isDevTesting || loading}
                    className="h-7 px-2.5 bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 dark:hover:bg-purple-900/50 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 text-[11px] font-bold rounded-[3px] flex items-center gap-1 cursor-pointer transition-all disabled:opacity-50"
                  >
                    <Sparkles className="w-3 h-3 text-purple-600" />
                    <span>{isDevTesting ? 'Connecting...' : 'Test Connect'}</span>
                  </button>

                  <Button
                    type="button"
                    size="sm"
                    onClick={handleStripeConnect}
                    disabled={isConnecting}
                    className="h-7 px-3 bg-[#ff4a1f] hover:bg-[#e03e15] text-white text-[11px] font-bold rounded-[3px] flex items-center gap-1 cursor-pointer shadow-2xs"
                  >
                    {isConnecting ? <Loader2 className="w-3 h-3 animate-spin" /> : <ExternalLink className="w-3 h-3" />}
                    <span>Setup Stripe</span>
                  </Button>
                </>
              )}

              {isVerified && !loading && (
                <>
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleStripeConnect}
                    disabled={isConnecting}
                    className="h-7 px-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-[11px] font-bold rounded-[3px] flex items-center gap-1 cursor-pointer shadow-2xs border border-slate-200 dark:border-slate-700"
                  >
                    {isConnecting ? <Loader2 className="w-3 h-3 animate-spin" /> : <ExternalLink className="w-3 h-3" />}
                    <span>Stripe Dashboard</span>
                  </Button>

                  <button
                    type="button"
                    onClick={handleTestReset}
                    disabled={isDevTesting}
                    title="Reset for Testing"
                    className="h-7 px-2 bg-slate-50 hover:bg-rose-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-rose-600 rounded-[3px] text-[11px] font-medium flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset</span>
                  </button>
                </>
              )}

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

      {/* Payout Schedule Card */}
      <Card className="shadow-2xs border-slate-200 dark:border-slate-800 w-full rounded-[4px] bg-white dark:bg-[#181a20]">
        <CardHeader className="py-2.5 px-3.5 sm:px-4 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-[#151921] rounded-t-[4px]">
          <CardTitle className="text-xs font-bold flex items-center gap-1.5 text-slate-900 dark:text-slate-100">
            <Clock className="w-3.5 h-3.5 text-[#ff4a1f]" />
            Payout Transfer Schedule
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3.5 sm:p-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <label 
              onClick={() => setPayoutSchedule('daily')}
              className={`p-3 rounded-[4px] border cursor-pointer transition-all flex flex-col justify-between gap-1.5 ${
                payoutSchedule === 'daily' 
                  ? 'bg-orange-50/40 dark:bg-orange-950/20 border-[#ff4a1f] ring-1 ring-[#ff4a1f]/30' 
                  : 'bg-white dark:bg-[#14181f] border-slate-200 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100">Daily Payouts</span>
                <input type="radio" name="payoutSchedule" checked={payoutSchedule === 'daily'} onChange={() => {}} className="accent-[#ff4a1f]" />
              </div>
              <p className="text-[10.5px] text-slate-500 dark:text-slate-400 font-normal leading-relaxed">
                Transfers available cleared funds automatically every 24 hours.
              </p>
            </label>

            <label 
              onClick={() => setPayoutSchedule('weekly')}
              className={`p-3 rounded-[4px] border cursor-pointer transition-all flex flex-col justify-between gap-1.5 ${
                payoutSchedule === 'weekly' 
                  ? 'bg-orange-50/40 dark:bg-orange-950/20 border-[#ff4a1f] ring-1 ring-[#ff4a1f]/30' 
                  : 'bg-white dark:bg-[#14181f] border-slate-200 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100">Weekly (Every Monday)</span>
                <input type="radio" name="payoutSchedule" checked={payoutSchedule === 'weekly'} onChange={() => {}} className="accent-[#ff4a1f]" />
              </div>
              <p className="text-[10.5px] text-slate-500 dark:text-slate-400 font-normal leading-relaxed">
                Consolidates earnings into a single batch payout every Monday.
              </p>
            </label>

            <label 
              onClick={() => setPayoutSchedule('biweekly')}
              className={`p-3 rounded-[4px] border cursor-pointer transition-all flex flex-col justify-between gap-1.5 ${
                payoutSchedule === 'biweekly' 
                  ? 'bg-orange-50/40 dark:bg-orange-950/20 border-[#ff4a1f] ring-1 ring-[#ff4a1f]/30' 
                  : 'bg-white dark:bg-[#14181f] border-slate-200 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100">Bi-Weekly (1st & 15th)</span>
                <input type="radio" name="payoutSchedule" checked={payoutSchedule === 'biweekly'} onChange={() => {}} className="accent-[#ff4a1f]" />
              </div>
              <p className="text-[10.5px] text-slate-500 dark:text-slate-400 font-normal leading-relaxed">
                Transfers twice a month directly to your registered bank account.
              </p>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Invoicing Terms */}
      <Card className="shadow-2xs border-slate-200 dark:border-slate-800 w-full rounded-[4px] bg-white dark:bg-[#181a20]">
        <CardHeader className="py-2.5 px-3.5 sm:px-4 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-[#151921] rounded-t-[4px]">
          <CardTitle className="text-xs font-bold flex items-center gap-1.5 text-slate-900 dark:text-slate-100">
            <Building className="w-3.5 h-3.5 text-[#ff4a1f]" />
            Invoicing & Payment Terms
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3.5 sm:p-4">
          <div className="flex flex-col gap-1 w-full sm:max-w-md">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Standard Invoice Clearance Term *</label>
            <Select
              value={paymentTerms}
              onChange={(opt) => setPaymentTerms(typeof opt === 'object' ? opt.id : opt)}
              options={paymentTermsOptions}
              showSearch={false}
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Action Bar */}
      <div className="flex items-center justify-between pt-1">
        <Button
          type="submit"
          disabled={isSaving}
          className="bg-[#ff4a1f] hover:bg-[#e03e15] text-white text-xs font-bold h-8.5 px-4 rounded-[4px] cursor-pointer flex items-center gap-1.5 shadow-2xs"
        >
          {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
          <span>{isSaving ? 'Saving...' : 'Save Payout Preferences'}</span>
        </Button>

        {isSaved && (
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 animate-in fade-in">
            <CheckCircle2 className="w-3.5 h-3.5" /> Payout preferences updated successfully.
          </span>
        )}
      </div>

    </form>
  );
}
