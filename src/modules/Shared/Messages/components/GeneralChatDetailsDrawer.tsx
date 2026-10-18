import React from 'react';
import { ConversationUser, GeneralMessage } from '@/services/messageService';
import { GeneralChatDetailsPanel } from './GeneralChatDetailsPanel';

interface GeneralChatDetailsDrawerProps {
    show: boolean;
    onClose: () => void;
    partner: ConversationUser | null;
    messages: GeneralMessage[];
    isLoading: boolean;
    initialTab: 'profile' | 'pinned' | 'photos' | 'docs';
    onTogglePin: (messageId: number | string) => void;
    onOpenImageLightbox: (images: any[], index: number) => void;
}

export const GeneralChatDetailsDrawer: React.FC<GeneralChatDetailsDrawerProps> = ({
    show,
    onClose,
    partner,
    messages,
    isLoading,
    initialTab,
    onTogglePin,
    onOpenImageLightbox,
}) => {
    if (!show || !partner) return null;

    return (
        <>
            {/* Mobile/Tablet Backdrop */}
            <div
                className="xl:hidden fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs"
                onClick={onClose}
            />

            {/* Panel Container */}
            <div className="fixed xl:static top-0 right-0 bottom-0 z-50 xl:z-10 w-[300px] sm:w-[340px] xl:w-[320px] 2xl:w-[340px] shrink-0 h-full bg-white dark:bg-[#12161c] border-l border-slate-200 dark:border-slate-800 shadow-2xl xl:shadow-none flex flex-col animate-in slide-in-from-right duration-200">
                <GeneralChatDetailsPanel
                    partner={partner}
                    messages={messages}
                    isLoading={isLoading}
                    onTogglePin={onTogglePin}
                    initialTab={initialTab}
                    onClose={onClose}
                    onOpenImageLightbox={onOpenImageLightbox}
                />
            </div>
        </>
    );
};
