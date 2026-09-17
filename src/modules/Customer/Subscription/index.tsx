import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  CreditCard, CheckCircle2, Download,
  Check, Building2, Loader2, RefreshCw,
  Sparkles, Plus, Receipt
} from "lucide-react";
import Button from "@/components/ui/button";
import Badge from "@/components/ui/badge";
import Select from "@/components/ui/select";
import DataTable, { Column } from "@/components/tables/data-table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AddPaymentMethodModal } from "@/modules/Customer/Settings/components/AddPaymentMethodModal";
import QuotaReminderBanner from "@/components/common/QuotaReminderBanner";
import apiClient from "@/lib/axios";
import { useToastStore } from "@/stores/useToastStore";

interface InvoiceItem {
  id: string;
  date: string;
  description: string;
  amount: string;
  status: "Paid" | "Pending" | "Failed";
  method: string;
  rawInvoice?: any;
}

export default function CustomerSubscription() {
  const navigate = useNavigate();

  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [cycleFilter, setCycleFilter] = useState<string>("all");
  const [dbPlans, setDbPlans] = useState<any[]>([]);
  const [subscription, setSubscription] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [invoices, setInvoices] = useState<InvoiceItem[]>([]);
  const [quotaUsed, setQuotaUsed] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpgradingPlanId, setIsUpgradingPlanId] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [profRes, subRes, plansRes, invRes, reqRes] = await Promise.allSettled([
        apiClient.get("/customer/profile"),
        apiClient.get("/subscription/status"),
        apiClient.get("/subscription/plans?user_type=customer"),
        apiClient.get("/subscription/invoices"),
        apiClient.get("/customer/quote-requests"),
      ]);

      if (profRes.status === "fulfilled") {
        setProfile(profRes.value?.data?.data || profRes.value?.data || profRes.value || null);
      }
      if (subRes.status === "fulfilled") {
        setSubscription(subRes.value?.data?.data || subRes.value?.data || subRes.value || null);
      }
      if (plansRes.status === "fulfilled") {
        const rawPlans = plansRes.value?.data?.data || plansRes.value?.data?.plans || plansRes.value?.data || plansRes.value || [];
        if (Array.isArray(rawPlans) && rawPlans.length > 0) {
          setDbPlans(rawPlans);
        }
      }
      if (reqRes.status === "fulfilled") {
        const rawItems = reqRes.value?.data?.data || reqRes.value?.data || [];
        if (Array.isArray(rawItems)) setQuotaUsed(rawItems.length);
      }
      if (invRes.status === "fulfilled") {
        const rawInv = invRes.value?.data?.data || invRes.value?.data || invRes.value || [];
        const items = Array.isArray(rawInv) ? rawInv : (rawInv?.data || []);
        if (Array.isArray(items) && items.length > 0) {
          const mapped: InvoiceItem[] = items.map((inv: any) => ({
            id: inv.invoice_number || `SUB-${String(inv.id).padStart(5, "0")}`,
            date: inv.date || (inv.created_at ? new Date(inv.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "Recently"),
            description: inv.description || `${inv.plan_name || "Shipper Plan"} (${inv.billing_period || "Monthly"})`,
            amount: inv.amount || `€${parseFloat(inv.total_amount || inv.raw_amount || 0).toFixed(2)}`,
            status: (inv.status === "Paid" || inv.status === "paid") ? "Paid" : (inv.status === "Pending" || inv.status === "pending" ? "Pending" : "Paid"),
            method: inv.method || "Credit Card (Stripe)",
            rawInvoice: inv,
          }));
          setInvoices(mapped);
        } else {
          setInvoices([]);
        }
      }
    } catch (err) {
      console.error("Failed to load customer subscription data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const companyName = profile?.company_name || profile?.business_name || profile?.user?.company_name || profile?.name || "Company Profile Not Set";
  const vatNumber = profile?.vat_number || profile?.tax_id || profile?.user?.vat_number || "Not Provided";
  const billingEmail = profile?.billing_email || profile?.email || profile?.user?.email || "Not Provided";
  const contactPhone = profile?.phone || profile?.user?.phone || "Not Provided";
  const hasCard = Boolean(profile?.has_saved_card || profile?.user?.has_saved_card || profile?.card_last4);

  // Dynamic Tiers
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
            tierKey.includes("growth") ? "For active businesses shipping with credit & live tracking." :
            "Enterprise logistics with custom credit & dedicated freight lanes."
          ),
          popular: Boolean(p.is_popular || p.popular || tierKey.includes("growth")),
          badge_text: (p.is_popular || p.popular) ? "Most Popular" : (tierKey.includes("growth") ? "Most Popular" : null),
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
      description: "Test full shipper platform features with 7 days free access.",
      popular: false,
      badge_text: null,
      trialPlan: { id: "trial-c", price: 0 },
      features: [
        "7-Day Free Trial (No Credit Card Required)",
        "Unlimited Quote Requests & RFQs",
        "Multi-Carrier Quote Comparison & Bidding",
        "Direct Carrier Negotiation & Live Chat",
        "Secure Stripe Escrow Payments Protection",
        "Real-time Cargo Tracking & Digital PODs",
        "Saved Address Book (Up to 5 Locations)",
        "Standard Email & Web Notifications"
      ]
    },
    {
      name: "Starter Shipper",
      description: "For occasional shippers testing regional road freight.",
      popular: false,
      badge_text: null,
      monthlyPlan: { id: "starter-m", price: 29 },
      yearlyPlan: { id: "starter-y", price: 290 },
      features: [
        "Up to 25 Active Quote Requests / Month",
        "Carrier Quote Comparison & Instant Booking",
        "Direct Carrier Messaging & Chat Negotiation",
        "Standard Escrow Payment Security",
        "Address Book (Up to 25 Locations)",
        "Automated Digital Invoices & Receipts",
        "Live Delivery Status & Handover Signatures",
        "Standard Email & Chat Support"
      ]
    },
    {
      name: "Growth Logistics",
      description: "For active businesses shipping with credit & priority carrier matching.",
      popular: true,
      badge_text: "Most Popular",
      monthlyPlan: { id: "growth-m", price: 79 },
      yearlyPlan: { id: "growth-y", price: 790 },
      features: [
        "Unlimited Quote Requests & Fast-Track Dispatch",
        "Top Priority Listing to Verified Carriers",
        "Pay Later 30-Day Corporate Credit Line",
        "Multi-User Team Management (Up to 5 Staff)",
        "Automated VAT Invoicing & Monthly Ledger",
        "Bulk CSV Quote Import & Template Downloads",
        "Advanced Analytics & Freight Spend Reporting",
        "Priority Customer Support"
      ]
    },
    {
      name: "Enterprise Shipper",
      description: "Custom enterprise logistics with guaranteed capacity & dedicated support.",
      popular: false,
      badge_text: null,
      monthlyPlan: { id: "ent-c-m", price: 199 },
      yearlyPlan: { id: "ent-c-y", price: 1990 },
      features: [
        "Includes all Growth Logistics features",
        "Unlimited Staff Accounts & Granular Permissions",
        "Custom Pay Later Credit Limits & Terms",
        "Dedicated Freight Lanes & Carrier Contracting",
        "API Integration for Automated Order Creation",
        "Custom ERP & Logistics Webhooks",
        "24/7 Dedicated Logistics Account Manager"
      ]
    }
  ];

  const tiersList = Object.keys(tierMap).length > 0 ? Object.values(tierMap) : fallbackTiers;

  // Active Plan determination
  const currentPlanName = (subscription?.plan_name || subscription?.pricing_plan?.name || "7-Day Free Trial").toLowerCase();

  const plans = tiersList.map((tier) => {
    const isCurrent = tier.name.toLowerCase().includes(currentPlanName) ||
      (currentPlanName.includes("trial") && tier.name.toLowerCase().includes("trial")) ||
      (currentPlanName.includes("starter") && tier.name.toLowerCase().includes("starter")) ||
      (currentPlanName.includes("growth") && tier.name.toLowerCase().includes("growth")) ||
      (currentPlanName.includes("enterprise") && tier.name.toLowerCase().includes("enterprise"));

    let displayPrice = "Free";
    let billingCycleText = "for 7 days";
    let subNote = "No credit card required";
    let planId = tier.trialPlan?.id || "trial";
    let priceMonthlyNum = 0;
    let priceYearlyNum = 0;

    if (tier.monthlyPlan || tier.yearlyPlan) {
      priceMonthlyNum = parseFloat(tier.monthlyPlan?.price || 0);
      priceYearlyNum = parseFloat(tier.yearlyPlan?.price || priceMonthlyNum * 10);

      if (billingCycle === "yearly" && tier.yearlyPlan) {
        displayPrice = `€${priceYearlyNum.toFixed(0)}`;
        billingCycleText = "/ year";
        subNote = "Billed annually • Save 20%";
        planId = tier.yearlyPlan.id;
      } else {
        displayPrice = `€${priceMonthlyNum.toFixed(0)}`;
        billingCycleText = "/ month";
        subNote = "Billed monthly";
        planId = tier.monthlyPlan?.id || "pro-m";
      }
    }

    return {
      ...tier,
      isCurrent,
      displayPrice,
      billingCycleText,
      subNote,
      planId,
      priceMonthlyNum,
      priceYearlyNum,
      badgeText: tier.badge_text || (tier.popular ? "Most Popular" : null),
    };
  });

  // Handle Plan Selection / Upgrade
  const handleSelectPlan = async (plan: any) => {
    setIsUpgradingPlanId(plan.planId);
    try {
      const res: any = await apiClient.post("/subscription/checkout-link", {
        plan_id: plan.planId,
        billing_cycle: billingCycle,
      });
      const url = res?.checkout_url || res?.data?.checkout_url || res?.data?.data?.checkout_url;
      if (url) {
        window.location.href = url;
      } else {
        navigate("/customer/subscription/checkout", {
          state: {
            plan: {
              id: plan.planId,
              name: plan.name,
              priceMonthly: plan.priceMonthlyNum,
              priceYearly: plan.priceYearlyNum,
              cycle: billingCycle,
            }
          }
        });
      }
    } catch (err: any) {
      navigate("/customer/subscription/checkout", {
        state: {
          plan: {
            id: plan.planId,
            name: plan.name,
            priceMonthly: plan.priceMonthlyNum,
            priceYearly: plan.priceYearlyNum,
            cycle: billingCycle,
          }
        }
      });
    } finally {
      setIsUpgradingPlanId(null);
    }
  };

  // Handle PDF Receipt Download
  const handleDownloadReceipt = async (item: InvoiceItem) => {
    const targetId = item.rawInvoice?.id || item.rawInvoice?.invoice_number || item.id;
    setDownloadingId(item.id);
    try {
      const token =
        localStorage.getItem("carrierdirect_access_token") ||
        localStorage.getItem("access_token") ||
        localStorage.getItem("token") ||
        "";

      let base = apiClient["baseURL"] || "";
      if (!base || base.startsWith("/")) {
        const storedApiUrl = localStorage.getItem("carrierdirect_api_url") || localStorage.getItem("api_url");
        if (storedApiUrl) {
          base = storedApiUrl.replace(/\/api\/?$/, "") + "/api";
        } else if (typeof window !== "undefined" && window.location.hostname === "localhost") {
          base = "http://localhost:8000/api";
        }
      }

      const downloadUrl = `${base}/subscription/invoices/${targetId}/download`;

      const res = await fetch(downloadUrl, {
        method: "GET",
        headers: {
          Accept: "application/pdf",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          "ngrok-skip-browser-warning": "69420",
        },
      });

      if (!res.ok) {
        throw new Error(`Failed to download PDF receipt (Status: ${res.status})`);
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Receipt-${item.rawInvoice?.invoice_number || item.id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);

      useToastStore.getState().showToast(`Receipt downloaded: ${item.id}`, "success");
    } catch (err: any) {
      console.error("Receipt download error:", err);
      useToastStore.getState().showToast(err.message || "Failed to download receipt PDF", "error");
    } finally {
      setDownloadingId(null);
    }
  };

  // Invoice Filters & Options
  const statusOptions = [
    { id: "all", name: "All Statuses" },
    { id: "paid", name: "Paid" },
    { id: "pending", name: "Pending" },
    { id: "failed", name: "Failed" },
  ];

  const cycleOptions = [
    { id: "all", name: "All Cycles" },
    { id: "monthly", name: "Monthly Plans" },
    { id: "yearly", name: "Yearly Plans" },
  ];

  const filteredInvoices = invoices.filter((inv) => {
    if (statusFilter !== "all" && inv.status.toLowerCase() !== statusFilter.toLowerCase()) {
      return false;
    }
    if (cycleFilter !== "all") {
      const desc = (inv.description || "").toLowerCase();
      if (!desc.includes(cycleFilter.toLowerCase())) {
        return false;
      }
    }
    return true;
  });

  const filterContent = (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 py-1">
      <div className="flex flex-col gap-1">
        <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
          Payment Status
        </label>
        <Select
          value={statusFilter}
          onChange={(opt) => setStatusFilter(typeof opt === "object" ? opt.id : opt)}
          options={statusOptions}
          showSearch={false}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
          Billing Cycle
        </label>
        <Select
          value={cycleFilter}
          onChange={(opt) => setCycleFilter(typeof opt === "object" ? opt.id : opt)}
          options={cycleOptions}
          showSearch={false}
        />
      </div>

      {(statusFilter !== "all" || cycleFilter !== "all") && (
        <div className="flex items-end pb-1">
          <button
            type="button"
            onClick={() => {
              setStatusFilter("all");
              setCycleFilter("all");
            }}
            className="text-xs font-bold text-[#ff4a1f] hover:underline cursor-pointer flex items-center gap-1"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );

  // Invoice Columns
  const columns: Column<InvoiceItem>[] = [
    {
      id: "id",
      label: "Invoice Reference",
      className: "font-mono font-bold text-xs text-slate-800 dark:text-slate-200",
      render: (item) => item.id,
    },
    {
      id: "date",
      label: "Billing Date",
      className: "text-xs text-slate-600 dark:text-slate-400 font-medium",
      render: (item) => item.date,
    },
    {
      id: "description",
      label: "Description",
      className: "text-xs text-slate-800 dark:text-slate-200 font-medium",
      render: (item) => item.description,
    },
    {
      id: "amount",
      label: "Amount",
      className: "text-xs font-bold text-slate-900 dark:text-slate-100",
      render: (item) => item.amount,
    },
    {
      id: "method",
      label: "Payment Method",
      className: "text-xs text-slate-500 font-normal",
      render: (item) => item.method,
    },
    {
      id: "status",
      label: "Status",
      render: (item) => (
        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-[3px]">
          <CheckCircle2 size={11} /> {item.status}
        </span>
      ),
    },
    {
      id: "receipt",
      label: "Receipt",
      render: (item) => (
        <button
          type="button"
          disabled={downloadingId === item.id}
          onClick={() => handleDownloadReceipt(item)}
          className="text-xs text-[#ff4a1f] hover:text-[#e03e15] font-bold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {downloadingId === item.id ? (
            <>
              <Loader2 size={13} className="animate-spin text-[#ff4a1f]" />
              <span className="text-[11px]">Generating...</span>
            </>
          ) : (
            <>
              <Download size={13} />
              <span>PDF Receipt</span>
            </>
          )}
        </button>
      ),
    },
  ];

  return (
    <div className="p-3 sm:p-4 md:p-5 w-full min-w-full space-y-4 min-h-screen pb-14 font-sans antialiased bg-[#f8fafc] dark:bg-[#12161c]">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight mb-1">
              Subscription & Billing Plans
            </h1>
            <Badge className="bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold rounded-[3px] border border-emerald-200">
              Active Shipper Account
            </Badge>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Manage your active subscription tier, corporate credit lines, and freight booking tools.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={loadData}
            disabled={isLoading}
            className="h-8 px-3 text-xs bg-white dark:bg-[#181d24] border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer flex items-center gap-1.5"
            title="Refresh Data"
          >
            <RefreshCw size={13} className={isLoading ? "animate-spin text-[#ff4a1f]" : "text-slate-500"} />
            <span>Refresh</span>
          </Button>
        </div>
      </div>

      {/* Quota Banner */}
      <QuotaReminderBanner quotaUsed={quotaUsed} maxQuota={25} />

      {/* Active Subscription Status Banner */}
      {subscription && (
        <div className="w-full bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-transparent border border-orange-200/80 dark:border-orange-900/30 rounded-[4px] p-3 sm:p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-[4px] bg-[#ff4a1f] text-white flex items-center justify-center font-bold text-sm shadow-2xs shrink-0">
              ★
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  Current Plan: <span className="text-[#ff4a1f]">{subscription.plan_name || subscription.name || "Growth Logistics"}</span>
                </span>
                <span className="inline-flex items-center gap-1 text-[9.5px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded">
                  <Check size={10} /> Active
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                {subscription.expires_at ? `Renews / valid until ${new Date(subscription.expires_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}` : "Continuous active logistics subscription"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-slate-600 dark:text-slate-400 font-medium hidden sm:inline">
              Need higher freight volume?
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                const plansSection = document.getElementById("plans-section");
                if (plansSection) plansSection.scrollIntoView({ behavior: "smooth" });
              }}
              className="h-7 text-xs font-bold border-[#ff4a1f] text-[#ff4a1f] hover:bg-orange-50 dark:hover:bg-orange-950/20 rounded-[3px] cursor-pointer"
            >
              Upgrade Tier
            </Button>
          </div>
        </div>
      )}

      {/* Primary Payment Method & Business Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
        
        {/* Primary Payment Method Card */}
        <Card className="shadow-2xs border-slate-200 dark:border-slate-800 rounded-[4px] w-full">
          <CardHeader className="py-2.5 px-3.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex flex-row items-center justify-between rounded-t-[4px]">
            <CardTitle className="text-xs font-semibold flex items-center gap-1.5 text-slate-900 dark:text-slate-100">
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
          <CardContent className="p-3 sm:p-3.5">
            <div className="p-3 bg-slate-50 dark:bg-[#151921] rounded-[3px] border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-[4px] bg-slate-900 text-white flex items-center justify-center font-bold text-[10px] shrink-0 shadow-2xs">
                  CARD
                </div>
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      {hasCard ? "Linked Payment Card" : "No Card Linked"}
                    </h4>
                    {hasCard && (
                      <Badge className="bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[9px] font-bold border border-emerald-200 dark:border-emerald-800">
                        Primary Active
                      </Badge>
                    )}
                  </div>
                  <p className="text-[10.5px] text-slate-500 dark:text-slate-400 font-normal mt-0.5">
                    {hasCard ? "Linked card is active for automatic subscription renewals and instant booking." : "Add a payment card to enable instant bookings and subscription renewals."}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsPaymentModalOpen(true)}
                className="text-xs text-[#ff4a1f] hover:underline font-bold cursor-pointer shrink-0 ml-2"
              >
                {hasCard ? "Edit" : "Link Card"}
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Shipper Business Details Card */}
        <Card className="shadow-2xs border-slate-200 dark:border-slate-800 rounded-[4px] w-full">
          <CardHeader className="py-2.5 px-3.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex flex-row items-center justify-between rounded-t-[4px]">
            <CardTitle className="text-xs font-semibold flex items-center gap-1.5 text-slate-900 dark:text-slate-100">
              <Building2 className="w-3.5 h-3.5 text-[#ff4a1f]" />
              Shipper Business & Invoicing Details
            </CardTitle>
            <button
              type="button"
              onClick={() => navigate("/customer/settings")}
              className="text-xs font-bold text-[#ff4a1f] hover:underline cursor-pointer"
            >
              Edit Details
            </button>
          </CardHeader>
          <CardContent className="p-3 sm:p-3.5 space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 font-medium">Billed Company / Shipper:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{companyName}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 font-medium">VAT / Tax ID:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{vatNumber}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500 font-medium">Invoice Contact Email:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{billingEmail}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Direct Standard DataTable for Subscription Billing History & Receipts */}
      <div className="space-y-2 pt-1 w-full">
        <div className="flex items-center justify-between px-0.5">
          <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">
            Subscription Billing History & Downloadable Receipts
          </h3>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            {filteredInvoices.length} of {invoices.length} {invoices.length === 1 ? "receipt" : "receipts"} recorded
          </span>
        </div>
        <DataTable
          columns={columns}
          data={filteredInvoices}
          compact={true}
          searchPlaceholder="Search invoices by reference, date, plan..."
          hideViewToggle={true}
          isLoading={isLoading}
          keyExtractor={(item) => item.id}
          filterContent={filterContent}
        />
      </div>

      {/* Stripe-Style Pricing Section (Clean, Aligned, Full-Width) */}
      <div id="plans-section" className="space-y-4 pt-3 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              Select Subscription Tier
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-normal mt-0.5">
              Choose the optimal plan to streamline your freight quotes and logistics operations
            </p>
          </div>

          {/* Stripe-Style Billing Switcher */}
          <div className="inline-flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-[4px] border border-slate-200 dark:border-slate-700 shrink-0">
            <button
              type="button"
              onClick={() => setBillingCycle("monthly")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-[3px] transition-all cursor-pointer ${
                billingCycle === "monthly"
                  ? "bg-white dark:bg-[#1e2329] text-slate-900 dark:text-slate-100 shadow-xs font-bold"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              Monthly Billed
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle("yearly")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-[3px] transition-all flex items-center gap-1.5 cursor-pointer ${
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
        </div>

        {/* Stripe-Style Pricing Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 w-full items-stretch">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className="relative rounded-[6px] border border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 p-4 sm:p-5 transition-all flex flex-col justify-between w-full bg-white dark:bg-[#181d24] shadow-xs hover:shadow-sm"
            >
              <div>
                {/* Plan Header */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight">{plan.name}</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-normal mt-0.5 leading-relaxed min-h-[30px]">{plan.description}</p>
                  </div>
                  {plan.isCurrent ? (
                    <span className="shrink-0 px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold rounded tracking-wider">
                      Active
                    </span>
                  ) : plan.popular ? (
                    <span className="shrink-0 px-2 py-0.5 bg-orange-50 dark:bg-orange-950/50 border border-orange-200 dark:border-orange-800 text-[#ff4a1f] text-[10px] font-bold rounded tracking-wider">
                      {plan.badgeText || "Most Popular"}
                    </span>
                  ) : null}
                </div>

                {/* Price Display */}
                <div className="pt-2 pb-3">
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

                {/* Stripe-Style CTA Button */}
                <div className="pt-1 pb-4">
                  {plan.isCurrent ? (
                    <div className="w-full h-9 rounded-[3px] text-xs font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center gap-1.5">
                      <CheckCircle2 size={14} /> Current Active Plan
                    </div>
                  ) : (
                    <button
                      type="button"
                      disabled={isUpgradingPlanId === plan.planId}
                      onClick={() => handleSelectPlan(plan)}
                      className={`w-full h-9 rounded-[3px] text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 disabled:opacity-50 ${
                        plan.popular
                          ? "bg-[#ff4a1f] hover:bg-[#e03d15] text-white shadow-xs"
                          : "bg-slate-900 hover:bg-black dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 shadow-xs"
                      }`}
                    >
                      {isUpgradingPlanId === plan.planId ? (
                        <span className="flex items-center gap-1.5">
                          <Loader2 size={13} className="animate-spin" /> Processing...
                        </span>
                      ) : (
                        "Choose Plan"
                      )}
                    </button>
                  )}
                </div>

                {/* Features Section (Under Divider) */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-wider block">
                    WHAT'S INCLUDED
                  </span>
                  <div className="space-y-2.5">
                    {plan.features?.map((feat: string, i: number) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300 font-medium">
                        <div className="w-4 h-4 rounded-full bg-[#ff4a1f] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                          <Check size={10} strokeWidth={3} />
                        </div>
                        <span className="leading-tight pt-0.5">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>

      <AddPaymentMethodModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onAddSuccess={() => {
          loadData();
        }}
      />
    </div>
  );
}
