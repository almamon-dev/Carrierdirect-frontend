import React from "react";
import { Plus, CreditCard, Trash2, Loader2 } from "lucide-react";
import { CardItem } from "../types/paymentTypes";

interface SavedCardsSectionProps {
  cards: CardItem[];
  isLoading: boolean;
  actionLoadingId: string | number | null;
  onOpenModal: () => void;
  onSetPrimary: (cardId: string | number) => void;
  onDeleteCard: (cardId: string | number) => void;
}

const renderBrandLogo = (brand?: string) => {
  const b = (brand || "").toLowerCase();
  if (b.includes("visa")) {
    return (
      <span className="font-black italic text-[#1434cb] text-base sm:text-lg tracking-tighter select-none shrink-0 w-11">
        VISA
      </span>
    );
  }
  if (b.includes("master") || b.includes("mc")) {
    return (
      <div className="flex items-center -space-x-1.5 shrink-0 w-10">
        <div className="w-4 h-4 rounded-full bg-[#EB001B]" />
        <div className="w-4 h-4 rounded-full bg-[#F79E1B] opacity-90" />
      </div>
    );
  }
  if (b.includes("amex") || b.includes("american")) {
    return (
      <span className="font-extrabold text-[#006FCF] tracking-tight text-xs bg-blue-50 px-1 py-0.5 rounded shrink-0">
        AMEX
      </span>
    );
  }
  return <CreditCard className="w-5 h-5 text-slate-400 shrink-0" />;
};

export const SavedCardsSection: React.FC<SavedCardsSectionProps> = ({
  cards,
  isLoading,
  actionLoadingId,
  onOpenModal,
  onSetPrimary,
  onDeleteCard,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 p-3.5 sm:p-4 rounded-[4px] border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
      {/* Header matching user screenshot */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-[4px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center shrink-0">
            <CreditCard size={15} />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 leading-tight">
              Saved Payment Methods (Credit/Debit Cards)
            </h3>
            <p className="text-[10.5px] sm:text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">
              Manage cards for regular payments (orders, services, etc.).
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenModal}
          className="inline-flex items-center gap-1 h-[30px] px-2.5 bg-[#0f172a] hover:bg-[#1e293b] dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 text-white font-semibold text-xs rounded-[4px] shadow-2xs transition-all cursor-pointer shrink-0"
        >
          <Plus size={13} /> <span>Add Card</span>
        </button>
      </div>

      {isLoading ? (
        <div className="py-5 flex items-center justify-center gap-2 text-slate-400 text-xs">
          <Loader2 className="w-4 h-4 animate-spin text-[#ff4a1f]" /> Loading payment methods...
        </div>
      ) : cards.length === 0 ? (
        <div className="py-4 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-[4px] bg-slate-50/50 dark:bg-slate-900/40">
          <CreditCard className="w-5 h-5 text-slate-300 dark:text-slate-600 mx-auto mb-1" />
          <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">No Saved Cards Yet</h4>
          <p className="text-[10.5px] text-slate-400 dark:text-slate-500 mt-0.5 mb-2">
            Add a credit or debit card for faster bookings.
          </p>
          <button
            type="button"
            onClick={onOpenModal}
            className="inline-flex items-center gap-1 h-[30px] px-3 bg-[#ff4a1f] hover:bg-[#e63d15] text-white font-semibold text-xs rounded-[4px] shadow-2xs transition-all cursor-pointer"
          >
            <Plus size={13} /> Add New Card
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {cards.map((card) => {
            const isPrimary = card.is_primary ?? card.isPrimary ?? false;
            const isActing = actionLoadingId === card.id;

            return (
              <div
                key={card.id}
                className="p-2.5 sm:px-3 sm:py-2.5 rounded-[4px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between gap-3 shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {renderBrandLogo(card.type)}
                  <div className="min-w-0">
                    <p className="text-xs font-mono font-bold text-slate-900 dark:text-slate-100 tracking-wider">
                      •••• •••• •••• {card.last4}
                    </p>
                    <p className="text-[10.5px] text-slate-400 dark:text-slate-500 mt-0.5 truncate">
                      Exp {card.expiry} {card.holder_name && `• ${card.holder_name}`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {isPrimary ? (
                    <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-[2px] border border-emerald-200 dark:border-emerald-800/60">
                      Primary
                    </span>
                  ) : (
                    <button
                      type="button"
                      disabled={isActing}
                      onClick={() => onSetPrimary(card.id)}
                      className="text-xs font-semibold text-[#ff4a1f] hover:underline cursor-pointer disabled:opacity-50"
                    >
                      Set Primary
                    </button>
                  )}

                  <button
                    type="button"
                    disabled={isActing}
                    onClick={() => onDeleteCard(card.id)}
                    className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-[4px] transition-colors cursor-pointer disabled:opacity-50"
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
  );
};

export default SavedCardsSection;
