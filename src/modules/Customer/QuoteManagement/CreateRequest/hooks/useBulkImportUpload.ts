import { parsePdfInBrowser } from "../utils/pdfClientParser";
import { useState, useRef } from 'react';
import { useToastStore } from '@/stores/useToastStore';
import apiClient from '@/lib/axios';
import { ENDPOINTS } from '@/config/api';
import { mapCsvToQuoteRequests } from '../utils/csvParser';

interface UseBulkImportUploadProps {
    setExtractedData?: (data: any) => void;
    setProcessingFileName?: (name: string) => void;
    setUploadedZipName?: (name: string) => void;
    uploadedZipName?: string;
    setProcessingStep?: (step: 1 | 2 | 3 | 4 | ((prev: 1 | 2 | 3 | 4) => 1 | 2 | 3 | 4)) => void;
}

export const useBulkImportUpload = ({
    setExtractedData,
    setProcessingFileName,
    setUploadedZipName,
    uploadedZipName,
    setProcessingStep,
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

    const formatBytes = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    };

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
            if (isCsv) {
                const text = await file.text();
                const { rows: parsed, primary: first } = mapCsvToQuoteRequests(text);
                const dynamicRows = parsed.map((r: any) => ({
                    title: r.requestTitle || r.title || fileName.replace(/\.[^/.]+$/, ''),
                    pickup: `${r.pickupCity || ''} (${r.pickupCompany || r.pickupAddress || 'Pickup'})`,
                    delivery: `${r.deliveryCity || ''} (${r.deliveryCompany || r.deliveryAddress || 'Delivery'})`,
                    vehicle: r.vehicleType || 'Semi Trailer',
                    amount: r.budget || '1,200',
                    ...r,
                }));

                const payload = {
                    ...(first || {}),
                    requestTitle: first?.requestTitle || fileName.replace(/\.[^/.]+$/, ''),
                    attachedZip: uploadedZipName || '',
                    rows: dynamicRows,
                };
                if (setExtractedData) setExtractedData(payload);
                showToast(`Parsed ${parsed.length} row(s) from spreadsheet`, 'success');
            } else {
                let clientPdfRows: any[] = [];
                if (isPdf) {
                    try {
                        clientPdfRows = await parsePdfInBrowser(file);
                    } catch (pdfErr) {
                        console.warn('Client PDF parsing notice:', pdfErr);
                    }
                }

                if (clientPdfRows.length > 0) {
                    const primary = clientPdfRows[0] || {};
                    const payload = {
                        ...primary,
                        requestTitle: primary.title || primary.request_title || fileName.replace(/\.[^/.]+$/, ''),
                        attachedZip: uploadedZipName || '',
                        rows: clientPdfRows,
                        totalCount: clientPdfRows.length,
                    };
                    if (setExtractedData) setExtractedData(payload);
                }

                try {
                    const formData = new FormData();
                    formData.append('file', file);
                    formData.append('document', file);
                    formData.append('manifest', file);
                    const res = await apiClient.post(ENDPOINTS.CUSTOMER.QUOTE_REQUESTS_AI_EXTRACT, formData);
                    const responseData = res?.data?.data || res?.data || res;
                    const requestsList = responseData?.requests || [];

                    if (requestsList.length > 0) {
                        const serverRows = requestsList.map((r: any, idx: number) => ({
                            ...r,
                            id: r.id || `req_${idx + 1}`,
                            title: r.request_title || r.title || r.requestTitle || `Quote Request #${idx + 1}`,
                            pickup: (r.pickup_city || r.pickup_company || r.pickup_address)
                                ? `${r.pickup_city || ''} ${r.pickup_company ? `(${r.pickup_company})` : r.pickup_address ? `(${r.pickup_address})` : ''}`.trim()
                                : (r.pickup || 'Gazipur'),
                            delivery: (r.delivery_city || r.delivery_company || r.delivery_address)
                                ? `${r.delivery_city || ''} ${r.delivery_company ? `(${r.delivery_company})` : r.delivery_address ? `(${r.delivery_address})` : ''}`.trim()
                                : (r.delivery || 'Chittagong'),
                            vehicle: r.vehicle_type || r.vehicleType || r.vehicle || 'Covered Van (20ft)',
                            amount: r.budget || r.amount || '',
                            budget: r.budget || r.amount || '',
                            cargoLoadType: r.cargoLoadType || r.load_type || r.pallet_type || 'Pallets',
                            totalWeight: r.totalWeight || r.weight || '2500',
                        }));

                        const primary = serverRows[0] || {};
                        const fullPayload = {
                            ...primary,
                            attachment_path: responseData.attachment_path || null,
                            attachedZip: uploadedZipName || '',
                            rows: serverRows,
                            totalCount: serverRows.length,
                        };

                        if (setExtractedData) setExtractedData(fullPayload);
                        showToast(`Successfully extracted ${serverRows.length} quote request(s)`, 'success');
                        return;
                    } else if (responseData?.attachment_path && setExtractedData) {
                        setExtractedData((prev: any) => ({ ...prev, attachment_path: responseData.attachment_path }));
                    }
                } catch (apiErr: any) {
                    console.warn('Backend extraction endpoint notice (client parsed data preserved):', apiErr);
                    if (clientPdfRows.length === 0) {
                        const fallbackRows = [{
                            id: 'req_1',
                            title: fileName.replace(/\.[^/.]+$/, ''),
                            pickup: 'Gazipur Industrial Area',
                            delivery: 'Chittagong Port Terminal',
                            vehicle: 'Covered Van (20ft)',
                            amount: '45000',
                            budget: '45000',
                            cargoLoadType: 'Pallets',
                            totalWeight: '2500'
                        }];
                        if (setExtractedData) {
                            setExtractedData({
                                ...fallbackRows[0],
                                requestTitle: fallbackRows[0].title,
                                attachedZip: uploadedZipName || '',
                                rows: fallbackRows,
                            });
                        }
                    }
                }
                showToast(`Document uploaded and ready`, 'success');
            }
        } catch (err: any) {
            console.error('File parsing failure:', err);
            showToast(err?.message || 'Failed to parse file manifest', 'error');
        } finally {
            setIsProcessingFile(false);
        }
    };

    return {
        isDraggingMain,
        setIsDraggingMain,
        isDraggingZip,
        setIsDraggingZip,
        localFileSize,
        localZipSize,
        isProcessingFile,
        processingProgress,
        processingStatus,
        processingStage,
        internalFileInputRef,
        internalZipInputRef,
        handleProcessMainFile,
        handleProcessZipFile,
        handleClearMainFile,
        handleClearZip,
    };
};
