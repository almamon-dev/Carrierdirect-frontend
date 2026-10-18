import { buildTierMap } from "../data/fallbackTiers";
import { CustomerPlanItem, UserSubscriptionData } from "../types";

export function buildCustomerPlans(
  dbPlans: any[],
  subscription: UserSubscriptionData | null,
  billingCycle: "monthly" | "yearly"
): CustomerPlanItem[] {
  const tierMap = buildTierMap(dbPlans);
  const tiersList = Object.keys(tierMap).length > 0
    ? Object.values(tierMap).sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
    : [];

  const currentPlanName = (
    subscription?.plan_name ||
    subscription?.name ||
    subscription?.pricing_plan?.name ||
    ""
  ).toLowerCase();

  return tiersList.map((tier: any) => {
    const isTrial = Boolean(tier.trialPlan || tier.name.toLowerCase().includes("trial"));
    const isCurrent = currentPlanName
      ? tier.name.toLowerCase().includes(currentPlanName) ||
      (currentPlanName.includes("trial") && tier.name.toLowerCase().includes("trial"))
      : false;

    let displayPrice = "€0";
    let billingCycleText = "for 7 days";
    let subNote = "No credit card required";
    let planId = tier.trialPlan?.id || 0;
    let monthlyPrice = 0;
    let yearlyPrice = 0;

    if (tier.monthlyPlan || tier.yearlyPlan) {
      monthlyPrice = parseFloat(tier.monthlyPlan?.price || 0);
      yearlyPrice = parseFloat(tier.yearlyPlan?.price || (monthlyPrice * 10));

      if (billingCycle === "yearly" && tier.yearlyPlan) {
        displayPrice = `€${parseFloat(tier.yearlyPlan.price || 0).toFixed(0)}`;
        billingCycleText = "/ year";
        subNote = "Billed annually • Save 20%";
        planId = tier.yearlyPlan.id;
      } else {
        displayPrice = `€${monthlyPrice.toFixed(0)}`;
        billingCycleText = "/ month";
        subNote = "Billed monthly";
        planId = tier.monthlyPlan?.id || tier.yearlyPlan?.id;
      }
    }

    const chosenFeatures = (billingCycle === "yearly" && Array.isArray(tier.yearlyPlan?.features) && tier.yearlyPlan.features.length > 0)
      ? tier.yearlyPlan.features
      : (Array.isArray(tier.monthlyPlan?.features) && tier.monthlyPlan.features.length > 0
        ? tier.monthlyPlan.features
        : (tier.trialPlan?.features || tier.features || []));

    const chosenDescription = tier.description ||
      tier.monthlyPlan?.description ||
      tier.yearlyPlan?.description ||
      tier.trialPlan?.description ||
      "Road freight logistics and transport plan.";

    return {
      name: tier.name,
      description: chosenDescription,
      popular: Boolean(tier.popular),
      badgeText: tier.badge_text || (tier.popular ? "Most Popular" : null),
      order: tier.order,
      features: chosenFeatures,
      isTrial,
      isCurrent,
      displayPrice,
      billingCycleText,
      subNote,
      planId,
      monthlyPrice,
      yearlyPrice,
    };
  });
}
