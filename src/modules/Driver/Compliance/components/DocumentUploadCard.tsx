import { ExternalLink, Eye, FileText, RotateCcw, Trash2, UploadCloud, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface DocumentUploadCardProps {
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    iconBg?: string;
    badge?: string;
    isRequired?: boolean;
    preview: string | null;
    fileName: string;
    fileSize: string;
    inputRef: React.RefObject<HTMLInputElement | null>;
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onRemove: () => void;
    accept?: string;
    uploadLabel?: string;
    uploadSubtitle?: string;
    error?: string;
}

export const DocumentUploadCard: React.FC<DocumentUploadCardProps> = ({
    title,
    subtitle,
    icon,
    iconBg = "bg-orange-100/80 dark:bg-orange-950/80 text-[#FF4A1F]",
    badge,
    isRequired = false,
    preview,
    fileName,
    fileSize,
    inputRef,
    onFileChange,
    onRemove,
    accept = ".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf",
    uploadLabel = "Upload File",
    uploadSubtitle = "JPG, PNG or PDF (Max 10MB)",
    error,
}) => {
    const [imageError, setImageError] = useState(false);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    useEffect(() => {
        setImageError(false);
    }, [preview, fileName]);

    const isPdf = Boolean(
        fileName?.toLowerCase().endsWith(".pdf") ||
        (typeof preview === "string" && (preview.toLowerCase().endsWith(".pdf") || preview.toLowerCase().includes(".pdf")))
    );

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onFileChange(e);
        if (e.target) e.target.value = "";
    };

    return (
        <div
            className={`border rounded-xl p-3 bg-white dark:bg-[#1a1f26] flex flex-col justify-between transition-colors shadow-2xs ${
                error
                    ? "border-red-500 bg-red-50/10 dark:bg-red-950/20"
                    : "border-slate-200/90 dark:border-slate-800 hover:border-[#FF4A1F]/50"
            }`}
        >
            <div>
                {/* Header: Icon, Title, Badge */}
                <div className="flex items-start gap-2">
                    <div className={`w-6 h-6 rounded-md ${iconBg} flex items-center justify-center shrink-0 mt-0.5`}>
                        {icon}
                    </div>
                    <div className="min-w-0">
                        <div className="flex items-center gap-1">
                            <span className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                                {title}
                            </span>
                            {isRequired && <span className="text-red-500 font-bold text-xs">*</span>}
                            {badge && (
                                <span className="text-[9.5px] font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.2 rounded ml-1">
                                    {badge}
                                </span>
                            )}
                        </div>
                        <p className="text-[10px] text-slate-400 truncate mt-0.5">
                            {subtitle}
                        </p>
                    </div>
                </div>

                {/* Preview or Upload Dropzone */}
                {preview ? (
                    <div
                        onClick={() => setIsPreviewOpen(true)}
                        className="relative rounded-lg overflow-hidden border border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-[#13161b] h-28 my-2.5 p-1 flex items-center justify-center cursor-pointer group"
                        title="Click to view full preview"
                    >
                        {isPdf || imageError ? (
                            <div className="w-full h-full bg-slate-50 dark:bg-[#1b2028] p-2 flex flex-col items-center justify-center text-center rounded select-none border border-slate-200/80 dark:border-slate-700">
                                <div className="w-9 h-9 rounded-lg bg-red-100/80 dark:bg-red-950/70 text-red-600 dark:text-red-400 flex items-center justify-center mb-1 shadow-2xs group-hover:scale-105 transition-transform">
                                    <FileText size={20} />
                                </div>
                                <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 truncate max-w-[130px]" title={fileName}>
                                    {fileName || "PDF Document"}
                                </span>
                                <div className="flex items-center gap-1 mt-0.5">
                                    <span className="text-[9px] font-bold text-red-500 uppercase tracking-wider bg-red-50 dark:bg-red-950/40 px-1 py-0.2 rounded">
                                        PDF
                                    </span>
                                    {fileSize && <span className="text-[9px] text-slate-400">• {fileSize}</span>}
                                </div>
                                <div className="mt-1 text-[9.5px] text-[#FF4A1F] font-semibold flex items-center gap-0.5">
                                    <Eye size={10} />
                                    <span>Preview PDF</span>
                                </div>
                            </div>
                        ) : (
                            <>
                                <img
                                    src={preview}
                                    alt={title}
                                    className="w-full h-full object-cover rounded"
                                    onError={() => setImageError(true)}
                                />
                                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[11px] font-medium transition-opacity gap-1 backdrop-blur-2xs rounded">
                                    <Eye size={14} />
                                    <span>Preview</span>
                                </div>
                            </>
                        )}

                        {/* Circular Remove (X) Button */}
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                onRemove();
                            }}
                            className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-slate-800/80 hover:bg-slate-900 text-white flex items-center justify-center cursor-pointer transition-colors shadow-xs z-20"
                            title="Remove file"
                        >
                            <X size={11} />
                        </button>
                    </div>
                ) : (
                    <div
                        onClick={() => inputRef.current?.click()}
                        className="h-28 rounded-lg border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-[#FF4A1F]/60 bg-slate-50/50 dark:bg-[#14181f] flex flex-col items-center justify-center cursor-pointer transition-all my-2.5 p-2 text-center group"
                    >
                        <UploadCloud size={20} className="text-slate-400 group-hover:text-[#FF4A1F] transition-colors" />
                        <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mt-1">
                            {uploadLabel}
                        </span>
                        <span className="text-[9.5px] text-slate-400">
                            {uploadSubtitle}
                        </span>
                    </div>
                )}

                {/* File Name & Size */}
                {preview && fileName && (
                    <div className="mb-2">
                        <p className="text-[10.5px] font-semibold text-slate-700 dark:text-slate-300 truncate" title={fileName}>
                            {fileName}
                        </p>
                        {fileSize && (
                            <p className="text-[9.5px] text-slate-400">
                                {fileSize}
                            </p>
                        )}
                    </div>
                )}

                {/* Error message */}
                {error && (
                    <p className="text-[10px] text-red-500 font-semibold mb-1">
                        {error}
                    </p>
                )}
            </div>

            {/* Action buttons row: Preview, Change & Remove */}
            {preview && (
                <div className="flex items-center gap-1.5 pt-1.5 border-t border-slate-100 dark:border-slate-800">
                    <button
                        type="button"
                        onClick={() => setIsPreviewOpen(true)}
                        className="py-1 px-2 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded text-[11px] font-medium flex items-center justify-center gap-1 cursor-pointer transition-colors"
                        title="View preview"
                    >
                        <Eye size={11} />
                        <span>View</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => inputRef.current?.click()}
                        className="py-1 px-2.5 border border-orange-200/80 dark:border-orange-900/60 bg-white dark:bg-[#1f242d] hover:bg-orange-50/50 dark:hover:bg-orange-950/30 text-[#FF4A1F] rounded text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors shadow-2xs"
                    >
                        <RotateCcw size={11} />
                        <span>Change</span>
                    </button>
                    <button
                        type="button"
                        onClick={onRemove}
                        className="py-1 px-2 border border-slate-200 dark:border-slate-700 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 dark:hover:text-red-400 text-slate-600 dark:text-slate-300 rounded text-[11px] font-medium flex items-center justify-center gap-1 cursor-pointer transition-colors ml-auto"
                        title="Remove"
                    >
                        <Trash2 size={11} />
                    </button>
                </div>
            )}

            <input
                ref={inputRef}
                type="file"
                accept={accept}
                className="hidden"
                onChange={handleInputChange}
            />

            {/* Full-view Preview Modal / Lightbox */}
            {isPreviewOpen && preview && createPortal(
                <div
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/75 backdrop-blur-xs p-4 animate-in fade-in duration-150"
                    onClick={() => setIsPreviewOpen(false)}
                >
                    <div
                        className="bg-white dark:bg-[#181a20] rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-150"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-[#13161b]">
                            <div className="flex items-center gap-2 min-w-0">
                                <span className="font-bold text-sm text-slate-900 dark:text-white truncate">
                                    {title}
                                </span>
                                {fileName && (
                                    <span className="text-xs text-slate-400 truncate max-w-[200px]">
                                        ({fileName})
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                <a
                                    href={preview}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-1.5 text-slate-500 hover:text-[#FF4A1F] hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
                                    title="Open in new window"
                                >
                                    <ExternalLink size={16} />
                                </a>
                                <button
                                    type="button"
                                    onClick={() => setIsPreviewOpen(false)}
                                    className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors cursor-pointer"
                                    title="Close"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div className="p-4 overflow-auto flex-1 flex items-center justify-center bg-slate-100/50 dark:bg-[#111317] min-h-[350px]">
                            {isPdf ? (
                                <iframe
                                    src={preview}
                                    title={fileName || title}
                                    className="w-full h-[500px] rounded-lg border border-slate-200 dark:border-slate-800 bg-white"
                                />
                            ) : (
                                <img
                                    src={preview}
                                    alt={title}
                                    className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-sm"
                                    onError={() => setImageError(true)}
                                />
                            )}
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between px-5 py-2.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-[#13161b]">
                            <span className="text-xs text-slate-400">
                                {fileSize ? `Size: ${fileSize}` : "Document Preview"}
                            </span>
                            <div className="flex items-center gap-2">
                                <a
                                    href={preview}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-[#FF4A1F] hover:bg-orange-50 dark:hover:bg-orange-950/30 rounded transition-colors"
                                >
                                    <ExternalLink size={12} />
                                    <span>Open Original</span>
                                </a>
                                <button
                                    type="button"
                                    onClick={() => setIsPreviewOpen(false)}
                                    className="px-3.5 py-1.5 text-xs font-semibold bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 rounded transition-colors cursor-pointer"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};
