import React from 'react';
import { ExternalLink, Globe } from 'lucide-react';
import { LinkPreviewData } from './chatLinkUtils';

export const LinkPreviewCard: React.FC<{ preview: LinkPreviewData }> = ({ preview }) => (
    <a
        href={preview.url}
        target="_blank"
        rel="noreferrer"
        onClick={(e) => e.stopPropagation()}
        className="mt-2.5 block rounded-lg border border-slate-200/90 dark:border-slate-700/80 bg-slate-50/70 dark:bg-slate-800/60 overflow-hidden hover:border-[#FF4A1F]/50 transition-all text-left shadow-2xs group/link"
    >
        {preview.image && (
            <div className="w-full h-32 bg-slate-200 dark:bg-slate-700 overflow-hidden relative">
                <img
                    src={preview.image}
                    alt={preview.title}
                    className="w-full h-full object-cover group-hover/link:scale-105 transition-transform duration-300"
                    onError={(e) => { (e.currentTarget as HTMLElement).style.display = 'none'; }}
                />
            </div>
        )}
        <div className="p-2.5 space-y-1">
            <div className="flex items-center gap-1.5 text-[10.5px] font-bold text-slate-500 dark:text-slate-400">
                <Globe size={11} className="text-[#FF4A1F]" />
                <span className="truncate">{preview.domain}</span>
                <ExternalLink size={10} className="ml-auto opacity-0 group-hover/link:opacity-100 transition-opacity" />
            </div>
            <h4 className="text-[12px] font-bold text-slate-800 dark:text-slate-100 line-clamp-1 group-hover/link:text-[#FF4A1F] transition-colors leading-snug">
                {preview.title}
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                {preview.description}
            </p>
        </div>
    </a>
);
