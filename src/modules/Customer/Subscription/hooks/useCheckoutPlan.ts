import { useState, useMemo } from "react";
import { useLocation, useParams, useSearchParams } from "react-router-dom";
import apiClient from "@/lib/axios";
import { decryptId } from "@/lib/encryption";

export function useCheckoutPlan() {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { planId } = useParams<{ planId?: string }>();
  const cleanPlanId = planId ? decryptId(planId) : null;
  const planFromState = location.state?.plan;

  const queryPlanId = searchParams.get("plan") || searchParams.get("plan_id") || cleanPlanId;
  const queryCycle = (searchParams.get("cycle") || searchParams.get("billing_cycle") || location.state?.billingCycle || planFromState?.cycle || "").toLowerCase();
  const initialCycle: "monthly" | "yearly" = queryCycle === "yearly" || queryCycle === "annual" ? "yearly" : "monthly";

  const [selectedPlan, setSelectedPlan] = useState<any>(
    planFromState && !planFromState?.isTrial && !String(planFromState?.name || "").toLowerCase().includes("trial") ? {
      ...planFromState,
      cycle: initialCycle,
    } : {
      id: queryPlanId && String(queryPlanId) !== "1" ? (isNaN(Number(queryPlanId)) ? queryPlanId : Number(queryPlanId)) : null,
      name: planFromState?.name || "",
      priceMonthly: planFromState?.priceMonthly || 0,
      priceYearly: planFromState?.priceYearly || 0,
      cycle: initialCycle,
      features: planFromState?.features || [],
    }
  );

  const [currentSub, setCurrentSub] = useState<any>(null);

  const normalizePlanName = (name: string) =>
    (name || "").toLowerCase().replace(/\s*\((monthly|yearly|annual|trial)\)/gi, "").trim();

  const isAlreadySubscribed = Boolean(
    currentSub?.has_subscription &&
    currentSub?.is_active &&
    !currentSub?.is_trial &&
    selectedPlan?.name &&
    (
      String(currentSub?.plan_id) === String(selectedPlan?.id) ||
      (currentSub?.plan_name && normalizePlanName(currentSub.plan_name) === normalizePlanName(selectedPlan.name))
    )
  );

  const handleCycleChange = (cycle: "monthly" | "yearly") => {
    setSelectedPlan((prev: any) => ({ ...prev, cycle }));
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("cycle", cycle);
      return next;
    }, { replace: true });
  };

  const planCycle: "monthly" | "yearly" = (selectedPlan?.cycle === "yearly" || queryCycle === "yearly" || queryCycle === "annual") ? "yearly" : "monthly";
  const planPrice = planCycle === "yearly" ? Number(selectedPlan?.priceYearly || 490) : Number(selectedPlan?.priceMonthly || 49);
  const totalAmount = planPrice;

  const nextBillingDateText = useMemo(() => {
    const d = new Date();
    if (planCycle === "yearly") d.setFullYear(d.getFullYear() + 1);
    else d.setMonth(d.getMonth() + 1);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }, [planCycle]);

  return {
    cleanPlanId,
    queryPlanId,
    queryCycle,
    planFromState,
    selectedPlan,
    setSelectedPlan,
    currentSub,
    setCurrentSub,
    isAlreadySubscribed,
    handleCycleChange,
    planCycle,
    planPrice,
    totalAmount,
    nextBillingDateText,
    normalizePlanName,
  };
}
