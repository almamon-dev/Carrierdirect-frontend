import React from 'react';
import { BadgeCheck, CheckCircle2, XCircle, FileText, User, X } from 'lucide-react';
import { NegotiationItem } from '../../../types';

interface SidebarHeaderProfileProps {
    activeNegotiation: NegotiationItem;
    statusText: string;
    isAccepted: boolean;
    isRejected: boolean;
    showMobileDetails: boolean;
    setShowMobileDetails: (v: boolean) => void;
    onOpenProfile: () => void;
    onDocumentsClick: () => void;
}

export const SidebarHeaderProfile: React.FC<SidebarHeaderProfileProps> = ({
    activeNegotiation,
    statusText,
    isAccepted,
    isRejected,
    showMobileDetails,
    setShowMobileDetails,
    onOpenProfile,
    onDocumentsClick,
}) => {
    const getStatusBadgeClass = () => {
        if (isAccepted) return 'text-emerald-700 bg-emerald-50 border-emerald-200/80';
        if (isRejected) return 'text-rose-700 bg-rose-50 border-rose-200/80';
        return 'text-amber-700 bg-amber-50 border-amber-200/60';
    };

    return (
        <div className="flex flex-col items-center pt-6 pb-4 px-4 border-b border-slate-100 relative">
            {showMobileDetails && (
                <button type="button" onClick={() => setShowMobileDetails(false)} className="absolute top-3 right-3 p-1.5 text-slate-400 hover:text-slate-700 rounded-full">
                    <X size={18} />
                </button>
            )}
            <div className="relative mb-2">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-orange-50 text-[#FF4A1F] border border-orange-200 flex items-center justify-center font-bold text-2xl shadow-2xs">
                    {activeNegotiation.customerAvatar ? (
                        <img src={activeNegotiation.customerAvatar} alt={activeNegotiation.customer} className="w-full h-full object-cover" />
                    ) : (
                        <span>{activeNegotiation.customer.charAt(0).toUpperCase()}</span>
                    )}
                </div>
                <span className="absolute bottom-0.5 right-0.5 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full z-10 shadow-xs" />
            </div>

            <div className="flex items-center gap-1 justify-center">
                <h3 className="text-[14px] font-bold text-slate-800">{activeNegotiation.customer}</h3>
                <span title="Verified Client"><BadgeCheck size={16} className="text-[#FF4A1F]" /></span>
            </div>
            <p className="text-[11px] font-semibold text-[#FF4A1F] mt-0.5">{activeNegotiation.quoteId}</p>

            <div className="mt-2 flex items-center gap-2">
                <span className={`inline-flex items-center gap-1 border px-2.5 py-0.5 rounded-full text-[10.5px] font-bold shadow-2xs ${getStatusBadgeClass()}`}>
                    {isAccepted ? <CheckCircle2 size={12} className="text-emerald-600" /> : isRejected ? <XCircle size={12} className="text-rose-600" /> : null}
                    {statusText}
                </span>
                <span className="inline-flex items-center gap-1 bg-slate-50 text-slate-600 border border-slate-200/80 px-2 py-0.5 rounded-full text-[10.5px] font-semibold">★ {activeNegotiation.customerRating || 0.0}</span>
            </div>

            <div className="flex items-center gap-6 mt-4">
                <div onClick={onOpenProfile} className="flex flex-col items-center gap-1 cursor-pointer group">
                    <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center group-hover:bg-orange-50 group-hover:text-[#FF4A1F] transition-colors"><User size={15} /></div>
                    <span className="text-[10.5px] font-semibold text-slate-600">Profile</span>
                </div>
                <div onClick={onDocumentsClick} className="flex flex-col items-center gap-1 cursor-pointer group">
                    <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center group-hover:bg-orange-50 group-hover:text-[#FF4A1F] transition-colors"><FileText size={15} /></div>
                    <span className="text-[10.5px] font-semibold text-slate-600">Documents</span>
                </div>
            </div>
        </div>
    );
};
