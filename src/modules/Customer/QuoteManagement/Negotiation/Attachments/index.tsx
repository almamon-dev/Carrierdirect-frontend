import React from 'react';
import { FileText, Image as ImageIcon, Video, FolderOpen, Download } from 'lucide-react';

export interface AttachmentItem {
    name: string;
    size: string;
    type?: string;
    url?: string;
}

export default function AttachmentsList({ items = [] }: { items?: AttachmentItem[] }) {
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

    const getIcon = (item: AttachmentItem) => {
        const name = item.name.toLowerCase();
        if (name.endsWith('.pdf')) {
            return (
                <div className="w-8 h-8 rounded-md bg-rose-50 flex items-center justify-center text-rose-500 shrink-0">
                    <FileText size={16} />
                </div>
            );
        }
        if (name.endsWith('.jpg') || name.endsWith('.jpeg') || name.endsWith('.png') || item.type === 'image') {
            return (
                <div className="w-8 h-8 rounded-md bg-emerald-50 flex items-center justify-center text-emerald-500 shrink-0">
                    <ImageIcon size={16} />
                </div>
            );
        }
        if (name.endsWith('.mp4') || name.endsWith('.mov') || item.type === 'video') {
            return (
                <div className="w-8 h-8 rounded-md bg-purple-50 flex items-center justify-center text-purple-500 shrink-0">
                    <Video size={16} />
                </div>
            );
        }
        return (
            <div className="w-8 h-8 rounded-md bg-blue-50 flex items-center justify-center text-blue-500 shrink-0">
                <FileText size={16} />
            </div>
        );
    };

    return (
        <div className="space-y-2.5 mt-1">
            {items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors group cursor-pointer border border-slate-100">
                    <div className="flex items-center gap-2.5 min-w-0">
                        {getIcon(item)}
                        <div className="min-w-0">
                            <p className="text-xs font-semibold text-slate-800 truncate group-hover:text-[#FF4A1F] transition-colors">{item.name}</p>
                            <p className="text-[10.5px] text-slate-400 mt-0.5">{item.size}</p>
                        </div>
                    </div>
                    {item.url && (
                        <a href={item.url} target="_blank" rel="noreferrer" className="p-1 text-slate-400 hover:text-[#FF4A1F] transition-colors shrink-0">
                            <Download size={14} />
                        </a>
                    )}
                </div>
            ))}
        </div>
    );
}
