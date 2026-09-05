import React from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { getAttachmentUrl } from '@/modules/Customer/QuoteManagement/Negotiation/Chat/utils/customerChatUtils';

interface ChatImageLightboxProps {
    lightboxIndex: number | null;
    imageAttachments: any[];
    onClose: () => void;
    onPrev: () => void;
    onNext: () => void;
}

export const ChatImageLightbox: React.FC<ChatImageLightboxProps> = ({
    lightboxIndex,
    imageAttachments,
    onClose,
    onPrev,
    onNext,
}) => {
    if (lightboxIndex === null || !imageAttachments[lightboxIndex]) return null;

    const currentImg = imageAttachments[lightboxIndex];
    const imgSrc = getAttachmentUrl(currentImg.url || currentImg.path || currentImg.name);

    return (
        <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
            onClick={onClose}
        >
            <button
                type="button"
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
            >
                <X size={20} />
            </button>

            {imageAttachments.length > 1 && (
                <>
                    <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); onPrev(); }}
                        className="absolute left-4 p-2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); onNext(); }}
                        className="absolute right-4 p-2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
                    >
                        <ChevronRight size={24} />
                    </button>
                </>
            )}

            <div className="max-w-4xl max-h-[85vh] flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
                <img
                    src={imgSrc}
                    alt={currentImg.name || 'Image attachment'}
                    className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
                />
                <div className="text-white/80 text-xs font-semibold mt-2">
                    {currentImg.name} ({lightboxIndex + 1} of {imageAttachments.length})
                </div>
            </div>
        </div>
    );
};
