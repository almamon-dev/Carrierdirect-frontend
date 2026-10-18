import apiClient from "@/lib/axios";
import { useToastStore } from "@/stores/useToastStore";
import { getCheckoutValidationError } from "../utils/checkoutValidation";

interface UseCheckoutOperationsProps {
  planState: any;
  paymentTab: "saved_card" | "new_card";
  setPaymentTab: (tab: "saved_card" | "new_card") => void;
  cardForm: any;
  savedCards: any[];
  setSavedCards: React.Dispatch<React.SetStateAction<any[]>>;
  selectedCardId: string | null;
  setSelectedCardId: (id: string | null) => void;
  setActiveCardMenuId: (id: string | null) => void;
  setIsProcessing: (val: boolean) => void;
  setSuccessData: (data: any) => void;
  setIsSuccessModalOpen: (val: boolean) => void;
  setIsDownloadingInvoice: (val: boolean) => void;
  successData: any;
  navigate: (url: string) => void;
}

export function useCheckoutOperations({
  planState,
  paymentTab,
  setPaymentTab,
  cardForm,
  savedCards,
  setSavedCards,
  selectedCardId,
  setSelectedCardId,
  setActiveCardMenuId,
  setIsProcessing,
  setSuccessData,
  setIsSuccessModalOpen,
  setIsDownloadingInvoice,
  successData,
  navigate,
}: UseCheckoutOperationsProps) {
  const showToast = useToastStore((state) => state.showToast);

  const handleSetPrimary = async (cardId: string) => {
    setActiveCardMenuId(null);
    try {
      await apiClient.post(`/subscription/payment-methods/${cardId}/primary`);
      setSavedCards((prev) => prev.map((c) => ({ ...c, is_primary: String(c.id) === String(cardId) })));
      setSelectedCardId(cardId);
      showToast("Default card updated successfully", "success");
    } catch {
      showToast("Failed to update default card", "error");
    }
  };

  const handleDeleteCard = async (cardId: string) => {
    setActiveCardMenuId(null);
    try {
      await apiClient.delete(`/subscription/payment-methods/${cardId}`);
      setSavedCards((prev) => {
        const next = prev.filter((c) => String(c.id) !== String(cardId));
        if (selectedCardId === String(cardId)) {
          setSelectedCardId(next.length > 0 ? String(next[0].id) : null);
          if (next.length === 0) setPaymentTab("new_card");
        }
        return next;
      });
      showToast("Card removed", "info");
    } catch {
      showToast("Failed to remove card", "error");
    }
  };

  const handleCheckoutSubmit = async () => {
    if (planState.isAlreadySubscribed) {
      showToast(`You are already actively subscribed to the ${planState.selectedPlan.name} plan.`, "info");
      return;
    }
    if (paymentTab === "saved_card" && !selectedCardId && savedCards.length > 0) {
      showToast("Please select a payment card to continue.", "error");
      return;
    }
    if (paymentTab === "new_card") {
      cardForm.setIsSubmitted(true);
      const err = getCheckoutValidationError(paymentTab, cardForm.cardName, cardForm.cardNumber, cardForm.cardExpiry, cardForm.cardCvc);
      if (err) {
        showToast(err.message, "error");
        if (err.field === "cardName") cardForm.cardNameRef.current?.focus();
        else if (err.field === "cardNumber") cardForm.cardNumberRef.current?.focus();
        else if (err.field === "cardExpiry") cardForm.cardExpiryRef.current?.focus();
        else if (err.field === "cardCvc") cardForm.cardCvcRef.current?.focus();
        return;
      }
    }

    setIsProcessing(true);
    try {
      const payload: any = {
        plan_id: planState.selectedPlan.id || planState.cleanPlanId || 2,
        billing_cycle: planState.planCycle,
        payment_method_type: paymentTab,
      };
      if (paymentTab === "saved_card") {
        payload.saved_card_id = selectedCardId;
      } else {
        payload.card_name = cardForm.cardName;
        payload.card_number = cardForm.cleanCardNum;
        payload.expiry = cardForm.cardExpiry;
        payload.cvc = cardForm.cardCvc;
        payload.save_card = cardForm.saveCardForFuture;
      }

      const res: any = await apiClient.post("/subscription/process-payment", payload);
      const resData = res?.data?.data || res?.data || {};

      setSuccessData({
        plan_name: resData?.plan_name || planState.selectedPlan.name,
        invoice_number: resData?.invoice_number || "SUB-2026-9871",
        invoice_id: resData?.invoice_id || resData?.invoice?.id,
        amount_formatted: resData?.amount_formatted || `€${planState.totalAmount.toFixed(2)}`,
        payment_method: paymentTab === "saved_card" ? "Saved Card" : "New Card",
        expires_at: resData?.expires_at,
        download_url: resData?.download_url,
      });

      window.dispatchEvent(new CustomEvent("carrierdirect_notif_update"));
      showToast("Subscription activated successfully!", "success");
      setIsSuccessModalOpen(true);
    } catch (err: any) {
      console.error("Subscription payment error:", err);
      showToast(err?.response?.data?.message || err?.message || "Failed to process payment.", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadTaxInvoice = async () => {
    setIsDownloadingInvoice(true);
    const targetId = successData?.invoice_id || successData?.invoice_number;
    try {
      let blob: Blob | null = null;
      if (targetId) {
        try {
          blob = await apiClient.getBlob(`/subscription/invoices/${targetId}/download`);
        } catch {
          blob = await apiClient.getBlob(`/customer/subscription/invoices/${targetId}/download`);
        }
      }
      if (blob && blob.size > 50) {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        const num = successData?.invoice_number || targetId || "subscription-receipt";
        a.download = `Invoice-${String(num).replace(/[^a-zA-Z0-9_-]/g, "")}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
        showToast("Tax Invoice downloaded successfully!", "success");
        return;
      }
      if (successData?.download_url) {
        window.open(successData.download_url, "_blank");
        showToast("Downloading tax invoice...", "info");
        return;
      }
      navigate("/customer/subscription?tab=history");
    } catch (err) {
      console.warn("Tax invoice download failed:", err);
      navigate("/customer/subscription?tab=history");
    } finally {
      setIsDownloadingInvoice(false);
    }
  };

  return {
    handleSetPrimary,
    handleDeleteCard,
    handleCheckoutSubmit,
    handleDownloadTaxInvoice,
  };
}
