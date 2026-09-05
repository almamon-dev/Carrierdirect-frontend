import React from 'react';
import { Download, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { getAttachmentUrl } from '@/modules/Customer/QuoteManagement/Negotiation/Chat/utils/customerChatUtils';
import { AttachmentItem } from '../index';

interface MediaLightboxModalProps {
    lightboxIndex: number | null;
    mediaItems: AttachmentItem[];
    setLightboxIndex: React.Dispatch<React.SetStateAction<number | null>>;
}

export const MediaLightboxModal: React.FC<MediaLightboxModalProps> = ({
    lightboxIndex,
    mediaItems,
    setLightboxIndex,
}) => {
    if (lightboxIndex === null || !mediaItems[lightboxIndex]) return null;

    const currentItem = mediaItems[lightboxIndex];
    const targetUrl = getAttachmentUrl(currentItem.url);

    return (
        <div
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4 select-none animate-in fade-in duration-200"
            onClick={() => setLightboxIndex(null)}
        >
            <div className="absolute top-4 inset-x-4 flex items-center justify-between text-white z-10" onClick={e => e.stopPropagation()}>
                <div className="text-xs font-semibold text-white/80">
                    {lightboxIndex + 1} / {mediaItems.length}
                </div>
                <div className="flex items-center gap-2">
                    {currentItem.url && (
                        <a
                            href={targetUrl}
                            download={currentItem.name}
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

            <div className="relative max-w-4xl max-h-[80vh] flex flex-col items-center" onClick={e => e.stopPropagation()}>
                <img
                    src={targetUrl}
                    alt={currentItem.name}
                    className="max-w-full max-h-[75vh] object-contain rounded-xl shadow-2xl"
                />
                <div className="mt-3 text-white/90 text-xs font-medium truncate max-w-md text-center">
                    {currentItem.name}
                </div>
            </div>

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
    );
};
