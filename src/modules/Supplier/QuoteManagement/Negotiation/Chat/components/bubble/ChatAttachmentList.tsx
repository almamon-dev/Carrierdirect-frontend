import React from 'react';
import { Download, FileText } from 'lucide-react';
import { getAttachmentUrl } from '@/modules/Customer/QuoteManagement/Negotiation/Chat/utils/customerChatUtils';

interface ChatAttachmentListProps {
    attachments?: any[];
    isSent: boolean;
    onImageClick: (index: number) => void;
}

export const ChatAttachmentList: React.FC<ChatAttachmentListProps> = ({
    attachments,
    isSent,
    onImageClick,
}) => {
    if (!attachments || attachments.length === 0) return null;

    const images = attachments.filter(att => att.type === 'image' || /\.(jpe?g|png|webp|gif|svg)$/i.test(att.name || att.url || ''));
    const files = attachments.filter(att => att.type !== 'image' && !/\.(jpe?g|png|webp|gif|svg)$/i.test(att.name || att.url || ''));

    return (
        <div className="space-y-2 mt-2">
            {images.length > 0 && (
                <div className={`grid gap-1.5 ${images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                    {images.map((img, i) => {
                        const url = getAttachmentUrl(img.url || img.path || img.name);
                        return (
                            <div
                                key={i}
                                onClick={() => onImageClick(i)}
                                className="relative rounded-lg overflow-hidden border border-black/10 dark:border-white/10 cursor-pointer group/img max-h-48 bg-slate-100 dark:bg-slate-800 flex items-center justify-center"
                            >
                                <img src={url} alt={img.name} className="w-full h-full object-cover group-hover/img:scale-105 transition-transform" />
                            </div>
                        );
                    })}
                </div>
            )}

            {files.length > 0 && (
                <div className="space-y-1.5">
                    {files.map((file, i) => {
                        const url = getAttachmentUrl(file.url || file.path || file.name);
                        return (
                            <a
                                key={i}
                                href={url}
                                target="_blank"
                                rel="noreferrer"
                                download
                                onClick={(e) => e.stopPropagation()}
                                className={`flex items-center gap-2.5 p-2 rounded-lg border text-xs transition-colors ${
                                    isSent
                                        ? 'bg-white/10 hover:bg-white/20 border-white/20 text-white'
                                        : 'bg-white hover:bg-slate-50 border-slate-200 dark:bg-slate-800 dark:border-slate-700 text-slate-800 dark:text-slate-100'
                                }`}
                            >
                                <div className="p-1.5 bg-[#FF4A1F]/10 text-[#FF4A1F] rounded"><FileText size={16} /></div>
                                <div className="min-w-0 flex-1">
                                    <div className="font-semibold truncate">{file.name}</div>
                                    {file.size && <div className="text-[10px] opacity-75">{file.size}</div>}
                                </div>
                                <Download size={14} className="opacity-70 group-hover:opacity-100 shrink-0" />
                            </a>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
