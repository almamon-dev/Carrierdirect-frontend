import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, Search, Users } from 'lucide-react';
import { ConversationUser, ConversationPartnerItem } from '@/services/messageService';
import { NewMessageUserCard } from './NewMessageUserCard';
import { useNewMessageFilter, getRoleBadge } from './useNewMessageFilter';

export { getRoleBadge };

export interface NewMessageModalProps {
    isOpen: boolean;
    onClose: () => void;
    directoryUsers: ConversationUser[];
    conversations: ConversationPartnerItem[];
    onSelectUser: (user: ConversationUser) => void;
    isLoading?: boolean;
    onRefresh?: () => void;
    role?: 'supplier' | 'customer' | string;
}

export const NewMessageModal: React.FC<NewMessageModalProps> = ({
    isOpen,
    onClose,
    directoryUsers,
    conversations,
    onSelectUser,
    isLoading = false,
    role = 'customer',
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const searchInputRef = useRef<HTMLInputElement>(null);

    const {
        isSupplierView,
        isCustomerView,
        isDriverView,
        existingConversationUserIds,
        filteredUsers,
        placeholderText,
    } = useNewMessageFilter({
        directoryUsers,
        conversations,
        searchQuery,
        role,
    });

    useEffect(() => {
        if (isOpen) {
            setSearchQuery('');
            setTimeout(() => {
                searchInputRef.current?.focus();
            }, 50);
        }
    }, [isOpen]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150" onClick={onClose}>
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
                                {isSupplierView ? 'Direct Message to Customer' : isCustomerView ? 'Direct Message to Carrier' : isDriverView ? 'Message Customer' : 'New Direct Message'}
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

                {/* Subheader */}
                <div className="px-4 py-1.5 bg-slate-50/60 dark:bg-[#161b22] border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
                    <span className="font-medium text-slate-600 dark:text-slate-300">
                        {isSupplierView ? 'Verified Customers' : isCustomerView ? 'Verified Suppliers & Carriers' : isDriverView ? 'Contacts from Assigned Orders' : 'Available Contacts'}
                    </span>
                    <span className="font-semibold text-[#FF4A1F] bg-orange-50 dark:bg-[#ff4a1f]/10 px-2 py-0.5 rounded text-[10.5px]">
                        {filteredUsers.length} available
                    </span>
                </div>

                {/* Body Content */}
                <div className="p-3.5 space-y-2.5 max-h-[55vh] overflow-y-auto">
                    <div className="relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10" />
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

                    <div className="space-y-1">
                        {isLoading && directoryUsers.length === 0 ? (
                            <div className="p-6 text-center text-xs text-slate-400 space-y-1.5">
                                <p>Loading directory contacts...</p>
                            </div>
                        ) : filteredUsers.length === 0 ? (
                            <div className="p-5 text-center text-xs text-slate-400 bg-slate-50/50 dark:bg-[#161b22] rounded-lg">
                                <p className="font-semibold text-slate-700 dark:text-slate-300 text-xs">
                                    {isSupplierView ? 'No customers found' : isCustomerView ? 'No suppliers found' : isDriverView ? 'No assigned customer orders yet' : 'No contacts found'}
                                </p>
                                <p className="text-[11px] text-slate-400 mt-0.5">
                                    {searchQuery ? 'Try searching with another keyword or company name.' : isDriverView ? 'When a supplier assigns a shipment to you, the customer of that order will appear here to chat.' : 'No available contacts matching this criteria.'}
                                </p>
                            </div>
                        ) : (
                            filteredUsers.map((user) => (
                                <NewMessageUserCard
                                    key={user.id}
                                    user={user}
                                    hasExistingChat={existingConversationUserIds.has(String(user.id))}
                                    onSelect={(selected) => {
                                        onClose();
                                        onSelectUser(selected);
                                    }}
                                />
                            ))
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
