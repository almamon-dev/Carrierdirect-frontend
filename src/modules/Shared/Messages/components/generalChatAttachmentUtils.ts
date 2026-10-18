import React from 'react';
import { MessageAttachment } from '@/services/messageService';
import { getAttachmentUrl } from '@/modules/Customer/QuoteManagement/Negotiation/Chat/utils/customerChatUtils';

export const isImageAttachment = (att: MessageAttachment | any): boolean => {
    if (!att) return false;
    if (att.type === 'image') return true;
    if (typeof att.mime_type === 'string' && att.mime_type.startsWith('image/')) return true;
    if (typeof att.mime === 'string' && att.mime.startsWith('image/')) return true;
    const name = String(att.name || att.file_name || att.filename || '').trim();
    if (/\.(jpg|jpeg|png|webp|gif|svg|bmp|avif)($|\?)/i.test(name)) return true;
    const url = String(att.url || att.path || '').trim();
    if (url.startsWith('data:image/') || url.startsWith('blob:')) return true;
    if (/\.(jpg|jpeg|png|webp|gif|svg|bmp|avif)($|\?)/i.test(url)) return true;
    return false;
};

export const normalizeAttachment = (att: any): MessageAttachment => {
    if (!att) return { name: 'Attachment', url: '', size: '', type: 'file' };

    if (typeof att === 'string') {
        const url = getAttachmentUrl(att);
        const cleanName = att.split('/').pop()?.split('?')[0] || 'Attachment';
        const isImg = isImageAttachment({ name: cleanName, url });
        return {
            name: cleanName,
            url,
            size: '',
            type: isImg ? 'image' : 'file',
        };
    }

    const rawUrl = att.original_url || att.full_url || att.url || att.file_url || att.download_url || att.path || att.file_path || att.src || att.image_url || att.photo_url || '';
    const url = getAttachmentUrl(rawUrl);
    const cleanName = att.file_name || att.name || att.original_name || att.filename || att.title || (rawUrl ? rawUrl.split('/').pop()?.split('?')[0] : 'Attachment');
    const isImg = isImageAttachment({ ...att, name: cleanName, url });

    return {
        name: String(cleanName || 'Attachment'),
        url: String(url || ''),
        size: att.size || att.file_size || (att.size_bytes ? `${Math.round(att.size_bytes / 1024)} KB` : ''),
        type: isImg ? 'image' : 'file',
    };
};

export const jumpToMessageTarget = (
    e: React.MouseEvent,
    targetId?: number | string | null,
    snippet?: string | null
) => {
    e.stopPropagation();
    let targetEl: HTMLElement | null = targetId ? document.getElementById(`msg-${targetId}`) : null;

    if (!targetEl && snippet) {
        const cleanSnippet = snippet.trim().toLowerCase();
        const allMsgElements = document.querySelectorAll('[data-msg-text]');
        for (const el of Array.from(allMsgElements)) {
            const t = (el.getAttribute('data-msg-text') || '').trim().toLowerCase();
            if (t && (t.includes(cleanSnippet) || cleanSnippet.includes(t.slice(0, 30)))) {
                targetEl = el as HTMLElement;
                break;
            }
        }
    }

    if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        targetEl.classList.remove('highlight-pulse-message');
        void targetEl.offsetWidth;
        targetEl.classList.add('highlight-pulse-message');
        setTimeout(() => targetEl?.classList.remove('highlight-pulse-message'), 1800);
    }
};
