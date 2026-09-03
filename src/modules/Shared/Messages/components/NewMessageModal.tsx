import React, { useState, useMemo, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, Search, Users, UserCheck } from 'lucide-react';
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
            label: 'Carrier / Supplier',
            bg: 'bg-orange-50 dark:bg-[#ff4a1f]/20 text-[#ff4a1f] dark:text-orange-400 border border-orange-200/60 dark:border-orange-900/40'
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
    const [roleFilter, setRoleFilter] = useState<'all' | 'supplier' | 'customer'>('all');
    const searchInputRef = useRef<HTMLInputElement>(null);

    const isSupplierView = role === 'supplier';
    const isCustomerView = role === 'customer';

    // Auto-focus input when opened
    useEffect(() => {
        if (isOpen) {
            setSearchQuery('');
            setRoleFilter(isSupplierView ? 'customer' : isCustomerView ? 'supplier' : 'all');
            setTimeout(() => {
                searchInputRef.current?.focus();
            }, 50);
        }
    }, [isOpen, isSupplierView, isCustomerView]);

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

    // Strictly enforce counter-party filtering based on logged in role:
    // Exclude ALL admin accounts unconditionally
    // If supplier is logged in -> only show customers
    // If customer is logged in -> only show suppliers/carriers
    const targetFilteredDirectory = useMemo(() => {
        const nonAdminUsers = directoryUsers.filter(u => {
            const uType = (u.user_type || '').toLowerCase();
            const email = (u.email || '').toLowerCase();
            const name = (u.name || '').toLowerCase();
            const company = (u.company_name || '').toLowerCase();
            const isAdmin = uType.includes('admin') || email.includes('admin@') || name.includes('admin') || company.includes('admin') || (u as any).is_admin === true || (u as any).is_admin === 1;
            return !isAdmin;
        });

        if (isSupplierView) {
            return nonAdminUsers.filter(u => {
                const uType = (u.user_type || '').toLowerCase();
                return (uType.includes('customer') || uType.includes('shipper')) && !uType.includes('supplier') && !uType.includes('carrier');
            });
        }
        if (isCustomerView) {
            return nonAdminUsers.filter(u => {
                const uType = (u.user_type || '').toLowerCase();
                return (uType.includes('supplier') || uType.includes('carrier')) && !uType.includes('customer') && !uType.includes('shipper');
            });
        }
        return nonAdminUsers;
    }, [directoryUsers, isSupplierView, isCustomerView]);

    // Filter directory users with search query
    const filteredUsers = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();
        return targetFilteredDirectory.filter(user => {
            const name = (user.name || '').toLowerCase();
            const company = (user.company_name || '').toLowerCase();
            const email = (user.email || '').toLowerCase();
            const uRole = (user.user_type || '').toLowerCase();

            const matchesQuery = !query ||
                name.includes(query) ||
                company.includes(query) ||
                email.includes(query) ||
                uRole.includes(query);

            if (!matchesQuery) return false;

            if (!isSupplierView && !isCustomerView) {
                if (roleFilter === 'supplier') {
                    return uRole.includes('supplier') || uRole.includes('carrier');
                }
                if (roleFilter === 'customer') {
                    return uRole.includes('customer') || uRole.includes('shipper');
                }
            }

            return true;
        });
    }, [targetFilteredDirectory, searchQuery, roleFilter, isSupplierView, isCustomerView]);

    if (!isOpen) return null;

    const modalTitle = isSupplierView
        ? 'Select Customer'
        : isCustomerView
        ? 'Select Carrier / Supplier'
        : 'New Message';

    const modalSubtitle = isSupplierView
        ? 'Search and select a Customer to start a direct message'
        : isCustomerView
        ? 'Search and select a Carrier or Supplier to start a direct message'
        : 'Search and select a partner to start a conversation';

    const modalBadge = isSupplierView
        ? 'Customer Directory'
        : isCustomerView
        ? 'Carrier Directory'
        : 'Direct Message';

    const placeholderText = isSupplierView
        ? 'Search customers by name, company, or email...'
        : isCustomerView
        ? 'Search carriers & suppliers by name, company, or email...'
        : 'Search by name, company, or email address...';

    return createPortal(
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-[99999] flex items-center justify-center p-3 sm:p-4">
            <div className="bg-white dark:bg-[#1e2329] rounded-[4px] shadow-2xl border border-slate-200/90 dark:border-slate-800 w-full max-w-lg overflow-hidden flex flex-col font-sans animate-in fade-in zoom-in-95 duration-150">
                
                {/* Modal Header */}
                <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-[#1e2329]">
                    <div>
                        <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2 leading-tight">
                            <span>{modalTitle}</span>
                            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-orange-50 dark:bg-[#ff4a1f]/20 text-[#ff4a1f] dark:text-orange-400">
                                {modalBadge}
                            </span>
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            {modalSubtitle}
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-[3px] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        title="Close"
                    >
                        <X size={17} />
                    </button>
                </div>

                {/* Sub-header directory count info */}
                <div className="flex items-center justify-between px-6 py-2 bg-slate-50/70 dark:bg-[#181d24] border-b border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-1.5 font-semibold">
                        <Users size={14} className="text-[#ff4a1f]" />
                        <span>
                            {isSupplierView ? 'Available Customers' : isCustomerView ? 'Available Carriers & Suppliers' : 'Available Contacts'}
                        </span>
                    </div>
                    <span className="bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded-full text-[11px] font-bold text-slate-700 dark:text-slate-300">
                        {targetFilteredDirectory.length} total
                    </span>
                </div>

                {/* Body Content */}
                <div className="p-6 space-y-3.5 max-h-[60vh] overflow-y-auto">
                    
                    {/* Search Input Box */}
                    <div className="relative">
                        <input
                            ref={searchInputRef}
                            type="text"
                            placeholder={placeholderText}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-9 pl-9 pr-8 text-xs bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-700 rounded-[3px] focus:outline-none focus:border-[#FF4A1F] text-slate-900 dark:text-slate-100 placeholder-slate-400 shadow-2xs transition-all"
                        />
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        {searchQuery && (
                            <button
                                type="button"
                                onClick={() => setSearchQuery('')}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                            >
                                <X size={14} />
                            </button>
                        )}
                    </div>

                    {/* User Cards List */}
                    <div className="space-y-2">
                        {isLoading && targetFilteredDirectory.length === 0 ? (
                            <div className="p-8 text-center text-xs text-slate-400 space-y-2">
                                <p>Loading directory contacts...</p>
                            </div>
                        ) : filteredUsers.length === 0 ? (
                            <div className="p-6 text-center text-xs text-slate-400 bg-slate-50/50 dark:bg-[#181d24] rounded-[3px] border border-slate-100 dark:border-slate-800/80">
                                <p className="font-bold text-slate-700 dark:text-slate-300 text-xs">
                                    {isSupplierView ? 'No customers found' : isCustomerView ? 'No suppliers found' : 'No contacts found'}
                                </p>
                                <p className="text-[11px] text-slate-400 mt-0.5">
                                    {searchQuery ? 'Try searching with another keyword or company name.' : 'No available contacts matching this criteria.'}
                                </p>
                            </div>
                        ) : (
                            filteredUsers.map((user) => {
                                const displayName = user.company_name || user.name || 'User';
                                const badge = getRoleBadge(user.user_type);
                                const hasExistingChat = existingConversationUserIds.has(String(user.id));

                                return (
                                    <div
                                        key={user.id}
                                        onClick={() => {
                                            onClose();
                                            onSelectUser(user);
                                        }}
                                        className="p-3 bg-white dark:bg-[#1e2329] rounded-[3px] border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:border-[#FF4A1F]/70 dark:hover:border-[#FF4A1F]/70 hover:bg-orange-50/15 dark:hover:bg-orange-950/10 transition-all cursor-pointer flex items-center justify-between gap-3"
                                    >
                                        <div className="flex items-center gap-3 min-w-0">
                                            {/* Avatar */}
                                            <div className="relative shrink-0 w-9 h-9">
                                                {user.avatar ? (
                                                    <img
                                                        src={user.avatar}
                                                        alt={displayName}
                                                        className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                                                    />
                                                ) : (
                                                    <div className={`w-9 h-9 rounded-full font-bold text-xs flex items-center justify-center border shadow-2xs ${
                                                        (user.user_type || '').toLowerCase().includes('supplier')
                                                            ? 'bg-orange-50 dark:bg-orange-950/40 border-orange-200/80 dark:border-orange-900/50 text-[#FF4A1F]'
                                                            : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200/80 dark:border-emerald-900/50 text-emerald-700'
                                                    }`}>
                                                        {displayName.charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-[#1e2329]" />
                                            </div>

                                            {/* Info */}
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="font-bold text-[13px] text-slate-900 dark:text-slate-100 truncate">
                                                        {displayName}
                                                    </span>
                                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${badge.bg}`}>
                                                        {badge.label}
                                                    </span>
                                                </div>

                                                <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                                                    {user.email || (user.company_name && user.name !== user.company_name ? user.name : 'Direct Message')}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Status */}
                                        {hasExistingChat ? (
                                            <span className="text-[10.5px] font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full shrink-0">
                                                Active Chat
                                            </span>
                                        ) : (
                                            <span className="text-[10.5px] font-bold text-[#ff4a1f] bg-orange-50 dark:bg-[#ff4a1f]/10 px-2 py-0.5 rounded-full shrink-0 border border-orange-200/60 dark:border-orange-900/30 flex items-center gap-1">
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
                <div className="px-6 py-3.5 bg-slate-50/80 dark:bg-[#181d24] border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span>{filteredUsers.length} contact{filteredUsers.length !== 1 ? 's' : ''} available</span>
                    <button
                        type="button"
                        onClick={onClose}
                        className="h-8 px-4 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-[#1e2329] border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-[3px] shadow-2xs transition-colors cursor-pointer"
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
