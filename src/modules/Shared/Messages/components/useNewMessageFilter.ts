import { useMemo } from 'react';
import { ConversationUser, ConversationPartnerItem } from '@/services/messageService';

interface UseNewMessageFilterProps {
    directoryUsers: ConversationUser[];
    conversations: ConversationPartnerItem[];
    searchQuery: string;
    role?: string;
}

export const getRoleBadge = (role?: string) => {
    const r = (role || 'user').toLowerCase();
    if (r.includes('supplier') || r.includes('carrier')) {
        return {
            label: 'Carrier Partner',
            bg: 'bg-orange-50 dark:bg-[#ff4a1f]/15 text-[#ff4a1f] dark:text-orange-400 border border-orange-200/60 dark:border-orange-900/40',
        };
    }
    if (r.includes('customer') || r.includes('shipper')) {
        return {
            label: 'Verified Customer',
            bg: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-900/40',
        };
    }
    return {
        label: role ? role.charAt(0).toUpperCase() + role.slice(1).toLowerCase() : 'Member',
        bg: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700',
    };
};

export const useNewMessageFilter = ({
    directoryUsers,
    conversations,
    searchQuery,
    role = 'customer',
}: UseNewMessageFilterProps) => {
    const isSupplierView = role === 'supplier';
    const isCustomerView = role === 'customer';
    const isDriverView = role === 'driver';

    const existingConversationUserIds = useMemo(() => {
        return new Set(conversations.map((c) => String(c.user?.id)));
    }, [conversations]);

    const filteredUsers = useMemo(() => {
        if (!directoryUsers || !directoryUsers.length) return [];

        let list = directoryUsers;

        if (isCustomerView) {
            list = list.filter((u) => {
                const ut = (u.user_type || '').toLowerCase();
                return ut.includes('supplier') || ut.includes('carrier') || (!ut.includes('customer') && !ut.includes('shipper') && !ut.includes('admin'));
            });
        } else if (isSupplierView) {
            list = list.filter((u) => {
                const ut = (u.user_type || '').toLowerCase();
                return ut.includes('customer') || ut.includes('shipper') || (!ut.includes('supplier') && !ut.includes('carrier') && !ut.includes('admin'));
            });
        }

        const q = searchQuery.trim().toLowerCase();
        if (!q) return list;

        return list.filter((u) => {
            const name = (u.name || '').toLowerCase();
            const company = (u.company_name || '').toLowerCase();
            const email = (u.email || '').toLowerCase();
            const orderNumbers = Array.isArray((u as any).order_numbers)
                ? (u as any).order_numbers.join(' ').toLowerCase()
                : '';
            const roleName = ((u as any).role || '').toLowerCase();
            return name.includes(q) || company.includes(q) || email.includes(q) || orderNumbers.includes(q) || roleName.includes(q);
        });
    }, [directoryUsers, searchQuery, isCustomerView, isSupplierView]);

    const placeholderText = isSupplierView
        ? 'Search customer by name, company, email'
        : isCustomerView
        ? 'Search carrier/supplier by name, company'
        : isDriverView
        ? 'Search customer by name or order'
        : 'Search contacts';

    return {
        isSupplierView,
        isCustomerView,
        isDriverView,
        existingConversationUserIds,
        filteredUsers,
        placeholderText,
    };
};
