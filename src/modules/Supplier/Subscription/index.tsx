import React, { useState, useEffect } from "react";
import {
  CreditCard, CheckCircle2, Download, Receipt,
  Sparkles, Check, Building2, ShieldCheck, Zap
} from "lucide-react";
import Button from "@/components/ui/button";
import Badge from "@/components/ui/badge";
import DataTable, { Column } from "@/components/tables/data-table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import QuotaReminderBanner from "@/components/common/QuotaReminderBanner";
import apiClient from "@/lib/axios";

export default function SupplierSubscription() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [dbPlans, setDbPlans] = useState<any[]>([]);
  const [subscription, setSubscription] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [profRes, subRes, plansRes] = await Promise.allSettled([
          apiClient.get("/supplier/profile"),
          apiClient.get("/subscription/status"),
          apiClient.get("/subscription/plans?user_type=supplier"),
        ]);

        if (profRes.status === "fulfilled") {
          setProfile(profRes.value.data?.data || profRes.value.data || null);
        }
        if (subRes.status === "fulfilled") {
          setSubscription(subRes.value.data?.data || subRes.value.data || null);
        }
        if (plansRes.status === "fulfilled") {
          const rawPlans = plansRes.value.data?.data || plansRes.value.data?.plans || plansRes.value.data || [];
          if (Array.isArray(rawPlans) && rawPlans.length > 0) {
            setDbPlans(rawPlans);
          }
        }
      } catch (err) {
        console.error("Failed to load supplier subscription data:", err);
      }
    }
    loadData();
  }, []);

  const companyName = profile?.company_name || profile?.user?.company_name || "Transport Carrier Logistics Ltd";
  const vatNumber = profile?.vat_number || "GB 982 1290 44";
  const billingEmail = profile?.billing_email || profile?.email || profile?.user?.email || "dispatch@carrierdirect.eu";

  // Group DB plans into tiers
  const tierMap: Record<string, any> = {};

  if (dbPlans.length > 0) {
    dbPlans.forEach((p: any) => {
      const baseName = (p.name || "Plan").replace(/\s*\((Monthly|Yearly|Annual)\)/i, "").trim();
      const tierKey = baseName.toLowerCase();

      if (!tierMap[tierKey]) {
        tierMap[tierKey] = {
          name: baseName,
          description: p.description || (
            tierKey.includes("trial") ? "Free trial to test freight load board and quote submissions." :
            tierKey.includes("professional") ? "Best for active owner-operators and growing transport businesses." :
            "Full enterprise fleet capacity with guaranteed contracts and 0% booking fees."
          ),
          popular: Boolean(p.is_popular || p.popular),
          badge_text: (p.is_popular || p.popular) ? "Most Popular" : null,
          features: Array.isArray(p.features) ? p.features : [],
          trialPlan: null,
          monthlyPlan: null,
          yearlyPlan: null,
        };
      }

      if (p.billing_period === "trial") {
        tierMap[tierKey].trialPlan = p;
        tierMap[tierKey].features = p.features;
      } else if (p.billing_period === "monthly") {
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
      description: "Free trial to test freight load board and quote submissions.",
      popular: false,
      badge_text: null,
      trialPlan: { id: "trial-1", price: 0 },
      features: [
        "Freight Load Board Access",
        "Transport Quote & Bid Submission",
        "Shipper Messaging",
        "Digital POD Upload",
        "Escrow Payment Protection",
        "Basic Vehicle Profile",
        "Standard Notifications"
      ]
    },
    {
      name: "Professional Carrier",
      description: "Best for active owner-operators and growing transport businesses.",
      popular: true,
      badge_text: "Most Popular",
      monthlyPlan: { id: "pro-m", price: 49 },
      yearlyPlan: { id: "pro-y", price: 490 },
      features: [
        "Priority Load Board Alerts",
        "Advanced Route & Availability Planning",
        "Fleet Management — Up to 5 Vehicles",
        "Load Capacity & Backhaul Matching",
        "Automated Stripe Connect Payouts",
        "Verified Carrier Profile & Insurance Badge",
        "Quote Performance Analytics",
        "2FA & Priority Support"
      ]
    },
    {
      name: "Enterprise Fleet Operator",
      description: "Full enterprise fleet capacity with guaranteed contracts and 0% booking fees.",
      popular: false,
      badge_text: null,
      monthlyPlan: { id: "ent-m", price: 129 },
      yearlyPlan: { id: "ent-y", price: 1290 },
      features: [
        "Dedicated Freight Lane Allocation",
        "Unlimited Fleet & Vehicle Management",
        "Dispatcher Roles & Multi-Account Management",
        "Same-Day Escrow Payouts",
        "Fleet Maintenance & Blackout Scheduling",
        "Reduced/Zero Platform Booking Fees",
        "Featured Carrier Placement",
        "Dedicated Fleet Operations Support"
      ]
    }
  ];

  const sourceTiers = Object.keys(tierMap).length > 0 ? Object.values(tierMap) : fallbackTiers;

  const plans = sourceTiers.map((tier: any) => {
    const isTrial = Boolean(tier.trialPlan || tier.name.toLowerCase().includes("trial"));
    const activeSubPlan = isTrial 
      ? tier.trialPlan 
      : (billingCycle === "yearly" ? (tier.yearlyPlan || tier.monthlyPlan) : (tier.monthlyPlan || tier.yearlyPlan));

    const planId = (activeSubPlan?.id || tier.name.toLowerCase().replace(/\s+/g, "-")).toString();
    const isCur = subscription?.plan_id === planId.toLowerCase() || (subscription?.plan?.name && subscription.plan.name.toLowerCase().includes(tier.name.toLowerCase()));

    const monthlyPrice = tier.monthlyPlan ? Number(tier.monthlyPlan.price) : 0;
    const yearlyPrice = tier.yearlyPlan ? Number(tier.yearlyPlan.price) : (monthlyPrice * 10);
    const displayPrice = isTrial ? "€ 0.00" : (billingCycle === "yearly" ? `€ ${yearlyPrice.toLocaleString()}` : `€ ${monthlyPrice.toLocaleString()}`);

    return {
      id: planId,
      name: tier.name,
      description: tier.description,
      displayPrice,
      isTrial,
      billingCycleText: isTrial ? "/ 7 Days" : (billingCycle === "yearly" ? "/ year" : "/ month"),
      subNote: (!isTrial && billingCycle === "yearly") ? `(€ ${(yearlyPrice / 12).toFixed(2)}/mo — 2 Months Free)` : null,
      popular: tier.popular,
      badgeText: tier.badge_text,
      isCurrent: isCur,
      features: tier.features || [],
    };
  });

  const history = [
    { id: "INV-2026-004", date: "Jul 01, 2026", description: "Professional Carrier Plan (Monthly)", amount: "€49.00", status: "Paid", method: "Stripe Connect Direct" },
    { id: "INV-2026-003", date: "Jun 01, 2026", description: "Professional Carrier Plan (Monthly)", amount: "€49.00", status: "Paid", method: "Stripe Connect Direct" },
  ];

  const columns: Column<any>[] = [
    {
      id: "id",
      label: "Invoice ID",
      render: (row) => <span className="font-bold text-slate-900">{row.id}</span>
    },
    { id: "date", label: "Date", render: (row) => <span className="text-xs text-slate-500">{row.date}</span> },
    { id: "description", label: "Description", render: (row) => <span className="font-semibold text-slate-800">{row.description}</span> },
    { id: "amount", label: "Amount", render: (row) => <span className="font-bold text-slate-900">{row.amount}</span> },
    { id: "method", label: "Payment Method", render: (row) => <span className="text-xs text-slate-600 font-medium">{row.method}</span> },
    {
      id: "status",
      label: "Status",
      render: (row) => (
        <Badge variant="secondary" className={
          row.status === "Paid" ? "bg-emerald-50 text-emerald-700 font-semibold" : "bg-amber-50 text-amber-700 font-semibold"
        }>
          {row.status}
        </Badge>
      )
    },
    {
      id: "actions",
      label: "Actions",
      render: (row) => (
        <button
          onClick={() => alert(`Downloading Invoice ${row.id}`)}
          className="text-xs text-[#ff4a1f] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
        >
          <Download size={13} /> PDF Receipt
        </button>
      )
    },
  ];

  return (
    <div className="p-4 md:p-6 w-full space-y-5 bg-[#f8fafc] dark:bg-[#12161c] min-h-screen font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Carrier Fleet Subscription & Plans
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Manage your transport fleet tier, load board bidding access, and payout preferences.
          </p>
        </div>
      </div>

      <QuotaReminderBanner quotaUsed={2} maxQuota={50} />

      <Card className="shadow-2xs border-slate-200 dark:border-slate-800">
        <CardHeader className="py-3.5 px-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-[#181a20]/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <CardTitle className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#ff4a1f]" />
              Available Carrier Membership Plans
            </CardTitle>
          </div>

          <div className="inline-flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setBillingCycle("monthly")}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
                billingCycle === "monthly"
                  ? "bg-white dark:bg-[#1e2329] text-slate-900 dark:text-slate-100 shadow-xs"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              Monthly Billed
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle("yearly")}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-md flex items-center gap-1.5 transition-all cursor-pointer ${
                billingCycle === "yearly"
                  ? "bg-[#ff4a1f] text-white shadow-xs"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              <span>Yearly Billed</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-extrabold ${
                billingCycle === "yearly" ? "bg-white/20 text-white" : "bg-orange-100 text-[#ff4a1f]"
              }`}>
                Save 20%
              </span>
            </button>
          </div>
        </CardHeader>

        <CardContent className="p-4 sm:p-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative rounded-xl border p-5 transition-all flex flex-col justify-between ${
                  plan.isCurrent
                    ? "border-2 border-[#ff4a1f] bg-orange-50/20 dark:bg-[#ff4a1f]/5 shadow-sm"
                    : "bg-white dark:bg-[#1e2329] border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-xs"
                }`}
              >
                {plan.popular && !plan.isCurrent && (
                  <span className="absolute -top-2.5 right-4 bg-[#ff4a1f] text-white text-[9.5px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                    {plan.badgeText || "Most Popular"}
                  </span>
                )}

                <div className="space-y-3.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">{plan.name}</h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-normal mt-0.5 leading-relaxed">{plan.description}</p>
                    </div>
                    {plan.isCurrent && (
                      <span className="shrink-0 px-2 py-0.5 bg-[#ff4a1f] text-white text-[9.5px] font-bold rounded-full uppercase tracking-wider">
                        Active
                      </span>
                    )}
                  </div>

                  <div className="pt-1">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
                        {plan.displayPrice}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        {plan.billingCycleText}
                      </span>
                    </div>
                    {plan.subNote && (
                      <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">
                        {plan.subNote}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800 max-h-[340px] overflow-y-auto">
                    {plan.features.map((feat: string, i: number) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300 font-medium">
                        <Check className="w-3.5 h-3.5 text-[#ff4a1f] shrink-0 mt-0.5" />
                        <span className="leading-tight">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-5 mt-auto">
                  {plan.isCurrent ? (
                    <div className="w-full h-9 rounded-lg text-xs font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center gap-1.5">
                      <CheckCircle2 size={14} /> Current Active Plan
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => alert(`Upgrading to ${plan.name}`)}
                      className="w-full h-9 rounded-lg text-xs font-bold bg-[#ff4a1f] hover:bg-[#e03d15] text-white shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center justify-center gap-1"
                    >
                      Choose Plan
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Primary Payment Method & Invoicing */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="shadow-2xs border-slate-200">
          <CardHeader className="py-3 px-4 border-b border-slate-100 bg-slate-50/50 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-semibold flex items-center gap-1.5 text-slate-900">
              <CreditCard className="w-4 h-4 text-[#ff4a1f]" />
              Stripe Express Payout Account
            </CardTitle>
            <Button variant="outline" className="h-7 text-xs px-2.5 cursor-pointer">
              Manage Payouts
            </Button>
          </CardHeader>
          <CardContent className="p-4">
            <div className="p-3.5 bg-slate-50 rounded-md border border-slate-200/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                  STRIPE
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-slate-900">Connected Bank Account (EUR IBAN)</h4>
                    <Badge className="bg-emerald-100 text-emerald-800 text-[9.5px] font-bold border border-emerald-200">
                      Verified
                    </Badge>
                  </div>
                  <p className="text-[11px] text-slate-500 font-normal mt-0.5">Automated Escrow release to primary bank.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-2xs border-slate-200">
          <CardHeader className="py-3 px-4 border-b border-slate-100 bg-slate-50/50 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-semibold flex items-center gap-1.5 text-slate-900">
              <Building2 className="w-4 h-4 text-[#ff4a1f]" />
              Carrier Business Details
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Registered Company:</span>
              <span className="font-bold text-slate-800">{companyName}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500 font-medium">VAT / Tax ID:</span>
              <span className="font-bold text-slate-800">{vatNumber}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500 font-medium">Billing Contact Email:</span>
              <span className="font-bold text-slate-800">{billingEmail}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Direct Standard DataTable for Billing History & Receipts */}
      <div className="p-0 space-y-2">
        <h3 className="text-xs font-bold text-slate-900 px-1">Billing History & Downloadable Receipts</h3>
        <DataTable
          columns={columns}
          data={history}
          compact={true}
          searchPlaceholder="Search invoices by ID, date, description..."
          hideViewToggle={true}
        />
      </div>
    </div>
  );
}
