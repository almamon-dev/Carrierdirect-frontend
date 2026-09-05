import React from 'react';

export interface BulkImportModalProps {
    isOpen: boolean;
    onClose: () => void;
    importType?: 'pdf' | 'csv';
    setImportType?: (type: 'csv' | 'pdf') => void;
    processingStep: 1 | 2 | 3 | 4 | 5;
    setProcessingStep: (step: 1 | 2 | 3 | 4 | 5 | ((prev: 1 | 2 | 3 | 4 | 5) => 1 | 2 | 3 | 4 | 5)) => void;
    processingFileName: string;
    setProcessingFileName?: (name: string) => void;
    uploadedZipName?: string;
    setUploadedZipName?: (name: string) => void;
    extractedData: any;
    setExtractedData?: (data: any) => void;
    pdfInputRef: React.RefObject<HTMLInputElement | null>;
    zipInputRef: React.RefObject<HTMLInputElement | null>;
    onConfirmImport: () => void | Promise<void>;
    onOpenInForm: () => void;
}
