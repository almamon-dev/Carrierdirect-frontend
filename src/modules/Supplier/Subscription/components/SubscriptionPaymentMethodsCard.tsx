import React from "react";
import { CreditCard, Plus, Trash2 } from "lucide-react";
import Button from "@/components/ui/button";
import { SavedCardItem } from "../types";

interface Props {
  savedCards: SavedCardItem[];
  onOpenAddCard: () => void;
  onSetDefaultCard?: (id: string) => Promise<void> | void;
  onDeleteCard?: (id: string) => Promise<void> | void;
}

export const SubscriptionPaymentMethodsCard: React.FC<Props> = ({
  savedCards,
  onOpenAddCard,
  onSetDefaultCard,
  onDeleteCard,
}) => {
  return (
    <div className="bg-white dark:bg-[#181d24] border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-2xs space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Saved Payment Methods
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
            Manage credit cards used for subscription renewals and automated carrier billing.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onOpenAddCard}
          className="h-8 px-2.5 text-xs font-semibold flex items-center gap-1.5 cursor-pointer bg-white dark:bg-[#1e2329]"
        >
          <Plus size={13} className="text-[#ff4a1f]" />
          <span>Add Card</span>
        </Button>
      </div>

      {savedCards.length === 0 ? (
        <div className="text-center py-6 border border-dashed border-slate-200 dark:border-slate-800 rounded-lg">
          <CreditCard size={28} className="mx-auto text-slate-300 dark:text-slate-600 mb-1.5" />
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            No saved payment cards found.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {savedCards.map((card) => (
            <div
              key={card.id}
              className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-lg"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-6 rounded bg-slate-800 text-white flex items-center justify-center text-[10px] font-bold">
                  {card.brand || "CARD"}
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    •••• {card.last4}
                  </span>
                  {card.isDefault && (
                    <span className="ml-2 text-[9.5px] font-bold px-1.5 py-0.25 bg-blue-50 text-blue-700 border border-blue-200 rounded">
                      Default
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {!card.isDefault && onSetDefaultCard && (
                  <button
                    type="button"
                    onClick={() => onSetDefaultCard(card.id)}
                    className="text-[11px] font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 cursor-pointer"
                  >
                    Set Default
                  </button>
                )}
                {onDeleteCard && (
                  <button
                    type="button"
                    onClick={() => onDeleteCard(card.id)}
                    className="p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SubscriptionPaymentMethodsCard;
