import React, { useState, useEffect } from 'react';
import { FolderOpen } from 'lucide-react';
import { getAttachmentUrl } from '@/modules/Customer/QuoteManagement/Negotiation/Chat/utils/customerChatUtils';
import { MediaThumbnailWithSkeleton } from './components/MediaThumbnailWithSkeleton';
import { MediaLightboxModal } from './components/MediaLightboxModal';
import { DocumentsList } from './components/DocumentsList';

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

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (lightboxIndex === null) return;
            if (e.key === 'Escape') setLightboxIndex(null);
            if (e.key === 'ArrowLeft') setLightboxIndex(prev => (prev !== null && prev > 0 ? prev - 1 : mediaItems.length - 1));
            if (e.key === 'ArrowRight') setLightboxIndex(prev => (prev !== null && prev < mediaItems.length - 1 ? prev + 1 : 0));
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [lightboxIndex, mediaItems.length]);

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

    return (
        <div className="space-y-3 mt-1">
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
                            const targetUrl = getAttachmentUrl(item.url || (item as any).file_url || (item as any).path || item.name);

                            return (
                                <MediaThumbnailWithSkeleton
                                    key={idx}
                                    targetUrl={targetUrl}
                                    altName={item.name || 'Photo'}
                                    isLastSlot={isLastSlot}
                                    hiddenMediaCount={hiddenMediaCount}
                                    onClick={() => setLightboxIndex(idx)}
                                />
                            );
                        })}
                    </div>
                </div>
            )}

            <DocumentsList
                docItems={docItems}
                mediaItemsCount={mediaItems.length}
                showAllDocs={showAllDocs}
                setShowAllDocs={setShowAllDocs}
                initialDocsLimit={INITIAL_DOCS_LIMIT}
            />

            <MediaLightboxModal
                lightboxIndex={lightboxIndex}
                mediaItems={mediaItems}
                setLightboxIndex={setLightboxIndex}
            />
        </div>
    );
}
