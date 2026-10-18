import React from 'react';
import { Download } from 'lucide-react';
import { MessageAttachment } from '@/services/messageService';
import { getAttachmentUrl } from '@/modules/Customer/QuoteManagement/Negotiation/Chat/utils/customerChatUtils';

interface GeneralChatBubbleAttachmentsProps {
    imageAttachments: MessageAttachment[];
    nonImageAttachments: MessageAttachment[];
    hasText: boolean;
    isSent: boolean;
    onOpenImageLightbox?: (images: MessageAttachment[], index: number) => void;
}

export const GeneralChatBubbleAttachments: React.FC<GeneralChatBubbleAttachmentsProps> = ({
    imageAttachments,
    nonImageAttachments,
    hasText,
    isSent,
    onOpenImageLightbox,
}) => {
    return (
        <>
            {/* Image Attachments */}
            {imageAttachments.length > 0 && (
                <div className={`${hasText || nonImageAttachments.length > 0 ? 'mb-1.5' : ''}`}>
                    {imageAttachments.length === 1 ? (
                        <div
                            onClick={() => onOpenImageLightbox?.(imageAttachments, 0)}
                            className="rounded-[4px] overflow-hidden inline-block shadow-xs hover:opacity-95 transition-opacity max-w-[240px] sm:max-w-[280px] cursor-pointer"
                        >
                            <img
                                src={imageAttachments[0].url}
                                alt={imageAttachments[0].name || 'Photo'}
                                className="w-auto h-auto max-w-[240px] sm:max-w-[280px] max-h-[280px] object-cover rounded-[4px] block"
                                loading="eager"
                            />
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-1 rounded-[4px] overflow-hidden max-w-[260px] sm:max-w-[300px] shadow-xs bg-slate-100 dark:bg-slate-800 p-1">
                            {imageAttachments.slice(0, 4).map((att, idx) => {
                                const isFourthAndMore = idx === 3 && imageAttachments.length > 4;
                                const remainingCount = imageAttachments.length - 3;

                                return (
                                    <div
                                        key={idx}
                                        onClick={() => onOpenImageLightbox?.(imageAttachments, idx)}
                                        className="relative aspect-square overflow-hidden bg-slate-200 dark:bg-slate-700 rounded-[4px] cursor-pointer group"
                                    >
                                        <img
                                            src={att.url}
                                            alt={att.name || 'Photo'}
                                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                            loading="eager"
                                        />
                                        {isFourthAndMore && (
                                            <div className="absolute inset-0 bg-black/65 backdrop-blur-[1px] flex flex-col items-center justify-center text-white font-bold text-lg group-hover:bg-black/75 transition-colors z-10">
                                                <span>+{remainingCount}</span>
                                                <span className="text-[10px] font-normal text-slate-200">more</span>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}

            {/* Non-Image Attachments */}
            {nonImageAttachments.length > 0 && (
                <div className={`flex flex-col gap-1.5 ${hasText ? 'mb-1.5' : ''}`}>
                    {nonImageAttachments.map((att, idx) => {
                        const isPdf = att.name.toLowerCase().endsWith('.pdf');
                        const isDoc = att.name.toLowerCase().endsWith('.doc') || att.name.toLowerCase().endsWith('.docx');
                        const isXls = att.name.toLowerCase().endsWith('.xls') || att.name.toLowerCase().endsWith('.xlsx');
                        const badgeColor = isPdf ? 'bg-[#EF4444]' : isXls ? 'bg-[#10B981]' : isDoc ? 'bg-[#2563EB]' : 'bg-[#F97316]';
                        const badgeText = isPdf ? 'PDF' : isXls ? 'XLS' : isDoc ? 'DOC' : 'File';
                        const downloadUrl = att.url || getAttachmentUrl(att.name);

                        return (
                            <a
                                key={idx}
                                href={downloadUrl || '#'}
                                target="_blank"
                                rel="noreferrer"
                                className={`flex items-center gap-3 p-2 rounded-[4px] border transition-all hover:scale-[1.01] max-w-[280px] sm:max-w-[320px] ${
                                    isSent
                                        ? 'bg-[#d9fdd3] dark:bg-[#005c4b] border-emerald-200/70 dark:border-emerald-700/40 text-slate-900 dark:text-slate-100'
                                        : 'bg-white dark:bg-[#202c33] border-slate-200/80 dark:border-slate-700/80 text-slate-900 dark:text-slate-100'
                                }`}
                            >
                                <div className={`w-7 h-7 ${badgeColor} rounded-[4px] flex items-center justify-center text-white font-semibold text-[10px] shrink-0 shadow-2xs`}>
                                    {badgeText}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-semibold truncate leading-tight">{att.name}</p>
                                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{att.size || 'Attachment'}</p>
                                </div>
                                <Download size={13} className="text-slate-400 shrink-0" />
                            </a>
                        );
                    })}
                </div>
            )}
        </>
    );
};
