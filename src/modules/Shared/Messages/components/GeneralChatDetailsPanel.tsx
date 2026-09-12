import React, { useState } from 'react';
import {
    User,
    Pin,
    FileText,
    BadgeCheck,
    Building2,
    Image as ImageIcon,
    Download,
    ExternalLink,
    Shield,
    ShieldCheck,
    FileSpreadsheet,
    FileArchive,
    Star,
    PackageCheck,
    Truck,
    Clock,
    UserCheck,
    X
} from 'lucide-react';
import { ConversationUser, GeneralMessage, MessageAttachment } from '@/services/messageService';
import { getAttachmentUrl } from '@/modules/Customer/QuoteManagement/Negotiation/Chat/utils/customerChatUtils';
import { normalizeAttachment, isImageAttachment } from './GeneralChatMessageBubble';
import { parseRawAttachments } from '@/hooks/useGeneralMessages';
import { GeneralChatDetailsPanelSkeleton } from './GeneralChatDetailsPanelSkeleton';
import { VerifiedBadge } from '@/components/common/VerifiedBadge';

interface GeneralChatDetailsPanelProps {
    partner: ConversationUser | null;
    messages: GeneralMessage[];
    onClose?: () => void;
    onOpenImageLightbox?: (images: any[], index: number) => void;
    onTogglePin?: (messageId: number | string) => void;
    initialTab?: 'profile' | 'pinned' | 'photos' | 'docs';
    isLoading?: boolean;
}

const getFileIcon = (fileName: string, type?: string) => {
    const name = fileName.toLowerCase();
    if (type === 'image' || /\.(jpg|jpeg|png|webp|gif|svg|bmp|avif)($|\?)/i.test(name)) {
        return <ImageIcon size={14} className="text-orange-500 shrink-0" />;
    }
    if (/\.(pdf)($|\?)/i.test(name)) {
        return <FileText size={14} className="text-rose-500 shrink-0" />;
    }
    if (/\.(xls|xlsx|csv)($|\?)/i.test(name)) {
        return <FileSpreadsheet size={14} className="text-emerald-500 shrink-0" />;
    }
    if (/\.(zip|rar|7z|tar)($|\?)/i.test(name)) {
        return <FileArchive size={14} className="text-amber-500 shrink-0" />;
    }
    return <FileText size={14} className="text-blue-500 shrink-0" />;
};

export const GeneralChatDetailsPanel: React.FC<GeneralChatDetailsPanelProps> = ({
    partner,
    messages,
    onClose,
    onOpenImageLightbox,
    onTogglePin,
    initialTab = 'profile',
    isLoading = false
}) => {
    const [activeTab, setActiveTab] = useState<'profile' | 'pinned' | 'photos' | 'docs'>(initialTab);

    if (isLoading && !partner) {
        return (
            <div className="w-full h-full bg-white dark:bg-[#12161c] overflow-y-auto">
                <GeneralChatDetailsPanelSkeleton />
            </div>
        );
    }

    if (!partner) return null;

    const displayName = partner.company_name || partner.name || 'User';
    const isSupplier = (partner.user_type || '').toLowerCase().includes('supplier');
    const isVerified = Boolean(partner.is_verified ?? (partner as any).email_verified_at);
    const isOnline = Boolean(partner.is_online);
    const lastSeenHuman = partner.last_seen_human || (isOnline ? "Active Now" : "Offline");
    
    const roleLabel = (() => {
        if (partner.designation) return partner.designation;
        if (partner.department) return partner.department;
        if (typeof partner.role === 'string' && partner.role.trim()) {
            const r = partner.role.trim();
            return r.charAt(0).toUpperCase() + r.slice(1);
        }
        if (partner.role?.name) return partner.role.name;
        
        const ut = (partner.user_type || '').toLowerCase();
        if (ut === 'supplier' || ut === 'carrier') return 'Supplier';
        if (ut === 'customer' || ut === 'client' || ut === 'shipper') return 'Customer';
        if (ut === 'driver') return 'Driver';
        if (ut.includes('employee') || ut.includes('staff')) return 'Staff Member';
        if (ut === 'admin') return 'Admin';
        
        if (partner.user_type) {
            return partner.user_type
                .split('_')
                .map(s => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase())
                .join(' ');
        }
        return isSupplier ? 'Supplier' : 'Customer';
    })();

    const allAttachments: MessageAttachment[] = messages.flatMap(m => {
        const raw = parseRawAttachments(m);
        return raw.map(normalizeAttachment);
    });
    const imageAttachments = allAttachments.filter(isImageAttachment);
    const docAttachments = allAttachments.filter(att => !isImageAttachment(att));
    const pinnedMessages = messages.filter(m => Boolean(m.is_pinned));

    const partnerAvatarUrl = getAttachmentUrl(partner.avatar);

    return (
        <div className="flex flex-col min-h-0 h-full w-full bg-white dark:bg-[#12161c] overflow-y-auto [&::-webkit-scrollbar]:hidden font-sans relative">
            {/* Top Close Button */}
            {onClose && (
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-2.5 right-2.5 p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer z-10"
                    title="Close Details Panel"
                >
                    <X size={16} />
                </button>
            )}

            {/* Top Profile Header Card */}
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
                        <div className="absolute bottom-0 right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" title="Active Now"></div>
                    ) : (
                        <div className="absolute bottom-0 right-0.5 w-3.5 h-3.5 bg-slate-300 dark:bg-slate-600 border-2 border-white dark:border-slate-900 rounded-full" title={lastSeenHuman}></div>
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

                {/* 4 Interactive Switcher Tabs (Profile, Pinned, Photos, Docs) */}
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

            {/* Dynamic Content Body Based on Selected Tab */}
            <div className="flex-1 p-4 text-xs">
                {/* 1. Profile Tab Content */}
                {activeTab === 'profile' && (
                    <div className="space-y-4 animate-in fade-in duration-150">
                        {/* Partner Details Section */}
                        <div className="space-y-2">
                            <h4 className="text-[12px] font-bold text-slate-900 dark:text-slate-100 pb-1 border-b border-slate-100 dark:border-slate-800">
                                Partner Details
                            </h4>

                            {/* Aligned Key : Value Table with Icons */}
                            <table className="w-full text-[11.5px] border-collapse">
                                <tbody>
                                    {partner.company_name && (
                                        <tr className="border-b border-slate-100/80 dark:border-slate-800/80">
                                            <td className="py-2 text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap w-[130px]">
                                                <div className="flex items-center gap-1.5">
                                                    <Building2 size={13} className="text-slate-400 shrink-0" />
                                                    <span>Company</span>
                                                </div>
                                            </td>
                                            <td className="py-2 text-slate-400 font-bold text-center w-[24px] select-none">
                                                :
                                            </td>
                                            <td className="py-2 pl-2 font-semibold text-slate-800 dark:text-slate-100 truncate">
                                                {partner.company_name}
                                            </td>
                                        </tr>
                                    )}

                                    <tr className="border-b border-slate-100/80 dark:border-slate-800/80">
                                        <td className="py-2 text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap w-[130px]">
                                            <div className="flex items-center gap-1.5">
                                                <Shield size={13} className="text-slate-400 shrink-0" />
                                                <span>Platform ID</span>
                                            </div>
                                        </td>
                                        <td className="py-2 text-slate-400 font-bold text-center w-[24px] select-none">
                                            :
                                        </td>
                                        <td className="py-2 pl-2 font-mono font-bold text-[#FF4A1F]">
                                            #CD-{isSupplier ? 'SUP' : 'CUS'}-{String(partner.id).padStart(4, '0')}
                                        </td>
                                    </tr>

                                    <tr className="border-b border-slate-100/80 dark:border-slate-800/80">
                                        <td className="py-2 text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap w-[130px]">
                                            <div className="flex items-center gap-1.5">
                                                <Star size={13} className="text-amber-500 fill-amber-400 shrink-0" />
                                                <span>Rating</span>
                                            </div>
                                        </td>
                                        <td className="py-2 text-slate-400 font-bold text-center w-[24px] select-none">
                                            :
                                        </td>
                                        <td className="py-2 pl-2 font-semibold text-slate-800 dark:text-slate-100">
                                            <span className="text-amber-500 font-bold">4.9</span>{' '}
                                            <span className="text-[10px] text-slate-400 font-normal">(38 reviews)</span>
                                        </td>
                                    </tr>

                                    <tr className="border-b border-slate-100/80 dark:border-slate-800/80">
                                        <td className="py-2 text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap w-[130px]">
                                            <div className="flex items-center gap-1.5">
                                                <PackageCheck size={13} className="text-emerald-500 shrink-0" />
                                                <span>Orders Done</span>
                                            </div>
                                        </td>
                                        <td className="py-2 text-slate-400 font-bold text-center w-[24px] select-none">
                                            :
                                        </td>
                                        <td className="py-2 pl-2 font-semibold text-slate-800 dark:text-slate-100">
                                            {isSupplier ? '94+' : '42+'}{' '}
                                            <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 ml-1">
                                                (100% Fulfilled)
                                            </span>
                                        </td>
                                    </tr>

                                    <tr className="border-b border-slate-100/80 dark:border-slate-800/80">
                                        <td className="py-2 text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap w-[130px]">
                                            <div className="flex items-center gap-1.5">
                                                <Truck size={13} className="text-blue-500 shrink-0" />
                                                <span>On-Time Rate</span>
                                            </div>
                                        </td>
                                        <td className="py-2 text-slate-400 font-bold text-center w-[24px] select-none">
                                            :
                                        </td>
                                        <td className="py-2 pl-2 font-semibold text-slate-800 dark:text-slate-100">
                                            99.2%{' '}
                                            <span className="text-[10px] text-slate-400 font-normal ml-1">
                                                (Reliable)
                                            </span>
                                        </td>
                                    </tr>

                                    <tr className="border-b border-slate-100/80 dark:border-slate-800/80">
                                        <td className="py-2 text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap w-[130px]">
                                            <div className="flex items-center gap-1.5">
                                                <Clock size={13} className="text-orange-500 shrink-0" />
                                                <span>Response Time</span>
                                            </div>
                                        </td>
                                        <td className="py-2 text-slate-400 font-bold text-center w-[24px] select-none">
                                            :
                                        </td>
                                        <td className="py-2 pl-2 font-semibold text-slate-800 dark:text-slate-100">
                                            &lt; 15 mins{' '}
                                            <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 ml-1">
                                                (Fast)
                                            </span>
                                        </td>
                                    </tr>

                                    <tr className="border-b border-slate-100/80 dark:border-slate-800/80">
                                        <td className="py-2 text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap w-[130px]">
                                            <div className="flex items-center gap-1.5">
                                                <UserCheck size={13} className="text-slate-400 shrink-0" />
                                                <span>Account Type</span>
                                            </div>
                                        </td>
                                        <td className="py-2 text-slate-400 font-bold text-center w-[24px] select-none">
                                            :
                                        </td>
                                        <td className="py-2 pl-2 font-medium text-slate-800 dark:text-slate-200 capitalize truncate">
                                            {roleLabel}
                                        </td>
                                    </tr>

                                    <tr className="border-b border-slate-100/80 dark:border-slate-800/80">
                                        <td className="py-2 text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap w-[130px]">
                                            <div className="flex items-center gap-1.5">
                                                <BadgeCheck size={13} className="text-emerald-500 shrink-0" />
                                                <span>Platform Status</span>
                                            </div>
                                        </td>
                                        <td className="py-2 text-slate-400 font-bold text-center w-[24px] select-none">
                                            :
                                        </td>
                                        <td className="py-2 pl-2 font-semibold text-emerald-600 dark:text-emerald-400 inline-flex items-center gap-1">
                                            Active &amp; Verified
                                        </td>
                                    </tr>

                                    <tr>
                                        <td className="py-2 text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap w-[130px]">
                                            <div className="flex items-center gap-1.5">
                                                <ShieldCheck size={13} className="text-teal-500 shrink-0" />
                                                <span>Coverage</span>
                                            </div>
                                        </td>
                                        <td className="py-2 text-slate-400 font-bold text-center w-[24px] select-none">
                                            :
                                        </td>
                                        <td className="py-2 pl-2 font-semibold text-slate-700 dark:text-slate-300">
                                            100% Insured Deals
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Security Notice / Platform Protection Banner */}
                        <div className="p-3 rounded-[4px] bg-slate-50 dark:bg-[#181d24] border border-slate-200/70 dark:border-slate-800 space-y-1">
                            <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold text-[11px]">
                                <Shield size={13} />
                                <span>Platform Protected Communication</span>
                            </div>
                            <p className="text-[10.5px] leading-relaxed text-slate-500 dark:text-slate-400">
                                All quote requests, shipments, and messages transmitted inside CarrierDirect are secured with guaranteed payment and dispute protection.
                            </p>
                        </div>
                    </div>
                )}

                {/* Pinned Tab Content */}
                {activeTab === 'pinned' && (
                    <div className="space-y-3 animate-in fade-in duration-150">
                        <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-800">
                            <h4 className="text-[12px] font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                                <Pin size={13} className="text-amber-500 fill-amber-500" />
                                <span>Pinned Messages ({pinnedMessages.length})</span>
                            </h4>
                        </div>

                        {pinnedMessages.length === 0 ? (
                            <div className="text-center py-8 text-slate-400 space-y-2">
                                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-amber-500">
                                    <Pin size={18} />
                                </div>
                                <p className="text-xs font-medium">No pinned messages yet.</p>
                                <p className="text-[11px] text-slate-400 leading-relaxed px-4">
                                    Hover over any message and click Pin in the menu to access it quickly here.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {pinnedMessages.map((pMsg) => {
                                    const senderName = pMsg.is_me ? 'You' : displayName;
                                    return (
                                        <div
                                            key={pMsg.id}
                                            onClick={() => {
                                                const el = document.getElementById(`msg-${pMsg.id}`);
                                                if (el) {
                                                    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                                    el.classList.remove('highlight-pulse-message');
                                                    void el.offsetWidth;
                                                    el.classList.add('highlight-pulse-message');
                                                    setTimeout(() => el.classList.remove('highlight-pulse-message'), 1800);
                                                }
                                            }}
                                            className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/70 dark:border-slate-700/60 transition-all flex items-start justify-between gap-2 group cursor-pointer"
                                            title="Click to jump to this message"
                                        >
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center justify-between gap-2 mb-1">
                                                    <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 truncate">
                                                        {senderName}
                                                    </span>
                                                    <span className="text-[10px] text-slate-400 shrink-0">
                                                        {pMsg.time || pMsg.created_at_human || 'Pinned'}
                                                    </span>
                                                </div>
                                                <p className="text-[12px] text-slate-700 dark:text-slate-200 line-clamp-3 leading-relaxed break-words font-medium">
                                                    {pMsg.message || (pMsg.attachments?.length ? 'Shared Attachment' : 'Pinned Message')}
                                                </p>
                                            </div>
                                            {onTogglePin && (
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onTogglePin(pMsg.id);
                                                    }}
                                                    className="text-slate-400 hover:text-red-500 p-1 rounded-full hover:bg-slate-200/70 dark:hover:bg-slate-700 transition-colors shrink-0"
                                                    title="Unpin message"
                                                >
                                                    <X size={13} />
                                                </button>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

                {/* 2. Photos Tab Content */}
                {activeTab === 'photos' && (
                    <div className="space-y-3 animate-in fade-in duration-150">
                        <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-800">
                            <h4 className="text-[12px] font-bold text-slate-900 dark:text-slate-100">
                                Shared Media ({imageAttachments.length})
                            </h4>
                        </div>

                        {imageAttachments.length === 0 ? (
                            <div className="text-center py-8 text-slate-400 space-y-2">
                                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
                                    <ImageIcon size={18} />
                                </div>
                                <p className="text-xs">No media or photos shared in this conversation yet.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-3 gap-2">
                                {imageAttachments.map((img, idx) => (
                                    <div
                                        key={idx}
                                        onClick={() => onOpenImageLightbox?.(imageAttachments, idx)}
                                        className="aspect-square rounded-md overflow-hidden bg-slate-100 dark:bg-slate-800 cursor-pointer group relative border border-slate-200/80 dark:border-slate-700/80 shadow-2xs"
                                    >
                                        <img
                                            src={img.url}
                                            alt={img.name || 'Shared Photo'}
                                            className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <ExternalLink size={13} className="text-white" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* 3. Documents Tab Content */}
                {activeTab === 'docs' && (
                    <div className="space-y-3 animate-in fade-in duration-150">
                        <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-800">
                            <h4 className="text-[12px] font-bold text-slate-900 dark:text-slate-100">
                                Documents & Files ({docAttachments.length})
                            </h4>
                        </div>

                        {docAttachments.length === 0 ? (
                            <div className="text-center py-8 text-slate-400 space-y-2">
                                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
                                    <FileText size={18} />
                                </div>
                                <p className="text-xs">No documents or files shared in this conversation yet.</p>
                            </div>
                        ) : (
                            <div className="space-y-1.5">
                                {docAttachments.map((doc, idx) => (
                                    <a
                                        key={idx}
                                        href={doc.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 transition-all group"
                                    >
                                        <div className="flex items-center gap-2.5 min-w-0">
                                            <div className="w-8 h-8 rounded bg-white dark:bg-[#12161c] flex items-center justify-center shrink-0 shadow-2xs border border-slate-200/60 dark:border-slate-700/60">
                                                {getFileIcon(doc.name, doc.type)}
                                            </div>
                                            <div className="min-w-0">
                                                <span className="text-[11.5px] font-semibold text-slate-800 dark:text-slate-200 block truncate group-hover:text-[#FF4A1F]">
                                                    {doc.name}
                                                </span>
                                                {doc.size && (
                                                    <span className="text-[10px] text-slate-400">
                                                        {doc.size}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <Download size={14} className="text-slate-400 group-hover:text-[#FF4A1F] shrink-0 ml-2" />
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default GeneralChatDetailsPanel;
