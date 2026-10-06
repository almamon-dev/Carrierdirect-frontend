import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "@/lib/axios";

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

export interface LockModalConfig {
    title: string;
    description: string;
    featureName: string;
    requiredPlan: string;
    benefits: string[];
}

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

    /**
     * Check if user is allowed to create standard single quote requests.
     */
    const checkOrLock = useCallback((onAllowed?: () => void) => {
        if (!canCreateQuote || isExpired || isTrialLimitReached) {
            setCustomModalConfig(null);
            setIsLockModalOpen(true);
            return false;
        }
        if (onAllowed) {
            onAllowed();
        }
        return true;
    }, [canCreateQuote, isExpired, isTrialLimitReached]);

    /**
     * Check if user is allowed to perform bulk CSV/PDF upload.
     * Blocked for Free Trial and Starter plans; requires Growth Logistics or Enterprise.
     */
    const checkBulkImportOrLock = useCallback((onAllowed?: () => void) => {
        if (isTrial || isExpired || !canUseBulkImport) {
            setCustomModalConfig({
                title: isTrial ? "Bulk RFQ & AI Import Not Available on Free Trial" : "Growth Logistics Plan Required",
                description: isTrial 
                    ? "Bulk CSV/PDF Upload and AI Document Extraction are exclusively available on Growth Logistics and Enterprise plans. Please upgrade to unlock."
                    : "AI Bulk Import & Document Extraction require Growth Logistics (€79/mo) or Enterprise plans. Please upgrade your plan.",
                featureName: "Bulk RFQ & AI Document Extraction",
                requiredPlan: "Growth Logistics (€79/mo)",
                benefits: [
                    "Bulk CSV & Excel Manifest Batch Uploads",
                    "Automated AI PDF & Invoice Document Extraction",
                    "Unlimited RFQ Postings & Marketplace Broadcast",
                    "Dedicated Account Manager & Priority Support",
                    "Net 30/60 Days Corporate Pay-Later Credit Line"
                ]
            });
            setIsLockModalOpen(true);
            return false;
        }
        if (onAllowed) {
            onAllowed();
        }
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
    const modalBenefits = customModalConfig?.benefits || [
        "Unlimited Single Quote Requests & RFQs",
        "Multi-Carrier Quote Comparison & Price Breakdown",
        "Direct Carrier Live Chat & Negotiation",
        "Real-time Order Tracking & Digital POD (Challan)",
        "Secure Stripe Escrow Payments & Card Checkout"
    ];

    const handleUpgradeRedirect = useCallback(() => {
        setIsLockModalOpen(false);
        navigate("/customer/subscription");
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
        canUseBulkImport,
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
        handleUpgradeRedirect,
        refreshStatus: fetchStatus,
    };
}
