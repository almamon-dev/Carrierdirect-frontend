import { useState, useEffect, useCallback } from "react";
import apiClient from "@/lib/axios";
import { UserSubscriptionData, SubscriptionPlan, SavedCardItem } from "../types";

export const useCustomerSubscription = () => {
  const [subscription, setSubscription] = useState<UserSubscriptionData | null>(null);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [savedCards, setSavedCards] = useState<SavedCardItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const fetchSubscriptionData = useCallback(async (silent = false) => {
    if (!silent) setIsLoading(true);
    else setIsRefreshing(true);

    try {
      // 1. Fetch Subscription status & Plans
      const subRes = await apiClient.get("/customer/subscription").catch(() => null);
      if (subRes?.data?.data) {
        setSubscription(subRes.data.data.subscription || null);
        if (Array.isArray(subRes.data.data.plans)) {
          setPlans(subRes.data.data.plans);
        }
      } else {
        // Fallback to shared subscription endpoint
        const fallbackRes = await apiClient.get("/subscription/status").catch(() => null);
        if (fallbackRes?.data?.data) {
          setSubscription(fallbackRes.data.data.subscription || null);
        }
        const plansRes = await apiClient.get("/subscription/plans").catch(() => null);
        if (Array.isArray(plansRes?.data?.data)) {
          setPlans(plansRes.data.data);
        }
      }

      // 2. Fetch Payment Methods
      const pmRes = await apiClient.get("/subscription/payment-methods").catch(() => null);
      if (Array.isArray(pmRes?.data?.data?.saved_cards)) {
        setSavedCards(
          pmRes.data.data.saved_cards.map((c: any) => ({
            id: String(c.id),
            cardType: c.type || c.brand || "VISA",
            last4: c.last4 || "4242",
            brand: (c.type || c.brand || "VISA").toUpperCase(),
            isDefault: Boolean(c.is_primary || c.is_default),
          }))
        );
      }
    } catch (err) {
      console.error("Failed to load customer subscription data:", err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchSubscriptionData();
  }, [fetchSubscriptionData]);

  return {
    subscription,
    plans,
    savedCards,
    isLoading,
    isRefreshing,
    fetchSubscriptionData,
    setSubscription,
    setSavedCards,
  };
};

export default useCustomerSubscription;
