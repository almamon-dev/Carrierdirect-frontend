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
      const subPayload = subRes?.data || subRes;
      if (subPayload?.subscription || subPayload?.plans) {
        setSubscription(subPayload.subscription || null);
        if (Array.isArray(subPayload.plans)) {
          setPlans(subPayload.plans);
        }
      } else {
        // Fallback to shared subscription endpoint
        const fallbackRes = await apiClient.get("/subscription/status").catch(() => null);
        const fbData = fallbackRes?.data || fallbackRes;
        if (fbData) {
          setSubscription(fbData.subscription || fbData || null);
        }
        const plansRes = await apiClient.get("/subscription/plans?user_type=customer").catch(() => null);
        const rawPlans = Array.isArray(plansRes?.data) ? plansRes.data : (Array.isArray(plansRes?.data?.data) ? plansRes.data.data : (Array.isArray(plansRes) ? plansRes : []));
        if (Array.isArray(rawPlans)) {
          setPlans(rawPlans);
        }
      }

      // 2. Fetch Payment Methods
      const pmRes = await apiClient.get("/subscription/payment-methods").catch(() => null);
      const pmData = pmRes?.data?.saved_cards || pmRes?.data?.data?.saved_cards || pmRes?.saved_cards || [];
      if (Array.isArray(pmData)) {
        setSavedCards(
          pmData.map((c: any) => ({
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
