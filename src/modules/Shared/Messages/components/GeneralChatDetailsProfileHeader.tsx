import React from 'react';
import { User, Pin, Image as ImageIcon, FileText, Building2 } from 'lucide-react';
import { ConversationUser, GeneralMessage, MessageAttachment } from '@/services/messageService';
import { VerifiedBadge } from '@/components/common/VerifiedBadge';

interface GeneralChatDetailsProfileHeaderProps {
    partner: ConversationUser;
    partnerAvatarUrl?: string;
    displayName: string;
    isSupplier: boolean;
    isVerified: boolean;
    isOnline: boolean;
    lastSeenHuman: string;
    roleLabel: string;
    activeTab: 'profile' | 'pinned' | 'photos' | 'docs';
    setActiveTab: (tab: 'profile' | 'pinned' | 'photos' | 'docs') => void;
    pinnedMessages: GeneralMessage[];
    imageAttachments: MessageAttachment[];
    docAttachments: MessageAttachment[];
}

export const GeneralChatDetailsProfileHeader: React.FC<GeneralChatDetailsProfileHeaderProps> = ({
    partner,
    partnerAvatarUrl,
    displayName,
    isSupplier,
    isVerified,
    isOnline,
    lastSeenHuman,
    roleLabel,
    activeTab,
    setActiveTab,
    pinnedMessages,
    imageAttachments,
    docAttachments,
}) => {
    return (
        <div className="flex flex-col items-center pt-6 pb-4 px-4 border-b border-slate-100 dark:border-slate-800/60 shrink-0">
            <div className="w-14 h-14 shrink-0 aspect-square rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700 flex items-center justify-center font-bold text-lg mb-2 relative shadow-2xs">
                {partnerAvatarUrl ? (
                    <img
                        src={partnerAvatarUrl}
                        alt={displayName}
                        className="w-full h-full rounded-full object-cover"
                    />
                ) : isSupplier ? (
                    <Building2 size={24} className="text-[#FF4A1F]" />
                ) : (
                    <User size={24} className="text-slate-600 dark:text-slate-300" />
                )}
                {isOnline ? (
                    <div className="absolute bottom-0 right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" title="Active Now" />
                ) : (
                    <div className="absolute bottom-0 right-0.5 w-3.5 h-3.5 bg-slate-300 dark:bg-slate-600 border-2 border-white dark:border-slate-900 rounded-full" title={lastSeenHuman} />
                )}
            </div>

            <div className="flex items-center gap-1 justify-center text-center">
                <h3 className="text-[14px] font-bold text-slate-800 dark:text-slate-100 truncate max-w-[200px]">
                    {displayName}
                </h3>
                {isVerified && <VerifiedBadge size={16} />}
            </div>

            <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                {roleLabel}
            </p>

            {/* 4 Interactive Switcher Tabs */}
            <div className="flex items-center justify-between gap-2 mt-4 w-full px-2">
                <button
                    type="button"
                    onClick={() => setActiveTab('profile')}
                    className="flex flex-col items-center gap-1 cursor-pointer group focus:outline-none flex-1"
                >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                        activeTab === 'profile'
                            ? 'bg-[#FF4A1F] text-white shadow-xs ring-2 ring-[#FF4A1F]/25'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 group-hover:bg-slate-200 dark:group-hover:bg-slate-700'
                    }`}>
                        <User size={15} />
                    </div>
                    <span className={`text-[10px] font-semibold transition-colors ${
                        activeTab === 'profile' ? 'text-[#FF4A1F] font-bold' : 'text-slate-600 dark:text-slate-400 group-hover:text-slate-900'
                    }`}>
                        Profile
                    </span>
                </button>

                <button
                    type="button"
                    onClick={() => setActiveTab('pinned')}
                    className="flex flex-col items-center gap-1 cursor-pointer group focus:outline-none flex-1 relative"
                >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                        activeTab === 'pinned'
                            ? 'bg-amber-500 text-white shadow-xs ring-2 ring-amber-500/25'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 group-hover:bg-slate-200 dark:group-hover:bg-slate-700'
                    }`}>
                        <Pin size={15} className={activeTab === 'pinned' ? 'fill-white' : ''} />
                    </div>
                    <span className={`text-[10px] font-semibold transition-colors ${
                        activeTab === 'pinned' ? 'text-amber-500 font-bold' : 'text-slate-600 dark:text-slate-400 group-hover:text-slate-900'
                    }`}>
                        Pinned {pinnedMessages.length > 0 ? `(${pinnedMessages.length})` : ''}
                    </span>
                </button>

                <button
                    type="button"
                    onClick={() => setActiveTab('photos')}
                    className="flex flex-col items-center gap-1 cursor-pointer group focus:outline-none flex-1"
                >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                        activeTab === 'photos'
                            ? 'bg-[#FF4A1F] text-white shadow-xs ring-2 ring-[#FF4A1F]/25'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 group-hover:bg-slate-200 dark:group-hover:bg-slate-700'
                    }`}>
                        <ImageIcon size={15} />
                    </div>
                    <span className={`text-[10px] font-semibold transition-colors ${
                        activeTab === 'photos' ? 'text-[#FF4A1F] font-bold' : 'text-slate-600 dark:text-slate-400 group-hover:text-slate-900'
                    }`}>
                        Photos {imageAttachments.length > 0 ? `(${imageAttachments.length})` : ''}
                    </span>
                </button>

                <button
                    type="button"
                    onClick={() => setActiveTab('docs')}
                    className="flex flex-col items-center gap-1 cursor-pointer group focus:outline-none flex-1"
                >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                        activeTab === 'docs'
                            ? 'bg-[#FF4A1F] text-white shadow-xs ring-2 ring-[#FF4A1F]/25'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 group-hover:bg-slate-200 dark:group-hover:bg-slate-700'
                    }`}>
                        <FileText size={15} />
                    </div>
                    <span className={`text-[10px] font-semibold transition-colors ${
                        activeTab === 'docs' ? 'text-[#FF4A1F] font-bold' : 'text-slate-600 dark:text-slate-400 group-hover:text-slate-900'
                    }`}>
                        Docs {docAttachments.length > 0 ? `(${docAttachments.length})` : ''}
                    </span>
                </button>
            </div>
        </div>
    );
};
