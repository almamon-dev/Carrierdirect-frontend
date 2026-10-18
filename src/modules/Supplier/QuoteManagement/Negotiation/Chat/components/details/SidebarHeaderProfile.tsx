import React from 'react';
import { BadgeCheck, User, FileText } from 'lucide-react';
import { NegotiationItem } from '../../../types';

interface SidebarHeaderProfileProps {
    activeNegotiation: NegotiationItem;
    statusText?: string;
    isAccepted?: boolean;
    isRejected?: boolean;
    showMobileDetails?: boolean;
    setShowMobileDetails?: (v: boolean) => void;
    onOpenProfile: () => void;
    onDocumentsClick: () => void;
}

export const SidebarHeaderProfile: React.FC<SidebarHeaderProfileProps> = ({
    activeNegotiation,
    onOpenProfile,
    onDocumentsClick,
}) => {
    const isOnline = activeNegotiation.isOnline !== false;
    const quoteNo = activeNegotiation.quoteId || (typeof activeNegotiation.id === 'string' && activeNegotiation.id.startsWith('QT-') ? activeNegotiation.id : `QT-${String(activeNegotiation.rawId).padStart(4, '0')}`);

    return (
        <div className="p-5 flex flex-col items-center border-b border-slate-100 dark:border-slate-800 text-center relative">
            <div className="relative mb-3">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-orange-50 dark:bg-orange-950/40 border-2 border-orange-200/80 dark:border-orange-900/50 flex items-center justify-center text-[#FF4A1F] font-bold text-xl shadow-xs">
                    {activeNegotiation.customerAvatar && (activeNegotiation.customerAvatar.startsWith('http') || activeNegotiation.customerAvatar.startsWith('/storage') || activeNegotiation.customerAvatar.startsWith('data:') || activeNegotiation.customerAvatar.includes('.')) ? (
                        <img
                            src={activeNegotiation.customerAvatar}
                            alt=""
                            className="w-full h-full object-contain"
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                    ) : (
                        <span>{(activeNegotiation.customer || 'C').charAt(0).toUpperCase()}</span>
                    )}
                </div>
                <span className={`absolute bottom-0 right-0 w-3.5 h-3.5 border-2 border-white dark:border-[#12161c] rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'}`} />
            </div>

            <div className="flex items-center gap-1.5 mb-0.5">
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">{activeNegotiation.customer}</h3>
                <BadgeCheck size={15} className="text-[#FF4A1F] shrink-0" />
            </div>
            <p className="text-[11.5px] font-semibold text-slate-500 dark:text-slate-400 mb-3">{quoteNo}</p>

            <div className="flex items-center gap-2">
                <button
                    type="button"
                    onClick={onOpenProfile}
                    className="px-3.5 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                >
                    <User size={13} className="text-slate-500" />
                    <span>Profile</span>
                </button>
                <button
                    type="button"
                    onClick={onDocumentsClick}
                    className="px-3.5 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                >
                    <FileText size={13} className="text-slate-500" />
                    <span>Documents</span>
                </button>
            </div>
        </div>
    );
};
