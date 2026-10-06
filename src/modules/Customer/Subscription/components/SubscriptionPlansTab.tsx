import React from "react";
import { Check, Sparkles, ArrowRight } from "lucide-react";
import Button from "@/components/ui/button";
import Badge from "@/components/ui/badge";
import { SubscriptionPlan, UserSubscriptionData } from "../types";
import { encryptId } from "@/lib/encryption";
import { useNavigate } from "react-router-dom";

interface SubscriptionPlansTabProps {
  plans: SubscriptionPlan[];
  subscription: UserSubscriptionData | null;
}

export const SubscriptionPlansTab: React.FC<SubscriptionPlansTabProps> = ({
  plans,
  subscription,
}) => {
  const navigate = useNavigate();
  const currentPlanId = subscription?.plan?.id;

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-[#181d24] border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-2xs">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Flexible Subscription & Freight Dispatch Plans
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
            Choose a plan tailored to your dispatch volume, corporate credit limits, and freight automation requirements.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4.5 mt-5">
          {plans.map((plan) => {
            const isCurrent = String(plan.id) === String(currentPlanId);
            const isPopular = Boolean(plan.is_popular);

            return (
              <div
                key={plan.id}
                className={`relative flex flex-col justify-between p-5 rounded-xl border transition-all ${
                  isPopular
                    ? "border-[#ff4a1f] bg-orange-50/20 dark:bg-[#ff4a1f]/5 shadow-sm ring-1 ring-[#ff4a1f]/30"
                    : isCurrent
                    ? "border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/10 shadow-xs"
                    : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 hover:border-slate-300 dark:hover:border-slate-700"
                }`}
              >
                {isPopular && (
                  <span className="absolute -top-2.5 right-4 bg-[#ff4a1f] text-white text-[9.5px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-2xs">
                    Most Popular
                  </span>
                )}
                {isCurrent && (
                  <span className="absolute -top-2.5 right-4 bg-emerald-600 text-white text-[9.5px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-2xs">
                    Current Plan
                  </span>
                )}

                <div className="space-y-3.5">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                      {plan.name}
                    </h3>
                    {plan.subtitle && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {plan.subtitle}
                      </p>
                    )}
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-slate-900 dark:text-slate-100">
                      {plan.price_formatted || `€${plan.price}`}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      / {plan.billing_period || "monthly"}
                    </span>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Features Included:
                    </span>
                    <ul className="space-y-1.5">
                      {(plan.features || []).map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                          <Check size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-5">
                  <Button
                    variant={isCurrent ? "outline" : isPopular ? "primary" : "outline"}
                    size="sm"
                    disabled={isCurrent}
                    onClick={() => navigate(`/customer/subscription/checkout/${encryptId(plan.id)}`)}
                    className={`w-full h-9 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer ${
                      isCurrent
                        ? "border-emerald-200 text-emerald-700 dark:text-emerald-300"
                        : isPopular
                        ? "bg-[#ff4a1f] hover:bg-[#e03e15] text-white"
                        : ""
                    }`}
                  >
                    <span>{isCurrent ? "Active Plan" : plan.cta_text || "Upgrade to This Plan"}</span>
                    {!isCurrent && <ArrowRight size={13} />}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlansTab;
