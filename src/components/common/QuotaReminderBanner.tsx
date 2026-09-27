import React from 'react';
import { ArrowRight, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface QuotaReminderBannerProps {
    quotaUsed?: number;
    maxQuota?: number;
    daysRemaining?: number | null;
    className?: string;
    title?: string;
    description?: React.ReactNode;
    targetUrl?: string;
    buttonText?: string;
    unitLabel?: string;
    onUpgradeClick?: () => void;
}

export const QuotaReminderBanner: React.FC<QuotaReminderBannerProps> = ({
    quotaUsed = 0,
    maxQuota = 3,
    daysRemaining,
    className = '',
    title = '7-Day Free Trial Quota Reminder',
    description,
    targetUrl = '/customer/subscription',
    buttonText = 'Upgrade Subscription',
    unitLabel = 'free quotes',
    onUpgradeClick,
}) => {
    const navigate = useNavigate();

    const handleClick = () => {
        if (onUpgradeClick) {
            onUpgradeClick();
        } else {
            navigate(targetUrl);
        }
    };

    return (
        <div className={`p-3 sm:p-3.5 bg-gradient-to-r from-amber-50 via-orange-50/70 to-amber-50 dark:from-amber-950/30 dark:via-orange-950/20 dark:to-amber-950/30 border border-amber-200/80 dark:border-amber-800/50 rounded-[4px] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-amber-900 dark:text-amber-200 shadow-2xs font-sans ${className}`}>
            <div>
                <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-xs font-bold text-amber-950 dark:text-amber-100 flex items-center gap-1.5">
                        <span>{title}</span>
                    </h4>
                    {daysRemaining !== undefined && daysRemaining !== null && (
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-[3px] text-[10.5px] font-bold border ${
                            daysRemaining <= 0
                                ? 'bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800'
                                : daysRemaining <= 2
                                ? 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-700'
                                : 'bg-orange-100 text-[#ff4a1f] border-orange-200 dark:bg-orange-950/60 dark:text-orange-300 dark:border-orange-800'
                        }`}>
                            <Clock size={11} className="shrink-0" />
                            <span>
                                {daysRemaining <= 0
                                    ? 'Trial Expired'
                                    : `${daysRemaining} ${daysRemaining === 1 ? 'day' : 'days'} remaining`}
                            </span>
                        </span>
                    )}
                </div>
                <div className="text-[11.5px] text-amber-800 dark:text-amber-300 font-medium mt-0.5 leading-snug">
                    {description ? (
                        description
                    ) : (
                        <span>
                            You can create <strong className="font-bold text-amber-950 dark:text-amber-100">{maxQuota} {unitLabel}</strong> on your current account{daysRemaining !== undefined && daysRemaining !== null && daysRemaining > 0 ? ` (${daysRemaining} ${daysRemaining === 1 ? 'day' : 'days'} remaining)` : ''}. You have used <strong className="font-bold text-[#ff4a1f]">{quotaUsed} of {maxQuota}</strong> {unitLabel}.
                        </span>
                    )}
                </div>
            </div>
            <button
                type="button"
                onClick={handleClick}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#ff4a1f] hover:text-[#e03e15] hover:underline cursor-pointer shrink-0 transition-colors whitespace-nowrap py-1 px-1.5 rounded-[3px]"
            >
                <span>{buttonText}</span>
                <ArrowRight size={13} className="shrink-0" />
            </button>
        </div>
    );
};

export default QuotaReminderBanner;
