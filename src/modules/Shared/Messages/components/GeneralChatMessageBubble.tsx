import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { ConversationUser, GeneralMessage, MessageAttachment } from '@/services/messageService';
import { parseRawAttachments } from '@/hooks/useGeneralMessages';
import { DeleteMessageModal } from './DeleteMessageModal';
import { GeneralChatPartnerAvatar } from './GeneralChatPartnerAvatar';
import { GeneralChatBubbleAttachments } from './GeneralChatBubbleAttachments';
import { GeneralChatBubbleActionToolbar } from './GeneralChatBubbleActionToolbar';
import { GeneralChatBubbleText } from './GeneralChatBubbleText';
import { GeneralChatBubbleTimeStatus } from './GeneralChatBubbleTimeStatus';
import {
    isImageAttachment,
    normalizeAttachment,
    jumpToMessageTarget,
} from './generalChatAttachmentUtils';

export { isImageAttachment, normalizeAttachment };

export interface GeneralChatMessageBubbleProps {
    msg: GeneralMessage;
    partner?: ConversationUser | null;
    isFirstInGroup?: boolean;
    isLastInGroup?: boolean;
    onStartEdit?: (msg: GeneralMessage) => void;
    onDelete?: (id: number, type?: 'everyone' | 'for_me') => Promise<any> | void;
    onOpenImageLightbox?: (images: MessageAttachment[], index: number) => void;
    onReply?: (msg: GeneralMessage) => void;
    onToggleReaction?: (id: number | string, emoji: string) => void;
    onTogglePin?: (id: number | string) => void;
}

export const GeneralChatMessageBubble: React.FC<GeneralChatMessageBubbleProps> = ({
    msg,
    partner,
    isFirstInGroup = true,
    isLastInGroup = true,
    onStartEdit,
    onDelete,
    onOpenImageLightbox,
    onReply,
    onTogglePin,
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [menuPlacement, setMenuPlacement] = useState<'top' | 'bottom'>('top');
    const [localPinned, setLocalPinned] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const isSent = msg.is_me;
    const rawText = msg.message || (msg as any).body || (msg as any).content || (msg as any).text || '';
    const isLongText = Boolean(rawText && rawText.length > 280);
    const displayedText = (() => {
        if (!isLongText || isExpanded) return rawText;
        const sub = rawText.slice(0, 220);
        const lastSpace = sub.lastIndexOf(' ');
        const cleanSub = lastSpace > 160 ? sub.slice(0, lastSpace) : sub;
        return `${cleanSub.trim()}...`;
    })();

    const rawAttachments: any[] = parseRawAttachments(msg);
    const allAttachments: MessageAttachment[] = rawAttachments.map(normalizeAttachment);
    const imageAttachments = allAttachments.filter(isImageAttachment);
    const nonImageAttachments = allAttachments.filter((att) => !isImageAttachment(att));
    const isOnlyImage = rawAttachments.length > 0 && rawAttachments[0] === rawText;
    const hasText = Boolean(rawText.trim()) && !isOnlyImage;
    const partnerDisplayName = partner?.company_name || partner?.name || 'User';
    const isPinned = Boolean(msg.is_pinned || (msg as any).is_pinned || localPinned);

    useLayoutEffect(() => {
        if (isMenuOpen && menuRef.current) {
            const rect = menuRef.current.getBoundingClientRect();
            const scrollContainer = menuRef.current.closest('.overflow-y-auto');
            const containerTop = scrollContainer ? scrollContainer.getBoundingClientRect().top : 0;
            setMenuPlacement(rect.top - containerTop < 190 ? 'bottom' : 'top');
        }
    }, [isMenuOpen]);

    useEffect(() => {
        if (!isMenuOpen) return;
        const handleClick = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [isMenuOpen]);

    const handleConfirmDelete = async (type: 'everyone' | 'for_me') => {
        if (!onDelete) return;
        try {
            setIsDeleting(true);
            await onDelete(msg.id, type);
            setIsDeleteModalOpen(false);
        } catch (err) {
            console.error('Delete message error:', err);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div
            id={`msg-${msg.id}`}
            data-msg-text={rawText}
            className={`flex items-end gap-1.5 group select-text transition-colors duration-200 ${
                isSent ? 'justify-end' : 'justify-start'
            } ${isFirstInGroup ? 'mt-2' : 'mt-0.5'} ${isLastInGroup ? 'mb-2' : 'mb-0.5'}`}
        >
            {!isSent && isLastInGroup && <GeneralChatPartnerAvatar partner={partner} />}
            {!isSent && !isLastInGroup && <div className="w-7 shrink-0" />}

            {isSent && (
                <GeneralChatBubbleActionToolbar
                    isSent={isSent}
                    isMenuOpen={isMenuOpen}
                    setIsMenuOpen={setIsMenuOpen}
                    menuPlacement={menuPlacement}
                    menuRef={menuRef}
                    hasText={hasText}
                    isPinned={isPinned}
                    onDelete={onDelete ? () => { setIsMenuOpen(false); setIsDeleteModalOpen(true); } : undefined}
                    onStartEdit={onStartEdit ? () => { setIsMenuOpen(false); onStartEdit(msg); } : undefined}
                    onTogglePin={() => { onTogglePin ? onTogglePin(msg.id) : setLocalPinned((p) => !p); setIsMenuOpen(false); }}
                    onReply={onReply ? () => { setIsMenuOpen(false); onReply(msg); } : undefined}
                />
            )}

            <div className={`flex flex-col max-w-[82%] sm:max-w-[70%] md:max-w-[65%] ${isSent ? 'items-end' : 'items-start'}`}>
                <GeneralChatBubbleAttachments
                    imageAttachments={imageAttachments}
                    nonImageAttachments={nonImageAttachments}
                    hasText={hasText}
                    isSent={isSent}
                    onOpenImageLightbox={onOpenImageLightbox}
                />

                {hasText && (
                    <GeneralChatBubbleText
                        msg={msg}
                        isSent={isSent}
                        partnerDisplayName={partnerDisplayName}
                        displayedText={displayedText}
                        isLongText={isLongText}
                        isExpanded={isExpanded}
                        setIsExpanded={setIsExpanded}
                        isPinned={isPinned}
                        borderRadiusClasses="rounded-[4px]"
                        onJumpToTarget={jumpToMessageTarget}
                    />
                )}

                {!hasText && (
                    <GeneralChatBubbleTimeStatus msg={msg} isSent={isSent} isPinned={isPinned} />
                )}
            </div>

            {!isSent && (
                <GeneralChatBubbleActionToolbar
                    isSent={isSent}
                    isMenuOpen={isMenuOpen}
                    setIsMenuOpen={setIsMenuOpen}
                    menuPlacement={menuPlacement}
                    menuRef={menuRef}
                    hasText={hasText}
                    isPinned={isPinned}
                    onDelete={onDelete ? () => { setIsMenuOpen(false); setIsDeleteModalOpen(true); } : undefined}
                    onStartEdit={undefined}
                    onTogglePin={() => { onTogglePin ? onTogglePin(msg.id) : setLocalPinned((p) => !p); setIsMenuOpen(false); }}
                    onReply={onReply ? () => { setIsMenuOpen(false); onReply(msg); } : undefined}
                />
            )}

            <DeleteMessageModal
                isOpen={isDeleteModalOpen}
                onClose={() => !isDeleting && setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                isSent={isSent}
                isLoading={isDeleting}
            />
        </div>
    );
};

export default GeneralChatMessageBubble;
