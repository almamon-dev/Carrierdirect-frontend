import { useState, useEffect } from 'react';
import apiClient from '@/lib/axios';

export function useConnectedAccountState() {
    const [account, setAccount] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isConnecting, setIsConnecting] = useState(false);
    const [isDisconnecting, setIsDisconnecting] = useState(false);
    const [copied, setCopied] = useState(false);
    const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const fetchAccountDetails = async () => {
        try {
            const res = await apiClient.get('/supplier/wallet/connected-account');
            setAccount(res.data?.data || res.data || {});
        } catch (err: any) {
            console.error('Failed to fetch connected account details:', err);
            setActionMessage({
                type: 'error',
                text: err?.response?.data?.message || err?.message || 'Failed to load Stripe account details.'
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAccountDetails();
    }, []);

    const handleCopy = () => {
        const textToCopy = account?.raw_account_id || account?.account_id;
        if (!textToCopy) return;
        navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleManageOrConnect = async () => {
        setIsConnecting(true);
        setActionMessage(null);
        try {
            const res = await apiClient.post('/supplier/wallet/stripe/link');
            const url = res.data?.data?.url || res.data?.url;
            if (url) {
                window.location.href = url;
            } else {
                throw new Error('No redirect URL received from server.');
            }
        } catch (err: any) {
            console.error('Failed to get Stripe link:', err);
            setActionMessage({
                type: 'error',
                text: err?.response?.data?.message || err?.message || 'Unable to redirect to Stripe.'
            });
            setIsConnecting(false);
        }
    };

    const handleDisconnect = async () => {
        if (!window.confirm('Are you sure you want to disconnect your Stripe account? You will not be able to withdraw via Stripe until reconnected.')) {
            return;
        }

        setIsDisconnecting(true);
        setActionMessage(null);
        try {
            await apiClient.post('/supplier/wallet/stripe/disconnect');
            setActionMessage({
                type: 'success',
                text: 'Stripe account disconnected successfully.'
            });
            await fetchAccountDetails();
        } catch (err: any) {
            console.error('Failed to disconnect Stripe account:', err);
            setActionMessage({
                type: 'error',
                text: err?.response?.data?.message || err?.message || 'Failed to disconnect account.'
            });
        } finally {
            setIsDisconnecting(false);
        }
    };

    return {
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
    };
}
