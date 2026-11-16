import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { featureReleaseService, CURRENT_RELEASE_VERSION } from '@/services/featureReleaseService';
import { WhatsNewModal } from './WhatsNewModal';

interface WhatsNewTriggerProps {
    role?: 'supplier' | 'driver' | 'customer' | string;
    className?: string;
}

export const WhatsNewTrigger: React.FC<WhatsNewTriggerProps> = ({
    role = 'all',
    className = '',
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [hasUnseen, setHasUnseen] = useState(false);

    useEffect(() => {
        // 1. Initial check from active API/database
        featureReleaseService.getActiveAnnouncements(role).then(res => {
            setHasUnseen(Boolean(res.has_unseen));
        });

        // 2. Subscribe to real-time mark-as-read events
        const unsubscribe = featureReleaseService.subscribeToReadEvents((unseen) => {
            setHasUnseen(unseen);
        });

        return () => {
            unsubscribe();
        };
    }, [role]);

    const handleClick = () => {
        setIsOpen(true);
    };

    return (
        <>
            <button
                type="button"
                onClick={handleClick}
                title="What's New in CarrierDirect"
                className={`relative h-9 px-2.5 rounded-full bg-slate-100 dark:bg-[#1e2329] hover:bg-orange-50 dark:hover:bg-orange-950/40 border border-slate-200/80 dark:border-slate-700/80 hover:border-orange-200 dark:hover:border-orange-800/60 text-slate-700 dark:text-slate-200 hover:text-[#FF4A1F] dark:hover:text-[#FF4A1F] flex items-center gap-1.5 transition-all text-xs font-bold cursor-pointer shadow-2xs ${className}`}
            >
                <Sparkles size={14} className="text-[#FF4A1F] shrink-0" />
                <span className="hidden md:inline">What's New</span>

                {/* Hide the dot once user marks as read in database */}
                {hasUnseen && (
                    <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF4A1F] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#FF4A1F] border-2 border-white dark:border-[#1e2329]"></span>
                    </span>
                )}
            </button>

            <WhatsNewModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                role={role}
            />
        </>
    );
};
