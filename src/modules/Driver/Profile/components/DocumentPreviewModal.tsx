import React from 'react';
import { X, FileText, Download, CheckCircle2, ExternalLink, ShieldCheck } from 'lucide-react';
import Button from '@/components/ui/button';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    fileUrl: string;
    fileType?: string;
    verifiedBy?: string;
}

export const DocumentPreviewModal: React.FC<Props> = ({
    isOpen,
    onClose,
    title,
    fileUrl,
    fileType = 'PDF Document',
    verifiedBy = 'FMCSA Compliance Verification',
}) => {
    if (!isOpen) return null;

    const fileName = fileUrl.split('/').pop() || 'document.pdf';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-lg shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-[#161a22]">
                    <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8.5 h-8.5 rounded-md bg-orange-50 dark:bg-orange-950/40 text-[#ff4a1f] flex items-center justify-center shrink-0">
                            <FileText size={17} />
                        </div>
                        <div className="min-w-0">
                            <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">
                                {title}
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                {fileType}
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Content Body */}
                <div className="p-5 space-y-4">
                    {/* Verified Banner */}
                    <div className="flex items-center justify-between p-3 bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 rounded-md">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                            <span className="text-xs sm:text-[13px] font-semibold text-emerald-800 dark:text-emerald-300">
                                {verifiedBy}
                            </span>
                        </div>
                        <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100/80 dark:bg-emerald-900/60 px-2 py-0.5 rounded-[3px]">
                            Verified & Active
                        </span>
                    </div>

                    {/* Document Meta box */}
                    <div className="p-4 bg-slate-50 dark:bg-[#161a22] border border-slate-200 dark:border-slate-800 rounded-md space-y-2 text-xs sm:text-[13px]">
                        <div className="flex justify-between items-center py-1 border-b border-slate-200/60 dark:border-slate-800">
                            <span className="text-slate-500 dark:text-slate-400">File Name:</span>
                            <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">{fileName}</span>
                        </div>
                        <div className="flex justify-between items-center py-1 border-b border-slate-200/60 dark:border-slate-800">
                            <span className="text-slate-500 dark:text-slate-400">File Path:</span>
                            <span className="font-mono text-xs text-slate-600 dark:text-slate-400 truncate max-w-[260px]">{fileUrl}</span>
                        </div>
                        <div className="flex justify-between items-center py-1">
                            <span className="text-slate-500 dark:text-slate-400">Security:</span>
                            <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                                <ShieldCheck size={14} className="text-blue-500" />
                                Encrypted Carrier Direct Storage
                            </span>
                        </div>
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-[#161a22]">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={onClose}
                        className="h-8 px-3.5 text-xs sm:text-[13px]"
                    >
                        Close
                    </Button>
                    <a
                        href={fileUrl}
                        download={fileName}
                        target="_blank"
                        rel="noreferrer"
                        className="h-8 px-3.5 text-xs sm:text-[13px] font-bold bg-[#ff4a1f] hover:bg-[#e03e15] text-white rounded-[3px] flex items-center gap-1.5 transition-colors shadow-2xs"
                    >
                        <Download size={14} />
                        <span>Download Document</span>
                    </a>
                </div>
            </div>
        </div>
    );
};
