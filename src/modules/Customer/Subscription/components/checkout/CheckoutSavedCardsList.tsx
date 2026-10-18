import React from "react";
import { Check, Loader2, MoreVertical, Trash2 } from "lucide-react";
import Button from "@/components/ui/button";
import { renderCardLogo } from "../../utils/cardValidationUtils";

interface CheckoutSavedCardsListProps {
  isLoadingCards: boolean;
  savedCards: any[];
  selectedCardId: string | null;
  activeCardMenuId: string | null;
  onSelectCard: (id: string) => void;
  onToggleCardMenu: (id: string) => void;
  onSetPrimary: (id: string) => void;
  onDeleteCard: (id: string) => void;
  onOpenAddCardModal: () => void;
  onSwitchToNewCard: () => void;
}

export const CheckoutSavedCardsList: React.FC<CheckoutSavedCardsListProps> = ({
  isLoadingCards,
  savedCards,
  selectedCardId,
  activeCardMenuId,
  onSelectCard,
  onToggleCardMenu,
  onSetPrimary,
  onDeleteCard,
  onOpenAddCardModal,
  onSwitchToNewCard,
}) => {
  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-900 dark:text-slate-100">
          Your saved cards
        </label>
        <button
          type="button"
          onClick={onOpenAddCardModal}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
        >
          + Add another card
        </button>
      </div>

      {isLoadingCards ? (
        <div className="p-6 bg-white dark:bg-slate-900 rounded-[3px] border border-slate-200 dark:border-slate-800 flex items-center justify-center gap-2 text-xs text-slate-500">
          <Loader2 size={16} className="animate-spin text-blue-600" />
          <span>Loading saved cards...</span>
        </div>
      ) : savedCards.length === 0 ? (
        <div className="p-6 bg-white dark:bg-slate-900 rounded-[3px] border border-dashed border-slate-300 dark:border-slate-700 text-center space-y-3">
          <p className="text-xs text-slate-500">No saved cards found on your account.</p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onSwitchToNewCard}
            className="text-xs font-semibold rounded-[3px]"
          >
            Enter Card Details Below
          </Button>
        </div>
      ) : (
        <div className="space-y-2.5">
          {savedCards.map((card) => {
            const isSelected = String(card.id) === String(selectedCardId);
            const isDefault = Boolean(card.is_primary || card.isDefault);
            const last4 = card.last_four || card.last4 || "4242";
            const brand = card.brand || card.type || "VISA";
            const exp = `${String(card.exp_month || card.expiry_month || "12").padStart(2, "0")}/${String(card.exp_year || card.expiry_year || "28").slice(-2)}`;

            return (
              <div
                key={card.id}
                onClick={() => onSelectCard(String(card.id))}
                className={`p-3.5 rounded-[3px] border cursor-pointer transition-all flex items-center justify-between relative ${
                  isSelected
                    ? "border-blue-600 bg-blue-50/30 dark:bg-blue-950/20 shadow-2xs"
                    : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      isSelected
                        ? "border-blue-600 bg-blue-600"
                        : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                    }`}
                  >
                    {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>

                  <div className="w-10 flex items-center justify-center">
                    {renderCardLogo(brand)}
                  </div>

                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      {brand.toUpperCase()} ending in {last4}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      Expires {exp}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isDefault && (
                    <span className="px-2 py-0.5 text-[10px] font-bold text-white bg-blue-600 rounded-[3px]">
                      Default
                    </span>
                  )}

                  <div className="relative">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleCardMenu(String(card.id));
                      }}
                      className="p-1 text-slate-400 hover:text-slate-600 rounded-[3px] hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                    >
                      <MoreVertical size={15} />
                    </button>

                    {activeCardMenuId === String(card.id) && (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="absolute right-0 top-7 w-36 bg-white dark:bg-slate-900 rounded-[3px] shadow-xl border border-slate-200 dark:border-slate-800 py-1 z-30 text-xs animate-fade-in"
                      >
                        {!isDefault && (
                          <button
                            type="button"
                            onClick={() => onSetPrimary(String(card.id))}
                            className="w-full px-3 py-1.5 text-left text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1.5"
                          >
                            <Check size={13} className="text-emerald-500" />
                            <span>Set as Default</span>
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => onDeleteCard(String(card.id))}
                          className="w-full px-3 py-1.5 text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 flex items-center gap-1.5"
                        >
                          <Trash2 size={13} />
                          <span>Remove Card</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CheckoutSavedCardsList;
