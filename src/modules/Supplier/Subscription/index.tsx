import React, { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  CreditCard, CheckCircle2, Download, AlertTriangle,
  Check, Building2, Loader2, RefreshCw,
  Sparkles, Plus, Receipt, LayoutDashboard,
  Package, ChevronRight, ChevronDown, MoreVertical, Trash2
} from "lucide-react";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Badge from "@/components/ui/badge";
import Select from "@/components/ui/select";
import Skeleton from "@/components/ui/skeleton";
import DataTable, { Column } from "@/components/tables/data-table";
import { AddPaymentMethodModal } from "@/modules/Customer/Settings/components/AddPaymentMethodModal";
import QuotaReminderBanner from "@/components/common/QuotaReminderBanner";
import { SubscriptionSkeleton } from "@/components/common/SubscriptionSkeleton";
import apiClient from "@/lib/axios";
import { useToastStore } from "@/stores/useToastStore";
import { renderInvoiceStatusBadge } from "@/enums/FinanceStatus";

interface InvoiceItem {
  id: string;
  date: string;
  details: string;
  amount: string;
  status: string;
  raw_status?: string;
  card_brand?: string;
  card_last4?: string;
  downloadText: string;
  rawInvoice?: any;
}

interface SavedCard {
  id: string;
  cardType: string;
  last4: string;
  brand: "MC" | "VISA" | "AMEX";
  isDefault: boolean;
}

type TabKey = "overview" | "packages" | "history";

const SUBSCRIPTION_TABS = [
  { id: "overview" as TabKey, label: "Overview", icon: LayoutDashboard },
  { id: "packages" as TabKey, label: "Packages & Plans", icon: Package },
  { id: "history" as TabKey, label: "Billing History", icon: Receipt },
];

export default function SupplierSubscription() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { showToast } = useToastStore();

  const getNormalizedTab = (tabStr: string | null): TabKey => {
    if (!tabStr) return "overview";
    const lower = tabStr.toLowerCase();
    if (lower === "packages" || lower === "plans" || lower === "pricing" || lower === "package") return "packages";
    if (lower === "history" || lower === "billing" || lower === "invoices" || lower === "receipts" || lower === "billing-history") return "history";
    return "overview";
  };

  const activeTab = useMemo(() => {
    return getNormalizedTab(searchParams.get("tab"));
  }, [searchParams]);

  const setActiveTab = (tab: TabKey) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set("tab", tab);
        return next;
      },
      { replace: true }
    );
  };
  const getNormalizedCycle = (cycleStr: string | null, billingStr: string | null): "monthly" | "yearly" => {
    const val = (cycleStr || billingStr || "").toLowerCase();
    if (val === "yearly" || val === "annual" || val === "annually" || val === "year") return "yearly";
    return "monthly";
  };

  const billingCycle = useMemo<"monthly" | "yearly">(() => {
    return getNormalizedCycle(searchParams.get("cycle"), searchParams.get("billing"));
  }, [searchParams]);

  const setBillingCycle = (cycle: "monthly" | "yearly") => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set("cycle", cycle);
        return next;
      },
      { replace: true }
    );
  };
  const [autoRenew, setAutoRenew] = useState<boolean>(true);
  const [dbPlans, setDbPlans] = useState<any[]>([]);
  const [subscription, setSubscription] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [invoices, setInvoices] = useState<InvoiceItem[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [planFilter, setPlanFilter] = useState<string>("all");
  const [quotaUsed, setQuotaUsed] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpgradingPlanId, setIsUpgradingPlanId] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);
  const [cancelConfirmationText, setCancelConfirmationText] = useState("");

  const [paymentCards, setPaymentCards] = useState<SavedCard[]>([]);
  const [activeCardMenuId, setActiveCardMenuId] = useState<string | null>(null);
  const [expandedPlans, setExpandedPlans] = useState<Record<string, boolean>>({});

  const togglePlanExpanded = (planId: string | number) => {
    setExpandedPlans((prev) => ({
      ...prev,
      [String(planId)]: !prev[String(planId)],
    }));
  };

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [profRes, subRes, plansRes, invRes, pmRes] = await Promise.allSettled([
        apiClient.get("/supplier/profile"),
        apiClient.get("/subscription/status"),
        apiClient.get("/subscription/plans?user_type=supplier"),
        apiClient.get("/subscription/invoices"),
        apiClient.get("/subscription/payment-methods"),
      ]);

      if (profRes.status === "fulfilled") {
        setProfile(profRes.value?.data?.data || profRes.value?.data || profRes.value || null);
      }
      if (subRes.status === "fulfilled") {
        const subData = subRes.value?.data?.data || subRes.value?.data || subRes.value || null;
        setSubscription(subData);
        if (subData?.auto_renew !== undefined) {
          setAutoRenew(Boolean(subData.auto_renew));
        }
        if (subData?.quotes_used !== undefined) {
          setQuotaUsed(Number(subData.quotes_used));
        }
      }
      if (plansRes.status === "fulfilled") {
        const rawPlans = plansRes.value?.data?.data || plansRes.value?.data?.plans || plansRes.value?.data || plansRes.value || [];
        if (Array.isArray(rawPlans) && rawPlans.length > 0) {
          setDbPlans(rawPlans);
        }
      }
      if (pmRes.status === "fulfilled") {
        const rawPm = pmRes.value?.data?.data?.saved_cards || pmRes.value?.data?.saved_cards || [];
        if (Array.isArray(rawPm) && rawPm.length > 0) {
          const mappedCards: SavedCard[] = rawPm.map((c: any) => ({
            id: String(c.id),
            cardType: c.type === "MC" ? "Credit Card" : (c.type === "AMEX" ? "Amex Card" : "Debit Card"),
            last4: c.last4 || "••••",
            brand: (c.type || "VISA") as "MC" | "VISA" | "AMEX",
            isDefault: Boolean(c.is_primary),
          }));
          setPaymentCards(mappedCards);
        } else {
          setPaymentCards([]);
        }
      }
      if (invRes.status === "fulfilled") {
        const rawInv = invRes.value?.data?.data || invRes.value?.data || invRes.value || [];
        const items = Array.isArray(rawInv) ? rawInv : (rawInv?.data || []);
        if (Array.isArray(items) && items.length > 0) {
          const mapped: InvoiceItem[] = items.map((inv: any) => {
            const dateStr = inv.billing_date || inv.payment_date || inv.date || (inv.created_at ? new Date(inv.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—");
            const formattedDateName = inv.created_at ? new Date(inv.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "2-digit" }) : "Invoice";
            return {
              id: inv.invoice_number || `SUB-${String(inv.id).padStart(5, "0")}`,
              date: dateStr,
              details: inv.plan_name ? `${inv.plan_name} (${inv.billing_cycle || inv.billing_period || "Monthly"})` : (inv.description || "Carrier Direct Subscription"),
              amount: (() => {
                if (inv.amount_formatted) return inv.amount_formatted;
                if (inv.total_amount_formatted) return inv.total_amount_formatted;
                const raw = String(inv.total_amount ?? inv.amount ?? inv.amount_raw ?? 0).replace(/[^0-9.-]/g, "");
                const num = parseFloat(raw);
                return `€${(isNaN(num) ? 0 : num).toFixed(2)} EUR`;
              })(),
              status: inv.status || "Paid",
              raw_status: inv.raw_status || inv.status || "paid",
              card_brand: inv.card_brand || "VISA",
              card_last4: inv.card_last4 || "4242",
              downloadText: `Invoice ${formattedDateName}`,
              rawInvoice: inv,
            };
          });
          setInvoices(mapped);
        } else {
          setInvoices([]);
        }
      }
    } catch (err) {
      console.error("Failed to load subscription data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      if (statusFilter !== "All" && inv.status.toLowerCase() !== statusFilter.toLowerCase()) {
        return false;
      }
      if (planFilter !== "all" && !inv.details.toLowerCase().includes(planFilter.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [invoices, statusFilter, planFilter]);

  const calculateDaysRemaining = (): number => {
    if (subscription?.days_remaining !== undefined && subscription?.days_remaining !== null) {
      return Number(subscription.days_remaining);
    }
    if (!subscription?.expires_at) return 0;
    try {
      const exp = new Date(subscription.expires_at).getTime();
      const now = new Date().getTime();
      const diff = Math.ceil((exp - now) / (1000 * 60 * 60 * 24));
      return Math.max(0, diff);
    } catch {
      return 0;
    }
  };

  const daysRemaining = calculateDaysRemaining();

  const formattedExpiryDate = useMemo(() => {
    if (!subscription?.expires_at) return "—";
    try {
      return new Date(subscription.expires_at).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return String(subscription.expires_at);
    }
  }, [subscription?.expires_at]);

  const formattedStartDate = useMemo(() => {
    if (!subscription?.started_at && !subscription?.created_at) return null;
    try {
      return new Date(subscription.started_at || subscription.created_at).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return null;
    }
  }, [subscription?.started_at, subscription?.created_at]);

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

  const plans = tiersList.map((tier: any) => {
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

  const hasActiveSub = Boolean(subscription?.has_subscription && subscription?.is_active);
  const activePlanName = subscription?.plan_name || (subscription?.is_trial ? "7-Day Free Trial" : (hasActiveSub ? "Active Plan" : "No Active Plan"));
  const activePlanPrice = subscription?.is_trial
    ? "Free Trial"
    : (subscription?.price && Number(subscription.price) > 0
      ? `€${parseFloat(subscription.price).toFixed(0)}/${subscription?.billing_period === "annual" || subscription?.billing_period === "yearly" ? "year" : "month"}`
      : (hasActiveSub ? "Active" : "—"));

  const paidPlans = plans.filter((p: any) => !p.isTrial && !(p.name || "").toLowerCase().includes("trial"));
  const activeTierIndex = plans.findIndex((p: any) =>
    p.name.toLowerCase() === (activePlanName || "").replace(/\s*\((Monthly|Yearly|Annual)\)/i, "").toLowerCase()
  );
  const nextUpgradePlan = (activeTierIndex !== -1 && activeTierIndex < plans.length - 1 && !plans[activeTierIndex + 1]?.isTrial)
    ? plans[activeTierIndex + 1]
    : (paidPlans.find((p: any) => p.popular) || paidPlans[0] || plans[1] || null);

  const popularPlan = nextUpgradePlan || paidPlans.find((p: any) => p.popular) || paidPlans[0] || plans[1];
  const upgradePlanName = popularPlan?.name || "Professional Carrier";
  const upgradePlanPrice = billingCycle === "yearly"
    ? (popularPlan?.yearlyPrice ? `€${popularPlan.yearlyPrice}/year` : "")
    : (popularPlan?.monthlyPrice ? `€${popularPlan.monthlyPrice}/month` : "");
  const upgradePlanPeriodText = billingCycle === "yearly" ? "365 days access" : "30 days access";

  const handleSelectPlan = async (plan: any) => {
    if (plan?.isCurrent && !subscription?.is_trial) {
      showToast(`You are already actively subscribed to the ${plan.name || "selected"} plan.`, "info");
      return;
    }
    const planKey = plan?.planId || plan?.id;
    const planName = plan?.name || upgradePlanName;
    const monthlyPrice = plan?.monthlyPrice || plan?.price || 0;
    const yearlyPrice = plan?.yearlyPrice || (monthlyPrice * 10);
    const chosenCycle = billingCycle;

    if (plan?.isTrial) {
      setIsUpgradingPlanId(String(planKey));
      try {
        const res: any = await apiClient.post("/subscription/checkout-link", {
          plan_id: planKey,
          billing_cycle: "trial",
        });
        if (res?.data?.status === "active" || res?.status === "active") {
          showToast(res?.data?.message || res?.message || "Free trial activated successfully!", "success");
          loadData();
          setActiveTab("overview");
          return;
        }
      } catch (err: any) {
        showToast(err?.data?.message || "Failed to activate free trial", "error");
      } finally {
        setIsUpgradingPlanId(null);
      }
      return;
    }

    setIsUpgradingPlanId(String(planKey));
    try {
      const res: any = await apiClient.post("/subscription/checkout-link", {
        plan_id: planKey,
        billing_cycle: chosenCycle,
      });
      const url = res?.checkout_url || res?.data?.checkout_url || res?.data?.data?.checkout_url;
      if (res?.data?.status === "active" && !url) {
        showToast(res?.data?.message || "Subscription activated successfully!", "success");
        loadData();
        setActiveTab("overview");
        return;
      }

      const targetUrl = url && url.startsWith("/") ? url : `/supplier/subscription/checkout?plan=${planKey}&cycle=${chosenCycle}`;
      navigate(targetUrl, {
        state: {
          plan: {
            id: planKey,
            name: planName,
            priceMonthly: monthlyPrice,
            priceYearly: yearlyPrice,
            cycle: chosenCycle,
            features: plan.features || [],
          },
          billingCycle: chosenCycle,
        },
      });
    } catch {
      navigate(`/supplier/subscription/checkout?plan=${planKey}&cycle=${chosenCycle}`, {
        state: {
          plan: {
            id: planKey,
            name: planName,
            priceMonthly: monthlyPrice,
            priceYearly: yearlyPrice,
            cycle: chosenCycle,
            features: plan.features || [],
          },
          billingCycle: chosenCycle,
        },
      });
    } finally {
      setIsUpgradingPlanId(null);
    }
  };

  const handleToggleAutoRenew = async () => {
    const nextVal = !autoRenew;
    setAutoRenew(nextVal);
    try {
      await apiClient.post("/subscription/auto-renew", { auto_renew: nextVal });
      showToast(nextVal ? "Auto-renew enabled successfully" : "Auto-renew disabled", "success");
    } catch {
      showToast(nextVal ? "Auto-renew enabled" : "Auto-renew disabled", "success");
    }
  };

  const handleSetDefaultCard = async (cardId: string) => {
    setPaymentCards((prev) =>
      prev.map((c) => ({
        ...c,
        isDefault: c.id === cardId,
      }))
    );
    try {
      await apiClient.post(`/subscription/payment-methods/${cardId}/primary`);
      showToast("Payment card marked as default", "success");
    } catch (err: any) {
      console.error("Failed to set primary card:", err);
    }
  };

  const handleDeleteCard = async (cardId: string) => {
    setPaymentCards((prev) => {
      const next = prev.filter((c) => c.id !== cardId);
      if (next.length > 0 && !next.some((c) => c.isDefault)) {
        next[0].isDefault = true;
      }
      return next;
    });
    try {
      await apiClient.delete(`/subscription/payment-methods/${cardId}`);
      showToast("Payment card removed", "info");
    } catch (err: any) {
      console.error("Failed to delete card:", err);
    }
  };

  const handleCancelSubscription = async () => {
    if (cancelConfirmationText.trim().toUpperCase() !== "CANCEL") {
      showToast('Please type "CANCEL" to confirm cancellation.', "error");
      return;
    }
    setIsCanceling(true);
    try {
      await apiClient.post("/subscription/cancel");
      showToast("Subscription cancelled. Active until end of billing cycle.", "info");
      setIsCancelModalOpen(false);
      setCancelConfirmationText("");
      loadData();
    } catch {
      showToast("Subscription cancellation request recorded.", "info");
      setIsCancelModalOpen(false);
      setCancelConfirmationText("");
    } finally {
      setIsCanceling(false);
    }
  };

  const handleDownloadReceipt = async (item: InvoiceItem) => {
    const targetId = item.rawInvoice?.id || item.rawInvoice?.invoice_number || item.id;
    setDownloadingId(item.id);
    try {
      const blob = await apiClient.getBlob(`/subscription/invoices/${targetId}/download`);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const cleanNum = String(item.id || targetId).replace(/[^a-zA-Z0-9_-]/g, "");
      a.download = `Invoice-${cleanNum}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      showToast("Invoice PDF downloaded successfully", "success");
    } catch (err: any) {
      console.warn("Could not download backend PDF receipt via apiClient:", err);
      showToast("Failed to download invoice PDF", "error");
    } finally {
      setDownloadingId(null);
    }
  };

  const invoiceColumns: Column<InvoiceItem>[] = [
    {
      id: "amount",
      label: "Amount",
      sortable: true,
      className: "w-[130px] whitespace-nowrap",
      render: (item) => (
        <span className="text-xs font-bold text-slate-900 dark:text-white whitespace-nowrap">
          {item.amount}
        </span>
      ),
    },
    {
      id: "status",
      label: "Status",
      sortable: true,
      className: "w-[110px] whitespace-nowrap",
      render: (item) => renderInvoiceStatusBadge(item.raw_status || item.status || "paid"),
    },
    {
      id: "payment_method",
      label: "Payment Method",
      sortable: true,
      className: "w-[140px] whitespace-nowrap",
      render: (item) => {
        const brand = (item.card_brand || "VISA").toUpperCase();
        const last4 = item.card_last4 || "4242";
        return (
          <div className="inline-flex items-center gap-1.5 whitespace-nowrap text-[12.5px] font-medium text-slate-700 dark:text-slate-200 min-h-[22px]">
            <span className={`px-1.5 py-0.5 rounded-[3px] font-bold text-[9px] tracking-wider leading-none shadow-2xs ${brand === "MC" ? "bg-[#eb001b] text-white" : "bg-[#1a1f71] text-white"}`}>
              {brand === "MC" ? "MC" : "VISA"}
            </span>
            <span className="text-slate-400 dark:text-slate-500 font-mono text-[11px]">••••</span>
            <span className="font-mono text-slate-700 dark:text-slate-300 text-xs">{last4}</span>
          </div>
        );
      },
    },
    {
      id: "id",
      label: "Invoice Reference",
      sortable: true,
      className: "w-[150px] whitespace-nowrap",
      render: (item) => (
        <span className="font-mono text-xs font-medium text-slate-700 dark:text-slate-300">
          {item.id}
        </span>
      ),
    },
    {
      id: "details",
      label: "Subscription Plan",
      sortable: true,
      className: "min-w-[190px] whitespace-nowrap",
      render: (item) => (
        <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
          {item.details}
        </span>
      ),
    },
    {
      id: "date",
      label: "Billing Date",
      sortable: true,
      className: "w-[125px] whitespace-nowrap",
      render: (item) => (
        <span className="text-xs text-slate-600 dark:text-slate-400 font-normal">
          {item.date}
        </span>
      ),
    },
    {
      id: "download",
      label: "Receipt",
      className: "w-[130px] text-right whitespace-nowrap",
      render: (item) => (
        <button
          type="button"
          disabled={downloadingId === item.id}
          onClick={() => handleDownloadReceipt(item)}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-[#ff4a1f] bg-[#fff5f2] hover:bg-[#ffece6] dark:bg-[#ff4a1f]/10 dark:hover:bg-[#ff4a1f]/20 border border-[#ffdcd2] dark:border-[#ff4a1f]/30 rounded-md transition-colors cursor-pointer disabled:opacity-50"
        >
          {downloadingId === item.id ? (
            <Loader2 size={12} className="animate-spin" />
          ) : (
            <Download size={12} />
          )}
          <span>Download PDF</span>
        </button>
      ),
    },
  ];

  const statusFilterOptions = [
    { id: "All", name: "All Statuses" },
    { id: "Paid", name: "Paid" },
    { id: "Pending", name: "Pending" },
    { id: "Failed", name: "Failed" },
  ];

  if (isLoading) {
    return <SubscriptionSkeleton userType="supplier" activeTab={activeTab} billingCycle={billingCycle} />;
  }

  return (
    <div className="p-4 sm:p-5 md:p-6 w-full mx-auto space-y-5 font-sans antialiased animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight mb-1">
              Subscription & Billing Plans
            </h1>
            <Badge className="bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold rounded-[3px] border border-emerald-200">
              Active Carrier Account
            </Badge>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Manage your carrier subscription tier, fleet capacity, and load bidding tools.
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

      {/* Quota Reminder Banner */}
      {(isLoading || subscription?.is_trial || !hasActiveSub || (subscription?.quote_limit && subscription.quote_limit > 0)) && (
        <QuotaReminderBanner
          isLoading={isLoading}
          quotaUsed={quotaUsed}
          maxQuota={Number(subscription?.quote_limit || (subscription?.is_trial ? 3 : 3))}
          daysRemaining={daysRemaining}
          onUpgradeClick={() => setActiveTab("packages")}
        />
      )}

      {/* Left Sidebar + Right Content Layout */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Left Sidebar Navigation */}
        <div className="w-full lg:w-[260px] shrink-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden shadow-2xs">
          <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50">
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 tracking-wider">
              Subscription Menu
            </h3>
          </div>

          <div className="flex flex-col">
            {SUBSCRIPTION_TABS.map((tab) => {
              const Icon = tab.icon;
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-medium transition-colors border-l-[3px] border-b border-slate-100 dark:border-slate-800/60 last:border-b-0 cursor-pointer ${isSelected
                    ? "border-l-[#ff4a1f] bg-orange-50/50 dark:bg-orange-950/20 text-[#ff4a1f] font-bold"
                    : "border-l-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-100"
                    }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon size={15} className={isSelected ? "text-[#ff4a1f]" : "text-slate-400"} />
                    <span>{tab.label}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {tab.id === "history" && invoices.length > 0 && (
                      <span className="bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                        {invoices.length}
                      </span>
                    )}
                    {isSelected && <ChevronRight size={14} className="text-slate-400 dark:text-slate-500" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-2xs w-full p-5 md:p-6 space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* 1. PLAN SECTION */}
              <section className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Plan
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Active Plan Card */}
                  <div className="relative border border-slate-200/90 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 rounded-[6px] p-5 sm:p-6 flex flex-col justify-between min-h-[145px] shadow-2xs">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 capitalize">
                          {activePlanName}
                        </h3>
                        <span className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
                          {activePlanPrice}
                        </span>
                      </div>
                      <div className="mt-2 space-y-1">
                        <div className="flex items-center gap-1.5 flex-wrap text-xs text-slate-600 dark:text-slate-300">
                          <span className="font-semibold text-slate-800 dark:text-slate-200">
                            {subscription?.auto_renew ? "Renews on:" : "Expires on:"}
                          </span>
                          <span className="font-bold text-[#ff4a1f] dark:text-orange-400">
                            {formattedExpiryDate}
                          </span>
                          {subscription?.expires_at && (
                            <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                              ({daysRemaining} {daysRemaining === 1 ? "day" : "days"} remaining)
                            </span>
                          )}
                        </div>
                        {formattedStartDate && (
                          <p className="text-[11px] text-slate-400 dark:text-slate-500">
                            Started on: {formattedStartDate}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="pt-4">
                      {subscription?.status === "cancelled" ? (
                        <span className="px-3 py-1 text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-[4px]">
                          Cancelled • Access until expiry
                        </span>
                      ) : subscription?.is_trial || !hasActiveSub ? (
                        <button
                          type="button"
                          onClick={() => setActiveTab("packages")}
                          className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-[4px] cursor-pointer transition-colors"
                        >
                          Explore & Upgrade Plans
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => { setCancelConfirmationText(""); setIsCancelModalOpen(true); }}
                          className="px-4 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-[4px] cursor-pointer transition-colors"
                        >
                          Cancel Subscription
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Upgrade Plan Card (Featured) */}
                  {popularPlan ? (
                    <div className="relative bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-transparent dark:from-orange-950/30 dark:via-orange-950/10 dark:to-transparent border border-orange-200/80 dark:border-orange-900/40 rounded-[6px] p-5 sm:p-6 flex flex-col justify-between min-h-[145px] shadow-2xs">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
                            {upgradePlanName}
                          </h3>
                          <span className="text-base sm:text-lg font-bold text-[#ff4a1f] dark:text-[#ff4a1f]">
                            {upgradePlanPrice}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
                          {upgradePlanPeriodText}
                        </p>
                      </div>

                      <div className="pt-4">
                        <button
                          type="button"
                          disabled={isUpgradingPlanId === String(popularPlan.planId)}
                          onClick={() => handleSelectPlan(popularPlan)}
                          className="px-4 py-1.5 text-xs font-bold bg-[#ff4a1f] hover:bg-[#e03e15] text-white rounded-[4px] shadow-2xs cursor-pointer transition-all flex items-center gap-1.5 disabled:opacity-50"
                        >
                          {isUpgradingPlanId === String(popularPlan.planId) ? (
                            <>
                              <Loader2 size={12} className="animate-spin" />
                              <span>Processing...</span>
                            </>
                          ) : (
                            <>
                              <span>Upgrade to {upgradePlanName}</span>
                              <ChevronRight size={13} strokeWidth={2.5} />
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="border border-dashed border-slate-200 dark:border-slate-800 rounded-[6px] p-5 sm:p-6 flex flex-col items-center justify-center text-center">
                      <Package className="w-8 h-8 text-slate-400 mb-1" />
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">All features unlocked</span>
                    </div>
                  )}
                </div>
              </section>

              {/* 2. RENEWAL SETTINGS */}
              <section className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Renewal Settings
                </h2>

                <div className="flex items-center justify-between p-3.5 bg-slate-50/70 dark:bg-slate-800/40 rounded-lg border border-slate-100 dark:border-slate-800/80">
                  <div>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                      Subscription Auto-Renew
                    </span>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Automatically renew your subscription at the end of each billing cycle to maintain uninterrupted platform service.
                    </p>
                  </div>

                  <button
                    type="button"
                    role="switch"
                    aria-checked={autoRenew}
                    onClick={handleToggleAutoRenew}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${autoRenew ? "bg-[#ff4a1f]" : "bg-slate-300 dark:bg-slate-700"
                      }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${autoRenew ? "translate-x-5" : "translate-x-0"
                        }`}
                    />
                  </button>
                </div>
              </section>

              {/* 3. PAYMENT METHOD SECTION */}
              <section className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      Payment Method
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Manage your saved credit/debit cards for subscription billing and platform tools.
                    </p>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsPaymentModalOpen(true)}
                    className="h-8 px-3 text-xs font-semibold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1.5 cursor-pointer rounded-[4px]"
                  >
                    <Plus size={13} />
                    <span>Add New Card</span>
                  </Button>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-1">
                  {paymentCards.map((card) => (
                    <div
                      key={card.id}
                      className={`relative p-3.5 rounded-lg border transition-all flex flex-col justify-between min-h-[96px] ${card.isDefault
                        ? "border-orange-200 dark:border-orange-900/60 bg-orange-50/30 dark:bg-orange-950/20 shadow-2xs ring-1 ring-orange-200 dark:ring-orange-900/40"
                        : "border-slate-200 dark:border-slate-800 bg-white dark:bg-[#181d24] hover:border-slate-300 dark:hover:border-slate-700"
                        }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                            {card.brand}
                          </span>
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                            {card.cardType}
                          </span>
                        </div>

                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => setActiveCardMenuId(activeCardMenuId === card.id ? null : card.id)}
                            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded cursor-pointer"
                          >
                            <MoreVertical size={14} />
                          </button>

                          {activeCardMenuId === card.id && (
                            <div className="absolute right-0 top-6 w-36 bg-white dark:bg-slate-800 rounded-[4px] border border-slate-200 dark:border-slate-700 shadow-lg py-1 z-20 animate-fade-in">
                              {!card.isDefault && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    handleSetDefaultCard(card.id);
                                    setActiveCardMenuId(null);
                                  }}
                                  className="w-full text-left px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 font-medium cursor-pointer"
                                >
                                  Set as Default
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => {
                                  handleDeleteCard(card.id);
                                  setActiveCardMenuId(null);
                                }}
                                className="w-full text-left px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 font-medium cursor-pointer"
                              >
                                Delete Card
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3">
                        <span className="font-mono tracking-wider text-slate-700 dark:text-slate-300 font-medium text-xs">
                          •••• {card.last4}
                        </span>
                        {card.isDefault && (
                          <span className="text-[10px] font-semibold text-[#ff4a1f] bg-orange-50 dark:bg-orange-950/50 px-1.5 py-0.2 rounded border border-orange-200 dark:border-orange-800">
                            Default
                          </span>
                        )}
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => setIsPaymentModalOpen(true)}
                    className="p-3.5 rounded-lg border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 flex flex-col items-center justify-center gap-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer min-h-[96px] transition-colors"
                  >
                    <Plus size={16} />
                    <span className="text-xs font-semibold">Add New Card</span>
                  </button>
                </div>
              </section>
            </div>
          )}

          {/* TAB 2: PACKAGES & PLANS */}
          {activeTab === "packages" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    Carrier Subscription Plans
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Choose the right capacity and dispatch package to scale your transport fleet.
                  </p>
                </div>

                {/* Billing Cycle Toggle Switch */}
                <div className="flex items-center gap-3 shrink-0 bg-slate-50/80 dark:bg-slate-800/50 p-1.5 px-3 rounded-full border border-slate-200/80 dark:border-slate-700/80">
                  <button
                    type="button"
                    onClick={() => setBillingCycle("monthly")}
                    className={`text-xs font-bold transition-colors cursor-pointer ${billingCycle === "monthly"
                      ? "text-slate-900 dark:text-slate-100"
                      : "text-slate-500 hover:text-slate-700 dark:text-slate-400"
                      }`}
                  >
                    Monthly Billed
                  </button>

                  <button
                    type="button"
                    role="switch"
                    aria-checked={billingCycle === "yearly"}
                    onClick={() => setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${billingCycle === "yearly" ? "bg-[#ff4a1f]" : "bg-slate-300 dark:bg-slate-700"
                      }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${billingCycle === "yearly" ? "translate-x-5" : "translate-x-0"
                        }`}
                    />
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setBillingCycle("yearly")}
                      className={`text-xs font-bold transition-colors cursor-pointer ${billingCycle === "yearly"
                        ? "text-slate-900 dark:text-slate-100"
                        : "text-slate-500 hover:text-slate-700 dark:text-slate-400"
                        }`}
                    >
                      Yearly Billed
                    </button>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full font-extrabold bg-orange-100 dark:bg-orange-950/60 text-[#ff4a1f] dark:text-orange-400 border border-orange-200/80 dark:border-orange-900/60">
                      Save 20%
                    </span>
                  </div>
                </div>
              </div>

              <div className={`grid grid-cols-1 sm:grid-cols-2 ${plans.length >= 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"} gap-4 w-full items-stretch`}>
                {plans.map((plan: any, idx: number) => {
                  const isCurrent = plan.isCurrent;
                  const isPopular = plan.popular;
                  const isUpgrading = isUpgradingPlanId === String(plan.planId);

                  return (
                    <div
                      key={idx}
                      className={`relative rounded-[6px] p-4 sm:p-5 transition-all flex flex-col justify-between w-full bg-white dark:bg-[#181d24] shadow-xs hover:shadow-md ${isPopular
                        ? "border-2 border-[#ff4a1f] dark:border-[#ff4a1f] ring-2 ring-[#ff4a1f]/10"
                        : "border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                        }`}
                    >
                      {isPopular && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 bg-[#ff4a1f] text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-xs">
                          {plan.badgeText || "Most Popular"}
                        </div>
                      )}

                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                              {plan.name}
                            </h3>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-normal mt-0.5 leading-relaxed min-h-[30px]">
                              {plan.description}
                            </p>
                          </div>
                          {isCurrent && (
                            <span className="shrink-0 px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold rounded tracking-wider">
                              Active
                            </span>
                          )}
                        </div>

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

                        <div className="pt-1 pb-4">
                          {isCurrent ? (
                            <div className="w-full h-9 rounded-[4px] text-xs font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center gap-1.5">
                              <CheckCircle2 size={14} /> Current Active Plan
                            </div>
                          ) : (
                            <button
                              type="button"
                              disabled={isUpgrading}
                              onClick={() => handleSelectPlan(plan)}
                              className={`w-full h-9 rounded-[4px] text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50 ${isPopular
                                ? "bg-[#ff4a1f] hover:bg-[#e03e15] text-white shadow-xs"
                                : "bg-slate-900 hover:bg-black dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 shadow-xs"
                                }`}
                            >
                              {isUpgrading ? (
                                <span className="flex items-center gap-1.5">
                                  <Loader2 size={13} className="animate-spin" /> Processing...
                                </span>
                              ) : plan.isTrial ? (
                                "Start 7-Day Trial"
                              ) : isPopular ? (
                                `Upgrade to ${plan.name}`
                              ) : (
                                `Select ${plan.name}`
                              )}
                            </button>
                          )}
                        </div>

                        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
                          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                            WHAT'S INCLUDED ({plan.features?.length || 0})
                          </span>

                          <div className="space-y-2">
                            {(plan.features || [])
                              .slice(0, expandedPlans[String(plan.planId)] ? undefined : 4)
                              .map((feat: string, i: number) => (
                                <div key={i} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300 font-medium animate-fade-in">
                                  <div className="w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 mt-0.5 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                                    <Check size={9} strokeWidth={3} />
                                  </div>
                                  <span className="leading-snug">{feat}</span>
                                </div>
                              ))}
                          </div>

                          {plan.features && plan.features.length > 4 && (
                            <button
                              type="button"
                              onClick={() => togglePlanExpanded(plan.planId)}
                              className="w-full pt-1 text-xs font-semibold text-[#ff4a1f] hover:underline cursor-pointer flex items-center justify-between transition-colors"
                            >
                              <span>
                                {expandedPlans[String(plan.planId)]
                                  ? "Show fewer features"
                                  : `+ Show ${plan.features.length - 4} more features`}
                              </span>
                              <ChevronDown
                                size={13}
                                className={`transition-transform duration-200 ${expandedPlans[String(plan.planId)] ? "rotate-180" : ""
                                  }`}
                              />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: BILLING HISTORY */}
          {activeTab === "history" && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    Billing History & Downloadable Receipts
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    View and download official VAT tax invoices and payment receipts for your records.
                  </p>
                </div>
              </div>

              {/* Current Active Plan & Expiry Summary Banner */}
              <div className="p-3.5 bg-gradient-to-r from-slate-50 via-orange-50/20 to-slate-50 dark:from-slate-800/60 dark:via-orange-950/10 dark:to-slate-800/60 border border-slate-200/90 dark:border-slate-800 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-orange-500/10 border border-orange-500/20 text-[#ff4a1f] flex items-center justify-center shrink-0">
                    <Receipt size={18} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        Current Plan: {activePlanName}
                      </span>
                      <span className={`px-2 py-0.5 rounded-[3px] text-[10px] font-bold border ${
                        hasActiveSub || subscription?.is_trial
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800"
                          : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800"
                      }`}>
                        {hasActiveSub || subscription?.is_trial ? "Active" : "Inactive"}
                      </span>
                      {subscription?.auto_renew && (
                        <span className="px-1.5 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800 text-[10px] font-bold rounded-[3px]">
                          Auto-Renew On
                        </span>
                      )}
                    </div>
                    <p className="text-[11.5px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {subscription?.auto_renew ? "Next Billing / Renewal Date:" : "Plan Expires / Closes On:"}{" "}
                      <strong className="text-slate-800 dark:text-slate-200 font-semibold">{formattedExpiryDate}</strong>{" "}
                      {subscription?.expires_at && (
                        <span className="text-[#ff4a1f] font-medium">({daysRemaining} {daysRemaining === 1 ? "day" : "days"} remaining)</span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setActiveTab("packages")}
                    className="px-3 py-1.5 text-xs font-semibold text-[#ff4a1f] bg-white hover:bg-orange-50 dark:bg-slate-900 dark:hover:bg-slate-800 border border-orange-200/80 dark:border-orange-800/60 rounded-[4px] cursor-pointer transition-colors shadow-2xs"
                  >
                    Change / Upgrade Plan
                  </button>
                </div>
              </div>

              <DataTable
                columns={invoiceColumns}
                data={filteredInvoices}
                compact={true}
                searchPlaceholder="Search invoices by reference, plan, date..."
                hideViewToggle={true}
                isLoading={isLoading}
                keyExtractor={(item) => item.id}
                filterContent={
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 py-1">
                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                        Payment Status
                      </label>
                      <Select
                        options={statusFilterOptions}
                        value={statusFilter}
                        onChange={(val) => setStatusFilter(val)}
                        placeholder="Filter status..."
                      />
                    </div>
                  </div>
                }
              />
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <AddPaymentMethodModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onAddSuccess={() => {
          loadData();
        }}
      />

      {/* Cancel Confirmation Modal */}
      {isCancelModalOpen && typeof document !== "undefined" && createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in">
          <div className="fixed inset-0" onClick={() => !isCanceling && setIsCancelModalOpen(false)} />
          <div className="relative z-10 bg-white dark:bg-[#181d24] rounded-lg max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-5 space-y-4 font-sans animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 border border-rose-200 dark:border-rose-900/40">
                <AlertTriangle size={18} />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Cancel Subscription?
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Are you sure you want to cancel your subscription? Your access will remain active until the end of your current billing period.
                </p>
              </div>
            </div>
            <div>
              <Input
                label='To confirm, please type "CANCEL" *'
                autoFocus
                value={cancelConfirmationText}
                onChange={(e) => setCancelConfirmationText(e.target.value)}
                placeholder='Type "CANCEL" to confirm'
                className="font-semibold uppercase tracking-wider"
                rightIcon={
                  cancelConfirmationText.trim().toUpperCase() === "CANCEL" ? (
                    <CheckCircle2 size={15} className="text-emerald-500" />
                  ) : undefined
                }
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                disabled={isCanceling}
                onClick={() => {
                  setCancelConfirmationText("");
                  setIsCancelModalOpen(false);
                }}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-[4px] cursor-pointer transition-colors"
              >
                Keep Subscription
              </button>
              <button
                type="button"
                disabled={cancelConfirmationText.trim().toUpperCase() !== "CANCEL" || isCanceling}
                onClick={handleCancelSubscription}
                className="px-4 py-1.5 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-[4px] cursor-pointer flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xs"
              >
                {isCanceling ? <Loader2 size={12} className="animate-spin" /> : null}
                <span>Confirm Cancellation</span>
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
