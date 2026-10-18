import React from 'react';
import { Upload, CheckCircle2 } from 'lucide-react';

interface PODDropzoneProps {
    dragActive: boolean;
    selectedFile: File | null;
    onDragEnter: (e: React.DragEvent) => void;
    onDragLeave: (e: React.DragEvent) => void;
    onDragOver: (e: React.DragEvent) => void;
    onDrop: (e: React.DragEvent) => void;
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const PODDropzone: React.FC<PODDropzoneProps> = ({
    dragActive,
    selectedFile,
    onDragEnter,
    onDragLeave,
    onDragOver,
    onDrop,
    onFileChange,
}) => (
    <div
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={onDrop}
        className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
            dragActive ? 'border-[#ff4a1f] bg-orange-50/40 dark:bg-[#ff4a1f]/10' : 'border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30'
        }`}
    >
        <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={onFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        {selectedFile ? (
            <div className="space-y-1">
                <CheckCircle2 size={32} className="mx-auto text-emerald-500" />
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate max-w-xs mx-auto">{selectedFile.name}</p>
                <p className="text-[11px] text-slate-400">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB • Ready to upload</p>
            </div>
        ) : (
            <div className="space-y-1">
                <Upload size={28} className="mx-auto text-slate-400" />
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Click or drag & drop signed POD here</p>
                <p className="text-[11px] text-slate-400">Supports PDF, JPG, PNG up to 20MB</p>
            </div>
        )}
    </div>
);

export default PODDropzone;
