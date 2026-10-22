import React from 'react';
import {
    FileCheck,
    Truck,
    Landmark,
    UserCheck,
    FileText,
    CheckCircle2,
    Wallet,
    FileWarning,
    Bell,
    LucideIcon
} from 'lucide-react';
import { HeaderNotification } from '@/hooks/useHeaderNotifications';

interface IconConfig {
    icon: LucideIcon;
    bg: string;
    color: string;
}

export const getNotificationVisualConfig = (notif: HeaderNotification): IconConfig => {
    const sub = notif.subCategory || '';
    const title = (notif.title || '').toLowerCase();
    const desc = (notif.desc || '').toLowerCase();

    // 1. Proof of Delivery / POD
    if (sub === 'pod' || title.includes('pod') || desc.includes('proof of delivery')) {
        return {
            icon: FileCheck,
            bg: 'bg-[#EBFBF0] dark:bg-emerald-950/40 border border-emerald-100/80 dark:border-emerald-800/40',
            color: 'text-emerald-600 dark:text-emerald-400',
        };
    }

    // 2. Documents Expiring Soon / Compliance Warning
    if (
        sub === 'documents_expiring' ||
        notif.category === 'compliance' ||
        title.includes('expir') ||
        title.includes('document') ||
        desc.includes('document') ||
        desc.includes('insurance') ||
        desc.includes('license')
    ) {
        return {
            icon: FileWarning,
            bg: 'bg-[#FEF0F0] dark:bg-rose-950/40 border border-rose-100/80 dark:border-rose-800/40',
            color: 'text-rose-500 dark:text-rose-400',
        };
    }

    // 3. Quote Accepted
    if (sub === 'quote_accepted' || title.includes('quote accepted') || title.includes('accepted')) {
        return {
            icon: CheckCircle2,
            bg: 'bg-[#EBFBF0] dark:bg-emerald-950/40 border border-emerald-100/80 dark:border-emerald-800/40',
            color: 'text-emerald-600 dark:text-emerald-400',
        };
    }

    // 4. Funds Released
    if (sub === 'funds_released' || title.includes('funds released') || desc.includes('released to your balance')) {
        return {
            icon: Wallet,
            bg: 'bg-[#FFF4EC] dark:bg-orange-950/40 border border-orange-100/80 dark:border-orange-800/40',
            color: 'text-[#FF4A1F] dark:text-[#FF6B47]',
        };
    }

    // 5. Payment Received in Escrow / Finance
    if (
        sub === 'escrow' ||
        title.includes('escrow') ||
        title.includes('payment') ||
        desc.includes('escrow') ||
        notif.category === 'finance'
    ) {
        return {
            icon: Landmark,
            bg: 'bg-[#F4EFFE] dark:bg-purple-950/40 border border-purple-100/80 dark:border-purple-800/40',
            color: 'text-purple-600 dark:text-purple-400',
        };
    }

    // 6. Driver Assigned / Account
    if (
        sub === 'driver_assigned' ||
        title.includes('driver assigned') ||
        desc.includes('has been assigned') ||
        notif.category === 'account'
    ) {
        return {
            icon: UserCheck,
            bg: 'bg-[#FFF4EC] dark:bg-orange-950/40 border border-orange-100/80 dark:border-orange-800/40',
            color: 'text-[#FF4A1F] dark:text-[#FF6B47]',
        };
    }

    // 7. Quote Received / Supplier Offer Submitted / Revision
    if (
        sub === 'quote_received' ||
        sub === 'quote_submitted' ||
        sub === 'quote_revised' ||
        title.includes('new quote from') ||
        title.includes('quote received') ||
        title.includes('quote submitted') ||
        title.includes('revised quote') ||
        title.includes('revised offer')
    ) {
        return {
            icon: FileText,
            bg: 'bg-[#EFF6FF] dark:bg-blue-950/40 border border-blue-100/80 dark:border-blue-800/40',
            color: 'text-blue-600 dark:text-blue-400',
        };
    }

    // 8. New Quote Request / RFQ
    if (
        sub === 'new_quote_request' ||
        title.includes('quote request') ||
        title.includes('new rfq') ||
        desc.includes('freight request') ||
        notif.category === 'quote'
    ) {
        return {
            icon: FileText,
            bg: 'bg-[#F4EFFE] dark:bg-indigo-950/40 border border-indigo-100/80 dark:border-indigo-800/40',
            color: 'text-indigo-600 dark:text-indigo-400',
        };
    }

    // 8. Shipment Update / In transit
    if (
        sub === 'transit' ||
        notif.category === 'shipment' ||
        title.includes('shipment') ||
        title.includes('transit') ||
        desc.includes('in transit')
    ) {
        return {
            icon: Truck,
            bg: 'bg-[#EDF5FF] dark:bg-blue-950/40 border border-blue-100/80 dark:border-blue-800/40',
            color: 'text-blue-600 dark:text-blue-400',
        };
    }

    return {
        icon: Bell,
        bg: 'bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700',
        color: 'text-slate-600 dark:text-slate-300',
    };
};

interface NotificationItemProps {
    notif: HeaderNotification;
    activeMenuId?: string | number | null;
    onClick: (notif: HeaderNotification) => void;
    onToggleMenu?: (e: React.MouseEvent<HTMLButtonElement>, notifId: string | number) => void;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({
    notif,
    onClick,
}) => {
    const { icon: Icon, bg, color } = getNotificationVisualConfig(notif);

    return (
        <div
            onClick={() => onClick(notif)}
            className="px-5 py-3.5 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors flex items-start gap-3.5 cursor-pointer group"
        >
            {/* Circular Category / Type Icon */}
            <div className={`w-10 h-10 rounded-full ${bg} ${color} flex items-center justify-center shrink-0 mt-0.5`}>
                <Icon size={18} strokeWidth={2.2} />
            </div>

            {/* Notification Title & Description */}
            <div className="flex-1 min-w-0 pr-1">
                <p className="text-[14px] font-bold text-slate-900 dark:text-slate-100 leading-snug line-clamp-1 group-hover:text-[#FF4A1F] transition-colors">
                    {notif.title}
                </p>
                <p className="text-[12.5px] text-[#64748B] dark:text-slate-400 leading-relaxed line-clamp-2 mt-0.5 font-normal">
                    {notif.desc}
                </p>
            </div>

            {/* Relative Time & Unread Orange Dot */}
            <div className="flex items-center gap-2.5 shrink-0 self-start mt-0.5 ml-2">
                <span className="text-[12px] text-[#94A3B8] dark:text-slate-500 whitespace-nowrap font-medium">
                    {notif.time}
                </span>
                {notif.unread && (
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FF4A1F] shrink-0" />
                )}
            </div>
        </div>
    );
};

