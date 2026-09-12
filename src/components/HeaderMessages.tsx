import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    MessageSquare,
    Search,
    CheckCheck,
    Check,
    Sparkles,
    User as UserIcon,
    RefreshCw,
    ExternalLink
} from 'lucide-react';
import { useGeneralMessages } from '@/hooks/useGeneralMessages';
import { ConversationPartnerItem } from '@/services/messageService';
import { getAttachmentUrl } from '@/modules/Customer/QuoteManagement/Negotiation/Chat/utils/customerChatUtils';
import { encryptId } from '@/lib/encryption';

interface HeaderMessagesProps {
    role?: 'supplier' | 'customer';
}

const formatChatTime = (timeStr?: string | null, lastMsg?: any): string => {
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

export const HeaderMessages: React.FC<HeaderMessagesProps> = ({ role = 'supplier' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    const {
        conversations,
        directoryUsers,
        unreadCount,
        isLoadingConversations,
        fetchConversations
    } = useGeneralMessages(null, role);

    // Close dropdown on outside click or Escape
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsOpen(false);
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('keydown', handleKeyDown);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen]);

    const messagesBasePath = role === 'supplier' ? '/supplier/messages' : '/customer/messages';

    const filteredConversations = conversations.filter(item => {
        const nameMatch = (item.user?.name || item.user?.company_name || '')
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
        const lastMsgMatch = (item.last_message?.message || '')
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
        const matchesSearch = nameMatch || lastMsgMatch;

        if (activeTab === 'unread') {
            return matchesSearch && item.unread_count > 0;
        }
        return matchesSearch;
    });

    const handleSelectConversation = (partner: ConversationPartnerItem) => {
        setIsOpen(false);
        const encId = encryptId(partner.user.id);
        const sKey = `ses-${partner.user.id}`;
        navigate(`${messagesBasePath}/${encId}/${sKey}`);
    };

    const handleSelectDirectoryUser = (user: any) => {
        setIsOpen(false);
        const encId = encryptId(user.id);
        const sKey = `ses-${user.id}`;
        navigate(`${messagesBasePath}/${encId}/${sKey}`);
    };

    const handleViewAll = () => {
        setIsOpen(false);
        navigate(messagesBasePath);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Header Bell-style Message Trigger Button */}
            <button
                type="button"
                onClick={() => {
                    if (!isOpen) fetchConversations(true);
                    setIsOpen(!isOpen);
                }}
                className={`relative p-2 rounded-full border transition-all duration-200 cursor-pointer ${
                    isOpen
                        ? 'bg-orange-50 dark:bg-orange-950/40 border-[#FF4A1F] text-[#FF4A1F]'
                        : 'bg-slate-100 dark:bg-[#1e2329] border-slate-200/80 dark:border-slate-700/80 text-slate-600 dark:text-slate-300 hover:text-[#FF4A1F] dark:hover:text-[#FF4A1F] hover:bg-slate-200/60 dark:hover:bg-[#252b33]'
                }`}
                title="Messages & General Chat"
                aria-label="Messages"
            >
                <MessageSquare className="w-4 h-4" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-[#FF4A1F] text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-sm ring-2 ring-white dark:ring-[#12161c] animate-in zoom-in">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown Modal Container */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-[340px] sm:w-[390px] bg-white dark:bg-[#161b22] rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 z-[999] overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col font-sans">
                    
                    {/* Header */}
                    <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/70 dark:bg-[#12161c]/80 backdrop-blur-sm flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-orange-50 dark:bg-orange-950/40 text-[#FF4A1F] flex items-center justify-center font-bold">
                                <MessageSquare size={14} />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">Messages</h3>
                                <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">Direct chats & communication</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                            {unreadCount > 0 && (
                                <span className="text-[11px] font-medium bg-orange-100 dark:bg-orange-950/50 text-[#FF4A1F] px-2 py-0.5 rounded-full">
                                    {unreadCount} new
                                </span>
                            )}
                            <button
                                type="button"
                                onClick={() => fetchConversations()}
                                disabled={isLoadingConversations}
                                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                title="Refresh"
                            >
                                <RefreshCw size={13} className={isLoadingConversations ? 'animate-spin' : ''} />
                            </button>
                        </div>
                    </div>

                    {/* Search & Tabs */}
                    <div className="p-3 border-b border-slate-100 dark:border-slate-800/80 space-y-2">
                        <div className="relative">
                            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search messages or people..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full h-8 pl-8 pr-4 text-xs bg-slate-100 dark:bg-[#1c2128] border-none outline-none focus:outline-none focus:ring-0 rounded-full text-slate-800 dark:text-slate-200 placeholder-slate-400"
                            />
                        </div>

                        <div className="flex items-center gap-1.5 pt-0.5">
                            <button
                                type="button"
                                onClick={() => setActiveTab('all')}
                                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                                    activeTab === 'all'
                                        ? 'bg-[#FF4A1F] text-white shadow-xs'
                                        : 'bg-slate-100 dark:bg-[#1c2128] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                                }`}
                            >
                                All ({conversations.length})
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab('unread')}
                                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                                    activeTab === 'unread'
                                        ? 'bg-[#FF4A1F] text-white shadow-xs'
                                        : 'bg-slate-100 dark:bg-[#1c2128] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                                }`}
                            >
                                Unread {unreadCount > 0 && `(${unreadCount})`}
                            </button>
                        </div>
                    </div>

                    {/* Conversations List with hidden scrollbar */}
                    <div className="max-h-[320px] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                        {isLoadingConversations && conversations.length === 0 ? (
                            <div className="py-10 text-center text-xs text-slate-400 space-y-2">
                                <RefreshCw size={18} className="animate-spin mx-auto text-[#FF4A1F]" />
                                <p>Loading conversations...</p>
                            </div>
                        ) : filteredConversations.length === 0 ? (
                            <div className="p-3 text-center space-y-2">
                                <div className="py-3 px-2">
                                    <MessageSquare size={22} className="mx-auto mb-1 text-[#FF4A1F]" />
                                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Start Platform Chat</p>
                                    <p className="text-[10.5px] text-slate-400">Click any user to message on platform:</p>
                                </div>
                                <div className="space-y-1 text-left divide-y divide-slate-100 dark:divide-slate-800/40">
                                    {directoryUsers.filter(u => {
                                        const ut = (u.user_type || '').toLowerCase();
                                        if (role === 'customer') return ut.includes('supplier') || ut.includes('carrier');
                                        if (role === 'supplier') return ut.includes('customer') || ut.includes('shipper');
                                        return true;
                                    }).slice(0, 4).map((user) => {
                                        const displayName = user.company_name || user.name || 'User';
                                        const initials = (user.name || 'U').slice(0, 2).toUpperCase();
                                        return (
                                            <div
                                                key={user.id}
                                                onClick={() => handleSelectDirectoryUser(user)}
                                                className="pt-1.5 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-[#1c2128] cursor-pointer flex items-center justify-between gap-2 transition-colors"
                                            >
                                                <div className="flex items-center gap-2 min-w-0">
                                                    <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-orange-400 to-orange-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                                                        {initials}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{displayName}</p>
                                                        <p className="text-[10px] text-slate-400 capitalize">{user.user_type || 'User'}</p>
                                                    </div>
                                                </div>
                                                <span className="text-[10px] font-bold text-[#FF4A1F] bg-orange-50 dark:bg-orange-950/40 px-2 py-0.5 rounded-full shrink-0">
                                                    Chat
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ) : (
                            filteredConversations.map((item) => {
                                const displayName = item.user.company_name || item.user.name || 'User';
                                const userInitials = (item.user.name || 'U').slice(0, 2).toUpperCase();
                                const isUnread = item.unread_count > 0;
                                const isMe = item.last_message?.is_me;
                                const formattedTime = formatChatTime(item.last_message_at, item.last_message);

                                return (
                                    <div
                                        key={item.user.id}
                                        onClick={() => handleSelectConversation(item)}
                                        className={`p-3 flex items-start gap-3 cursor-pointer transition-colors group ${
                                            isUnread
                                                ? 'bg-orange-50/40 dark:bg-orange-950/20 hover:bg-orange-50/70 dark:hover:bg-orange-950/30'
                                                : 'hover:bg-slate-50 dark:hover:bg-[#1c2128]'
                                        }`}
                                    >
                                        {/* Avatar */}
                                        <div className="relative shrink-0">
                                            {item.user.avatar ? (
                                                <img
                                                    src={getAttachmentUrl(item.user.avatar)}
                                                    alt={displayName}
                                                    className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700 shadow-2xs"
                                                />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-400 to-orange-600 text-white font-bold text-xs flex items-center justify-center shadow-2xs">
                                                    {userInitials}
                                                </div>
                                            )}
                                            {item.unread_count > 0 && (
                                                <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-[#FF4A1F] rounded-full ring-2 ring-white dark:ring-[#161b22]" />
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-1">
                                                <div className="flex items-center gap-1.5 min-w-0">
                                                    <p className={`text-xs truncate ${isUnread ? 'font-semibold text-slate-900 dark:text-white' : 'font-medium text-slate-800 dark:text-slate-200'}`}>
                                                        {displayName}
                                                    </p>
                                                    {item.user.user_type && (
                                                        <span className="text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-1.5 py-0.2 rounded shrink-0 capitalize">
                                                            {item.user.user_type}
                                                        </span>
                                                    )}
                                                </div>
                                                <span className="text-[10px] text-slate-400 font-medium shrink-0">
                                                    {formattedTime}
                                                </span>
                                            </div>

                                            <p className={`text-[11.5px] truncate mt-0.5 ${isUnread ? 'font-semibold text-slate-800 dark:text-slate-100' : 'text-slate-500 dark:text-slate-400'}`}>
                                                {isMe && <span className="text-slate-400 font-normal">You: </span>}
                                                {item.last_message?.message || (item.last_message ? 'Sent an attachment' : 'No messages yet')}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default HeaderMessages;
