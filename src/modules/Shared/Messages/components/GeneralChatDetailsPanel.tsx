import React, { useState } from 'react';
import {
    User,
    FileText,
    BadgeCheck,
    Mail,
    Building2,
    Image as ImageIcon,
    Download,
    ExternalLink,
    Shield,
    FileSpreadsheet,
    FileArchive,
    Phone,
    MapPin,
    X
} from 'lucide-react';
import { ConversationUser, GeneralMessage, MessageAttachment } from '@/services/messageService';
import { getAttachmentUrl } from '@/modules/Customer/QuoteManagement/Negotiation/Chat/utils/customerChatUtils';
import { normalizeAttachment, isImageAttachment } from './GeneralChatMessageBubble';
import { parseRawAttachments } from '@/hooks/useGeneralMessages';
import { GeneralChatDetailsPanelSkeleton } from './GeneralChatDetailsPanelSkeleton';

interface GeneralChatDetailsPanelProps {
    partner: ConversationUser | null;
    messages: GeneralMessage[];
    onClose?: () => void;
    onOpenImageLightbox?: (images: any[], index: number) => void;
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
    isLoading = false
}) => {
    const [activeTab, setActiveTab] = useState<'profile' | 'photos' | 'docs'>('profile');

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
    const roleLabel = isSupplier ? 'Verified Carrier / Supplier' : 'Verified Customer';

    const allAttachments: MessageAttachment[] = messages.flatMap(m => {
        const raw = parseRawAttachments(m);
        return raw.map(normalizeAttachment);
    });
    const imageAttachments = allAttachments.filter(isImageAttachment);
    const docAttachments = allAttachments.filter(att => !isImageAttachment(att));

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
                    <div className="absolute bottom-0 right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full"></div>
                </div>

                <div className="flex items-center gap-1 justify-center text-center">
                    <h3 className="text-[14px] font-bold text-slate-800 dark:text-slate-100 truncate max-w-[200px]">
                        {displayName}
                    </h3>
                    <span title="Verified Platform Member">
                        <BadgeCheck size={16} className="text-emerald-500 shrink-0" />
                    </span>
                </div>

                <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                    {roleLabel}
                </p>

                {/* 3 Interactive Switcher Tabs */}
                <div className="flex items-center justify-center gap-6 mt-4 w-full">
                    <button
                        type="button"
                        onClick={() => setActiveTab('profile')}
                        className="flex flex-col items-center gap-1 cursor-pointer group focus:outline-none"
                    >
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                            activeTab === 'profile'
                                ? 'bg-[#FF4A1F] text-white shadow-xs ring-2 ring-[#FF4A1F]/25'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 group-hover:bg-slate-200 dark:group-hover:bg-slate-700'
                        }`}>
                            <User size={16} />
                        </div>
                        <span className={`text-[10.5px] font-semibold transition-colors ${
                            activeTab === 'profile' ? 'text-[#FF4A1F] font-bold' : 'text-slate-600 dark:text-slate-400 group-hover:text-slate-900'
                        }`}>
                            Profile
                        </span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab('photos')}
                        className="flex flex-col items-center gap-1 cursor-pointer group focus:outline-none"
                    >
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                            activeTab === 'photos'
                                ? 'bg-[#FF4A1F] text-white shadow-xs ring-2 ring-[#FF4A1F]/25'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 group-hover:bg-slate-200 dark:group-hover:bg-slate-700'
                        }`}>
                            <ImageIcon size={16} />
                        </div>
                        <span className={`text-[10.5px] font-semibold transition-colors ${
                            activeTab === 'photos' ? 'text-[#FF4A1F] font-bold' : 'text-slate-600 dark:text-slate-400 group-hover:text-slate-900'
                        }`}>
                            Photos {imageAttachments.length > 0 ? `(${imageAttachments.length})` : ''}
                        </span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab('docs')}
                        className="flex flex-col items-center gap-1 cursor-pointer group focus:outline-none"
                    >
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                            activeTab === 'docs'
                                ? 'bg-[#FF4A1F] text-white shadow-xs ring-2 ring-[#FF4A1F]/25'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 group-hover:bg-slate-200 dark:group-hover:bg-slate-700'
                        }`}>
                            <FileText size={16} />
                        </div>
                        <span className={`text-[10.5px] font-semibold transition-colors ${
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
                        <div className="space-y-2.5">
                            <h4 className="text-[12px] font-bold text-slate-900 dark:text-slate-100 pb-1 border-b border-slate-100 dark:border-slate-800">
                                Partner Details
                            </h4>

                            {partner.company_name && (
                                <div className="flex justify-between items-center py-1 border-b border-slate-100/80 dark:border-slate-800/80">
                                    <span className="text-slate-500 flex items-center gap-1.5"><Building2 size={13} className="text-slate-400" /> Company</span>
                                    <span className="font-semibold text-slate-800 dark:text-slate-200 text-right truncate max-w-[160px]">
                                        {partner.company_name}
                                    </span>
                                </div>
                            )}

                            {partner.email && (
                                <div className="flex justify-between items-center py-1 border-b border-slate-100/80 dark:border-slate-800/80">
                                    <span className="text-slate-500 flex items-center gap-1.5"><Mail size={13} className="text-slate-400" /> Email</span>
                                    <span className="font-medium text-slate-800 dark:text-slate-200 text-right truncate max-w-[160px]">
                                        {partner.email}
                                    </span>
                                </div>
                            )}

                            {(partner as any).phone && (
                                <div className="flex justify-between items-center py-1 border-b border-slate-100/80 dark:border-slate-800/80">
                                    <span className="text-slate-500 flex items-center gap-1.5"><Phone size={13} className="text-slate-400" /> Phone</span>
                                    <span className="font-medium text-slate-800 dark:text-slate-200 text-right">
                                        {(partner as any).phone}
                                    </span>
                                </div>
                            )}

                            <div className="flex justify-between items-center py-1 border-b border-slate-100/80 dark:border-slate-800/80">
                                <span className="text-slate-500">Account Type</span>
                                <span className="font-medium capitalize text-slate-800 dark:text-slate-200">
                                    {partner.user_type || 'Platform Member'}
                                </span>
                            </div>

                            <div className="flex justify-between items-center py-1">
                                <span className="text-slate-500">Verification</span>
                                <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                    <BadgeCheck size={13} /> Verified Member
                                </span>
                            </div>
                        </div>

                        {/* Security Notice */}
                        <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#181d24] border border-slate-200/70 dark:border-slate-800 space-y-1">
                            <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold text-[11px]">
                                <Shield size={13} />
                                <span>Platform Encrypted Channel</span>
                            </div>
                            <p className="text-[10.5px] leading-relaxed text-slate-500 dark:text-slate-400">
                                All quote requests, shipments, and messages transmitted with this partner are securely verified.
                            </p>
                        </div>
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
