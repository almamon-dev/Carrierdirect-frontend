import React from 'react';
import { Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/ui/button';

interface QuotaReminderBannerProps {
    quotaUsed?: number;
    maxQuota?: number;
    className?: string;
    title?: string;
    description?: React.ReactNode;
    targetUrl?: string;
    buttonText?: string;
    unitLabel?: string;
}

export const QuotaReminderBanner: React.FC<QuotaReminderBannerProps> = ({
    quotaUsed = 0,
    maxQuota = 5,
    className = '',
    title = 'Free Plan Quota Reminder',
    description,
    targetUrl = '/customer/subscription',
    buttonText = 'Upgrade Subscription',
    unitLabel = 'free quotes',
}) => {
    const navigate = useNavigate();

    return (
        <div className={`p-4 bg-gradient-to-r from-amber-50 via-orange-50/70 to-amber-50 border border-amber-200/80 rounded-md flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-amber-900 shadow-2xs font-sans ${className}`}>
            <div className="flex items-center gap-3">
                <div className="p-2.5 bg-amber-100 rounded-lg text-amber-700 shrink-0">
                    <Sparkles size={18} />
                </div>
                <div>
                    <h4 className="text-xs font-bold text-amber-950 flex items-center gap-2">
                        {title}
                    </h4>
                    <div className="text-[12px] text-amber-800 font-medium mt-0.5">
                        {description ? (
                            description
                        ) : (
                            <span>
                                You can create <strong className="font-bold text-amber-950">{maxQuota} {unitLabel}</strong> on your current account. You have used <strong className="font-bold text-[#ff4a1f]">{quotaUsed} of {maxQuota}</strong> {unitLabel}.
                            </span>
                        )}
                    </div>
                </div>
            </div>
            <Button
                variant="outline"
                size="sm"
                className="h-8 px-3.5 text-[11.5px] font-bold border-amber-300 bg-white text-amber-950 hover:bg-amber-100 cursor-pointer shrink-0 shadow-2xs rounded-lg"
                onClick={() => navigate(targetUrl)}
            >
                {buttonText}
            </Button>
        </div>
    );
};

export default QuotaReminderBanner;
