import React from 'react';
import { Step1Guidelines } from './Step1Guidelines';
import { Step2FileUpload } from './Step2FileUpload';
import { Step2ZipUpload } from './Step2ZipUpload';
import { Step3ColumnPreview } from './Step3ColumnPreview';
import { Step4Confirmation } from './Step4Confirmation';
import { openAllowedValuesGuideWindow } from './allowedValuesGuide';

interface BulkImportStepBodyProps {
    processingStep: 1 | 2 | 3 | 4 | 5;
    setProcessingStep: (step: 1 | 2 | 3 | 4 | 5 | ((prev: 1 | 2 | 3 | 4 | 5) => 1 | 2 | 3 | 4 | 5)) => void;
    isCsvMode: boolean;
    processingFileName: string;
    localFileSize: string;
    isDraggingMain: boolean;
    isProcessingFile: boolean;
    setIsDraggingMain: (val: boolean) => void;
    handleProcessMainFile: (file: File) => void;
    handleClearMainFile: () => void;
    internalFileInputRef: React.RefObject<HTMLInputElement | null>;
    pdfInputRef: React.RefObject<HTMLInputElement | null>;
    uploadedZipName: string;
    localZipSize: string;
    isDraggingZip: boolean;
    setIsDraggingZip: (val: boolean) => void;
    handleProcessZipFile: (file: File) => void;
    handleClearZip: () => void;
    internalZipInputRef: React.RefObject<HTMLInputElement | null>;
    zipInputRef: React.RefObject<HTMLInputElement | null>;
    extractedData: any;
    activeRequest: any;
    totalBatchBudget: number;
    dynamicOptions: {
        dynamicVehicleTypes: any[];
        dynamicLoadTypes: any[];
        dynamicServiceTypes: any[];
        dynamicPriorityTypes: any[];
    };
}

export const BulkImportStepBody: React.FC<BulkImportStepBodyProps> = ({
    processingStep,
    setProcessingStep,
    isCsvMode,
    processingFileName,
    localFileSize,
    isDraggingMain,
    isProcessingFile,
    setIsDraggingMain,
    handleProcessMainFile,
    handleClearMainFile,
    internalFileInputRef,
    pdfInputRef,
    uploadedZipName,
    localZipSize,
    isDraggingZip,
    setIsDraggingZip,
    handleProcessZipFile,
    handleClearZip,
    internalZipInputRef,
    zipInputRef,
    extractedData,
    activeRequest,
    totalBatchBudget,
    dynamicOptions,
}) => {
    return (
        <>
            {processingStep === 1 && (
                <Step1Guidelines
                    isCsvMode={isCsvMode}
                    onOpenAllowedValuesGuide={() => openAllowedValuesGuideWindow(dynamicOptions)}
                />
            )}
            {processingStep === 2 && (
                <Step2FileUpload
                    isCsvMode={isCsvMode}
                    processingFileName={processingFileName}
                    localFileSize={localFileSize}
                    isDraggingMain={isDraggingMain}
                    isProcessingFile={isProcessingFile}
                    setIsDraggingMain={setIsDraggingMain}
                    onFileSelect={handleProcessMainFile}
                    onClearFile={handleClearMainFile}
                    onBackToGuidelines={() => setProcessingStep(1)}
                    internalFileInputRef={internalFileInputRef}
                    pdfInputRef={pdfInputRef}
                />
            )}
            {processingStep === 3 && (
                <Step2ZipUpload
                    uploadedZipName={uploadedZipName}
                    localZipSize={localZipSize}
                    isDraggingZip={isDraggingZip}
                    setIsDraggingZip={setIsDraggingZip}
                    onZipSelect={handleProcessZipFile}
                    onClearZip={handleClearZip}
                    internalZipInputRef={internalZipInputRef}
                    zipInputRef={zipInputRef}
                />
            )}
            {processingStep === 4 && (
                <Step3ColumnPreview
                    extractedData={extractedData}
                    processingFileName={processingFileName}
                    activeRequest={activeRequest}
                    onBackToStep1={() => setProcessingStep(2)}
                />
            )}
            {processingStep === 5 && (
                <Step4Confirmation
                    extractedData={extractedData}
                    processingFileName={processingFileName}
                    localFileSize={localFileSize}
                    uploadedZipName={uploadedZipName}
                    localZipSize={localZipSize}
                    totalBatchBudget={totalBatchBudget}
                />
            )}
        </>
    );
};
