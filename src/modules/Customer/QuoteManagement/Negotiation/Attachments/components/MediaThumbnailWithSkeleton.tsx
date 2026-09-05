import React, { useState, useEffect } from 'react';
import { Image as ImageIcon } from 'lucide-react';

interface MediaThumbnailWithSkeletonProps {
    targetUrl: string;
    altName: string;
    isLastSlot?: boolean;
    hiddenMediaCount?: number;
    onClick: () => void;
}

export const MediaThumbnailWithSkeleton: React.FC<MediaThumbnailWithSkeletonProps> = ({
    targetUrl,
    altName,
    isLastSlot,
    hiddenMediaCount,
    onClick,
}) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        if (!targetUrl) return;
        const img = new window.Image();
        img.src = targetUrl;
        if (img.complete) setIsLoaded(true);
    }, [targetUrl]);

    return (
        <div
            onClick={onClick}
            className="relative aspect-square rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 border border-black/5 dark:border-white/10 cursor-pointer group hover:opacity-95 transition-opacity flex items-center justify-center select-none"
        >
            {!isLoaded && !hasError && (
                <div className="absolute inset-0 bg-slate-200 dark:bg-slate-700/80 animate-pulse flex items-center justify-center z-0">
                    <div className="w-4 h-4 rounded-full border-2 border-slate-300 dark:border-slate-500 border-t-[#FF4A1F] animate-spin opacity-70" />
                </div>
            )}

            {targetUrl && !hasError ? (
                <img
                    src={targetUrl}
                    alt={altName}
                    onLoad={() => setIsLoaded(true)}
                    onError={() => {
                        setHasError(true);
                        setIsLoaded(true);
                    }}
                    className={`w-full h-full object-cover transition-all duration-200 group-hover:scale-105 ${
                        isLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
                    loading="eager"
                    decoding="async"
                />
            ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-400 p-1 text-center">
                    <ImageIcon size={18} className="opacity-50 mb-0.5" />
                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Image</span>
                </div>
            )}

            {isLastSlot && (
                <div className="absolute inset-0 bg-black/70 backdrop-blur-[1px] flex flex-col items-center justify-center text-white font-extrabold group-hover:bg-black/80 transition-colors z-10">
                    <span className="text-sm sm:text-base leading-none">+{hiddenMediaCount}</span>
                    <span className="text-[9px] font-semibold text-slate-200 uppercase tracking-wider mt-0.5">more</span>
                </div>
            )}
        </div>
    );
};
