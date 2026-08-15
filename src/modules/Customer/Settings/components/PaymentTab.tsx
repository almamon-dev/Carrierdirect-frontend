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
  <div className="bg-white p-4 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors flex flex-col items-start w-full">
    <div className="flex justify-between items-start w-full mb-3">
      <div className={`w-9 h-9 rounded-md shrink-0 flex items-center justify-center ${colorClass}`}>
        <Icon size={18} strokeWidth={2} />
      </div>
      <span className="text-[20px] font-bold text-slate-800">{value}</span>
    </div>
    <h3 className="text-[13px] font-bold text-slate-800 mb-0.5">{title}</h3>
    <p className="text-[12px] text-slate-500 font-medium leading-snug">{description}</p>
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

  useEffect(() => {
    fetchPaymentSettings();
  }, []);

  const fetchPaymentSettings = async () => {
    try {
      setIsLoading(true);
      const res = await apiClient.get("/customer/payment-settings");
      const data = res.data?.data || res.data;
      if (data) {
        if (data.pay_later) setPayLater(data.pay_later);
        if (data.saved_cards) setCards(data.saved_cards);
      }
    } catch {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetPrimary = async (cardId: string | number) => {
    try {
      setActionLoadingId(cardId);
      const res = await apiClient.post(`/customer/payment-methods/${cardId}/primary`);
      const updated = res.data?.data?.saved_cards || res.data?.saved_cards;
      if (updated) {
        setCards(updated);
      } else {
        setCards((prev) =>
          prev.map((c) => ({
            ...c,
            is_primary: c.id === cardId,
          }))
        );
      }
      showToast("Primary payment method updated.", "success");
    } catch (err: any) {
      const errMsg = err.data?.message || err.message || "Failed to set primary card.";
      showToast(errMsg, "error");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDeleteCard = async (cardId: string | number) => {
    if (!confirm("Are you sure you want to remove this payment method?")) return;

    try {
      setActionLoadingId(cardId);
      const res = await apiClient.delete(`/customer/payment-methods/${cardId}`);
      const updated = res.data?.data?.saved_cards || res.data?.saved_cards;
      if (updated) {
        setCards(updated);
      } else {
        setCards((prev) => prev.filter((c) => c.id !== cardId));
      }
      showToast("Payment method removed successfully.", "success");
    } catch (err: any) {
      const errMsg = err.data?.message || err.message || "Failed to remove card.";
      showToast(errMsg, "error");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleAddSuccess = (newCard: any) => {
    if (newCard) {
      if (newCard.is_primary) {
        setCards((prev) => prev.map((c) => ({ ...c, is_primary: false })));
      }
      setCards((prev) => [...prev, newCard]);
    }
    fetchPaymentSettings();
  };

  const renderStatusBadge = () => {
    if (payLater.status === "approved") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-md border border-emerald-200">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Active Facility
        </span>
      );
    }
    if (payLater.status === "pending") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-700 text-xs font-bold rounded-md border border-amber-200">
          <Clock className="w-3.5 h-3.5 text-amber-600" /> Approval Pending
        </span>
      );
    }
    if (payLater.status === "rejected") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-50 text-red-700 text-xs font-bold rounded-md border border-red-200">
          <AlertTriangle className="w-3.5 h-3.5 text-red-600" /> Request Rejected
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-md border border-slate-200">
        Inactive Facility
      </span>
    );
  };

  return (
    <div className="space-y-4 font-sans">
      {/* Pay Later Facility Banner Header */}
      <div className="bg-white p-4 sm:p-5 rounded-lg border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-100 pb-3 gap-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-slate-700" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">Pay Later Credit Terms</h3>
              <p className="text-xs text-slate-500">30-day deferred logistics payment facility and credit balance.</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {renderStatusBadge()}

            <Link
              to="/customer/finance/pay-later"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#ff4a1f] hover:bg-[#e63d15] text-white font-bold text-xs rounded-md shadow-sm transition-all cursor-pointer"
            >
              Open Credit Hub <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Metric Cards Grid matching Dashboard Style */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <MetricCard
            title="Approved Limit"
            description="Admin approved corporate credit limit."
            value={payLater.approved_limit_formatted || "€ 0.00"}
            icon={Euro}
            colorClass="bg-orange-50 text-[#ff4a1f]"
          />

          <MetricCard
            title="Currently Used"
            description="Active Net 30 due invoices."
            value={payLater.currently_used_formatted || "€ 0.00"}
            icon={CreditCard}
            colorClass="bg-amber-50 text-amber-600"
          />

          <MetricCard
            title="Available Balance"
            description="Balance available for instant booking."
            value={payLater.available_balance_formatted || "€ 0.00"}
            icon={ShieldCheck}
            colorClass="bg-emerald-50 text-emerald-600"
          />
        </div>
      </div>

      {/* Masked Saved Payment Methods Card */}
      <div className="bg-white p-4 sm:p-5 rounded-lg border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Saved Payment Methods</h3>
            <p className="text-xs text-slate-500">Manage payment methods for escrow bookings and credit line fallback.</p>
          </div>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-md shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Add Card
          </button>
        </div>

        {isLoading ? (
          <div className="py-8 flex items-center justify-center gap-2 text-slate-400 text-xs">
            <Loader2 className="w-4 h-4 animate-spin text-[#ff4a1f]" /> Loading payment methods...
          </div>
        ) : cards.length === 0 ? (
          <div className="py-8 text-center border border-dashed border-slate-200 rounded-lg bg-slate-50/50">
            <CreditCard className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <h4 className="text-xs font-bold text-slate-700">No Saved Cards Yet</h4>
            <p className="text-[11px] text-slate-500 mt-0.5 mb-3">Add a credit or debit card for faster bookings.</p>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#ff4a1f] hover:bg-[#e63d15] text-white font-bold text-xs rounded-md shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Add New Card
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {cards.map((card) => {
              const isPrimary = card.is_primary ?? card.isPrimary ?? false;
              const isActing = actionLoadingId === card.id;

              return (
                <div
                  key={card.id}
                  className="p-3.5 rounded-md border border-slate-200 bg-slate-50/50 flex items-center justify-between transition-all hover:border-slate-300"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-7 rounded-md ${
                        card.type === "MC" ? "bg-red-600" : card.type === "AMEX" ? "bg-blue-600" : "bg-slate-900"
                      } text-white flex items-center justify-center font-bold text-[10px] tracking-wider shrink-0`}
                    >
                      {card.type || "CARD"}
                    </div>
                    <div>
                      <p className="text-xs font-mono font-bold text-slate-900 tracking-wider">
                        •••• •••• •••• {card.last4}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Exp {card.expiry} {card.holder_name && `• ${card.holder_name}`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {isPrimary ? (
                      <span className="text-[11px] font-bold text-slate-700 bg-white px-2.5 py-0.5 rounded-md border border-slate-200">
                        Primary
                      </span>
                    ) : (
                      <button
                        type="button"
                        disabled={isActing}
                        onClick={() => handleSetPrimary(card.id)}
                        className="text-[11px] font-bold text-[#ff4a1f] hover:underline cursor-pointer disabled:opacity-50"
                      >
                        Set Primary
                      </button>
                    )}

                    <button
                      type="button"
                      disabled={isActing}
                      onClick={() => handleDeleteCard(card.id)}
                      className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer disabled:opacity-50"
                      title="Remove card"
                    >
                      <Trash2 size={13} />
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
