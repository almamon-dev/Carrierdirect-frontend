import { ArrowLeft, BadgeCheck, Clock, MoreVertical } from 'lucide-react';
import React, { useState } from 'react';
import Skeleton from '@/components/ui/skeleton';
import { NegotiationItem } from '../../types';

interface ChatHeaderProps {
    activeNegotiation?: NegotiationItem | null;
    sessionKey?: string;
    showMobileDetails: boolean;
    setShowMobileDetails: (v: boolean) => void;
    onCallClick?: (type: 'audio' | 'video') => void;
    onOpenMobileSidebar?: () => void;
    isLoading?: boolean;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
    activeNegotiation,
    showMobileDetails,
    setShowMobileDetails,
    onOpenMobileSidebar,
    isLoading = false
}) => {
    const [showMenu, setShowMenu] = useState(false);

    const isUnderReview = activeNegotiation?.status?.toLowerCase().includes('review') ||
        activeNegotiation?.revisionStatus?.toLowerCase().includes('review') ||
        Boolean(activeNegotiation?.isUnderReview);

    const isVerified = activeNegotiation?.isVerified !== false;

    // Get initials e.g. Customer Co 1 -> C1
    const nameWords = (activeNegotiation?.customer || 'C').split(' ');
    const initials = nameWords.length > 2 && !isNaN(Number(nameWords[nameWords.length - 1]))
        ? `${nameWords[0].charAt(0)}${nameWords[nameWords.length - 1]}`
        : `${(activeNegotiation?.customer || 'C').charAt(0)}${nameWords.length > 1 ? nameWords[1].charAt(0) : ''}`.toUpperCase();

    const rawLastSeen = activeNegotiation?.lastSeenHuman;
    const lastSeenDisplay = rawLastSeen
        ? (rawLastSeen.toLowerCase().startsWith('active') ? rawLastSeen : `Active ${rawLastSeen}`)
        : (activeNegotiation?.isOnline !== false ? "Active now" : "Offline");

    const isHeaderLoading = isLoading || !activeNegotiation;

    return (
        <div className="h-[60px] bg-white dark:bg-[#12161c] border-b border-slate-200 dark:border-slate-800 px-3 sm:px-4 flex items-center justify-between z-10 sticky top-0 shadow-2xs font-sans shrink-0 box-border">
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                {/* Mobile Back / Conversations Button */}
                {onOpenMobileSidebar && (
                    <button
                        type="button"
                        onClick={onOpenMobileSidebar}
                        className="lg:hidden h-8 w-8 -ml-1 flex items-center justify-center rounded-[4px] text-slate-600 hover:text-slate-900 hover:bg-slate-100 active:bg-slate-200 transition-colors cursor-pointer shrink-0"
                        title="All Negotiations"
                        aria-label="Open negotiations list"
                    >
                        <ArrowLeft size={19} />
                    </button>
                )}

                {isHeaderLoading ? (
                    <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 animate-in fade-in duration-150">
                        <Skeleton className="w-9 h-9 sm:w-10 sm:h-10 rounded-full shrink-0 aspect-square" />
                        <div className="min-w-0 space-y-1.5">
                            <Skeleton className="h-4 w-32 rounded-md" />
                            <div className="flex items-center gap-1.5">
                                <Skeleton className="h-3 w-16 rounded-md" />
                                <span className="text-slate-300 dark:text-slate-700">•</span>
                                <Skeleton className="h-3 w-14 rounded-md" />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 animate-in fade-in duration-150">
                        {/* Customer Avatar with Online Indicator */}
                        <div className="relative shrink-0">
                            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-sm overflow-hidden bg-[#dcfce7] text-[#16a34a] border border-[#bbf7d0]">
                                {activeNegotiation.customerAvatar && (activeNegotiation.customerAvatar.startsWith('http') || activeNegotiation.customerAvatar.startsWith('/storage') || activeNegotiation.customerAvatar.startsWith('data:') || activeNegotiation.customerAvatar.includes('.')) ? (
                                    <img
                                        src={activeNegotiation.customerAvatar}
                                        alt=""
                                        className="w-full h-full object-cover"
                                        onError={(e) => { (e.currentTarget as HTMLElement).style.display = 'none'; }}
                                    />
                                ) : (
                                    <span>{initials || "C1"}</span>
                                )}
                            </div>
                            <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 sm:w-3 sm:h-3 border-2 border-white rounded-full z-10 shadow-2xs ${activeNegotiation.isOnline !== false ? "bg-emerald-500" : "bg-slate-300"}`} />
                        </div>

                        {/* Customer Name and Status */}
                        <div className="min-w-0">
                            <div className="flex items-center gap-1.5 min-w-0">
                                <h2 className="text-[13.5px] sm:text-[14.5px] font-bold text-slate-900 truncate max-w-[130px] sm:max-w-[220px] md:max-w-none">
                                    {activeNegotiation.customer}
                                </h2>
                                {isUnderReview ? (
                                    <span title="Under Review" className="inline-flex items-center text-amber-500 shrink-0">
                                        <Clock size={14} className="shrink-0" />
                                    </span>
                                ) : isVerified ? (
                                    <span title="Verified Partner" className="inline-flex items-center text-[#FF6A00] shrink-0">
                                        <BadgeCheck size={14} className="shrink-0 fill-[#FF6A00]/20" />
                                    </span>
                                ) : null}
                            </div>
                            <div className="text-[11px] sm:text-[11.5px] text-slate-500 font-medium mt-0.5 flex items-center gap-1.5 truncate">
                                <span className="shrink-0 text-slate-500 font-normal">
                                    {lastSeenDisplay}
                                </span>
                                <span className="text-slate-300">•</span>
                                <span className="font-semibold text-slate-600 shrink-0">{activeNegotiation.quoteId}</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Right Action Menu */}
            <div className="flex items-center gap-1 sm:gap-1.5 shrink-0 relative">
                {isHeaderLoading ? (
                    <button
                        type="button"
                        disabled
                        className="h-8 w-8 rounded-[4px] flex items-center justify-center text-slate-400 opacity-60 cursor-not-allowed"
                        title="More Options"
                    >
                        <MoreVertical size={18} />
                    </button>
                ) : (
                    <>
                        <button
                            type="button"
                            onClick={() => setShowMenu(!showMenu)}
                            className="h-8 w-8 rounded-[4px] flex items-center justify-center cursor-pointer text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-colors"
                            title="More Options"
                            aria-label="More options"
                        >
                            <MoreVertical size={18} />
                        </button>

                        {showMenu && (
                            <div className="absolute right-0 top-full mt-1.5 w-44 bg-white dark:bg-slate-800 rounded-[4px] shadow-lg border border-slate-200 dark:border-slate-700 py-1 z-50 animate-in fade-in-50 duration-100 text-xs font-medium">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowMobileDetails(true);
                                        setShowMenu(false);
                                    }}
                                    className="w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 cursor-pointer"
                                >
                                    View Quote Details
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        navigator.clipboard.writeText(String(activeNegotiation.quoteId));
                                        setShowMenu(false);
                                    }}
                                    className="w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 cursor-pointer"
                                >
                                    Copy Quote ID
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};
