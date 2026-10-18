import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/axios';
import { TOKEN_CONFIG } from '@/config/auth';
import { useToastStore } from '@/stores/useToastStore';

export function usePayoutStripeState() {
  const [stripeStatus, setStripeStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDevTesting, setIsDevTesting] = useState(false);
  const [payoutSchedule, setPayoutSchedule] = useState('weekly');
  const [fundReleaseDays, setFundReleaseDays] = useState<number>(3);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string; link?: string } | null>(null);

  const fetchStatus = async (isManualRefresh = false) => {
    if (isManualRefresh) setIsRefreshing(true);
    try {
      const res: any = await apiClient.get('/supplier/stripe/status');
      const data = res?.data?.data || res?.data || res || {};
      setStripeStatus(data);
      if (data.payout_schedule) setPayoutSchedule(data.payout_schedule);
      if (data.fund_release_days !== undefined) setFundReleaseDays(Number(data.fund_release_days));

      try {
        const rawUser = localStorage.getItem(TOKEN_CONFIG.userKey);
        if (rawUser) {
          const u = JSON.parse(rawUser);
          u.is_stripe_connected = Boolean(
            (data.onboarding_status === 'completed' && (data.payouts_enabled || data.charges_enabled)) ||
            data.is_connected || data.is_stripe_connected || data.account_id || data.stripe_account?.stripe_account_id
          );
          if (data.account_id || data.stripe_account?.stripe_account_id) {
            u.stripe_account_id = data.account_id || data.stripe_account?.stripe_account_id;
          }
          localStorage.setItem(TOKEN_CONFIG.userKey, JSON.stringify(u));
        }
      } catch {}
    } catch (e) {
      console.error('Error fetching stripe status', e);
    } finally {
      setLoading(false);
      if (isManualRefresh) setTimeout(() => setIsRefreshing(false), 300);
    }
  };

  useEffect(() => {
    fetchStatus();
    try {
      const rawUser = localStorage.getItem(TOKEN_CONFIG.userKey);
      if (rawUser) {
        const u = JSON.parse(rawUser);
        if (u.payout_schedule) setPayoutSchedule(u.payout_schedule);
      }
    } catch {}
  }, []);

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
      } catch { }
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
        fund_release_days: Number(fundReleaseDays),
      };

      await apiClient.post('/supplier/stripe/payout-settings', payload);

      const rawUser = localStorage.getItem(TOKEN_CONFIG.userKey);
      if (rawUser) {
        const u = JSON.parse(rawUser);
        localStorage.setItem(TOKEN_CONFIG.userKey, JSON.stringify({ ...u, ...payload }));
      }

      window.dispatchEvent(new Event('user-profile-updated'));
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

  return {
    stripeStatus,
    loading,
    isRefreshing,
    isConnecting,
    isDevTesting,
    payoutSchedule,
    setPayoutSchedule,
    fundReleaseDays,
    setFundReleaseDays,
    isSaved,
    isSaving,
    notification,
    setNotification,
    isVerified,
    accountId,
    fetchStatus,
    handleStripeConnect,
    handleTestConnect,
    handleTestReset,
    handleSave,
  };
}
