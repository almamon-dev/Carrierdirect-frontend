import React from 'react';
import { FileText, Download, ChevronDown, ChevronUp } from 'lucide-react';
import { getAttachmentUrl } from '@/modules/Customer/QuoteManagement/Negotiation/Chat/utils/customerChatUtils';
import { AttachmentItem } from '../index';

interface DocumentsListProps {
    docItems: AttachmentItem[];
    mediaItemsCount: number;
    showAllDocs: boolean;
    setShowAllDocs: (show: boolean) => void;
    initialDocsLimit?: number;
}

export const DocumentsList: React.FC<DocumentsListProps> = ({
    docItems,
    mediaItemsCount,
    showAllDocs,
    setShowAllDocs,
    initialDocsLimit = 3,
}) => {
    if (docItems.length === 0) return null;

    const displayedDocs = showAllDocs ? docItems : docItems.slice(0, initialDocsLimit);
    const hiddenDocsCount = docItems.length - initialDocsLimit;

    const getDocBadge = (name: string) => {
        const lower = name.toLowerCase();
        if (lower.endsWith('.pdf')) return { light: 'bg-rose-50 text-rose-500' };
        if (lower.endsWith('.xls') || lower.endsWith('.xlsx') || lower.endsWith('.csv')) return { light: 'bg-emerald-50 text-emerald-600' };
        if (lower.endsWith('.doc') || lower.endsWith('.docx')) return { light: 'bg-blue-50 text-blue-600' };
        if (lower.endsWith('.zip') || lower.endsWith('.rar')) return { light: 'bg-amber-50 text-amber-600' };
        return { light: 'bg-slate-100 text-slate-600' };
    };

    return (
        <div>
            {mediaItemsCount > 0 && (
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

            {docItems.length > initialDocsLimit && (
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
    );
};
