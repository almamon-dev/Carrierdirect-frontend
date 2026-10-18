import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "@/lib/axios";
import {
    SubscriptionStatusData,
    LockModalConfig,
    DEFAULT_QUOTA_BENEFITS,
    PAY_LATER_BENEFITS,
    BULK_IMPORT_BENEFITS
} from "./subscriptionQuotaTypes";

export type { SubscriptionStatusData, LockModalConfig };

export function useSubscriptionQuota() {
    const navigate = useNavigate();
    const [status, setStatus] = useState<SubscriptionStatusData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isLockModalOpen, setIsLockModalOpen] = useState(false);
    const [customModalConfig, setCustomModalConfig] = useState<LockModalConfig | null>(null);

    const fetchStatus = useCallback(async () => {
        try {
            setIsLoading(true);
            const res: any = await apiClient.get("/subscription/status", { silent: true });
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
    const isExpired = status?.status === "expired" || (status && !status.is_active && status.has_subscription);
    const quotesLimit = isTrial ? (status?.quotes_limit ?? 3) : null;
    const quotesUsed = status?.quotes_used ?? 0;
    const isTrialLimitReached = isTrial && quotesUsed >= (quotesLimit ?? 3);
    const canCreateQuote = status ? (status.can_create_quote ?? (!isExpired && !isTrialLimitReached)) : true;
    const isPaidUnlimited = status?.is_active && !isTrial;
    const canUseBulkImport = Boolean(status?.can_use_bulk_import && !isTrial);
    const canUsePayLater = Boolean(status?.can_use_pay_later);

    const checkOrLock = useCallback((onAllowed?: () => void) => {
        if (!canCreateQuote || isExpired || isTrialLimitReached) {
            setCustomModalConfig(null);
            setIsLockModalOpen(true);
            return false;
        }
        if (onAllowed) onAllowed();
        return true;
    }, [canCreateQuote, isExpired, isTrialLimitReached]);

    const checkPayLaterOrLock = useCallback((onAllowed?: () => void) => {
        if (!canUsePayLater) {
            setCustomModalConfig({
                title: isTrial ? 'Corporate Pay-Later Not Available on Free Trial' : 'Growth Logistics Plan Required',
                description: isTrial
                    ? 'Corporate Pay-Later Credit Line (Net 30/60 Days) is exclusively available on Growth Logistics and Enterprise plans. Please upgrade your plan to unlock.'
                    : (status?.pay_later_restriction_message || 'Corporate Pay-Later Credit Line requires Growth Logistics (€79/mo) or Enterprise plans. Please upgrade your plan to activate Net-30 credit terms.'),
                featureName: 'Corporate Pay-Later (Net-30 Credit Line)',
                requiredPlan: status?.pay_later_required_plan || 'Growth Logistics (€79/mo)',
                benefits: PAY_LATER_BENEFITS
            });
            setIsLockModalOpen(true);
            return false;
        }
        if (onAllowed) onAllowed();
        return true;
    }, [canUsePayLater, isTrial, status]);

    const checkBulkImportOrLock = useCallback((onAllowed?: () => void) => {
        if (isTrial || isExpired || !canUseBulkImport) {
            setCustomModalConfig({
                title: isTrial ? "Bulk RFQ & AI Import Not Available on Free Trial" : "Growth Logistics Plan Required",
                description: isTrial
                    ? "Bulk CSV/PDF Upload and AI Document Extraction are exclusively available on Growth Logistics and Enterprise plans. Please upgrade to unlock."
                    : "AI Bulk Import & Document Extraction require Growth Logistics (€79/mo) or Enterprise plans. Please upgrade your plan.",
                featureName: "Bulk RFQ & AI Document Extraction",
                requiredPlan: "Growth Logistics (€79/mo)",
                benefits: BULK_IMPORT_BENEFITS
            });
            setIsLockModalOpen(true);
            return false;
        }
        if (onAllowed) onAllowed();
        return true;
    }, [isTrial, isExpired, canUseBulkImport]);

    const defaultTitle = isExpired
        ? "7-Day Free Trial Expired"
        : (isTrialLimitReached ? "Free Trial Limit Reached (3 Quotes Max)" : "Subscription Upgrade Required");

    const defaultDescription = isExpired
        ? "Your 7-day free trial period has ended. Please upgrade your subscription plan to continue creating quote requests."
        : (isTrialLimitReached
            ? "You have reached your Free Trial limit of 3 quote requests. Please upgrade to a paid plan for unlimited quote requests."
            : (status?.quote_restriction_message || "This feature requires an active subscription plan to post RFQs."));

    const modalTitle = customModalConfig?.title || defaultTitle;
    const modalDescription = customModalConfig?.description || defaultDescription;
    const modalFeatureName = customModalConfig?.featureName || "Quote Request Quota";
    const modalRequiredPlan = customModalConfig?.requiredPlan || "Starter Shipper (€29/mo)";
    const modalBenefits = customModalConfig?.benefits || DEFAULT_QUOTA_BENEFITS;

    const handleUpgradeRedirect = useCallback((targetPlan?: string) => {
        setIsLockModalOpen(false);
        const planToUse = targetPlan || customModalConfig?.requiredPlan || modalRequiredPlan || '';
        const planLower = planToUse.toLowerCase();

        let planParam = '';
        if (planLower.includes('growth')) {
            planParam = '?plan=growth';
        } else if (planLower.includes('starter')) {
            planParam = '?plan=starter';
        } else if (planLower.includes('enterprise')) {
            planParam = '?plan=enterprise';
        }

        navigate(`/customer/subscription/checkout${planParam}`);
    }, [customModalConfig, modalRequiredPlan, navigate]);

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
        canUseBulkImport,
        canUsePayLater,
        isTrialLimitReached,
        isPaidUnlimited,
        isLockModalOpen,
        setIsLockModalOpen,
        modalTitle,
        modalDescription,
        modalFeatureName,
        modalRequiredPlan,
        modalBenefits,
        checkOrLock,
        checkBulkImportOrLock,
        checkPayLaterOrLock,
        handleUpgradeRedirect,
        refreshStatus: fetchStatus,
    };
}
