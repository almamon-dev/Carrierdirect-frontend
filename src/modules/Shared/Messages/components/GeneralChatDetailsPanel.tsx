import React, { useState } from 'react';
import { X } from 'lucide-react';
import { ConversationUser, GeneralMessage, MessageAttachment } from '@/services/messageService';
import { getAttachmentUrl } from '@/modules/Customer/QuoteManagement/Negotiation/Chat/utils/customerChatUtils';
import { parseRawAttachments } from '@/hooks/useGeneralMessages';
import { normalizeAttachment, isImageAttachment } from './generalChatAttachmentUtils';
import { GeneralChatDetailsPanelSkeleton } from './GeneralChatDetailsPanelSkeleton';
import { GeneralChatDetailsProfileHeader } from './GeneralChatDetailsProfileHeader';
import { GeneralChatDetailsProfileTab } from './GeneralChatDetailsProfileTab';
import { GeneralChatDetailsPinnedTab } from './GeneralChatDetailsPinnedTab';
import { GeneralChatDetailsMediaTabs, getFileIcon } from './GeneralChatDetailsMediaTabs';

export { getFileIcon };

export interface GeneralChatDetailsPanelProps {
    partner: ConversationUser | null;
    messages: GeneralMessage[];
    onClose?: () => void;
    onOpenImageLightbox?: (images: any[], index: number) => void;
    onTogglePin?: (messageId: number | string) => void;
    initialTab?: 'profile' | 'pinned' | 'photos' | 'docs';
    isLoading?: boolean;
}

export const GeneralChatDetailsPanel: React.FC<GeneralChatDetailsPanelProps> = ({
    partner,
    messages,
    onClose,
    onOpenImageLightbox,
    onTogglePin,
    initialTab = 'profile',
    isLoading = false,
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
    const lastSeenHuman = partner.last_seen_human || (isOnline ? 'Active Now' : 'Offline');

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
                .map((s) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase())
                .join(' ');
        }
        return isSupplier ? 'Supplier' : 'Customer';
    })();

    const allAttachments: MessageAttachment[] = messages.flatMap((m) => {
        const raw = parseRawAttachments(m);
        return raw.map(normalizeAttachment);
    });
    const imageAttachments = allAttachments.filter(isImageAttachment);
    const docAttachments = allAttachments.filter((att) => !isImageAttachment(att));
    const pinnedMessages = messages.filter((m) => Boolean(m.is_pinned));
    const partnerAvatarUrl = getAttachmentUrl(partner.avatar);

    return (
        <div className="flex flex-col min-h-0 h-full w-full bg-white dark:bg-[#12161c] overflow-y-auto [&::-webkit-scrollbar]:hidden font-sans relative">
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

            <GeneralChatDetailsProfileHeader
                partner={partner}
                partnerAvatarUrl={partnerAvatarUrl}
                displayName={displayName}
                isSupplier={isSupplier}
                isVerified={isVerified}
                isOnline={isOnline}
                lastSeenHuman={lastSeenHuman}
                roleLabel={roleLabel}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                pinnedMessages={pinnedMessages}
                imageAttachments={imageAttachments}
                docAttachments={docAttachments}
            />

            <div className="flex-1 p-4 text-xs">
                {activeTab === 'profile' && (
                    <GeneralChatDetailsProfileTab
                        partner={partner}
                        isSupplier={isSupplier}
                        roleLabel={roleLabel}
                    />
                )}

                {activeTab === 'pinned' && (
                    <GeneralChatDetailsPinnedTab
                        pinnedMessages={pinnedMessages}
                        displayName={displayName}
                        onTogglePin={onTogglePin}
                    />
                )}

                {(activeTab === 'photos' || activeTab === 'docs') && (
                    <GeneralChatDetailsMediaTabs
                        activeTab={activeTab}
                        imageAttachments={imageAttachments}
                        docAttachments={docAttachments}
                        onOpenImageLightbox={onOpenImageLightbox}
                    />
                )}
            </div>
        </div>
    );
};

export default GeneralChatDetailsPanel;
