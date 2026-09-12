import React, { useState, useMemo, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, Search, Users, UserCheck } from 'lucide-react';
import { VerifiedBadge } from '@/components/common/VerifiedBadge';
import { ConversationUser, ConversationPartnerItem } from '@/services/messageService';

interface NewMessageModalProps {
    isOpen: boolean;
    onClose: () => void;
    directoryUsers: ConversationUser[];
    conversations: ConversationPartnerItem[];
    onSelectUser: (user: ConversationUser) => void;
    isLoading?: boolean;
    onRefresh?: () => void;
    role?: 'supplier' | 'customer' | string;
}

const getRoleBadge = (role?: string) => {
    const r = (role || 'user').toLowerCase();
    if (r.includes('supplier') || r.includes('carrier')) {
        return {
            label: 'Carrier Partner',
            bg: 'bg-orange-50 dark:bg-[#ff4a1f]/15 text-[#ff4a1f] dark:text-orange-400 border border-orange-200/60 dark:border-orange-900/40'
        };
    }
    if (r.includes('customer') || r.includes('shipper')) {
        return {
            label: 'Verified Customer',
            bg: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-900/40'
        };
    }
    return {
        label: role ? role.charAt(0).toUpperCase() + role.slice(1).toLowerCase() : 'Member',
        bg: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
    };
};

export const NewMessageModal: React.FC<NewMessageModalProps> = ({
    isOpen,
    onClose,
    directoryUsers,
    conversations,
    onSelectUser,
    isLoading = false,
    role = 'customer'
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const searchInputRef = useRef<HTMLInputElement>(null);

    const isSupplierView = role === 'supplier';
    const isCustomerView = role === 'customer';

    // Auto-focus input when opened
    useEffect(() => {
        if (isOpen) {
            setSearchQuery('');
            setTimeout(() => {
                searchInputRef.current?.focus();
            }, 50);
        }
    }, [isOpen]);

    // Close on Escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    // Existing conversation user IDs set
    const existingConversationUserIds = useMemo(() => {
        return new Set(conversations.map(c => String(c.user?.id)));
    }, [conversations]);

    // Clean, backend-powered filtered list with role-aware separation
    const filteredUsers = useMemo(() => {
        if (!directoryUsers || !directoryUsers.length) return [];

        let list = directoryUsers;

        // Ensure proper role separation:
        // Customer view: only show suppliers / carriers
        // Supplier view: only show customers / shippers
        if (isCustomerView) {
            list = list.filter(u => {
                const ut = (u.user_type || '').toLowerCase();
                return ut.includes('supplier') || ut.includes('carrier') || (!ut.includes('customer') && !ut.includes('shipper') && !ut.includes('admin'));
            });
        } else if (isSupplierView) {
            list = list.filter(u => {
                const ut = (u.user_type || '').toLowerCase();
                return ut.includes('customer') || ut.includes('shipper') || (!ut.includes('supplier') && !ut.includes('carrier') && !ut.includes('admin'));
            });
        }

        const q = searchQuery.trim().toLowerCase();
        if (!q) return list;

        return list.filter(u => {
            const name = (u.name || '').toLowerCase();
            const company = (u.company_name || '').toLowerCase();
            const email = (u.email || '').toLowerCase();
            return name.includes(q) || company.includes(q) || email.includes(q);
        });
    }, [directoryUsers, searchQuery, isCustomerView, isSupplierView]);

    if (!isOpen) return null;

    const placeholderText = isSupplierView
        ? 'Search customer by name, company, email...'
        : isCustomerView
            ? 'Search carrier/supplier by name, company...'
            : 'Search contacts...';

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
            {/* Modal Card - Compact */}
            <div
                className="w-full max-w-md bg-white dark:bg-[#12161c] rounded-md shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-150"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-[#12161c]">
                    <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-orange-50 dark:bg-orange-950/40 border border-orange-200/80 dark:border-orange-900/50 flex items-center justify-center text-[#FF4A1F] shrink-0">
                            <Users size={14} />
                        </div>
                        <div>
                            <h3 className="text-[13px] font-bold text-slate-900 dark:text-slate-100 leading-tight">
                                {isSupplierView ? 'Direct Message to Customer' : isCustomerView ? 'Direct Message to Carrier' : 'New Direct Message'}
                            </h3>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5">
                                Select a verified partner to open or start a message thread
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors cursor-pointer"
                    >
                        <X size={15} />
                    </button>
                </div>

                {/* Counter Badge Subheader */}
                <div className="px-4 py-1.5 bg-slate-50/60 dark:bg-[#161b22] border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
                    <span className="font-medium text-slate-600 dark:text-slate-300">
                        {isSupplierView ? 'Verified Customers' : isCustomerView ? 'Verified Suppliers & Carriers' : 'Available Contacts'}
                    </span>
                    <span className="font-semibold text-[#FF4A1F] bg-orange-50 dark:bg-[#ff4a1f]/10 px-2 py-0.5 rounded text-[10.5px]">
                        {filteredUsers.length} available
                    </span>
                </div>

                {/* Body Content */}
                <div className="p-3.5 space-y-2.5 max-h-[55vh] overflow-y-auto">
                    {/* Search Input - Same rounded pill design as Sidebar */}
                    <div className="relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        <input
                            ref={searchInputRef}
                            type="text"
                            placeholder={placeholderText}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-[36px] pl-9 pr-8 text-[12px] bg-slate-100 dark:bg-[#181d24] border-none outline-none focus:outline-none focus:ring-0 rounded-full text-slate-800 dark:text-slate-200 placeholder-slate-400"
                        />
                        {searchQuery && (
                            <button
                                type="button"
                                onClick={() => setSearchQuery('')}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer p-0.5"
                            >
                                <X size={13} />
                            </button>
                        )}
                    </div>

                    {/* User Cards List */}
                    <div className="space-y-1">
                        {isLoading && directoryUsers.length === 0 ? (
                            <div className="p-6 text-center text-xs text-slate-400 space-y-1.5">
                                <p>Loading directory contacts...</p>
                            </div>
                        ) : filteredUsers.length === 0 ? (
                            <div className="p-5 text-center text-xs text-slate-400 bg-slate-50/50 dark:bg-[#161b22] rounded-lg">
                                <p className="font-semibold text-slate-700 dark:text-slate-300 text-xs">
                                    {isSupplierView ? 'No customers found' : isCustomerView ? 'No suppliers found' : 'No contacts found'}
                                </p>
                                <p className="text-[11px] text-slate-400 mt-0.5">
                                    {searchQuery ? 'Try searching with another keyword or company name.' : 'No available contacts matching this criteria.'}
                                </p>
                            </div>
                        ) : (
                            filteredUsers.map((user) => {
                                const displayName = user.company_name || user.name || 'User';
                                const isVerified = Boolean(user.is_verified ?? (user as any).email_verified_at);
                                const hasExistingChat = existingConversationUserIds.has(String(user.id));

                                return (
                                    <div
                                        key={user.id}
                                        onClick={() => {
                                            onClose();
                                            onSelectUser(user);
                                        }}
                                        className="p-2 hover:bg-slate-100/80 dark:hover:bg-[#181d24] rounded-lg transition-colors cursor-pointer flex items-center justify-between gap-2.5"
                                    >
                                        <div className="flex items-center gap-2.5 min-w-0">
                                            {/* Avatar */}
                                            <div className="relative shrink-0 w-8 h-8">
                                                {user.avatar ? (
                                                    <img
                                                        src={user.avatar}
                                                        alt={displayName}
                                                        className="w-8 h-8 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <div className={`w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center ${
                                                        (user.user_type || '').toLowerCase().includes('supplier')
                                                            ? 'bg-orange-100/80 dark:bg-orange-950/60 text-[#FF4A1F]'
                                                            : 'bg-emerald-100/80 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400'
                                                    }`}>
                                                        {displayName.charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                                <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-[#12161c]" />
                                            </div>

                                            {/* Info */}
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-1 min-w-0">
                                                    <span className="font-semibold text-[12.5px] text-slate-900 dark:text-slate-100 truncate">
                                                        {displayName}
                                                    </span>
                                                    {isVerified && <VerifiedBadge size={13} />}
                                                </div>

                                                <div className="text-[10.5px] text-slate-500 dark:text-slate-400 truncate mt-0.5 flex items-center gap-1.5">
                                                    <span className="font-mono text-[10px]">#CD-{String(user.id).padStart(4, '0')}</span>
                                                    <span>•</span>
                                                    <span>Verified</span>
                                                    <span>•</span>
                                                    <span className="text-amber-500 font-semibold flex items-center gap-0.5 text-[10px]">★ 4.9</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Status */}
                                        {hasExistingChat ? (
                                            <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full shrink-0">
                                                Active Chat
                                            </span>
                                        ) : (
                                            <span className="text-[10px] font-semibold text-[#ff4a1f] bg-orange-50 dark:bg-[#ff4a1f]/10 px-2 py-0.5 rounded-full shrink-0 flex items-center gap-1">
                                                <UserCheck size={11} /> Start
                                            </span>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="px-4 py-2.5 bg-slate-50/80 dark:bg-[#14181f] border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                    <span>{filteredUsers.length} contact{filteredUsers.length !== 1 ? 's' : ''} available</span>
                    <button
                        type="button"
                        onClick={onClose}
                        className="h-7 px-3 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-[#1e2329] border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded transition-colors cursor-pointer"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default NewMessageModal;
