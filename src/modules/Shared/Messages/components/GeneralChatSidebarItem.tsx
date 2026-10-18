import React from 'react';
import { ConversationPartnerItem } from '@/services/messageService';
import { getAttachmentUrl } from '@/modules/Customer/QuoteManagement/Negotiation/Chat/utils/customerChatUtils';
import { VerifiedBadge } from '@/components/common/VerifiedBadge';
import { formatSidebarTime } from './generalChatSidebarUtils';

interface GeneralChatSidebarItemProps {
    item: ConversationPartnerItem;
    activePartnerId: number | string | null;
    onSelectPartner: (partner: ConversationPartnerItem) => void;
}

export const GeneralChatSidebarItem: React.FC<GeneralChatSidebarItemProps> = ({
    item,
    activePartnerId,
    onSelectPartner,
}) => {
    const userObj = item.user || (item as any).partner || (item as any);
    const userId = userObj?.id || (item as any).partner_id || (item as any).id;
    const isActive = String(userId) === String(activePartnerId);
    const displayName = userObj?.company_name || userObj?.name || (item as any).partner_name || 'User';
    const isUnread = item.unread_count > 0;
    const isMe = item.last_message?.is_me;
    const formattedTime = formatSidebarTime(item.last_message_at, item.last_message);
    const isVerified = Boolean(userObj?.is_verified ?? (item as any).is_verified ?? userObj?.profile?.is_verified ?? userObj?.email_verified_at);
    const isOnline = Boolean(userObj?.is_online ?? (item as any).is_online);
    const lastSeenHuman = userObj?.last_seen_human || (isOnline ? 'Active Now' : 'Offline');

    return (
        <div
            onClick={() => onSelectPartner(item)}
            className={`p-2.5 rounded-[4px] cursor-pointer flex gap-3 items-center transition-all ${
                isActive
                    ? 'bg-slate-100 dark:bg-[#1c222b] border border-slate-200 dark:border-slate-700/80 shadow-2xs'
                    : isUnread
                    ? 'bg-slate-50/60 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700/80'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80'
            }`}
        >
            {/* Avatar */}
            <div className="relative shrink-0 w-11 h-11">
                {item.user.avatar ? (
                    <img
                        src={getAttachmentUrl(item.user.avatar)}
                        alt={displayName}
                        className="w-11 h-11 rounded-full object-cover border border-slate-200 dark:border-slate-700 shadow-2xs"
                    />
                ) : (
                    <div
                        className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm shadow-2xs border ${
                            userObj?.user_type === 'supplier'
                                ? 'bg-orange-50 dark:bg-orange-950/40 border-orange-200/80 dark:border-orange-900/50 text-[#FF4A1F]'
                                : 'bg-blue-50 dark:bg-blue-950/40 border-blue-200/80 dark:border-blue-900/50 text-[#2563EB]'
                        }`}
                    >
                        {displayName.charAt(0).toUpperCase()}
                    </div>
                )}
                {isOnline ? (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-[#12161c]" title="Active Now" />
                ) : (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-slate-300 dark:bg-slate-600 rounded-full ring-2 ring-white dark:ring-[#12161c]" title={lastSeenHuman} />
                )}
            </div>

            {/* Texts */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 min-w-0 flex-1">
                        <h4
                            className={`text-[13px] truncate leading-tight ${
                                isActive || isUnread ? 'font-semibold text-slate-900 dark:text-white' : 'font-medium text-slate-800 dark:text-slate-200'
                            }`}
                        >
                            {displayName}
                        </h4>
                        {isVerified && <VerifiedBadge size={13.5} className="shrink-0" />}
                    </div>
                    <span className="text-[10px] text-slate-400 font-normal shrink-0 whitespace-nowrap">
                        {formattedTime}
                    </span>
                </div>

                <div className="flex items-center justify-between gap-2 mt-0.5">
                    <p
                        className={`text-[11.5px] truncate ${
                            isUnread ? 'font-medium text-slate-900 dark:text-slate-100' : 'text-slate-500 dark:text-slate-400'
                        }`}
                    >
                        {isMe && <span className="text-slate-400 font-normal">You: </span>}
                        {item.last_message?.message || (item.last_message ? 'Sent an attachment' : 'No messages yet')}
                    </p>
                    {item.unread_count > 0 && (
                        <span className="min-w-[18px] h-[18px] px-1 bg-[#FF4A1F] text-white text-[10px] font-semibold rounded-full flex items-center justify-center shrink-0 shadow-2xs">
                            {item.unread_count}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};
