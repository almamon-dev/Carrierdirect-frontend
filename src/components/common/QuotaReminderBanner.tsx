import React from 'react';
import { Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/ui/button';

interface QuotaReminderBannerProps {
    quotaUsed?: number;
    maxQuota?: number;
    className?: string;
}

export const QuotaReminderBanner: React.FC<QuotaReminderBannerProps> = ({
    quotaUsed = 2,
    maxQuota = 5,
    className = '',
}) => {
    const navigate = useNavigate();

    return (
        <div className={`p-4 bg-gradient-to-r from-amber-50 via-orange-50/70 to-amber-50 border border-amber-200/80 rounded-md flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-amber-900 shadow-2xs ${className}`}>
            <div className="flex items-center gap-3">
                <div className="p-2.5 bg-amber-100 rounded-lg text-amber-700 shrink-0">
                    <Sparkles size={18} />
                </div>
                <div>
                    <h4 className="text-xs font-bold text-amber-950 flex items-center gap-2">
                        Free Plan Quota Reminder
                    </h4>
                    <p className="text-[12px] text-amber-800 font-medium mt-0.5">
                        You can create <strong className="font-bold text-amber-950">{maxQuota} quote requests for free</strong> on your current account. You have used <strong className="font-bold text-brand">{quotaUsed} of {maxQuota}</strong> free quotes.
                    </p>
                </div>
            </div>
            <Button
                variant="outline"
                size="sm"
                className="h-8 px-3 text-[11.5px] font-bold border-amber-300 bg-white text-amber-900 hover:bg-amber-100 cursor-pointer shrink-0 shadow-2xs"
                onClick={() => navigate('/customer/subscription')}
            >
                Upgrade Subscription
            </Button>
        </div>
    );
};

export default QuotaReminderBanner;
