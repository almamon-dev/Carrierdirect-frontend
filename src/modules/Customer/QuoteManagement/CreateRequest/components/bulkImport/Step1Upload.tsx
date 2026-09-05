import React from 'react';
import { Step1GuideColumn } from './Step1GuideColumn';
import { Step1Dropzone } from './Step1Dropzone';

interface Step1UploadProps {
    isCsvMode: boolean;
    processingFileName: string;
    localFileSize: string;
    isDraggingMain: boolean;
    isProcessingFile: boolean;
    setIsDraggingMain: (val: boolean) => void;
    onFileSelect: (file: File) => void;
    onClearFile: () => void;
    onOpenAllowedValuesGuide: () => void;
    internalFileInputRef: React.RefObject<HTMLInputElement | null>;
    pdfInputRef: React.RefObject<HTMLInputElement | null>;
}

export const Step1Upload: React.FC<Step1UploadProps> = ({
    isCsvMode,
    processingFileName,
    localFileSize,
    isDraggingMain,
    isProcessingFile,
    setIsDraggingMain,
    onFileSelect,
    onClearFile,
    onOpenAllowedValuesGuide,
    internalFileInputRef,
    pdfInputRef,
}) => {
    return (
        <div className="space-y-4 py-1 font-sans">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                <Step1GuideColumn
                    isCsvMode={isCsvMode}
                    onOpenAllowedValuesGuide={onOpenAllowedValuesGuide}
                />
                <Step1Dropzone
                    isCsvMode={isCsvMode}
                    processingFileName={processingFileName}
                    localFileSize={localFileSize}
                    isDraggingMain={isDraggingMain}
                    isProcessingFile={isProcessingFile}
                    setIsDraggingMain={setIsDraggingMain}
                    onFileSelect={onFileSelect}
                    onClearFile={onClearFile}
                    internalFileInputRef={internalFileInputRef}
                    pdfInputRef={pdfInputRef}
                />
            </div>
        </div>
    );
};
