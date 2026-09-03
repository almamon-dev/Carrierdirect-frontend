import React from 'react';
import { FileArchive, Paperclip, Upload, X } from 'lucide-react';
import Button from '@/components/ui/button';

interface Step2ZipUploadProps {
    uploadedZipName: string;
    localZipSize: string;
    isDraggingZip: boolean;
    setIsDraggingZip: (val: boolean) => void;
    onZipSelect: (file: File) => void;
    onClearZip: (e?: React.MouseEvent) => void;
    internalZipInputRef: React.RefObject<HTMLInputElement | null>;
    zipInputRef: React.RefObject<HTMLInputElement | null>;
}

export const Step2ZipUpload: React.FC<Step2ZipUploadProps> = ({
    uploadedZipName,
    localZipSize,
    isDraggingZip,
    setIsDraggingZip,
    onZipSelect,
    onClearZip,
    internalZipInputRef,
    zipInputRef,
}) => {
    return (
        <div className="space-y-3 font-sans">
            <div
                onDragOver={(e) => {
                    e.preventDefault();
                    setIsDraggingZip(true);
                }}
                onDragLeave={() => setIsDraggingZip(false)}
                onDrop={(e) => {
                    e.preventDefault();
                    setIsDraggingZip(false);
                    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                        onZipSelect(e.dataTransfer.files[0]);
                    }
                }}
                className={`border-2 border-dashed rounded-lg p-4 text-center transition-all ${
                    isDraggingZip ? 'border-slate-400 bg-slate-100/70' : 'border-slate-300 bg-slate-50/50'
                }`}
            >
                <FileArchive size={22} className="text-slate-600 mx-auto mb-1.5" />
                <h4 className="font-semibold text-slate-800 text-xs mb-0.5">
                    Upload Optional ZIP Attachment Archive
                </h4>
                <p className="text-[11px] text-slate-500 max-w-sm mx-auto mb-2.5 leading-tight">
                    Optionally upload commercial invoices, cargo photos, or packing list ZIP attachments.
                </p>

                {uploadedZipName ? (
                    <div className="inline-flex items-center gap-2 bg-white px-3 py-1.5 rounded-md border border-slate-200 text-xs font-medium text-slate-900 shadow-2xs">
                        <Paperclip size={14} className="text-slate-600" />
                        <span>{uploadedZipName}</span>
                        {localZipSize && <span className="text-slate-500 font-normal text-2xs">({localZipSize})</span>}
                        <span className="text-slate-700 font-medium bg-slate-100 border border-slate-200 px-1.5 py-0.2 rounded text-[10px]">Attached ✓</span>
                        <button
                            type="button"
                            onClick={onClearZip}
                            title="Remove ZIP"
                            className="text-slate-400 hover:text-slate-700 p-0.5 rounded hover:bg-slate-100 transition-colors ml-0.5 cursor-pointer"
                        >
                            <X size={12} />
                        </button>
                    </div>
                ) : (
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-8 px-3 text-xs font-medium border-slate-300 text-slate-700 bg-white hover:bg-slate-50 cursor-pointer"
                        onClick={() => (internalZipInputRef.current || zipInputRef.current)?.click()}
                    >
                        <Upload size={13} className="mr-1 text-slate-600" />
                        <span>Select ZIP File</span>
                    </Button>
                )}
            </div>
        </div>
    );
};
