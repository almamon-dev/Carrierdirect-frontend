import React from 'react';
import Button from '@/components/ui/button';
import { Send, Truck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface OfferSubmitButtonsProps {
    isWon: boolean;
    isExpired: boolean;
    isEditing?: boolean;
    onCancelEdit?: () => void;
    isSubmitting: boolean;
    totalAmountNum: number;
    onSubmit: () => void;
}

export const OfferSubmitButtons: React.FC<OfferSubmitButtonsProps> = ({
    isWon,
    isExpired,
    isEditing,
    onCancelEdit,
    isSubmitting,
    totalAmountNum,
    onSubmit,
}) => {
    const navigate = useNavigate();

    if (isWon) {
        return (
            <div className="pt-1 space-y-1">
                <Button
                    variant="primary"
                    className="w-full h-8.5 sm:h-9 text-xs font-semibold shadow-2xs rounded-[3px] flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                    icon={<Truck size={13} />}
                    onClick={() => navigate('/supplier/orders/active-jobs')}
                >
                    View Order in Active Jobs
                </Button>
            </div>
        );
    }

    return (
        <div className="pt-1 space-y-1">
            <div className="flex items-center gap-2">
                {isEditing && onCancelEdit && (
                    <Button
                        type="button"
                        variant="outline"
                        className="flex-1 h-10 text-xs sm:text-[13px] font-semibold rounded-md border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                        onClick={onCancelEdit}
                    >
                        Cancel
                    </Button>
                )}
                <Button
                    variant="primary"
                    className={`${isEditing && onCancelEdit ? 'flex-1' : 'w-full'} h-10 text-xs sm:text-[13px] font-semibold shadow-2xs rounded-md flex items-center justify-center gap-2 ${
                        isExpired
                            ? 'bg-slate-200 text-slate-400 dark:bg-slate-800 dark:text-slate-500 cursor-not-allowed'
                            : 'bg-[#ff4a1f] hover:bg-[#e03e15] text-white cursor-pointer'
                    }`}
                    icon={!isSubmitting && !isExpired ? <Send size={12} /> : undefined}
                    isLoading={isSubmitting}
                    onClick={onSubmit}
                    disabled={isExpired || totalAmountNum <= 0 || isSubmitting}
                >
                    {isExpired
                        ? 'Quote Request Expired (Closed)'
                        : isEditing
                            ? 'Update Commercial Offer'
                            : totalAmountNum > 0
                                ? `Submit Commercial Offer (€ ${totalAmountNum.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})`
                                : 'Submit Commercial Offer'}
                </Button>
            </div>
        </div>
    );
};
