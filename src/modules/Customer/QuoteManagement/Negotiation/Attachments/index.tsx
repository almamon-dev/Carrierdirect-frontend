import React, { useState, useEffect } from 'react';
import { FileText, FolderOpen, Download, X, ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';
import { getAttachmentUrl } from '@/modules/Customer/QuoteManagement/Negotiation/Chat/utils/customerChatUtils';

export interface AttachmentItem {
    name: string;
    size: string;
    type?: string;
    url?: string;
}

const MAX_MEDIA_THUMBNAILS = 6;
const INITIAL_DOCS_LIMIT = 3;

export default function AttachmentsList({ items = [] }: { items?: AttachmentItem[] }) {
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
    const [showAllDocs, setShowAllDocs] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (lightboxIndex === null) return;
            if (e.key === 'Escape') setLightboxIndex(null);
            if (e.key === 'ArrowLeft') setLightboxIndex(prev => (prev !== null && prev > 0 ? prev - 1 : mediaItems.length - 1));
            if (e.key === 'ArrowRight') setLightboxIndex(prev => (prev !== null && prev < mediaItems.length - 1 ? prev + 1 : 0));
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [lightboxIndex]);

    if (!items || items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-7 px-4 text-center bg-slate-50/70 rounded-xl border border-dashed border-slate-200 my-1">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-2">
                    <FolderOpen size={20} className="stroke-[1.5]" />
                </div>
                <p className="text-xs font-bold text-slate-700">No media or documents</p>
                <p className="text-[11px] text-slate-400 mt-1 max-w-[210px] leading-relaxed">
                    No files or media have been uploaded for this negotiation yet.
                </p>
            </div>
        );
    }

    const isImageOrMedia = (item: AttachmentItem) => {
        const name = (item.name || '').toLowerCase();
        return (
            name.endsWith('.jpg') ||
            name.endsWith('.jpeg') ||
            name.endsWith('.png') ||
            name.endsWith('.webp') ||
            name.endsWith('.svg') ||
            name.endsWith('.gif') ||
            name.endsWith('.mp4') ||
            name.endsWith('.mov') ||
            item.type === 'image' ||
            item.type === 'video'
        );
    };

    const mediaItems = items.filter(isImageOrMedia);
    const docItems = items.filter(item => !isImageOrMedia(item));

    const displayedMedia = mediaItems.slice(0, MAX_MEDIA_THUMBNAILS);
    const hiddenMediaCount = mediaItems.length - (MAX_MEDIA_THUMBNAILS - 1);

    const displayedDocs = showAllDocs ? docItems : docItems.slice(0, INITIAL_DOCS_LIMIT);
    const hiddenDocsCount = docItems.length - INITIAL_DOCS_LIMIT;

    const getDocBadge = (name: string) => {
        const lower = name.toLowerCase();
        if (lower.endsWith('.pdf')) return { text: 'PDF', bg: 'bg-rose-500', light: 'bg-rose-50 text-rose-500' };
        if (lower.endsWith('.xls') || lower.endsWith('.xlsx') || lower.endsWith('.csv')) return { text: 'XLS', bg: 'bg-emerald-500', light: 'bg-emerald-50 text-emerald-600' };
        if (lower.endsWith('.doc') || lower.endsWith('.docx')) return { text: 'DOC', bg: 'bg-blue-500', light: 'bg-blue-50 text-blue-600' };
        if (lower.endsWith('.zip') || lower.endsWith('.rar')) return { text: 'ZIP', bg: 'bg-amber-500', light: 'bg-amber-50 text-amber-600' };
        return { text: 'FILE', bg: 'bg-slate-500', light: 'bg-slate-100 text-slate-600' };
    };

    return (
        <div className="space-y-3 mt-1">
            {/* WhatsApp Style Photos / Media Grid */}
            {mediaItems.length > 0 && (
                <div>
                    <div className="flex items-center justify-between mb-1.5 px-0.5">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                            Photos & Media ({mediaItems.length})
                        </span>
                        {mediaItems.length > MAX_MEDIA_THUMBNAILS && (
                            <button
                                type="button"
                                onClick={() => setLightboxIndex(0)}
                                className="text-[11px] font-semibold text-[#FF4A1F] hover:underline cursor-pointer"
                            >
                                View all
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-3 gap-1.5 rounded-xl overflow-hidden">
                        {displayedMedia.map((item, idx) => {
                            const isLastSlot = idx === MAX_MEDIA_THUMBNAILS - 1 && mediaItems.length > MAX_MEDIA_THUMBNAILS;
                            const targetUrl = getAttachmentUrl(item.url);

                            return (
                                <div
                                    key={idx}
                                    onClick={() => setLightboxIndex(idx)}
                                    className="relative aspect-square rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 border border-black/5 dark:border-white/10 cursor-pointer group hover:opacity-95 transition-opacity"
                                >
                                    <img
                                        src={targetUrl}
                                        alt={item.name}
                                        className="w-full h-full object-contain p-1 transition-transform group-hover:scale-105"
                                        loading="lazy"
                                    />
                                    {isLastSlot && (
                                        <div className="absolute inset-0 bg-black/70 backdrop-blur-[1px] flex flex-col items-center justify-center text-white font-extrabold group-hover:bg-black/80 transition-colors">
                                            <span className="text-sm sm:text-base leading-none">+{hiddenMediaCount}</span>
                                            <span className="text-[9px] font-semibold text-slate-200 uppercase tracking-wider mt-0.5">more</span>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Documents List */}
            {docItems.length > 0 && (
                <div>
                    {mediaItems.length > 0 && (
                        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 px-0.5 pt-1">
                            Documents ({docItems.length})
                        </div>
                    )}
                    <div className="space-y-1.5">
                        {displayedDocs.map((item, idx) => {
                            const badge = getDocBadge(item.name);
                            return (
                                <div
                                    key={idx}
                                    className="flex items-center justify-between p-2 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors group border border-slate-100"
                                >
                                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                        <div className={`w-7 h-8 ${badge.light} rounded flex items-center justify-center font-black text-[9px] uppercase shrink-0`}>
                                            <FileText size={15} />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-xs font-semibold text-slate-800 truncate group-hover:text-[#FF4A1F] transition-colors" title={item.name}>
                                                {item.name}
                                            </p>
                                            <p className="text-[10.5px] text-slate-400 mt-0.5">{item.size || 'Document'}</p>
                                        </div>
                                    </div>
                                    {item.url && (
                                        <a
                                            href={getAttachmentUrl(item.url)}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="p-1 text-slate-400 hover:text-[#FF4A1F] transition-colors shrink-0 ml-1"
                                            title="Download"
                                        >
                                            <Download size={14} />
                                        </a>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {docItems.length > INITIAL_DOCS_LIMIT && (
                        <button
                            type="button"
                            onClick={() => setShowAllDocs(!showAllDocs)}
                            className="w-full py-1.5 mt-1.5 flex items-center justify-center gap-1 text-[11px] font-semibold text-slate-600 hover:text-[#FF4A1F] transition-colors cursor-pointer select-none"
                        >
                            {showAllDocs ? (
                                <>
                                    <span>Show less documents</span>
                                    <ChevronUp size={13} />
                                </>
                            ) : (
                                <>
                                    <span>+{hiddenDocsCount} more documents</span>
                                    <ChevronDown size={13} />
                                </>
                            )}
                        </button>
                    )}
                </div>
            )}

            {/* Lightbox Gallery Modal for Media Grid */}
            {lightboxIndex !== null && mediaItems[lightboxIndex] && (
                <div
                    className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4 select-none animate-in fade-in duration-200"
                    onClick={() => setLightboxIndex(null)}
                >
                    {/* Top Bar with Counter & Close */}
                    <div className="absolute top-4 inset-x-4 flex items-center justify-between text-white z-10" onClick={e => e.stopPropagation()}>
                        <div className="text-xs font-semibold text-white/80">
                            {lightboxIndex + 1} / {mediaItems.length}
                        </div>
                        <div className="flex items-center gap-2">
                            {mediaItems[lightboxIndex].url && (
                                <a
                                    href={getAttachmentUrl(mediaItems[lightboxIndex].url)}
                                    download={mediaItems[lightboxIndex].name}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="p-2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
                                    title="Download image"
                                >
                                    <Download size={18} />
                                </a>
                            )}
                            <button
                                type="button"
                                onClick={() => setLightboxIndex(null)}
                                className="p-2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
                                title="Close (Esc)"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Main Image View */}
                    <div className="relative max-w-4xl max-h-[80vh] flex flex-col items-center" onClick={e => e.stopPropagation()}>
                        <img
                            src={getAttachmentUrl(mediaItems[lightboxIndex].url)}
                            alt={mediaItems[lightboxIndex].name}
                            className="max-w-full max-h-[75vh] object-contain rounded-xl shadow-2xl"
                        />
                        <div className="mt-3 text-white/90 text-xs font-medium truncate max-w-md text-center">
                            {mediaItems[lightboxIndex].name}
                        </div>
                    </div>

                    {/* Left / Right Navigation */}
                    {mediaItems.length > 1 && (
                        <>
                            <button
                                type="button"
                                onClick={e => {
                                    e.stopPropagation();
                                    setLightboxIndex(prev => (prev !== null && prev > 0 ? prev - 1 : mediaItems.length - 1));
                                }}
                                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
                                title="Previous image"
                            >
                                <ChevronLeft size={24} />
                            </button>
                            <button
                                type="button"
                                onClick={e => {
                                    e.stopPropagation();
                                    setLightboxIndex(prev => (prev !== null && prev < mediaItems.length - 1 ? prev + 1 : 0));
                                }}
                                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
                                title="Next image"
                            >
                                <ChevronRight size={24} />
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
