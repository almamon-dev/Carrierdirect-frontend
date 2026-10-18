import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { apiClient } from '@/lib/axios';
import { TOKEN_CONFIG } from '@/config/auth';
import { WithdrawalItem, StripeRedirectTarget } from '../types/withdrawal.types';
import { parseMoneyNumber, mapWithdrawalItems } from '../utils/withdrawalUtils';

export function useSupplierWithdrawalData() {
    const [searchParams] = useSearchParams();
    const [loading, setLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [redirectingTarget, setRedirectingTarget] = useState<StripeRedirectTarget>(null);
    const [stats, setStats] = useState({
        totalEarnings: 0,
        escrowBalance: 0,
        availableBalance: 0,
        totalWithdrawn: 0,
        isStripeConnected: false,
    });
    const [stripeAccountData, setStripeAccountData] = useState<any>(null);
    const [withdrawals, setWithdrawals] = useState<WithdrawalItem[]>([]);
    const [isDevTesting, setIsDevTesting] = useState(false);
    const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string; link?: string } | null>(null);

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

    const fetchFinanceData = async (isManualRefresh = false) => {
        if (isManualRefresh) setIsRefreshing(true);
        else setLoading(true);

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
                    totalEarnings: parseMoneyNumber(data.total_earnings ?? s.total_earnings),
                    escrowBalance: parseMoneyNumber(data.escrow_balance ?? s.escrow_balance ?? s.pending_clearance),
                    availableBalance: parseMoneyNumber(data.available_balance ?? s.available_balance),
                    totalWithdrawn: parseMoneyNumber(data.total_withdrawn ?? s.total_withdrawn),
                    isStripeConnected: Boolean(s.is_stripe_connected ?? data.is_stripe_connected),
                });

                const rawWithdrawals = Array.isArray(data.withdraw_requests)
                    ? data.withdraw_requests
                    : (Array.isArray(data.withdrawals) ? data.withdrawals : []);

                setWithdrawals(rawWithdrawals.length > 0 ? mapWithdrawalItems(rawWithdrawals) : []);
            }

            if (stripeRes.status === 'fulfilled') {
                const rawStripe: any = stripeRes.value;
                const stripeData = rawStripe?.data?.data || rawStripe?.data || rawStripe || {};
                setStripeAccountData(stripeData);
                const isConn = Boolean(
                    (stripeData.onboarding_status === 'completed' && (stripeData.charges_enabled || stripeData.payouts_enabled)) ||
                    stripeData.is_connected || stripeData.is_stripe_connected ||
                    stripeData.account_id || stripeData.stripe_account?.stripe_account_id
                );
                if (isConn) {
                    setStats(prev => ({ ...prev, isStripeConnected: true }));
                }

                try {
                    const rawUser = localStorage.getItem(TOKEN_CONFIG.userKey);
                    if (rawUser) {
                        const u = JSON.parse(rawUser);
                        u.is_stripe_connected = isConn;
                        if (stripeData.account_id || stripeData.stripe_account?.stripe_account_id) {
                            u.stripe_account_id = stripeData.account_id || stripeData.stripe_account?.stripe_account_id;
                        }
                        localStorage.setItem(TOKEN_CONFIG.userKey, JSON.stringify(u));
                    }
                } catch (e) {}
            }
        } catch (err) {
            console.error('Error fetching supplier finance data:', err);
        } finally {
            setLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchFinanceData();
    }, []);

    const handleRedirectToStripeOnboarding = async (target: StripeRedirectTarget, isDashboard = false) => {
        setRedirectingTarget(target);
        setNotification(null);
        try {
            const res: any = await apiClient.post('/supplier/stripe/connect', { dashboard: isDashboard });
            const url = res?.url || res?.data?.url || res?.data?.data?.url;
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
                    message: 'Stripe Onboarding opened. If not redirected automatically, click here:',
                    link: url,
                });
            } else {
                setNotification({ type: 'error', message: res?.message || res?.data?.message || 'Failed to generate Stripe onboarding link.' });
            }
        } catch (err: any) {
            setNotification({ type: 'error', message: err?.data?.message || err?.response?.data?.message || err?.message || 'Failed to connect to Stripe API.' });
        } finally {
            setRedirectingTarget(null);
        }
    };

    const handleTestConnect = async () => {
        setIsDevTesting(true);
        setNotification(null);
        try {
            await apiClient.post('/supplier/stripe/test-connect');
            setNotification({ type: 'success', message: '⚡ Test Stripe Account connected and stored in database!' });
            fetchFinanceData(true);
        } catch (err: any) {
            setNotification({ type: 'error', message: err?.data?.message || err?.message || 'Failed test connect.' });
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
            try {
                const rawUser = localStorage.getItem(TOKEN_CONFIG.userKey);
                if (rawUser) {
                    const u = JSON.parse(rawUser);
                    u.is_stripe_connected = false;
                    delete u.stripe_account_id;
                    localStorage.setItem(TOKEN_CONFIG.userKey, JSON.stringify(u));
                }
            } catch (e) {}
            setStats(prev => ({ ...prev, isStripeConnected: false }));
            setStripeAccountData(null);
            fetchFinanceData(true);
        } catch (err: any) {
            setNotification({ type: 'error', message: err?.data?.message || err?.message || 'Failed test reset.' });
        } finally {
            setIsDevTesting(false);
        }
    };

    const isStripeConnected = Boolean(
        stats.isStripeConnected ||
        (stripeAccountData?.onboarding_status === 'completed' && (stripeAccountData?.payouts_enabled || stripeAccountData?.charges_enabled)) ||
        stripeAccountData?.is_connected || stripeAccountData?.is_stripe_connected ||
        stripeAccountData?.account_id || stripeAccountData?.stripe_account?.stripe_account_id
    );

    return {
        loading,
        isRefreshing,
        redirectingTarget,
        stats,
        stripeAccountData,
        withdrawals,
        isDevTesting,
        notification,
        setNotification,
        isStripeConnected,
        fetchFinanceData,
        handleRedirectToStripeOnboarding,
        handleTestConnect,
        handleTestReset,
    };
}
