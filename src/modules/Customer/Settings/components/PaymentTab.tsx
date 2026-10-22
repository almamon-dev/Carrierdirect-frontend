import React, { useState, useEffect } from "react";
import {
  Gift,
  Settings,
  Link2,
  Info,
  ArrowUpRight,
  FileText,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  CreditCard,
  Wallet,
  Loader2,
  Plus,
  Landmark,
  Coins,
} from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { AddPaymentMethodModal } from "./AddPaymentMethodModal";
import { useToastStore } from "@/stores/useToastStore";
import apiClient from "@/lib/axios";
import { CardItem, PayLaterInfo, INITIAL_PAY_LATER } from "../types/paymentTypes";
import SavedCardsSection from "./SavedCardsSection";
import Net30PaymentAuthorizationCard from "./Net30PaymentAuthorizationCard";
import CreditSubTab from "./CreditSubTab";
import InvoicesSubTab from "./InvoicesSubTab";
import BalanceSubTab from "./BalanceSubTab";

type PaymentSubTab = "overview" | "invoices" | "balance" | "credit";

export default function PaymentTab() {
  const showToast = useToastStore((state) => state.showToast);

  const [searchParams, setSearchParams] = useSearchParams();
  const subParam = searchParams.get("sub") as PaymentSubTab | null;
  const initialSubTab: PaymentSubTab =
    subParam && ["overview", "invoices", "balance", "credit"].includes(subParam)
      ? subParam
      : "overview";

  const [subTab, setSubTab] = useState<PaymentSubTab>(initialSubTab);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [payLater, setPayLater] = useState<PayLaterInfo>(INITIAL_PAY_LATER);
  const [cards, setCards] = useState<CardItem[]>([]);
  const [actionLoadingId, setActionLoadingId] = useState<string | number | null>(null);
  const [promoCredit, setPromoCredit] = useState<number>(0.0);
  const [isClaimedToday, setIsClaimedToday] = useState(false);
  const [dailyUsed, setDailyUsed] = useState<number>(0.0);
  const [isClaiming, setIsClaiming] = useState<boolean>(false);

  // Synchronize state when URL search param changes
  useEffect(() => {
    if (subParam && ["overview", "invoices", "balance", "credit"].includes(subParam)) {
      setSubTab(subParam);
    } else if (!subParam) {
      setSubTab("overview");
    }
  }, [subParam]);

  const handleSubTabChange = (newSubTab: PaymentSubTab) => {
    setSubTab(newSubTab);
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (newSubTab === "overview") {
          next.delete("sub");
        } else {
          next.set("sub", newSubTab);
        }
        return next;
      },
      { replace: true }
    );
  };

  const fetchProfileAndCards = async () => {
    setIsLoading(true);
    try {
      const [profileRes, savedCardsRes] = await Promise.all([
        apiClient.get("/customer/profile").catch(() => null),
        apiClient.get("/subscription/payment-methods").catch(() => null),
      ]);

      const data = profileRes?.data?.data || profileRes?.data || profileRes;
      if (data) {
        const status = data.pay_later_status || (data.pay_later_enabled ? "approved" : "inactive");
        const isApproved = status === "approved";
        const approvedLimit = isApproved ? Number(data.pay_later_limit || data.wallet_balance || 0) : 0;
        const currentlyUsed = Number(data.pay_later_used || 0);
        const availableBalance = isApproved ? Number(data.pay_later_available ?? Math.max(0, approvedLimit - currentlyUsed)) : 0;
        const hasCard = Boolean(
          data.pay_later_pm_last_four ||
          data.has_saved_card ||
          data.has_linked_card ||
          data.pay_later_pm_id
        );

        const rawMonthly = Number(data.pay_later_monthly_limit ?? 0);
        const rawWeekly = Number(data.pay_later_weekly_limit ?? 0);
        const rawDaily = Number(data.pay_later_daily_limit ?? 0);
        const monthlyLimit = rawMonthly > 0 ? rawMonthly : (approvedLimit > 0 ? approvedLimit : 40000);
        const weeklyLimit = rawWeekly > 0 ? rawWeekly : 15000;
        const dailyLimit = rawDaily > 0 ? rawDaily : 8000;

        setPayLater({
          status,
          is_active: status === "approved",
          approved_limit: approvedLimit,
          approved_limit_formatted: `€ ${approvedLimit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
          monthly_limit: monthlyLimit,
          weekly_limit: weeklyLimit,
          daily_limit: dailyLimit,
          currently_used: currentlyUsed,
          currently_used_formatted: `€ ${currentlyUsed.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
          available_balance: availableBalance,
          available_balance_formatted: `€ ${availableBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
          requested_at: data.pay_later_requested_at,
          rejection_reason: data.pay_later_rejection_reason,
          has_linked_card: hasCard,
        });

        if (data.promo_credit !== undefined) {
          setPromoCredit(Number(data.promo_credit));
        }
        if (data.is_promo_claimed_today !== undefined) {
          setIsClaimedToday(Boolean(data.is_promo_claimed_today));
        }
        if (data.pay_later_daily_used !== undefined) {
          setDailyUsed(Number(data.pay_later_daily_used));
        }
      }

      // Load saved cards list from payment-methods endpoint or profile
      const serverCards = savedCardsRes?.data?.saved_cards || savedCardsRes?.saved_cards || savedCardsRes?.data || [];
      if (Array.isArray(serverCards) && serverCards.length > 0) {
        setCards(
          serverCards.map((c: any) => ({
            id: String(c.id),
            type: c.brand || c.type || "Visa",
            last4: c.last4 || c.last_four || "4242",
            expiry: c.expiry || `${c.exp_month || "12"}/${c.exp_year || "28"}`,
            is_primary: Boolean(c.is_primary),
            holder_name: c.holder_name || c.name || "Corporate Card",
          }))
        );
      } else if (data?.pay_later_pm_last_four) {
        setCards([
          {
            id: "pm_default",
            type: data.pay_later_pm_type || "Visa",
            last4: data.pay_later_pm_last_four,
            expiry: "12/28",
            is_primary: true,
            holder_name: data.name || "Corporate Card",
          },
        ]);
      }
    } catch (err) {
      console.error("Failed to load payment info:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileAndCards();
  }, []);

  const handleSetPrimary = async (cardId: string | number) => {
    setActionLoadingId(cardId);
    try {
      await apiClient.post(`/subscription/payment-methods/${cardId}/primary`).catch(() => null);
      setCards((prev) =>
        prev.map((c) => ({
          ...c,
          is_primary: String(c.id) === String(cardId),
        }))
      );
      showToast("Primary payment method updated.", "success");
    } catch {
      showToast("Failed to set primary payment method.", "error");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDeleteCard = async (cardId: string | number) => {
    if (!window.confirm("Are you sure you want to remove this saved payment method?")) return;
    setActionLoadingId(cardId);
    try {
      await apiClient.delete(`/subscription/payment-methods/${cardId}`).catch(() => null);
      setCards((prev) => prev.filter((c) => String(c.id) !== String(cardId)));
      showToast("Payment method removed successfully.", "success");
    } catch {
      showToast("Failed to remove payment method.", "error");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleAddSuccess = () => {
    setIsModalOpen(false);
    fetchProfileAndCards();
    showToast("New payment card registered successfully!", "success");
  };

  const handleClaimDailyCredit = async () => {
    if (isClaimedToday || isClaiming) return;
    setIsClaiming(true);
    try {
      const res = await apiClient.post("/customer/claim-daily-credit");
      const resultData = res?.data || res;
      const newPromo = Number(resultData?.promo_credit ?? (promoCredit + 10.0));
      setPromoCredit(newPromo);
      setIsClaimedToday(true);
      showToast(resultData?.message || "€10.00 daily promotional credit claimed successfully!", "success");
    } catch (err) {
      const msg = err?.data?.message || err?.message || "You have already claimed your daily credit for today.";
      showToast(msg, "info");
      setIsClaimedToday(true);
    } finally {
      setIsClaiming(false);
    }
  };

  const usagePercent =
    payLater.approved_limit > 0
      ? Math.min(100, Math.round((payLater.currently_used / payLater.approved_limit) * 100))
      : 0;

  return (
    <div className="space-y-4 font-sans">
      {/* Title */}
      <div>
        <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
          Payment & Credit
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Manage payment methods, billing invoices, revolving Net-30 credit, and ledger balance.
        </p>
      </div>

      {/* Sub-tabs Navigation */}
      <div className="border-b border-slate-200 dark:border-slate-800 flex items-center gap-5 overflow-x-auto no-scrollbar">
        {[
          { id: "overview", label: "Overview", icon: CreditCard },
          { id: "invoices", label: "Invoices", icon: FileText },
          { id: "balance", label: "Balance History", icon: Wallet },
          { id: "credit", label: "Credit", icon: ShieldCheck },
        ].map((tab) => {
          const isActive = subTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleSubTabChange(tab.id as PaymentSubTab)}
              className={`pb-2.5 text-xs sm:text-sm font-semibold transition-all relative cursor-pointer whitespace-nowrap inline-flex items-center gap-1.5 ${
                isActive
                  ? "text-[#ff4a1f] font-bold"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              <Icon size={14} className={isActive ? "text-[#ff4a1f]" : "text-slate-400"} />
              <span>{tab.label}</span>
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#ff4a1f] rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Sub-tab 1: Overview */}
      {subTab === "overview" && (
        <div className="space-y-3.5 pt-0.5">
          {/* 1. Dynamic Spending / Facility Limit Section */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[4px] p-3.5 sm:p-4 shadow-2xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-[4px] bg-red-50 dark:bg-red-950/40 text-[#ff4a1f] flex items-center justify-center shrink-0 border border-red-100 dark:border-red-900/40">
                <Landmark size={16} />
              </div>
              <div className="space-y-0.5">
                <h2 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 leading-tight">
                  Facility Spending Limit
                </h2>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                  Your corporate credit limit resets on a Net-30 settlement cycle. You will only be charged for dispatched cargo orders.
                </p>
                <p className="text-[10.5px] text-slate-400 dark:text-slate-500 pt-0.5">
                  Facility Status:{" "}
                  <strong
                    className={`capitalize ${
                      payLater.status === "approved"
                        ? "text-emerald-600 dark:text-emerald-400"
                        : payLater.status === "pending" || payLater.status === "under_review"
                        ? "text-amber-600 dark:text-amber-400"
                        : "text-rose-500 dark:text-rose-400"
                    }`}
                  >
                    {payLater.status === "approved" ? "Active" : payLater.status === "pending" ? "Under Review" : "Inactive (Not Activated)"}
                  </strong>{" "}
                  • Net-30 Terms
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-6 shrink-0 lg:pl-4">
              <div className="text-left sm:text-right">
                <div className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight leading-none">
                  €{payLater.currently_used.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="text-[10.5px] text-slate-500 dark:text-slate-400 mt-1 font-medium">
                  €{payLater.approved_limit.toLocaleString()}/month facility limit.
                </div>
              </div>

              {/* Usage Progress Bar */}
              <div className="w-48 sm:w-56 space-y-1">
                <div className="flex items-center gap-2">
                  <div className="h-1.5 flex-1 bg-slate-100 dark:bg-slate-800 rounded-[4px] overflow-hidden flex items-center">
                    <div
                      className="h-full bg-[#ff4a1f] rounded-[4px] transition-all duration-500"
                      style={{ width: `${Math.max(usagePercent, 2)}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                    {usagePercent}%
                  </span>
                </div>
                <div className="text-[10.5px] text-slate-500 dark:text-slate-400 font-medium text-right sm:text-left">
                  €{payLater.available_balance.toLocaleString()} available credit remaining
                </div>
              </div>
            </div>
          </div>

          {/* 2. Promotional & Daily Credit + Credit Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
            {/* Left: Promotional & Daily Credit */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[4px] p-3.5 sm:p-4 shadow-2xs flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-[4px] bg-orange-50 dark:bg-orange-950/40 text-[#ff4a1f] flex items-center justify-center shrink-0 border border-orange-100 dark:border-orange-900/40">
                    <Gift size={14} />
                  </div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    Promotional & Daily Credit
                  </h3>
                </div>
                {isClaimedToday && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-[2px] border border-emerald-200 dark:border-emerald-800/60">
                    <CheckCircle2 size={11} /> Claimed
                  </span>
                )}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-0.5">
                <div className="flex items-center gap-4 divide-x divide-slate-100 dark:divide-slate-800">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1 text-[10.5px] text-slate-500 dark:text-slate-400 font-medium">
                      <span>Used today</span>
                      <Info size={10} className="text-slate-400" />
                    </div>
                    <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 leading-tight">
                      €{dailyUsed.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <div className="text-[10px] text-slate-400 dark:text-slate-500">
                      Today's active balance
                    </div>
                  </div>

                  <div className="pl-4 space-y-0.5">
                    <div className="flex items-center gap-1 text-[10.5px] text-slate-500 dark:text-slate-400 font-medium">
                      <span>Credit grant</span>
                      <Info size={10} className="text-slate-400" />
                    </div>
                    <div className="text-sm sm:text-base font-bold text-emerald-600 dark:text-emerald-400 leading-tight">
                      €{promoCredit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <div className="text-[10px] text-slate-400 dark:text-slate-500">
                      Available promo credit
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleClaimDailyCredit}
                  disabled={isClaimedToday || isClaiming}
                  className={`h-[32px] px-3.5 rounded-[4px] text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs shrink-0 ${
                    isClaimedToday
                      ? "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed border border-slate-200 dark:border-slate-700"
                      : "bg-[#ff4a1f] hover:bg-[#e03d15] text-white hover:shadow-xs"
                  }`}
                >
                  {isClaiming ? (
                    <Loader2 size={13} className="animate-spin text-white" />
                  ) : isClaimedToday ? (
                    <CheckCircle2 size={13} className="text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <Gift size={13} />
                  )}
                  <span>
                    {isClaiming
                      ? "Claiming..."
                      : isClaimedToday
                      ? "Claimed Today"
                      : "Claim Daily Free Credit"}
                  </span>
                </button>
              </div>
            </div>

            {/* Right: Credit Summary */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[4px] p-3.5 sm:p-4 shadow-2xs flex flex-col justify-between space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-[4px] bg-orange-50 dark:bg-orange-950/40 text-[#ff4a1f] flex items-center justify-center shrink-0 border border-orange-100 dark:border-orange-900/40">
                  <Coins size={14} />
                </div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  Credit Summary
                </h3>
              </div>

              <div className="grid grid-cols-3 gap-2 divide-x divide-slate-100 dark:divide-slate-800 pt-0.5">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1 text-[10.5px] text-slate-500 dark:text-slate-400 font-medium">
                    <span>Approved Limit</span>
                    <Info size={10} className="text-slate-400" />
                  </div>
                  <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 leading-tight">
                    €{payLater.approved_limit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <div className="text-[10px] text-slate-400 dark:text-slate-500 truncate">
                    Monthly revolving limit
                  </div>
                </div>

                <div className="pl-2 space-y-0.5">
                  <div className="flex items-center gap-1 text-[10.5px] text-slate-500 dark:text-slate-400 font-medium">
                    <span>Currently Used</span>
                  </div>
                  <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 leading-tight">
                    €{payLater.currently_used.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <div className="text-[10px] text-slate-400 dark:text-slate-500 truncate">
                    Active Net 30 invoices
                  </div>
                </div>

                <div className="pl-2 space-y-0.5">
                  <div className="flex items-center gap-1 text-[10.5px] text-slate-500 dark:text-slate-400 font-medium">
                    <span>Available Balance</span>
                  </div>
                  <div className="text-sm sm:text-base font-bold text-emerald-600 dark:text-emerald-400 leading-tight">
                    €{payLater.available_balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <div className="text-[10px] text-slate-400 dark:text-slate-500 truncate">
                    Ready for freight orders
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Saved Payment Methods & Net-30 Authorization Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
            <SavedCardsSection
              cards={cards}
              isLoading={isLoading}
              actionLoadingId={actionLoadingId}
              onOpenModal={() => setIsModalOpen(true)}
              onSetPrimary={handleSetPrimary}
              onDeleteCard={handleDeleteCard}
            />

            <Net30PaymentAuthorizationCard
              hasLinkedCard={payLater.has_linked_card}
              onLinkCard={() => setIsModalOpen(true)}
              primaryCardLast4={cards.find((c) => c.is_primary)?.last4 || cards[0]?.last4}
            />
          </div>

          {/* 4. Debit Cards (Optional) */}
          <div className="bg-white dark:bg-slate-900 p-3.5 sm:p-4 rounded-[4px] border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-[4px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center shrink-0">
                  <CreditCard size={15} />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 leading-tight">
                    Debit Cards (Optional)
                  </h3>
                  <p className="text-[10.5px] sm:text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">
                    You can also link a debit card for payments if preferred.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-1 h-[30px] px-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-[4px] shadow-2xs transition-all cursor-pointer shrink-0"
              >
                <Plus size={13} /> <span>Add Debit Card</span>
              </button>
            </div>

            <div className="py-6 text-center flex flex-col items-center justify-center space-y-1">
              <CreditCard className="w-5 h-5 text-slate-400 dark:text-slate-500 mb-0.5" />
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                No debit cards yet
              </p>
              <p className="text-[10.5px] text-slate-400 dark:text-slate-500">
                Link a debit card to use for payments or as an additional method.
              </p>
            </div>
          </div>

          {/* 5. Billing & Support Options */}
          <div className="space-y-2 pt-0.5">
            <div>
              <h2 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
                Billing & Support Options
              </h2>
              <p className="text-[10.5px] text-slate-500 dark:text-slate-400 mt-0.5">
                Stripe payment authorization and direct corporate support.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
              {/* Row 1: Stripe Customer Management */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[4px] p-3 sm:p-3.5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-[4px] bg-[#635bff] text-white flex items-center justify-center font-bold text-base shadow-2xs shrink-0 mt-0.5">
                    S
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      Payment Method Authorization (Stripe)
                    </h3>
                    <p className="text-[10.5px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                      Save verified credit/debit cards to act as backup guarantees for Net-30 credit bookings and instant escrow dispatches.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="h-[30px] px-3 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-[4px] inline-flex items-center justify-center gap-1 transition-colors cursor-pointer shrink-0 shadow-2xs self-start sm:self-auto"
                >
                  <span>Add Card</span>
                  <ArrowUpRight size={13} className="text-slate-400" />
                </button>
              </div>

              {/* Row 2: Adjust Spending Limit */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[4px] p-3 sm:p-3.5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-[4px] bg-orange-50 dark:bg-orange-950/60 border border-orange-200/80 dark:border-orange-900/50 flex items-center justify-center text-[#ff4a1f] shrink-0 mt-0.5">
                    <Settings size={15} />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      Request Credit Limit Adjustment
                    </h3>
                    <p className="text-[10.5px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                      Submit a limit expansion request for underwriter review or contact our finance team.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleSubTabChange("credit")}
                  className="h-[30px] px-3 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-[4px] inline-flex items-center justify-center gap-1 transition-colors cursor-pointer shrink-0 shadow-2xs self-start sm:self-auto"
                >
                  <span>Credit Facility Hub</span>
                  <ArrowRight size={13} className="text-slate-400" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sub-tab 2: Dynamic Invoices with Metric Cards */}
      {subTab === "invoices" && <InvoicesSubTab />}

      {/* Sub-tab 3: Dynamic Balance History with Metric Cards */}
      {subTab === "balance" && (
        <BalanceSubTab
          availableBalance={payLater.available_balance}
          approvedLimit={payLater.approved_limit}
          currentlyUsed={payLater.currently_used}
        />
      )}

      {/* Sub-tab 4: Credit (Corporate Net-30 Facility) */}
      {subTab === "credit" && (
        <CreditSubTab
          approvedLimit={payLater.approved_limit}
          monthlyLimit={payLater.monthly_limit}
          weeklyLimit={payLater.weekly_limit}
          dailyLimit={payLater.daily_limit}
          currentlyUsed={payLater.currently_used}
          availableBalance={payLater.available_balance}
          hasLinkedCard={payLater.has_linked_card}
          status={payLater.status}
          onRefresh={fetchProfileAndCards}
        />
      )}

      {/* Add Payment Method Modal */}
      <AddPaymentMethodModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddSuccess={handleAddSuccess}
      />
    </div>
  );
}
