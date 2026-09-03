import { getAttachmentUrl } from '@/modules/Customer/QuoteManagement/Negotiation/Chat/utils/customerChatUtils';
import { ConversationPartnerItem, ConversationUser } from '@/services/messageService';
import { ArrowLeft, MessageSquare, Plus, Search } from 'lucide-react';
import React from 'react';
import { GeneralChatSidebarSkeleton } from './GeneralChatSidebarSkeleton';

interface GeneralChatSidebarProps {
    searchQuery: string;
    setSearchQuery: (val: string) => void;
    filterTab: 'all' | 'unread';
    setFilterTab: (val: 'all' | 'unread') => void;
    conversations: ConversationPartnerItem[];
    directoryUsers?: ConversationUser[];
    activePartnerId: number | string | null;
    onSelectPartner: (partner: ConversationPartnerItem) => void;
    onSelectDirectoryUser?: (user: ConversationUser) => void;
    onOpenNewMessage?: () => void;
    role?: 'supplier' | 'customer' | string;
    onBack?: () => void;
    isLoading?: boolean;
    onRefresh?: () => void;
}

const formatSidebarTime = (timeStr?: string | null, lastMsg?: any): string => {
    if (lastMsg?.created_at_human && typeof lastMsg.created_at_human === 'string' && lastMsg.created_at_human !== 'null') {
        return lastMsg.created_at_human;
    }
    const val = timeStr || lastMsg?.time || lastMsg?.created_at || lastMsg?.last_message_at;
    if (!val) return '';

    if (typeof val === 'string') {
        const trimmed = val.trim();
        if (/^(just now|today|yesterday|\d+[mhsd] ago|\d{1,2}:\d{2}\s*(am|pm)?)$/i.test(trimmed)) {
            return trimmed;
        }
    }

    try {
        let str = String(val).trim();
        if (!str.includes('Z') && !str.includes('+') && !str.includes('-0') && !str.includes('-1')) {
            str = str.replace(' ', 'T') + 'Z';
        }
        const d = new Date(str);
        if (isNaN(d.getTime())) return String(val);

        const now = new Date();
        const diffMs = now.getTime() - d.getTime();
        const diffSecs = Math.floor(diffMs / 1000);
        const diffMins = Math.floor(diffSecs / 60);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return `${diffHours}h ago`;
        const diffDays = Math.floor(diffHours / 24);
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays}d ago`;
        return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
    } catch {
        return String(val || '');
    }
};

const getRoleBadge = (role?: string) => {
    const r = (role || 'user').toLowerCase();
    if (r.includes('supplier')) {
        return {
            label: 'Supplier',
            bg: 'bg-orange-50 dark:bg-orange-950/40 text-[#FF4A1F] border border-orange-200/60 dark:border-orange-900/50'
        };
    }
    if (r.includes('customer')) {
        return {
            label: 'Customer',
            bg: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-900/50'
        };
    }
    return {
        label: role ? role.charAt(0).toUpperCase() + role.slice(1).toLowerCase() : 'Member',
        bg: 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-200/60 dark:border-blue-900/50'
    };
};

export const GeneralChatSidebar: React.FC<GeneralChatSidebarProps> = ({
    searchQuery,
    setSearchQuery,
    filterTab,
    setFilterTab,
    conversations,
    activePartnerId,
    onSelectPartner,
    onOpenNewMessage,
    onBack,
    isLoading,
}) => {
    const unreadTotal = conversations.filter(c => c.unread_count > 0).length;

    // Filtered active conversations
    const filteredConversations = conversations.filter(item => {
        const name = (item.user.company_name || item.user.name || '').toLowerCase();
        const lastMsg = (item.last_message?.message || '').toLowerCase();
        const matches = name.includes(searchQuery.toLowerCase()) || lastMsg.includes(searchQuery.toLowerCase());

        if (filterTab === 'unread') {
            return matches && item.unread_count > 0;
        }
        return matches;
    });

    return (
        <div className="w-full flex flex-col min-h-0 h-full bg-white dark:bg-[#12161c] border-r border-slate-200 dark:border-slate-800 font-sans">
            {/* Top Header */}
            <div className="px-4 py-3 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                    {onBack && (
                        <button
                            type="button"
                            onClick={onBack}
                            className="p-1.5 -ml-1 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                            <ArrowLeft size={16} />
                        </button>
                    )}
                    <h2 className="text-[15px] font-semibold text-slate-900 dark:text-white">Messages</h2>
                    {unreadTotal > 0 && (
                        <span className="text-[11px] font-medium bg-orange-100 dark:bg-orange-950/50 text-[#FF4A1F] px-2 py-0.5 rounded-full">
                            {unreadTotal} new
                        </span>
                    )}
                </div>

                {onOpenNewMessage && (
                    <button
                        type="button"
                        onClick={onOpenNewMessage}
                        className="h-8 px-3 bg-[#FF4A1F] hover:bg-[#e03e15] text-white font-bold text-xs shadow-sm flex items-center gap-1.5 cursor-pointer rounded-[3px] transition-colors"
                        title="Start a new message"
                    >
                        <Plus size={13} strokeWidth={2.5} />
                        <span>New Message</span>
                    </button>
                )}
            </div>

            {/* Search Box */}
            <div className="px-3 pt-3 pb-2">
                <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search conversations..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-[36px] pl-9 pr-4 text-[12.5px] bg-slate-100 dark:bg-[#181d24] border border-transparent rounded-full focus:outline-none focus:border-[#FF4A1F] text-slate-800 dark:text-slate-200 placeholder-slate-400"
                    />
                </div>
            </div>

            {/* Filter Tabs: All & Unread */}
            <div className="px-3 py-1.5 flex items-center gap-1.5 overflow-x-auto [&::-webkit-scrollbar]:hidden">
                <button
                    type="button"
                    onClick={() => setFilterTab('all')}
                    className={`rounded-full px-3.5 py-1 text-[11.5px] font-medium cursor-pointer transition-colors whitespace-nowrap ${filterTab === 'all'
                        ? 'bg-orange-50 dark:bg-orange-950/40 text-[#FF4A1F] border border-orange-200/80 dark:border-orange-900/60 shadow-2xs font-semibold'
                        : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700'
                        }`}
                >
                    All ({conversations.length})
                </button>

                <button
                    type="button"
                    onClick={() => setFilterTab('unread')}
                    className={`rounded-full px-3.5 py-1 text-[11.5px] font-medium cursor-pointer transition-colors whitespace-nowrap ${filterTab === 'unread'
                        ? 'bg-orange-50 dark:bg-orange-950/40 text-[#FF4A1F] border border-orange-200/80 dark:border-orange-900/60 shadow-2xs font-semibold'
                        : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700'
                        }`}
                >
                    Unread {unreadTotal > 0 && `(${unreadTotal})`}
                </button>
            </div>

            {/* List Body with hidden scrollbar */}
            <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                {filteredConversations.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-400 flex flex-col items-center">
                        <MessageSquare size={26} className="mx-auto mb-2 text-slate-300 dark:text-slate-600" />
                        <p className="font-semibold text-slate-700 dark:text-slate-300 text-sm">No chats found</p>
                        <p className="text-[11.5px] text-slate-400 mt-1 max-w-[200px] leading-relaxed">
                            {searchQuery ? 'No match for search terms.' : 'Start a new conversation using the "New Message" button above.'}
                        </p>
                    </div>
                ) : (
                    filteredConversations.map((item, idx) => {
                        const userObj = item.user || (item as any).partner || (item as any);
                        const userId = userObj?.id || (item as any).partner_id || (item as any).id;
                        const isActive = String(userId) === String(activePartnerId);
                        const displayName = userObj?.company_name || userObj?.name || (item as any).partner_name || 'User';
                        const initials = (userObj?.name || userObj?.company_name || 'U').slice(0, 2).toUpperCase();
                        const isUnread = item.unread_count > 0;
                        const isMe = item.last_message?.is_me;
                        const formattedTime = formatSidebarTime(item.last_message_at, item.last_message);
                        const badge = getRoleBadge(userObj?.user_type);

                        return (
                            <div
                                key={userId || idx}
                                onClick={() => onSelectPartner(item)}
                                className={`p-2.5 rounded-[4px] cursor-pointer flex gap-3 items-center transition-all ${isActive
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
                                        <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm shadow-2xs border ${userObj?.user_type === 'supplier'
                                            ? 'bg-orange-50 dark:bg-orange-950/40 border-orange-200/80 dark:border-orange-900/50 text-[#FF4A1F]'
                                            : 'bg-blue-50 dark:bg-blue-950/40 border-blue-200/80 dark:border-blue-900/50 text-[#2563EB]'
                                            }`}>
                                            {displayName.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-[#12161c]" />
                                </div>

                                {/* Texts */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-1">
                                        <div className="flex items-center gap-1.5 min-w-0">
                                            <h4 className={`text-[13px] truncate ${isActive || isUnread ? 'font-semibold text-slate-900 dark:text-white' : 'font-medium text-slate-800 dark:text-slate-200'
                                                }`}>
                                                {displayName}
                                            </h4>
                                            <span className={`text-[10px] font-medium px-1.5 py-0.2 rounded border shrink-0 ${badge.bg}`}>
                                                {badge.label}
                                            </span>
                                        </div>
                                        <span className="text-[10px] text-slate-400 font-normal shrink-0">
                                            {formattedTime}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between gap-2 mt-0.5">
                                        <p className={`text-[11.5px] truncate ${isUnread ? 'font-medium text-slate-900 dark:text-slate-100' : 'text-slate-500 dark:text-slate-400'
                                            }`}>
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
                    })
                )}
            </div>
        </div>
    );
};

export default GeneralChatSidebar;
