import React from 'react';

export interface FileUploadProps {
    className?: string;
}

export default function FileUpload({ className = '' }: FileUploadProps) {
    return (
        <div className={`border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer ${className}`}>
            <span className="text-gray-500 text-sm">Click or drag file to this area to upload</span>
            <input type="file" className="hidden" />
        </div>
    );
}
