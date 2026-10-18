import React, { useState } from 'react';
import { MoreVertical, Check, Trash2, CreditCard, Plus } from 'lucide-react';
import Button from '@/components/ui/button';
import { renderCardLogo } from './checkoutCardUtils';

export interface AcceptCheckoutSavedCardsListProps {
    savedCards: any[];
    isLoadingCards?: boolean;
    selectedCardId?: string;
    setSelectedCardId: (id: string) => void;
    onSetPrimaryCard?: (id: string) => void;
    onDeleteCard?: (id: string) => void;
    onGoToNewCard: () => void;
}

export const AcceptCheckoutSavedCardsList: React.FC<AcceptCheckoutSavedCardsListProps> = ({
    savedCards,
    isLoadingCards,
    selectedCardId,
    setSelectedCardId,
    onSetPrimaryCard,
    onDeleteCard,
    onGoToNewCard,
}) => {
    const [activeCardMenuId, setActiveCardMenuId] = useState<string | null>(null);

    if (isLoadingCards) {
        return (
            <div className="space-y-2">
                <div className="h-12 bg-slate-100 dark:bg-slate-800/60 rounded animate-pulse" />
            </div>
        );
    }

    if (savedCards.length === 0) {
        return (
            <div className="text-center py-5 border border-dashed border-slate-200 dark:border-slate-800 rounded bg-slate-50/50 dark:bg-slate-900/30 space-y-2">
                <CreditCard size={24} className="mx-auto text-slate-400" />
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    No saved cards found
                </p>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={onGoToNewCard}
                    className="h-7 text-xs font-semibold rounded border-slate-300 dark:border-slate-700 mt-1"
                >
                    <Plus size={12} className="mr-1" />
                    Enter Card Details
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-2">
            {savedCards.map((card) => {
                const isSelected = String(card.id) === String(selectedCardId);
                return (
                    <div
                        key={card.id}
                        onClick={() => setSelectedCardId(String(card.id))}
                        className={`border rounded-[4px] p-2.5 sm:p-3 transition-all flex items-center justify-between gap-3 cursor-pointer ${
                            isSelected ? "border-[#ff4a1f]/60 bg-orange-50/20 dark:bg-orange-950/15 dark:border-[#ff4a1f]/40 shadow-2xs"
                                : "border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900/40"
                        }`}
                    >
                        <div className="flex items-center gap-3 min-w-0">
                            <div
                                className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                                    isSelected
                                        ? "border-[#ff4a1f] bg-[#ff4a1f]"
                                        : "border-slate-300 dark:border-slate-600"
                                }`}
                            >
                                {isSelected && (
                                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                                )}
                            </div>

                            {renderCardLogo(card.brand)}

                            <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 tracking-wide">
                                        •••• •••• •••• {card.last_four || "4242"}
                                    </span>
                                    {card.is_primary && (
                                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/40">
                                            <span className="w-1 h-1 rounded-full bg-emerald-500" />
                                            Default
                                        </span>
                                    )}
                                </div>
                                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                                    Expires {card.exp_month || "12"}/{card.exp_year || "28"}
                                </span>
                            </div>
                        </div>

                        {/* Card 3-dot action menu */}
                        <div className="relative shrink-0" onClick={(e) => e.stopPropagation()}>
                            <button
                                type="button"
                                onClick={() =>
                                    setActiveCardMenuId(
                                        activeCardMenuId === String(card.id) ? null : String(card.id)
                                    )
                                }
                                className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                            >
                                <MoreVertical size={16} />
                            </button>

                            {activeCardMenuId === String(card.id) && (
                                <div className="absolute right-0 top-full mt-1 w-36 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded shadow-md py-1 z-20 text-xs">
                                    {!card.is_primary && onSetPrimaryCard && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setActiveCardMenuId(null);
                                                onSetPrimaryCard(String(card.id));
                                            }}
                                            className="w-full px-3 py-1.5 text-left text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80 flex items-center gap-2 cursor-pointer font-medium"
                                        >
                                            <Check size={13} className="text-emerald-500" />
                                            Set as Default
                                        </button>
                                    )}
                                    {onDeleteCard && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setActiveCardMenuId(null);
                                                onDeleteCard(String(card.id));
                                            }}
                                            className="w-full px-3 py-1.5 text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 flex items-center gap-2 cursor-pointer font-medium"
                                        >
                                            <Trash2 size={13} />
                                            Remove Card
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
