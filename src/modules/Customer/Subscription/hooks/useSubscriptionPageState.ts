import { useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import apiClient from "@/lib/axios";
import { useToastStore } from "@/stores/useToastStore";
import { TabKey, InvoiceItem, SavedCard, UserSubscriptionData } from "../types";
import { buildCustomerPlans } from "../utils/buildCustomerPlans";
import { mapRawCards, mapRawInvoices } from "../utils/subscriptionMappers";

export function useSubscriptionPageState() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { showToast } = useToastStore();

  const getNormalizedTab = (tabStr: string | null): TabKey => {
    if (!tabStr) return "overview";
    const lower = tabStr.toLowerCase();
    if (["packages", "plans", "pricing", "package"].includes(lower)) return "packages";
    if (["history", "billing", "invoices", "receipts", "billing-history"].includes(lower)) return "history";
    return "overview";
  };

  const activeTab = useMemo(() => getNormalizedTab(searchParams.get("tab")), [searchParams]);

  const setActiveTab = (tab: TabKey) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("tab", tab);
      return next;
    }, { replace: true });
  };

  const billingCycle = useMemo<"monthly" | "yearly">(() => {
    const val = (searchParams.get("cycle") || searchParams.get("billing") || "").toLowerCase();
    return ["yearly", "annual", "annually", "year"].includes(val) ? "yearly" : "monthly";
  }, [searchParams]);

  const setBillingCycle = (cycle: "monthly" | "yearly") => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("cycle", cycle);
      return next;
    }, { replace: true });
  };

  const [autoRenew, setAutoRenew] = useState<boolean>(true);
  const [dbPlans, setDbPlans] = useState<any[]>([]);
  const [subscription, setSubscription] = useState<UserSubscriptionData | null>(null);
  const [invoices, setInvoices] = useState<InvoiceItem[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [quotaUsed, setQuotaUsed] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpgradingPlanId, setIsUpgradingPlanId] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);
  const [cancelConfirmationText, setCancelConfirmationText] = useState("");
  const [paymentCards, setPaymentCards] = useState<SavedCard[]>([]);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [subRes, plansRes, invRes, pmRes] = await Promise.allSettled([
        apiClient.get("/subscription/status"),
        apiClient.get("/subscription/plans?user_type=customer"),
        apiClient.get("/subscription/invoices"),
        apiClient.get("/subscription/payment-methods"),
      ]);

      if (subRes.status === "fulfilled") {
        const subData = subRes.value?.data?.data || subRes.value?.data || null;
        setSubscription(subData);
        if (subData?.auto_renew !== undefined) setAutoRenew(Boolean(subData.auto_renew));
        if (subData?.quotes_used !== undefined) setQuotaUsed(Number(subData.quotes_used));
      }
      if (plansRes.status === "fulfilled") {
        const val = plansRes.value;
        const rawPlans = Array.isArray(val?.data)
          ? val.data
          : (Array.isArray(val?.data?.data)
            ? val.data.data
            : (Array.isArray(val?.data?.plans)
              ? val.data.plans
              : (Array.isArray(val) ? val : [])));
        if (Array.isArray(rawPlans)) setDbPlans(rawPlans);
      }
      if (pmRes.status === "fulfilled") {
        const rawPm = pmRes.value?.data?.data?.saved_cards || pmRes.value?.data?.saved_cards || [];
        setPaymentCards(mapRawCards(rawPm));
      }
      if (invRes.status === "fulfilled") {
        const rawInv = invRes.value?.data?.data || invRes.value?.data || [];
        const items = Array.isArray(rawInv) ? rawInv : (rawInv?.data || []);
        setInvoices(mapRawInvoices(items));
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const daysRemaining = useMemo(() => {
    if (subscription?.days_remaining != null) return Number(subscription.days_remaining);
    if (!subscription?.expires_at) return 0;
    try {
      const exp = new Date(subscription.expires_at).getTime();
      return Math.max(0, Math.ceil((exp - Date.now()) / (1000 * 60 * 60 * 24)));
    } catch {
      return 0;
    }
  }, [subscription]);

  const formattedExpiryDate = useMemo(() => {
    if (!subscription?.expires_at) return "—";
    try {
      return new Date(subscription.expires_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
    } catch {
      return String(subscription.expires_at);
    }
  }, [subscription?.expires_at]);

  const formattedStartDate = useMemo(() => {
    if (!subscription?.started_at && !subscription?.created_at) return null;
    try {
      return new Date(subscription.started_at || subscription.created_at!).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
    } catch {
      return null;
    }
  }, [subscription?.started_at, subscription?.created_at]);

  const plans = useMemo(() => buildCustomerPlans(dbPlans, subscription, billingCycle), [dbPlans, subscription, billingCycle]);

  const hasActiveSub = Boolean(subscription?.has_subscription && subscription?.is_active);
  const activePlanName = subscription?.plan_name || (subscription?.is_trial ? "7-Day Free Trial" : (hasActiveSub ? "Active Plan" : "No Active Plan"));
  const activePlanPrice = subscription?.is_trial
    ? "Free Trial"
    : (subscription?.price && Number(subscription.price) > 0
      ? `€${(parseFloat(String(subscription.price).replace(/[^0-9.-]/g, "")) || 0).toFixed(0)}/${subscription?.billing_period === "annual" ? "year" : "month"}`
      : (hasActiveSub ? "Active" : "—"));

  const handleToggleAutoRenew = async () => {
    const nextVal = !autoRenew;
    setAutoRenew(nextVal);
    try {
      await apiClient.post("/subscription/auto-renew", { auto_renew: nextVal });
      showToast(nextVal ? "Auto-renew enabled successfully" : "Auto-renew disabled", "success");
    } catch {
      showToast(nextVal ? "Auto-renew enabled" : "Auto-renew disabled", "success");
    }
  };

  return {
    activeTab,
    setActiveTab,
    billingCycle,
    setBillingCycle,
    autoRenew,
    handleToggleAutoRenew,
    subscription,
    invoices,
    statusFilter,
    setStatusFilter,
    quotaUsed,
    isLoading,
    isUpgradingPlanId,
    setIsUpgradingPlanId,
    downloadingId,
    setDownloadingId,
    isPaymentModalOpen,
    setIsPaymentModalOpen,
    isCancelModalOpen,
    setIsCancelModalOpen,
    isCanceling,
    setIsCanceling,
    cancelConfirmationText,
    setCancelConfirmationText,
    paymentCards,
    setPaymentCards,
    loadData,
    daysRemaining,
    formattedExpiryDate,
    formattedStartDate,
    plans,
    hasActiveSub,
    activePlanName,
    activePlanPrice,
    showToast,
  };
}
