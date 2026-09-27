import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '@/lib/axios';

export interface SubscriptionStatusData {
    has_subscription: boolean;
    id?: number;
    status: string;
    is_active: boolean;
    is_trial: boolean;
    started_at?: string;
    expires_at?: string;
    days_remaining?: number;
    plan_name?: string;
    plan_id?: number;
    billing_period?: string;
    price?: number;
    quotes_used?: number;
    quotes_limit?: number | null;
    quotes_remaining?: number | null;
    can_create_quote?: boolean;
    quote_restriction_reason?: string | null;
    quote_restriction_message?: string | null;
    can_use_bulk_import?: boolean;
    can_use_pay_later?: boolean;
}

export function useSubscriptionQuota() {
    const navigate = useNavigate();
    const [status, setStatus] = useState<SubscriptionStatusData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isLockModalOpen, setIsLockModalOpen] = useState(false);

    const fetchStatus = useCallback(async () => {
        try {
            setIsLoading(true);
            const res: any = await apiClient.get('/subscription/status', { silent: true });
            const data = res?.data?.data || res?.data || res;
            if (data) {
                setStatus(data);
                return data;
            }
        } catch {
            // ignore
        } finally {
            setIsLoading(false);
        }
        return null;
    }, []);

    useEffect(() => {
        fetchStatus();
    }, [fetchStatus]);

    const isTrial = Boolean(status?.is_trial);
    const isExpired = status?.status === 'expired' || (status && !status.is_active && status.has_subscription);
    const quotesLimit = isTrial ? (status?.quotes_limit ?? 3) : null;
    const quotesUsed = status?.quotes_used ?? 0;
    const isTrialLimitReached = isTrial && quotesUsed >= (quotesLimit ?? 3);
    const canCreateQuote = status ? (status.can_create_quote ?? (!isExpired && !isTrialLimitReached)) : true;
    const isPaidUnlimited = status?.is_active && !isTrial;

    /**
     * Check if user is allowed to perform action (e.g. create quote, import).
     * If not allowed, opens the SubscriptionLockModal and returns false.
     * If allowed, executes callback and returns true.
     */
    const checkOrLock = useCallback((onAllowed?: () => void) => {
        if (!canCreateQuote || isExpired || isTrialLimitReached) {
            setIsLockModalOpen(true);
            return false;
        }
        if (onAllowed) {
            onAllowed();
        }
        return true;
    }, [canCreateQuote, isExpired, isTrialLimitReached]);

    const modalTitle = isExpired 
        ? "7-Day Free Trial Expired" 
        : (isTrialLimitReached ? "Free Trial Limit Reached (3 Quotes Max)" : "Subscription Upgrade Required");

    const modalDescription = isExpired
        ? "Your 7-day free trial period has ended. Please upgrade your subscription plan to continue creating quote requests."
        : (isTrialLimitReached 
            ? "You have reached your Free Trial limit of 3 quote requests. Please upgrade to a paid plan for unlimited quote requests."
            : (status?.quote_restriction_message || "This feature requires an active subscription plan to post RFQs."));

    const handleUpgradeRedirect = useCallback(() => {
        setIsLockModalOpen(false);
        navigate('/customer/subscription');
    }, [navigate]);

    return {
        status,
        isLoading,
        isTrial,
        isExpired,
        daysRemaining: status?.days_remaining ?? 0,
        quotesLimit: quotesLimit ?? 3,
        quotesUsed,
        quotesRemaining: status?.quotes_remaining ?? (isTrial ? Math.max(0, 3 - quotesUsed) : null),
        canCreateQuote,
        isTrialLimitReached,
        isPaidUnlimited,
        isLockModalOpen,
        setIsLockModalOpen,
        modalTitle,
        modalDescription,
        checkOrLock,
        handleUpgradeRedirect,
        refreshStatus: fetchStatus,
    };
}
