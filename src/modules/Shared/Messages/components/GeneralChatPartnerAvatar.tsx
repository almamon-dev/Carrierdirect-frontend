import React from 'react';
import { ConversationUser } from '@/services/messageService';
import { getAttachmentUrl } from '@/modules/Customer/QuoteManagement/Negotiation/Chat/utils/customerChatUtils';

interface GeneralChatPartnerAvatarProps {
    partner?: ConversationUser | null;
}

export const GeneralChatPartnerAvatar: React.FC<GeneralChatPartnerAvatarProps> = ({ partner }) => {
    const partnerDisplayName = partner?.company_name || partner?.name || 'User';
    const partnerInitial = partnerDisplayName.charAt(0).toUpperCase();
    const partnerAvatarUrl = getAttachmentUrl(partner?.avatar);

    return (
        <div className="shrink-0 mb-1">
            {partnerAvatarUrl ? (
                <img
                    src={partnerAvatarUrl}
                    alt={partnerDisplayName}
                    className="w-7 h-7 rounded-full object-cover border border-slate-200 dark:border-slate-700 shadow-2xs"
                />
            ) : (
                <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-[11px] border shadow-2xs ${
                        partner?.user_type === 'supplier'
                            ? 'bg-orange-50 dark:bg-orange-950/40 border-orange-200/80 dark:border-orange-900/50 text-[#FF4A1F]'
                            : 'bg-blue-50 dark:bg-blue-950/40 border-blue-200/80 dark:border-blue-900/50 text-[#2563EB]'
                    }`}
                >
                    {partnerInitial}
                </div>
            )}
        </div>
    );
};
