import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, X } from 'lucide-react';
import { featureReleaseService, CURRENT_RELEASE_VERSION } from '@/services/featureReleaseService';

interface FeatureAnnouncementBannerProps {
    onOpenModal: () => void;
    version?: string;
    role?: string;
}

export const FeatureAnnouncementBanner: React.FC<FeatureAnnouncementBannerProps> = ({
    onOpenModal,
    version = CURRENT_RELEASE_VERSION,
    role = 'all',
}) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Only show if user has unread announcements in database
        featureReleaseService.getActiveAnnouncements(role).then(res => {
            const isDismissed = featureReleaseService.isBannerDismissed(version);
            if (res.has_unseen && !isDismissed) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        });

        const unsubscribe = featureReleaseService.subscribeToReadEvents((hasUnseen) => {
            if (!hasUnseen) {
                setIsVisible(false);
            }
        });

        return () => {
            unsubscribe();
        };
    }, [version, role]);

    if (!isVisible) return null;

    const handleDismiss = () => {
        featureReleaseService.dismissBanner(version);
        setIsVisible(false);
    };

    return (
        <div className="w-full bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50/40 dark:from-[#241a15] dark:via-[#221c17] dark:to-[#1a1c22] border-b border-orange-200/90 dark:border-orange-950/80 px-3 sm:px-4 py-2 flex items-center justify-between gap-3 text-xs animate-in fade-in duration-200">
            <div className="flex items-center gap-2 min-w-0">
                <span className="w-5 h-5 rounded-full bg-orange-100 dark:bg-orange-950/60 text-[#FF4A1F] flex items-center justify-center shrink-0 shadow-2xs">
                    <Sparkles size={11} />
                </span>
                <p className="text-slate-800 dark:text-slate-200 font-medium truncate">
                    <strong className="text-slate-900 dark:text-white font-bold">New Release ({version}):</strong> Multi-Driver Relay Dispatch & Driver Sick Leave reporting are live!
                </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
                <button
                    type="button"
                    onClick={onOpenModal}
                    className="px-2.5 py-1 bg-white dark:bg-[#1e2329] hover:bg-orange-50 dark:hover:bg-orange-950/40 text-[#FF4A1F] border border-orange-200/80 dark:border-orange-900/60 rounded-full font-bold text-[11px] flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
                >
                    <span>What's New</span>
                    <ArrowRight size={10} />
                </button>

                <button
                    type="button"
                    onClick={handleDismiss}
                    aria-label="Dismiss announcement banner"
                    className="w-5 h-5 rounded-full hover:bg-slate-200/60 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center justify-center transition-colors cursor-pointer"
                >
                    <X size={12} />
                </button>
            </div>
        </div>
    );
};
