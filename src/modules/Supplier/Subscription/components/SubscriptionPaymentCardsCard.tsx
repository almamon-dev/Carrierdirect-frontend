import React, { useState } from "react";
import { CreditCard, Plus, MoreVertical, Check, Trash2 } from "lucide-react";
import Button from "@/components/ui/button";
import { SavedCard } from "../types";

interface SubscriptionPaymentCardsCardProps {
  paymentCards: SavedCard[];
  autoRenew: boolean;
  onToggleAutoRenew: () => void;
  onSetDefaultCard: (id: string) => void;
  onDeleteCard: (id: string) => void;
  onOpenAddPaymentModal: () => void;
}

export function SubscriptionPaymentCardsCard({
  paymentCards,
  autoRenew,
  onToggleAutoRenew,
  onSetDefaultCard,
  onDeleteCard,
  onOpenAddPaymentModal,
}: SubscriptionPaymentCardsCardProps) {
  const [activeCardMenuId, setActiveCardMenuId] = useState<string | null>(null);

  return (
    <div className="bg-white dark:bg-[#181d24] border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-2xs space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Saved Payment Methods</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Cards charged for automated monthly or annual billing.</p>
        </div>
        <Button variant="outline" size="sm" onClick={onOpenAddPaymentModal} className="h-7 px-2.5 text-xs font-semibold gap-1 cursor-pointer">
          <Plus size={13} />
          <span>Add Card</span>
        </Button>
      </div>

      <div className="space-y-2">
        {paymentCards.length === 0 ? (
          <div className="text-xs text-slate-400 py-3 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-lg">
            No payment cards saved yet. Add a payment method for auto-renewal.
          </div>
        ) : (
          paymentCards.map((card) => (
            <div key={card.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
              <div className="flex items-center gap-3">
                <div className="w-8 h-6 bg-slate-900 dark:bg-slate-800 rounded flex items-center justify-center text-white text-[10px] font-black">
                  {card.brand || "CARD"}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{card.cardType || "Credit Card"}</span>
                    <span className="text-xs text-slate-400 font-mono">•••• {card.last4}</span>
                    {card.isDefault && (
                      <span className="px-1.5 py-0.25 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold rounded">
                        Default
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setActiveCardMenuId(activeCardMenuId === card.id ? null : card.id)}
                  className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  <MoreVertical size={14} />
                </button>
                {activeCardMenuId === card.id && (
                  <div className="absolute right-0 top-6 w-36 bg-white dark:bg-[#1e2329] rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 py-1 z-50 text-xs">
                    {!card.isDefault && (
                      <button
                        type="button"
                        onClick={() => { onSetDefaultCard(card.id); setActiveCardMenuId(null); }}
                        className="w-full text-left px-3 py-1.5 hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                      >
                        <Check size={12} /> Set Default
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => { onDeleteCard(card.id); setActiveCardMenuId(null); }}
                      className="w-full text-left px-3 py-1.5 hover:bg-rose-50 flex items-center gap-2 text-rose-600"
                    >
                      <Trash2 size={12} /> Delete Card
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Automatic Plan Renewal</span>
          <p className="text-[11px] text-slate-400">Charge your default card automatically when the subscription period ends.</p>
        </div>
        <button
          type="button"
          onClick={onToggleAutoRenew}
          className={`w-11 h-6 rounded-full transition-colors cursor-pointer p-0.5 relative ${autoRenew ? "bg-[#ff4a1f]" : "bg-slate-200 dark:bg-slate-700"}`}
        >
          <div className={`w-5 h-5 rounded-full bg-white transition-transform ${autoRenew ? "translate-x-5" : "translate-x-0"}`} />
        </button>
      </div>
    </div>
  );
}
