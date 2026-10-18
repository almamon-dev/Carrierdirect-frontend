import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';
import { useGeneralMessages } from '@/hooks/useGeneralMessages';
import { ConversationPartnerItem } from '@/services/messageService';
import { encryptId } from '@/lib/encryption';
import { HeaderMessagesDropdown } from './HeaderMessagesDropdown';

interface HeaderMessagesProps {
    role?: 'supplier' | 'customer' | 'driver';
}

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

    const messagesBasePath = role === 'driver' ? '/driver/chat' : (role === 'supplier' ? '/supplier/messages' : '/customer/messages');

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

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => {
                    if (!isOpen) fetchConversations(true);
                    setIsOpen(!isOpen);
                }}
                className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-200 cursor-pointer relative shrink-0 ${
                    isOpen
                        ? 'bg-orange-50 dark:bg-orange-950/40 border-[#FF4A1F] text-[#FF4A1F]'
                        : 'bg-slate-100 dark:bg-[#1e2329] border-slate-200/80 dark:border-slate-700/80 text-slate-600 dark:text-slate-300 hover:text-[#FF4A1F] dark:hover:text-[#FF4A1F] hover:bg-slate-200/80 dark:hover:bg-slate-800'
                }`}
                title="Messages & General Chat"
                aria-label="Messages"
            >
                <MessageSquare className="w-4 h-4" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-[#FF4A1F] text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white dark:border-[#12161c] shadow-xs animate-in zoom-in duration-200 leading-none">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <HeaderMessagesDropdown
                    unreadCount={unreadCount}
                    isLoadingConversations={isLoadingConversations}
                    onRefresh={() => fetchConversations()}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    conversationsCount={conversations.length}
                    filteredConversations={filteredConversations}
                    directoryUsers={directoryUsers}
                    role={role}
                    onSelectConversation={handleSelectConversation}
                    onSelectDirectoryUser={handleSelectDirectoryUser}
                />
            )}
        </div>
    );
};

export default HeaderMessages;
