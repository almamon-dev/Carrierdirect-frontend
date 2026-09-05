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

  // Group DB plans into 4 logical tiers
  const tierMap: Record<string, any> = {};

  if (dbPlans.length > 0) {
    dbPlans.forEach((p: any) => {
      const baseName = (p.name || "Plan").replace(/\s*\((Monthly|Yearly|Annual)\)/i, "").trim();
      const tierKey = baseName.toLowerCase();

      if (!tierMap[tierKey]) {
        tierMap[tierKey] = {
          name: baseName,
          description: p.description || (
            tierKey.includes("trial") ? "Test full shipper features with free trial access." :
            tierKey.includes("starter") ? "For occasional shippers testing regional freight." :
            tierKey.includes("growth") ? "For active businesses shipping with credit & tracking." :
            "Enterprise logistics with custom credit & dedicated fleet."
          ),
          popular: Boolean(p.is_popular || p.popular),
          badge_text: (p.is_popular || p.popular) ? "Most Popular" : null,
          features: Array.isArray(p.features) ? p.features : [],
          monthlyPlan: null,
          yearlyPlan: null,
          trialPlan: null,
        };
      }

      if (p.billing_period === "trial") {
        tierMap[tierKey].trialPlan = p;
        tierMap[tierKey].monthlyPlan = p;
        if ((!tierMap[tierKey].features || tierMap[tierKey].features.length === 0) && Array.isArray(p.features)) {
          tierMap[tierKey].features = p.features;
        }
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
      description: "Test full shipper platform features with 7 days free access.",
      popular: false,
      badge_text: null,
      monthlyPlan: { id: "trial-c", price: 0, billing_period: "trial" },
      yearlyPlan: { id: "trial-c", price: 0, billing_period: "trial" },
      features: [
        "7-Day Free Trial (No Credit Card Required)",
        "Unlimited Single Quote Requests & RFQs",
        "Multi-Carrier Quote Comparison & Review",
        "Direct Carrier Negotiation & Live Chat",
        "Secure Stripe Escrow Payments & Card Checkout",
        "Real-time Order Tracking & Digital POD",
        "Saved Address Book (Up to 5 Locations)",
        "Automated VAT Invoicing & Payment Receipts",
        "Email & System In-App Notifications",
      ]
    },
    {
      name: "Starter Shipper",
      description: "For occasional shippers testing regional freight.",
      popular: false,
      badge_text: null,
      monthlyPlan: { id: "starter-m", price: 29 },
      yearlyPlan: { id: "starter-y", price: 290 },
      features: [
        "Unlimited Single Quote Requests & RFQs",
        "Multi-Carrier Quote Comparison & Price Breakdown",
        "Direct Carrier Negotiation & Live Chat",
        "Secure Stripe Escrow Payments & Card Checkout",
        "Real-time Order Tracking & Digital POD (Challan)",
        "Saved Address Book (Up to 10 Locations)",
        "Cargo Photos & Packing List Attachments",
        "Automated VAT Invoicing & Payment Receipts",
        "Email, SMS & System Notifications",
        "Standard Customer Support (Mon - Fri)",
      ]
    },
    {
      name: "Growth Logistics",
      description: "For active businesses shipping with credit & tracking.",
      popular: true,
      badge_text: "Most Popular",
      monthlyPlan: { id: "growth-m", price: 79 },
      yearlyPlan: { id: "growth-y", price: 790 },
      features: [
        "Includes all Starter Shipper features",
        "AI-Powered Bulk RFQ Import (PDF, Excel, Images)",
        "Corporate Pay-Later Credit Line (Net 30/60 Days)",
        "Priority RFQ Broadcast to Top Verified Carriers",
        "Unlimited Saved Locations & 1-Click Rebooking",
        "Shipment Spend & Freight Cost Analytics",
        "Bulk Shipment History & Waybill Export",
        "Multi-Card Payment & Saved Billing Management",
        "Priority Operations Support",
      ]
    },
    {
      name: "Enterprise Freight Suite",
      description: "Enterprise logistics with custom credit & dedicated fleet.",
      popular: false,
      badge_text: null,
      monthlyPlan: { id: "enterprise-m", price: 199 },
      yearlyPlan: { id: "enterprise-y", price: 1990 },
      features: [
        "Includes all Growth Logistics features",
        "Custom Corporate Credit Terms (Net 90/120 Days)",
        "Multi-Department Team Roles & Procurement Approvals",
        "Specialized Freight Network (Hazmat & Temp-Controlled)",
        "Guaranteed Dedicated Vehicle Capacity & Fast Dispatch",
        "Multi-Branch Centralized Billing & Cost Center Reports",
        "Real-time Live GPS Fleet Tracking & Geofencing",
        "24/7 Dedicated Logistics Account Manager",
      ]
    }
  ];

  const sourceTiers = Object.keys(tierMap).length > 0 ? Object.values(tierMap) : fallbackTiers;

  const plans = sourceTiers.map((tier: any) => {
    const isTrial = tier.name.toLowerCase().includes("trial") || tier.trialPlan;
    const activeSubPlan = isTrial 
      ? (tier.trialPlan || tier.monthlyPlan)
      : billingCycle === "yearly" 
      ? (tier.yearlyPlan || tier.monthlyPlan) 
      : (tier.monthlyPlan || tier.yearlyPlan);
      
    const planId = (activeSubPlan?.id || tier.name.toLowerCase().replace(/\s+/g, "-")).toString();
    const isCur = currentPlanId === planId.toLowerCase() || (subscription?.plan?.name && subscription.plan.name.toLowerCase().includes(tier.name.toLowerCase()));

    const monthlyPrice = tier.monthlyPlan ? Number(tier.monthlyPlan.price) : 0;
    const yearlyPrice = tier.yearlyPlan ? Number(tier.yearlyPlan.price) : (monthlyPrice * 10);
    
    let displayPrice = "€ 0";
    let billingCycleText = "/ 7 days";
    let subNote = "100% Free — No Card Required";
    let buttonText = "Start Free Trial";

    if (!isTrial) {
      displayPrice = billingCycle === "yearly" ? `€ ${yearlyPrice.toLocaleString()}` : `€ ${monthlyPrice.toLocaleString()}`;
      billingCycleText = billingCycle === "yearly" ? "/ year" : "/ month";
      subNote = billingCycle === "yearly" ? `(€ ${(yearlyPrice / 12).toFixed(0)}/mo — 2 Mos Free)` : "";
      buttonText = "Choose Plan";
    }

    return {
      id: planId,
      slug: tier.name.toLowerCase().replace(/\s+/g, "-"),
      name: tier.name,
      description: tier.description,
      displayPrice,
      priceMonthlyNum: monthlyPrice,
      priceYearlyNum: yearlyPrice,
      billingCycleText,
      subNote,
      buttonText,
      isTrial,
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
    <div className="p-3.5 md:p-5 w-full space-y-4 bg-[#f8fafc] min-h-screen font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-200 pb-3">
        <div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight">
            Subscription & Billing Plans
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Manage your active subscription tier, billing details, and corporate logistics features.
          </p>
        </div>
      </div>

      <QuotaReminderBanner quotaUsed={quotaUsed} maxQuota={15} />

      {/* 4-Column Compact Pricing Cards */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-0.5">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#ff4a1f]" />
              Available Subscription Plans
            </h2>
          </div>

          <div className="inline-flex items-center p-0.5 bg-slate-100 dark:bg-slate-800 rounded-[3px] border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-2.5 py-1 text-xs font-semibold rounded-[3px] transition-all cursor-pointer ${
                billingCycle === "monthly"
                  ? "bg-white dark:bg-[#ff4a1f] text-slate-900 dark:text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-2.5 py-1 text-xs font-semibold rounded-[3px] transition-all flex items-center gap-1 cursor-pointer ${
                billingCycle === "yearly"
                  ? "bg-[#ff4a1f] text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              Yearly
              <span className="text-[9.5px] px-1 py-0.2 bg-emerald-100 text-emerald-800 rounded font-bold">
                -20%
              </span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-[3px] border p-4 transition-all flex flex-col justify-between ${
                  plan.isCurrent
                    ? "border-2 border-[#ff4a1f] bg-orange-50/20 dark:bg-[#ff4a1f]/5 shadow-xs"
                    : plan.popular
                    ? "border-slate-300 dark:border-slate-700 bg-white dark:bg-[#1e2329] shadow-sm hover:border-[#ff4a1f]/60"
                    : "bg-white dark:bg-[#1e2329] border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-2xs"
                }`}
              >
                {plan.popular && !plan.isCurrent && (
                  <span className="absolute -top-2.5 right-3 bg-[#ff4a1f] text-white text-[9px] font-bold px-2 py-0.5 rounded-[3px] uppercase tracking-wider shadow-xs">
                    {plan.badgeText || "Popular"}
                  </span>
                )}

                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-1">
                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                        {plan.name}
                      </h4>
                      <p className="text-[10.5px] text-slate-500 dark:text-slate-400 font-normal mt-0.5 leading-snug line-clamp-2 h-7">
                        {plan.description}
                      </p>
                    </div>
                    {plan.isCurrent && (
                      <span className="shrink-0 px-1.5 py-0.5 bg-[#ff4a1f] text-white text-[9px] font-bold rounded-[3px] uppercase tracking-wider">
                        Active
                      </span>
                    )}
                  </div>

                  <div className="pt-0.5">
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100">
                        {plan.displayPrice}
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                        {plan.billingCycleText}
                      </span>
                    </div>
                    {plan.subNote ? (
                      <p className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5 truncate">
                        {plan.subNote}
                      </p>
                    ) : (
                      <div className="h-3.5" />
                    )}
                  </div>

                  <div className="space-y-1.5 pt-2.5 border-t border-slate-100 dark:border-slate-800 max-h-[200px] overflow-y-auto">
                    {plan.features.map((feat: string, i: number) => (
                      <div key={i} className="flex items-start gap-1.5 text-[11px] text-slate-600 dark:text-slate-300 font-medium">
                        <Check className="w-3 h-3 text-[#ff4a1f] shrink-0 mt-0.5" />
                        <span className="leading-tight">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 mt-auto">
                  {plan.isCurrent ? (
                    <div className="w-full h-8 rounded-[3px] text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center gap-1">
                      <CheckCircle2 size={13} /> Active Plan
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
                      className="w-full h-8 rounded-[3px] text-xs font-semibold bg-[#ff4a1f] hover:bg-[#e03d15] text-white shadow-2xs hover:shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1"
                    >
                      {plan.buttonText}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
      </div>

      {/* Payment Method & Company Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
        <Card className="shadow-2xs border-slate-200">
          <CardHeader className="py-2.5 px-3.5 border-b border-slate-100 bg-slate-50/50 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-semibold flex items-center gap-1.5 text-slate-900">
              <CreditCard className="w-3.5 h-3.5 text-[#ff4a1f]" />
              Primary Payment Method
            </CardTitle>
            <Button
              variant="outline"
              className="h-6 text-[11px] px-2 cursor-pointer"
              onClick={() => setIsPaymentModalOpen(true)}
            >
              + Add Card
            </Button>
          </CardHeader>
          <CardContent className="p-3.5">
            <div className="p-3 bg-slate-50 rounded-[3px] border border-slate-200/80 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-[3px] bg-slate-900 text-white flex items-center justify-center font-bold text-[10px]">
                  CARD
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-bold text-slate-900">{hasCard ? "Saved Payment Card" : "No Primary Card"}</h4>
                    {hasCard && (
                      <Badge className="bg-emerald-100 text-emerald-800 text-[9px] font-bold border border-emerald-200">
                        Linked
                      </Badge>
                    )}
                  </div>
                  <p className="text-[10.5px] text-slate-500 font-normal mt-0.5">
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
          <CardHeader className="py-2.5 px-3.5 border-b border-slate-100 bg-slate-50/50 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-semibold flex items-center gap-1.5 text-slate-900">
              <Building2 className="w-3.5 h-3.5 text-[#ff4a1f]" />
              Billing Profile & Business Info
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3.5 space-y-1.5 text-xs">
            <div className="flex justify-between py-0.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Billed Business / Customer:</span>
              <span className="font-bold text-slate-800">{companyName}</span>
            </div>
            <div className="flex justify-between py-0.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Contact Phone:</span>
              <span className="font-bold text-slate-800">{contactPhone}</span>
            </div>
            <div className="flex justify-between py-0.5">
              <span className="text-slate-500 font-medium">Invoice Contact Email:</span>
              <span className="font-bold text-slate-800">{contactEmail}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subscription Invoices History */}
      <Card className="shadow-2xs border-slate-200">
        <CardHeader className="py-2.5 px-3.5 border-b border-slate-100 bg-slate-50/50 flex flex-row items-center justify-between">
          <CardTitle className="text-xs font-semibold flex items-center gap-1.5 text-slate-900">
            <Receipt className="w-3.5 h-3.5 text-[#ff4a1f]" />
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
