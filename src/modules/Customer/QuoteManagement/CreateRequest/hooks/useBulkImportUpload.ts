import { useState, useRef } from 'react';
import { useToastStore } from '@/stores/useToastStore';
import { extractFileRequests } from '../services/fileExtractService';

interface UseBulkImportUploadProps {
    setExtractedData?: (data: any) => void;
    setProcessingFileName?: (name: string) => void;
    setUploadedZipName?: (name: string) => void;
    uploadedZipName?: string;
    setProcessingStep?: (step: 1 | 2 | 3 | 4 | 5 | ((prev: 1 | 2 | 3 | 4 | 5) => 1 | 2 | 3 | 4 | 5)) => void;
}

const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

export const useBulkImportUpload = ({
    setExtractedData,
    setProcessingFileName,
    setUploadedZipName,
    uploadedZipName,
}: UseBulkImportUploadProps) => {
    const showToast = useToastStore((state) => state.showToast);
    const [isDraggingMain, setIsDraggingMain] = useState(false);
    const [isDraggingZip, setIsDraggingZip] = useState(false);
    const [localFileSize, setLocalFileSize] = useState<string>('');
    const [localZipSize, setLocalZipSize] = useState<string>('');
    const [isProcessingFile, setIsProcessingFile] = useState(false);
    const [processingProgress, setProcessingProgress] = useState(0);
    const [processingStatus, setProcessingStatus] = useState('');
    const [processingStage, setProcessingStage] = useState(1);

    const internalFileInputRef = useRef<HTMLInputElement>(null);
    const internalZipInputRef = useRef<HTMLInputElement>(null);

    const handleClearMainFile = () => {
        if (setProcessingFileName) setProcessingFileName('');
        if (setExtractedData) setExtractedData(null);
        setLocalFileSize('');
        setProcessingProgress(0);
        setProcessingStatus('');
        setProcessingStage(1);
        if (internalFileInputRef.current) internalFileInputRef.current.value = '';
    };

    const handleClearZip = (e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        if (setUploadedZipName) setUploadedZipName('');
        setLocalZipSize('');
        if (internalZipInputRef.current) internalZipInputRef.current.value = '';
        showToast('ZIP file removed', 'info');
    };

    const handleProcessZipFile = (file: File) => {
        if (!file.name.toLowerCase().endsWith('.zip')) {
            showToast('Please select a valid .zip archive', 'error');
            return;
        }
        if (file.size > 50 * 1024 * 1024) {
            showToast('ZIP archive exceeds 50MB limit', 'error');
            return;
        }
        if (setUploadedZipName) setUploadedZipName(file.name);
        setLocalZipSize(formatBytes(file.size));
        showToast(`ZIP attachment added: ${file.name}`, 'success');
    };

    const handleProcessMainFile = async (file: File) => {
        const fileName = file.name;
        const isPdf = fileName.toLowerCase().endsWith('.pdf');
        const isCsv = fileName.toLowerCase().endsWith('.csv') || fileName.toLowerCase().endsWith('.xlsx') || fileName.toLowerCase().endsWith('.txt');

        if (!isPdf && !isCsv && !file.type.startsWith('image/')) {
            showToast('Please select a PDF, CSV, Excel or Image manifest', 'error');
            return;
        }

        if (setProcessingFileName) setProcessingFileName(fileName);
        setLocalFileSize(formatBytes(file.size));
        setIsProcessingFile(true);

        try {
            const { payload, count, isCsv: wasCsv } = await extractFileRequests(file, uploadedZipName);
            if (setExtractedData) setExtractedData(payload);
            if (wasCsv) {
                showToast(`Parsed ${count} row(s) from spreadsheet`, 'success');
            } else {
                showToast(count > 0 ? `Successfully extracted ${count} quote request(s)` : 'Document uploaded and ready', 'success');
            }
        } catch (err: any) {
            console.error('File parsing failure:', err);
            showToast(err?.message || 'Failed to parse file manifest', 'error');
        } finally {
            setIsProcessingFile(false);
        }
    };

    return {
        isDraggingMain, setIsDraggingMain, isDraggingZip, setIsDraggingZip,
        localFileSize, localZipSize, isProcessingFile,
        processingProgress, processingStatus, processingStage,
        internalFileInputRef, internalZipInputRef,
        handleProcessMainFile, handleProcessZipFile, handleClearMainFile, handleClearZip,
    };
};
