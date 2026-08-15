import React, { useState, useEffect } from "react";
import {
  CreditCard, FileText, CheckCircle2, Download, Plus, Receipt, Clock,
  ArrowUpRight, ShieldCheck, Zap, Sparkles, Check, Building2, Package, Euro
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/ui/button";
import Badge from "@/components/ui/badge";
import DataTable from "@/components/tables/data-table";
import EmptyState from "@/components/tables/empty-state";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import QuotaReminderBanner from "@/components/common/QuotaReminderBanner";
import { AddPaymentMethodModal } from "@/modules/Customer/Settings/components/AddPaymentMethodModal";
import apiClient from "@/lib/axios";

export default function CustomerSubscription() {
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [showAllInvoices, setShowAllInvoices] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [subscription, setSubscription] = useState<any>(null);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [quotaUsed, setQuotaUsed] = useState(0);
  const [dbPlans, setDbPlans] = useState<any[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const [profRes, subRes, invRes, reqRes, plansRes] = await Promise.allSettled([
          apiClient.get("/customer/profile"),
          apiClient.get("/subscription/status"),
          apiClient.get("/customer/invoices"),
          apiClient.get("/customer/quote-requests"),
          apiClient.get("/subscription/plans?user_type=customer"),
        ]);

        if (profRes.status === "fulfilled") {
          setProfile(profRes.value.data?.data || profRes.value.data || null);
        }

        if (subRes.status === "fulfilled") {
          setSubscription(subRes.value.data?.data || subRes.value.data || null);
        }

        if (invRes.status === "fulfilled") {
          const list = invRes.value.data?.data || invRes.value.data?.invoices?.data || invRes.value.data?.invoices || [];
          setInvoices(Array.isArray(list) ? list : []);
        }

        if (reqRes.status === "fulfilled") {
          const rawItems = reqRes.value.data?.data || reqRes.value.data || [];
          if (Array.isArray(rawItems)) setQuotaUsed(rawItems.length);
        }

        if (plansRes.status === "fulfilled") {
          const rawPlans = plansRes.value.data?.data || plansRes.value.data?.plans || plansRes.value.data || [];
          if (Array.isArray(rawPlans) && rawPlans.length > 0) {
            setDbPlans(rawPlans);
          }
        }
      } catch (err) {
        console.error("Failed to load subscription data:", err);
      }
    }
    loadData();
  }, []);

  const companyName = profile?.company_name || profile?.user?.company_name || profile?.name || "Company Profile Not Set";
  const contactEmail = profile?.email || profile?.user?.email || "N/A";
  const contactPhone = profile?.phone || profile?.user?.phone || "N/A";
  const hasCard = profile?.has_saved_card || profile?.user?.has_saved_card;

  const currentPlanId = (subscription?.plan_id || subscription?.plan?.slug || "starter").toString().toLowerCase();

  // Group DB plans into 3 logical tiers
  const tierMap: Record<string, any> = {};

  if (dbPlans.length > 0) {
    dbPlans.forEach((p: any) => {
      const baseName = (p.name || "Plan").replace(/\s*\((Monthly|Yearly|Annual)\)/i, "").trim();
      const tierKey = baseName.toLowerCase();

      if (!tierMap[tierKey]) {
        tierMap[tierKey] = {
          name: baseName,
          description: p.description || (
            tierKey.includes("starter") ? "Ideal for occasional shippers testing regional freight availability." :
            tierKey.includes("growth") ? "For active businesses shipping freight with corporate credit & tracking." :
            "Full enterprise logistics management with custom credit and dedicated fleet."
          ),
          popular: Boolean(p.is_popular || p.popular),
          badge_text: (p.is_popular || p.popular) ? "Most Popular" : null,
          features: Array.isArray(p.features) ? p.features : [],
          monthlyPlan: null,
          yearlyPlan: null,
        };
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
      name: "Starter Shipper",
      description: "Ideal for occasional shippers testing regional freight availability.",
      popular: false,
      badge_text: null,
      monthlyPlan: { id: "starter-m", price: 29 },
      yearlyPlan: { id: "starter-y", price: 290 },
      features: [
        "Unlimited RFQ & Transport Requests",
        "Multi-Carrier Quote Comparison",
        "Direct Carrier Negotiation",
        "Secure Escrow Payments",
        "Digital POD Management",
        "Address Book — Up to 10 Locations",
        "Automated VAT Invoicing",
        "Order Tracking",
        "Email, SMS & Push Notifications",
        "Multi-Currency Billing Support (EUR, GBP)",
        "Cargo Photo & Packing List Uploads",
        "1-Click Shipment History Export",
        "Standard Customer Support"
      ]
    },
    {
      name: "Growth Logistics",
      description: "For active businesses shipping freight with corporate credit & tracking.",
      popular: true,
      badge_text: "Most Popular",
      monthlyPlan: { id: "growth-m", price: 79 },
      yearlyPlan: { id: "growth-y", price: 790 },
      features: [
        "Priority RFQ Distribution",
        "Corporate Pay-Later Credit — Net 60",
        "Real-Time GPS & Map Tracking",
        "AI-Powered Bulk RFQ Import",
        "Route Templates & Quick Rebooking",
        "Unlimited Saved Locations",
        "Multi-Card Payment Management",
        "Consolidated Billing & Expense Reports",
        "Advanced Shipment Analytics",
        "Custom Pickup & Delivery Time Windows",
        "Preferred Carrier Tagging & Fast Dispatch",
        "Live Negotiation Transcript Archival",
        "Priority Operations Support"
      ]
    },
    {
      name: "Enterprise Freight Suite",
      description: "Full enterprise logistics management with custom credit and dedicated fleet.",
      popular: false,
      badge_text: null,
      monthlyPlan: { id: "enterprise-m", price: 199 },
      yearlyPlan: { id: "enterprise-y", price: 1990 },
      features: [
        "Custom Corporate Credit — Net 90/120",
        "FTL, LTL & Multi-Stop Routing",
        "Dedicated Fleet & Expedited Booking",
        "AI ETA Prediction & Geofencing",
        "Carrier Compliance & Insurance Verification",
        "Advanced Team Roles & Approval Workflows",
        "Carbon Emissions & Sustainability Analytics",
        "Freight Cost Optimization Reports",
        "Dedicated Vehicle Capacity Guarantee",
        "Specialized Cargo Handling (Hazmat / Temp-Controlled)",
        "Multi-Branch & Department Cost Center Billing",
        "Dedicated Logistics Control Tower",
        "24/7 VIP & Emergency Dispatch Support"
      ]
    }
  ];

  const sourceTiers = Object.keys(tierMap).length > 0 ? Object.values(tierMap) : fallbackTiers;

  const plans = sourceTiers.map((tier: any) => {
    const activeSubPlan = billingCycle === "yearly" ? (tier.yearlyPlan || tier.monthlyPlan) : (tier.monthlyPlan || tier.yearlyPlan);
    const planId = (activeSubPlan?.id || tier.name.toLowerCase().replace(/\s+/g, "-")).toString();
    const isCur = currentPlanId === planId.toLowerCase() || (subscription?.plan?.name && subscription.plan.name.toLowerCase().includes(tier.name.toLowerCase()));

    const monthlyPrice = tier.monthlyPlan ? Number(tier.monthlyPlan.price) : 0;
    const yearlyPrice = tier.yearlyPlan ? Number(tier.yearlyPlan.price) : (monthlyPrice * 10);
    const displayPrice = billingCycle === "yearly" ? yearlyPrice : monthlyPrice;

    return {
      id: planId,
      slug: tier.name.toLowerCase().replace(/\s+/g, "-"),
      name: tier.name,
      description: tier.description,
      displayPrice: `€ ${displayPrice.toLocaleString()}`,
      priceMonthlyNum: monthlyPrice,
      priceYearlyNum: yearlyPrice,
      billingCycleText: billingCycle === "yearly" ? "/ year" : "/ month",
      subNote: billingCycle === "yearly" ? `(€ ${(yearlyPrice / 12).toFixed(2)}/mo — 2 Months Free)` : null,
      popular: tier.popular,
      badgeText: tier.badge_text,
      isCurrent: isCur,
      features: tier.features || [],
      activePlanObj: activeSubPlan,
    };
  });

  const visibleHistory = showAllInvoices ? invoices : invoices.slice(0, 4);

  const columns = [
    {
      id: "id",
      label: "Invoice No.",
      render: (row: any) => (
        <div className="flex items-center gap-2">
          <Receipt className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs font-semibold text-slate-900">{row.invoice_number || row.id}</span>
        </div>
      )
    },
    { id: "date", label: "Date", render: (row: any) => <span className="text-xs text-slate-600 font-medium">{row.date || row.created_at_formatted || "N/A"}</span> },
    { id: "amount", label: "Amount", render: (row: any) => <span className="text-xs font-bold text-slate-900">{row.amount || row.total_amount_formatted || `€ ${row.total_amount || 0}`}</span> },
    {
      id: "status",
      label: "Status",
      render: (row: any) => (
        <Badge className={`text-[10px] font-semibold border ${(row.status || "").toLowerCase() === "paid" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-700 border-amber-200"
          }`}>
          {row.status || "Pending"}
        </Badge>
      )
    },
    {
      id: "actions",
      label: "Actions",
      render: (row: any) => (
        <button
          onClick={() => alert(`Downloading Receipt ${row.invoice_number || row.id}`)}
          className="text-xs text-[#ff4a1f] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
        >
          <Download className="w-3 h-3" /> Receipt
        </button>
      )
    },
  ];

  return (
    <div className="p-4 md:p-6 w-full space-y-5 bg-[#f8fafc] min-h-screen font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Subscription & Billing Plan
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Manage your active subscription plan, billing details, and corporate logistics features.
          </p>
        </div>
      </div>

      <QuotaReminderBanner quotaUsed={quotaUsed} maxQuota={5} />

      <Card className="shadow-2xs border-slate-200 dark:border-slate-800">
        <CardHeader className="py-3.5 px-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-[#181a20]/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <CardTitle className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#ff4a1f]" />
              Available Subscription Plans
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
                      onClick={() => navigate("/customer/subscription/checkout", {
                        state: {
                          plan: {
                            id: plan.id,
                            slug: plan.slug,
                            name: plan.name,
                            priceMonthly: plan.priceMonthlyNum,
                            priceYearly: plan.priceYearlyNum,
                            cycle: billingCycle,
                          }
                        }
                      })}
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

      {/* Payment Method & Company Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="shadow-2xs border-slate-200">
          <CardHeader className="py-3 px-4 border-b border-slate-100 bg-slate-50/50 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-semibold flex items-center gap-1.5 text-slate-900">
              <CreditCard className="w-4 h-4 text-[#ff4a1f]" />
              Primary Payment Method
            </CardTitle>
            <Button
              variant="outline"
              className="h-7 text-xs px-2.5 cursor-pointer"
              onClick={() => setIsPaymentModalOpen(true)}
            >
              + Add Card
            </Button>
          </CardHeader>
          <CardContent className="p-4">
            <div className="p-3.5 bg-slate-50 rounded-md border border-slate-200/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                  CARD
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-slate-900">{hasCard ? "Saved Payment Card" : "No Primary Card"}</h4>
                    {hasCard && (
                      <Badge className="bg-emerald-100 text-emerald-800 text-[9.5px] font-bold border border-emerald-200">
                        Linked
                      </Badge>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 font-normal mt-0.5">
                    {hasCard ? "Primary card active for automatic billing." : "Click Add Card to link your credit/debit card."}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsPaymentModalOpen(true)}
                className="text-xs text-[#ff4a1f] hover:underline font-semibold cursor-pointer"
              >
                {hasCard ? "Edit" : "Link"}
              </button>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-2xs border-slate-200">
          <CardHeader className="py-3 px-4 border-b border-slate-100 bg-slate-50/50 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-semibold flex items-center gap-1.5 text-slate-900">
              <Building2 className="w-4 h-4 text-[#ff4a1f]" />
              Billing Profile & Business Info
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Billed Business / Customer:</span>
              <span className="font-bold text-slate-800">{companyName}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Contact Phone:</span>
              <span className="font-bold text-slate-800">{contactPhone}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500 font-medium">Invoice Contact Email:</span>
              <span className="font-bold text-slate-800">{contactEmail}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subscription Invoices History */}
      <Card className="shadow-2xs border-slate-200">
        <CardHeader className="py-3 px-4 border-b border-slate-100 bg-slate-50/50 flex flex-row items-center justify-between">
          <CardTitle className="text-xs font-semibold flex items-center gap-1.5 text-slate-900">
            <Receipt className="w-4 h-4 text-[#ff4a1f]" />
            Subscription Invoices & Receipts
          </CardTitle>
        </CardHeader>

        <CardContent className="p-0">
          {invoices.length === 0 ? (
            <EmptyState
              icon={Receipt}
              title="No Invoices Found"
              description="Your subscription payment receipts and billing invoices will appear here."
            />
          ) : (
            <DataTable
              columns={columns}
              data={visibleHistory}
              hideViewToggle={true}
              hideToolbar={true}
              hidePagination={true}
            />
          )}
        </CardContent>
      </Card>

      <AddPaymentMethodModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onAddSuccess={() => {
          apiClient.get("/customer/profile").then(res => setProfile(res.data?.data || res.data));
        }}
      />
    </div>
  );
}
