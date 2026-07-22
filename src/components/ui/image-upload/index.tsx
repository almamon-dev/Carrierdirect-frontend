import React from 'react';

export interface ImageUploadProps {
    className?: string;
}

export default function ImageUpload({ className = '' }: ImageUploadProps) {
    return (
        <div className={`border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer ${className}`}>
            <span className="text-4xl mb-2 text-gray-400">🖼️</span>
            <span className="text-gray-500 text-sm">Upload Image</span>
            <input type="file" accept="image/*" className="hidden" />
        </div>
    );
}
