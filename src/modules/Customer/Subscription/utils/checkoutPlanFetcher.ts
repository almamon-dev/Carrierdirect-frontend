import apiClient from "@/lib/axios";

export async function fetchCustomerCheckoutPlan(
  targetPlanKey: string | number | null | undefined,
  planFromState: any,
  queryCycle: string
) {
  try {
    const res: any = await apiClient.get(`/subscription/plans?user_type=customer`);
    const rawPlans = Array.isArray(res?.data)
      ? res.data
      : (Array.isArray(res?.data?.data)
        ? res.data.data
        : (Array.isArray(res?.data?.plans)
          ? res.data.plans
          : (Array.isArray(res) ? res : [])));
    const plansList = Array.isArray(rawPlans) ? rawPlans : [];
    const paidPlans = plansList.filter((p: any) =>
      p.billing_period !== "trial" &&
      !(p.name || "").toLowerCase().includes("trial") &&
      Number(p.price) > 0
    );
    const activeList = paidPlans.length > 0 ? paidPlans : plansList;

    if (Array.isArray(activeList) && activeList.length > 0) {
      let matched = targetPlanKey ? activeList.find(
        (p: any) =>
          (String(p.id) === String(targetPlanKey) ||
           String(p.planId) === String(targetPlanKey) ||
           p.name?.toLowerCase().includes(String(targetPlanKey).toLowerCase())) &&
          p.billing_period !== "trial" &&
          !(p.name || "").toLowerCase().includes("trial")
      ) : null;

      if (!matched) matched = activeList.find((p: any) => p.is_popular || p.popular) || activeList[0];

      if (matched) {
        const baseName = (matched.name || "").replace(/\s*\((Monthly|Yearly|Annual)\)/i, "").trim().toLowerCase();
        const monthlyVariant = activeList.find((p: any) =>
          (p.billing_period === "monthly" || !p.billing_period) &&
          (p.name || "").replace(/\s*\((Monthly|Yearly|Annual)\)/i, "").trim().toLowerCase() === baseName
        );
        const yearlyVariant = activeList.find((p: any) =>
          (p.billing_period === "annual" || p.billing_period === "yearly") &&
          (p.name || "").replace(/\s*\((Monthly|Yearly|Annual)\)/i, "").trim().toLowerCase() === baseName
        );

        const monthlyPrice = Number(monthlyVariant?.price ?? matched.price ?? 79);
        const yearlyPrice = Number(yearlyVariant?.price ?? (monthlyPrice * 10));
        const determinedCycle: "monthly" | "yearly" = (matched.billing_period === "annual" || matched.billing_period === "yearly")
          ? "yearly"
          : (queryCycle === "yearly" || queryCycle === "annual" ? "yearly" : (planFromState?.cycle === "yearly" ? "yearly" : "monthly"));

        const activePlanId = determinedCycle === "yearly" ? (yearlyVariant?.id || matched.id) : (monthlyVariant?.id || matched.id);
        return {
          id: activePlanId,
          name: (matched.name || "").replace(/\s*\((Monthly|Yearly|Annual)\)/i, "").trim(),
          priceMonthly: monthlyPrice,
          priceYearly: yearlyPrice,
          cycle: determinedCycle,
          features: Array.isArray(matched.features) && matched.features.length > 0
            ? matched.features
            : (determinedCycle === "yearly" && Array.isArray(yearlyVariant?.features) && yearlyVariant.features.length > 0
              ? yearlyVariant.features
              : (Array.isArray(monthlyVariant?.features) && monthlyVariant.features.length > 0
                ? monthlyVariant.features
                : (planFromState?.features || []))),
        };
      }
    }
  } catch (e) {
    console.log("Plan fetch error:", e);
  }
  return null;
}
