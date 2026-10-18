import { Check } from "lucide-react";
import React from "react";

export interface SubmittedDocItem {
    title: string;
    type: 'license_front' | 'license_back' | 'medical' | 'insurance';
    url?: string | null;
}

interface SubmittedDocumentsCardProps {
    documents: SubmittedDocItem[];
    onViewDoc: (doc: SubmittedDocItem) => void;
}

export const SubmittedDocumentsCard: React.FC<SubmittedDocumentsCardProps> = ({
    documents,
    onViewDoc,
}) => {
    return (
        <div className="border border-slate-200/90 dark:border-slate-800 rounded-md p-5 sm:p-6 bg-white dark:bg-[#1a1f26] shadow-2xs">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Submitted Documents
                </h3>
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                    {documents.length} {documents.length === 1 ? 'file' : 'files'}
                </span>
            </div>

            <div className="space-y-3">
                {documents.map((doc) => (
                    <div
                        key={doc.type}
                        className="flex items-center justify-between gap-3 p-2.5 rounded-lg bg-slate-50/70 dark:bg-[#151921] border border-slate-100 dark:border-slate-800/80 hover:border-slate-200 dark:hover:border-slate-700 transition-colors"
                    >
                        <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-white shrink-0">
                                <Check size={12} strokeWidth={3} />
                            </div>
                            <div className="min-w-0">
                                <span className="text-xs sm:text-[13px] font-semibold text-slate-800 dark:text-slate-200 truncate block">
                                    {doc.title}
                                </span>
                                {doc.url && (
                                    <span className="text-[10px] text-slate-400 dark:text-slate-500 truncate block">
                                        {doc.url.split('/').pop()}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center gap-2.5 shrink-0">
                            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded">
                                Uploaded
                            </span>
                            <button
                                type="button"
                                onClick={() => onViewDoc(doc)}
                                className="px-3 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md transition-colors cursor-pointer"
                            >
                                View
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
