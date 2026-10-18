import React from 'react';
import { Sparkles, ArrowUpRight } from 'lucide-react';
import Button from '@/components/ui/button';
import Badge from '@/components/ui/badge';
import { UserSubscriptionData, SavedCardItem } from '../types';
import { SubscriptionPaymentMethodsCard } from './SubscriptionPaymentMethodsCard';

interface SubscriptionOverviewTabProps {
    subscription: UserSubscriptionData | null;
    savedCards: SavedCardItem[];
    onUpgradeClick: () => void;
    onToggleAutoRenew: (currentValue: boolean) => Promise<void>;
    onOpenCancelModal: () => void;
    onOpenAddCard: () => void;
    onSetDefaultCard?: (id: string) => Promise<void>;
    onDeleteCard?: (id: string) => Promise<void>;
}

export const SubscriptionOverviewTab: React.FC<SubscriptionOverviewTabProps> = ({
    subscription,
    savedCards,
    onUpgradeClick,
    onToggleAutoRenew,
    onOpenCancelModal,
    onOpenAddCard,
    onSetDefaultCard,
    onDeleteCard,
}) => {
    const plan = subscription?.plan;
    const isTrial = subscription?.is_trial;
    const isActive = subscription?.is_active ?? false;
    const autoRenew = subscription?.auto_renew ?? true;

    return (
        <div className="space-y-4">
            {/* Current Active Plan Card */}
            <div className="bg-white dark:bg-[#181d24] border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-2xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800/80">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                                Current Subscription Tier
                            </span>
                            <Badge
                                variant={isActive ? 'success' : 'critical'}
                                className="text-[10px] font-bold px-2 py-0.5 rounded"
                            >
                                {isActive ? (isTrial ? 'Active Trial' : 'Active Plan') : 'Expired'}
                            </Badge>
                        </div>
                        <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                            {plan?.name || (isTrial ? '7-Day Free Trial' : 'Standard Plan')}
                        </h2>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={onUpgradeClick}
                            className="h-8.5 px-3.5 bg-[#ff4a1f] hover:bg-[#e03e15] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs"
                        >
                            <Sparkles size={14} />
                            <span>Upgrade Plan</span>
                            <ArrowUpRight size={14} />
                        </Button>
                    </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                    <div className="space-y-1">
                        <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">Billing Period</span>
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-200 capitalize">
                            {plan?.billing_period || 'Monthly'} Cycle
                        </p>
                    </div>
                    <div className="space-y-1">
                        <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">Plan Cost</span>
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                            {plan?.price_formatted || (isTrial ? '€0.00 EUR / 7 Days' : '€49.00 EUR')}
                        </p>
                    </div>
                    <div className="space-y-1">
                        <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                            {isActive ? 'Cycle Renews / Expires On' : 'Expired On'}
                        </span>
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                            {subscription?.expires_at || '—'} ({subscription?.days_remaining ?? 0} days remaining)
                        </p>
                    </div>
                </div>

                {/* Auto Renew & Cancellation footer */}
                {!isTrial && (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">Auto-Renewal:</span>
                            <button
                                type="button"
                                onClick={() => onToggleAutoRenew(autoRenew)}
                                className={`px-2.5 py-1 text-xs font-bold rounded cursor-pointer transition-colors ${
                                    autoRenew
                                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                                }`}
                            >
                                {autoRenew ? 'Enabled' : 'Disabled'}
                            </button>
                        </div>

                        {isActive && (
                            <button
                                type="button"
                                onClick={onOpenCancelModal}
                                className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline cursor-pointer text-left"
                            >
                                Cancel Subscription
                            </button>
                        )}
                    </div>
                )}
            </div>

            <SubscriptionPaymentMethodsCard
                savedCards={savedCards}
                onOpenAddCard={onOpenAddCard}
                onSetDefaultCard={onSetDefaultCard}
                onDeleteCard={onDeleteCard}
            />
        </div>
    );
};

export default SubscriptionOverviewTab;
