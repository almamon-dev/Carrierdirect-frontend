import useScrollReveal from "@/Hooks/useScrollReveal";
import apiClient from "@/lib/axios";
import { Check, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { defaultShipperPlans, defaultSupplierPlans, PlanTier } from "./pricingPlansData";
import { useLandingCMS } from "../components/useLandingCMS";

export default function PricingSection() {
  const heading = useScrollReveal();
  const pricingCards = useScrollReveal();
  const { getSection, isSectionEnabled } = useLandingCMS();
  const cmsPricing = getSection("pricing");

  const [activeRole, setActiveRole] = useState<"customer" | "supplier">("supplier");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [apiPlans, setApiPlans] = useState<Record<string, PlanTier[]>>({});

  useEffect(() => {
    let isMounted = true;
    apiClient
      .get("/pricing-plans", { params: { user_type: activeRole } })
      .then((res: any) => {
        if (!isMounted) return;
        const fetched = res.data?.data || res.data || [];
        if (Array.isArray(fetched) && fetched.length > 0) {
          const tierMap: Record<string, PlanTier> = {};

          fetched.forEach((p: any) => {
            let featuresList: string[] = [];
            if (Array.isArray(p.features)) {
              featuresList = p.features;
            } else if (typeof p.features === "string") {
              try {
                featuresList = JSON.parse(p.features);
              } catch {
                featuresList = p.features.split(",").map((s: string) => s.trim());
              }
            }

            const isTrial =
              p.billing_period === "trial" ||
              (p.name && p.name.toLowerCase().includes("trial"));

            if (isTrial) {
              tierMap["trial"] = {
                id: p.id,
                name: p.name || "7-Day Free Trial",
                description:
                  p.description || "Test full platform features with free trial access.",
                is_popular: Boolean(p.is_popular || p.is_featured),
                isTrial: true,
                order: p.order || 0,
                buttonText: p.button_text || "Start Free Trial",
                monthly: {
                  id: p.id,
                  price: "0",
                  billing_period: "/7 days",
                  features: featuresList,
                  buttonText: p.button_text || "Start Free Trial",
                },
                yearly: {
                  id: p.id,
                  price: "0",
                  billing_period: "/7 days",
                  features: featuresList,
                  buttonText: p.button_text || "Start Free Trial",
                },
                features:
                  featuresList.length > 0
                    ? featuresList
                    : tierMap["trial"]?.features || [],
              };
              return;
            }

            const baseName = (p.name || "Plan")
              .replace(/\s*\((Monthly|Yearly|Annual)\)/i, "")
              .trim();
            const tierKey = baseName.toLowerCase();

            if (!tierMap[tierKey]) {
              tierMap[tierKey] = {
                id: p.id,
                name: baseName,
                description: p.description || "",
                is_popular: Boolean(p.is_popular || p.is_featured),
                isTrial: false,
                order: p.order || 1,
                features: featuresList,
                buttonText: p.button_text || "Choose Plan",
                monthly: {
                  id: p.id,
                  price: p.price,
                  billing_period: "/mo",
                  features: featuresList,
                  buttonText: p.button_text,
                },
                yearly: {
                  id: p.id,
                  price: (parseFloat(p.price || 0) * 10).toString(),
                  billing_period: "/year",
                  features: featuresList,
                  buttonText: p.button_text,
                },
              };
            }

            if (p.is_popular || p.is_featured) {
              tierMap[tierKey].is_popular = true;
            }

            if (p.description && !tierMap[tierKey].description) {
              tierMap[tierKey].description = p.description;
            }

            if (featuresList.length > 0) {
              tierMap[tierKey].features = featuresList;
            }

            const period = String(p.billing_period || "").toLowerCase();
            const isYearlyPeriod = period === "annual" || period === "yearly";

            if (isYearlyPeriod) {
              tierMap[tierKey].yearly = {
                id: p.id,
                price: p.price,
                billing_period: "/year",
                features: featuresList,
                buttonText: p.button_text,
              };
            } else {
              tierMap[tierKey].monthly = {
                id: p.id,
                price: p.price,
                billing_period: "/mo",
                features: featuresList,
                buttonText: p.button_text,
              };
            }
          });

          const normalizedTiers = Object.values(tierMap).sort(
            (a, b) => (a.order || 0) - (b.order || 0)
          );

          if (normalizedTiers.length > 0) {
            setApiPlans((prev) => ({ ...prev, [activeRole]: normalizedTiers }));
          }
        }
      })
      .catch(() => {
        // Silently preserve default fallback plans
      });

    return () => {
      isMounted = false;
    };
  }, [activeRole]);

  if (!isSectionEnabled("pricing")) {
    return null;
  }

  const badge = cmsPricing?.badge || "Simple Pricing";
  const title = cmsPricing?.title || "Transparent Pricing for Everyone";
  const subtitle = cmsPricing?.subtitle || "Whether you're shipping one pallet or managing a fleet of trucks, we have a plan that fits your business.";
  const annualDiscount = cmsPricing?.content?.annual_discount_percentage ?? 20;

  const defaultFallback =
    activeRole === "supplier" ? defaultSupplierPlans : defaultShipperPlans;
  const plans =
    apiPlans[activeRole] && apiPlans[activeRole].length > 0
      ? apiPlans[activeRole]
      : defaultFallback;

  const isFourColumns = plans.length >= 4;

  return (
    <section id="pricing" className="w-full bg-transparent pt-12 pb-6 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div
          ref={heading.ref}
          className={`text-center max-w-3xl mx-auto mb-10 reveal ${heading.isVisible ? "visible" : ""
            }`}
        >
          <span className="text-[#ff4a1f] font-semibold tracking-wider text-sm mb-3 block">
            {badge}
          </span>
          <h2 className="text-[#0f0400] dark:text-slate-100 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            {title}
          </h2>
          <p className="text-gray-500 dark:text-slate-400 text-sm sm:text-base mb-8">
            {subtitle}
          </p>

          {/* User Type Switcher (Shippers vs Carriers) */}
          <div className="inline-flex bg-white dark:bg-[#1e2329] rounded-full p-1.5 shadow-sm dark:shadow-none border border-gray-200 dark:border-[#2b313a] mb-6">
            <button
              onClick={() => setActiveRole("customer")}
              className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 cursor-pointer ${activeRole === "customer"
                  ? "bg-[#0f0400] dark:bg-[#ff4a1f] text-white shadow-md"
                  : "text-gray-500 dark:text-slate-400 hover:text-[#0f0400] dark:hover:text-white"
                }`}
            >
              For Shippers
            </button>
            <button
              onClick={() => setActiveRole("supplier")}
              className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 cursor-pointer ${activeRole === "supplier"
                  ? "bg-[#0f0400] dark:bg-[#ff4a1f] text-white shadow-md"
                  : "text-gray-500 dark:text-slate-400 hover:text-[#0f0400] dark:hover:text-white"
                }`}
            >
              For Carriers
            </button>
          </div>

          {/* Monthly / Yearly Switcher */}
          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setBillingCycle("monthly")}
              className={`text-sm font-semibold transition-colors cursor-pointer ${billingCycle === "monthly"
                  ? "text-[#0f0400] dark:text-white font-bold"
                  : "text-gray-500 dark:text-slate-400 hover:text-[#0f0400] dark:hover:text-white"
                }`}
            >
              Monthly Billing
            </button>

            <button
              type="button"
              role="switch"
              aria-checked={billingCycle === "yearly"}
              onClick={() =>
                setBillingCycle((prev) => (prev === "monthly" ? "yearly" : "monthly"))
              }
              className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full p-0.5 transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#ff4a1f]/50 ${billingCycle === "yearly"
                  ? "bg-[#ff4a1f]"
                  : "bg-gray-300 dark:bg-slate-700"
                }`}
            >
              <span
                className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-300 ease-in-out ${billingCycle === "yearly" ? "translate-x-7" : "translate-x-0"
                  }`}
              />
            </button>

            <button
              type="button"
              onClick={() => setBillingCycle("yearly")}
              className="flex items-center gap-1.5 cursor-pointer text-left"
            >
              <span
                className={`text-sm font-semibold transition-colors ${billingCycle === "yearly"
                    ? "text-[#0f0400] dark:text-white font-bold"
                    : "text-gray-500 dark:text-slate-400 hover:text-[#0f0400] dark:hover:text-white"
                  }`}
              >
                Annual Billing
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#ff4a1f]/10 text-[#ff4a1f] border border-[#ff4a1f]/25 shadow-xs">
                <Sparkles className="w-2.5 h-2.5" />
                Save {annualDiscount}%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div
          ref={pricingCards.ref}
          className={`reveal ${pricingCards.isVisible ? "visible" : ""}`}
        >
          <div
            className={`grid grid-cols-1 ${isFourColumns
                ? "md:grid-cols-2 lg:grid-cols-4 max-w-7xl"
                : "md:grid-cols-3 max-w-6xl"
              } gap-5 items-stretch mx-auto`}
          >
            {plans.map((tier: PlanTier, i: number) => {
              const isTrial = Boolean(tier.isTrial);
              const activePlanData =
                billingCycle === "yearly" && !isTrial ? tier.yearly : tier.monthly;

              const rawPrice = activePlanData?.price ?? "0";
              const parsedPrice = parseFloat(String(rawPrice)) || 0;
              const formattedPrice = parsedPrice.toFixed(0);

              const monthlyEquivalent =
                billingCycle === "yearly" && !isTrial && parsedPrice > 0
                  ? Math.round(parsedPrice / 12)
                  : null;

              // Dynamically resolve features from active plan or tier
              const activeFeatures =
                activePlanData?.features && activePlanData.features.length > 0
                  ? activePlanData.features
                  : tier.features;

              const activeBtnText =
                activePlanData?.buttonText ||
                tier.buttonText ||
                (isTrial ? "Start Free Trial" : "Choose Plan");

              const registerPath = `/web/register/${activeRole}`;

              return (
                <div
                  key={tier.id || i}
                  className={`relative rounded-2xl p-6 border transition-all duration-300 flex flex-col h-full ${tier.is_popular
                      ? "bg-[#0f0400] dark:bg-[#1e2329] border-[#ff4a1f] shadow-xl md:-translate-y-2 z-10 text-white"
                      : "bg-white dark:bg-[#1e2329] border-gray-200 dark:border-[#2b313a] shadow-sm hover:shadow-md hover:border-[#ff4a1f]/40 text-[#0f0400] dark:text-slate-100"
                    }`}
                >
                  {tier.is_popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-[#ff4a1f] text-white text-[10px] font-bold tracking-widest uppercase py-1 px-3.5 rounded-full shadow-md flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5" />
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="mb-4">
                    <h3
                      className={`text-lg font-bold mb-1.5 ${tier.is_popular
                          ? "text-white"
                          : "text-[#0f0400] dark:text-slate-100"
                        }`}
                    >
                      {tier.name}
                    </h3>
                    <p
                      className={`text-xs min-h-[36px] leading-relaxed ${tier.is_popular
                          ? "text-gray-300"
                          : "text-gray-500 dark:text-slate-400"
                        }`}
                    >
                      {tier.description || "The perfect plan to grow your logistics business."}
                    </p>
                  </div>

                  <div className="mb-5 pb-5 border-b border-gray-100 dark:border-white/10">
                    <div className="flex items-baseline gap-1">
                      <span
                        className={`text-3xl font-extrabold ${tier.is_popular
                            ? "text-white"
                            : "text-[#0f0400] dark:text-slate-100"
                          }`}
                      >
                        £{formattedPrice}
                      </span>
                      <span
                        className={`text-xs font-medium ${tier.is_popular
                            ? "text-gray-400"
                            : "text-gray-500 dark:text-slate-400"
                          }`}
                      >
                        {isTrial
                          ? "/7 days"
                          : billingCycle === "yearly"
                            ? "/year"
                            : "/mo"}
                      </span>
                    </div>

                    {/* Subtext info */}
                    <div className="mt-1 min-h-[20px]">
                      {isTrial ? (
                        <span className="text-[11px] font-medium text-emerald-500 dark:text-emerald-400">
                          No credit card required
                        </span>
                      ) : billingCycle === "yearly" ? (
                        <div className="text-[11px] font-medium text-[#ff4a1f]">
                          {monthlyEquivalent ? `£${monthlyEquivalent}/mo • ` : ""}Billed annually (Save ~{annualDiscount}%)
                        </div>
                      ) : (
                        <span
                          className={`text-[11px] ${tier.is_popular ? "text-gray-400" : "text-gray-400"
                            }`}
                        >
                          Billed monthly
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex-1 mb-6">
                    <p
                      className={`text-[11px] font-semibold uppercase tracking-wider mb-3 ${tier.is_popular ? "text-gray-400" : "text-gray-400 dark:text-slate-500"
                        }`}
                    >
                      What's Included:
                    </p>
                    <ul className="space-y-2.5">
                      {activeFeatures?.map((feature: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <span
                            className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${tier.is_popular
                                ? "bg-[#ff4a1f]/20 text-[#ff4a1f]"
                                : "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400"
                              }`}
                          >
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </span>
                          <span
                            className={`text-xs leading-relaxed ${tier.is_popular
                                ? "text-gray-200"
                                : "text-gray-600 dark:text-slate-300"
                              }`}
                          >
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link to={registerPath}>
                    <button
                      className={`w-full py-2.5 px-4 rounded-lg font-bold text-xs transition-all duration-300 cursor-pointer ${tier.is_popular
                          ? "bg-[#ff4a1f] text-white hover:bg-[#e63d15] shadow-md hover:shadow-lg"
                          : "bg-gray-100 dark:bg-slate-800 text-[#0f0400] dark:text-slate-100 hover:bg-gray-200 dark:hover:bg-slate-700 border border-gray-200 dark:border-[#2b313a]"
                        }`}
                    >
                      {activeBtnText}
                    </button>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
