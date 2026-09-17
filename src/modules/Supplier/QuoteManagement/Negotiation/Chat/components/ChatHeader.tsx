import { ArrowLeft, BadgeCheck, Clock, Info } from 'lucide-react';
import React from 'react';
import { NegotiationItem } from '../../types';

interface ChatHeaderProps {
    activeNegotiation: NegotiationItem;
    sessionKey?: string;
    showMobileDetails: boolean;
    setShowMobileDetails: (v: boolean) => void;
    onCallClick?: (type: 'audio' | 'video') => void;
    onOpenMobileSidebar?: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
    activeNegotiation,
    showMobileDetails,
    setShowMobileDetails,
    onOpenMobileSidebar
}) => {
    const isUnderReview = activeNegotiation.status?.toLowerCase().includes('review') ||
        activeNegotiation.revisionStatus?.toLowerCase().includes('review') ||
        Boolean(activeNegotiation.isUnderReview);

    const isVerified = activeNegotiation.isVerified !== false;

    return (
        <div
            className="bg-white border-b border-slate-200 px-3 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between z-10 sticky top-0 shadow-xs font-sans shrink-0">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                {/* Mobile Back / Conversations Button */}
                {onOpenMobileSidebar && (
                    <button
                        type="button"
                        onClick={onOpenMobileSidebar}
                        className="lg:hidden h-8 w-8 -ml-1 flex items-center justify-center rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 active:bg-slate-200 transition-colors cursor-pointer shrink-0"
                        title="All Negotiations"
                        aria-label="Open negotiations list"
                    >
                        <ArrowLeft size={19} />
                    </button>
                )}

                {/* Customer Avatar with Online Indicator */}
                <div className="relative shrink-0">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-sm sm:text-base overflow-hidden bg-orange-50 text-[#FF4A1F] border border-orange-200/80">
                        {activeNegotiation.customerAvatar && (activeNegotiation.customerAvatar.startsWith('http') || activeNegotiation.customerAvatar.startsWith('/storage') || activeNegotiation.customerAvatar.startsWith('data:') || activeNegotiation.customerAvatar.includes('.')) ? (
                            <img
                                src={activeNegotiation.customerAvatar}
                                alt=""
                                className="w-full h-full object-cover"
                                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                            />
                        ) : (
                            <span>{(activeNegotiation.customer || 'C').charAt(0).toUpperCase()}</span>
                        )}
                    </div>
                    <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 sm:w-3 sm:h-3 border-2 border-white rounded-full z-10 shadow-2xs ${activeNegotiation.isOnline ? "bg-emerald-500" : "bg-slate-300"}`} />
                </div>

                {/* Customer Name and Status */}
                <div className="min-w-0">
                    <div className="flex items-center gap-1.5 min-w-0">
                        <h2 className="text-[13.5px] sm:text-[15px] font-bold text-slate-800 truncate max-w-[130px] sm:max-w-[220px] md:max-w-none">
                            {activeNegotiation.customer}
                        </h2>
                        {isUnderReview ? (
                            <span title="Under Review" className="inline-flex items-center text-amber-500 shrink-0">
                                <Clock size={15} className="shrink-0" />
                            </span>
                        ) : isVerified ? (
                            <span title="Verified Partner" className="inline-flex items-center text-[#FF4A1F] shrink-0">
                                <BadgeCheck size={15} className="shrink-0" />
                            </span>
                        ) : null}
                    </div>
                    <div className="text-[11px] sm:text-[12px] text-slate-500 font-medium mt-0.5 flex items-center gap-1.5 truncate">
                        <span className={`shrink-0 font-semibold ${activeNegotiation.isOnline ? "text-emerald-600" : "text-slate-400"}`}>{activeNegotiation.lastSeenHuman || (activeNegotiation.isOnline ? "Active now" : "Offline")}</span>
                        <span className="text-slate-300">•</span>
                        <span className="font-bold text-slate-700 shrink-0">{activeNegotiation.quoteId}</span>

                    </div>
                </div>
            </div>

            {/* Right Action Icons */}
            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                <button
                    type="button"
                    className={`h-8 w-8 rounded-full flex items-center justify-center cursor-pointer transition-colors border ${showMobileDetails
                        ? 'bg-orange-50 text-[#FF4A1F] border-orange-200/80 shadow-2xs'
                        : 'text-slate-500 hover:text-slate-800 border-slate-200/80 hover:bg-slate-100'
                        }`}
                    onClick={() => setShowMobileDetails(!showMobileDetails)}
                    title={showMobileDetails ? 'Hide Quote Details' : 'Show Quote Details'}
                    aria-label="Toggle quote details sidebar"
                >
                    <Info size={16} />
                </button>
            </div>
        </div>
    );
};
