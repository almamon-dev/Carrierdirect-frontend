import { ExternalLink, Eye, FileText, X } from "lucide-react";
import React, { useState } from "react";

interface DocumentPreviewModalProps {
    doc: {
        title: string;
        type: string;
        url?: string | null;
    } | null;
    onClose: () => void;
}

export const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({ doc, onClose }) => {
    const [imageError, setImageError] = useState(false);
    if (!doc) return null;

    const isPdf = Boolean(
        doc.url?.toLowerCase().endsWith(".pdf") ||
        doc.url?.toLowerCase().includes(".pdf")
    );

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4 animate-in fade-in duration-150" onClick={onClose}>
            <div className="bg-white dark:bg-[#181a20] rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-lg p-5" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Eye size={15} className="text-[#FF4A1F]" />
                        <span>{doc.title}</span>
                    </h4>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                    >
                        <X size={16} />
                    </button>
                </div>

                <div className="py-4">
                    {doc.url ? (
                        isPdf ? (
                            <div className="space-y-3">
                                <iframe
                                    src={doc.url}
                                    title={doc.title}
                                    className="w-full h-80 rounded-lg border border-slate-200 dark:border-slate-800 bg-white"
                                />
                                <div className="text-center">
                                    <a
                                        href={doc.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 dark:bg-orange-950/40 text-[#FF4A1F] text-xs font-semibold rounded-lg hover:bg-orange-100 transition-colors"
                                    >
                                        <ExternalLink size={12} />
                                        <span>Open PDF in new tab</span>
                                    </a>
                                </div>
                            </div>
                        ) : imageError ? (
                            <div className="rounded-lg border border-slate-200 dark:border-slate-800 p-6 bg-slate-50 dark:bg-[#13161b] text-center">
                                <FileText size={32} className="text-slate-400 mx-auto mb-2" />
                                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">{doc.title}</p>
                                <a
                                    href={doc.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 mt-2 text-xs font-semibold text-[#FF4A1F]"
                                >
                                    <ExternalLink size={12} />
                                    <span>Open Document</span>
                                </a>
                            </div>
                        ) : (
                            <div className="rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 max-h-80 flex items-center justify-center bg-slate-50 dark:bg-slate-900">
                                <img
                                    src={doc.url}
                                    alt={doc.title}
                                    className="max-h-72 object-contain"
                                    onError={() => setImageError(true)}
                                />
                            </div>
                        )
                    ) : (
                        <div className="rounded-lg border border-slate-200 dark:border-slate-800 p-8 bg-slate-50 dark:bg-[#13161b] text-center">
                            <FileText size={36} className="text-slate-400 mx-auto mb-2" />
                            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">{doc.title}</p>
                            <p className="text-[11px] text-slate-400 mt-1">Uploaded document is under review.</p>
                        </div>
                    )}
                </div>

                <div className="flex justify-end pt-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded text-xs font-semibold cursor-pointer"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};
