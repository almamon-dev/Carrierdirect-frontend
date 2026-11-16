import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Pin,
    Sparkles,
    RotateCcw,
    Truck,
    HeartPulse,
    Navigation,
    CreditCard,
    ArrowRight,
    CheckCircle2,
    Clock,
    Calendar,
    Gauge,
} from 'lucide-react';
import Modal from '@/components/modals/modal';
import {
    FeatureAnnouncement,
    featureReleaseService,
    CURRENT_RELEASE_VERSION,
} from '@/services/featureReleaseService';

interface WhatsNewModalProps {
    isOpen: boolean;
    onClose: () => void;
    role?: 'supplier' | 'driver' | 'customer' | string;
}

export const WhatsNewModal: React.FC<WhatsNewModalProps> = ({
    isOpen,
    onClose,
    role = 'all',
}) => {
    const navigate = useNavigate();
    const [isMarkingRead, setIsMarkingRead] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [announcements, setAnnouncements] = useState<FeatureAnnouncement[]>([]);
    const [releaseVersion, setReleaseVersion] = useState(CURRENT_RELEASE_VERSION);

    useEffect(() => {
        if (isOpen) {
            setIsLoading(true);
            featureReleaseService.getActiveAnnouncements(role).then(res => {
                setAnnouncements(res.all || []);
                setReleaseVersion(res.version || CURRENT_RELEASE_VERSION);
                setIsLoading(false);
            }).catch(() => {
                setIsLoading(false);
            });
        }
    }, [isOpen, role]);

    const handleGotIt = async () => {
        setIsMarkingRead(true);
        try {
            await featureReleaseService.markAllAsRead(role);
        } finally {
            setIsMarkingRead(false);
            onClose();
        }
    };

    const handleActionClick = async (url?: string) => {
        try {
            await featureReleaseService.markAllAsRead(role);
        } finally {
            onClose();
            if (url) {
                navigate(url);
            }
        }
    };

    const getNoticeIcon = (category?: string, key?: string) => {
        const c = (category || '').toLowerCase();
        const k = (key || '').toLowerCase();
        if (k.includes('relay') || k.includes('reassign') || c === 'dispatch') return <Truck size={20} />;
        if (k.includes('sick') || k.includes('emergency') || c === 'safety') return <HeartPulse size={20} />;
        if (k.includes('delay') || k.includes('date') || k.includes('calendar')) return <Calendar size={20} />;
        if (k.includes('gps') || k.includes('nav')) return <Navigation size={20} />;
        if (k.includes('telematics') || k.includes('fuel')) return <Gauge size={20} />;
        if (k.includes('escrow') || k.includes('billing')) return <CreditCard size={20} />;
        return <Sparkles size={20} />;
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleGotIt}
            size="lg"
            showCloseButton={true}
            closeOnOutsideClick={true}
            title={
                <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-[4px] bg-orange-100 text-[#FF4A1F] flex items-center justify-center shrink-0 shadow-2xs">
                        <Pin size={14} className="rotate-45" />
                    </span>
                    <div>
                        <div className="flex items-center gap-1.5">
                            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 leading-none">
                                Platform Releases & Feature Notices
                            </h2>
                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-[4px] bg-orange-50 text-[#FF4A1F] border border-orange-200">
                                {releaseVersion}
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-none">
                            Stay up to date with the latest updates and new features on CarrierDirect.
                        </p>
                    </div>
                </div>
            }
            footer={
                <div className="w-full flex items-center justify-between gap-2 pt-1 text-xs">
                    <span className="text-xs text-slate-500 font-medium">
                        {announcements.length} updates & features active
                    </span>

                    <button
                        type="button"
                        disabled={isMarkingRead}
                        onClick={handleGotIt}
                        className="px-5 py-2 bg-[#FF4A1F] hover:bg-[#e03d15] text-white text-xs font-bold rounded-[4px] shadow-2xs transition-colors cursor-pointer disabled:opacity-50"
                    >
                        {isMarkingRead ? 'Saving...' : 'Got It, Close'}
                    </button>
                </div>
            }
        >
            <div className="space-y-3 max-h-[58vh] overflow-y-auto pr-1">
                {isLoading ? (
                    <div className="py-8 text-center text-xs text-slate-400">
                        Loading updates...
                    </div>
                ) : announcements.length === 0 ? (
                    <div className="py-8 text-center text-xs text-slate-400 bg-slate-50 rounded-[4px] border border-dashed border-slate-200">
                        No active notices found.
                    </div>
                ) : (
                    announcements.map((item) => {
                        const isLive = item.status === 'live';
                        const isUpcoming = item.status === 'coming_soon' || !isLive;

                        return (
                            <div
                                key={item.id}
                                className={`rounded-[4px] border transition-all p-3.5 sm:p-4 shadow-2xs flex flex-col justify-between ${
                                    isLive
                                        ? 'border-orange-200 bg-[#fffcf9] hover:bg-[#fff9f5]'
                                        : 'border-purple-200 bg-[#faf8ff] hover:bg-[#f6f2ff]'
                                }`}
                            >
                                {/* Top Content Row */}
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-start gap-3 min-w-0">
                                        {/* Icon Container */}
                                        <div
                                            className={`w-10 h-10 rounded-[4px] flex items-center justify-center shrink-0 shadow-2xs ${
                                                isLive
                                                    ? 'bg-orange-100/80 text-[#FF4A1F]'
                                                    : 'bg-purple-100/80 text-purple-600'
                                            }`}
                                        >
                                            {getNoticeIcon(item.category, item.feature_key)}
                                        </div>

                                        {/* Content */}
                                        <div className="min-w-0">
                                            {/* Tag Pill */}
                                            <div className="mb-1">
                                                {isLive ? (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[4px] text-[10.5px] font-semibold bg-purple-50 text-purple-700 border border-purple-200/80">
                                                        <Sparkles size={10} className="text-purple-600" />
                                                        <span>{item.badge || 'New Feature'}</span>
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[4px] text-[10.5px] font-semibold bg-purple-50 text-purple-700 border border-purple-200/80">
                                                        <RotateCcw size={10} className="text-purple-600" />
                                                        <span>{item.badge || 'Upcoming Feature'}</span>
                                                    </span>
                                                )}
                                            </div>

                                            {/* Title */}
                                            <h3 className="text-sm font-bold text-slate-900 leading-snug">
                                                {item.title}
                                            </h3>

                                            {/* Description */}
                                            <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                                                {item.summary}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Status Badge (Top Right) */}
                                    <div className="shrink-0">
                                        {isLive ? (
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                <span>Live</span>
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200/80">
                                                <Clock size={11} className="text-purple-600" />
                                                <span>Coming Soon</span>
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Footer of card */}
                                <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                                    <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                                        <Calendar size={12} className="text-slate-400" />
                                        <span>
                                            {isUpcoming && !item.release_date?.startsWith('ETA')
                                                ? `ETA: ${item.release_date || '30 Nov 2026'}`
                                                : item.release_date || '16 Nov 2026'}
                                        </span>
                                    </span>

                                    {isLive && item.action_url ? (
                                        <button
                                            type="button"
                                            onClick={() => handleActionClick(item.action_url)}
                                            className="inline-flex items-center gap-1 text-[11px] font-bold text-[#FF4A1F] hover:underline cursor-pointer"
                                        >
                                            <span>Details</span>
                                            <ArrowRight size={11} />
                                        </button>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#FF4A1F]">
                                            <span>Details</span>
                                            <ArrowRight size={11} />
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </Modal>
    );
};
