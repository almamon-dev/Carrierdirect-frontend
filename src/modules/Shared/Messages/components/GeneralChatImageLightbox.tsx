import React from 'react';
import { X, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import Button from '@/components/ui/button';
import { MessageAttachment } from '@/services/messageService';

interface GeneralChatImageLightboxProps {
    images: MessageAttachment[];
    currentIndex: number;
    onClose: () => void;
    onNext: () => void;
    onPrev: () => void;
}

export const GeneralChatImageLightbox: React.FC<GeneralChatImageLightboxProps> = ({
    images,
    currentIndex,
    onClose,
    onNext,
    onPrev
}) => {
    if (!images || images.length === 0 || currentIndex === null || currentIndex < 0) {
        return null;
    }

    const currentImg = images[currentIndex];

    return (
        <div className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
            {/* Top Bar Controls */}
            <div className="absolute top-4 inset-x-4 flex items-center justify-between z-10">
                <div className="text-white text-xs font-semibold px-3 py-1 bg-white/10 rounded-full backdrop-blur-sm">
                    {currentIndex + 1} / {images.length} — {currentImg?.name || 'Image'}
                </div>
                <div className="flex items-center gap-2">
                    {currentImg?.url && (
                        <a
                            href={currentImg.url}
                            download={currentImg.name || 'image'}
                            target="_blank"
                            rel="noreferrer"
                            className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                            title="Download image"
                        >
                            <Download size={18} />
                        </a>
                    )}
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer"
                        title="Close preview"
                    >
                        <X size={18} />
                    </button>
                </div>
            </div>

            {/* Previous Button */}
            {images.length > 1 && (
                <button
                    type="button"
                    onClick={onPrev}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer z-10"
                >
                    <ChevronLeft size={24} />
                </button>
            )}

            {/* Image display */}
            <div className="max-w-4xl max-h-[85vh] flex items-center justify-center p-2">
                <img
                    src={currentImg?.url}
                    alt={currentImg?.name || 'Preview'}
                    className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
                />
            </div>

            {/* Next Button */}
            {images.length > 1 && (
                <button
                    type="button"
                    onClick={onNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer z-10"
                >
                    <ChevronRight size={24} />
                </button>
            )}
        </div>
    );
};

export default GeneralChatImageLightbox;
