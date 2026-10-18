import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "@/lib/axios";
import { useToastStore } from "@/stores/useToastStore";
import { useCheckoutPlan } from "./useCheckoutPlan";
import { useCheckoutCardForm } from "./useCheckoutCardForm";
import { useCheckoutOperations } from "./useCheckoutOperations";
import { fetchCustomerCheckoutPlan } from "../utils/checkoutPlanFetcher";

export function useCheckoutState() {
  const navigate = useNavigate();
  const showToast = useToastStore((state) => state.showToast);

  const planState = useCheckoutPlan();
  const [paymentTab, setPaymentTab] = useState<"saved_card" | "new_card">("saved_card");
  const cardForm = useCheckoutCardForm(paymentTab);

  const [savedCards, setSavedCards] = useState<any[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [activeCardMenuId, setActiveCardMenuId] = useState<string | null>(null);
  const [isLoadingCards, setIsLoadingCards] = useState(true);

  const [isProcessing, setIsProcessing] = useState(false);
  const [isAddCardModalOpen, setIsAddCardModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successData, setSuccessData] = useState<any>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isDownloadingInvoice, setIsDownloadingInvoice] = useState(false);

  const loadSavedCards = useCallback(async () => {
    setIsLoadingCards(true);
    try {
      const res: any = await apiClient.get("/subscription/payment-methods");
      const cards = res?.data?.saved_cards || res?.data?.data?.saved_cards || [];
      setSavedCards(cards);

      if (cards.length > 0) {
        const primary = cards.find((c: any) => c.is_primary) || cards[0];
        setSelectedCardId(String(primary.id));
        setPaymentTab("saved_card");
      } else {
        setPaymentTab("new_card");
      }
    } catch {
      setPaymentTab("new_card");
    } finally {
      setIsLoadingCards(false);
    }
  }, []);

  const resolvePlanDetails = useCallback(async () => {
    const targetKey = planState.queryPlanId || planState.planFromState?.id;
    const plan = await fetchCustomerCheckoutPlan(targetKey, planState.planFromState, planState.queryCycle);
    if (plan) planState.setSelectedPlan(plan);
    return plan;
  }, [planState]);

  useEffect(() => {
    let isMounted = true;
    const initializeCheckout = async () => {
      setIsInitialLoading(true);
      try {
        const [, statusData, planData] = await Promise.all([
          loadSavedCards().catch(() => null),
          apiClient.get("/subscription/status").then((r) => r?.data?.data || r?.data || {}).catch(() => null),
          resolvePlanDetails(),
        ]);

        if (statusData && isMounted) {
          planState.setCurrentSub(statusData);
          const isPaidActive = Boolean(statusData?.has_subscription && statusData?.is_active && !statusData?.is_trial);
          if (isPaidActive) {
            const currentName = planState.normalizePlanName(statusData?.plan_name || "");
            const targetName = planState.normalizePlanName(planData?.name || planState.selectedPlan?.name || "");
            const currentId = String(statusData?.plan_id || "");
            const targetId = String(planState.queryPlanId || planState.planFromState?.id || planData?.id || "");

            if ((currentId && targetId && currentId === targetId) || (currentName && targetName && currentName === targetName)) {
              showToast(`You are already actively subscribed to the ${statusData?.plan_name || planState.selectedPlan?.name} plan.`, "info");
              navigate("/customer/subscription", { replace: true });
              return;
            }
          }
        }
      } finally {
        if (isMounted) setIsInitialLoading(false);
      }
    };
    initializeCheckout();
    return () => { isMounted = false; };
  }, [planState.queryPlanId, planState.queryCycle]);

  const operations = useCheckoutOperations({
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
  });

  return {
    navigate,
    planState,
    paymentTab,
    setPaymentTab,
    cardForm,
    savedCards,
    selectedCardId,
    setSelectedCardId,
    activeCardMenuId,
    setActiveCardMenuId,
    isLoadingCards,
    loadSavedCards,
    isProcessing,
    isAddCardModalOpen,
    setIsAddCardModalOpen,
    isSuccessModalOpen,
    setIsSuccessModalOpen,
    successData,
    isInitialLoading,
    isDownloadingInvoice,
    handleSetPrimary: operations.handleSetPrimary,
    handleDeleteCard: operations.handleDeleteCard,
    handleCheckoutSubmit: operations.handleCheckoutSubmit,
    handleDownloadTaxInvoice: operations.handleDownloadTaxInvoice,
  };
}
