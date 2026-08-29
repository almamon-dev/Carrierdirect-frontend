import React, { useState, useEffect } from 'react';
import { getAttachmentUrl } from '../utils/customerChatUtils';
import { Loader2, Image as ImageIcon } from 'lucide-react';

interface ChatImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    src?: string;
    alt?: string;
    className?: string;
}

export const ChatImage: React.FC<ChatImageProps> = ({ src, alt, className, ...props }) => {
    const targetUrl = getAttachmentUrl(src);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isError, setIsError] = useState<boolean>(false);

    useEffect(() => {
        setIsLoading(true);
        setIsError(false);
    }, [src]);

    if (!targetUrl || isError) {
        return (
            <div className="inline-flex flex-col items-center justify-center p-4 bg-black/5 dark:bg-black/20 rounded-2xl border border-black/5 dark:border-white/10 text-slate-400 gap-1.5 min-w-[120px]">
                <ImageIcon size={20} />
                <span className="text-[10px] font-medium truncate max-w-[140px]">{alt || 'Image'}</span>
            </div>
        );
    }

    return (
        <div className="relative inline-flex items-center justify-center overflow-hidden rounded-2xl bg-black/5 dark:bg-black/20 border border-black/5 dark:border-white/10 max-w-full">
            {isLoading && (
                <div className="w-[160px] h-[120px] flex items-center justify-center bg-slate-100/60 dark:bg-slate-800/60">
                    <Loader2 size={18} className="animate-spin text-slate-400" />
                </div>
            )}
            <img
                {...props}
                src={targetUrl}
                alt={alt || 'attachment'}
                className={`${className || ''} ${isLoading ? 'hidden' : 'block'}`}
                onLoad={() => setIsLoading(false)}
                onError={() => {
                    setIsError(true);
                    setIsLoading(false);
                }}
            />
        </div>
    );
};

export default ChatImage;
