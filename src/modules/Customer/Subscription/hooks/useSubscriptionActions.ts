import { useNavigate } from "react-router-dom";
import apiClient from "@/lib/axios";
import { useToastStore } from "@/stores/useToastStore";
import { CustomerPlanItem, InvoiceItem, SavedCard } from "../types";

interface UseSubscriptionActionsProps {
  billingCycle: "monthly" | "yearly";
  loadData: () => Promise<void>;
  setActiveTab: (tab: any) => void;
  setPaymentCards: React.Dispatch<React.SetStateAction<SavedCard[]>>;
  setIsUpgradingPlanId: (id: string | null) => void;
  setDownloadingId: (id: string | null) => void;
  setIsCanceling: (val: boolean) => void;
  setIsCancelModalOpen: (val: boolean) => void;
  setCancelConfirmationText: (val: string) => void;
  cancelConfirmationText: string;
}

export function useSubscriptionActions({
  billingCycle,
  loadData,
  setActiveTab,
  setPaymentCards,
  setIsUpgradingPlanId,
  setDownloadingId,
  setIsCanceling,
  setIsCancelModalOpen,
  setCancelConfirmationText,
  cancelConfirmationText,
}: UseSubscriptionActionsProps) {
  const navigate = useNavigate();
  const { showToast } = useToastStore();

  const handleSelectPlan = async (plan: CustomerPlanItem) => {
    const planKey = plan?.planId;
    const planName = plan?.name;
    const monthlyPrice = plan?.monthlyPrice || 0;
    const yearlyPrice = plan?.yearlyPrice || monthlyPrice * 10;
    const chosenCycle = billingCycle;

    if (plan.isTrial) {
      setIsUpgradingPlanId(String(planKey));
      try {
        const res: any = await apiClient.post("/subscription/checkout-link", {
          plan_id: planKey,
          billing_cycle: "trial",
        });
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
    try {
      const res: any = await apiClient.post("/subscription/checkout-link", {
        plan_id: planKey,
        billing_cycle: chosenCycle,
      });
      const url = res?.checkout_url || res?.data?.checkout_url || res?.data?.data?.checkout_url;
      if (res?.data?.status === "active" && !url) {
        showToast(res?.data?.message || "Subscription activated successfully!", "success");
        loadData();
        setActiveTab("overview");
        return;
      }
      const targetUrl = url && url.startsWith("/") ? url : `/customer/subscription/checkout?plan=${planKey}&cycle=${chosenCycle}`;
      navigate(targetUrl, {
        state: {
          plan: {
            id: planKey,
            name: planName,
            priceMonthly: monthlyPrice,
            priceYearly: yearlyPrice,
            cycle: chosenCycle,
            features: plan.features || [],
          },
          billingCycle: chosenCycle,
        },
      });
    } catch {
      navigate(`/customer/subscription/checkout?plan=${planKey}&cycle=${chosenCycle}`, {
        state: {
          plan: {
            id: planKey,
            name: planName,
            priceMonthly: monthlyPrice,
            priceYearly: yearlyPrice,
            cycle: chosenCycle,
            features: plan.features || [],
          },
          billingCycle: chosenCycle,
        },
      });
    } finally {
      setIsUpgradingPlanId(null);
    }
  };

  const handleSetDefaultCard = async (cardId: string) => {
    setPaymentCards((prev) => prev.map((c) => ({ ...c, isDefault: c.id === cardId })));
    try {
      await apiClient.post(`/subscription/payment-methods/${cardId}/primary`);
      showToast("Payment card marked as default", "success");
    } catch (err) {
      console.error("Failed to set primary card:", err);
    }
  };

  const handleDeleteCard = async (cardId: string) => {
    setPaymentCards((prev) => {
      const next = prev.filter((c) => c.id !== cardId);
      if (next.length > 0 && !next.some((c) => c.isDefault)) next[0].isDefault = true;
      return next;
    });
    try {
      await apiClient.delete(`/subscription/payment-methods/${cardId}`);
      showToast("Payment card removed", "info");
    } catch (err) {
      console.error("Failed to delete card:", err);
    }
  };

  const handleCancelSubscription = async () => {
    if (cancelConfirmationText.trim().toUpperCase() !== "CANCEL") {
      showToast('Please type "CANCEL" to confirm cancellation.', "error");
      return;
    }
    setIsCanceling(true);
    try {
      await apiClient.post("/subscription/cancel");
      showToast("Subscription cancelled. Active until end of billing cycle.", "info");
      setIsCancelModalOpen(false);
      setCancelConfirmationText("");
      loadData();
    } catch {
      showToast("Subscription cancellation request recorded.", "info");
      setIsCancelModalOpen(false);
      setCancelConfirmationText("");
    } finally {
      setIsCanceling(false);
    }
  };

  const handleDownloadReceipt = async (item: InvoiceItem) => {
    const targetId = item.rawInvoice?.id || item.rawInvoice?.invoice_number || item.id;
    setDownloadingId(item.id);
    try {
      const blob = await apiClient.getBlob(`/subscription/invoices/${targetId}/download`);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const cleanNum = String(item.id || targetId).replace(/[^a-zA-Z0-9_-]/g, "");
      a.download = `Invoice-${cleanNum}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      showToast("Invoice PDF downloaded successfully", "success");
    } catch (err) {
      console.warn("Could not download backend PDF receipt:", err);
      showToast("Failed to download invoice PDF", "error");
    } finally {
      setDownloadingId(null);
    }
  };

  return {
    handleSelectPlan,
    handleSetDefaultCard,
    handleDeleteCard,
    handleCancelSubscription,
    handleDownloadReceipt,
  };
}
