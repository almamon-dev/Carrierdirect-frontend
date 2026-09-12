import React from 'react';
import { ArrowLeft, Info } from 'lucide-react';
import { VerifiedBadge } from '@/components/common/VerifiedBadge';
import { getAttachmentUrl } from '@/modules/Customer/QuoteManagement/Negotiation/Chat/utils/customerChatUtils';

interface GeneralChatStreamHeaderProps {
    partner: any;
    onBack: () => void;
    showDetailsPanel: boolean;
    onToggleDetailsPanel: () => void;
}

export const GeneralChatStreamHeader: React.FC<GeneralChatStreamHeaderProps> = ({
    partner,
    onBack,
    showDetailsPanel,
    onToggleDetailsPanel
}) => {
    const partnerDisplayName = partner?.company_name || partner?.name || 'Conversation';
    const avatarUrl = getAttachmentUrl(partner?.avatar);
    const isVerified = Boolean(partner?.is_verified ?? partner?.profile?.is_verified ?? partner?.email_verified_at);
    const isOnline = Boolean(partner?.is_online);
    const lastSeenHuman = partner?.last_seen_human || (isOnline ? "Active Now" : "Offline");

    return (
        <div className="px-4 py-3 bg-white dark:bg-[#12161c] border-b border-slate-200 dark:border-slate-800 flex items-center justify-between z-10 shrink-0">
            <div className="flex items-center gap-3 min-w-0">
                <button
                    type="button"
                    onClick={onBack}
                    className="lg:hidden p-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-white rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 -ml-1 cursor-pointer"
                    title="Back to conversations"
                >
                    <ArrowLeft size={18} />
                </button>

                {/* Partner Avatar & Info (Clickable to open profile details) */}
                <div 
                    onClick={onToggleDetailsPanel}
                    className="flex items-center gap-3 min-w-0 cursor-pointer group"
                    title="Click to view partner details & profile"
                >
                    <div className="relative shrink-0 w-10 h-10">
                        {avatarUrl ? (
                            <img
                                src={avatarUrl}
                                alt={partnerDisplayName}
                                className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700 shadow-2xs group-hover:ring-2 group-hover:ring-[#FF4A1F]/40 transition-all"
                            />
                        ) : (
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-2xs font-bold text-sm border group-hover:ring-2 group-hover:ring-[#FF4A1F]/40 transition-all ${
                                (partner?.user_type || '').toLowerCase().includes('supplier')
                                    ? 'bg-orange-50 dark:bg-orange-950/40 border-orange-200/80 dark:border-orange-900/50 text-[#FF4A1F]'
                                    : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200/80 dark:border-emerald-900/50 text-emerald-700'
                            }`}>
                                {partnerDisplayName.charAt(0).toUpperCase()}
                            </div>
                        )}
                        {isOnline ? (
                            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-[#12161c]" title="Active Now" />
                        ) : (
                            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-slate-300 dark:bg-slate-600 rounded-full ring-2 ring-white dark:ring-[#12161c]" title={lastSeenHuman} />
                        )}
                    </div>

                    <div className="min-w-0">
                        <div className="flex items-center gap-1.5 min-w-0">
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-[#FF4A1F] transition-colors">
                                {partnerDisplayName}
                            </h3>
                            {isVerified && <VerifiedBadge size={15} className="shrink-0" />}
                        </div>
                        {isOnline ? (
                            <p className="text-[11.5px] text-emerald-600 dark:text-emerald-400 font-medium leading-tight mt-0.5">
                                Active Now
                            </p>
                        ) : (
                            <p className="text-[11.5px] text-slate-400 dark:text-slate-500 font-normal leading-tight mt-0.5">
                                {lastSeenHuman}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-1.5">
                <button
                    type="button"
                    onClick={onToggleDetailsPanel}
                    className={`h-8 w-8 rounded-full flex items-center justify-center cursor-pointer transition-colors border ${
                        showDetailsPanel
                            ? 'bg-orange-50 dark:bg-orange-950/40 text-[#FF4A1F] border-orange-200 dark:border-orange-800 shadow-2xs'
                            : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 border-slate-200/80 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                    title={showDetailsPanel ? 'Hide Partner Details' : 'View Partner Info & Shared Files'}
                >
                    <Info size={16} />
                </button>
            </div>
        </div>
    );
};

export default GeneralChatStreamHeader;
