export function buildSupplierTierMap(dbPlans: any[], billingCycle: 'monthly' | 'yearly', subscription: any) {
  const tierMap: Record<string, any> = {};

  if (dbPlans.length > 0) {
    dbPlans.forEach((p: any) => {
      if (p.billing_period === "trial" || (p.name && p.name.toLowerCase().includes("trial"))) {
        tierMap["trial"] = {
          name: p.name || "7-Day Free Trial",
          description: p.description || "Test full platform features with free trial access.",
          popular: false,
          badge_text: "Free Trial",
          features: Array.isArray(p.features) ? p.features : [],
          order: 0,
          trialPlan: p,
          monthlyPlan: null,
          yearlyPlan: null,
        };
        return;
      }

      const baseName = (p.name || "Plan").replace(/\s*\((Monthly|Yearly|Annual)\)/i, "").trim();
      const tierKey = baseName.toLowerCase();

      if (!tierMap[tierKey]) {
        tierMap[tierKey] = {
          name: baseName,
          description: p.description || "Road freight logistics and transport plan.",
          popular: Boolean(p.is_popular || p.popular),
          badge_text: (p.is_popular || p.popular) ? "Most Popular" : null,
          features: Array.isArray(p.features) ? p.features : [],
          order: p.order || 1,
          monthlyPlan: null,
          yearlyPlan: null,
        };
      }

      if (p.is_popular || p.popular) {
        tierMap[tierKey].popular = true;
        tierMap[tierKey].badge_text = "Most Popular";
      }

      if (p.description && (!tierMap[tierKey].description || tierMap[tierKey].description === "Road freight logistics and transport plan.")) {
        tierMap[tierKey].description = p.description;
      }

      if (p.billing_period === "monthly") {
        tierMap[tierKey].monthlyPlan = p;
        if ((!tierMap[tierKey].features || tierMap[tierKey].features.length === 0) && Array.isArray(p.features)) {
          tierMap[tierKey].features = p.features;
        }
      } else if (p.billing_period === "annual" || p.billing_period === "yearly") {
        tierMap[tierKey].yearlyPlan = p;
        if ((!tierMap[tierKey].features || tierMap[tierKey].features.length === 0) && Array.isArray(p.features)) {
          tierMap[tierKey].features = p.features;
        }
      } else {
        tierMap[tierKey].monthlyPlan = p;
      }
    });
  }

  const fallbackTiers = [
    {
      name: "7-Day Free Trial",
      description: "Test full platform features with 7 days free access.",
      popular: false,
      badge_text: "Free Trial",
      order: 0,
      features: [
        "7-Day Free Trial (No Credit Card Required)",
        "Submit Unlimited Freight Quotes & Bids",
        "Direct Live Chat with Shippers",
        "Real-Time Load Notifications & Alerts",
        "Instant Order Confirmation & Digital POD",
        "Fast Automated Carrier Escrow Payouts",
        "Standard Email & Web Notifications"
      ]
    },
    {
      name: "Professional Carrier",
      description: "For active transport operators seeking high-volume loads.",
      popular: true,
      badge_text: "Most Popular",
      order: 1,
      monthlyPlan: { id: "pro-s-m", price: 49 },
      yearlyPlan: { id: "pro-s-y", price: 490 },
      features: [
        "Unlimited Quote Submissions & Load Bidding",
        "Priority Search Placement for Shippers",
        "Direct Shipper Chat & Negotiation",
        "Instant Load Booking & Digital POD Management",
        "Real-Time Telematics & Fleet Route Tracking",
        "Fast-Track 24/48h Payout Settlement",
        "Standard Email & Push Notifications"
      ]
    },
    {
      name: "Enterprise Fleet Operator",
      description: "For transport fleets, freight forwarders & enterprise dispatchers.",
      popular: false,
      badge_text: null,
      order: 2,
      monthlyPlan: { id: "ent-s-m", price: 129 },
      yearlyPlan: { id: "ent-s-y", price: 1290 },
      features: [
        "Includes all Professional Carrier features",
        "Multi-Driver Fleet Dispatch & Assignment",
        "Sub-Carrier & Driver Mobile App Logins",
        "Guaranteed Dedicated Freight Lanes",
        "Custom API & Telematics TMS Integration",
        "Same-Day Instant Fast-Pay Payouts",
        "24/7 Dedicated Logistics Account Manager"
      ]
    }
  ];

  const tiersList = Object.keys(tierMap).length > 0
    ? Object.values(tierMap).sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
    : fallbackTiers;

  const currentPlanName = (subscription?.plan_name || subscription?.name || subscription?.pricing_plan?.name || "").toLowerCase();

  return tiersList.map((tier: any) => {
    const isTrial = Boolean(tier.trialPlan || tier.name.toLowerCase().includes("trial"));
    const isCurrent = currentPlanName ? (
      tier.name.toLowerCase().includes(currentPlanName) ||
      (currentPlanName.includes("trial") && tier.name.toLowerCase().includes("trial"))
    ) : false;

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

    return {
      ...tier,
      isTrial,
      isCurrent,
      displayPrice,
      billingCycleText,
      subNote,
      planId,
      monthlyPrice,
      yearlyPrice,
      badgeText: tier.badge_text || (tier.popular ? "Most Popular" : null),
    };
  });
}
