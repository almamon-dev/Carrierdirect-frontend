import { useState, useEffect } from 'react';
import apiClient from '@/lib/axios';
import { TOKEN_CONFIG } from '@/config/auth';

export function useStripeConnectCheck() {
    const [isStripeConnected, setIsStripeConnected] = useState<boolean>(() => {
        try {
            const rawUser = localStorage.getItem(TOKEN_CONFIG.userKey) || localStorage.getItem('carrierdirect_user_data') || localStorage.getItem('user') || '{}';
            const u = JSON.parse(rawUser);
            return Boolean(u.is_stripe_connected || u.stripe_account_id || u.payouts_enabled || u.is_connected || u.onboarding_status === 'completed' || u.stripe_connected);
        } catch {
            return true;
        }
    });
    const [isCheckingConnect, setIsCheckingConnect] = useState<boolean>(true);
    const [showConnectModal, setShowConnectModal] = useState<boolean>(false);

    useEffect(() => {
        const checkStatus = async () => {
            try {
                const [stripeRes, dashRes] = await Promise.allSettled([
                    apiClient.get('/supplier/stripe/status'),
                    apiClient.get('/supplier/finance/dashboard'),
                ]);

                let connected = false;

                if (stripeRes.status === 'fulfilled') {
                    const raw: any = stripeRes.value;
                    const d = raw?.data?.data || raw?.data || raw || {};
                    if (
                        d.is_connected ||
                        d.is_stripe_connected ||
                        d.onboarding_status === 'completed' ||
                        d.charges_enabled ||
                        d.payouts_enabled ||
                        d.stripe_account_id ||
                        d.account_id
                    ) {
                        connected = true;
                    }
                }

                if (!connected && dashRes.status === 'fulfilled') {
                    const rawDash: any = dashRes.value;
                    const dDash = rawDash?.data?.data || rawDash?.data || rawDash || {};
                    const stats = dDash.stats || {};
                    if (stats.is_stripe_connected || stats.is_connected) {
                        connected = true;
                    }
                }

                if (!connected) {
                    try {
                        const rawUser = localStorage.getItem(TOKEN_CONFIG.userKey) || localStorage.getItem('carrierdirect_user_data') || localStorage.getItem('user') || '{}';
                        const u = JSON.parse(rawUser);
                        if (u.is_stripe_connected || u.stripe_account_id || u.payouts_enabled || u.is_connected || u.stripe_connected) {
                            connected = true;
                        }
                    } catch {}
                }

                setIsStripeConnected(connected);
            } catch {
                try {
                    const rawUser = localStorage.getItem(TOKEN_CONFIG.userKey) || localStorage.getItem('carrierdirect_user_data') || localStorage.getItem('user') || '{}';
                    const u = JSON.parse(rawUser);
                    setIsStripeConnected(Boolean(u.is_stripe_connected || u.stripe_account_id || u.payouts_enabled || u.is_connected));
                } catch {
                    setIsStripeConnected(true);
                }
            } finally {
                setIsCheckingConnect(false);
            }
        };
        checkStatus();
    }, []);

    return {
        isStripeConnected,
        setIsStripeConnected,
        isCheckingConnect,
        showConnectModal,
        setShowConnectModal,
    };
}
