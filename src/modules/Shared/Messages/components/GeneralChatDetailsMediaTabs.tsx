import React from 'react';
import {
    Image as ImageIcon,
    FileText,
    FileSpreadsheet,
    FileArchive,
    ExternalLink,
    Download,
} from 'lucide-react';
import { MessageAttachment } from '@/services/messageService';

interface GeneralChatDetailsMediaTabsProps {
    activeTab: 'photos' | 'docs';
    imageAttachments: MessageAttachment[];
    docAttachments: MessageAttachment[];
    onOpenImageLightbox?: (images: any[], index: number) => void;
}

export const getFileIcon = (fileName: string, type?: string) => {
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

export const GeneralChatDetailsMediaTabs: React.FC<GeneralChatDetailsMediaTabsProps> = ({
    activeTab,
    imageAttachments,
    docAttachments,
    onOpenImageLightbox,
}) => {
    if (activeTab === 'photos') {
        return (
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
        );
    }

    if (activeTab === 'docs') {
        return (
            <div className="space-y-3 animate-in fade-in duration-150">
                <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-800">
                    <h4 className="text-[12px] font-bold text-slate-900 dark:text-slate-100">
                        Documents &amp; Files ({docAttachments.length})
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
        );
    }

    return null;
};
