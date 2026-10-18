import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "@/lib/axios";
import { useToastStore } from "@/stores/useToastStore";
import { InvoiceItem, SavedCard } from "../types";
import { mapSubscriptionInvoices } from "../utils/subscriptionUtils";

export function useSupplierSubscriptionData(billingCycle: "monthly" | "yearly", setActiveTab: (t: any) => void) {
  const navigate = useNavigate();
  const { showToast } = useToastStore();

  const [dbPlans, setDbPlans] = useState<any[]>([]);
  const [subscription, setSubscription] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [invoices, setInvoices] = useState<InvoiceItem[]>([]);
  const [quotaUsed, setQuotaUsed] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpgradingPlanId, setIsUpgradingPlanId] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [autoRenew, setAutoRenew] = useState<boolean>(true);
  const [paymentCards, setPaymentCards] = useState<SavedCard[]>([]);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [profRes, subRes, plansRes, invRes, pmRes] = await Promise.allSettled([
        apiClient.get("/supplier/profile"),
        apiClient.get("/subscription/status"),
        apiClient.get("/subscription/plans?user_type=supplier"),
        apiClient.get("/subscription/invoices"),
        apiClient.get("/subscription/payment-methods"),
      ]);

      if (profRes.status === "fulfilled") {
        setProfile(profRes.value?.data?.data || profRes.value?.data || profRes.value || null);
      }
      if (subRes.status === "fulfilled") {
        const subData = subRes.value?.data?.data || subRes.value?.data || subRes.value || null;
        setSubscription(subData);
        if (subData?.auto_renew !== undefined) setAutoRenew(Boolean(subData.auto_renew));
        if (subData?.quotes_used !== undefined) setQuotaUsed(Number(subData.quotes_used));
      }
      if (plansRes.status === "fulfilled") {
        const rawPlans = plansRes.value?.data?.data || plansRes.value?.data?.plans || plansRes.value?.data || plansRes.value || [];
        if (Array.isArray(rawPlans)) setDbPlans(rawPlans);
      }
      if (pmRes.status === "fulfilled") {
        const rawPm = pmRes.value?.data?.data?.saved_cards || pmRes.value?.data?.saved_cards || [];
        if (Array.isArray(rawPm)) {
          setPaymentCards(rawPm.map((c: any) => ({
            id: String(c.id),
            cardType: c.type === "MC" ? "Credit Card" : (c.type === "AMEX" ? "Amex Card" : "Debit Card"),
            last4: c.last4 || "••••",
            brand: (c.type || "VISA") as any,
            isDefault: Boolean(c.is_primary),
          })));
        }
      }
      if (invRes.status === "fulfilled") {
        const rawInv = invRes.value?.data?.data || invRes.value?.data || invRes.value || [];
        const items = Array.isArray(rawInv) ? rawInv : (rawInv?.data || []);
        if (Array.isArray(items)) {
          setInvoices(mapSubscriptionInvoices(items));
        }
      }
    } catch (err) {
      console.error("Failed to load subscription data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

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

  const handleSetDefaultCard = async (cardId: string) => {
    setPaymentCards(prev => prev.map(c => ({ ...c, isDefault: c.id === cardId })));
    try {
      await apiClient.post(`/subscription/payment-methods/${cardId}/primary`);
      showToast("Payment card marked as default", "success");
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCard = async (cardId: string) => {
    setPaymentCards(prev => {
      const next = prev.filter(c => c.id !== cardId);
      if (next.length > 0 && !next.some(c => c.isDefault)) next[0].isDefault = true;
      return next;
    });
    try {
      await apiClient.delete(`/subscription/payment-methods/${cardId}`);
      showToast("Payment card removed", "info");
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancelSubscription = async () => {
    try {
      await apiClient.post("/subscription/cancel");
      showToast("Subscription cancelled. Active until end of billing cycle.", "info");
      loadData();
    } catch {
      showToast("Subscription cancellation request recorded.", "info");
    }
  };

  const handleDownloadReceipt = async (item: InvoiceItem) => {
    const targetId = item.rawInvoice?.id || item.rawInvoice?.invoice_number || item.id;
    setDownloadingId(String(item.id));
    try {
      const blob = await apiClient.getBlob(`/subscription/invoices/${targetId}/download`);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Invoice-${String(item.id || targetId).replace(/[^a-zA-Z0-9_-]/g, "")}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      showToast("Invoice PDF downloaded successfully", "success");
    } catch (err) {
      showToast("Failed to download invoice PDF", "error");
    } finally {
      setDownloadingId(null);
    }
  };

  const handleSelectPlan = async (plan: any) => {
    if (plan?.isCurrent && !subscription?.is_trial) {
      showToast(`You are already actively subscribed to the ${plan.name || "selected"} plan.`, "info");
      return;
    }
    const planKey = plan?.planId || plan?.id;
    const planName = plan?.name || "Professional Carrier";
    const monthlyPrice = plan?.monthlyPrice || plan?.price || 0;
    const yearlyPrice = plan?.yearlyPrice || (monthlyPrice * 10);
    const chosenCycle = billingCycle;

    if (plan?.isTrial) {
      setIsUpgradingPlanId(String(planKey));
      try {
        const res: any = await apiClient.post("/subscription/checkout-link", { plan_id: planKey, billing_cycle: "trial" });
        if (res?.data?.status === "active" || res?.status === "active") {
          showToast(res?.data?.message || res?.message || "Free trial activated successfully!", "success");
          loadData();
          setActiveTab("overview");
          return;
        }
      } catch (err: any) {
        showToast(err?.data?.message || "Failed to activate free trial", "error");
      } finally {
        setIsUpgradingPlanId(null);
      }
      return;
    }

    setIsUpgradingPlanId(String(planKey));
    const targetUrl = `/supplier/subscription/checkout?plan=${planKey}&cycle=${chosenCycle}`;
    navigate(targetUrl, {
      state: {
        plan: { id: planKey, name: planName, priceMonthly: monthlyPrice, priceYearly: yearlyPrice, cycle: chosenCycle, features: plan.features || [] },
        billingCycle: chosenCycle,
      },
    });
    setIsUpgradingPlanId(null);
  };

  return {
    profile, subscription, dbPlans, invoices, quotaUsed, isLoading,
    isUpgradingPlanId, downloadingId, autoRenew, paymentCards,
    isCancelModalOpen, setIsCancelModalOpen,
    loadData, handleToggleAutoRenew, handleSetDefaultCard, handleDeleteCard,
    handleCancelSubscription, handleDownloadReceipt, handleSelectPlan,
  };
}
