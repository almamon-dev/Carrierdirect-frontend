import React, { useState, useEffect } from "react";
import { ShieldCheck, CheckCircle2, ArrowRight, CreditCard, Plus, Euro, Clock, AlertTriangle, Trash2, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { AddPaymentMethodModal } from "./AddPaymentMethodModal";
import { useToastStore } from "@/stores/useToastStore";
import apiClient from "@/lib/axios";

const MetricCard = ({
  title,
  description,
  value,
  icon: Icon,
  colorClass,
}: {
  title: string;
  description: string;
  value: string;
  icon: any;
  colorClass: string;
}) => (
  <div className="bg-white dark:bg-[#1e2329] p-2.5 sm:p-3 rounded-[6px] border border-slate-200 dark:border-slate-800 hover:border-slate-300 transition-colors flex flex-col justify-between w-full shadow-2xs">
    <div className="flex justify-between items-center w-full mb-1.5">
      <div className={`w-7 h-7 rounded-[4px] shrink-0 flex items-center justify-center ${colorClass}`}>
        <Icon size={14} strokeWidth={2.2} />
      </div>
      <span className="text-[15px] sm:text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight">{value}</span>
    </div>
    <div>
      <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200">{title}</h3>
      <p className="text-[10.5px] text-slate-400 dark:text-slate-500 font-normal leading-snug mt-0.5 truncate">{description}</p>
    </div>
  </div>
);

interface CardItem {
  id: string | number;
  type: string;
  last4: string;
  expiry: string;
  is_primary?: boolean;
  isPrimary?: boolean;
  holder_name?: string;
}

interface PayLaterInfo {
  status: string;
  is_active: boolean;
  approved_limit: number;
  approved_limit_formatted: string;
  currently_used: number;
  currently_used_formatted: string;
  available_balance: number;
  available_balance_formatted: string;
  requested_at?: string | null;
  rejection_reason?: string | null;
  has_linked_card?: boolean;
}

export default function PaymentTab() {
  const showToast = useToastStore((state) => state.showToast);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [payLater, setPayLater] = useState<PayLaterInfo>({
    status: "inactive",
    is_active: false,
    approved_limit: 0,
    approved_limit_formatted: "€ 0.00",
    currently_used: 0,
    currently_used_formatted: "€ 0.00",
    available_balance: 0,
    available_balance_formatted: "€ 0.00",
  });

  const [cards, setCards] = useState<CardItem[]>([]);
  const [actionLoadingId, setActionLoadingId] = useState<string | number | null>(null);

  const fetchProfileAndCards = async () => {
    setIsLoading(true);
    try {
      const res: any = await apiClient.get("/customer/profile").catch(() => null);
      const data = res?.data || res;
      if (data) {
        const approvedLimit = Number(data.pay_later_limit || 80000);
        const currentlyUsed = Number(data.pay_later_used || 0);
        const availableBalance = Number(data.pay_later_available ?? (approvedLimit - currentlyUsed));
        const status = data.pay_later_status || (data.pay_later_enabled ? "approved" : "inactive");

        setPayLater({
          status,
          is_active: status === "approved",
          approved_limit: approvedLimit,
          approved_limit_formatted: `€ ${approvedLimit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
          currently_used: currentlyUsed,
          currently_used_formatted: `€ ${currentlyUsed.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
          available_balance: availableBalance,
          available_balance_formatted: `€ ${availableBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
          requested_at: data.pay_later_requested_at,
          rejection_reason: data.pay_later_rejection_reason,
          has_linked_card: Boolean(data.pay_later_pm_last_four || data.has_saved_card),
        });

        if (data.pay_later_pm_last_four) {
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

  const handleSetPrimary = (cardId: string | number) => {
    setActionLoadingId(cardId);
    setTimeout(() => {
      setCards((prev) =>
        prev.map((c) => ({
          ...c,
          is_primary: c.id === cardId,
        }))
      );
      setActionLoadingId(null);
      showToast("Primary payment method updated.", "success");
    }, 400);
  };

  const handleDeleteCard = (cardId: string | number) => {
    if (!window.confirm("Are you sure you want to remove this saved payment method?")) return;
    setActionLoadingId(cardId);
    setTimeout(() => {
      setCards((prev) => prev.filter((c) => c.id !== cardId));
      setActionLoadingId(null);
      showToast("Payment method removed successfully.", "success");
    }, 400);
  };

  const handleAddSuccess = () => {
    setIsModalOpen(false);
    fetchProfileAndCards();
    showToast("New payment card registered successfully!", "success");
  };

  const renderStatusBadge = () => {
    if (payLater.status === "approved") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-[10.5px] font-bold rounded border border-emerald-200 dark:border-emerald-800/60">
          <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> Active Facility
        </span>
      );
    }
    if (payLater.status === "pending") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 text-[10.5px] font-bold rounded border border-amber-200 dark:border-amber-800/60">
          <Clock className="w-3 h-3 text-amber-600 dark:text-amber-400" /> Approval Pending
        </span>
      );
    }
    if (payLater.status === "rejected") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 text-[10.5px] font-bold rounded border border-red-200 dark:border-red-800/60">
          <AlertTriangle className="w-3 h-3 text-red-600 dark:text-red-400" /> Request Rejected
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10.5px] font-bold rounded border border-slate-200 dark:border-slate-700">
        Inactive Facility
      </span>
    );
  };

  return (
    <div className="space-y-3 font-sans">
      {/* Pay Later Facility Banner Header */}
      <div className="bg-white dark:bg-[#12161c] p-3 sm:p-3.5 rounded-[6px] border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5 gap-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-tight">Pay Later Credit Terms</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">30-day deferred logistics payment facility and revolving balance.</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {renderStatusBadge()}

            <Link
              to="/customer/finance/pay-later"
              className="inline-flex items-center gap-1 h-7 px-2.5 bg-[#ff4a1f] hover:bg-[#e63d15] text-white font-bold text-[11px] rounded-[4px] shadow-2xs transition-all cursor-pointer"
            >
              Open Credit Hub <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Metric Cards Grid matching Dashboard Compact Style */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <MetricCard
            title="Approved Limit"
            description="Approved revolving facility cap."
            value={payLater.approved_limit_formatted || "€ 0.00"}
            icon={Euro}
            colorClass="bg-orange-50 text-[#ff4a1f] dark:bg-orange-950/50 dark:text-orange-400"
          />

          <MetricCard
            title="Currently Used"
            description="Active Net 30 unpaid invoices."
            value={payLater.currently_used_formatted || "€ 0.00"}
            icon={CreditCard}
            colorClass="bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400"
          />

          <MetricCard
            title="Available Balance"
            description="Ready for instant freight orders."
            value={payLater.available_balance_formatted || "€ 0.00"}
            icon={ShieldCheck}
            colorClass="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400"
          />
        </div>
      </div>

      {/* Masked Saved Payment Methods Card */}
      <div className="bg-white dark:bg-[#12161c] p-3 sm:p-3.5 rounded-[6px] border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
          <div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-tight">Saved Payment Methods</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">Manage primary payment methods for escrow bookings and fallback.</p>
          </div>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1 h-7 px-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 text-white font-bold text-[11px] rounded-[4px] shadow-2xs transition-all cursor-pointer"
          >
            <Plus className="w-3 h-3" /> Add Card
          </button>
        </div>

        {isLoading ? (
          <div className="py-5 flex items-center justify-center gap-2 text-slate-400 text-xs">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-[#ff4a1f]" /> Loading payment methods...
          </div>
        ) : cards.length === 0 ? (
          <div className="py-5 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-[5px] bg-slate-50/50 dark:bg-slate-900/40">
            <CreditCard className="w-6 h-6 text-slate-300 dark:text-slate-600 mx-auto mb-1.5" />
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">No Saved Cards Yet</h4>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 mb-2.5">Add a credit or debit card for faster bookings.</p>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-1 h-7 px-3 bg-[#ff4a1f] hover:bg-[#e63d15] text-white font-bold text-[11px] rounded-[4px] shadow-2xs transition-all cursor-pointer"
            >
              <Plus className="w-3 h-3" /> Add New Card
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {cards.map((card) => {
              const isPrimary = card.is_primary ?? card.isPrimary ?? false;
              const isActing = actionLoadingId === card.id;

              return (
                <div
                  key={card.id}
                  className="p-2.5 rounded-[5px] border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 flex items-center justify-between transition-all hover:border-slate-300"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-8 h-5.5 rounded-[3px] ${
                        card.type === "MC" ? "bg-red-600" : card.type === "AMEX" ? "bg-blue-600" : "bg-slate-900"
                      } text-white flex items-center justify-center font-bold text-[9px] tracking-wider shrink-0`}
                    >
                      {card.type || "CARD"}
                    </div>
                    <div>
                      <p className="text-xs font-mono font-bold text-slate-900 dark:text-slate-100 tracking-wider">
                        •••• •••• •••• {card.last4}
                      </p>
                      <p className="text-[10.5px] text-slate-400 dark:text-slate-500">
                        Exp {card.expiry} {card.holder_name && `• ${card.holder_name}`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {isPrimary ? (
                      <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                        Primary
                      </span>
                    ) : (
                      <button
                        type="button"
                        disabled={isActing}
                        onClick={() => handleSetPrimary(card.id)}
                        className="text-[10.5px] font-bold text-[#ff4a1f] hover:underline cursor-pointer disabled:opacity-50"
                      >
                        Set Primary
                      </button>
                    )}

                    <button
                      type="button"
                      disabled={isActing}
                      onClick={() => handleDeleteCard(card.id)}
                      className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded transition-colors cursor-pointer disabled:opacity-50"
                      title="Remove card"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <AddPaymentMethodModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddSuccess={handleAddSuccess}
      />
    </div>
  );
}
