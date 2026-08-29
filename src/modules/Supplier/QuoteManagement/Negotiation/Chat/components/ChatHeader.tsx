import React from 'react';
import { Phone, Video, Info, BadgeCheck, Clock } from 'lucide-react';
import Button from '@/components/ui/button';
import { NegotiationItem } from '../../types';

interface ChatHeaderProps {
    activeNegotiation: NegotiationItem;
    sessionKey?: string;
    showMobileDetails: boolean;
    setShowMobileDetails: (v: boolean) => void;
    onCallClick?: (type: 'audio' | 'video') => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
    activeNegotiation,
    sessionKey,
    showMobileDetails,
    setShowMobileDetails,
    onCallClick
}) => {
    const isUnderReview = activeNegotiation.status?.toLowerCase().includes('review') ||
        activeNegotiation.revisionStatus?.toLowerCase().includes('review') ||
        Boolean(activeNegotiation.isUnderReview);

    const isVerified = activeNegotiation.isVerified !== false;

    return (
        <div className="bg-white border-b border-slate-200 px-4 py-2.5 flex items-center justify-between z-10 sticky top-0 shadow-xs">
            <div className="flex items-center gap-3">
                <div className="relative shrink-0">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-base overflow-hidden bg-orange-50 text-[#FF4A1F] border border-orange-200/80">
                        {activeNegotiation.customerAvatar ? (
                            <img src={activeNegotiation.customerAvatar} alt={activeNegotiation.customer} className="w-full h-full object-cover" />
                        ) : (
                            <span>{activeNegotiation.customer.charAt(0).toUpperCase()}</span>
                        )}
                    </div>
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full z-10 shadow-2xs" />
                </div>
                <div>
                    <div className="flex items-center gap-1.5">
                        <h2 className="text-[15px] font-bold text-slate-800">{activeNegotiation.customer}</h2>
                        {isUnderReview ? (
                            <span title="Under Review" className="inline-flex items-center text-amber-500">
                                <Clock size={16} className="shrink-0" />
                            </span>
                        ) : isVerified ? (
                            <span title="Verified Partner" className="inline-flex items-center text-[#FF4A1F]">
                                <BadgeCheck size={16} className="shrink-0" />
                            </span>
                        ) : null}
                    </div>
                    <div className="text-[12px] text-slate-500 font-medium mt-0.5 flex items-center gap-2">
                        <span>Active now</span>
                        <span>•</span>
                        <span className="font-bold text-slate-700">{activeNegotiation.quoteId}</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-1 sm:gap-2">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onCallClick?.('audio')}
                    className="h-9 w-9 text-slate-600 rounded-full hover:bg-slate-100 hidden sm:flex cursor-pointer"
                    title="Audio Call"
                >
                    <Phone size={18} />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onCallClick?.('video')}
                    className="h-9 w-9 text-slate-600 rounded-full hover:bg-slate-100 hidden sm:flex cursor-pointer"
                    title="Video Call"
                >
                    <Video size={18} />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-slate-600 rounded-full hover:bg-slate-100 xl:hidden cursor-pointer"
                    onClick={() => setShowMobileDetails(!showMobileDetails)}
                    title="Toggle Quote Details"
                >
                    <Info size={18} />
                </Button>
            </div>
        </div>
    );
};
